// src/components/SearchBar.jsx

/**
 * Componente SearchBar
 * - Barra de búsqueda reutilizable y 100% responsive
 * - Permite personalizar el placeholder, el valor, el evento onChange, etc.
 * - Usa Tailwind para asegurar responsividad y buen diseño en todos los tamaños de pantalla
 */

export default function SearchBar({
  value = "",
  onChange,
  placeholder = "Buscar productos...",
  className = "",
  ...props
}) {
  return (
    // Wrapper input con diseño adaptable en mobile y desktop
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      // Tailwind: w-full en mobile, tamaños mayores en pantallas grandes. Bordes suaves y padding pro.
      className={`
        block
        w-full               // Full width en móviles
        sm:w-80              // 320px a partir de sm
        md:w-96              // 384px a partir de md
        lg:w-[500px]         // 500px a partir de lg
        px-4 py-2
        rounded-xl
        text-black
        border border-yellow-300
        focus:ring-2 focus:ring-yellow-400 focus:outline-none
        shadow
        transition
        ${className}
      `}
      {...props}
    />
  );
}
