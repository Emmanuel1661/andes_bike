/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { FaShoppingCart, FaMinus, FaPlus, FaWhatsapp } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import ArButton from "../components/ArButton"; // Botón para realidad aumentada

export default function ProductoDetalle() {
  // Obtener el id del producto desde la URL
  const { id } = useParams();
  // Estado del producto y control de UI
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imgIdx, setImgIdx] = useState(0);

  // Estados para selección de talla/color/cantidad/mensajes
  const [selectedTalla, setSelectedTalla] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [showMsg, setShowMsg] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Consultar el producto desde Supabase
  useEffect(() => {
    const fetchProducto = async () => {
      setLoading(true);
      setError("");
      let { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("id", id)
        .single();
      if (error) setError(error.message);
      else setProducto(data);
      setLoading(false);
    };
    fetchProducto();
  }, [id]);

  // Procesar tallas disponibles (si es string o array)
  let tallasDisponibles = [];
  if (producto?.talla) {
    if (Array.isArray(producto.talla)) tallasDisponibles = producto.talla;
    else if (typeof producto.talla === "string")
      tallasDisponibles = producto.talla.split(/[,\-\/;]/).map((t) => t.trim()).filter(Boolean);
    tallasDisponibles = tallasDisponibles.map((t) => t.replace(/["']/g, "").trim());
  }
  // Si es bicicleta y no tiene tallas, usar S/M/L por defecto
  if (
    ["mtb", "ruta", "downhill"].includes((producto?.tipo || "").toLowerCase()) &&
    tallasDisponibles.length <= 1
  ) {
    tallasDisponibles = ["S", "M", "L"];
  }

  // Procesar colores disponibles
  let coloresDisponibles = [];
  if (producto?.color) {
    if (Array.isArray(producto.color)) coloresDisponibles = producto.color;
    else if (typeof producto.color === "string")
      coloresDisponibles = producto.color.split(/[,\-\/;]/).map((c) => c.trim()).filter(Boolean);
    coloresDisponibles = coloresDisponibles.map((c) => c.replace(/["']/g, "").trim());
  }

  // Procesar imágenes principales y miniaturas
  let imagenes = [];
  if (producto?.imagenes && Array.isArray(producto.imagenes) && producto.imagenes.length > 0) {
    imagenes = producto.imagenes.filter(Boolean);
  } else if (producto?.imagenes && typeof producto.imagenes === "string") {
    try {
      const parsed = JSON.parse(producto.imagenes);
      if (Array.isArray(parsed)) imagenes = parsed.filter(Boolean);
      else if (typeof parsed === "string") imagenes = [parsed];
    } catch {
      imagenes = [producto.imagenes];
    }
  } else if (producto?.imagen) {
    imagenes = [producto.imagen];
  } else {
    imagenes = ["https://via.placeholder.com/600x400?text=Producto"];
  }
  // Imagen mostrada principal
  const imagenPrincipal = imagenes[imgIdx] || imagenes[0] || "https://via.placeholder.com/600x400?text=Producto";

  // Al cargar producto, ajustar selección de talla, color y cantidad por defecto
  useEffect(() => {
    if (!producto) return;
    let stock = producto.stock ?? 10;
    if (cantidad > stock) setCantidad(stock);
    if (!selectedTalla && tallasDisponibles.length > 0) setSelectedTalla(tallasDisponibles[0]);
    if (!selectedColor && coloresDisponibles.length > 0) setSelectedColor(coloresDisponibles[0]);
    // eslint-disable-next-line
  }, [producto]);

  // Agregar al carrito
  const handleAddToCart = () => {
    if (!producto) return;
    addToCart({
      ...producto,
      talla: selectedTalla || "",
      color: selectedColor || "",
      qty: cantidad,
    });
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 2000);
  };

  // Generar enlace para WhatsApp con el nombre/id del producto
  const whatsappMsg = encodeURIComponent(
    `Hola! Quiero asesoría sobre el producto: ${producto?.nombre || ""} (ID: ${producto?.id || ""})`
  );
  const whatsappURL = `https://wa.me/573053304687?text=${whatsappMsg}`;

  // Estados de carga, error o no encontrado
  if (loading)
    return <div className="text-center mt-16 text-xl font-semibold">Cargando detalles...</div>;
  if (error) return <div className="text-red-600 text-center">{error}</div>;
  if (!producto) return <div>No se encontró el producto.</div>;

  // Render principal responsive
  return (
    <div className="flex flex-col items-center min-h-[80vh] bg-transparent">
      {/* Card principal con info y foto, responsive flex-col en móvil, row en md+ */}
      <div className="bg-white rounded-3xl shadow-2xl mt-10 mb-10 px-2 sm:px-8 md:px-14 py-8 flex flex-col md:flex-row items-stretch w-full max-w-5xl border-2 border-gray-100 transition-all duration-300">
        {/* Imagen principal y miniaturas */}
        <div className="flex-1 flex flex-col justify-center items-center mb-5 md:mb-0">
          <div className="bg-gray-50 rounded-3xl shadow-2xl flex justify-center items-center w-full h-[350px] md:h-[500px] border-4 border-gray-200 transition-all duration-300">
            <img
              src={imagenPrincipal}
              alt={producto.nombre}
              className="object-contain w-full h-full max-h-[350px] md:max-h-[480px] max-w-[520px] mx-auto drop-shadow-2xl transition-transform duration-300 hover:scale-105"
              style={{
                aspectRatio: "4/2",
                background: "#fff",
                borderRadius: "1.5rem",
                padding: "0.5rem",
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>
          {/* Botón realidad aumentada si hay modelo 3D */}
          <ArButton glbUrl={producto.glb_url} usdzUrl={producto.usdz_url} />
          {/* Visor 3D si hay modelo glb */}
          {producto.glb_url && (
            <div className="w-full flex justify-center mt-2">
              <model-viewer
                src={producto.glb_url}
                camera-controls
                ar
                ar-modes="scene-viewer webxr quick-look"
                style={{ width: "100%", maxWidth: 500, height: 340, background: "#fafafa", borderRadius: "1.5rem" }}
                alt="Bicicleta 3D"
                shadow-intensity="1"
                exposure="1"
              ></model-viewer>
            </div>
          )}
          {/* Miniaturas (muestra si hay más de 1 imagen) */}
          {imagenes.length > 1 && (
            <div className="flex gap-2 mt-4 justify-center">
              {imagenes.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={"Miniatura " + idx}
                  onClick={() => setImgIdx(idx)}
                  className={`h-14 w-14 object-cover rounded-xl border-4 cursor-pointer transition-all duration-150 shadow-lg ${
                    idx === imgIdx
                      ? "border-black scale-110 bg-neutral-50"
                      : "border-gray-200 hover:border-black bg-white"
                  }`}
                  style={{ background: "#f9fafb" }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Información del producto y opciones de compra */}
        <div className="flex-1 flex flex-col items-start justify-between pl-0 md:pl-10 mt-10 md:mt-0">
          {/* Botón volver */}
          <button
            onClick={() => navigate(-1)}
            className="mb-4 px-5 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded-lg font-bold text-base shadow-md transition"
          >
            ← Volver
          </button>
          {/* Título y precio */}
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-gray-900 drop-shadow-xl leading-tight tracking-tight">
            {producto.nombre}
          </h1>
          <div className="text-2xl md:text-3xl text-green-600 font-extrabold mb-4 drop-shadow">
            {Number(producto.precio).toLocaleString("es-CO")}
          </div>
          {/* Etiquetas: marca, tipo, color, talla, stock */}
          <div className="flex flex-wrap gap-3 mb-4">
            {producto.marca && (
              <span className="border-2 border-gray-400 text-gray-700 px-4 py-1 rounded-full text-base font-bold shadow-sm tracking-wide">
                {producto.marca}
              </span>
            )}
            {producto.tipo && (
              <span className="border-2 border-gray-400 text-gray-700 px-4 py-1 rounded-full text-base font-bold uppercase shadow-sm">
                {producto.tipo}
              </span>
            )}
            {selectedColor && (
              <span className="border-2 border-gray-400 text-gray-700 px-4 py-1 rounded-full text-base font-semibold">
                Color: {selectedColor}
              </span>
            )}
            {selectedTalla && (
              <span className="border-2 border-gray-400 text-gray-700 px-4 py-1 rounded-full text-base font-semibold">
                Talla: {selectedTalla}
              </span>
            )}
            {producto.stock !== undefined && producto.stock !== null && (
              <span
                className={`px-4 py-1 rounded-full text-base font-bold border-2 ${
                  producto.stock > 0
                    ? "border-green-400 text-green-700"
                    : "border-red-400 text-red-600"
                }`}
              >
                Stock: {producto.stock > 0 ? producto.stock : "Agotado"}
              </span>
            )}
          </div>
          {/* Selección de color (si hay) */}
          {coloresDisponibles.length > 0 && (
            <div className="flex flex-col gap-2 mb-4 items-start w-full">
              <span className="font-bold text-base tracking-wider mb-1">COLOR</span>
              <div className="flex gap-2">
                {coloresDisponibles.map((c, idx) => (
                  <button
                    key={idx}
                    className={`px-7 py-3 rounded-md font-bold text-base border-2 transition-all duration-150
                    ${selectedColor === c
                        ? "bg-black text-white border-black shadow-lg scale-105"
                        : "bg-white text-black border-gray-300 hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedColor(c)}
                    style={{ minWidth: 64 }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Selección de talla (si hay) */}
          {tallasDisponibles.length > 0 && (
            <div className="flex flex-col gap-2 mb-4 items-start w-full">
              <span className="font-bold text-base tracking-wider mb-1">TAMAÑO</span>
              <div className="flex gap-2">
                {tallasDisponibles.map((t, idx) => (
                  <button
                    key={idx}
                    className={`px-7 py-3 rounded-md font-bold text-base border-2 transition-all duration-150
                    ${selectedTalla === t
                        ? "bg-black text-white border-black shadow-lg scale-105"
                        : "bg-white text-black border-gray-300 hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedTalla(t)}
                    style={{ minWidth: 64 }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Selector de cantidad y agregar al carrito */}
          <div className="flex flex-col gap-3 w-full mt-3">
            <div className="flex gap-3 items-center">
              <span className="font-semibold text-lg">Cantidad:</span>
              <button
                className={`bg-gray-200 rounded-full p-2 hover:bg-gray-300 ${cantidad <= 1 ? "opacity-60 cursor-not-allowed" : ""}`}
                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                disabled={cantidad <= 1}
                title="Menos"
              >
                <FaMinus />
              </button>
              <span className="font-bold text-xl w-10 text-center">{cantidad}</span>
              <button
                className={`bg-gray-200 rounded-full p-2 hover:bg-gray-300 ${cantidad >= (producto.stock || 1) ? "opacity-60 cursor-not-allowed" : ""}`}
                onClick={() => setCantidad(Math.min((producto.stock || 1), cantidad + 1))}
                disabled={cantidad >= (producto.stock || 1)}
                title="Más"
              >
                <FaPlus />
              </button>
              {producto.stock && <span className="ml-3 text-gray-600 text-sm">(Máx: {producto.stock})</span>}
            </div>
            {/* Botón agregar al carrito */}
            <button
              className={`w-full bg-black hover:bg-gray-800 text-yellow-300 font-extrabold px-6 py-4 rounded-xl text-xl flex items-center justify-center gap-2 shadow-xl transition ${
                producto.stock === 0 ? "opacity-60 cursor-not-allowed" : ""
              }`}
              disabled={producto.stock === 0}
              onClick={handleAddToCart}
            >
              <FaShoppingCart className="mr-2" />
              Agregar al carrito
            </button>
            {/* Mensaje de éxito */}
            {showMsg && (
              <div className="w-full text-center text-green-700 bg-green-50 border border-green-200 rounded-xl py-2 mt-1 font-semibold transition">
                ¡Producto agregado al carrito!
              </div>
            )}
            {/* Botón WhatsApp para asesoría */}
            <a
              href={whatsappURL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-1 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl text-lg flex items-center justify-center gap-2 shadow-lg transition"
              title="Asesórate con un experto por WhatsApp"
            >
              <FaWhatsapp className="mr-2" />
              Asesórate con un experto
            </a>
          </div>
        </div>
      </div>

      {/* Ficha técnica: muestra especificaciones si existen (tabla o texto) */}
      {producto.especificaciones && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-2 w-full max-w-5xl border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Especificaciones</h2>
          <div className="overflow-x-auto text-lg text-gray-800">
            {/* Si es JSON válido, mostrar como tabla, si no, mostrar texto */}
            {(() => {
              let espec = producto.especificaciones;
              try {
                const parsed = typeof espec === "string" ? JSON.parse(espec) : espec;
                if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
                  return (
                    <table className="min-w-full text-lg">
                      <tbody>
                        {Object.entries(parsed).map(([key, value]) => (
                          <tr key={key}>
                            <td className="font-semibold pr-4 py-1 text-gray-700">{key}</td>
                            <td className="py-1">{String(value)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  );
                }
              } catch (e) {}
              // Si no es JSON, mostrar texto plano grande
              return (
                <div className="text-lg leading-relaxed text-gray-700 whitespace-pre-line" style={{fontSize: '1.15rem'}}>
                  {espec}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Descripción larga si existe */}
      {producto.descripcion && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-10 w-full max-w-5xl border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Descripción</h2>
          <div className="whitespace-pre-line text-gray-800 text-xl leading-relaxed">{producto.descripcion}</div>
        </div>
      )}
    </div>
  );
}
