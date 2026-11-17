import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCover from '../components/ProductCover.jsx';
import { Cargando, MensajeError } from '../components/Estado.jsx';
import { useCart } from '../context/CartContext.jsx';
import { obtenerProducto } from '../services/productosService.js';
import { formatearPrecio } from '../utils/formato.js';

export default function ProductoDetalle() {
  const { id } = useParams();
  const { agregar, items } = useCart();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    setProducto(null);
    setError(null);
    obtenerProducto(id).then(setProducto).catch(setError);
  }, [id]);

  if (error) {
    return (
      <section className="container py-5">
        <MensajeError error={error} />
        <Link to="/productos">← Volver a productos</Link>
      </section>
    );
  }
  if (!producto) return <Cargando />;

  const enCarrito = items.find((i) => i.id === producto.id)?.cantidad ?? 0;
  const disponible = producto.stock - enCarrito;

  const alAgregar = () => {
    agregar(producto, cantidad);
    setMensaje(`Agregaste ${cantidad} × ${producto.nombre} al carrito`);
    setCantidad(1);
  };

  return (
    <section className="container py-5">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to={`/productos?categoria=${producto.categoriaId}`}>{producto.categoriaNombre}</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{producto.nombre}</li>
        </ol>
      </nav>
      <div className="row g-5">
        <div className="col-md-6">
          <div className="card card-nexus overflow-hidden">
            <ProductCover producto={producto} alto={380} />
          </div>
        </div>
        <div className="col-md-6">
          <small className="text-secondary">Código {producto.codigo}</small>
          <h1 className="h2 font-display">{producto.nombre}</h1>
          <p className="fs-3 precio mb-1">{formatearPrecio(producto.precioFinal)}</p>
          {producto.enOferta && (
            <p>
              <del className="text-secondary">{formatearPrecio(producto.precio)}</del>{' '}
              <span className="badge text-bg-danger">Oferta</span>
            </p>
          )}
          <p className="text-secondary">{producto.descripcion}</p>
          <p className={producto.stock > 0 ? 'text-success' : 'text-danger'}>
            {producto.stock > 0 ? `${producto.stock} unidades disponibles` : 'Producto agotado'}
          </p>

          {disponible > 0 ? (
            <div className="d-flex gap-2 align-items-end">
              <div>
                <label htmlFor="cantidad" className="form-label">Cantidad</label>
                <input
                  id="cantidad"
                  type="number"
                  className="form-control"
                  style={{ width: 100 }}
                  min={1}
                  max={disponible}
                  value={cantidad}
                  onChange={(e) => setCantidad(Math.min(Math.max(1, Number(e.target.value) || 1), disponible))}
                />
              </div>
              <button className="btn btn-nexus btn-lg" onClick={alAgregar}>
                Añadir al carrito
              </button>
            </div>
          ) : (
            producto.stock > 0 && <p className="text-warning">Ya tienes todo el stock disponible en tu carrito.</p>
          )}
          {mensaje && (
            <div className="alert alert-success mt-3" role="status">
              {mensaje} · <Link to="/carrito">Ver carrito</Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
