/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const categorias = [
  { id: 1, nombre: "Ruta" },
  { id: 2, nombre: "Montaña" },
  { id: 3, nombre: "Downhill" },
];

function getQueryParams(search) {
  return Object.fromEntries(new URLSearchParams(search));
}

export default function AdminProductoEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = getQueryParams(location.search);
  const { page, search: searchText, tab } = queryParams;

  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    categoria_id: "",
    imagen: "",
    imagenes: [""],
    especificaciones: "",
    talla: "",
    descripcion: "",
    stock: "",
    color: "",
    marca: "",
    glb_url: "",
    usdz_url: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.email !== "emanuelotero710@gmail.com") {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    setLoading(true);
    setError("");
    if (!id || id === "undefined" || typeof id !== "string" || !id.trim()) {
      setError("ID de producto inválido, regresa al listado.");
      setLoading(false);
      return;
    }
    const fetchProducto = async () => {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("id", id)
        .single();
      if (data) {
        let imagenesArr = [];
        if (Array.isArray(data.imagenes)) imagenesArr = data.imagenes;
        else if (typeof data.imagenes === "string") {
          try {
            const arr = JSON.parse(data.imagenes);
            if (Array.isArray(arr)) imagenesArr = arr;
            else if (typeof arr === "string") imagenesArr = [arr];
          } catch {
            imagenesArr = [data.imagenes];
          }
        } else if (data.imagen) {
          imagenesArr = [data.imagen];
        }
        if (imagenesArr.length === 0) imagenesArr = [""];
        setForm({
          nombre: data.nombre || "",
          precio: data.precio || "",
          categoria_id: data.categoria_id || "",
          imagen: data.imagen || "",
          imagenes: imagenesArr,
          especificaciones: data.especificaciones || "",
          talla: data.talla || "",
          descripcion: data.descripcion || "",
          stock: data.stock || "",
          color: data.color || "",
          marca: data.marca || "",
          glb_url: data.glb_url || "",
          usdz_url: data.usdz_url || "",
        });
        setLoading(false);
      } else {
        setError("No se pudo cargar el producto. Intenta de nuevo.");
        setLoading(false);
      }
    };
    fetchProducto();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImagenChange = (idx, value) => {
    const nuevasImagenes = [...form.imagenes];
    nuevasImagenes[idx] = value;
    setForm({ ...form, imagenes: nuevasImagenes });
  };

  const handleAddImagen = () => {
    setForm({ ...form, imagenes: [...form.imagenes, ""] });
  };

  const handleRemoveImagen = (idx) => {
    const nuevasImagenes = form.imagenes.filter((_, i) => i !== idx);
    setForm({ ...form, imagenes: nuevasImagenes.length ? nuevasImagenes : [""] });
  };

  // REGRESAR con parámetros
  const handleVolver = () => {
    let url = "/admin";
    let params = [];
    if (tab) params.push(`tab=${encodeURIComponent(tab)}`);
    if (page) params.push(`page=${encodeURIComponent(page)}`);
    if (searchText) params.push(`search=${encodeURIComponent(searchText)}`);
    if (params.length) url += "?" + params.join("&");
    navigate(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id || id === "undefined" || typeof id !== "string" || !id.trim()) {
      setError("No se pudo actualizar: el producto no tiene ID válido.");
      return;
    }
    if (!form.nombre || !form.precio || !form.stock) {
      setError("Debes completar todos los campos obligatorios.");
      return;
    }
    const imagenesLimpiadas = form.imagenes
      .map((img) => img.trim())
      .filter((img, idx, arr) => img && arr.indexOf(img) === idx);

    let producto = {
      nombre: form.nombre,
      precio: Number(form.precio),
      imagen: imagenesLimpiadas[0] || "",
      imagenes: imagenesLimpiadas.length ? imagenesLimpiadas : null,
      especificaciones: form.especificaciones,
      talla: form.talla,
      descripcion: form.descripcion,
      stock: Number(form.stock),
      color: form.color,
      marca: form.marca,
      glb_url: form.glb_url || null,
      usdz_url: form.usdz_url || null,
    };

    if (form.categoria_id && Number(form.categoria_id) > 0) {
      producto.categoria_id = Number(form.categoria_id);
    } else {
      producto.categoria_id = null;
    }

    Object.keys(producto).forEach((key) => {
      if (producto[key] === "" || producto[key] === undefined) {
        producto[key] = null;
      }
    });

    const { error } = await supabase
      .from("productos")
      .update(producto)
      .eq("id", id);

    if (error) {
      setError(
        "Ocurrió un error al editar el producto. Por favor revisa los campos e intenta nuevamente. Detalle: " +
          (error.message || "")
      );
    } else {
      handleVolver(); // Vuelve exactamente donde estabas
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] py-8">
      <div className="w-full max-w-2xl bg-white p-10 rounded-3xl shadow-2xl mx-auto animate-fade-in">
        <button
          className="mb-8 px-8 py-3 bg-gray-200 hover:bg-gray-300 text-black rounded-xl font-bold text-base shadow-md transition"
          onClick={handleVolver}
        >
          ← Volver
        </button>
        <h2 className="text-3xl font-black mb-8 text-center">Editar Producto</h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        {loading ? (
          <div className="text-gray-600 text-center py-12 text-lg">Cargando producto...</div>
        ) : !error && (
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} className="border p-4 rounded-xl text-lg" required />
            <input name="precio" type="number" placeholder="Precio" value={form.precio} onChange={handleChange} className="border p-4 rounded-xl text-lg" required />
            <select name="categoria_id" value={form.categoria_id || ""} onChange={handleChange} className="border p-4 rounded-xl text-lg">
              <option value="">Sin categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
            <input name="marca" placeholder="Marca" value={form.marca} onChange={handleChange} className="border p-4 rounded-xl text-lg" />
            <input name="talla" placeholder="Talla (ej: S, M, L, XL, 29, etc)" value={form.talla} onChange={handleChange} className="border p-4 rounded-xl text-lg" />
            <input name="color" placeholder="Color" value={form.color} onChange={handleChange} className="border p-4 rounded-xl text-lg" />
            <input name="stock" type="number" placeholder="Cantidad disponible" value={form.stock} onChange={handleChange} className="border p-4 rounded-xl text-lg" required />
            <div>
              <div className="font-bold mb-2">Imágenes del producto (URL):</div>
              {form.imagenes.map((img, idx) => (
                <div className="flex gap-2 mb-2" key={idx}>
                  <input
                    type="text"
                    placeholder={`URL de la imagen ${idx + 1}`}
                    className="border p-3 rounded-xl w-full text-lg"
                    value={img}
                    onChange={e => handleImagenChange(idx, e.target.value)}
                  />
                  {form.imagenes.length > 1 && (
                    <button
                      type="button"
                      className="bg-red-500 text-white px-3 rounded-xl font-bold"
                      onClick={() => handleRemoveImagen(idx)}
                      tabIndex={-1}
                    >x</button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="w-full bg-blue-500 text-white rounded-xl py-3 mt-2 font-bold"
                onClick={handleAddImagen}
              >
                + Agregar otra imagen
              </button>
            </div>
            <input name="glb_url" placeholder="URL modelo GLB/GLTF (Android/Web, opcional)" value={form.glb_url} onChange={handleChange} className="border p-4 rounded-xl text-lg" />
            <input name="usdz_url" placeholder="URL modelo USDZ (iPhone/iPad, opcional)" value={form.usdz_url} onChange={handleChange} className="border p-4 rounded-xl text-lg" />
            <textarea name="especificaciones" placeholder="Especificaciones" value={form.especificaciones} onChange={handleChange} className="border p-4 rounded-xl text-lg" />
            <textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} className="border p-4 rounded-xl text-lg" />
            <button type="submit" className="bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-bold text-lg">
              Guardar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
