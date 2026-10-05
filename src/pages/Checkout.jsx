import { useMemo, useState } from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import {
  agregarHistorialVenta,
  formatearCLP,
  obtenerCarritoStorage,
  obtenerUsuarioActivo,
  guardarCarritoStorage,
  obtenerProductosStorage,
  guardarProductosStorage
} from '../lib/storage.js';

const COSTO_ENVIO = 3990;

export default function Checkout() {
  const usuarioActivo = obtenerUsuarioActivo();

  // Carga inicial del carrito
  const carrito = useMemo(() => obtenerCarritoStorage(), []);

  // Estados del formulario
  const [metodo, setMetodo] = useState('tarjeta');
  const [nombre, setNombre] = useState(usuarioActivo?.nombre || '');
  const [email, setEmail] = useState(usuarioActivo?.email || '');
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');

  // Cálculos de totales
  const subtotal = carrito.reduce(
    (sum, item) => sum + Number(item.precio) * Number(item.cantidad),
    0
  );
  const total = subtotal + COSTO_ENVIO;

  // Procesar orden y descontar stock
  function handleSubmit(e) {
    e.preventDefault();

    if (!carrito.length) {
      alert('Tu carrito está vacío. Agrega productos antes de realizar el pago.');
      return;
    }

    const ahora = new Date();
    const orden = {
      nroOrden: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      cliente: email || nombre || 'Cliente',
      juegos: carrito.map((item) => `${item.nombre} x${item.cantidad}`).join(', '),
      fecha: ahora.toLocaleString('es-CL'),
      licencia: `NEXUS-${Math.random().toString(36).slice(2, 10).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      total,
      estado: 'PAGADO'
    };

    // Registrar venta en historial
    agregarHistorialVenta(orden);

    // Actualizar stock del inventario
    const productosActualizados = obtenerProductosStorage().map((producto) => {
      const itemEnCarrito = carrito.find((item) => item.id == producto.id);
      return itemEnCarrito
        ? {
            ...producto,
            stock: Math.max(0, Number(producto.stock) - Number(itemEnCarrito.cantidad))
          }
        : producto;
    });

    guardarProductosStorage(productosActualizados);

    // Limpiar carrito
    guardarCarritoStorage([]);
    window.dispatchEvent(new Event('nexus-storage'));

    alert(`¡Gracias por tu compra, ${nombre || 'Cliente'}! Tu pedido ha sido procesado con éxito.`);
    window.location.hash = '#/';
  }

  return (
    <div className="site-page">
      <Header />

      <main className="container checkout-page">
        <h2 className="section-title">FINALIZAR COMPRA</h2>
        <p className="section-subtitle">Completa tus datos para confirmar el pedido.</p>

        <div className="checkout-layout">
          {/* Formulario de Pago y Envío */}
          <form id="form-checkout" className="checkout-form" onSubmit={handleSubmit}>
            {/* Sección 1: Datos Personales */}
            <section className="form-section">
              <h3>1. Datos del Cliente y Envío</h3>
              <div className="form-grid">
                <div className="input-group">
                  <label>Nombre Completo</label>
                  <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    placeholder="Ej. Juan Pérez"
                  />
                </div>
                <div className="input-group">
                  <label>Correo Electrónico</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="cliente@correo.com"
                  />
                </div>
                <div className="input-group">
                  <label>Dirección de Envío</label>
                  <input
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    required
                    placeholder="Ej. Av. Libertad 1234, Depto 502"
                  />
                </div>
                <div className="input-group">
                  <label>Ciudad / Comuna</label>
                  <input
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    required
                    placeholder="Viña del Mar"
                  />
                </div>
              </div>
            </section>

            {/* Sección 2: Método de Pago */}
            <section className="form-section">
              <h3>2. Método de Pago</h3>
              <div className="payment-options">
                <label>
                  <input
                    type="radio"
                    name="metodo_pago"
                    checked={metodo === 'tarjeta'}
                    onChange={() => setMetodo('tarjeta')}
                  />{' '}
                  Tarjeta de Crédito / Débito
                </label>
                <label>
                  <input
                    type="radio"
                    name="metodo_pago"
                    checked={metodo === 'transferencia'}
                    onChange={() => setMetodo('transferencia')}
                  />{' '}
                  Transferencia Bancaria
                </label>
              </div>

              {metodo === 'tarjeta' && (
                <div className="card-fields">
                  <input required placeholder="1234 5678 9012 3456" />
                  <input required placeholder="MM/AA" />
                  <input required type="password" placeholder="123" />
                </div>
              )}

              {metodo === 'transferencia' && (
                <div className="transfer-info">
                  Realiza la transferencia a la cuenta indicada por la tienda. Tu pedido
                  quedará registrado como pendiente de validación.
                </div>
              )}
            </section>

            <button className="btn-pink" type="submit">
              Pagar y Confirmar Pedido
            </button>
          </form>

          {/* Resumen del Pedido */}
          <aside className="summary-card checkout-summary">
            <h3>Resumen de Compra</h3>

            {carrito.length === 0 ? (
              <p className="empty-state">No hay productos en el carrito.</p>
            ) : (
              carrito.map((item) => (
                <div className="checkout-item" key={item.id}>
                  <div>
                    <strong>{item.nombre}</strong>
                    <small>Cant: {item.cantidad}</small>
                  </div>
                  <span>{formatearCLP(Number(item.precio) * Number(item.cantidad))}</span>
                </div>
              ))
            )}

            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatearCLP(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Envío</span>
              <span>{formatearCLP(COSTO_ENVIO)}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>{formatearCLP(total)}</span>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}