import { API_URL } from '../config.js';

const CLAVE_SESION = 'nexus-sesion';
let renovacionPendiente = null;

export class ApiError extends Error {
  constructor(status, detalle, errores = {}) {
    super(detalle);
    this.status = status;
    this.errores = errores;
  }
}

export function leerSesion() {
  try { return JSON.parse(localStorage.getItem(CLAVE_SESION)) ?? null; }
  catch { return null; }
}
export function guardarSesion(sesion) {
  if (sesion) localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
  else localStorage.removeItem(CLAVE_SESION);
}
function terminarSesion() {
  guardarSesion(null);
  window.dispatchEvent(new Event('nexus-sesion-expirada'));
}
async function parsear(respuesta) {
  const texto = await respuesta.text();
  if (!texto) return null;
  try { return JSON.parse(texto); } catch { throw new ApiError(respuesta.status, 'El servidor respondió un formato inesperado'); }
}
async function renovarSesion(sesionActual) {
  const respuesta = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST', headers: { 'Content-Type':'application/json', Accept:'application/json' },
    body: JSON.stringify({refreshToken:sesionActual.refreshToken}),
  });
  const datos = await parsear(respuesta);
  if (!respuesta.ok || !datos?.accessToken) throw new ApiError(respuesta.status, datos?.detail || 'Sesión caducada');
  const nueva = { ...sesionActual, accessToken:datos.accessToken, refreshToken:datos.refreshToken,
    expiraEn:Date.now()+datos.expiresIn*1000, rol:datos.rol, correo:datos.correo };
  guardarSesion(nueva);
  window.dispatchEvent(new Event('nexus-sesion-renovada'));
  return nueva;
}
export async function apiFetch(ruta, { method='GET', body, auth=true } = {}) {
  const ejecutar = async (token) => {
    const headers={Accept:'application/json'};
    if(body!==undefined)headers['Content-Type']='application/json';
    if(auth && token)headers.Authorization=`Bearer ${token}`;
    try { return await fetch(`${API_URL}${ruta}`,{method,headers,body:body===undefined?undefined:JSON.stringify(body)}); }
    catch { throw new ApiError(0, 'No se pudo conectar con el API Gateway en http://localhost:9080'); }
  };
  const sesion=leerSesion();
  let respuesta=await ejecutar(sesion?.accessToken);
  if(respuesta.status===401 && auth && sesion?.refreshToken) {
    try {
      if(!renovacionPendiente) {
        renovacionPendiente=renovarSesion(leerSesion());
        renovacionPendiente.finally(()=>{renovacionPendiente=null}).catch(()=>{});
      }
      const nueva=await renovacionPendiente;
      respuesta=await ejecutar(nueva.accessToken);
    }catch { terminarSesion();throw new ApiError(401,'Tu sesión expiró. Inicia sesión nuevamente'); }
  }
  if (respuesta.status===204) return null;
  const datos=await parsear(respuesta);
  if(!respuesta.ok) {
    if (respuesta.status===401 && auth && sesion) terminarSesion();
    throw new ApiError(respuesta.status, datos?.detail || (respuesta.status===403?'No tienes permiso para esta acción':`Error ${respuesta.status}`),datos?.errors || {});
  }
  return datos;
}
