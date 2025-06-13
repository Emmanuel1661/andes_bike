import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Bicicletas from "./pages/Bicicletas";
import ProductoDetalle from "./pages/ProductoDetalle";
import Accesorios from "./pages/Accesorios";
import Repuestos from "./pages/Repuestos";
import Ropa from "./pages/Ropa";
import SearchResults from "./pages/SearchResults";
import Home from "./pages/Home";
import Ofertas from "./pages/Ofertas";
import RealidadAumentada from "./pages/RealidadAumentada";
import ARView from "./pages/ARView2";
import ARRedirect from "./pages/ARRedirect";
import ResetPassword from "./pages/ResetPassword";
import CheckoutDatos from "./pages/CheckoutDatos";
import Factura from "./pages/Factura";
import Contacto from "./pages/contacto";
import Perfil from "./pages/Perfil";
import AdminPanel from "./pages/AdminPanel";
import AdminProductoNuevo from "./pages/AdminProductoNuevo";
import AdminProductoEditar from "./pages/AdminProductoEditar";
import AdminProductos3D from "./pages/AdminProductos3D";
import WhatsAppButton from "./components/WhatsAppButton";
import ModalConfirmacion from "./components/ModalConfirmacion";

const ADMIN_EMAIL = "emanuelotero710@gmail.com";

export default function App() {
  const [searchGlobal, setSearchGlobal] = useState("");
  const [modalEliminar, setModalEliminar] = useState({
    abierto: false,
    onConfirmar: null,
  });

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  const abrirModalEliminar = (onConfirmar) =>
    setModalEliminar({ abierto: true, onConfirmar });
  const cerrarModalEliminar = () =>
    setModalEliminar({ abierto: false, onConfirmar: null });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <Header
        searchGlobal={searchGlobal}
        setSearchGlobal={setSearchGlobal}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/outlet"
          element={
            <main className="max-w-6xl mx-auto py-6 px-2 text-center bg-white rounded-2xl shadow-lg">
              <Ofertas />
            </main>
          }
        />

        <Route
          path="/bicicletas"
          element={
            <main className="max-w-6xl mx-auto py-6 px-2 text-center bg-white rounded-2xl shadow-lg">
              <Bicicletas abrirModalEliminar={abrirModalEliminar} />
            </main>
          }
        />
        <Route
          path="/bicicletas/:id"
          element={
            <main className="max-w-6xl mx-auto py-6 px-2 text-center bg-white rounded-2xl shadow-lg">
              <ProductoDetalle />
            </main>
          }
        />

        <Route
          path="/accesorios"
          element={
            <main className="max-w-6xl mx-auto py-6 px-2 text-center bg-white rounded-2xl shadow-lg">
              <Accesorios abrirModalEliminar={abrirModalEliminar} />
            </main>
          }
        />
        <Route
          path="/repuestos"
          element={
            <main className="max-w-6xl mx-auto py-6 px-2 text-center bg-white rounded-2xl shadow-lg">
              <Repuestos />
            </main>
          }
        />
        <Route
          path="/ropa"
          element={
            <main className="max-w-6xl mx-auto py-6 px-2 text-center bg-white rounded-2xl shadow-lg">
              <Ropa />
            </main>
          }
        />

        <Route
          path="/producto/:id"
          element={
            <main className="max-w-6xl mx-auto py-6 px-2 text-center bg-white rounded-2xl shadow-lg">
              <ProductoDetalle />
            </main>
          }
        />

        <Route
          path="/realidad-aumentada"
          element={
            <main className="max-w-6xl mx-auto py-6 px-2 text-center bg-white rounded-2xl shadow-lg">
              <RealidadAumentada />
            </main>
          }
        />

        {/* ← Aquí cambié :modelo por :id */}
        <Route
          path="/ar-view/:id"
          element={
            <main className="max-w-6xl mx-auto py-6 px-2 text-center bg-white rounded-2xl shadow-lg">
              <ARView />
            </main>
          }
        />

        <Route
          path="/ar-redirect/:id"
          element={
            <main className="max-w-6xl mx-auto py-6 px-2 text-center bg-white rounded-2xl shadow-lg">
              <ARRedirect />
            </main>
          }
        />

        <Route
          path="/buscar"
          element={
            <main className="max-w-6xl mx-auto py-6 px-2 text-center bg-white rounded-2xl shadow-lg">
              <SearchResults search={searchGlobal} />
            </main>
          }
        />

        <Route
          path="/checkout-datos"
          element={
            <main className="max-w-6xl mx-auto py-6 px-2 text-center bg-white rounded-2xl shadow-lg">
              <CheckoutDatos />
            </main>
          }
        />
        <Route
          path="/factura"
          element={
            <main className="max-w-6xl mx-auto py-6 px-2 text-center bg-white rounded-2xl shadow-lg">
              <Factura />
            </main>
          }
        />
        <Route
          path="/contacto"
          element={
            <main className="max-w-6xl mx-auto py-6 px-2 text-center bg-white rounded-2xl shadow-lg">
              <Contacto />
            </main>
          }
        />
        <Route
          path="/reset-password"
          element={
            <main className="max-w-6xl mx-auto py-6 px-2 text-center bg-white rounded-2xl shadow-lg">
              <ResetPassword />
            </main>
          }
        />
        <Route
          path="/perfil"
          element={
            <main className="max-w-6xl mx-auto py-6 px-2 text-center bg-white rounded-2xl shadow-lg">
              <Perfil />
            </main>
          }
        />

        {/* Rutas admin */}
        <Route
          path="/admin"
          element={
            user?.email === ADMIN_EMAIL ? (
              <AdminPanel />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/productos/nuevo"
          element={
            user?.email === ADMIN_EMAIL ? (
              <AdminProductoNuevo />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/productos/editar/:id"
          element={
            user?.email === ADMIN_EMAIL ? (
              <AdminProductoEditar />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/productos3d"
          element={
            user?.email === ADMIN_EMAIL ? (
              <AdminProductos3D />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="*"
          element={
            <main className="max-w-6xl mx-auto py-6 px-2 text-center bg-white rounded-2xl shadow-lg">
              <div className="text-3xl font-bold mt-20 mb-10">
                Página no encontrada
              </div>
              <a href="/" className="underline text-blue-600">
                Ir al inicio
              </a>
            </main>
          }
        />
      </Routes>

      <WhatsAppButton />

      <ModalConfirmacion
        abierto={modalEliminar.abierto}
        mensaje="¿Deseas eliminar este producto?"
        onConfirmar={() => {
          modalEliminar.onConfirmar?.();
          cerrarModalEliminar();
        }}
        onCancelar={cerrarModalEliminar}
      />
    </div>
  );
}

