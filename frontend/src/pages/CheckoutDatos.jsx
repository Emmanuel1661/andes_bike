// src/pages/CheckoutDatos.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import finalizarCompra from "../utils/finalizarCompra";
import { useCart } from "../context/CartContext";
import { sendFacturaEmail } from "../utils/sendEmail";

const NEQUI_PHONE = "3016146956";

export default function CheckoutDatos() {
  const navigate = useNavigate();
  const { cart, user, clearCart, loadingCart } = useCart();

  const [form, setForm] = useState({
    nombre: user?.nombre || "",
    correo: user?.correo || user?.email || "",
    telefono: user?.telefono || "",
    direccion: user?.direccion || "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      nombre: user?.nombre || "",
      correo: user?.correo || user?.email || "",
      telefono: user?.telefono || "",
      direccion: user?.direccion || "",
    });
  }, [user]);

  if (loadingCart) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
        <div className="text-xl text-gray-600 font-bold animate-pulse">Cargando carrito...</div>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full space-y-6 text-center">
          <h1 className="text-2xl font-bold text-yellow-700 mb-2">¡Tu carrito está vacío!</h1>
          <button
            onClick={() => navigate("/")}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-5 py-2 rounded font-semibold"
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.correo || !form.telefono || !form.direccion) {
      setError("Completa todos los campos para continuar.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const cartToSend = cart.map(prod => ({
        ...prod,
        qty: prod.qty || 1,
      }));

      const pedido = await finalizarCompra({
        user: { ...user, ...form },
        cart: cartToSend,
        clearCart,
        direccionEnvio: form.direccion,
      });

      if (!pedido) {
        setLoading(false);
        setError("Hubo un error al procesar tu pedido. Intenta nuevamente.");
        return;
      }

      const total = cartToSend.reduce((acc, prod) => acc + prod.precio * (prod.qty || 1), 0);
      const datosFactura = {
        cliente: form,
        productos: cartToSend,
        total,
        fecha: new Date().toLocaleString(),
        pedidoId: pedido.id,
      };

      const params = {
        to_name: form.nombre,
        to_email: form.correo,
        order_id: pedido.id,
        productos: cartToSend
          .map(p => `${p.nombre} x${p.cantidad || p.qty || 1} ($${Number(p.precio).toLocaleString("es-CO")})`)
          .join(",\n"),
        total: total.toLocaleString("es-CO"),
        nequi_url: `https://recarga.nequi.com.co/bdigitalpsl/#!/redirect?phone=${NEQUI_PHONE}&value=${Math.round(total)}`,
        fecha: datosFactura.fecha,
        direccion: form.direccion,
        telefono: form.telefono,
      };

      try {
        await sendFacturaEmail(params);
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
      navigate("/factura", { state: { datosFactura } });
    } catch (err) {
      setLoading(false);
      setError("Hubo un error al procesar tu compra.");
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-xl w-full max-w-md sm:max-w-lg p-6 sm:p-8 animate-fade-in"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-yellow-700 mb-6">
          Datos para la Factura
        </h2>
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-center mb-3">{error}</div>
        )}
        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo"
          className="input"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="correo"
          placeholder="Correo electrónico"
          className="input"
          value={form.correo}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="telefono"
          placeholder="Teléfono"
          className="input"
          value={form.telefono}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          className="input"
          value={form.direccion}
          onChange={handleChange}
          required
        />

        {/* Botón principal */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"} text-white py-3 rounded-lg font-bold text-lg`}
        >
          {loading ? "Procesando..." : "Generar factura"}
        </button>

        {/* Botón para devolver */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition"
        >
          ← Devolver
        </button>
      </form>

      <style>{`
        .input {
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.75rem;
          border: 1px solid #e5e7eb;
          font-size: 1rem;
          color: #111827;
          margin-bottom: 0.75rem;
          outline: none;
        }
        .input:focus {
          border-color: #facc15;
          box-shadow: 0 0 0 2px rgba(234,179,8,.3);
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s cubic-bezier(.16,1.2,.52,1.11);
        }
      `}</style>
    </div>
  );
}
