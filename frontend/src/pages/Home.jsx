import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { Cargando, MensajeError } from '../components/Estado.jsx';
import { useCart } from '../context/CartContext.jsx';
import { buscarProductos } from '../services/productosService.js';

export default function Home() {
  const { agregar } = useCart();
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    buscarProductos({ size: 8 })
      .then((pagina) => setProductos(pagina.content))
      .catch(setError)
      .finally(() => setCargando(false));
  }, []);

  return (
    <>
      <section className="hero py-5">
        <div className="container py-lg-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="badge rounded-pill text-bg-info mb-3">Nueva temporada</span>
              <h1 className="display-5 font-display fw-bold">
                Sube de nivel con <span className="texto-gradiente">Nexus Game</span>
              </h1>
              <p className="lead text-secondary">
                Videojuegos para PC y consola, consolas de última generación y accesorios gamer. Despacho a todo Chile en 48
                horas.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/productos" className="btn btn-nexus btn-lg">
                  Ver productos
                </Link>
                <Link to="/ofertas" className="btn btn-outline-light btn-lg">
                  Ofertas
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-art rounded-4 p-4">
                <div className="hero-art__grid">
                  <div>🎮</div>
                  <div>🕹️</div>
                  <div>🎧</div>
                  <div>⌨️</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <h2 className="h3 font-display mb-0">Destacados</h2>
          <Link to="/productos">Ver todos →</Link>
        </div>
        {cargando && <Cargando />}
        <MensajeError error={error} />
        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
          {productos.map((p) => (
            <div className="col" key={p.id}>
              <ProductCard producto={p} onAgregar={agregar} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
