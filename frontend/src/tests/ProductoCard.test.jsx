/* eslint-disable no-undef */
// src/tests/ProductoCard.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import ProductoCard from "../components/ProductoCard";
import { vi } from "vitest";

const producto = {
  id: "1",
  nombre: "Bicicleta Montaña",
  precio: 2500000,
  stock: 10,
  imagenes: ["https://via.placeholder.com/400x250?text=Producto"],
  descripcion: "Una bici top",
  tipo: "montaña",
  marca: "Andes",
};

describe("ProductoCard", () => {
  it("muestra el nombre y el precio", () => {
    render(<ProductoCard producto={producto} onAddToCart={() => {}} />);
    expect(screen.getByText(/Bicicleta Montaña/i)).toBeInTheDocument();
    expect(screen.getByText(/2.500.000/)).toBeInTheDocument();
  });

  it("muestra el botón de agregar al carrito", () => {
    render(<ProductoCard producto={producto} onAddToCart={() => {}} />);
    // Selecciona por título, no por role (¡ya no hay ambigüedad!)
    expect(screen.getByTitle(/agregar al carrito/i)).toBeInTheDocument();
  });

  it("deshabilita el botón si no hay stock", () => {
    render(<ProductoCard producto={{ ...producto, stock: 0 }} onAddToCart={() => {}} />);
    // Selecciona solo el botón de agregar al carrito
    expect(screen.getByTitle(/agregar al carrito/i)).toBeDisabled();
  });

  it("ejecuta onAddToCart al hacer click", () => {
    const handleAdd = vi.fn();
    render(<ProductoCard producto={producto} onAddToCart={handleAdd} />);
    fireEvent.click(screen.getByTitle(/agregar al carrito/i));
    expect(handleAdd).toHaveBeenCalled();
  });
});
