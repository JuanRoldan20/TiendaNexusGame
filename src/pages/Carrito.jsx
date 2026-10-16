import { useEffect, useState } from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import {
  formatearCLP,
  obtenerCarritoStorage,
  guardarCarritoStorage
} from '../lib/storage.js';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600';

export default function Carrito() {
  const [carrito, setCarrito] = useState(obtenerCarritoStorage());

  // Sincronización con el evento personalizado nexus-storage
  useEffect(() => {
    const sincronizarCarrito = () => setCarrito(obtenerCarritoStorage());

    window.addEventListener('nexus-storage', sincronizarCarrito);
    return () => window.removeEventListener('nexus-storage', sincronizarCarrito);
  }, []);

  // Cálculos derivados del estado
  const total = carrito.reduce(
    (sum, item) => sum + Number(item.precio) * Number(item.cantidad),
    0
  );
  const items = carrito.reduce(
    (sum, item) => sum + Number(item.cantidad),
    0
  );

  // Manejadores de eventos
  function eliminar(id) {
    const next = carrito.filter((item) => item.id !== id);
    guardarCarritoStorage(next);
    setCarrito(next);
    window.dispatchEvent(new Event('nexus-storage'));
  }

  function vaciar() {
    if (!carrito.length) {
      alert('El carrito ya está vacío.');
      return;
    }

    if (confirm('¿Estás seguro de que deseas vaciar todos los productos del carrito?')) {
      guardarCarritoStorage([]);
      setCarrito([]);
      window.dispatchEvent(new Event('nexus-storage'));
    }
  }

  return (
    <div className="site-page">
      <Header active="" />

      <main className="container cart-page">
        <div className="page-heading">
          <h1 className="section-title">Tu Carrito de Compras</h1>
          <p className="section-subtitle">
            Revisa el detalle de tus productos antes de finalizar la transacción.
          </p>
        </div>

        <div className="cart-layout">
          {/* Tabla de Productos */}
          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {carrito.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-cell">
                      Tu carrito está vacío.
                      <br />
                      <br />
                      <a href="#/catalogo" className="btn-main">
                        Ir al Catálogo
                      </a>
                    </td>
                  </tr>
                ) : (
                  carrito.map((item) => (
                    <tr key={item.id}>
                      <td className="product-cell">
                        <img src={item.imagen || FALLBACK_IMAGE} alt={item.nombre} />
                        <span>{item.nombre}</span>
                      </td>
                      <td>{formatearCLP(item.precio)}</td>
                      <td className="center">{item.cantidad}</td>
                      <td className="subtotal">
                        {formatearCLP(Number(item.precio) * Number(item.cantidad))}
                      </td>
                      <td className="center">
                        <button
                          className="danger-btn"
                          onClick={() => eliminar(item.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Resumen de Compra */}
          <aside className="summary-card">
            <h2>Resumen del Pedido</h2>
            <div className="summary-row">
              <span>Productos</span>
              <span>{items} ítems</span>
            </div>
            <div className="summary-total">
              <span>Total:</span>
              <span>{formatearCLP(total)}</span>
            </div>
            <button
              className="btn-main full-width"
              disabled={!carrito.length}
              onClick={() => (window.location.hash = '#/checkout')}
            >
              Pagar y Confirmar
            </button>
            <button className="btn-secondary full-width" onClick={vaciar}>
              Vaciar Carrito
            </button>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}