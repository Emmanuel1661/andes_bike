/* eslint-disable no-undef */
import { render, act } from "@testing-library/react";
import { CartProvider, useCart } from "../context/CartContext";
import React from "react";

// Componente de prueba
function TestComponent() {
  const { cart, addToCart, updateQty, removeFromCart, clearCart } = useCart();
  return (
    <div>
      <button onClick={() => addToCart({ id: 1, nombre: "Producto A", precio: 100, qty: 1 })}>Agregar</button>
      <button onClick={() => updateQty(1, 5)}>Actualizar</button>
      <button onClick={() => removeFromCart(1)}>Eliminar</button>
      <button onClick={() => clearCart()}>Vaciar</button>
      <div data-testid="cart-length">{cart.length}</div>
      <div data-testid="qty">{cart[0]?.qty || 0}</div>
      <div data-testid="nombre">{cart[0]?.nombre || ""}</div>
    </div>
  );
}

describe("CartContext (modo localStorage)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("agrega un producto al carrito", () => {
    const { getByText, getByTestId } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    act(() => {
      getByText("Agregar").click();
    });
    expect(getByTestId("cart-length").textContent).toBe("1");
    expect(getByTestId("nombre").textContent).toBe("Producto A");
  });

  it("actualiza la cantidad de un producto", () => {
    const { getByText, getByTestId } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    act(() => {
      getByText("Agregar").click();
      getByText("Actualizar").click();
    });
    expect(getByTestId("qty").textContent).toBe("5");
  });

  it("elimina un producto del carrito", () => {
    const { getByText, getByTestId } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    act(() => {
      getByText("Agregar").click();
      getByText("Eliminar").click();
    });
    expect(getByTestId("cart-length").textContent).toBe("0");
  });

  it("vacía el carrito", () => {
    const { getByText, getByTestId } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    act(() => {
      getByText("Agregar").click();
      getByText("Vaciar").click();
    });
    expect(getByTestId("cart-length").textContent).toBe("0");
  });
});
