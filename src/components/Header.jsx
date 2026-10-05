import { useEffect, useState } from 'react';
import { cerrarSesion, obtenerUsuarioActivo, totalItemsCarrito } from '../lib/storage.js';

export default function Header({ active = '' }) {
  const [items, setItems] = useState(totalItemsCarrito());
  const [usuario, setUsuario] = useState(obtenerUsuarioActivo());

  useEffect(() => {
    const sync = () => { setItems(totalItemsCarrito()); setUsuario(obtenerUsuarioActivo()); };
    window.addEventListener('nexus-storage', sync);
    window.addEventListener('storage', sync);
    return () => { window.removeEventListener('nexus-storage', sync); window.removeEventListener('storage', sync); };
  }, []);

  function logout(e) {
    e.preventDefault();
    cerrarSesion();
    window.dispatchEvent(new Event('nexus-storage'));
    window.location.hash = '#/';
  }

  return (
    <header>
      <div className="logo"><a href="#/">NEXUS<span>GAMING</span></a></div>
      <nav><ul>
        <li><a className={active === 'inicio' ? 'active' : ''} href="#/">Inicio</a></li>
        <li><a className={active === 'catalogo' ? 'active' : ''} href="#/catalogo">Catálogo</a></li>
        <li><a className={active === 'sucursal' ? 'active' : ''} href="#/sucursal">Sucursal</a></li>
      </ul></nav>
      <div className="user-actions">
        <a href="#/carrito" className="btn-secondary cart-link" aria-label={`Carrito con ${items} productos`}>
          🛒{items > 0 && <span className="cart-badge">{items}</span>}
        </a>
        {usuario ? (
          <a href="#/" onClick={logout} className="btn-secondary btn-login">Cerrar Sesión</a>
        ) : (
          <a href="#/login" className="btn-secondary btn-login">Iniciar Sesión</a>
        )}
      </div>
    </header>
  );
}
