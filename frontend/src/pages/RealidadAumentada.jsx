/* eslint-disable no-unused-vars */
// src/pages/RealidadAumentada.jsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import QRCode from "react-qr-code"; // <- Generador QR dinámico
import { Link } from "react-router-dom";

export default function RealidadAumentada() {
  const [bicis, setBicis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBicis = async () => {
      setLoading(true);
      // Solo trae bicis que tengan modelo glb y usdz
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .not("glb_url", "is", null)
        .not("usdz_url", "is", null); // <-- usa usdz_url ahora
      setBicis(data || []);
      setLoading(false);
    };
    fetchBicis();
  }, []);

  return (
    <div className="flex flex-col items-center py-10 min-h-screen">
      <h2 className="text-3xl font-bold mb-8">Bicicletas con Realidad Aumentada</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-8 w-full max-w-5xl">
          {bicis.length === 0 && <p>No hay bicis con realidad aumentada.</p>}
          {bicis.map((bici) => (
            <div
              key={bici.id}
              className="bg-white rounded-3xl shadow-2xl flex flex-col items-center w-[370px] mb-6 pt-6 pb-8 px-4"
            >
              {/* Imagen bici */}
              {bici.imagen && (
                <div className="w-72 h-52 bg-gray-100 flex items-center justify-center rounded-xl mb-4" style={{ boxShadow: "0 2px 20px 0 rgba(0,0,0,0.08)" }}>
                  <img src={bici.imagen} alt={bici.nombre} className="max-w-[260px] max-h-[180px] object-contain" />
                </div>
              )}
              <h3 className="text-xl font-bold mb-2 text-center">{bici.nombre}</h3>
              <p className="text-gray-700 mb-2 text-center">{bici.descripcion}</p>

              {/* Genera QR que apunta a la página intermedia de AR */}
              <div className="flex justify-center items-center w-full my-2">
                <QRCode
                  value={`${window.location.origin}/ar-view/${bici.id || bici.slug || bici.nombre.replace(/\s+/g, '-').toLowerCase()}`}
                  size={164}
                  bgColor="#fff"
                  fgColor="#000"
                  level="H"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">
                Escanea para ver en 3D en tu móvil (iPhone & Android)
              </p>
              {/* Link directo para prueba manual */}
              <Link
                to={`/ar-view/${bici.id || bici.slug || bici.nombre.replace(/\s+/g, '-').toLowerCase()}`}
                className="mt-2 text-blue-600 text-xs underline"
                target="_blank"
              >
                Probar modelo AR aquí
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
