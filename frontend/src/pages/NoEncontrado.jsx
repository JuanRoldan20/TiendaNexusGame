import { Link } from 'react-router-dom';

export default function NoEncontrado() {
  return (
    <section className="container py-5 text-center">
      <p className="display-1 font-display texto-gradiente">404</p>
      <h1 className="h3">Game over: esta página no existe</h1>
      <Link to="/" className="btn btn-nexus mt-3">
        Volver al inicio
      </Link>
    </section>
  );
}
