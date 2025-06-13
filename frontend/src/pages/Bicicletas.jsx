/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { FaShoppingCart, FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useSearch } from "../context/SearchContext";
import ModalConfirmacion from "../components/ModalConfirmacion"; // Modal visual

const PAGE_SIZE = 6;
const ADMIN_EMAIL = "emanuelotero710@gmail.com";

// Tarjeta individual de bicicleta (responsive)
function BicicletaCard({ bici, addToCart, user, onDeleteClick }) {
  const [cantidad, setCantidad] = useState(1);

  // Agregar al carrito con la cantidad seleccionada
  const handleAddToCart = () => {
    addToCart({ ...bici, qty: cantidad });
    setCantidad(1);
  };

  // Ajusta cantidad según stock disponible
  useEffect(() => {
    if (bici.stock && cantidad > bici.stock) setCantidad(bici.stock);
    if ((bici.stock || 0) < 1) setCantidad(1);
  }, [bici.stock]);

  let imagenPrincipal = "https://via.placeholder.com/400x250?text=Bicicleta";
  if (bici.imagenes && Array.isArray(bici.imagenes) && bici.imagenes.length > 0) {
    imagenPrincipal = bici.imagenes[0] || imagenPrincipal;
  } else if (bici.imagen) {
    imagenPrincipal = bici.imagen;
  }

  return (
    <div
      className="
        relative bg-white rounded-3xl shadow-2xl p-6 xs:p-8 flex flex-col items-center
        hover:scale-105 hover:shadow-3xl transition cursor-pointer
        min-h-[410px] sm:min-h-[440px] max-w-[390px] sm:max-w-[420px] w-full
      "
    >
      {/* Botones de edición/eliminación para el admin */}
      {user && user.email === ADMIN_EMAIL && (
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <Link
            to={`/admin/productos/editar/${bici.id}`}
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
              onDeleteClick(bici.id);
            }}
            title="Eliminar"
          >
            <FaTrash size={18} />
          </button>
        </div>
      )}

      {/* Imagen, nombre, precio y tipo */}
      <Link to={`/bicicletas/${bici.id}`} className="w-full flex-1 flex flex-col">
        <div className="w-full h-56 xs:h-64 flex items-center justify-center bg-gray-100 rounded-xl mb-4 xs:mb-5 overflow-hidden">
          <img
            src={imagenPrincipal}
            alt={bici.nombre}
            className="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
            style={{ maxHeight: "240px" }}
          />
        </div>
        <div className="font-extrabold text-xl xs:text-2xl md:text-3xl mb-1 text-neutral-900 text-center drop-shadow">
          {bici.nombre}
        </div>
        <div className="text-green-600 text-2xl xs:text-3xl font-bold mt-1 text-center drop-shadow">
          {Number(bici.precio).toLocaleString("es-CO")}
        </div>
        <div className="text-base text-yellow-600 font-semibold mt-2 text-center tracking-wide">
          {bici.tipo && bici.tipo.toUpperCase()}
        </div>
      </Link>

      {/* Selector de cantidad y agregar al carrito */}
      <div className="flex items-center gap-2 justify-center mt-auto w-full pt-7 xs:pt-8">
        <button
          className="rounded-full w-8 h-8 xs:w-9 xs:h-9 flex items-center justify-center text-xl xs:text-2xl font-black
            bg-gradient-to-br from-gray-100 to-gray-300 border-2 border-gray-200 hover:border-yellow-500 shadow
            hover:scale-110 active:scale-95 transition-all duration-100 text-yellow-600"
          onClick={e => {
            e.stopPropagation();
            setCantidad((c) => Math.max(1, c - 1));
          }}
          disabled={cantidad <= 1 || (bici.stock || 0) === 0}
          aria-label="Menos"
        >-</button>
        <span className="bg-yellow-50 border-2 border-yellow-300 rounded-xl px-3 xs:px-4 py-1 text-lg xs:text-xl font-extrabold shadow text-yellow-700 flex items-center justify-center select-none">
          {cantidad}
        </span>
        <button
          className="rounded-full w-8 h-8 xs:w-9 xs:h-9 flex items-center justify-center text-xl xs:text-2xl font-black
            bg-gradient-to-br from-gray-100 to-gray-300 border-2 border-gray-200 hover:border-yellow-500 shadow
            hover:scale-110 active:scale-95 transition-all duration-100 text-yellow-600"
          onClick={e => {
            e.stopPropagation();
            setCantidad((c) => Math.min((bici.stock || 1), c + 1));
          }}
          disabled={cantidad >= (bici.stock || 1) || (bici.stock || 0) === 0}
          aria-label="Más"
        >+</button>
        {(bici.stock || 0) > 0 ? (
          <button
            onClick={handleAddToCart}
            className="bg-yellow-400 hover:bg-yellow-500 text-white rounded-full p-3 shadow-xl hover:scale-110 active:scale-95 transition-all duration-150 ml-2"
            title="Agregar al carrito"
            disabled={(bici.stock || 0) === 0}
          >
            <FaShoppingCart size={22} />
          </button>
        ) : (
          <span className="ml-2 text-red-600 font-bold text-base px-3 xs:px-4 py-2 bg-red-100 rounded-lg shadow animate-pulse">
            AGOTADO
          </span>
        )}
      </div>
      <div className="text-xs text-gray-500 mt-1 mb-1">
        {(bici.stock || 0) > 0 ? `Disponibles: ${bici.stock}` : ""}
      </div>
    </div>
  );
}

// Página principal de Bicicletas (grid y paginación responsive)
export default function Bicicletas() {
  const [bicicletas, setBicicletas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const { addToCart } = useCart();
  const [user, setUser] = useState(null);
  const { search } = useSearch();

  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchBicicletas = async () => {
      setLoading(true);
      setError("");
      let { data, error } = await supabase
        .from("productos")
        .select("id,nombre,precio,imagen,imagenes,tipo,especificaciones,categoria_id,stock")
        .in("categoria_id", [1, 2, 3])
        .order("id", { ascending: true });
      if (error) setError(error.message);
      else setBicicletas(data || []);
      setLoading(false);
    };
    fetchBicicletas();
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const bicicletasFiltradas = bicicletas.filter((bici) =>
    (
      bici.nombre +
      " " +
      (bici.tipo || "") +
      " " +
      (bici.especificaciones || "")
    )
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(bicicletasFiltradas.length / PAGE_SIZE));
  const pagedBicis = bicicletasFiltradas.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    await supabase.from("productos").delete().eq("id", deleteId);
    setBicicletas((prev) => prev.filter((p) => p.id !== deleteId));
    setDeleteId(null);
    setDeleteLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-2 xs:px-4 md:px-8">
      <h1 className="text-3xl xs:text-4xl font-extrabold mb-8 text-center text-yellow-600 drop-shadow">
        Bicicletas
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 xs:gap-10 md:gap-12 place-items-center w-full">
        {loading ? (
          <div className="col-span-3 text-2xl text-gray-700 font-semibold">Cargando bicicletas...</div>
        ) : error ? (
          <div className="col-span-3 text-red-600 text-lg">{error}</div>
        ) : pagedBicis.length === 0 ? (
          <div className="col-span-3 text-gray-500 text-lg">No hay bicicletas encontradas.</div>
        ) : (
          pagedBicis.map((bici) => (
            <BicicletaCard
              key={bici.id}
              bici={bici}
              addToCart={addToCart}
              user={user}
              onDeleteClick={setDeleteId}
            />
          ))
        )}
      </div>
      <ModalConfirmacion
        abierto={!!deleteId}
        mensaje="¿Deseas eliminar este producto?"
        confirmText={deleteLoading ? "Eliminando..." : "Eliminar"}
        cancelText="Cancelar"
        onConfirmar={handleDeleteConfirm}
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
}