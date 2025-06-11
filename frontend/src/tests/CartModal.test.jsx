/* eslint-disable no-undef */
// src/tests/CartModal.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import CartModal from "../components/CartModal";
import { CartProvider } from "../context/CartContext";
import { MemoryRouter } from "react-router-dom";

// Mock necesario para useNavigate de react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

function renderCartModal(cart = [], user = null) {
  // Mock del contexto para personalizar el cart y user
  jest.spyOn(require("../context/CartContext"), "useCart").mockReturnValue({
    cart,
    removeFromCart: jest.fn(),
    updateQty: jest.fn(),
    clearCart: jest.fn(),
    user,
  });
  return render(
    <MemoryRouter>
      <CartModal isOpen={true} onClose={() => {}} />
    </MemoryRouter>
  );
}

describe("CartModal", () => {
  afterEach(() => jest.clearAllMocks());

  it("muestra mensaje de carrito vacío", () => {
    renderCartModal([]);
    expect(screen.getByText(/tu carrito está vacío/i)).toBeInTheDocument();
  });

  it("muestra productos en el carrito y total", () => {
    const cart = [
      { id: "1", nombre: "Bici Pro", precio: 1000000, qty: 2, stock: 5, imagen: "" },
      { id: "2", nombre: "Accesorio", precio: 10000, qty: 1, stock: 3, imagen: "" },
    ];
    renderCartModal(cart);
    expect(screen.getByText(/Bici Pro/)).toBeInTheDocument();
    expect(screen.getByText(/Accesorio/)).toBeInTheDocument();
    expect(screen.getByText(/2.010.000/)).toBeInTheDocument(); // total
  });

  it("muestra el botón para finalizar compra", () => {
    const cart = [{ id: "1", nombre: "Bici Pro", precio: 1000000, qty: 1, stock: 5, imagen: "" }];
    renderCartModal(cart);
    expect(screen.getByRole("button", { name: /finalizar compra/i })).toBeInTheDocument();
  });

  it("muestra alerta si intenta comprar sin iniciar sesión", () => {
    const cart = [{ id: "1", nombre: "Bici Pro", precio: 1000000, qty: 1, stock: 5, imagen: "" }];
    renderCartModal(cart, null);
    fireEvent.click(screen.getByRole("button", { name: /finalizar compra/i }));
    expect(screen.getByText(/inicia sesión para continuar/i)).toBeInTheDocument();
  });
});
