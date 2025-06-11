import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { SearchProvider } from "./context/SearchContext";
import { FavoritosProvider } from "./context/FavoritosContext";
import "./index.css";

// Extra: puedes cargar el user desde localStorage si aún no tienes AuthContext
const storedUser = localStorage.getItem("user");
const user = storedUser ? JSON.parse(storedUser) : null;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <FavoritosProvider user={user}>
        <SearchProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </SearchProvider>
      </FavoritosProvider>
    </BrowserRouter>
  </React.StrictMode>
);
