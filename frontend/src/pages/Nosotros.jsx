import { Link } from 'react-router-dom';

export default function Nosotros() {
  return (
    <section className="container py-5">
      <h1 className="h2 font-display">Sobre Nexus Gaming Store</h1>
      <p className="lead text-secondary">Una tienda de videojuegos, consolas y accesorios con catálogo y gestión de pedidos.</p>
      <div className="row g-3 my-4">
        <div className="col-md-6"><div className="card card-nexus h-100 p-4"><h2 className="h4">Nuestra propuesta</h2>
          <p>Reunir videojuegos, consolas y accesorios en un catálogo accesible, con carrito de compras, cuentas de usuario y gestión administrativa.</p></div></div>
        <div className="col-md-6"><div className="card card-nexus h-100 p-4"><h2 className="h4">Tecnologías utilizadas</h2>
          <p>React, Bootstrap, Spring Boot, Spring Cloud Gateway y MySQL, organizados en frontend y microservicios.</p></div></div>
      </div>
      <p>Los pedidos se registran como demostración; no se procesan cobros bancarios ni despachos reales.</p>
      <Link to="/productos" className="btn btn-nexus">Explorar el catálogo</Link>
    </section>
  );
}
