import { describe, it, expect } from 'vitest';

function formatPrice(price) {
  return `$${price.toLocaleString('es-CL')}`;
}

describe('PruebaKarma - Pruebas del Utilidades y Formato', () => {
  it('debería formatear los precios a pesos chilenos correctamente', () => {
    const precioFormateado = formatPrice(35000);
    expect(precioFormateado).toContain('35.000');
  });

  it('debería devolver un valor definido al recibir un número válido', () => {
    const resultado = formatPrice(0);
    expect(resultado).toBeDefined();
    expect(resultado).toBe('$0');
  });
});