// src/components/AuthModal.jsx
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AuthModal({ onClose }) {
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMsg, setResetMsg] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  // RECUPERACIÓN (solo modal)
  const handleReset = async (e) => {
    e.preventDefault();
    setResetMsg("");
    setResetError("");
    setResetLoading(true);

    // ENVÍA el enlace de recuperación
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: window.location.origin + "/reset-password"
    });

    if (error) {
      setResetError("Error: " + error.message);
    } else {
      setResetMsg("Si tu correo está registrado, recibirás el enlace para cambiar tu contraseña (revisa spam).");
    }
    setResetLoading(false);
  };

  // --- Modal recuperación ---
  if (showReset) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded shadow-lg w-96 text-black">
          <h2 className="text-xl font-bold mb-4">Recuperar contraseña</h2>
          <form onSubmit={handleReset}>
            <input
              type="email"
              placeholder="Correo registrado"
              className="w-full p-2 mb-4 border rounded"
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-yellow-700 text-white w-full py-2 rounded font-bold mb-2"
              disabled={resetLoading}
            >
              {resetLoading ? "Enviando..." : "Enviar enlace"}
            </button>
            {resetMsg && <div className="text-green-600 text-sm mb-2">{resetMsg}</div>}
            {resetError && <div className="text-red-600 text-sm mb-2">{resetError}</div>}
          </form>
          <button onClick={() => setShowReset(false)} className="mt-2 w-full text-sm text-blue-700 hover:underline">
            Volver
          </button>
          <button onClick={onClose} className="mt-4 w-full text-sm text-gray-600 hover:underline">Cerrar</button>
        </div>
      </div>
    );
  }

  // --- Modal login normal ---
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded shadow-lg w-96 text-black">
        <h2 className="text-xl font-bold mb-4">Iniciar Sesión</h2>
        {/* TU FORMULARIO DE LOGIN AQUÍ... */}
        <div className="text-sm text-center space-y-1">
          <p
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => setShowReset(true)}
          >
            ¿Olvidaste tu contraseña?
          </p>
          {/* ...más opciones */}
        </div>
        <button onClick={onClose} className="mt-4 w-full text-sm text-gray-600 hover:underline">Cerrar</button>
      </div>
    </div>
  );
}
