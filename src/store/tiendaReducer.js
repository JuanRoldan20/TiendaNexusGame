// Estado inicial de la tienda
export function crearEstado(productos = [], carrito = []) {
  return { productos, carrito };
}

// Recibe el estado actual y una acción; devuelve un estado NUEVO sin modificar el anterior
export function tiendaReducer(estado, accion) {
  switch (accion.type) {

    case 'AGREGAR': {
      const enCarrito = estado.carrito.find((i) => i.id === accion.producto.id);
      const cantidadActual = enCarrito ? enCarrito.cantidad : 0;

      // No se puede agregar más unidades que el stock disponible
      if (cantidadActual + 1 > accion.producto.stock) return estado;

      const carrito = enCarrito
        ? estado.carrito.map((i) =>
            i.id === accion.producto.id ? { ...i, cantidad: i.cantidad + 1 } : i)
        : [...estado.carrito, { ...accion.producto, cantidad: 1 }];

      return { ...estado, carrito };
    }

    case 'QUITAR':
      return { ...estado, carrito: estado.carrito.filter((i) => i.id !== accion.id) };

    case 'COMPRAR': {
      if (estado.carrito.length === 0) return estado;

      // Si algún producto no tiene stock suficiente, no se compra nada
      const sinStock = estado.carrito.some((i) => {
        const p = estado.productos.find((prod) => prod.id === i.id);
        return !p || i.cantidad > p.stock;
      });
      if (sinStock) return estado;

      const productos = estado.productos.map((p) => ({
        ...p,
        stock: p.stock - (estado.carrito.find((i) => i.id === p.id)?.cantidad ?? 0),
      }));

      return { ...estado, productos, carrito: [] };
    }

    case 'ELIMINAR_PRODUCTO':
      return {
        ...estado,
        productos: estado.productos.filter((p) => p.id !== accion.id),
        carrito: estado.carrito.filter((i) => i.id !== accion.id),
      };

    default:
      return estado;
  }
}