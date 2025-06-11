// src/pages/ResetPassword.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMensaje("");
    setLoading(true);

    // Cambia la contraseña con el access token
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMensaje("Error: " + error.message);
      setSuccess(false);
    } else {
      setMensaje("¡Contraseña actualizada! Ahora puedes iniciar sesión.");
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-xl p-8 space-y-4">
        <h1 className="text-2xl font-bold text-center mb-4">Restablecer Contraseña</h1>
        <form onSubmit={handleResetPassword}>
          <input
            type="password"
            placeholder="Nueva contraseña"
            className="w-full p-2 mb-4 border rounded"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={success}
          />
          <button
            type="submit"
            className="bg-yellow-700 hover:bg-yellow-800 w-full py-2 rounded text-white font-semibold"
            disabled={loading || success}
          >
            {loading ? "Actualizando..." : "Actualizar contraseña"}
          </button>
        </form>
        {mensaje && (
          <div className="text-center text-sm mt-3 text-blue-700">
            {mensaje}
            {success && (
              <div className="mt-4 flex flex-col items-center">
                <button
                  className="bg-yellow-700 hover:bg-yellow-800 text-white font-semibold py-2 px-6 rounded-xl transition mt-2"
                  onClick={() => navigate("/login")}
                >
                  Ir a iniciar sesión
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
