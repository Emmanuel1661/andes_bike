import bicicletas from "../assets/bicicletas.jpg";

export default function BlackFridaySlider() {
  return (
    <section
      className="w-full relative overflow-hidden text-white"
      style={{
        height: '100dvh',
        backgroundImage: `url(${bicicletas})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Capa oscura global */}
      <div className="absolute inset-0 bg-black/30 z-0" />

      {/* Contenido más limpio y claro */}
      <div className="relative z-10 flex flex-col items-center justify-start h-full px-4 pt-[10%] text-center">
        <div className="px-6 py-6 sm:px-8 sm:py-7 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-xl max-w-2xl">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
            <span className="text-yellow-400 animate-shine">AndesBike</span>{" "}
            te da la bienvenida
          </h1>
          <p className="mt-3 text-sm sm:text-base md:text-lg text-white/90 font-light drop-shadow-sm">
            Vive la experiencia de pedalear con estilo. Bicicletas de montaña, ruta y downhill diseñadas para conquistar cualquier terreno.
          </p>
        </div>
      </div>

      {/* Estilos animados */}
      <style>
        {`
          @keyframes shine {
            0% { background-position: -200px; }
            100% { background-position: 200px; }
          }
          .animate-shine {
            background: linear-gradient(90deg, #fff 0%, #facc15 50%, #fff 100%);
            background-size: 400%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shine 4s linear infinite;
          }
        `}
      </style>
    </section>
  );
}
