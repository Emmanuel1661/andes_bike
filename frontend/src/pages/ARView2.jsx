// src/pages/ARView2.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function isAndroid() {
  return /android/i.test(navigator.userAgent);
}
function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export default function ARView2() {
  // El parámetro de la ruta es ":id" (asegúrate en App.jsx que sea igual)
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bici, setBici] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      // ⚠️ Pide SOLO los campos que existen exactamente
      const { data, error } = await supabase
        .from("productos")
        .select("id, nombre, glb_url, usdz_url, imagen")
        .eq("id", id)
        .single();

      if (error || !data) {
        setLoading(false);
        return;
      }
      setBici(data);
      setLoading(false);

      // Redirección automática según dispositivo
      if (isAndroid() && data.glb_url) {
        const sceneViewerUrl =
          `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
            data.glb_url
          )}&title=${encodeURIComponent(data.nombre)}#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(
            window.location.href
          )};end;`;
        window.location.href = sceneViewerUrl;
      }
      else if (isIOS() && data.usdz_url) {
        window.location.href = `${data.usdz_url}#allowsContentScaling=1`;
      }
    })();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="text-center text-lg p-10">
        Cargando modelo 3D...
      </div>
    );
  }
  if (!bici) {
    return (
      <div className="text-center text-lg p-10">
        No se encontró el modelo.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
      >
        ← Volver
      </button>
      <h2 className="text-2xl font-bold mb-4">{bici.nombre}</h2>
      <model-viewer
        src={bici.glb_url}
        ios-src={bici.usdz_url}
        alt={bici.nombre}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        style={{ width: "100%", height: "60vh", maxWidth: "900px" }}
        background-color="#ffffff"
      />
      <p className="mt-6 text-gray-500 text-sm text-center">
        Si no abre el visor AR automáticamente, prueba desde tu móvil o con otro navegador.
      </p>
    </div>
  );
}
