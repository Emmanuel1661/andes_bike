import bicicletaFondo from '../assets/bicicletas.jpg';
import { Sparkles } from "lucide-react";

// Hero.jsx: Banner principal visual con fondo y bienvenida
export default function Hero() {
  return (
    <section
      // Imagen de fondo y layout flexible: siempre cubre el ancho y alto de la pantalla según dispositivo
      className="relative w-full min-h-[340px] xs:min-h-[440px] sm:min-h-[560px] md:min-h-[700px] flex justify-center items-center rounded-2xl shadow-xl overflow-hidden"
      style={{
        backgroundImage: `url(${bicicletaFondo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay oscuro para dar contraste y legibilidad */}
      <div className="absolute inset-0 bg-black bg-opacity-35 rounded-2xl" />

      {/* Contenedor glass responsive (siempre centrado y con relleno dinámico según pantalla) */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 xs:px-6 sm:px-10 py-5 xs:py-10 sm:py-12 bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl sm:rounded-3xl shadow-2xl animate-fade-in glass-border-glow w-full max-w-full sm:max-w-3xl mx-auto">
        {/* Título animado */}
        <h1 className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl font-black leading-none mb-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] flex items-center gap-2 text-center">
          <span className="bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500 text-transparent bg-clip-text animate-shine drop-shadow-xl">
            Andes
          </span>
          <span className="text-white">Bike</span>
        </h1>
        {/* Badge bienvenida flotante */}
        <span className="inline-block mt-2 mb-5 px-4 py-1 bg-yellow-400/80 text-black text-sm xs:text-lg rounded-full font-semibold shadow-md animate-pop">
          ¡Bienvenido!
        </span>
        {/* Frase con icono */}
        <p className="flex items-center gap-2 text-base xs:text-xl sm:text-2xl md:text-3xl font-medium text-white/90 mb-1 drop-shadow text-center">
          <Sparkles className="inline-block w-5 h-5 xs:w-7 xs:h-7 text-yellow-300 animate-sparkle" />
          Vive la pasión por el ciclismo
        </p>
        {/* Descripción adaptada a tamaño de pantalla */}
        <p className="text-xs xs:text-base sm:text-xl text-white/85 max-w-2xl font-normal drop-shadow mb-2 text-center">
          Descubre el mundo sobre dos ruedas con nuestra selección premium de bicicletas de montaña, ruta y downhill, diseñadas para cada aventura.
        </p>
      </div>

      {/* Animaciones y glass personalizados */}
      <style>
        {`
          @keyframes fade-in { from { opacity: 0; transform: scale(0.98);} to { opacity: 1; transform: scale(1);} }
          .animate-fade-in { animation: fade-in 1s cubic-bezier(.41,1.03,.7,1.06);}
          @keyframes shine { 0%{background-position: -300px} 100%{background-position: 300px} }
          .animate-shine {
            background-size: 300% auto;
            animation: shine 2.5s linear infinite alternate;
          }
          @keyframes pop {0%{transform:scale(0.7); opacity:0;} 60%{transform:scale(1.1);} 80%{transform:scale(0.95);} 100%{transform:scale(1); opacity:1;}}
          .animate-pop {animation: pop 0.9s cubic-bezier(.18,1.6,.54,.93);}
          @keyframes sparkle { 0% { opacity: 0.6;} 60% { opacity: 1; scale:1.2;} 100% { opacity: 0.6; scale:1;}}
          .animate-sparkle {animation: sparkle 1.6s infinite alternate;}
          .glass-border-glow {
            box-shadow: 0 0 40px 6px rgba(255,220,130,0.16), 0 2px 32px rgba(0,0,0,0.28);
            border: 1.5px solid rgba(255,255,255,0.17);
            transition: box-shadow .2s;
          }
        `}
      </style>
    </section>
  );
}
