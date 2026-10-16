import { useMemo } from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import ProductCard from '../components/ProductCard.jsx';
import StoreMap from '../components/StoreMap.jsx';
import { obtenerProductosStorage } from '../lib/storage.js';

export default function Inicio() {
  // Productos destacados (primeros 4 ítems)
  const productosDestacados = useMemo(
    () => obtenerProductosStorage().slice(0, 4),
    []
  );

  return (
    <div className="site-page">
      <Header active="inicio" />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Bienvenido a <span>Nexus Gaming</span>
          </h1>
          <p>
            Encuentra los mejores títulos, licencias instantáneas y precios imbatibles.
          </p>
          <a href="#/catalogo" className="btn-main">
            Ver Catálogo Completo
          </a>
        </div>
      </section>

      {/* Juegos Destacados */}
      <main className="container">
        <h2 className="section-title">JUEGOS DESTACADOS</h2>
        <p className="section-subtitle">
          Los títulos más populares seleccionados para ti
        </p>

        <div className="games-grid">
          {productosDestacados.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      </main>

      {/* Ubicación / Sucursal */}
      <section id="sucursal" className="map-container">
        <div className="container">
          <h2 className="section-title">NUESTRA SUCURSAL</h2>
          <p className="section-subtitle">
            Visítanos y conoce nuestra tienda física
          </p>

          <StoreMap compact />
        </div>
      </section>

      <Footer />
    </div>
  );
}