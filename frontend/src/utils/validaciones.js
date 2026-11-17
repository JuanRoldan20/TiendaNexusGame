/**
 * Reglas de validación del Anexo 1. Son funciones puras: reciben un valor y devuelven
 * el mensaje de error (string) o '' si es válido. Así se pueden probar con Jasmine
 * y reutilizar en todos los formularios. El backend vuelve a validar lo mismo.
 */

const DOMINIOS_PERMITIDOS = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com'];

export function validarRequerido(valor, nombreCampo = 'Este campo') {
  return String(valor ?? '').trim() === '' ? `${nombreCampo} es requerido` : '';
}

export function validarLargoMaximo(valor, max) {
  return String(valor ?? '').length > max ? `Máximo ${max} caracteres` : '';
}

/** Correo requerido, máx. 100 y solo @duoc.cl, @profesor.duoc.cl o @gmail.com */
export function validarCorreo(correo, { requerido = true } = {}) {
  const valor = String(correo ?? '').trim().toLowerCase();
  if (!valor) return requerido ? 'El correo es requerido' : '';
  if (valor.length > 100) return 'Máximo 100 caracteres';
  const partes = valor.split('@');
  if (partes.length !== 2 || !partes[0] || !/^[a-z0-9._%+-]+$/.test(partes[0])) {
    return 'El formato del correo no es válido';
  }
  if (!DOMINIOS_PERMITIDOS.includes(partes[1])) {
    return 'Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com';
  }
  return '';
}

/** Contraseña requerida, entre 4 y 10 caracteres */
export function validarPassword(password) {
  const valor = String(password ?? '');
  if (!valor) return 'La contraseña es requerida';
  if (valor.length < 4 || valor.length > 10) return 'La contraseña debe tener entre 4 y 10 caracteres';
  return '';
}

/** Calcula el dígito verificador de un RUN (módulo 11). */
export function calcularDv(cuerpo) {
  let suma = 0;
  let multiplicador = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  const resto = 11 - (suma % 11);
  if (resto === 11) return '0';
  if (resto === 10) return 'K';
  return String(resto);
}

/** RUN requerido, sin puntos ni guion (ej: 19011029K), 7 a 9 caracteres y dígito verificador correcto */
export function validarRun(run) {
  const valor = String(run ?? '').trim().toUpperCase();
  if (!valor) return 'El RUN es requerido';
  if (/[.\-]/.test(valor)) return 'Ingresa el RUN sin puntos ni guion (ej: 19011029K)';
  if (valor.length < 7 || valor.length > 9) return 'El RUN debe tener entre 7 y 9 caracteres';
  if (!/^\d+[0-9K]$/.test(valor)) return 'El RUN solo puede tener números y K al final';
  const cuerpo = valor.slice(0, -1);
  const dv = valor.slice(-1);
  return calcularDv(cuerpo) === dv ? '' : 'El dígito verificador no es correcto';
}

/** Fecha opcional, pero si viene debe ser anterior a hoy */
export function validarFechaNacimiento(fecha) {
  if (!fecha) return '';
  return new Date(fecha) >= new Date() ? 'La fecha debe ser anterior a hoy' : '';
}

/** Ejecuta un objeto { campo: () => mensaje } y devuelve solo los errores no vacíos. */
export function validarFormulario(reglas) {
  const errores = {};
  Object.entries(reglas).forEach(([campo, regla]) => {
    const mensaje = regla();
    if (mensaje) errores[campo] = mensaje;
  });
  return errores;
}
