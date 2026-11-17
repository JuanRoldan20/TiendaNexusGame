import { apiFetch } from './api.js';

export const miPerfil = () => apiFetch('/usuarios/me');
export const actualizarMiPerfil = (datos) => apiFetch('/usuarios/me', { method: 'PUT', body: datos });

// ----- Administración (rol ADMIN) -----
export const listarUsuarios = () => apiFetch('/usuarios');
export const obtenerUsuario = (id) => apiFetch(`/usuarios/${id}`);

export const actualizarUsuario = (id, datos) => apiFetch(`/usuarios/${id}`, { method: 'PUT', body: datos });
