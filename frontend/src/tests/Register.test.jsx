/* eslint-disable no-undef */
// src/tests/Register.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import Register from "../pages/Register";

describe("Register", () => {
  it("renderiza formulario de registro", () => {
    render(<Register />);
    expect(screen.getByText(/registro/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/nombre completo/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /registrarse/i })).toBeInTheDocument();
  });

  it("muestra error si se envía vacío", () => {
    render(<Register />);
    fireEvent.click(screen.getByRole("button", { name: /registrarse/i }));
    expect(screen.getByText(/por favor completa los campos/i)).toBeInTheDocument();
  });
});
