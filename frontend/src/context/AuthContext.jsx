import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService.js';
import { guardarSesion, leerSesion } from '../services/api.js';
import { miPerfil } from '../services/usuariosService.js';

const AuthContext = createContext(null);

/**
 * Sesión del usuario. Se guarda en localStorage para que siga activa aunque se recargue
 * la página (pauta IE3.3.1 c). Al recargar se valida contra la expiración del token.
 */
export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(() => {
    const guardada = leerSesion();
    if (guardada && guardada.expiraEn && guardada.expiraEn < Date.now() && !guardada.refreshToken) {
      guardarSesion(null);
      return null;
    }
    return guardada;
  });

  const actualizar = useCallback((nueva) => {
    guardarSesion(nueva);
    setSesion(nueva);
  }, []);

  // api.js avisa con este evento cuando el backend responde 401 (token vencido).
  useEffect(() => {
    const alExpirar = () => setSesion(null);
    const alRenovar = () => setSesion(leerSesion());
    window.addEventListener('nexus-sesion-expirada', alExpirar);
    window.addEventListener('nexus-sesion-renovada', alRenovar);
    return () => { window.removeEventListener('nexus-sesion-expirada', alExpirar); window.removeEventListener('nexus-sesion-renovada', alRenovar); };
  }, []);

  const login = useCallback(
    async (correo, password) => {
      const token = await authService.login(correo, password);
      const base = {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        expiraEn: Date.now() + token.expiresIn * 1000,
        usuarioId: token.usuarioId,
        correo: token.correo,
        rol: token.rol,
        nombre: token.correo,
      };
      guardarSesion(base); // necesario para que miPerfil() envíe el token
      try {
        const perfil = await miPerfil();
        base.nombre = perfil.nombre;
      } catch {
        // Si users-service no responde igual se inicia sesión (se muestra el correo).
      }
      actualizar(base);
      return base;
    },
    [actualizar],
  );

  const logout = useCallback(() => actualizar(null), [actualizar]);

  const value = useMemo(
    () => ({
      sesion,
      autenticado: !!sesion,
      login,
      logout,
      tieneRol: (...roles) => !!sesion && roles.includes(sesion.rol),
    }),
    [sesion, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
