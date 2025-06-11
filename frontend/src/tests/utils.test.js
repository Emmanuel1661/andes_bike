/* eslint-disable no-undef */
// src/tests/utils.test.js
import { vi } from "vitest";

// Mock window.alert antes de importar finalizarCompra
global.alert = vi.fn();

import finalizarCompra from "../utils/finalizarCompra";

// Mock supabase para evitar llamadas reales
vi.mock("../lib/supabaseClient", () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: { id: "user-id" }, error: null }),
    insert: vi.fn().mockResolvedValue({ data: { id: "pedido-id" }, error: null }),
    update: vi.fn().mockResolvedValue({}),
    order: vi.fn().mockReturnThis(),
  },
}));

describe("finalizarCompra", () => {
  it("retorna null si el carrito está vacío", async () => {
    const result = await finalizarCompra({ user: { id: "1" }, cart: [], clearCart: vi.fn(), direccionEnvio: "" });
    expect(result).toBeNull();
  });

  it("retorna null si el usuario no es válido", async () => {
    const result = await finalizarCompra({ user: null, cart: [{ id: "1", precio: 1000, qty: 2 }], clearCart: vi.fn(), direccionEnvio: "" });
    expect(result).toBeNull();
  });

  // Puedes agregar más pruebas mockeando los retornos de supabase para simular errores de BD, etc.
});
