/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const meta = parsed.user_metadata || {};
        return {
          id: parsed.id || parsed.sub || meta.id || "",
          nombre: parsed.nombre || meta.nombre || "",
          correo: parsed.correo || parsed.email || "",
          telefono: parsed.telefono || meta.telefono || "",
          direccion: parsed.direccion || meta.direccion || "",
          ...parsed,
        };
      }
      return null;
    } catch {
      return null;
    }
  });

  const [cart, setCart] = useState([]);
  const [carritoId, setCarritoId] = useState(null);

  useEffect(() => {
    if (user?.id) {
      loadCarritoSupabase(user.id);
    } else {
      try {
        const storedCart = localStorage.getItem("cart");
        setCart(storedCart ? JSON.parse(storedCart) : []);
        setCarritoId(null);
      } catch {
        setCart([]);
        setCarritoId(null);
      }
    }
  }, [user]);

  useEffect(() => {
    if (!user) localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart, user]);

  async function getOrCreateCarrito(usuario_id) {
    let { data: carritos, error } = await supabase
      .from("carrito")
      .select("*")
      .eq("usuario_id", usuario_id)
      .order("creado_en", { ascending: false });

    if (error) throw error;

    if (carritos && carritos.length > 0) {
      setCarritoId(carritos[0].id);
      return carritos[0];
    } else {
      const { data, error: errorInsert } = await supabase
        .from("carrito")
        .insert([{ usuario_id }])
        .select()
        .single();
      if (errorInsert) throw errorInsert;
      setCarritoId(data.id);
      return data;
    }
  }

  async function loadCarritoSupabase(usuario_id) {
    try {
      const carrito = await getOrCreateCarrito(usuario_id);
      if (!carrito) return setCart([]);
      setCarritoId(carrito.id);

      const { data: detalles, error } = await supabase
        .from("detalle_carrito")
        .select("id, cantidad, producto_id, productos:producto_id(*)")
        .eq("carrito_id", carrito.id);

      if (error) throw error;
      if (!detalles || detalles.length === 0) {
        setCart([]);
        return;
      }
      const productosCart = detalles.map((item) => ({
        ...item.productos,
        id: item.producto_id,
        qty: item.cantidad,
      }));
      setCart(productosCart);
    } catch (e) {
      setCart([]);
    }
  }

  async function addToCart(product) {
    if (!user?.id) {
      setCart((prev) => {
        const found = prev.find((item) => item.id === product.id);
        const cantidad = product.qty || 1;
        if (found) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, qty: (item.qty || 1) + cantidad }
              : item
          );
        } else {
          return [...prev, { ...product, qty: cantidad }];
        }
      });
      return;
    }

    try {
      const carrito = await getOrCreateCarrito(user.id);

      const { data: detalle } = await supabase
        .from("detalle_carrito")
        .select("*")
        .eq("carrito_id", carrito.id)
        .eq("producto_id", product.id)
        .maybeSingle();

      if (detalle) {
        await supabase
          .from("detalle_carrito")
          .update({ cantidad: detalle.cantidad + (product.qty || 1) })
          .eq("id", detalle.id);
      } else {
        await supabase.from("detalle_carrito").insert([
          {
            carrito_id: carrito.id,
            producto_id: product.id,
            cantidad: product.qty || 1,
          },
        ]);
      }
      await loadCarritoSupabase(user.id);
    } catch (e) {
      console.error("Error al agregar producto al carrito:", e.message);
    }
  }

  async function updateQty(productId, newQty) {
    if (!user?.id) {
      setCart((prev) => {
        const updated = prev
          .map((item) =>
            item.id === productId
              ? { ...item, qty: Math.max(1, newQty) }
              : item
          )
          .filter((item) => item.qty > 0);
        localStorage.setItem("cart", JSON.stringify(updated));
        return updated;
      });
      return;
    }

    try {
      const carrito = await getOrCreateCarrito(user.id);

      const { data: detalle } = await supabase
        .from("detalle_carrito")
        .select("*")
        .eq("carrito_id", carrito.id)
        .eq("producto_id", productId)
        .maybeSingle();

      if (detalle) {
        if (newQty > 0) {
          await supabase
            .from("detalle_carrito")
            .update({ cantidad: newQty })
            .eq("id", detalle.id);
        } else {
          await supabase
            .from("detalle_carrito")
            .delete()
            .eq("id", detalle.id);
        }
      }
      await loadCarritoSupabase(user.id);
    } catch (e) {
      console.error("Error al actualizar cantidad:", e.message);
    }
  }

  async function removeFromCart(productId) {
    if (!user?.id) {
      setCart((prev) => {
        const updated = prev.filter((item) => item.id !== productId);
        localStorage.setItem("cart", JSON.stringify(updated));
        return updated;
      });
      return;
    }

    try {
      const carrito = await getOrCreateCarrito(user.id);
      await supabase
        .from("detalle_carrito")
        .delete()
        .eq("carrito_id", carrito.id)
        .eq("producto_id", productId);
      await loadCarritoSupabase(user.id);
    } catch (e) {
      console.error("Error al eliminar producto del carrito:", e.message);
    }
  }

  async function clearCart() {
    if (!user?.id) {
      setCart([]);
      localStorage.removeItem("cart");
      return;
    }
    try {
      const carrito = await getOrCreateCarrito(user.id);
      await supabase
        .from("detalle_carrito")
        .delete()
        .eq("carrito_id", carrito.id);
      await loadCarritoSupabase(user.id);
    } catch (e) {
      console.error("Error al vaciar carrito:", e.message);
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        user,
        setUser,
        carritoId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
