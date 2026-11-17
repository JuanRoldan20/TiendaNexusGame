import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';

const ENLACES = [
  { to: '/', texto: 'Home', end: true },
  { to: '/productos', texto: 'Productos' },
  { to: '/categorias', texto: 'Categorías' },
  { to: '/ofertas', texto: 'Ofertas' },
  { to: '/nosotros', texto: 'Nosotros' },
  { to: '/blog', texto: 'Blog' },
  { to: '/contacto', texto: 'Contacto' },
];

export default function Navbar() {
  const { sesion, autenticado, logout, tieneRol } = useAuth();
  const { unidades } = useCart();
  const navigate = useNavigate();

  const salir = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-nexus sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img src="/logo.svg" alt="" width="34" height="34" />
          <span className="font-display">NEXUS GAME</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menuPrincipal"
          aria-controls="menuPrincipal"
          aria-expanded="false"
          aria-label="Abrir menú"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="menuPrincipal">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {ENLACES.map((e) => (
              <li className="nav-item" key={e.to}>
                <NavLink className="nav-link" to={e.to} end={e.end}>
                  {e.texto}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="d-flex align-items-center gap-2">
            {autenticado ? (
              <div className="dropdown">
                <button className="btn btn-outline-light btn-sm dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                  Hola, {sesion.nombre}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  {tieneRol('ADMIN', 'VENDEDOR') && (
                    <li>
                      <Link className="dropdown-item" to="/admin">
                        Panel de administración
                      </Link>
                    </li>
                  )}
                  {tieneRol('CLIENTE', 'ADMIN') && <li><Link className="dropdown-item" to="/mi-cuenta">Mi cuenta y compras</Link></li>}
                  {tieneRol('CLIENTE', 'ADMIN') && <li><Link className="dropdown-item" to="/mi-perfil">Editar mi perfil</Link></li>}
                  <li>
                    <button className="dropdown-item" onClick={salir}>
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link className="btn btn-outline-light btn-sm" to="/login">
                  Iniciar sesión
                </Link>
                <Link className="btn btn-nexus btn-sm" to="/registro">
                  Registrarse
                </Link>
              </>
            )}
            <Link className="btn btn-cart btn-sm position-relative" to="/carrito" aria-label={`Carrito, ${unidades} productos`}>
              🛒 Carrito
              {unidades > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{unidades}</span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
