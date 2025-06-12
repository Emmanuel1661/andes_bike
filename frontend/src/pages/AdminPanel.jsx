/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link } from "react-router-dom";
import AlertasStock from "./AlertasStock";

function EditFacturaModal({ factura, onClose, onSave }) {
  // Aquí va la implementación si la tienes
  return null; // placeholder
}

export default function AdminPanel() {
  const [tab, setTab] = useState("productos");
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [facturas, setFacturas] = useState([]);
  const [filtroFactura, setFiltroFactura] = useState("");
  const [loadingFacturas, setLoadingFacturas] = useState(false);
  const [editFactura, setEditFactura] = useState(null);

  useEffect(() => {
    if (tab === "productos") {
      setLoading(true);
      const fetchProductos = async () => {
        const { data } = await supabase.from("productos").select("*").order("id", { ascending: true });
        setProductos(data || []);
        setLoading(false);
      };
      fetchProductos();
    }
  }, [tab]);

  useEffect(() => {
    if (tab === "facturas") {
      setLoadingFacturas(true);
      supabase
        .from("facturas")
        .select(`
          id, fecha_emision, archivo_url,
          pedidos:pedido_id(
            id, total, creado_en, usuario_id,
            usuarios:usuario_id(nombre, correo)
          )
        `)
        .order("fecha_emision", { ascending: false })
        .then(({ data }) => {
          setFacturas(data || []);
          setLoadingFacturas(false);
        });
    }
  }, [tab]);

  const eliminarProducto = async (id) => {
    await supabase.from("productos").delete().eq("id", id);
    setProductos(productos.filter((p) => p.id !== id));
  };

  const eliminarFactura = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta factura? Esta acción no se puede deshacer.")) return;
    await supabase.from("facturas").delete().eq("id", id);
    setFacturas(facturas.filter((f) => f.id !== id));
  };

  const productosFiltrados = productos.filter((producto) =>
    (producto.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
      producto.id?.toLowerCase().includes(filtro.toLowerCase()) ||
      producto.tipo?.toLowerCase().includes(filtro.toLowerCase()))
  );

  const facturasFiltradas = facturas.filter((factura) => {
    const cliente = factura.pedidos?.usuarios?.nombre || "";
    const correo = factura.pedidos?.usuarios?.correo || "";
    const idFactura = factura.id || "";
    const idPedido = factura.pedidos?.id || "";
    return (
      cliente.toLowerCase().includes(filtroFactura.toLowerCase()) ||
      correo.toLowerCase().includes(filtroFactura.toLowerCase()) ||
      idFactura.toLowerCase().includes(filtroFactura.toLowerCase()) ||
      idPedido.toLowerCase().includes(filtroFactura.toLowerCase())
    );
  });

  const handleFacturaEditSave = (facturaActualizada) => {
    setFacturas(facturas =>
      facturas.map(f => (f.id === facturaActualizada.id ? facturaActualizada : f))
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 mt-12 mb-24 animate-fade-in">

      {/* Tabs */}
      <div className="flex gap-4 mb-8 justify-center flex-wrap">
        <button
          onClick={() => setTab("productos")}
          className={`px-5 py-2 rounded-t-lg font-bold border-b-4 ${tab === "productos"
            ? "border-yellow-500 bg-white text-yellow-800 shadow"
            : "border-transparent bg-gray-100 text-gray-500"
            } transition`}
        >
          Productos
        </button>
        <button
          onClick={() => setTab("facturas")}
          className={`px-5 py-2 rounded-t-lg font-bold border-b-4 ${tab === "facturas"
            ? "border-yellow-500 bg-white text-yellow-800 shadow"
            : "border-transparent bg-gray-100 text-gray-500"
            } transition`}
        >
          Facturas / Ventas
        </button>
        <button
          onClick={() => setTab("alertas")}
          className={`px-5 py-2 rounded-t-lg font-bold border-b-4 ${tab === "alertas"
            ? "border-yellow-500 bg-white text-yellow-800 shadow"
            : "border-transparent bg-gray-100 text-gray-500"
            } transition`}
        >
          Alertas Stock
        </button>
      </div>

      {/* Contenido */}
      {tab === "productos" && (
        <div>
          <h2 className="text-3xl font-bold mb-6 text-center">Panel de Administración</h2>
          <div className="flex justify-center mb-6">
            <Link
              to="/admin/productos/nuevo"
              className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              + Nuevo Producto
            </Link>
          </div>

          <div className="mb-4 flex justify-end">
            <input
              type="text"
              placeholder="Buscar por nombre, ID o tipo..."
              className="border px-3 py-2 rounded-lg w-full max-w-md"
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
            />
          </div>

          <div className="mb-4 text-gray-700 text-right font-semibold">
            Total productos: <span className="font-bold">{productosFiltrados.length}</span>
          </div>

          {loading ? (
            <div className="text-center py-6">Cargando productos...</div>
          ) : (
            <div className="overflow-x-auto rounded-lg shadow-md">
              <table className="min-w-full table-auto border-collapse bg-white">
                <thead className="bg-gray-100 text-gray-700 font-semibold text-sm">
                  <tr>
                    <th className="py-2 px-3 border border-gray-300">ID</th>
                    <th className="py-2 px-3 border border-gray-300">Nombre</th>
                    <th className="py-2 px-3 border border-gray-300">Precio</th>
                    <th className="py-2 px-3 border border-gray-300">Tipo</th>
                    <th className="py-2 px-3 border border-gray-300">Descripción</th>
                    <th className="py-2 px-3 border border-gray-300">Acciones</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {productosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-6 text-gray-500">
                        No hay productos que coincidan con tu búsqueda.
                      </td>
                    </tr>
                  ) : (
                    productosFiltrados.map((producto) => (
                      <tr key={producto.id} className="border-t hover:bg-yellow-50">
                        <td className="py-2 px-3 border border-gray-300 break-words max-w-xs">{producto.id}</td>
                        <td className="py-2 px-3 border border-gray-300">{producto.nombre}</td>
                        <td className="py-2 px-3 border border-gray-300">{producto.precio?.toLocaleString("es-CO")}</td>
                        <td className="py-2 px-3 border border-gray-300">{producto.tipo}</td>
                        <td className="py-2 px-3 border border-gray-300 truncate max-w-[160px]" title={producto.descripcion || ""}>{producto.descripcion || "-"}</td>
                        <td className="py-2 px-3 border border-gray-300 flex gap-2 flex-wrap justify-center">
                          <Link
                            to={`/admin/productos/editar/${producto.id}`}
                            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg min-w-[90px] text-center"
                          >
                            Editar
                          </Link>
                          <button
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg min-w-[90px] text-center"
                            onClick={() => eliminarProducto(producto.id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === "facturas" && (
        <div className="w-full bg-white rounded-2xl shadow p-6 mt-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
            <h3 className="text-2xl font-bold flex-1 text-center sm:text-left">Historial de Ventas / Facturas</h3>
            <input
              type="text"
              placeholder="Buscar cliente, correo o ID factura..."
              className="border px-3 py-2 rounded-lg w-full sm:w-80"
              value={filtroFactura}
              onChange={e => setFiltroFactura(e.target.value)}
            />
          </div>
          {loadingFacturas ? (
            <div className="text-center py-6">Cargando facturas...</div>
          ) : (
            <div className="overflow-x-auto rounded-lg shadow-md">
              <table className="min-w-full table-auto border-collapse bg-white text-sm">
                <thead className="bg-gray-100 text-gray-700 font-semibold text-sm">
                  <tr>
                    <th className="py-2 px-3 border border-gray-300">ID Factura</th>
                    <th className="py-2 px-3 border border-gray-300">Cliente</th>
                    <th className="py-2 px-3 border border-gray-300">Correo</th>
                    <th className="py-2 px-3 border border-gray-300">Total</th>
                    <th className="py-2 px-3 border border-gray-300">Fecha</th>
                    <th className="py-2 px-3 border border-gray-300">Ver PDF</th>
                    <th className="py-2 px-3 border border-gray-300">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {facturasFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-500">
                        No hay facturas que coincidan.
                      </td>
                    </tr>
                  ) : (
                    facturasFiltradas.map((factura) => (
                      <tr key={factura.id} className="border-t hover:bg-yellow-50">
                        <td className="py-2 px-3 border border-gray-300 break-words max-w-xs">{factura.id}</td>
                        <td className="py-2 px-3 border border-gray-300">{factura.pedidos?.usuarios?.nombre || "-"}</td>
                        <td className="py-2 px-3 border border-gray-300">{factura.pedidos?.usuarios?.correo || "-"}</td>
                        <td className="py-2 px-3 border border-gray-300 font-bold text-green-700">${factura.pedidos?.total?.toLocaleString("es-CO") || "-"}</td>
                        <td className="py-2 px-3 border border-gray-300">{new Date(factura.fecha_emision).toLocaleString("es-CO")}</td>
                        <td className="py-2 px-3 border border-gray-300">
                          {factura.archivo_url ? (
                            <a href={factura.archivo_url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">
                              Ver PDF
                            </a>
                          ) : (
                            <span className="text-gray-400">Sin archivo</span>
                          )}
                        </td>
                        <td className="py-2 px-3 border border-gray-300 flex gap-2 flex-wrap justify-center">
                          <button
                            className="px-3 py-1 bg-blue-500 hover:bg-blue-700 text-white rounded-lg min-w-[90px] text-center"
                            onClick={() => setEditFactura(factura)}
                          >
                            Editar
                          </button>
                          <button
                            className="px-3 py-1 bg-red-500 hover:bg-red-700 text-white rounded-lg min-w-[90px] text-center"
                            onClick={() => eliminarFactura(factura.id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === "alertas" && <AlertasStock />}

      {editFactura && (
        <EditFacturaModal
          factura={editFactura}
          onClose={() => setEditFactura(null)}
          onSave={handleFacturaEditSave}
        />
      )}

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(-20px);} to { opacity: 1; transform: translateY(0);} }
        .animate-fade-in { animation: fade-in 0.25s ease;}
      `}</style>
    </div>
  );
}
