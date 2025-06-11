// src/components/ArButton.jsx
import { useState } from "react";
import { FaCube, FaQrcode } from "react-icons/fa";

function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export default function ArButton({ glbUrl }) {
  const [showQR, setShowQR] = useState(false);

  if (!glbUrl) return null;

  // Link para Google Scene Viewer (Android), QuickLook (iOS), o visor 3D web
  const arLink = `https://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(glbUrl)}&mode=ar_only`;

  // Si está en móvil, abrir el visor AR directamente; en PC, mostrar QR
  const handleAR = () => {
    if (isMobile()) {
      window.location.href = arLink;
    } else {
      setShowQR(true);
    }
  };

  return (
    <div className="flex items-center gap-4 absolute top-7 right-8 z-10">
      {/* Botón RA */}
      <button
        onClick={handleAR}
        className="flex items-center gap-2 px-4 py-2 bg-black text-yellow-300 rounded-full shadow-lg hover:bg-gray-900 text-base font-bold transition"
        title="Ver en Realidad Aumentada"
        style={{ minWidth: 44, minHeight: 44 }}
      >
        <FaCube className="text-xl" />
        <span className="hidden sm:inline">Ver en RA</span>
      </button>
      {/* Botón QR solo en PC */}
      {!isMobile() && (
        <button
          onClick={() => setShowQR(!showQR)}
          className="p-2 bg-white rounded-full border-2 border-black hover:bg-gray-100 shadow"
          title="Escanea en tu celular"
        >
          <FaQrcode className="text-2xl text-black" />
        </button>
      )}
      {/* Modal QR */}
      {showQR && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 z-50"
          onClick={() => setShowQR(false)}
        >
          <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <p className="text-xl font-bold mb-2">Escanea en tu celular</p>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=230x230&data=${encodeURIComponent(arLink)}`}
              alt="QR AR"
              className="rounded-xl border mb-2"
              style={{ background: "#fff" }}
            />
            <button
              className="mt-2 px-6 py-2 bg-black text-white rounded-lg font-bold hover:bg-gray-800"
              onClick={() => setShowQR(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
