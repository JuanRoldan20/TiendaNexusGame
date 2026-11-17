import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { formatearPrecio } from '../utils/formato.js';

export default function Carrito() {
  const { items, total, cambiarCantidad, quitar, vaciar } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <section className="container py-5 text-center">
        <h1 className="h2 font-display">Tu carrito está vacío</h1>
        <p className="text-secondary">Explora el catálogo y agrega tus juegos favoritos.</p>
        <Link to="/productos" className="btn btn-nexus">
          Ir a productos
        </Link>
      </section>
    );
  }

  return (
    <section className="container py-5">
      <h1 className="h2 font-display mb-4">Carrito de compras</h1>
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle">
              <thead>
                <tr>
                  <th scope="col">Producto</th>
                  <th scope="col">Precio</th>
                  <th scope="col" style={{ width: 130 }}>Cantidad</th>
                  <th scope="col">Subtotal</th>
                  <th scope="col"><span className="visually-hidden">Acciones</span></th>
                </tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i.id}>
                    <td>
                      <Link to={`/productos/${i.id}`}>{i.nombre}</Link>
                      <div className="small text-secondary">{i.codigo}</div>
                    </td>
                    <td>{formatearPrecio(i.precio)}</td>
                    <td>
                      <label htmlFor={`cant-${i.id}`} className="visually-hidden">Cantidad de {i.nombre}</label>
                      <input
                        id={`cant-${i.id}`}
                        type="number"
                        className="form-control form-control-sm"
                        min={1}
                        max={i.stock}
                        value={i.cantidad}
                        onChange={(e) => cambiarCantidad(i.id, Number(e.target.value) || 1)}
                      />
                      {i.cantidad >= i.stock && <div className="form-text text-warning">Máximo disponible</div>}
                    </td>
                    <td>{formatearPrecio(i.precio * i.cantidad)}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => quitar(i.id)} aria-label={`Quitar ${i.nombre}`}>
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="btn btn-outline-secondary btn-sm" onClick={vaciar}>
            Vaciar carrito
          </button>
        </div>
        <div className="col-lg-4">
          <div className="card card-nexus">
            <div className="card-body">
              <h2 className="h5">Resumen</h2>
              <div className="d-flex justify-content-between fs-4 my-3">
                <span>Total</span>
                <strong className="precio">{formatearPrecio(total)}</strong>
              </div>
              <button className="btn btn-nexus w-100" onClick={() => navigate('/checkout')}>
                Ir a pagar
              </button>
              <p className="small text-secondary mt-2 mb-0">Los precios y el stock se confirman al pagar.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
