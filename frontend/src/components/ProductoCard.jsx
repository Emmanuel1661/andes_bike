import { useState } from "react";
import { FaShoppingCart, FaHeart, FaRegHeart } from "react-icons/fa";
import { useFavoritos } from "../context/FavoritosContext";

/**
 *
 * Componente para mostrar la vista de un producto individual en el catálogo.
 * Adaptado 100% responsive,
 *   - producto: objeto de producto (debe tener nombre, precio, imágenes, etc)
 *   - onAddToCart: función a llamar al agregar al carrito
 *   - onClick: función para abrir el detalle
 *   - admin: boolean, si es true muestra botones de editar/eliminar
 *   - onEdit: función para editar producto (solo admin)
 *   - onDelete: función para eliminar producto (solo admin)
 */
export default function ProductoCard({ producto, onAddToCart, onClick, admin, onEdit, onDelete }) {
  const stock = producto.stock !== undefined ? Number(producto.stock) : 1;
  const [cantidad, setCantidad] = useState(1);

  const { favoritos, toggleFavorito } = useFavoritos();
  const esFavorito = favoritos.includes(producto.id);

  let imagenPrincipal = "https://via.placeholder.com/400x250?text=Producto";
  if (producto.imagenes && Array.isArray(producto.imagenes) && producto.imagenes.length > 0) {
    imagenPrincipal = producto.imagenes[0] || imagenPrincipal;
  } else if (producto.imagen) {
    imagenPrincipal = producto.imagen;
  }

  return (
    <div
      className={`
        relative bg-white rounded-3xl shadow-2xl flex flex-col items-center
        hover:scale-105 hover:shadow-3xl transition cursor-pointer
        min-h-[420px]
        w-full max-w-xs
        sm:max-w-sm
        md:max-w-md
        lg:max-w-lg
        p-4 sm:p-6 md:p-8
        m-auto
        mb-8
      `}
      onClick={onClick}
    >
      {/* Ícono de favorito */}
      <div
        className="absolute top-4 left-4 z-20 text-xl cursor-pointer"
        onClick={(e) => { e.stopPropagation(); toggleFavorito(producto.id); }}
      >
        {esFavorito ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-400" />}
      </div>

      {/* Imagen */}
      <div className="w-full h-52 sm:h-60 flex items-center justify-center bg-gray-100 rounded-xl mb-3 sm:mb-5 overflow-hidden">
        <img
          src={imagenPrincipal}
          alt={producto.nombre}
          className="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
          style={{ maxHeight: "230px" }}
        />
      </div>

      {/* Nombre */}
      <div className="font-extrabold text-lg sm:text-2xl md:text-3xl mb-1 text-neutral-900 text-center drop-shadow">
        {producto.nombre}
      </div>

      {/* Precio */}
      <div className="text-green-600 text-2xl sm:text-3xl font-bold mt-1 text-center drop-shadow">
        {Number(producto.precio).toLocaleString("es-CO")}
      </div>

      {/* Marca o tipo */}
      {producto.tipo && (
        <div className="text-sm sm:text-base text-yellow-600 font-semibold mt-2 text-center tracking-wide">
          {producto.tipo.toUpperCase()}
        </div>
      )}
      {producto.marca && !producto.tipo && (
        <div className="text-sm sm:text-base text-yellow-600 font-semibold mt-2 text-center tracking-wide">
          {producto.marca}
        </div>
      )}

      {/* Descripción */}
      {producto.descripcion && (
        <div className="text-gray-500 text-xs sm:text-sm text-center mt-1 mb-2 line-clamp-2 max-w-[95%]">
          {producto.descripcion}
        </div>
      )}

      {/* Selector de cantidad */}
      <div className="flex gap-2 items-center my-2">
        <button
          className="bg-gray-200 rounded-full p-2 hover:bg-gray-300"
          onClick={e => { e.stopPropagation(); setCantidad(c => Math.max(1, c - 1)); }}
          disabled={cantidad <= 1}
        >-</button>
        <span className="font-bold text-lg w-8 text-center">{cantidad}</span>
        <button
          className="bg-gray-200 rounded-full p-2 hover:bg-gray-300"
          onClick={e => { e.stopPropagation(); setCantidad(c => Math.min(stock, c + 1)); }}
          disabled={cantidad >= stock}
        >+</button>
      </div>

      {/* Stock disponible */}
      <div className="text-xs text-gray-500 mt-1 mb-1">
        {stock > 0 ? `Disponibles: ${stock}` : "Sin stock"}
      </div>

      {/* Botón carrito */}
      <button
        onClick={e => { e.stopPropagation(); onAddToCart({ ...producto, qty: cantidad }); setCantidad(1); }}
        className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full p-3 shadow-lg transition"
        title="Agregar al carrito"
        disabled={stock === 0}
      >
        <FaShoppingCart size={24} />
      </button>

      {/* Botones admin */}
      {admin && (
        <div className="flex gap-2 mt-4">
          <button
            className="text-blue-600 underline font-bold hover:text-blue-900"
            onClick={e => { e.stopPropagation(); onEdit(producto.id); }}
          >Editar</button>
          <button
            className="text-red-600 underline font-bold hover:text-red-900"
            onClick={e => { e.stopPropagation(); onDelete(producto.id); }}
          >Eliminar</button>
        </div>
      )}
    </div>
  );
}
