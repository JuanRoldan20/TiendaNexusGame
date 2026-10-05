export default function Footer({ admin = false }) {
  return <footer><div className="footer-content">
    <p>&copy; 2026 Nexus Gaming Store{admin ? ' - Módulo de Administración Interno.' : '. Todos los derechos reservados.'}</p>
    <p className="footer-location">Viña del Mar, Región de Valparaíso</p>
  </div></footer>;
}
