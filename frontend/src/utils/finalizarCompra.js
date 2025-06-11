import { supabase } from "../lib/supabaseClient";

/**
 * Finaliza una compra: guarda pedido, detalles, factura,
 * actualiza stock y genera alerta de stock si corresponde.
 */
export default async function finalizarCompra({ user, cart, clearCart, direccionEnvio }) {
  if (!cart || !cart.length) {
    alert("Tu carrito está vacío.");
    return null;
  }
  if (!user?.id) {
    alert("Error: Tu usuario no es válido. Inicia sesión nuevamente.");
    return null;
  }

  // Valida que el usuario exista en la tabla usuarios
  const { data: usuarioDb, error: userDbError } = await supabase
    .from("usuarios")
    .select("id")
    .eq("id", user.id)
    .single();

  if (userDbError || !usuarioDb) {
    alert("Error: El usuario no existe en la base de datos. Por favor, regístrate de nuevo o contacta soporte.");
    console.error("userDbError:", userDbError);
    return null;
  }

  // Calcula el total
  const total = cart.reduce((sum, item) => sum + (item.precio * (item.qty || 1)), 0);

  // Limpieza de datos, evita undefined/nulos
  const pedidoData = {
    usuario_id: user.id,
    nombre_cliente: user.nombre || "",
    correo_cliente: user.correo || user.email || "",
    telefono_cliente: user.telefono || "",
    direccion_envio: direccionEnvio || user.direccion || "Sin dirección",
    metodo_pago: "QR",
    total,
    estado: "pendiente"
  };

  // 1. Guardar el pedido principal
  const { data: pedido, error: pedidoError } = await supabase
    .from("pedidos")
    .insert([pedidoData])
    .select()
    .single();

  if (pedidoError || !pedido) {
    alert("Error al guardar el pedido. Intenta nuevamente.\n" + (pedidoError?.message || ""));
    console.error("pedidoError", pedidoError);
    return null;
  }

  // 2. Guardar los detalles del pedido
  const detalles = cart.map(item => ({
    pedido_id: pedido.id,
    producto_id: item.id,
    cantidad: item.qty || 1,
    precio_unitario: item.precio
  }));

  const { error: detalleError } = await supabase
    .from("detalle_pedido")
    .insert(detalles);

  if (detalleError) {
    alert("Error al guardar los productos del pedido.\n" + (detalleError?.message || ""));
    console.error("detalleError", detalleError);
    return null;
  }

  // 3. Actualiza el stock y crea/actualiza alertas_stock
  for (const item of cart) {
    // 3a. Trae el stock actual
    const { data: producto, error: prodError } = await supabase
      .from("productos")
      .select("stock")
      .eq("id", item.id)
      .single();

    if (prodError || !producto) continue;

    const nuevoStock = (producto.stock || 0) - (item.qty || 1);
    // 3b. Actualiza el stock del producto
    await supabase
      .from("productos")
      .update({ stock: nuevoStock })
      .eq("id", item.id);

    // 3c. Busca si ya hay una alerta para ese producto
    const { data: alertaExistente } = await supabase
      .from("alertas_stock")
      .select("*")
      .eq("producto_id", item.id)
      .single();

    const umbral = (alertaExistente?.umbral) ?? 5; // por defecto 5

    // 3d. Si el stock <= umbral, activar alerta
    if (nuevoStock <= umbral) {
      if (alertaExistente) {
        await supabase
          .from("alertas_stock")
          .update({ alerta_activada: true })
          .eq("id", alertaExistente.id);
      } else {
        await supabase
          .from("alertas_stock")
          .insert([{ producto_id: item.id, umbral, alerta_activada: true }]);
      }
    } else {
      // Si el stock ya NO está bajo, desactiva la alerta si existía
      if (alertaExistente) {
        await supabase
          .from("alertas_stock")
          .update({ alerta_activada: false })
          .eq("id", alertaExistente.id);
      }
    }
  }

  // 4. Guardar la factura (registro en la tabla facturas)
  const { error: facturaError } = await supabase
    .from("facturas")
    .insert([{ pedido_id: pedido.id }]);

  if (facturaError) {
    alert("Error al registrar la factura. Intenta nuevamente.\n" + (facturaError?.message || ""));
    console.error("facturaError", facturaError);
    return null;
  }

  // 5. Limpiar carrito local
  clearCart();

  // 6. Retorna el pedido creado
  return pedido;
}
