import { apiFetch } from './api.js';

export const misBoletas = () => apiFetch('/boletas/mias');
export const listarBoletas = () => apiFetch('/boletas');
export const obtenerBoleta = (id) => apiFetch(`/boletas/${id}`);

export const crearBoleta = (pedido) => apiFetch('/boletas', { method: 'POST', body: pedido });
