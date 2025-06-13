import { vi, describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "../context/CartContext";

// ---------- helpers ----------
function wrapper({ children }) {
  return <CartProvider>{children}</CartProvider>;
}
// --------------------------------

describe("CartContext", () => {
  beforeEach(() => {
    // Reinicia mocks antes de cada ‘it’
    vi.clearAllMocks();
  });

  it("añade un producto al carrito", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart({ id: "1", nombre: "Bici Pro", precio: 1000 });
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].nombre).toBe("Bici Pro");
  });

  it("actualiza la cantidad de un producto", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart({ id: "1", nombre: "Bici Pro", precio: 1000 });
      result.current.updateQty("1", 3);
    });

    expect(result.current.cart[0].qty).toBe(3);
  });

  it("elimina un producto del carrito", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart({ id: "1", nombre: "Bici Pro", precio: 1000 });
      result.current.removeFromCart("1");
    });

    expect(result.current.cart).toHaveLength(0);
  });

  it("vacía el carrito", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart({ id: "1", nombre: "Bici Pro", precio: 1000 });
      result.current.addToCart({ id: "2", nombre: "Accesorio", precio: 50 });
      result.current.clearCart();
    });

    expect(result.current.cart).toHaveLength(0);
  });
});
