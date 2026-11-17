import { construirPedido, validarEnvio } from '../src/utils/checkout.js';

describe('checkout', () => {
  const envio={nombre:'Ana', correo:'ana@gmail.com', region:'Valparaíso', comuna:'Concón', direccion:'Av. Principal 12', indicaciones:''};
  it('transforma el carrito en pedido para el backend sin enviar precios del navegador', () => {
    const pedido=construirPedido([{id:7,nombre:'Juego',precio:12990,cantidad:2}],envio);
    expect(pedido.items).toEqual([{productoId:7,cantidad:2}]);
    expect(pedido.items[0].precio).toBeUndefined();
  });
  it('impide enviar el carrito vacío', () => {
    expect(() => construirPedido([],envio)).toThrowError('El carrito está vacío');
  });
  it('valida los campos obligatorios de entrega', () => {
    expect(validarEnvio({...envio,direccion:''})).toContain('Completa');
    expect(validarEnvio(envio)).toBe('');
  });
});
