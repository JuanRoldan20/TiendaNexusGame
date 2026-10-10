import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  function ingresar(evento) {
    evento.preventDefault();
    if (!login(usuario, clave)) {
      setError('Credenciales incorrectas');
      return;
    }
    navigate('/');
  }

  return (
    <section className="container">
      <h1>Iniciar sesión</h1>

      <form onSubmit={ingresar}>
        <label htmlFor="usuario">Usuario o email</label>
        <input id="usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} />

        <label htmlFor="clave">Contraseña</label>
        <input id="clave" type="password" value={clave} onChange={(e) => setClave(e.target.value)} />

        {error && <p role="alert">{error}</p>}

        <button type="submit" className="btn-main">Ingresar</button>
      </form>
    </section>
  );
}
