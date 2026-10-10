import { describe, expect, it } from 'vitest';
import { tiendaReducer } from '../src/store/tiendaReducer.js';

const producto = { id: 1, nombre: 'Juego', precio: 1000, stock: 5, imagen: '' };

describe('tiendaReducer', () => {
  it('agrega y acumula productos en el carrito', () => {
    let s = { productos: [producto], carrito: [] };
    s = tiendaReducer(s, { type: 'AGREGAR', producto });
    s = tiendaReducer(s, { type: 'AGREGAR', producto });
    expect(s.carrito[0].cantidad).toBe(2);
  });

  it('quita y vacía el carrito', () => {
    let s = { productos: [producto], carrito: [{ ...producto, cantidad: 2 }] };
    s = tiendaReducer(s, { type: 'QUITAR', id: 1 });
    expect(s.carrito).toHaveLength(0);
  });

  it('descuenta stock al comprar', () => {
    let s = { productos: [producto], carrito: [{ ...producto, cantidad: 2 }] };
    s = tiendaReducer(s, { type: 'COMPRAR' });
    expect(s.productos[0].stock).toBe(3);
    expect(s.carrito).toHaveLength(0);
  });

  it('eliminar producto también lo elimina del carrito', () => {
    let s = { productos: [producto], carrito: [{ ...producto, cantidad: 1 }] };
    s = tiendaReducer(s, { type: 'ELIMINAR_PRODUCTO', id: 1 });
    expect(s.productos).toHaveLength(0);
    expect(s.carrito).toHaveLength(0);
  });
});