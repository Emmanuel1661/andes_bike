import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

const categorias = [
  { id: 1, nombre: "Ruta" },
  { id: 2, nombre: "Montaña" },
  { id: 3, nombre: "Downhill" },
];

export default function AdminProductoNuevo() {
  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    categoria_id: "",
    especificaciones: "",
    talla: "",
    descripcion: "",
    stock: "",
    color: "",
    marca: "",
    glb_url: "",
    usdz_url: "",
  });
  const [imagenes, setImagenes] = useState([""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImagenChange = (index, value) => {
    const nuevas = [...imagenes];
    nuevas[index] = value;
    setImagenes(nuevas);
  };

  const agregarCampoImagen = () => setImagenes([...imagenes, ""]);
  const quitarCampoImagen = (index) =>
    setImagenes(imagenes.filter((_, i) => i !== index));

  const handleVolver = () => {
    navigate("/admin");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.nombre ||
      !form.precio ||
      !form.categoria_id ||
      !imagenes[0] ||
      !form.stock
    ) {
      setError("Completa todos los campos obligatorios.");
      return;
    }

    const producto = {
      nombre: form.nombre,
      precio: Number(form.precio),
      categoria_id: Number(form.categoria_id),
      imagenes,
      especificaciones: form.especificaciones,
      talla: form.talla,
      descripcion: form.descripcion,
      stock: Number(form.stock),
      color: form.color,
      marca: form.marca,
      glb_url: form.glb_url || null,
      usdz_url: form.usdz_url || null,
    };

    const { error } = await supabase.from("productos").insert([producto]);

    if (error) {
      setError(
        "Ocurrió un error al crear el producto. Detalle: " +
          (error.message || "")
      );
      setSuccess("");
    } else {
      setSuccess("¡Producto creado correctamente!");
      setError("");
      setForm({
        nombre: "",
        precio: "",
        categoria_id: "",
        especificaciones: "",
        talla: "",
        descripcion: "",
        stock: "",
        color: "",
        marca: "",
        glb_url: "",
        usdz_url: "",
      });
      setImagenes([""]);
      setTimeout(() => navigate("/admin"), 1000);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] py-8">
      <div className="w-full max-w-3xl bg-white p-12 rounded-3xl shadow-2xl mx-auto animate-fade-in">
        <button
          className="mb-8 px-10 py-3 bg-gray-200 hover:bg-gray-300 text-black rounded-xl font-bold text-base shadow-md transition"
          onClick={handleVolver}
        >
          ← Volver
        </button>
        <h2 className="text-3xl font-black mb-10 text-center">Nuevo Producto</h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        {success && <div className="text-green-600 mb-4">{success}</div>}
        <form className="flex flex-col gap-7" onSubmit={handleSubmit}>
          <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} className="border p-4 rounded-xl text-lg" />
          <input name="precio" type="number" placeholder="Precio" value={form.precio} onChange={handleChange} className="border p-4 rounded-xl text-lg" />
          <select name="categoria_id" value={form.categoria_id} onChange={handleChange} className="border p-4 rounded-xl text-lg" required>
            <option value="">Selecciona una categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
          <input name="marca" placeholder="Marca" value={form.marca} onChange={handleChange} className="border p-4 rounded-xl text-lg" />
          <input name="talla" placeholder="Talla (ej: S, M, L, XL, 29, etc)" value={form.talla} onChange={handleChange} className="border p-4 rounded-xl text-lg" />
          <input name="color" placeholder="Color" value={form.color} onChange={handleChange} className="border p-4 rounded-xl text-lg" />
          <input name="stock" type="number" placeholder="Cantidad disponible" value={form.stock} onChange={handleChange} className="border p-4 rounded-xl text-lg" required />
          {/* Multi-imagen */}
          <label className="font-semibold">Imágenes del producto (URL):</label>
          {imagenes.map((img, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="url"
                placeholder={`URL de la imagen ${idx + 1}`}
                value={img}
                onChange={e => handleImagenChange(idx, e.target.value)}
                className="w-full p-3 border rounded-xl text-lg"
                required={idx === 0}
              />
              {idx > 0 && (
                <button
                  type="button"
                  className="bg-red-500 text-white px-3 rounded-xl"
                  onClick={() => quitarCampoImagen(idx)}
                  tabIndex={-1}
                >
                  x
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="w-full bg-blue-500 text-white rounded-xl py-3 mt-2 font-bold"
            onClick={agregarCampoImagen}
          >
            + Agregar otra imagen
          </button>
          <input name="glb_url" placeholder="URL modelo GLB/GLTF (Android/Web, opcional)" value={form.glb_url} onChange={handleChange} className="border p-4 rounded-xl text-lg" />
          <input name="usdz_url" placeholder="URL modelo USDZ (iPhone/iPad, opcional)" value={form.usdz_url} onChange={handleChange} className="border p-4 rounded-xl text-lg" />
          <textarea name="especificaciones" placeholder="Especificaciones" value={form.especificaciones} onChange={handleChange} className="border p-4 rounded-xl text-lg" />
          <textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} className="border p-4 rounded-xl text-lg" />
          <button type="submit" className="bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-bold text-lg">
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
}
