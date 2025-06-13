import { useState } from "react";
import { FaWhatsapp,FaPhone,FaMapMarkerAlt,FaEnvelope,FaInstagram,FaFacebook,FaTwitter,FaTiktok,FaYoutube,FaClock } from "react-icons/fa";
import logoAndesBike from "../assets/logo.png";
import { supabase } from "../lib/supabaseClient"; // Ajusta la ruta si es necesario

export default function Contacto() {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    mensaje: ""
  });
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.nombre || !form.correo || !form.mensaje) {
      setError("Por favor completa los campos obligatorios.");
      return;
    }
    // Solo envía los campos que EXISTEN en tu tabla
    const datos = {
      nombre: form.nombre,
      correo: form.correo,
      mensaje: form.mensaje,
      // Si tienes la columna "telefono", descomenta la línea de abajo:
      // telefono: form.telefono
    };
    const { error } = await supabase.from("mensajes_contacto").insert([datos]);
    if (error) {
      setError("Ocurrió un error al enviar el mensaje. Intenta de nuevo.");
    } else {
      setEnviado(true);
      setForm({ nombre: "", correo: "", telefono: "", mensaje: "" });
      setTimeout(() => setEnviado(false), 4000);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-[100vh] justify-start bg-gradient-to-br from-gray-100 via-white to-yellow-50 py-12 px-3">
      {/* Logo grande y bienvenida */}
      <div className="flex flex-col items-center mb-8">
        <div className="bg-white rounded-full border-8 border-yellow-400 shadow-2xl flex items-center justify-center mb-3" style={{ width: 220, height: 220 }}>
          <img
            src={logoAndesBike}
            alt="AndesBike Logo"
            className="w-52 h-52 drop-shadow-xl"
          />
        </div>
        <h2 className="text-4xl font-extrabold text-gray-900 mb-2 text-center">¡Estamos para ayudarte!</h2>
        <p className="text-gray-500 text-lg text-center max-w-2xl mb-2">
          ¿Tienes dudas, sugerencias o necesitas ayuda? <br />
          Escríbenos y te responderemos lo más pronto posible.
        </p>
        <span className="font-semibold text-yellow-700 italic mb-2">
          Pedalea con pasión. ¡Tu experiencia es nuestra prioridad!
        </span>
      </div>

      {/* Contenido principal (datos y formulario) */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Información de contacto */}
        <div className="bg-white/95 rounded-3xl shadow-2xl p-10 flex flex-col gap-6 border-2 border-yellow-100 items-center md:items-start">
          <h3 className="text-lg font-extrabold text-gray-900 mb-2">Datos de contacto</h3>
          <div className="flex items-center gap-3 text-base font-medium">
            <FaEnvelope className="text-yellow-600" />
            <span className="font-semibold">andesbike@bicis.com</span>
          </div>
          <div className="flex items-center gap-3 text-base font-medium">
            <FaWhatsapp className="text-green-600" />
            <a href="https://wa.me/573012345678" className="hover:underline" target="_blank" rel="noopener noreferrer">
              +57 301 234 5678
            </a>
          </div>
          <div className="flex items-center gap-3 text-base font-medium">
            <FaPhone className="text-black" />
            +57 301 234 5678
          </div>
          <div className="flex items-center gap-3 text-base font-medium">
            <FaMapMarkerAlt className="text-red-600" />
            Calle 123 #45-67, Ciudad, Colombia
          </div>
          <div className="flex items-center gap-3 text-base font-medium">
            <FaClock className="text-yellow-500" />
            <span>Lun-Sab: 8:00 am - 6:00 pm</span>
          </div>
          {/* Redes sociales */}
          <div className="flex items-center gap-5 mt-4">
            <a href="#" target="_blank" rel="noopener noreferrer" title="Instagram">
              <FaInstagram className="text-pink-600 hover:scale-110 transition text-2xl" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" title="Facebook">
              <FaFacebook className="text-blue-700 hover:scale-110 transition text-2xl" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" title="Twitter">
              <FaTwitter className="text-sky-500 hover:scale-110 transition text-2xl" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" title="TikTok">
              <FaTiktok className="text-black hover:scale-110 transition text-2xl" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" title="YouTube">
              <FaYoutube className="text-red-600 hover:scale-110 transition text-2xl" />
            </a>
          </div>
        </div>
        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/95 rounded-3xl shadow-2xl p-10 flex flex-col gap-6 border-2 border-yellow-100"
        >
          <h3 className="text-xl font-black text-gray-900 mb-2 text-center md:text-left">
            Formulario de Contacto
          </h3>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-gray-800 font-bold text-sm mb-1 block">Nombre*</label>
              <input
                required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-yellow-500 transition"
                type="text"
                placeholder="Escribe tu nombre"
                value={form.nombre}
                onChange={e => setForm({ ...form, nombre: e.target.value })}
              />
            </div>
            <div>
              <label className="text-gray-800 font-bold text-sm mb-1 block">Correo electrónico*</label>
              <input
                required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-yellow-500 transition"
                type="email"
                placeholder="tucorreo@email.com"
                value={form.correo}
                onChange={e => setForm({ ...form, correo: e.target.value })}
              />
            </div>
            <div>
              <label className="text-gray-800 font-bold text-sm mb-1 block">Teléfono</label>
              <input
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-yellow-500 transition"
                type="text"
                placeholder="(opcional)"
                value={form.telefono}
                onChange={e => setForm({ ...form, telefono: e.target.value })}
              />
            </div>
            <div>
              <label className="text-gray-800 font-bold text-sm mb-1 block">Mensaje*</label>
              <textarea
                required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-yellow-500 transition min-h-[80px]"
                placeholder="Cuéntanos cómo podemos ayudarte..."
                value={form.mensaje}
                onChange={e => setForm({ ...form, mensaje: e.target.value })}
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-2 bg-yellow-700 hover:bg-yellow-600 text-white text-lg font-bold py-2 rounded-xl shadow-xl transition-all duration-150 active:scale-95"
            disabled={enviado}
          >
            {enviado ? "¡Mensaje enviado!" : "Enviar mensaje"}
          </button>
          {error && (
            <div className="text-red-600 text-center mt-2 font-semibold">{error}</div>
          )}
          {enviado && (
            <div className="text-green-600 text-center mt-2 font-semibold animate-pulse">
              ¡Gracias por contactarnos! Te responderemos pronto.
            </div>
          )}
        </form>
      </div>
      {/* Mapa Google abajo */}
      <div className="w-full max-w-5xl mt-8 rounded-3xl shadow-xl overflow-hidden border-2 border-yellow-100">
        <iframe
          title="Ubicación AndesBike"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3978.0786777097846!2d-76.07648694505734!3d4.396378294527262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e38482fd4a54b71%3A0xcdc08a8881195ebc!2sCra.%2014%20%237c-2%20a%207c-214%2C%20Zarzal%2C%20Valle%20del%20Cauca!5e0!3m2!1ses-419!2sco!4v1748354745159!5m2!1ses-419!2sco"
          width="100%"
          height="330"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}
