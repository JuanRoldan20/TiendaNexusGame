import { useState } from 'react';
import Footer from '../components/Footer.jsx';
import {
  formatearCLP,
  obtenerHistorialVentas,
  obtenerProductosStorage,
  guardarProductosStorage,
  obtenerUsuarioActivo,
  cerrarSesion
} from '../lib/storage.js';

export default function Admin() {
  // Estado general
  const [productos, setProductos] = useState(obtenerProductosStorage());
  const [historial] = useState(obtenerHistorialVentas());
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // Campos del formulario
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');

  const usuario = obtenerUsuarioActivo();

  // Acciones de gestión
  function nuevo() {
    setEditing(null);
    setNombre('');
    setCategoria('');
    setPrecio('');
    setStock('');
    setFormOpen(true);
    setTimeout(() => document.getElementById('nombre')?.focus(), 0);
  }

  function editar(p) {
    setEditing(p.id);
    setNombre(p.nombre);
    setCategoria(p.categoria);
    setPrecio(p.precio);
    setStock(p.stock);
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function guardar(e) {
    e.preventDefault();

    if (!nombre.trim() || !categoria.trim() || Number(precio) <= 0 || Number(stock) < 0) {
      alert('Por favor ingresa datos válidos.');
      return;
    }

    let next = [...productos];

    if (editing) {
      next = next.map((p) =>
        p.id === editing
          ? {
              ...p,
              nombre: nombre.trim(),
              categoria: categoria.trim(),
              precio: Number(precio),
              stock: Number(stock)
            }
          : p
      );
    } else {
      next.push({
        id: Date.now(),
        nombre: nombre.trim(),
        categoria: categoria.trim(),
        precio: Number(precio),
        stock: Number(stock),
        imagen: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=400'
      });
    }

    guardarProductosStorage(next);
    setProductos(next);
    setFormOpen(false);
    alert('Producto guardado exitosamente.');
  }

  function eliminar(id) {
    if (confirm(`¿Estás seguro de eliminar el producto #${id}?`)) {
      const next = productos.filter((p) => p.id !== id);
      guardarProductosStorage(next);
      setProductos(next);
    }
  }

  function logout() {
    cerrarSesion();
    window.location.hash = '#/';
  }

  return (
    <div className="site-page">
      <header>
        <div className="logo">
          <a href="#/admin">
            Nexus<span>Gaming</span> <small>(ADMIN)</small>
          </a>
        </div>
        <nav>
          <ul>
            <li>
              <a href="#inventario" className="active">
                Inventario
              </a>
            </li>
            <li>
              <a href="#historial">Historial de Compras</a>
            </li>
            <li>
              <a href="#/catalogo">Ver Tienda</a>
            </li>
          </ul>
        </nav>
        <div className="user-actions">
          <span className="admin-greeting">
            Hola, <strong>{usuario?.nombre || 'Admin'}</strong>
          </span>
          <button className="btn-secondary logout-button" onClick={logout}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="container admin-page">
        <div className="page-heading">
          <h1 className="section-title">Panel de Control General</h1>
          <p className="section-subtitle">
            Gestión de stock, licencias y registro de ventas de Nexus Gaming Store.
          </p>
        </div>

        {/* Formulario de creación/edición */}
        {formOpen && (
          <section className="admin-form">
            <h2>Gestionar Producto</h2>
            <form onSubmit={guardar}>
              <div>
                <label>Nombre del Producto</label>
                <input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Categoría</label>
                <input
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  placeholder="RPG, Acción, etc."
                  required
                />
              </div>
              <div>
                <label>Precio ($ CLP)</label>
                <input
                  type="number"
                  min="0"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Stock Disponible</label>
                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
              </div>
              <div className="admin-form-actions">
                <button className="btn-main" type="submit">
                  Guardar Producto
                </button>
                <button
                  className="btn-secondary"
                  type="button"
                  onClick={() => setFormOpen(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Sección Inventario */}
        <section id="inventario" className="admin-section">
          <div className="admin-section-head">
            <h2>Inventario de Videojuegos</h2>
            <button className="btn-main" onClick={nuevo}>
              + Agregar Nuevo Producto
            </button>
          </div>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.id}>
                    <td>#{p.id}</td>
                    <td>
                      <strong>{p.nombre}</strong>
                    </td>
                    <td>{p.categoria}</td>
                    <td className="price-cell">{formatearCLP(p.precio)}</td>
                    <td>{p.stock} ud.</td>
                    <td className="actions-cell">
                      <button className="btn-secondary small" onClick={() => editar(p)}>
                        Editar
                      </button>
                      <button className="danger-outline" onClick={() => eliminar(p.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Sección Historial */}
        <section id="historial" className="admin-section">
          <div className="admin-section-head stacked">
            <h2>Historial de Compras de Clientes</h2>
            <p>Registro de transacciones recientes y licencias entregadas.</p>
          </div>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>N° Orden</th>
                  <th>Cliente</th>
                  <th>Juego Comprado</th>
                  <th>Fecha y Hora</th>
                  <th>Clave Licencia Digital</th>
                  <th>Total Pagado</th>
                  <th>Estado Orden</th>
                </tr>
              </thead>
              <tbody>
                {historial.length ? (
                  historial.map((o, i) => (
                    <tr key={`${o.nroOrden}-${i}`}>
                      <td className="primary-cell">#{o.nroOrden.replace(/^#/, '')}</td>
                      <td>{o.cliente}</td>
                      <td>{o.juegos}</td>
                      <td>{o.fecha}</td>
                      <td>
                        <code>{o.licencia}</code>
                      </td>
                      <td className="price-cell">{formatearCLP(o.total)}</td>
                      <td>
                        <span className="status-paid">{o.estado}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="empty-cell">
                      No hay compras registradas aún.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <Footer admin />
    </div>
  );
}