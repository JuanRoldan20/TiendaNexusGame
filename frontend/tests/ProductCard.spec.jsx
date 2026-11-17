import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from '../src/components/ProductCard.jsx';

const producto = {
  id: 1,
  codigo: 'JPC001',
  nombre: 'Starfall Odyssey',
  categoriaNombre: 'Juegos PC',
  precio: 39990,
  precioFinal: 29990,
  enOferta: true,
  stock: 5,
};

function renderizar(props = {}) {
  const onAgregar = props.onAgregar ?? jasmine.createSpy('onAgregar');
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ProductCard producto={{ ...producto, ...props.producto }} onAgregar={onAgregar} />
    </MemoryRouter>,
  );
  return { onAgregar };
}

describe('ProductCard', () => {
  it('renderiza nombre, categoría y precio formateado (props)', () => {
    renderizar();
    expect(screen.getByText('Starfall Odyssey')).toBeTruthy();
    expect(screen.getAllByText('Juegos PC').length).toBeGreaterThan(0);
    expect(screen.getByText('$29.990')).toBeTruthy();
  });

  it('muestra la etiqueta Oferta solo si el producto está en oferta (renderizado condicional)', () => {
    renderizar();
    expect(screen.queryByText('Oferta')).not.toBeNull();
  });

  it('no muestra Oferta para un producto sin oferta', () => {
    renderizar({ producto: { enOferta: false, precioFinal: 39990 } });
    expect(screen.queryByText('Oferta')).toBeNull();
  });

  it('al hacer clic llama a onAgregar con el producto (evento)', () => {
    const { onAgregar } = renderizar();
    fireEvent.click(screen.getByRole('button', { name: 'Añadir al carrito' }));
    expect(onAgregar).toHaveBeenCalledTimes(1);
    expect(onAgregar.calls.mostRecent().args[0].id).toBe(1);
  });

  it('cambia su estado a "¡Añadido!" después del clic (state)', () => {
    renderizar();
    fireEvent.click(screen.getByRole('button', { name: 'Añadir al carrito' }));
    expect(screen.getByRole('button').textContent).toContain('¡Añadido!');
  });

  it('deshabilita el botón cuando no hay stock', () => {
    renderizar({ producto: { stock: 0 } });
    const boton = screen.getByRole('button', { name: 'Sin stock' });
    expect(boton.disabled).toBeTrue();
  });
});
