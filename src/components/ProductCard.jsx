import { formatearCLP } from '../lib/storage.js';

const fallback = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600';

export default function ProductCard({ producto, compact = false }) {
  const stock = Number(producto.stock) || 0;
  function agregar() {
    const raw = localStorage.getItem('nexus_carrito');
    const carrito = (() => { try { return raw ? JSON.parse(raw) : []; } catch { return []; } })();
    const index = carrito.findIndex(item => item.id == producto.id);
    if (index >= 0) carrito[index].cantidad += 1;
    else carrito.push({ id: producto.id, nombre: producto.nombre, precio: Number(producto.precio), imagen: producto.imagen || fallback, cantidad: 1 });
    localStorage.setItem('nexus_carrito', JSON.stringify(carrito));
    window.dispatchEvent(new Event('nexus-storage'));
    window.alert(`"${producto.nombre}" fue añadido al carrito exitosamente.`);
  }
  return <article className={`card ${compact ? 'card-compact' : ''}`}>
    <img src={producto.imagen || fallback} alt={producto.nombre} onError={(e) => { e.currentTarget.src = fallback; }} />
    <div className="card-content">
      <div>
        <span className={`stock-badge ${stock > 10 ? 'available' : 'low'}`}>
          {stock > 10 ? 'Disponible' : stock > 0 ? `Últimas ${stock} Unidades` : 'Agotado'}
        </span>
        <h3 className="card-title">{producto.nombre}</h3>
        <p className="card-tags">{producto.categoria}</p>
      </div>
      <div className="card-footer product-card-footer">
        <span className="price">{formatearCLP(producto.precio)}</span>
        {stock > 0 ? <button type="button" className="btn-main full-width" onClick={agregar}>Agregar al Carrito</button> : <button disabled className="btn-secondary full-width">Agotado</button>}
      </div>
    </div>
  </article>;
}
