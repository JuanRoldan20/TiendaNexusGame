/** Indicadores reutilizables de carga y error (renderizado condicional). */
export function Cargando({ texto = 'Cargando...' }) {
  return (
    <div className="text-center py-5" role="status">
      <div className="spinner-border text-info" aria-hidden="true" />
      <p className="mt-2 text-secondary">{texto}</p>
    </div>
  );
}

export function MensajeError({ error }) {
  if (!error) return null;
  return (
    <div className="alert alert-danger" role="alert">
      {typeof error === 'string' ? error : error.message}
    </div>
  );
}
