/**
 * Portada generada para productos sin imagen (el seeder no trae imágenes).
 * Si el producto tiene "imagen" (URL) se muestra la imagen real.
 */
const PALETAS = {
  'Juegos PC': ['#7c3aed', '#22d3ee'],
  'Juegos Consola': ['#db2777', '#f59e0b'],
  Consolas: ['#2563eb', '#a855f7'],
  Accesorios: ['#059669', '#22d3ee'],
  'Gift Cards': ['#f59e0b', '#ef4444'],
};

export default function ProductCover({ producto, alto = 180 }) {
  if (producto.imagen) {
    return (
      <img src={producto.imagen} alt={producto.nombre} className="w-100 object-fit-cover rounded-top" style={{ height: alto }} />
    );
  }
  const [a, b] = PALETAS[producto.categoriaNombre] ?? ['#4c1d95', '#0e7490'];
  // Iniciales de las palabras importantes: "Kingdoms of Ember" -> "KE"
  const palabras = producto.nombre.split(' ').filter((p) => /^[A-ZÁÉÍÓÚÑ0-9]/.test(p));
  const iniciales = (palabras.length ? palabras : producto.nombre.split(' '))
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
  return (
    <div
      className="product-cover rounded-top"
      style={{ height: alto, background: `linear-gradient(135deg, ${a}, ${b})` }}
      role="img"
      aria-label={`Portada de ${producto.nombre}`}
    >
      <span className="product-cover__iniciales">{iniciales}</span>
      <span className="product-cover__categoria">{producto.categoriaNombre}</span>
    </div>
  );
}
