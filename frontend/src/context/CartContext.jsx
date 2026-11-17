import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { agregarItem, calcularTotal, cambiarCantidad, contarUnidades, quitarItem } from '../utils/carrito.js';

const CLAVE = 'nexus-carrito';
const CartContext = createContext(null);

function cargarCarrito() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) ?? [];
  } catch {
    return [];
  }
}

/** Estado global del carrito, persistido en localStorage (Anexo 1). */
export function CartProvider({ children }) {
  const [items, setItems] = useState(cargarCarrito);

  useEffect(() => {
    localStorage.setItem(CLAVE, JSON.stringify(items));
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      total: calcularTotal(items),
      unidades: contarUnidades(items),
      agregar: (producto, cantidad = 1) => setItems((prev) => agregarItem(prev, producto, cantidad)),
      cambiarCantidad: (id, cantidad) => setItems((prev) => cambiarCantidad(prev, id, cantidad)),
      quitar: (id) => setItems((prev) => quitarItem(prev, id)),
      vaciar: () => setItems([]),
    }),
    [items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}
