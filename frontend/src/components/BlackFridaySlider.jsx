// src/components/BlackFridaySlider.jsx
import bicicletas from "../assets/bicicletas.jpg";
import PromoBanner from "./PromoBanner";

export default function BlackFridaySlider() {
  return (
    <div className="relative w-full">
      {/* Imagen de fondo, sin bordes ni centrado */}
      <img
        src={bicicletas}
        alt="AndesBike Bienvenida"
        className="w-full h-[calc(100vh-140px)] object-cover object-center"
        style={{
          minHeight: "430px",
          maxHeight: "720px",
          display: "block",    // Elimina espacios extra abajo
          borderRadius: 0,     // Sin bordes redondeados
          margin: 0,           // Sin márgenes
          padding: 0           // Sin padding
        }}
      />
      {/* Banner tipo cinta */}
      <div className="absolute left-0 right-0 bottom-0 z-30">
        <PromoBanner speed={25} />
      </div>
    </div>
  );
}
