// Página principal (Home) de AndesBike
// Renderiza el slider de promociones y asegura responsividad total

import BlackFridaySlider from "../components/BlackFridaySlider";

export default function Home() {
  return (
    // Contenedor principal siempre toma 100% del ancho y centra contenido
    <div
      className="
        w-full
        flex flex-col items-center
        px-2 xs:px-4 md:px-8
        py-4 md:py-8
        min-h-[60vh]
      "
    >
      {/* Slider principal de promociones, se adapta automáticamente */}
      <BlackFridaySlider />
    </div>
  );
}
