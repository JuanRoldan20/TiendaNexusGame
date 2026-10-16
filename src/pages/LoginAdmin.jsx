import { useState } from 'react';
import AuthCarousel from '../components/AuthCarousel.jsx';

export default function LoginAdmin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    const emailLimpio = email.trim();
    const passwordLimpia = password.trim();
    const tokenLimpio = token.trim();

    if (emailLimpio === 'admin@nexus.com' && passwordLimpia === 'admin123') {
      if (tokenLimpio && tokenLimpio !== '12345') {
        alert('Token de administrador incorrecto.');
        return;
      }

      localStorage.setItem(
        'nexus_usuario_activo',
        JSON.stringify({
          email: 'admin@nexus.com',
          nombre: 'Administrador',
          rol: 'admin',
          token: '12345'
        })
      );

      alert('¡Bienvenido, Administrador!');
      window.location.hash = '#/admin';
    } else {
      alert('Correo electrónico o contraseña incorrectos.');
    }
  }

  return (
    <div className="auth-page">
      <AuthCarousel />

      <main className="login-wrapper">
        <div className="login-box">
          <h1>Panel Admin</h1>
          <p className="subtitle">Ingresa tus credenciales de administrador</p>

          <div className="role-selector">
            <a href="#/login/cliente" className="role-btn">
              Cliente
            </a>
            <a href="#/login/admin" className="role-btn active">
              Administrador
            </a>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo del administrador"
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña de Administrador"
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Clave de Seguridad Token"
              />
            </div>

            <button className="btn-pink" type="submit">
              Acceder al Panel
            </button>
          </form>

          <div className="footer-links">
            <a href="#/login/admin">
              ¿Olvidaste las credenciales de administrador?
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}