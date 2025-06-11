// src/utils/syncUsuario.js
import { supabase } from "../lib/supabaseClient";

/**
 * user: objeto que devuelve supabase.auth.getUser() o después de login/register
 */
export async function syncUsuario(user) {
  if (!user) return;

  // Busca si ya existe en tu tabla usuarios
  const { data: existe, error } = await supabase
    .from("usuarios")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Error buscando usuario:", error);
    return;
  }

  if (!existe) {
    // Inserta en tu tabla usuarios (con los datos que tengas)
    const { error: insertError } = await supabase.from("usuarios").insert([{
      id: user.id, // OJO: es el UID de Auth
      correo: user.email,
      nombre: user.user_metadata?.name || "",
      telefono: "", // O lo que tengas
    }]);
    if (insertError) {
      console.error("Error insertando usuario:", insertError);
    }
  }
}
