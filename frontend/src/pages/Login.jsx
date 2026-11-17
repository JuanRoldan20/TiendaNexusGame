import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CampoFormulario from '../components/CampoFormulario.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { validarCorreo, validarFormulario, validarPassword } from '../utils/validaciones.js';

/**
 * Inicio de sesión. Validación en tiempo real (al escribir, después del primer intento)
 * y al enviar. El ADMIN es redirigido al panel de administración.
 */
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ correo: '', password: '' });
  const [errores, setErrores] = useState({});
  const [intentado, setIntentado] = useState(false);
  const [errorServidor, setErrorServidor] = useState('');
  const [enviando, setEnviando] = useState(false);

  const validar = (datos) =>
    validarFormulario({
      correo: () => validarCorreo(datos.correo),
      password: () => validarPassword(datos.password),
    });

  const alCambiar = (e) => {
    const nuevo = { ...form, [e.target.name]: e.target.value };
    setForm(nuevo);
    if (intentado) setErrores(validar(nuevo));
  };

  const alEnviar = async (e) => {
    e.preventDefault();
    setIntentado(true);
    const encontrados = validar(form);
    setErrores(encontrados);
    if (Object.keys(encontrados).length > 0) return;

    setEnviando(true);
    setErrorServidor('');
    try {
      const sesion = await login(form.correo.trim(), form.password);
      const destino = location.state?.desde ?? (sesion.rol === 'ADMIN' ? '/admin' : '/');
      navigate(destino, { replace: true });
    } catch (err) {
      setErrorServidor(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="container py-5" style={{ maxWidth: 460 }}>
      <div className="card card-nexus p-4">
        <div className="text-center mb-3">
          <img src="/logo.svg" alt="Logo Nexus Game" width="64" height="64" />
          <h1 className="h3 font-display mt-2">Iniciar sesión</h1>
        </div>
        {location.state?.registrado && !errorServidor && (
          <div className="alert alert-success" role="status">
            ¡Cuenta creada! Ya puedes iniciar sesión.
          </div>
        )}
        {errorServidor && (
          <div className="alert alert-danger" role="alert">
            {errorServidor}
          </div>
        )}
        <form noValidate onSubmit={alEnviar}>
          <CampoFormulario
            id="correo"
            label="Correo"
            type="email"
            autoComplete="email"
            placeholder="usuario@duoc.cl"
            maxLength={100}
            value={form.correo}
            onChange={alCambiar}
            error={errores.correo}
            ayuda="Solo @duoc.cl, @profesor.duoc.cl o @gmail.com"
          />
          <CampoFormulario
            id="password"
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            maxLength={10}
            value={form.password}
            onChange={alCambiar}
            error={errores.password}
            ayuda="Entre 4 y 10 caracteres"
          />
          <button className="btn btn-nexus w-100" type="submit" disabled={enviando}>
            {enviando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
        <p className="text-center small mt-3 mb-0">
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </div>
    </section>
  );
}
