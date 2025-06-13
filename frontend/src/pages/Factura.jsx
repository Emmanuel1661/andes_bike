// src/pages/Factura.jsx
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import logo from "../assets/logo.png";

// INFO DE TU TIENDA
const NOMBRE_TIENDA = "AndesBike";
const CORREO_TIENDA = "andesbike@bicis.com";
const TEL_TIENDA = "+57 301 234 5678";
const WHATSAPP_TIENDA = "+57 301 614 6956";
const DIR_TIENDA = "Cra. 14 #7c-2 a 7c-214,zarzal valle,Colombia";

// NEQUI
const NEQUI_PHONE = "3016146956"; // Cambia por el número Nequi sin el +57

export default function Factura() {
  const [datos, setDatos] = useState(null);
  const [productos, setProductos] = useState([]);
  const [total, setTotal] = useState(0);
  const [qrUrl, setQrUrl] = useState("");
  const [ocultandoParaPDF, setOcultandoParaPDF] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let datosFactura, productosFactura, pedidoId, fecha;
    if (location.state && location.state.datosFactura) {
      datosFactura = location.state.datosFactura.cliente;
      productosFactura = location.state.datosFactura.productos;
      setTotal(location.state.datosFactura.total);
      pedidoId = location.state.datosFactura.pedidoId;
      fecha = location.state.datosFactura.fecha;
    } else {
      datosFactura = JSON.parse(sessionStorage.getItem("factura_datos"));
      productosFactura = JSON.parse(sessionStorage.getItem("factura_productos")) || [];
      setTotal(productosFactura.reduce((sum, p) => sum + (p.precio * (p.qty || 1)), 0));
      pedidoId = null;
      fecha = new Date().toLocaleString();
    }
    setDatos({ ...datosFactura, pedidoId, fecha });
    setProductos(productosFactura);

    // --------- QR NEQUI ----------
    const montoNequi = location.state?.datosFactura?.total || productosFactura.reduce((sum, p) => sum + (p.precio * (p.qty || 1)), 0) || 0;
    const nequiUrl = `https://recarga.nequi.com.co/bdigitalpsl/#!/redirect?phone=${NEQUI_PHONE}&value=${Math.round(montoNequi)}`;
    QRCode.toDataURL(nequiUrl, { width: 240, margin: 1 }, (err, url) => {
      if (!err) setQrUrl(url);
    });
    // --------- FIN QR NEQUI ----------

  }, [location.state]);

  // AJUSTE: Oculta los botones y leyenda mientras se descarga PDF
  const descargarPDF = async () => {
    setOcultandoParaPDF(true);
    await new Promise(res => setTimeout(res, 200));
    const input = ref.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pdfWidth = pageWidth - 20;
    const imgProps = pdf.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);
    pdf.save(`Factura_AndesBike_${Date.now()}.pdf`);
    setOcultandoParaPDF(false);
  };

  if (!datos) return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="text-xl text-gray-500">No hay datos de factura.</span>
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-2 py-6">
      <div
        className="bg-white shadow-2xl rounded-2xl p-8 max-w-2xl w-full mx-auto border border-gray-200 relative"
        ref={ref}
        style={{ minHeight: 770, background: "#fff" }}
      >
        {/* Cabecera */}
        <div className="flex items-center gap-3 mb-2">
          <img src={logo} alt="AndesBike Logo" className="w-16 h-16 rounded-full border-2 border-yellow-600 object-cover" />
          <div>
            <span className="text-3xl font-black text-green-700">{NOMBRE_TIENDA.slice(0,5)}</span>
            <span className="text-3xl font-black text-yellow-600">{NOMBRE_TIENDA.slice(5)}</span>
            <div className="text-xs text-gray-500 font-bold">{CORREO_TIENDA}</div>
            <div className="text-xs text-gray-500">Factura #{datos?.pedidoId || "N/A"}</div>
          </div>
          <div className="ml-auto text-xs text-gray-400 text-right">
            Fecha: {datos?.fecha || new Date().toLocaleString()}
          </div>
        </div>
        <hr className="my-3 border-gray-200" />

        {/* Datos del Cliente y QR */}
        <div className="mb-4 flex flex-row justify-between items-center">
          <div>
            <div className="text-lg font-bold text-green-800 mb-2">Cliente:</div>
            <div className="flex flex-col gap-1 text-sm">
              <div>
                <span className="font-bold">Nombre:</span> {datos.nombre}
              </div>
              <div>
                <span className="font-bold">Correo:</span> {datos.correo}
              </div>
              <div>
                <span className="font-bold">Teléfono:</span> {datos.telefono}
              </div>
              <div>
                <span className="font-bold">Dirección:</span> {datos.direccion}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            {qrUrl && (
              <>
                <img
                  src={qrUrl}
                  alt="Paga con Nequi"
                  className="w-36 h-36 mt-2 cursor-pointer"
                  onClick={() =>
                    window.open(
                      `https://recarga.nequi.com.co/bdigitalpsl/#!/redirect?phone=${NEQUI_PHONE}&value=${Math.round(total)}`,
                      "_blank"
                    )
                  }
                  title="Escanéame o haz click para pagar por Nequi"
                />
                <span className="text-xs text-gray-500 mt-1">Paga tu pedido con Nequi</span>
              </>
            )}
          </div>
        </div>
        {/* Tabla de productos */}
        <table className="w-full mb-4 text-base border rounded overflow-hidden shadow">
          <thead>
            <tr className="bg-yellow-100 text-gray-800 font-bold">
              <th className="py-2 px-2">Producto</th>
              <th className="py-2 px-2">Cantidad</th>
              <th className="py-2 px-2">Precio</th>
              <th className="py-2 px-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p, i) => (
              <tr key={i} className="bg-white even:bg-gray-50">
                <td className="py-2 px-2">{p.nombre}</td>
                <td className="py-2 px-2 text-center">{p.cantidad || p.qty || 1}</td>
                <td className="py-2 px-2 text-right">${Number(p.precio).toLocaleString("es-CO")}</td>
                <td className="py-2 px-2 text-right">${(p.precio * (p.cantidad || p.qty || 1)).toLocaleString("es-CO")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-right font-bold text-xl text-green-700 mb-4">
          Total: ${total.toLocaleString("es-CO")}
        </div>

        {/* Contacto tienda mejorado */}
        <div className="mb-4 mt-4">
          <div className="text-lg text-gray-900 font-bold mb-1">Contacto AndesBike:</div>
          <div className="text-base text-gray-900 font-semibold">WhatsApp: <a href={`https://wa.me/${WHATSAPP_TIENDA.replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer">{WHATSAPP_TIENDA}</a></div>
          <div className="text-base text-gray-900 font-semibold">Correo: <a href={`mailto:${CORREO_TIENDA}`}>{CORREO_TIENDA}</a></div>
          <div className="text-base text-gray-900 font-semibold">Teléfono: {TEL_TIENDA}</div>
          <div className="text-base text-gray-900 font-semibold">Dirección: {DIR_TIENDA}</div>
        </div>

        {/* BOTONES y LEYENDA solo visibles en la web */}
        {!ocultandoParaPDF && (
          <>
            <div className="flex gap-4 justify-center mt-3">
              <button
                onClick={descargarPDF}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded font-semibold"
              >
                Descargar PDF
              </button>
              <button
                onClick={() => navigate("/")}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-5 py-2 rounded font-semibold"
              >
                Volver a la tienda
              </button>
            </div>
            <div className="text-xs text-center mt-7 text-gray-400">
              AndesBike • Pedalea con pasión. Factura válida para efectos académicos.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
