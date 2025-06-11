import { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, Phone, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginModal({ onClose }) {
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    telefono: "",
    direccion: "",
  });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      if (!formData.email || !formData.password || !formData.name) {
        setMessage("Por favor llena todos los campos obligatorios.");
        return;
      }
      const response = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nombre: formData.name,
            telefono: formData.telefono,
            direccion: formData.direccion,
            rol: "cliente",
          },
        },
      });

      if (response.error) {
        if (response.error.message.includes("User already registered")) {
          setMessage("⚠️ Esta cuenta ya está registrada.");
        } else {
          setMessage("❌ Error: " + response.error.message);
        }
      } else if (response.data?.user) {
        const { id } = response.data.user;
        const { error: insertError } = await supabase
          .from("usuarios")
          .insert([
            {
              id,
              nombre: formData.name,
              correo: formData.email,
              telefono: formData.telefono,
              direccion: formData.direccion,
              rol: "cliente",
              verificado: false,
            },
          ]);
        if (insertError && insertError.code !== "23505") {
          setMessage("Error al guardar en la base de datos: " + insertError.message);
        } else {
          setMessage("✅ Cuenta creada. Revisa tu correo.");
        }
      }
    } catch (e) {
      setMessage("❌ Error inesperado: " + e.message);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (response.error) {
        setMessage("❌ Error: " + response.error.message);
      } else if (response.data?.user) {
        setMessage("✅ Sesión iniciada.");
        localStorage.setItem("user", JSON.stringify(response.data.user));
        const user = response.data.user;
        const { data: existe } = await supabase
          .from("usuarios")
          .select("id")
          .eq("id", user.id)
          .single();
        if (!existe) {
          await supabase.from("usuarios").insert([
            {
              id: user.id,
              nombre: user.user_metadata?.nombre || "",
              correo: user.email,
              telefono: user.user_metadata?.telefono || "",
              direccion: user.user_metadata?.direccion || "",
              rol: user.user_metadata?.rol || "cliente",
              verificado: true,
            },
          ]);
        }
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (e) {
      setMessage("❌ Error inesperado: " + e.message);
    }
  };

  const renderForm = () => {
    switch (activeTab) {
      case "login":
        return (
          <>
            <h2 className="text-2xl xs:text-3xl font-bold text-center text-gray-800 mb-5 xs:mb-6">Bienvenido</h2>
            <label className="text-sm text-gray-700 flex items-center gap-2"><Mail className="w-4 h-4" /> Correo</label>
            <input
              name="email"
              type="email"
              placeholder="Ingresa tu correo"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-black"
            />
            <label className="text-sm text-gray-700 flex items-center gap-2 mt-4"><Lock className="w-4 h-4" /> Contraseña</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Ingresa tu contraseña"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg text-black"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <button
              type="button"
              onClick={handleLogin}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white p-3 rounded-lg font-semibold mt-6 transition"
            >
              Iniciar Sesión
            </button>
            <div className="flex flex-wrap justify-center space-x-3 xs:space-x-4 mt-5 xs:mt-6 text-sm">
              <span className="text-yellow-600 cursor-pointer" onClick={() => setActiveTab("recover")}>Recuperar contraseña</span>
              <span className="text-gray-400">|</span>
              <span className="text-yellow-600 cursor-pointer" onClick={() => setActiveTab("register")}>Registrarse</span>
            </div>
          </>
        );
      case "register":
        return (
          <>
            <h2 className="text-2xl xs:text-3xl font-bold text-center text-gray-800 mb-3 xs:mb-4">Registro</h2>
            <input
              name="name"
              type="text"
              placeholder="Nombre completo"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-black"
            />
            <input
              name="email"
              type="email"
              placeholder="Correo"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg mt-2 text-black"
            />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg mt-2 text-black"
            />
            <input
              name="telefono"
              type="tel"
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg mt-2 text-black"
            />
            <input
              name="direccion"
              type="text"
              placeholder="Dirección"
              value={formData.direccion}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg mt-2 text-black"
            />
            <button
              type="button"
              onClick={handleRegister}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white p-3 rounded-lg font-semibold mt-4 transition"
            >
              Crear cuenta
            </button>
            <p className="text-sm text-center text-gray-500 mt-4">
              ¿Ya tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => setActiveTab("login")}
                className="text-yellow-600 underline hover:text-yellow-700 focus:outline-none"
              >
                Iniciar sesión
              </button>
            </p>
          </>
        );
      case "recover":
        return (
          <>
            <h2 className="text-2xl xs:text-3xl font-bold text-center text-gray-800 mb-3 xs:mb-4">Recuperar contraseña</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setMessage("");
                try {
                  const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
                    redirectTo: window.location.origin + "/reset-password",
                  });
                  if (error) {
                    setMessage("❌ " + error.message);
                  } else {
                    setMessage("🔗 Si tu correo está registrado, recibirás el enlace para cambiar la contraseña. Revisa tu SPAM.");
                  }
                } catch (err) {
                  setMessage("❌ Error inesperado: " + err.message);
                }
              }}
              className="flex flex-col gap-3"
              autoComplete="off"
            >
              <input
                name="email"
                type="email"
                placeholder="Correo registrado"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg text-black"
                required
              />
              <button
                type="submit"
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white p-3 rounded-lg font-semibold mt-4 transition"
              >
                Enviar enlace
              </button>
            </form>
            <p className="text-sm text-center text-gray-500 mt-4">
              ¿Ya tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => setActiveTab("login")}
                className="text-yellow-600 underline hover:text-yellow-700 focus:outline-none"
              >
                Iniciar sesión
              </button>
            </p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white p-5 xs:p-8 rounded-2xl shadow-xl w-full max-w-xs xs:max-w-md sm:max-w-lg relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl font-bold text-gray-500 hover:text-black"
        >
          ×
        </button>
        {message && (
          <div className="mb-4 text-sm text-center text-yellow-700 font-medium">{message}</div>
        )}
        <div className="flex flex-col gap-3">{renderForm()}</div>
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(-30px);} to { opacity: 1; transform: translateY(0);} }
        .animate-fade-in { animation: fade-in 0.4s cubic-bezier(.16,1.2,.52,1.11);}
      `}</style>
    </div>
  );
}
