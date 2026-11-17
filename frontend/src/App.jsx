import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Footer from './components/layout/Footer.jsx';
import Navbar from './components/layout/Navbar.jsx';
import AdminLayout from './components/layout/AdminLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Productos from './pages/Productos.jsx';
import Categorias from './pages/Categorias.jsx';
import ProductoDetalle from './pages/ProductoDetalle.jsx';
import Carrito from './pages/Carrito.jsx';
import Login from './pages/Login.jsx';
import Registro from './pages/Registro.jsx';
import Contacto from './pages/Contacto.jsx';
import Nosotros from './pages/Nosotros.jsx';
import NoEncontrado from './pages/NoEncontrado.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import ProductosAdmin from './pages/admin/ProductosAdmin.jsx';
import ProductoForm from './pages/admin/ProductoForm.jsx';
import CategoriasAdmin from './pages/admin/CategoriasAdmin.jsx';
import UsuariosAdmin from './pages/admin/UsuariosAdmin.jsx';
import {
  AdminBoletaDetalle,
  AdminBoletas,
  AdminCriticos,
  AdminPerfil,
  AdminReportes,
  AdminUsuarioDetalle,
  AdminUsuarioForm,
  Blog,
  BlogDetalle,
  Checkout,
  CompraExitosa,
  CompraFallida,
  Ofertas,
  MiCuenta,
  PerfilUsuario,
} from './pages/PaginasAdicionales.jsx';

function LayoutTienda() {
  return (
    <>
      <Navbar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  const { tieneRol } = useAuth();
  return (
    <div className="d-flex flex-column min-vh-100">
      <Routes>
        <Route element={<LayoutTienda />}>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/:id" element={<ProductoDetalle />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/ofertas" element={<Ofertas />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/checkout" element={<ProtectedRoute roles={['CLIENTE', 'ADMIN']}><Checkout /></ProtectedRoute>} />
          <Route path="/mi-cuenta" element={<ProtectedRoute><MiCuenta /></ProtectedRoute>} />
          <Route path="/mi-perfil" element={<ProtectedRoute><PerfilUsuario /></ProtectedRoute>} />
          <Route path="/compra/exitosa/:id" element={<ProtectedRoute><CompraExitosa /></ProtectedRoute>} />
          <Route path="/compra/fallida" element={<CompraFallida />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetalle />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="*" element={<NoEncontrado />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['ADMIN', 'VENDEDOR']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={tieneRol('VENDEDOR') ? <Navigate to="/admin/boletas" replace /> : <Dashboard />} />
          <Route path="boletas" element={<AdminBoletas />} />
          <Route path="boletas/:id" element={<AdminBoletaDetalle />} />
          <Route path="productos" element={<ProductosAdmin />} />
          <Route path="productos/nuevo" element={<ProtectedRoute roles={['ADMIN']}><ProductoForm /></ProtectedRoute>} />
          <Route path="productos/criticos" element={<ProtectedRoute roles={['ADMIN']}><AdminCriticos /></ProtectedRoute>} />
          <Route path="productos/:id/editar" element={<ProtectedRoute roles={['ADMIN']}><ProductoForm /></ProtectedRoute>} />
          <Route path="categorias" element={<ProtectedRoute roles={['ADMIN']}><CategoriasAdmin /></ProtectedRoute>} />
          <Route path="usuarios" element={<ProtectedRoute roles={['ADMIN']}><UsuariosAdmin /></ProtectedRoute>} />
          <Route path="usuarios/nuevo" element={<ProtectedRoute roles={['ADMIN']}><AdminUsuarioForm /></ProtectedRoute>} />
          <Route path="usuarios/:id/editar" element={<ProtectedRoute roles={['ADMIN']}><AdminUsuarioForm /></ProtectedRoute>} />
          <Route path="usuarios/:id" element={<ProtectedRoute roles={['ADMIN']}><AdminUsuarioDetalle /></ProtectedRoute>} />
          <Route path="reportes" element={<ProtectedRoute roles={['ADMIN']}><AdminReportes /></ProtectedRoute>} />
          <Route path="perfil" element={<ProtectedRoute roles={['ADMIN']}><AdminPerfil /></ProtectedRoute>} />
        </Route>
      </Routes>
    </div>
  );
}
