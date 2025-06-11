/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

export default function ModalConfirmacion({
  abierto,
  titulo = "Confirmar eliminación",
  mensaje = "¿Deseas eliminar este producto?",
  confirmText = "Eliminar",
  cancelText = "Cancelar",
  onConfirmar,
  onCancelar,
  loading = false
}) {
  if (!abierto) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-auto">
      {/* SIN bg-black ni bg-opacity */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.16 }}
        className="bg-white rounded-2xl shadow-2xl p-7 max-w-xs w-full text-center border-2 border-yellow-400"
      >
        <h2 className="text-xl font-bold mb-3 text-yellow-600">{titulo}</h2>
        <p className="mb-7 text-base text-gray-800">{mensaje}</p>
        <div className="flex justify-center gap-3">
          <button
            className={`bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-bold transition text-lg shadow focus:outline-none ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={onConfirmar}
            disabled={loading}
          >
            {loading ? "Eliminando..." : confirmText}
          </button>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-xl font-semibold transition text-lg shadow focus:outline-none"
            onClick={onCancelar}
            disabled={loading}
          >
            {cancelText}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
