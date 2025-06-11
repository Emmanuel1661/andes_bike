/* eslint-disable no-unused-vars */
import { supabase } from "../lib/supabaseClient";
import { actualizarAlertaStock } from "./stockAlert";

// Recibe array de productos [{ id, qty }]
export async function procesarCompraYStock(cart) {
  for (const item of cart) {
    // Traer stock actual
    const { data: prod, error } = await supabase
      .from("productos")
      .select("stock")
      .eq("id", item.id)
      .single();
    if (prod && prod.stock !== undefined) {
      const nuevoStock = Math.max(prod.stock - item.qty, 0);
      // Actualiza stock en productos
      await supabase
        .from("productos")
        .update({ stock: nuevoStock })
        .eq("id", item.id);
      // Llama función de alerta
      await actualizarAlertaStock(item.id, nuevoStock);
    }
  }
}
