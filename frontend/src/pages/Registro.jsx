import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CampoFormulario from '../components/CampoFormulario.jsx';
import { REGIONES, comunasDe } from '../data/regiones.js';
import { registrar } from '../services/authService.js';
import {
  validarCorreo,
  validarFechaNacimiento,
  validarFormulario,
  validarLargoMaximo,
  validarPassword,
  validarRequerido,
  validarRun,
} from '../utils/validaciones.js';

const VACIO = {
  run: '',
  nombre: '',
  apellidos: '',
  correo: '',
  password: '',
  confirmar: '',
  fechaNacimiento: '',
  region: '',
  comuna: '',
  direccion: '',
};

/** Registro de usuario (reglas del Anexo 1). Siempre crea un CLIENTE. */
export default function Registro() {
  const navigate = useNavigate();
  const [form, setForm] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [intentado, setIntentado] = useState(false);
  const [errorServidor, setErrorServidor] = useState('');
  const [enviando, setEnviando] = useState(false);

  const validar = (d) =>
    validarFormulario({
      run: () => validarRun(d.run),
      nombre: () => validarRequerido(d.nombre, 'El nombre') || validarLargoMaximo(d.nombre, 50),
      apellidos: () => validarRequerido(d.apellidos, 'Los apellidos') || validarLargoMaximo(d.apellidos, 100),
      correo: () => validarCorreo(d.correo),
      password: () => validarPassword(d.password),
      confirmar: () => (d.confirmar !== d.password ? 'Las contraseñas no coinciden' : ''),
      fechaNacimiento: () => validarFechaNacimiento(d.fechaNacimiento),
      region: () => validarRequerido(d.region, 'La región'),
      comuna: () => validarRequerido(d.comuna, 'La comuna'),
      direccion: () => validarRequerido(d.direccion, 'La dirección') || validarLargoMaximo(d.direccion, 300),
    });

  const alCambiar = (e) => {
    const { name, value } = e.target;
    const nuevo = { ...form, [name]: name === 'run' ? value.toUpperCase() : value };
    // Al cambiar la región se reinicia la comuna (select dependiente).
    if (name === 'region') nuevo.comuna = '';
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
      const { confirmar, ...datos } = form;
      await registrar({ ...datos, fechaNacimiento: datos.fechaNacimiento || null });
      navigate('/login', { replace: true, state: { registrado: true } });
    } catch (err) {
      setErrorServidor(err.message);
      setErrores((prev) => ({ ...prev, ...err.errores }));
    } finally {
      setEnviando(false);
    }
  };

  const campo = (id, label, extra = {}) => (
    <CampoFormulario id={id} label={label} value={form[id]} onChange={alCambiar} error={errores[id]} {...extra} />
  );

  return (
    <section className="container py-5" style={{ maxWidth: 760 }}>
      <div className="card card-nexus p-4">
        <h1 className="h3 font-display mb-3">Crear cuenta</h1>
        {errorServidor && (
          <div className="alert alert-danger" role="alert">
            {errorServidor}
          </div>
        )}
        <form noValidate onSubmit={alEnviar}>
          <div className="row">
            <div className="col-md-4">{campo('run', 'RUN', { maxLength: 9, placeholder: '19011029K', ayuda: 'Sin puntos ni guion' })}</div>
            <div className="col-md-4">{campo('nombre', 'Nombre', { maxLength: 50, autoComplete: 'given-name' })}</div>
            <div className="col-md-4">{campo('apellidos', 'Apellidos', { maxLength: 100, autoComplete: 'family-name' })}</div>
            <div className="col-md-6">
              {campo('correo', 'Correo', { type: 'email', maxLength: 100, autoComplete: 'email', ayuda: '@duoc.cl, @profesor.duoc.cl o @gmail.com' })}
            </div>
            <div className="col-md-6">{campo('fechaNacimiento', 'Fecha de nacimiento (opcional)', { type: 'date' })}</div>
            <div className="col-md-6">{campo('password', 'Contraseña', { type: 'password', maxLength: 10, autoComplete: 'new-password', ayuda: 'Entre 4 y 10 caracteres' })}</div>
            <div className="col-md-6">{campo('confirmar', 'Confirmar contraseña', { type: 'password', maxLength: 10, autoComplete: 'new-password' })}</div>
            <div className="col-md-6">
              {campo('region', 'Región', {
                as: 'select',
                children: [
                  <option key="" value="">Selecciona una región</option>,
                  ...REGIONES.map((r) => <option key={r.nombre} value={r.nombre}>{r.nombre}</option>),
                ],
              })}
            </div>
            <div className="col-md-6">
              {campo('comuna', 'Comuna', {
                as: 'select',
                disabled: !form.region,
                children: [
                  <option key="" value="">{form.region ? 'Selecciona una comuna' : 'Primero elige una región'}</option>,
                  ...comunasDe(form.region).map((c) => <option key={c} value={c}>{c}</option>),
                ],
              })}
            </div>
            <div className="col-12">{campo('direccion', 'Dirección', { maxLength: 300, autoComplete: 'street-address', placeholder: 'Calle, número, depto.' })}</div>
          </div>
          <button className="btn btn-nexus w-100" type="submit" disabled={enviando}>
            {enviando ? 'Registrando...' : 'Registrarme'}
          </button>
        </form>
        <p className="text-center small mt-3 mb-0">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </section>
  );
}
