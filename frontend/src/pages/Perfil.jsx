/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/Perfil.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Perfil() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ nombre: "", telefono: "", direccion: "" });
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setForm({
        nombre: parsed.user_metadata?.nombre || "",
        telefono: parsed.user_metadata?.telefono || "",
        direccion: parsed.user_metadata?.direccion || "",
      });
    } else {
      navigate("/");
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardarCambios = () => {
    const actualizado = {
      ...user,
      user_metadata: {
        ...user.user_metadata,
        nombre: form.nombre,
        telefono: form.telefono,
        direccion: form.direccion,
      },
    };
    localStorage.setItem("user", JSON.stringify(actualizado));
    setUser(actualizado);
    setEditando(false);
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-xl text-center animate-fade-in">
      <h1 className="text-3xl font-bold text-yellow-700 mb-6">Mi Perfil</h1>

      <div className="space-y-4 text-left">
        <div>
          <label className="font-semibold text-gray-700">Nombre:</label>
          {editando ? (
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="input"
            />
          ) : (
            <p className="text-gray-900">{form.nombre || "-"}</p>
          )}
        </div>

        <div>
          <label className="font-semibold text-gray-700">Correo:</label>
          <p className="text-gray-900">{user.email}</p>
        </div>

        <div>
          <label className="font-semibold text-gray-700">Teléfono:</label>
          {editando ? (
            <input
              type="text"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="input"
            />
          ) : (
            <p className="text-gray-900">{form.telefono || "-"}</p>
          )}
        </div>

        <div>
          <label className="font-semibold text-gray-700">Dirección:</label>
          {editando ? (
            <input
              type="text"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              className="input"
            />
          ) : (
            <p className="text-gray-900">{form.direccion || "-"}</p>
          )}
        </div>

        <div>
          <label className="font-semibold text-gray-700">Rol:</label>
          <p className="text-gray-900 capitalize">
            {user.user_metadata?.rol || "cliente"}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
        {editando ? (
          <>
            <button
              onClick={guardarCambios}
              className="bg-green-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-green-700"
            >
              Guardar Cambios
            </button>
            <button
              onClick={() => setEditando(false)}
              className="bg-gray-300 text-black px-5 py-2 rounded-lg font-semibold hover:bg-gray-400"
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditando(true)}
              className="bg-yellow-500 text-white px-5 py-2 rounded-lg font-bold hover:bg-yellow-600"
            >
              Editar Perfil
            </button>
            <button
              onClick={() => navigate(-1)}
              className="border border-gray-400 text-gray-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-100"
            >
              Volver
            </button>
          </>
        )}
      </div>

      <style>{`
        .input {
          width: 100%;
          padding: 0.5rem;
          border-radius: 0.5rem;
          border: 1px solid #ccc;
          margin-top: 0.25rem;
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
}
