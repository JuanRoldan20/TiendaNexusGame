import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { obtenerProductosStorage } from '../lib/storage.js';

const CATEGORIAS = [
  'todas',
  'Acción',
  'RPG',
  'Lucha',
  'Shooter',
  'Carreras',
  'Aventuras',
  'MMO',
  'Terror',
  'Ciencia ficción',
  'Clásicos',
  'Estrategia',
  'Cooperativo',
  'Simulador',
  'Supervivencia',
  'Deportes'
];

const POR_PAGINA = 12;

export default function Productos() {
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('todas');
  const [pagina, setPagina] = useState(1);
  const [productos, setProductos] = useState(obtenerProductosStorage());

  // Sincronización con el storage
  useEffect(() => {
    const sincronizarProductos = () => setProductos(obtenerProductosStorage());

    window.addEventListener('nexus-storage', sincronizarProductos);
    return () => window.removeEventListener('nexus-storage', sincronizarProductos);
  }, []);

  // Filtrado de productos según búsqueda y categoría
  const filtrados = useMemo(() => {
    const busquedaLimpia = busqueda.toLowerCase().trim();
    const categoriaLimpia = categoria.toLowerCase();

    return productos.filter((p) => {
      const coincideNombre = p.nombre.toLowerCase().includes(busquedaLimpia);
      const coincideCategoria =
        categoria === 'todas' || p.categoria.toLowerCase() === categoriaLimpia;

      return coincideNombre && coincideCategoria;
    });
  }, [productos, busqueda, categoria]);

  // Cálculos de paginación
  const totalPaginas = Math.ceil(filtrados.length / POR_PAGINA);
  const paginaReal = Math.min(pagina, Math.max(1, totalPaginas));
  const visibles = filtrados.slice(
    (paginaReal - 1) * POR_PAGINA,
    paginaReal * POR_PAGINA
  );

  // Manejadores de cambios en los filtros
  function updateSearch(valor) {
    setBusqueda(valor);
    setPagina(1);
  }

  function updateCategory(valor) {
    setCategoria(valor);
    setPagina(1);
  }

  function cambiarPagina(nuevaPagina) {
    setPagina(nuevaPagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="site-page">
      <Header active="catalogo" />

      <main className="container catalog-page">
        <h2 className="section-title">CATÁLOGO COMPLETO DE JUEGOS</h2>
        <p className="section-subtitle">
          Explora nuestra colección, filtra por género o busca tu título favorito.
        </p>

        {/* Sección de Filtros y Búsqueda */}
        <div className="filter-section">
          <div className="search-box">
            <input
              value={busqueda}
              onChange={(e) => updateSearch(e.target.value)}
              placeholder="Buscar juego por título..."
              aria-label="Buscar juego por título"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="select-categoria">Categoría:</label>
            <select
              id="select-categoria"
              className="custom-select"
              value={categoria}
              onChange={(e) => updateCategory(e.target.value)}
            >
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'todas' ? 'Todas las categorías' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid de Productos o Estado Vacío */}
        {visibles.length ? (
          <div className="games-grid">
            {visibles.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        ) : (
          <p className="empty-state">
            No hay productos disponibles con los filtros seleccionados.
          </p>
        )}

        {/* Controles de Paginación */}
        {totalPaginas > 1 && (
          <div className="paginacion-container">
            <button
              className="btn-pagina"
              disabled={paginaReal === 1}
              onClick={() => cambiarPagina(Math.max(1, paginaReal - 1))}
            >
              « anterior
            </button>

            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                className={`btn-pagina ${n === paginaReal ? 'activa' : ''}`}
                onClick={() => cambiarPagina(n)}
              >
                {n}
              </button>
            ))}

            <button
              className="btn-pagina"
              disabled={paginaReal === totalPaginas}
              onClick={() => cambiarPagina(Math.min(totalPaginas, paginaReal + 1))}
            >
              siguiente »
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}