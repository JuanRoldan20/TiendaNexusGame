import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { Cargando, MensajeError } from '../components/Estado.jsx';
import { useCart } from '../context/CartContext.jsx';
import { buscarProductos, listarCategorias } from '../services/productosService.js';

/** Lista de productos con filtro por categoría y búsqueda por texto (se reflejan en la URL). */
export default function Productos() {
  const { agregar } = useCart();
  const [params, setParams] = useSearchParams();
  const categoriaId = params.get('categoria') ?? '';
  const q = params.get('q') ?? '';

  const [texto, setTexto] = useState(q);
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    listarCategorias().then(setCategorias).catch(() => setCategorias([]));
  }, []);

  useEffect(() => {
    setCargando(true);
    setError(null);
    buscarProductos({ categoriaId, q })
      .then((pagina) => setProductos(pagina.content))
      .catch(setError)
      .finally(() => setCargando(false));
  }, [categoriaId, q]);

  const actualizarFiltro = (clave, valor) => {
    const nuevos = new URLSearchParams(params);
    if (valor) nuevos.set(clave, valor);
    else nuevos.delete(clave);
    setParams(nuevos);
  };

  const categoriaActual = categorias.find((c) => String(c.id) === categoriaId);

  return (
    <section className="container py-5">
      <h1 className="h2 font-display mb-4">{categoriaActual ? categoriaActual.nombre : 'Productos'}</h1>

      <form
        className="row g-2 mb-4"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          actualizarFiltro('q', texto.trim());
        }}
      >
        <div className="col-md-6">
          <label htmlFor="buscar" className="visually-hidden">
            Buscar
          </label>
          <input
            id="buscar"
            type="search"
            className="form-control"
            placeholder="Buscar por nombre o código..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="filtroCategoria" className="visually-hidden">
            Categoría
          </label>
          <select
            id="filtroCategoria"
            className="form-select"
            value={categoriaId}
            onChange={(e) => actualizarFiltro('categoria', e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2 d-grid">
          <button className="btn btn-nexus" type="submit">
            Buscar
          </button>
        </div>
      </form>

      {cargando && <Cargando />}
      <MensajeError error={error} />
      {!cargando && !error && productos.length === 0 && (
        <p className="text-secondary">No encontramos productos con esos filtros.</p>
      )}
      <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
        {productos.map((p) => (
          <div className="col" key={p.id}>
            <ProductCard producto={p} onAgregar={agregar} />
          </div>
        ))}
      </div>
    </section>
  );
}
