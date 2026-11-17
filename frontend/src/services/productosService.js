import { apiFetch } from './api.js';

/** Catálogo público: GET /productos?categoriaId=&q=&ofertas=&page=&size= */
export function buscarProductos({ categoriaId, q, ofertas, page = 0, size = 24 } = {}) {
  const params = new URLSearchParams({ page, size });
  if (categoriaId) params.set('categoriaId', categoriaId);
  if (q) params.set('q', q);
  if (ofertas) params.set('ofertas', 'true');
  return apiFetch(`/productos?${params}`, { auth: false });
}

export const obtenerProducto = (id) => apiFetch(`/productos/${id}`, { auth: false });
export const listarCategorias = () => apiFetch('/categorias', { auth: false });

// ----- Administración (requieren rol ADMIN) -----
export const crearProducto = (producto) => apiFetch('/productos', { method: 'POST', body: producto });
export const actualizarProducto = (id, producto) => apiFetch(`/productos/${id}`, { method: 'PUT', body: producto });
export const eliminarProducto = (id) => apiFetch(`/productos/${id}`, { method: 'DELETE' });
export const crearCategoria = (nombre) => apiFetch('/categorias', { method: 'POST', body: { nombre } });
export const actualizarCategoria = (id, nombre) => apiFetch(`/categorias/${id}`, { method: 'PUT', body: { nombre } });

export const productosCriticos = () => apiFetch('/productos/criticos');
