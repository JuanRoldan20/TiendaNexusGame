import { useState } from 'react';
import AuthCarousel from '../components/AuthCarousel.jsx';

export default function LoginCliente() {
  const [email, setEmail] = useState('');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem('nexus_usuarios') || '[]');
    const emailLimpio = email.trim().toLowerCase();
    const passwordLimpia = password.trim();

    const found = users.find(
      (u) => u.email.toLowerCase() === emailLimpio && u.password === passwordLimpia
    );

    if (found) {
      localStorage.setItem(
        'nexus_usuario_activo',
        JSON.stringify({
          id: found.id,
          email: found.email,
          nombre: found.nombre,
          rol: 'cliente'
        })
      );

      alert(`¡Bienvenido de nuevo, ${found.nombre}!`);
      window.location.hash = '#/';
    } else {
      alert('Correo electrónico o contraseña incorrectos.');
    }
  }

  return (
    <div className="auth-page">
      <AuthCarousel />

      <main className="login-wrapper">
        <div className="login-box">
          <h1>Comencemos</h1>
          <p className="subtitle">Accede a tu cuenta de cliente para explorar la tienda</p>

          <div className="role-selector">
            <a href="#/login/cliente" className="role-btn active">
              Cliente
            </a>
            <a href="#/login/admin" className="role-btn">
              Administrador
            </a>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresa tu correo"
                required
              />
            </div>

            <div className="input-group">
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Ingresa tu usuario"
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>

            <button className="btn-pink" type="submit">
              Iniciar Sesión
            </button>
          </form>

          <div className="footer-links">
            ¿No tienes cuenta? <a href="#/registro">Regístrate aquí</a>
          </div>
        </div>
      </main>
    </div>
  );
}