// src/utils/supabaseErrorsES.js
export const supabaseErrorsES = {
  // ---------- Auth / rate-limit ----------
  'For security purposes, you can only request this after 18 seconds.':
    'Por seguridad debes esperar 18 s antes de volver a intentarlo.',
  'User already registered':
    'El correo ya está registrado. Inicia sesión o recupera tu contraseña.',

  // ---------- RLS ----------
  'new row violates row-level security policy for table "usuarios"':
    'No tienes permisos para crear tu perfil. Contacta al administrador.',

  // ---------- Validación ----------
  'Password should be at least 6 characters':
    'La contraseña debe tener al menos 6 caracteres.',

  // ---------- Login ----------
  'Invalid login credentials':
    'Correo o contraseña incorrectos.',
};

/**
 * Traduce el objeto de error de Supabase a un mensaje en español.
 * Si no hay traducción conocida, devuelve un mensaje genérico.
 * @param {import('@supabase/supabase-js').ApiError|false|null} error
 */
export function trSupabase(error) {
  if (!error) return '';
  return supabaseErrorsES[error.message] || 'Ocurrió un error inesperado.';
}
