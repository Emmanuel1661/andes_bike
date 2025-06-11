import { createRoot } from "react-dom/client";

/**
 * Renderiza un componente React a un div fuera del DOM React principal
 * y retorna una función para desmontarlo.
 */
export async function renderComponentToDiv(element, div) {
  const root = createRoot(div);
  root.render(element);
  // Espera a que React pinte (el timeout puede ser menos si lo prefieres)
  await new Promise((resolve) => setTimeout(resolve, 400));
  return () => root.unmount();
}
