import { validarCorreo } from './validaciones.js';

export function validarEnvio(datos) {
  if (!datos.nombre?.trim() || !datos.region || !datos.comuna || !datos.direccion?.trim()) {
    return 'Completa todos los datos de despacho';
  }
  return validarCorreo(datos.correo);
}
export function construirPedido(items, envio) {
  if (!items.length) throw new Error('El carrito está vacío');
  return {items:items.map(i => ({productoId:i.id,cantidad:i.cantidad})),envio};
}
