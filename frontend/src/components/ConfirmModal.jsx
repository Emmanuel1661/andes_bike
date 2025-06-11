// Modal de confirmación para eliminar o aprobar acciones
export default function ConfirmModal({
  abierto,
  titulo = "Confirmar eliminación",
  mensaje = "¿Deseas eliminar este producto?",
  confirmText = "Eliminar",
  cancelText = "Cancelar",
  onConfirmar,
  onCancelar,
  loading = false,
}) {
  // Si el modal no está abierto, no se muestra nada
  if (!abierto) return null;

  return (
    // Fondo overlay blur y centro pantalla
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fondo blanco semitransparente con desenfoque */}
      <div className="absolute inset-0 bg-white bg-opacity-70 backdrop-blur-sm"></div>

      {/* Contenido del modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-4 xs:p-8 max-w-xs xs:max-w-sm w-[90vw] text-center z-10 border-2 border-yellow-400">
        <h2 className="text-base xs:text-xl font-bold mb-1 xs:mb-2 text-yellow-700">{titulo}</h2>
        <div className="mb-4 xs:mb-6 text-gray-800 text-sm xs:text-base">{mensaje}</div>
        <div className="flex flex-col xs:flex-row justify-center gap-3 xs:gap-4">
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 xs:px-5 py-2 rounded-xl font-semibold transition shadow"
            onClick={onConfirmar}
            disabled={loading}
          >
            {loading ? "Eliminando..." : confirmText}
          </button>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 xs:px-5 py-2 rounded-xl font-semibold transition shadow"
            onClick={onCancelar}
            disabled={loading}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}
