import { useState } from 'react';

export default function Contacto() {
  const [email, setEmail] = useState('');
  const [asunto, setAsunto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState([]);
  const [exito, setExito] = useState('');

  function validar(evento) {
    evento.preventDefault();
    const encontrados = [];

    if (!/^[^\s@]+@[^\s@]+.[^\s@]+$/.test(email.trim())) {
      encontrados.push('Ingresa un email válido.');
    }
    if (asunto.trim().length < 3) {
      encontrados.push('El asunto debe tener al menos 3 caracteres.');
    }
    if (mensaje.trim().length < 10) {
      encontrados.push('El mensaje debe tener al menos 10 caracteres.');
    }

    setErrores(encontrados);
    setExito(encontrados.length === 0 ? 'Mensaje validado correctamente.' : '');
  }

  return (
    <section className="container">
      <h1>Contacto</h1>

      {/* noValidate: la validación la hacemos nosotros, no el navegador */}
      <form onSubmit={validar} noValidate>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="asunto">Asunto</label>
        <input id="asunto" value={asunto} onChange={(e) => setAsunto(e.target.value)} />

        <label htmlFor="mensaje">Mensaje</label>
        <textarea id="mensaje" rows="4" value={mensaje} onChange={(e) => setMensaje(e.target.value)} />

        {errores.length > 0 && (
          <ul role="alert">
            {errores.map((error) => <li key={error}>{error}</li>)}
          </ul>
        )}
        {exito && <p>{exito}</p>}

        <button type="submit" className="btn-main">Validar mensaje</button>
      </form>
    </section>
  );
}
