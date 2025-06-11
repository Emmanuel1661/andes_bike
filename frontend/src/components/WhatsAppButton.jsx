// Botón flotante de WhatsApp, siempre visible en esquina inferior derecha
export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/573016146956?text=Hola%20AndesBike%2C%20quiero%20más%20información%20sobre%20una%20bicicleta"
      target="_blank"
      rel="noopener noreferrer"
      className="
        fixed bottom-5 right-4
        sm:bottom-8 sm:right-7
        z-50
        flex items-center justify-center
        transition-transform hover:scale-110
        group
      "
      aria-label="Chat en WhatsApp"
    >
      {/* Ícono WhatsApp SVG, tamaño responsivo */}
      <img
        src="https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/whatsapp.svg"
        alt="WhatsApp"
        className="
          w-14 h-14
          xs:w-16 xs:h-16
          sm:w-20 sm:h-20
          rounded-full shadow-2xl
          bg-white p-3
          border-4 border-green-400
          group-hover:border-green-500
          transition
        "
        style={{ background: "#25D366" }}
      />
    </a>
  );
}
