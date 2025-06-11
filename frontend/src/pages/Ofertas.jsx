/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { FaShoppingCart, FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ModalConfirmacion from "../components/ModalConfirmacion";

const ADMIN_EMAIL = "emanuelotero710@gmail.com";

function OfertaCard({ producto, addToCart, user, onDeleteClick }) {
  const [cantidad, setCantidad] = useState(1);
  const navigate = useNavigate();

  const precioFinal = producto.oferta
    ? producto.precio - (producto.descuento || 0)
    : producto.precio;

  useEffect(() => {
    if (producto.stock && cantidad > producto.stock) setCantidad(producto.stock);
    if ((producto.stock || 0) < 1) setCantidad(1);
  }, [producto.stock]);

  const handleAdd = () => {
    addToCart({
      ...producto,
      qty: cantidad,
      precio: precioFinal // se usa el precio con descuento si aplica
    });
    setCantidad(1);
  };

  return (
    <div className="relative bg-white rounded-3xl shadow-xl p-6 xs:p-8 flex flex-col items-center min-h-[430px] max-w-[420px] w-full">
      {user?.email === ADMIN_EMAIL && (
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <Link to={`/admin/productos/editar/${producto.id}`} className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-800 transition shadow">
            <FaEdit />
          </Link>
          <button onClick={() => onDeleteClick(producto.id)} className="bg-red-600 text-white p-2 rounded-full hover:bg-red-800 transition shadow">
            <FaTrash />
          </button>
        </div>
      )}

      <img src={producto.imagen} alt={producto.nombre} className="object-contain h-48 max-h-48 w-full mb-4" />
      <h3 className="text-xl font-extrabold text-center text-gray-900 mb-1">{producto.nombre}</h3>
      <p className="text-sm text-gray-500 text-center line-clamp-2">{producto.descripcion}</p>

      <div className="mt-2 text-center">
        <span className="text-green-700 text-2xl font-bold block">
          ${precioFinal.toLocaleString("es-CO")}
        </span>
        {producto.oferta && (
          <div className="text-sm text-gray-400 line-through">
            ${producto.precio.toLocaleString("es-CO")}
            <span className="ml-2 text-pink-600 bg-pink-100 px-2 py-1 rounded-full text-xs font-bold">Oferta</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 mt-auto pt-5">
        <button
          onClick={() => setCantidad(Math.max(1, cantidad - 1))}
          disabled={cantidad <= 1 || producto.stock <= 0}
          className="w-8 h-8 rounded-full bg-gray-100 border-2 border-gray-300 text-lg font-bold text-yellow-600"
        >-</button>
        <span className="text-yellow-700 font-extrabold text-lg px-4 py-1 bg-yellow-50 border-2 border-yellow-300 rounded-xl">
          {cantidad}
        </span>
        <button
          onClick={() => setCantidad(Math.min((producto.stock || 1), cantidad + 1))}
          disabled={cantidad >= producto.stock}
          className="w-8 h-8 rounded-full bg-gray-100 border-2 border-gray-300 text-lg font-bold text-yellow-600"
        >+</button>
        {(producto.stock || 0) > 0 ? (
          <button
            onClick={handleAdd}
            className="bg-yellow-400 hover:bg-yellow-500 text-white p-3 rounded-full ml-2 shadow-lg"
            title="Agregar al carrito"
          >
            <FaShoppingCart />
          </button>
        ) : (
          <span className="ml-2 px-3 py-2 text-sm font-bold text-red-600 bg-red-100 rounded-lg">AGOTADO</span>
        )}
      </div>
      <div className="text-xs text-gray-500 mt-1">{producto.stock > 0 ? `Disponibles: ${producto.stock}` : ""}</div>
    </div>
  );
}

export default function Ofertas() {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { addToCart } = useCart();
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchOfertas = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("oferta", true)
        .order("creado_en", { ascending: false });
      if (!error) setOfertas(data || []);
      setLoading(false);
    };
    fetchOfertas();
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    await supabase.from("productos").delete().eq("id", deleteId);
    setOfertas((prev) => prev.filter((p) => p.id !== deleteId));
    setDeleteId(null);
    setDeleteLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl xs:text-4xl font-extrabold text-center text-yellow-700 mb-10 flex items-center justify-center gap-3">
        <span role="img" aria-label="🎉">🎉</span> Ofertas Especiales
      </h1>

      {loading ? (
        <div className="text-center text-xl font-semibold">Cargando...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 place-items-center">
          {ofertas.length === 0 ? (
            <div className="text-gray-600 col-span-full">No hay productos en oferta actualmente.</div>
          ) : (
            ofertas.map((p) => (
              <OfertaCard
                key={p.id}
                producto={p}
                user={user}
                addToCart={addToCart}
                onDeleteClick={setDeleteId}
              />
            ))
          )}
        </div>
      )}

      <ModalConfirmacion
        abierto={!!deleteId}
        mensaje="¿Seguro que deseas eliminar esta oferta?"
        confirmText={deleteLoading ? "Eliminando..." : "Eliminar"}
        cancelText="Cancelar"
        onConfirmar={handleDeleteConfirm}
        onCancelar={() => setDeleteId(null)}
        loading={deleteLoading}
      />
    </div>
  );
}
