import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const ADMIN_EMAIL = "emanuelotero710@gmail.com";
const basePublicUrl = "https://andes-bike.onrender.com";

export default function RealidadAumentada() {
  const [bicis3D, setBicis3D] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eliminando, setEliminando] = useState(null);
  const navigate = useNavigate();

  // Detecta si es admin
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const esAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    fetch3DBicis();
  }, []);

  async function fetch3DBicis() {
    setLoading(true);
    const { data, error } = await supabase
      .from("productos")
      // aquí quitamos los espacios: "id,nombre,precio,imagen,glb_url,usdz_url"
      .select("id,nombre,precio,imagen,glb_url,usdz_url")
      .not("glb_url", "is", null)
      .not("usdz_url", "is", null);
    if (error) {
      alert("Error cargando bicis 3D: " + error.message);
    } else {
      setBicis3D(data);
    }
    setLoading(false);
  }

  async function eliminarBici(id) {
    if (!window.confirm("¿Seguro que deseas eliminar esta bici 3D?")) return;
    setEliminando(id);
    const { error } = await supabase
      .from("productos")
      .delete()
      .eq("id", id);
    if (error) {
      alert("Error eliminando: " + error.message);
    } else {
      setBicis3D((b) => b.filter((x) => x.id !== id));
    }
    setEliminando(null);
  }

  if (loading) return <p>Cargando bicicletas con realidad aumentada...</p>;
  if (bicis3D.length === 0) return <p>No hay bicicletas con modelos 3D disponibles.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Bicicletas con Realidad Aumentada
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {bicis3D.map((bici) => {
          const qrUrl = `${basePublicUrl}/ar-view/${bici.id}`;
          return (
            <div
              key={bici.id}
              className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center relative"
            >
              {esAdmin && (
                <div className="absolute top-3 right-3 flex gap-3">
                  <button
                    onClick={() => navigate(`/admin/productos/editar/${bici.id}`)}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2"
                    title="Editar"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => eliminarBici(bici.id)}
                    className={`bg-red-500 hover:bg-red-600 text-white rounded-full p-2 ${
                      eliminando === bici.id ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                    disabled={eliminando === bici.id}
                    title="Eliminar"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
              <img
                src={bici.imagen}
                alt={bici.nombre}
                className="w-48 h-48 object-contain mb-4"
              />
              <h3 className="font-semibold text-center mb-1">{bici.nombre}</h3>
              <p className="text-green-700 font-bold mb-4">${bici.precio}</p>
              <QRCode value={qrUrl} size={128} className="mb-4" />
              <p className="text-center text-xs text-gray-500 mb-4">
                Escanea para ver en 3D en tu móvil (Android o iPhone)
              </p>
              <button
                onClick={() => navigate(`/ar-view/${bici.id}`)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded"
              >
                Ver Modelo 3D
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
