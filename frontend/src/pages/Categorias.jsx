import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cargando, MensajeError } from '../components/Estado.jsx';
import { listarCategorias } from '../services/productosService.js';

const ICONOS = { 'Juegos PC': '🖥️', 'Juegos Consola': '🎮', Consolas: '🕹️', Accesorios: '🎧', 'Gift Cards': '🎁' };

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    listarCategorias()
      .then(setCategorias)
      .catch(setError)
      .finally(() => setCargando(false));
  }, []);

  return (
    <section className="container py-5">
      <h1 className="h2 font-display mb-4">Categorías</h1>
      {cargando && <Cargando />}
      <MensajeError error={error} />
      <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3">
        {categorias.map((c) => (
          <div className="col" key={c.id}>
            <Link to={`/productos?categoria=${c.id}`} className="card card-nexus categoria-tile text-center text-decoration-none h-100">
              <div className="card-body py-4">
                <div className="display-6 mb-2" aria-hidden="true">
                  {ICONOS[c.nombre] ?? '⭐'}
                </div>
                <h2 className="h6 mb-0">{c.nombre}</h2>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
