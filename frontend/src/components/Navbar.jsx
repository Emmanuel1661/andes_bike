import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthModal from './AuthModal'

export default function Navbar() {
  // Estado para mostrar/ocultar el modal de autenticación (login)
  const [showModal, setShowModal] = useState(false)

  return (
    // Barra de navegación principal: fondo negro translúcido, padding y sombra
    <nav className="bg-black bg-opacity-70 text-white px-4 py-3 shadow-lg">
      {/* Contenedor: ancho máximo, responsive, flex para disposición de elementos */}
      <div className="max-w-7xl mx-auto flex flex-wrap md:flex-nowrap items-center justify-between gap-y-3">
        
        {/* -------- LOGO / TÍTULO -------- */}
        {/* Muestra el nombre de la tienda con estilos grandes y llamativos */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-yellow-400 drop-shadow-lg animate-pulse whitespace-nowrap">
          Andes Bike
        </h1>

        {/* -------- BARRA DE BÚSQUEDA -------- */}
        {/* Input de búsqueda: se adapta a cada tamaño de pantalla */}
        <input
          type="text"
          placeholder="Buscar productos..."
          className="
            px-3 py-2 rounded text-black w-full
            sm:w-64 md:w-72 lg:w-80
            focus:ring-2 focus:ring-yellow-400 border-none
            transition
            mb-2 md:mb-0
            "
        />

        {/* -------- ENLACES DE NAVEGACIÓN Y BOTÓN LOGIN -------- */}
        {/* Los links y el botón se alinean horizontalmente, con espacio y responsive */}
        <div className="
            flex flex-wrap items-center gap-3
            sm:gap-5 md:gap-6 lg:gap-8
            w-full md:w-auto
            justify-center md:justify-end
            ">
          {/* Enlaces a las páginas principales */}
          <Link to="/bicicletas" className="hover:text-yellow-400 font-semibold transition">Bicicletas</Link>
          <Link to="/accesorios" className="hover:text-yellow-400 font-semibold transition">Accesorios</Link>
          <Link to="/ropa" className="hover:text-yellow-400 font-semibold transition">Ropa</Link>
          <Link to="/repuestos" className="hover:text-yellow-400 font-semibold transition">Repuestos</Link>
          {/* Botón destacado para iniciar sesión */}
          <button
            onClick={() => setShowModal(true)}
            className="
              bg-yellow-400 text-black px-4 py-1.5 rounded font-bold
              hover:bg-yellow-500 transition
              shadow-md
              mt-2 md:mt-0
              "
          >
            Iniciar sesión
          </button>
        </div>
      </div>

      {/* -------- MODAL DE AUTENTICACIÓN -------- */}
      {/* Se muestra solo si showModal es true */}
      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </nav>
  )
}
