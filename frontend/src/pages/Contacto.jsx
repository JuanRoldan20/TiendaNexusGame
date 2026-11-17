import { useState } from 'react';
import CampoFormulario from '../components/CampoFormulario.jsx';
import { validarCorreo, validarFormulario, validarLargoMaximo, validarRequerido } from '../utils/validaciones.js';

const VACIO = { nombre: '', correo: '', comentario: '' };

/**
 * Formulario de contacto (reglas del Anexo 1):
 * nombre requerido (máx 100), correo opcional (máx 100, dominios permitidos), comentario requerido (máx 500).
 * Los mensajes se guardan en el navegador de demostración, no se envían a un servidor.
 */
export default function Contacto() {
  const [form, setForm] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  const validar = (d) =>
    validarFormulario({
      nombre: () => validarRequerido(d.nombre, 'El nombre') || validarLargoMaximo(d.nombre, 100),
      correo: () => validarCorreo(d.correo, { requerido: false }),
      comentario: () => validarRequerido(d.comentario, 'El comentario') || validarLargoMaximo(d.comentario, 500),
    });

  const alCambiar = (e) => {
    const nuevo = { ...form, [e.target.name]: e.target.value };
    setForm(nuevo);
    setEnviado(false);
    // Validación en tiempo real solo del campo que se está editando.
    setErrores((prev) => ({ ...prev, [e.target.name]: validar(nuevo)[e.target.name] }));
  };

  const alEnviar = (e) => {
    e.preventDefault();
    const encontrados = validar(form);
    setErrores(encontrados);
    if (Object.keys(encontrados).length > 0) return;
    const mensajes = JSON.parse(localStorage.getItem('nexus-contacto') ?? '[]');
    localStorage.setItem('nexus-contacto', JSON.stringify([...mensajes, { ...form, fecha: new Date().toISOString() }]));
    setForm(VACIO);
    setEnviado(true);
  };

  return (
    <section className="container py-5" style={{ maxWidth: 640 }}>
      <h1 className="h2 font-display">Contacto</h1>
      <p className="text-secondary">Envía un comentario de prueba. Se almacenará solo en este navegador.</p>
      {enviado && (
        <div className="alert alert-success" role="status">
          Tu mensaje se guardó en este navegador. Esta demostración no envía correos ni notifica a una tienda real.
        </div>
      )}
      <form noValidate onSubmit={alEnviar} className="card card-nexus p-4">
        <CampoFormulario id="nombre" label="Nombre completo" maxLength={100} autoComplete="name" value={form.nombre} onChange={alCambiar} error={errores.nombre} />
        <CampoFormulario
          id="correo"
          label="Correo (opcional)"
          type="email"
          maxLength={100}
          autoComplete="email"
          value={form.correo}
          onChange={alCambiar}
          error={errores.correo}
          ayuda="@duoc.cl, @profesor.duoc.cl o @gmail.com"
        />
        <CampoFormulario
          id="comentario"
          label="Comentario"
          as="textarea"
          rows={5}
          maxLength={500}
          value={form.comentario}
          onChange={alCambiar}
          error={errores.comentario}
          ayuda={`${form.comentario.length}/500 caracteres`}
        />
        <button className="btn btn-nexus" type="submit">
          Enviar mensaje
        </button>
      </form>
    </section>
  );
}
