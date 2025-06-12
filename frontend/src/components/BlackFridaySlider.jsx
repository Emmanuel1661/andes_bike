// src/components/BlackFridaySlider.jsx
// Slider principal con fondo visual profesional y cinta de promociones

import bicicletas from "../assets/bicicletas.jpg";
import PromoBanner from "./PromoBanner";

export default function BlackFridaySlider() {
  return (
    <div
      className="
        relative w-full 
        bg-cover bg-center bg-no-repeat
      "
      style={{
        backgroundImage: `url(${bicicletas})`,
        minHeight: "430px",
        height: "calc(100vh - 140px)",
        maxHeight: "720px",
      }}
    >
      {/* Banner tipo cinta */}
      <div className="absolute left-0 right-0 bottom-0 z-30">
        <PromoBanner speed={25} />
      </div>
    </div>
  );
}
