/**
 * Campo de formulario Bootstrap con label asociado (htmlFor/id), autocompletado,
 * texto de ayuda y mensaje de error en contexto (pauta IE1.2.1).
 */
export default function CampoFormulario({
  id,
  label,
  error,
  ayuda,
  type = 'text',
  as = 'input',
  children,
  className = 'mb-3',
  ...props
}) {
  const clases = `${as === 'select' ? 'form-select' : 'form-control'}${error ? ' is-invalid' : ''}`;
  const ayudaId = ayuda ? `${id}-ayuda` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [ayudaId, errorId].filter(Boolean).join(' ') || undefined;

  let control;
  if (as === 'select') {
    control = (
      <select id={id} name={id} className={clases} aria-invalid={!!error} aria-describedby={describedBy} {...props}>
        {children}
      </select>
    );
  } else if (as === 'textarea') {
    control = <textarea id={id} name={id} className={clases} aria-invalid={!!error} aria-describedby={describedBy} {...props} />;
  } else {
    control = <input id={id} name={id} type={type} className={clases} aria-invalid={!!error} aria-describedby={describedBy} {...props} />;
  }

  return (
    <div className={className}>
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      {control}
      {ayuda && !error && (
        <div id={ayudaId} className="form-text">
          {ayuda}
        </div>
      )}
      {error && (
        <div id={errorId} className="invalid-feedback" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
