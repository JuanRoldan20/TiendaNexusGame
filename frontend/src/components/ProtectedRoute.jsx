import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Protege rutas del frontend según la sesión y el rol.
 * Ojo: esto solo oculta pantallas; la seguridad real la aplica el API Gateway en el backend.
 */
export default function ProtectedRoute({ roles, children }) {
  const { autenticado, tieneRol } = useAuth();
  const location = useLocation();

  if (!autenticado) {
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  }
  if (roles && !tieneRol(...roles)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
