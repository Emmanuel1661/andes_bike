// src/components/CartModal.jsx
import { useCart } from "../context/CartContext";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function CartModal({ isOpen = true, onClose }) {
  const { cart, removeFromCart, updateQty, clearCart, user } = useCart();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [stockAlert, setStockAlert] = useState(null);

  if (!isOpen) return null;

  const total = cart.reduce(
    (acc, item) => acc + item.precio * (item.qty || 1),
    0
  );

  const handleIrDatos = () => {
    if (!user) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2500);
      return;
    }
    onClose();
    navigate("/checkout-datos");
  };

  const handleUpdateQty = (item, change) => {
    const nuevaCantidad = (item.qty || 1) + change;
    if (nuevaCantidad < 1) return;

    // Solo mostrar alerta si el cambio es hacia arriba (+1) y supera el stock
    if (change > 0 && nuevaCantidad > item.stock) {
      setStockAlert("No hay más stock disponible");
      setTimeout(() => setStockAlert(null), 2200);
      return;
    }

    updateQty(item.id, nuevaCantidad);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black bg-opacity-60 flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-5 relative animate-fade-in pointer-events-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-700 hover:text-red-600 text-2xl font-black"
          aria-label="Cerrar"
        >
          ✕
        </button>

        <h2 className="text-xl font-extrabold mb-4 text-center text-yellow-700">
          Carrito de Compras
        </h2>

        {cart.length === 0 ? (
          <div className="text-gray-500 text-center text-lg">
            Tu carrito está vacío.
          </div>
        ) : (
          <>
            <ul className="space-y-3 mb-5 max-h-60 overflow-y-auto">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center bg-gray-50 rounded-xl p-3 shadow gap-3"
                >
                  <img
                    src={item.imagen || "https://via.placeholder.com/80"}
                    alt={item.nombre}
                    className="w-14 h-14 object-contain rounded bg-white border"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-sm text-gray-800">
                      {item.nombre}
                    </div>
                    <div className="text-green-600 font-bold text-sm">
                      {Number(item.precio).toLocaleString("es-CO")}
                    </div>
                    {(item.qty || 1) > 1 && (
                      <div className="text-xs text-gray-600">
                        Cantidad: {item.qty} unidades
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      Subtotal:{" "}
                      <span className="font-semibold text-gray-700">
                        {(item.precio * (item.qty || 1)).toLocaleString("es-CO")}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Stock: {item.stock}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      className="w-7 h-7 flex justify-center items-center rounded-full bg-gray-200 hover:bg-yellow-400 text-yellow-600"
                      onClick={() => handleUpdateQty(item, -1)}
                      disabled={item.qty <= 1}
                    >
                      <FaMinus />
                    </button>
                    <span className="text-sm font-bold px-2">{item.qty || 1}</span>
                    <button
                      className="w-7 h-7 flex justify-center items-center rounded-full bg-gray-200 hover:bg-yellow-400 text-yellow-600"
                      onClick={() => handleUpdateQty(item, 1)}
                    >
                      <FaPlus />
                    </button>
                    <button
                      className="text-red-600 hover:bg-red-100 rounded-full p-2 ml-1"
                      onClick={() => removeFromCart(item.id)}
                      title="Eliminar"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex justify-between items-center mt-2 mb-4">
              <span className="text-lg font-extrabold text-gray-800">Total:</span>
              <span className="text-xl font-bold text-green-600">
                {total.toLocaleString("es-CO")}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl py-3 transition"
                onClick={handleIrDatos}
              >
                Finalizar compra
              </button>
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl py-3 font-bold"
                onClick={clearCart}
              >
                Vaciar
              </button>
            </div>
          </>
        )}

        {showAlert && (
          <div className="fixed left-1/2 -translate-x-1/2 top-8 bg-yellow-500 text-white px-6 py-3 rounded-xl shadow-lg font-bold text-lg z-[100] border-2 border-yellow-700 animate-fade-toast">
            Inicia sesión para continuar con la compra
          </div>
        )}
        {stockAlert && (
          <div className="fixed left-1/2 -translate-x-1/2 top-24 bg-red-600 text-white px-5 py-2 rounded-xl shadow-lg font-bold text-lg z-[100] border-2 border-red-700 animate-fade-toast">
            {stockAlert}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(-30px);} to { opacity: 1; transform: translateY(0);} }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
        @keyframes fade-toast { from { opacity: 0; transform: translateY(-10px);} to { opacity: 1; transform: translateY(0);} }
        .animate-fade-toast { animation: fade-toast 0.3s ease-out; }
      `}</style>
    </div>
  );
}
