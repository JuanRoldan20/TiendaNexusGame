import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatearPrecio } from '../utils/formato.js';
import ProductCover from './ProductCover.jsx';

/**
 * Tarjeta de producto (imagen, nombre, precio y botón añadir).
 * Responsabilidad única: mostrar un producto y avisar cuando se presiona "Añadir" (prop onAgregar).
 * Estado propio: "agregado" muestra una confirmación breve en el botón.
 */
export default function ProductCard({ producto, onAgregar }) {
  const [agregado, setAgregado] = useState(false);
  const sinStock = producto.stock <= 0;

  useEffect(() => {
    if (!agregado) return undefined;
    const t = setTimeout(() => setAgregado(false), 1500);
    return () => clearTimeout(t);
  }, [agregado]);

  const alAgregar = () => {
    onAgregar(producto);
    setAgregado(true);
  };

  return (
    <div className="card card-nexus h-100" data-testid="product-card">
      <Link to={`/productos/${producto.id}`} className="text-decoration-none">
        <ProductCover producto={producto} />
      </Link>
      <div className="card-body d-flex flex-column">
        <small className="text-secondary">{producto.categoriaNombre}</small>
        <Link to={`/productos/${producto.id}`} className="text-reset text-decoration-none">
          <h3 className="h6 card-title mt-1 mb-2">{producto.nombre}</h3>
        </Link>
        <div className="mt-auto">
          {producto.enOferta ? (
            <p className="mb-2">
              <span className="precio">{formatearPrecio(producto.precioFinal)}</span>{' '}
              <del className="text-secondary small">{formatearPrecio(producto.precio)}</del>{' '}
              <span className="badge text-bg-danger">Oferta</span>
            </p>
          ) : (
            <p className="mb-2 precio">{formatearPrecio(producto.precio)}</p>
          )}
          <button type="button" className="btn btn-nexus w-100" disabled={sinStock} onClick={alAgregar}>
            {sinStock ? 'Sin stock' : agregado ? '✔ ¡Añadido!' : 'Añadir al carrito'}
          </button>
        </div>
      </div>
    </div>
  );
}
