import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const MENU = [
  { to: '/admin', texto: 'Dashboard', end: true, roles: ['ADMIN'] },
  { to: '/admin/boletas', texto: 'Órdenes / Boletas', roles: ['ADMIN', 'VENDEDOR'] },
  { to: '/admin/productos', texto: 'Productos', roles: ['ADMIN', 'VENDEDOR'] },
  { to: '/admin/productos/criticos', texto: 'Productos críticos', roles: ['ADMIN'] },
  { to: '/admin/categorias', texto: 'Categorías', roles: ['ADMIN'] },
  { to: '/admin/usuarios', texto: 'Usuarios', roles: ['ADMIN'] },
  { to: '/admin/reportes', texto: 'Reportes', roles: ['ADMIN'] },
  { to: '/admin/perfil', texto: 'Perfil', roles: ['ADMIN'] },
];

export default function AdminLayout() {
  const { sesion, logout, tieneRol } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar p-3">
        <Link to="/admin" className="d-flex align-items-center gap-2 text-decoration-none mb-4">
          <img src="/logo.svg" alt="" width="32" height="32" />
          <span className="font-display text-white">NEXUS ADMIN</span>
        </Link>
        <nav className="nav nav-pills flex-column gap-1">
          {MENU.filter(m => tieneRol(...m.roles)).map((m) => (
            <NavLink key={m.to} to={m.to} end={m.end} className="nav-link d-flex justify-content-between align-items-center">
              {m.texto}
            </NavLink>
          ))}
        </nav>
        <hr className="border-secondary" />
        <div className="small text-secondary mb-2">
          {sesion?.nombre} · <span className="badge text-bg-info">{sesion?.rol}</span>
        </div>
        <div className="d-flex gap-2">
          <Link to="/" className="btn btn-outline-light btn-sm">
            Ver tienda
          </Link>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            Salir
          </button>
        </div>
      </aside>
      <main className="admin-main p-3 p-md-4">
        <Outlet />
      </main>
    </div>
  );
}
