import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer-nexus mt-5 py-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <h2 className="h5 font-display">NEXUS GAME</h2>
            <p className="text-secondary mb-0">Videojuegos, consolas y accesorios con despacho a todo Chile.</p>
          </div>
          <div className="col-6 col-md-4">
            <h3 className="h6">Tienda</h3>
            <ul className="list-unstyled small">
              <li><Link to="/productos">Productos</Link></li>
              <li><Link to="/categorias">Categorías</Link></li>
              <li><Link to="/ofertas">Ofertas</Link></li>
            </ul>
          </div>
          <div className="col-6 col-md-4">
            <h3 className="h6">Nexus</h3>
            <ul className="list-unstyled small">
              <li><Link to="/nosotros">Nosotros</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
            </ul>
          </div>
        </div>
        <hr className="border-secondary" />
        <p className="small text-secondary mb-0">© {new Date().getFullYear()} Nexus Game · Proyecto académico DSY1104 Desarrollo Fullstack II</p>
      </div>
    </footer>
  );
}
