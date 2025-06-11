// src/utils/stockAlert.js
import { supabase } from "../lib/supabaseClient";

// Activa o desactiva la alerta de stock bajo para un producto
export async function actualizarAlertaStock(productId, nuevoStock) {
  // Buscar alerta previa
  let { data: alerta } = await supabase
    .from("alertas_stock")
    .select("*")
    .eq("producto_id", productId)
    .single();

  const umbral = alerta?.umbral ?? 1;

  if (nuevoStock <= umbral) {
    if (alerta) {
      // Ya existe, activar alerta
      await supabase
        .from("alertas_stock")
        .update({ alerta_activada: true })
        .eq("producto_id", productId);
    } else {
      // No existe, crear alerta
      await supabase
        .from("alertas_stock")
        .insert([{ producto_id: productId, umbral, alerta_activada: true }]);
    }
  } else if (alerta && alerta.alerta_activada) {
    // Si el stock subió, desactivar alerta
    await supabase
      .from("alertas_stock")
      .update({ alerta_activada: false })
      .eq("producto_id", productId);
  }
}
