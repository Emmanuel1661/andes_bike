import { useState, useRef, useLayoutEffect } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Lista de promociones para mostrar en el banner
const promos = [
  {
    text: "🔥 BLACK FRIDAY: Hasta -40% en toda la tienda!",
    link: "/outlet",
    icon: "🔥"
  },
  {
    text: "🚴‍♂️ Nueva MTB Pro X disponible. ¡Conócela!",
    link: "/bicicletas/tu-id-producto",
    icon: "🚴‍♂️"
  },
  {
    text: "🛠️ Nuevo servicio de taller profesional disponible.",
    link: "/taller",
    icon: "🛠️"
  }
];

const VELOCIDAD_PX_POR_SEG = 120;

export default function PromoBanner() {
  const [closed, setClosed] = useState(false);
  const [current, setCurrent] = useState(0);
  const [anim, setAnim] = useState({ duration: 5, key: 0 });
  const navigate = useNavigate();
  const spanRef = useRef();
  const containerRef = useRef();

  // Calcula la duración de la animación de texto según ancho de pantalla y texto
  useLayoutEffect(() => {
    if (closed) return;
    function recalc() {
      const texto = spanRef.current;
      const container = containerRef.current;
      if (!texto || !container) return;
      const textWidth = texto.offsetWidth;
      const contWidth = container.offsetWidth;
      const distance = contWidth + textWidth + 60;
      const duration = distance / VELOCIDAD_PX_POR_SEG;
      setAnim(a => ({
        duration,
        key: a.key + 1
      }));
    }
    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, [current, closed]);

  // Cambia automáticamente a la siguiente promo después de la animación
  useLayoutEffect(() => {
    if (closed) return;
    const timer = setTimeout(() => {
      setCurrent(c => (c + 1) % promos.length);
    }, anim.duration * 1000);
    return () => clearTimeout(timer);
  }, [anim.duration, closed, anim.key]);

  if (closed) return null;

  return (
    // Contenedor fijo inferior siempre ocupa ancho completo (responsive)
    <div className="fixed left-0 bottom-0 w-full z-[200] pointer-events-none select-none">
      <div
        // Fondo semitransparente y desenfoque, barra horizontal
        className="
          relative w-full flex items-center gap-4
          pointer-events-auto overflow-hidden
          backdrop-blur-xl"
        style={{
          background: "rgba(24,24,24,0.58)",
          minHeight: 58,
          boxShadow: "0 2px 20px #0008"
        }}
        onClick={() => navigate(promos[current].link)}
        ref={containerRef}
      >
        {/* Degradado lateral izquierdo para efecto fade */}
        <div className="absolute left-0 top-0 h-full w-20 xs:w-32 z-30 pointer-events-none"
          style={{
            background: "linear-gradient(to right, #181818 90%, transparent 100%)"
          }}
        />
        {/* Degradado lateral derecho para efecto fade */}
        <div className="absolute right-0 top-0 h-full w-20 xs:w-32 z-30 pointer-events-none"
          style={{
            background: "linear-gradient(to left, #181818 90%, transparent 100%)"
          }}
        />
        {/* Icono promocional animado */}
        <span className="text-xl xs:text-2xl md:text-3xl animate-bounce drop-shadow-lg mr-2 z-20">
          {promos[current].icon}
        </span>
        {/* Texto de la promo animado tipo "marquee", adaptado a todo ancho */}
        <div className="relative flex-1 min-w-0 overflow-hidden z-20">
          <span
            key={anim.key}
            ref={spanRef}
            className="inline-block whitespace-nowrap font-extrabold text-xs xs:text-base md:text-2xl text-white tracking-wide drop-shadow-xl transition-opacity"
            style={{
              animation: `marquee-pro ${anim.duration}s linear forwards`,
              willChange: "transform"
            }}
          >
            {promos[current].text}
          </span>
        </div>
        {/* Botón de cerrar banner, siempre visible y accesible */}
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white bg-black/60 hover:bg-black/90 transition rounded-full w-8 h-8 flex items-center justify-center shadow-md z-40"
          onClick={e => {
            e.stopPropagation();
            setClosed(true);
          }}
        >
          <X size={22} />
        </button>
        {/* Animación marquee */}
        <style>
          {`
            @keyframes marquee-pro {
              0%   { transform: translateX(-100%);}
              100% { transform: translateX(100%);}
            }
          `}
        </style>
      </div>
    </div>
  );
}
