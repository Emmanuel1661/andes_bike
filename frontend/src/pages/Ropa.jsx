/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useCart } from "../context/CartContext";
import {
  FaShoppingCart,
  FaEdit,
  FaTrash,
  FaVenusMars,
  FaMars,
  FaVenus,
} from "react-icons/fa";
import ModalConfirmacion from "../components/ModalConfirmacion";

const ITEMS_PER_PAGE = 6;
const ADMIN_EMAIL = "emanuelotero710@gmail.com";

function getGeneroIcono(genero) {
  if (!genero) return null;
  if (genero.toLowerCase().includes("unisex")) return <FaVenusMars className="inline mr-1" />;
  if (genero.toLowerCase().includes("hombre")) return <FaMars className="inline mr-1" />;
  if (genero.toLowerCase().includes("mujer")) return <FaVenus className="inline mr-1" />;
  return null;
}

function RopaCard({ producto,addToCart,navigate,user,onEliminarClick }) {
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    if (producto.stock && cantidad > producto.stock) setCantidad(producto.stock);
    if ((producto.stock || 0) < 1) setCantidad(1);
  }, [producto.stock]);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({ ...producto, qty: cantidad });
    setCantidad(1);
  };

  const imagenPrincipal = producto.imagen || (producto.imagenes?.[0] || "https://via.placeholder.com/400x250?text=Ropa");

  return (
    <div
      className="relative bg-white rounded-3xl shadow-2xl p-6 xs:p-8 flex flex-col items-center hover:scale-105 hover:shadow-3xl transition cursor-pointer min-h-[410px] sm:min-h-[440px] max-w-[390px] sm:max-w-[420px] w-full"
      onClick={() => navigate(`/producto/${producto.id}`)}
    >
      {user && user.email === ADMIN_EMAIL && (
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <Link
            to={`/admin/productos/editar/${producto.id}`}
            className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-800 transition"
            onClick={e => e.stopPropagation()}
            title="Editar"
          >
            <FaEdit size={18} />
          </Link>
          <button
            className="bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-800 transition"
            onClick={e => {
              e.stopPropagation();
              onEliminarClick(producto.id);
            }}
            title="Eliminar"
          >
            <FaTrash size={18} />
          </button>
        </div>
      )}
      <div className="w-full h-56 xs:h-64 flex items-center justify-center bg-gray-100 rounded-xl mb-4 xs:mb-5 overflow-hidden">
        <img
          src={imagenPrincipal}
          alt={producto.nombre}
          className="object-contain w-full h-full hover:scale-110 transition duration-200"
          style={{ maxHeight: "240px" }}
          loading="lazy"
        />
      </div>
      <div className="font-extrabold text-xl xs:text-2xl md:text-3xl mb-1 text-neutral-900 text-center drop-shadow">
        {producto.nombre}
      </div>
      <div className="text-green-600 text-2xl xs:text-3xl font-bold mt-1 text-center drop-shadow">
        {Number(producto.precio).toLocaleString("es-CO")}
      </div>
      <div className="text-base text-yellow-600 font-semibold mt-2 text-center tracking-wide">
        {producto.marca}
      </div>
      <div className="mb-2 text-base text-gray-700 font-bold">
        {producto.genero && (
          <>
            {getGeneroIcono(producto.genero)}
            {producto.genero}
          </>
        )}
      </div>
      <div className="text-gray-500 text-sm xs:text-base text-center mb-1 line-clamp-2">
        {producto.descripcion}
      </div>
      <div className="flex items-center gap-2 justify-center mt-auto w-full pt-7 xs:pt-8">
        <button
          className="rounded-full w-8 h-8 xs:w-9 xs:h-9 flex items-center justify-center text-xl xs:text-2xl font-black bg-gradient-to-br from-gray-100 to-gray-300 border-2 border-gray-200 hover:border-yellow-500 shadow hover:scale-110 active:scale-95 transition-all duration-100 text-yellow-600"
          onClick={e => {
            e.stopPropagation();
            setCantidad((c) => Math.max(1, c - 1));
          }}
          disabled={cantidad <= 1 || (producto.stock || 0) === 0}
          aria-label="Menos"
        >-</button>
        <span className="bg-yellow-50 border-2 border-yellow-300 rounded-xl px-3 xs:px-4 py-1 text-lg xs:text-xl font-extrabold shadow text-yellow-700 flex items-center justify-center select-none">
          {cantidad}
        </span>
        <button
          className="rounded-full w-8 h-8 xs:w-9 xs:h-9 flex items-center justify-center text-xl xs:text-2xl font-black bg-gradient-to-br from-gray-100 to-gray-300 border-2 border-gray-200 hover:border-yellow-500 shadow hover:scale-110 active:scale-95 transition-all duration-100 text-yellow-600"
          onClick={e => {
            e.stopPropagation();
            setCantidad((c) => Math.min((producto.stock || 1), c + 1));
          }}
          disabled={cantidad >= (producto.stock || 1) || (producto.stock || 0) === 0}
          aria-label="Más"
        >+</button>
        <button
          onClick={handleAddToCart}
          className="bg-yellow-400 hover:bg-yellow-500 text-white rounded-full p-3 shadow-xl hover:scale-110 active:scale-95 transition-all duration-150 ml-2"
          title="Agregar al carrito"
          disabled={(producto.stock || 0) === 0}
        >
          <FaShoppingCart size={22} />
        </button>
      </div>
      <div className="text-xs text-gray-500 mt-1 mb-1">
        {(producto.stock || 0) > 0 ? `Disponibles: ${producto.stock}` : "Sin stock"}
      </div>
    </div>
  );
}

const Ropa = () => {
  const [ropa, setRopa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [user, setUser] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchRopa() {
      setLoading(true);
      const { data } = await supabase
        .from("productos")
        .select("*")
        .eq("tipo", "ropa");
      setRopa(data || []);
      setLoading(false);
    }
    fetchRopa();
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const totalPages = Math.max(1, Math.ceil(ropa.length / ITEMS_PER_PAGE));
  const productosPagina = ropa.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleEliminarConfirm = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    await supabase.from("productos").delete().eq("id", deleteId);
    setRopa((prev) => prev.filter((p) => p.id !== deleteId));
    setDeleteId(null);
    setDeleteLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-xl font-bold">
        Cargando ropa...
      </div>
    );
  }

  if (!ropa.length) {
    return (
      <div className="flex justify-center items-center h-96 text-xl font-bold">
        No hay productos de ropa disponibles.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-2 xs:px-4 md:px-8">
      <h1 className="text-3xl xs:text-4xl font-extrabold mb-8 text-center text-yellow-600 drop-shadow">
        Ropa
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 xs:gap-10 md:gap-12 place-items-center w-full">
        {productosPagina.map((producto) => (
          <RopaCard
            key={producto.id}
            producto={producto}
            addToCart={addToCart}
            navigate={navigate}
            user={user}
            onEliminarClick={setDeleteId}
          />
        ))}
      </div>
      <ModalConfirmacion
        abierto={!!deleteId}
        titulo="Confirmar eliminación"
        mensaje="¿Deseas eliminar este producto?"
        confirmText={deleteLoading ? "Eliminando..." : "Eliminar"}
        cancelText="Cancelar"
        onConfirmar={handleEliminarConfirm}
        onCancelar={() => setDeleteId(null)}
        loading={deleteLoading}
      />
      <div className="flex items-center justify-center mt-8 gap-8">
        <button
          className="rounded-full border-2 border-yellow-400 p-3 text-2xl font-bold transition disabled:opacity-40"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          &#8592;
        </button>
        <span className="text-lg xs:text-xl font-bold text-gray-700">
          Página {page} de {totalPages}
        </span>
        <button
          className="rounded-full border-2 border-yellow-400 p-3 text-2xl font-bold transition disabled:opacity-40"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages || totalPages === 0}
        >
          &#8594;
        </button>
      </div>
    </div>
  );
};

export default Ropa;
