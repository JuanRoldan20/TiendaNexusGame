const clp = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

/** 39990 -> "$39.990" */
export function formatearPrecio(valor) {
  return clp.format(Number(valor) || 0);
}

/** "2026-11-11T03:06:43Z" -> "11-11-2026" */
export function formatearFecha(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('es-CL');
}
