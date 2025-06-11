// src/components/Modal.jsx
export default function Modal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded shadow-md w-[90%] max-w-md text-black">
        <h3 className="text-xl font-bold mb-4">Bienvenido</h3>

        <button className="w-full bg-black text-white py-2 rounded mb-2 hover:bg-gray-800">
          Iniciar sesión
        </button>
        <button className="w-full bg-gray-200 py-2 rounded mb-2 hover:bg-gray-300">
          ¿Olvidaste tu contraseña?
        </button>
        <button className="w-full bg-lime-500 py-2 rounded mb-2 hover:bg-lime-600">
          Registrarse
        </button>
        <button className="w-full bg-red-600 text-white py-2 rounded mb-2 hover:bg-red-700">
          Administrador
        </button>
        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500 hover:underline"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
