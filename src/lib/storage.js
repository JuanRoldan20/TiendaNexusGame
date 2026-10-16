import { productosIniciales } from '../data/productosIniciales.js';

export const STORAGE_KEYS = {
  PRODUCTOS: 'nexus_productos',
  CARRITO: 'nexus_carrito',
  USUARIOS: 'nexus_usuarios',
  USUARIO_ACTIVO: 'nexus_usuario_activo',
  HISTORIAL: 'historialVentas',
};

export function inicializarStorage() {
  const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTOS);
  try {
    const parsed = raw ? JSON.parse(raw) : null;
    if (!Array.isArray(parsed) || parsed.length !== productosIniciales.length) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTOS, JSON.stringify(productosIniciales));
    }
  } catch {
    localStorage.setItem(STORAGE_KEYS.PRODUCTOS, JSON.stringify(productosIniciales));
  }
}

export function obtenerProductosStorage() {
  inicializarStorage();
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTOS)) || productosIniciales; }
  catch { return productosIniciales; }
}
export function guardarProductosStorage(productos) {
  localStorage.setItem(STORAGE_KEYS.PRODUCTOS, JSON.stringify(productos));
}
export function obtenerCarritoStorage() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.CARRITO)) || []; }
  catch { return []; }
}
export function guardarCarritoStorage(carrito) {
  localStorage.setItem(STORAGE_KEYS.CARRITO, JSON.stringify(carrito));
}
export function obtenerUsuarioActivo() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.USUARIO_ACTIVO)) || null; }
  catch { return null; }
}
export function cerrarSesion() {
  localStorage.removeItem(STORAGE_KEYS.USUARIO_ACTIVO);
}
export function obtenerHistorialVentas() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORIAL)) || []; }
  catch { return []; }
}
export function guardarHistorialVentas(historial) {
  localStorage.setItem(STORAGE_KEYS.HISTORIAL, JSON.stringify(historial));
}
export function agregarHistorialVenta(venta) {
  const historial = obtenerHistorialVentas();
  historial.unshift(venta);
  guardarHistorialVentas(historial);
}

export function formatearCLP(value) {
  return `$${Number(value || 0).toLocaleString('es-CL')}`;
}

export function totalItemsCarrito(carrito = obtenerCarritoStorage()) {
  return carrito.reduce((sum, item) => sum + (Number(item.cantidad) || 0), 0);
}
