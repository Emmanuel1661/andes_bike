/* eslint-disable no-unused-vars */
// src/pages/ARView.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function detectarIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}
function detectarAndroid() {
  return /Android/.test(navigator.userAgent);
}

export default function ARView() {
  const { modelo } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndRedirect = async () => {
      setLoading(true);
      // Busca la bici por id o slug (ajusta si es necesario)
      const { data, error } = await supabase
        .from("productos")
        .select("glb_url,usdz_url")
        .or(`id.eq.${modelo},slug.eq.${modelo},nombre.eq.${modelo}`);

      const bici = data && data[0];
      if (!bici) {
        alert("Modelo no encontrado");
        setLoading(false);
        return;
      }

      if (detectarIOS() && bici.usdz_url) {
        window.location.href = bici.usdz_url;
      } else if (detectarAndroid() && bici.glb_url) {
        window.location.href = bici.glb_url;
      } else {
        alert("Abre este QR desde un teléfono compatible para ver la bicicleta en realidad aumentada.");
      }
      setLoading(false);
    };
    fetchAndRedirect();
   /// eslint-disable-next-line
  }, [modelo]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Cargando modelo AR...</h2>
      <p>Si no se abre automáticamente, verifica que tu dispositivo sea compatible.</p>
    </div>
  );
}
