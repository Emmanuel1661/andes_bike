/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const FavoritosContext = createContext();

export function useFavoritos() {
  return useContext(FavoritosContext);
}

export function FavoritosProvider({ user, children }) {
  const [favoritos, setFavoritos] = useState([]);

  const fetchFavoritos = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("favoritos")
      .select("producto_id")
      .eq("usuario_id", user.id);
    if (!error && data) {
      setFavoritos(data.map(f => f.producto_id));
    }
  };

  const toggleFavorito = async (producto_id) => {
    if (!user) return;
    const yaExiste = favoritos.includes(producto_id);
    if (yaExiste) {
      await supabase
        .from("favoritos")
        .delete()
        .eq("usuario_id", user.id)
        .eq("producto_id", producto_id);
    } else {
      await supabase
        .from("favoritos")
        .insert({ usuario_id: user.id, producto_id });
    }
    fetchFavoritos(); // actualizar
  };

  useEffect(() => {
    fetchFavoritos();
  }, [user]);

  return (
    <FavoritosContext.Provider value={{ favoritos, toggleFavorito }}>
      {children}
    </FavoritosContext.Provider>
  );
}
