/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  UserCircle2,
  Heart,
  ShoppingCart,
  Menu,
  LogOut,
  User,
  Clock,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import LoginModal from "./LoginModal";
import { useCart } from "../context/CartContext";
import CartModal from "./CartModal";

export default function Header({ searchGlobal, setSearchGlobal }) {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { cart } = useCart();
  const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    setSearchGlobal("");
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle("modal-open", showLogin || showCart);
    return () => document.body.classList.remove("modal-open");
  }, [showLogin, showCart]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload();
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="bg-black text-white px-4 sm:px-6 md:px-8 py-4 md:py-8 shadow-xl border-b border-yellow-700/30 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-screen-2xl mx-auto gap-3 md:gap-0">
        {/* Logo */}
        <div className="flex flex-col items-center md:items-start">
          <Link to="/" className="focus:outline-none group">
            <span className="text-4xl xs:text-5xl sm:text-5xl md:text-6xl font-extrabold tracking-widest italic drop-shadow-2xl bg-gradient-to-r from-yellow-400 via-yellow-600 to-yellow-400 bg-clip-text text-transparent animate-gradient-move group-hover:scale-105 group-hover:brightness-125 transition duration-150 cursor-pointer">
              Andes<span className="text-white bg-none">Bike</span>
            </span>
          </Link>
          <span className="text-sm sm:text-base text-yellow-100 mt-1 tracking-wide drop-shadow">
            pedalea con pasión
          </span>
        </div>

        {/* Search bar */}
        <div className="w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mt-3 md:mt-0 flex-shrink">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchGlobal}
              onChange={(e) => {
                setSearchGlobal(e.target.value);
                if (e.target.value.length > 0) navigate("/buscar");
              }}
              className="w-full px-4 sm:px-6 py-3 sm:py-5 rounded-xl text-black outline-none text-base sm:text-xl shadow-lg border-2 border-yellow-300 focus:border-yellow-500 transition"
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchGlobal.length > 0) navigate("/buscar");
              }}
            />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-600 w-6 h-6 sm:w-7 sm:h-7"
              onClick={() => {
                if (searchGlobal.length > 0) navigate("/buscar");
              }}
              tabIndex={-1}
              aria-label="Buscar"
            >
              <Search />
            </button>
          </div>
        </div>

        {/* User and icons */}
        <div className="flex items-center gap-4 xs:gap-7 md:gap-12 mt-3 md:mt-0 relative">
          {user ? (
            <div
              ref={dropdownRef}
              className="relative w-10" // Contenedor relativo para avatar
            >
              <div
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="bg-yellow-500 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center text-sm cursor-pointer hover:brightness-110 relative"
              >
                {getInitials(user.user_metadata?.nombre || user.user_metadata?.name || "Usuario")}
              </div>

              {dropdownOpen && (
                <div
                  className="
                    absolute mt-2
                    left-1/2 -translate-x-1/2
                    md:left-auto md:right-0 md:translate-x-0
                    w-[90vw] max-w-[240px] sm:w-60 bg-white text-black rounded-xl shadow-xl z-50
                  "
                  style={{ minWidth: "160px" }}
                >
                  <div className="px-4 py-2 font-semibold border-b">
                    {user.user_metadata?.nombre || user.user_metadata?.name}
                  </div>
                  <Link
                    to="/perfil"
                    className="flex items-center px-4 py-2 hover:bg-yellow-100 text-sm"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User className="w-4 h-4 mr-2" /> Perfil
                  </Link>
                  <Link
                    to="/mis-pedidos"
                    className="flex items-center px-4 py-2 hover:bg-yellow-100 text-sm"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Clock className="w-4 h-4 mr-2" /> Mis pedidos
                  </Link>
                  {user.email === "emanuelotero710@gmail.com" && (
                    <Link
                      to="/admin"
                      className="flex items-center px-4 py-2 hover:bg-yellow-100 text-sm"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2" /> Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 text-sm w-full"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <UserCircle2
              className="w-8 h-8 xs:w-10 xs:h-10 cursor-pointer hover:text-yellow-400 transition"
              title="Iniciar sesión"
              onClick={() => {
                setShowLogin(true);
                setShowCart(false);
              }}
            />
          )}

          <Heart className="w-8 h-8 xs:w-10 xs:h-10 cursor-pointer hover:text-yellow-400 transition" />

          <div className="relative">
            <ShoppingCart
              className="w-8 h-8 xs:w-10 xs:h-10 cursor-pointer hover:text-yellow-400 transition"
              onClick={() => {
                setShowCart(true);
                setShowLogin(false);
              }}
            />
            {totalQty > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 xs:w-6 xs:h-6 flex items-center justify-center font-bold shadow-md">
                {totalQty}
              </span>
            )}
          </div>

          <button
            className="md:hidden ml-1"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            <Menu className="w-8 h-8" />
          </button>
        </div>
      </div>

      <nav className="mt-4 border-t border-yellow-600/40 pt-3">
        <ul className="hidden md:flex items-center justify-center gap-8 lg:gap-20 text-base sm:text-lg lg:text-2xl font-extrabold uppercase tracking-widest">
          <li className="relative">
            <a href="/outlet" className="text-red-500 font-bold hover:scale-110 transition">
              OFFERS
            </a>
            <span className="absolute -top-3 -right-6 bg-red-600 text-white text-xs px-1 rounded shadow font-bold tracking-tight animate-bounce">
              OFERTAS
            </span>
          </li>
          <li>
            <a href="/bicicletas" className="hover:text-yellow-400">
              BICICLETAS
            </a>
          </li>
          <li>
            <a href="/accesorios" className="hover:text-yellow-400">
              ACCESORIOS
            </a>
          </li>
          <li>
            <a href="/repuestos" className="hover:text-yellow-400">
              REPUESTOS
            </a>
          </li>
          <li>
            <a href="/ropa" className="hover:text-yellow-400">
              ROPA
            </a>
          </li>
          <li>
            <a href="/realidad-aumentada" className="hover:text-yellow-400">
              REALIDAD AUMENTADA
            </a>
          </li>
          <li>
            <a href="/contacto" className="hover:text-yellow-400">
              CONTACTO
            </a>
          </li>
        </ul>

        <ul
          className={`flex md:hidden items-center gap-3 sm:gap-7 text-xs xs:text-sm sm:text-base font-extrabold uppercase tracking-widest overflow-x-auto no-scrollbar transition-all duration-200 ${
            menuOpen ? "max-h-64 py-2" : "max-h-0 overflow-hidden py-0"
          }`}
        >
          <li className="relative min-w-fit">
            <a href="/outlet" className="text-red-500 font-bold hover:scale-110 transition">
              SALIDA
            </a>
            <span className="absolute -top-3 -right-6 bg-red-600 text-white text-xs px-1 rounded shadow font-bold tracking-tight animate-bounce">
              OFERTA
            </span>
          </li>
          <li className="min-w-fit">
            <a href="/bicicletas" className="hover:text-yellow-400">
              BICICLETAS
            </a>
          </li>
          <li className="min-w-fit">
            <a href="/accesorios" className="hover:text-yellow-400">
              ACCESORIOS
            </a>
          </li>
          <li className="min-w-fit">
            <a href="/repuestos" className="hover:text-yellow-400">
              REPUESTOS
            </a>
          </li>
          <li className="min-w-fit">
            <a href="/ropa" className="hover:text-yellow-400">
              ROPA
            </a>
          </li>
          <li className="min-w-fit">
            <a href="/realidad-aumentada" className="hover:text-yellow-400">
              REALIDAD AUMENTADA
            </a>
          </li>
          <li className="min-w-fit">
            <a href="/contacto" className="hover:text-yellow-400">
              CONTACTO
            </a>
          </li>
        </ul>
      </nav>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showCart && <CartModal isOpen={true} onClose={() => setShowCart(false)} />}

      <style>
        {`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in {
            animation: fade-in 1.1s cubic-bezier(0.16, 1.2, 0.52, 1.11);
          }
          @keyframes gradient-move {
            0% {
              background-position: 0% 50%;
            }
            100% {
              background-position: 100% 50%;
            }
          }
          .animate-gradient-move {
            background-size: 200% 100%;
            animation: gradient-move 2s infinite alternate linear;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
    </header>
  );
}
