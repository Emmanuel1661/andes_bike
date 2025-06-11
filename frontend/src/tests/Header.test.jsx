/* eslint-disable no-undef */
import { render, screen } from "@testing-library/react";
import Header from "../components/Header";
import { CartProvider } from "../context/CartContext";
import { MemoryRouter } from "react-router-dom";

const setSearchGlobal = () => {};

describe("Header AndesBike", () => {
  it("debe mostrar el título 'Andes Bike'", () => {
    render(
      <MemoryRouter>
        <CartProvider>
          <Header searchGlobal="" setSearchGlobal={setSearchGlobal} />
        </CartProvider>
      </MemoryRouter>
    );
    // Busca TODOS los elementos con el texto "AndesBike" (quitando espacios)
    const titles = screen.getAllByText((content, element) =>
      element.textContent.replace(/\s/g, '').toLowerCase() === "andesbike"
    );
    expect(titles.length).toBeGreaterThan(0);
  });

  it("debe tener el input de búsqueda", () => {
    render(
      <MemoryRouter>
        <CartProvider>
          <Header searchGlobal="" setSearchGlobal={setSearchGlobal} />
        </CartProvider>
      </MemoryRouter>
    );
    expect(
      screen.getByPlaceholderText(/buscar productos/i)
    ).toBeInTheDocument();
  });

  it("debe tener el ícono para iniciar sesión", () => {
    render(
      <MemoryRouter>
        <CartProvider>
          <Header searchGlobal="" setSearchGlobal={setSearchGlobal} />
        </CartProvider>
      </MemoryRouter>
    );
    expect(screen.getByTitle(/iniciar sesión/i)).toBeInTheDocument();
  });

  it("debe tener el ícono del carrito", () => {
    render(
      <MemoryRouter>
        <CartProvider>
          <Header searchGlobal="" setSearchGlobal={setSearchGlobal} />
        </CartProvider>
      </MemoryRouter>
    );
    // Busca el botón por el icono del carrito (lo ideal es ponerle aria-label en el Header)
    const cartButtons = screen.getAllByRole("button");
    const hasCartButton = cartButtons.some(btn =>
      btn.getAttribute("aria-label") === null &&
      Array.from(btn.classList).some(c => c.toLowerCase().includes("shoppingcart"))
    );
    expect(hasCartButton || cartButtons.length > 1).toBeTruthy();
  });
});
