/**
 * Reglas del carrito de compras (funciones puras, fáciles de probar con Jasmine):
 *  - Si el producto ya está en el carrito, se suma la cantidad (no se duplica la línea).
 *  - La cantidad nunca supera el stock disponible ni baja de 1.
 *  - Productos sin stock no se pueden agregar.
 *  - Se guarda el precio final (con oferta) al momento de agregar; el backend recalcula al pagar.
 */

export function agregarItem(items, producto, cantidad = 1) {
  if (!producto || producto.stock <= 0) return items;
  const existente = items.find((i) => i.id === producto.id);
  if (existente) {
    return items.map((i) =>
      i.id === producto.id ? { ...i, cantidad: Math.min(i.cantidad + cantidad, producto.stock), stock: producto.stock } : i,
    );
  }
  return [
    ...items,
    {
      id: producto.id,
      codigo: producto.codigo,
      nombre: producto.nombre,
      categoriaNombre: producto.categoriaNombre,
      precio: Number(producto.precioFinal ?? producto.precio),
      stock: producto.stock,
      cantidad: Math.min(Math.max(cantidad, 1), producto.stock),
    },
  ];
}

export function cambiarCantidad(items, id, cantidad) {
  return items.map((i) => (i.id === id ? { ...i, cantidad: Math.min(Math.max(1, cantidad), i.stock) } : i));
}

export function quitarItem(items, id) {
  return items.filter((i) => i.id !== id);
}

export function calcularTotal(items) {
  return items.reduce((total, i) => total + i.precio * i.cantidad, 0);
}

export function contarUnidades(items) {
  return items.reduce((total, i) => total + i.cantidad, 0);
}
