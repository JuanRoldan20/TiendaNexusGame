import { apiFetch } from './api.js';

export const login = (correo, password) =>
  apiFetch('/auth/login', { method: 'POST', body: { correo, password }, auth: false });

export const registrar = (datos) => apiFetch('/auth/registro', { method: 'POST', body: datos, auth: false });

export const refrescarToken = (refreshToken) => apiFetch('/auth/refresh', { method: 'POST', body: { refreshToken }, auth: false });
export const crearUsuarioComoAdmin = (datos) => apiFetch('/auth/usuarios', { method: 'POST', body: datos });
export const cambiarRolUsuario = (id, rol) => apiFetch(`/auth/usuarios/${id}/rol`, { method: 'PUT', body: { rol } });
export const desactivarUsuario = (id) => apiFetch(`/auth/usuarios/${id}`, { method: 'DELETE' });
