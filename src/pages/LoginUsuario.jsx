import AuthCarousel from '../components/AuthCarousel.jsx';

export default function LoginUsuario() {
  return (
    <div className="auth-page">
      <AuthCarousel />

      <main className="login-wrapper">
        <div className="login-box">
          <h1>Bienvenido</h1>
          <p className="subtitle">
            Selecciona tu tipo de cuenta para continuar
          </p>

          <div className="actions-container">
            <a href="#/login/cliente" className="btn-pink">
              Acceder como Cliente
            </a>
            <a href="#/login/admin" className="btn-outline">
              Acceder como Administrador
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}