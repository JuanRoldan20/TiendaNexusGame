import { createContext, useContext, useState } from 'react';

const CLAVE_SESION = 'nexus_usuario_activo';

// Usuario administrador de prueba
const ADMIN = { usuario: 'admin', email: 'admin@nexusgaming.cl', clave: '1234', rol: 'admin' };

const AuthContext = createContext(null);

// Lee la sesión guardada; si no hay o está dañada, devuelve null
function leerSesion() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [usuarioActivo, setUsuarioActivo] = useState(leerSesion);

  // Devuelve true si las credenciales son correctas
  function login(usuario, clave) {
    const coincide = usuario === ADMIN.usuario || usuario === ADMIN.email;
    if (!coincide || clave !== ADMIN.clave) return false;

    const sesion = { usuario: ADMIN.usuario, email: ADMIN.email, rol: ADMIN.rol };
    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    setUsuarioActivo(sesion);
    return true;
  }

  function logout() {
    localStorage.removeItem(CLAVE_SESION);
    setUsuarioActivo(null);
  }

  return (
    <AuthContext.Provider value={{ usuarioActivo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
