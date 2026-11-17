import { agregarItem, calcularTotal, cambiarCantidad, contarUnidades, quitarItem } from '../src/utils/carrito.js';

const juego = { id: 1, codigo: 'JPC001', nombre: 'Starfall Odyssey', precio: 39990, precioFinal: 29990, stock: 3 };
const control = { id: 2, codigo: 'ACC001', nombre: 'Control Pro', precio: 69990, precioFinal: 69990, stock: 10 };

describe('reglas del carrito', () => {
  it('agrega un producto usando el precio final (oferta)', () => {
    const items = agregarItem([], juego);
    expect(items.length).toBe(1);
    expect(items[0].precio).toBe(29990);
    expect(items[0].cantidad).toBe(1);
  });

  it('si el producto ya existe suma la cantidad en vez de duplicar la línea', () => {
    const items = agregarItem(agregarItem([], juego), juego);
    expect(items.length).toBe(1);
    expect(items[0].cantidad).toBe(2);
  });

  it('nunca supera el stock disponible', () => {
    const items = agregarItem([], juego, 10);
    expect(items[0].cantidad).toBe(3);
    expect(cambiarCantidad(items, 1, 99)[0].cantidad).toBe(3);
  });

  it('no permite cantidades menores a 1', () => {
    const items = agregarItem([], juego);
    expect(cambiarCantidad(items, 1, 0)[0].cantidad).toBe(1);
  });

  it('no agrega productos sin stock', () => {
    expect(agregarItem([], { ...juego, stock: 0 })).toEqual([]);
  });

  it('calcula total y unidades, y permite quitar productos', () => {
    let items = agregarItem([], juego, 2);
    items = agregarItem(items, control);
    expect(calcularTotal(items)).toBe(29990 * 2 + 69990);
    expect(contarUnidades(items)).toBe(3);
    expect(quitarItem(items, 1).length).toBe(1);
  });
});
