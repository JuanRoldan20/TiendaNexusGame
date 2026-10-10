import { Link } from 'react-router';

export default function NoEncontrada() {
  return (
    <section className="container">
      <h1>404 - Página no encontrada</h1>
      <p>La página que buscas no existe.</p>
      <Link to="/">Volver al inicio</Link>
    </section>
  );
}
