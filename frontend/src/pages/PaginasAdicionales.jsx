import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { Cargando, MensajeError } from '../components/Estado.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { REGIONES, comunasDe } from '../data/regiones.js';
import { buscarProductos } from '../services/productosService.js';
import { crearBoleta, listarBoletas, obtenerBoleta, misBoletas } from '../services/boletasService.js';
import { miPerfil, actualizarMiPerfil, obtenerUsuario, actualizarUsuario, listarUsuarios } from '../services/usuariosService.js';
import { crearUsuarioComoAdmin, cambiarRolUsuario, desactivarUsuario } from '../services/authService.js';
import { formatearPrecio } from '../utils/formato.js';
import { validarCorreo, validarRun, validarPassword } from '../utils/validaciones.js';
import { validarEnvio, construirPedido } from '../utils/checkout.js';

const ARTICULOS = [
  {
    id: 'guia-cuidar-consola', titulo: 'Cómo cuidar tu consola y mantenerla en buen estado',
    fecha: '12 de octubre de 2026', categoria: 'Consejos',
    resumen: 'Limpieza, ventilación y buenas prácticas para que tu consola dure más tiempo.',
    parrafos: [
      'Una ventilación adecuada es esencial: coloca la consola sobre una superficie firme y evita dejar objetos cerca de las entradas de aire.',
      'Limpia el exterior con un paño suave y seco. Antes de limpiar, apaga y desconecta el equipo. No introduzcas líquidos en sus ranuras.',
      'Mantén el software actualizado, protege tus cuentas con una contraseña única y revisa periódicamente el espacio de almacenamiento.',
    ],
  },
  {
    id: 'guia-armar-setup', titulo: 'Ideas para organizar un setup gamer cómodo',
    fecha: '28 de octubre de 2026', categoria: 'Guías',
    resumen: 'Pequeñas mejoras de iluminación, orden y ergonomía para tu espacio de juego.',
    parrafos: [
      'La comodidad comienza por ajustar la altura de la silla y el monitor: procura mantener los brazos relajados y la pantalla frente a tus ojos.',
      'Organiza los cables con abrazaderas y deja libre el área del mouse. La iluminación indirecta ayuda a evitar reflejos molestos.',
      'No necesitas comprar todo de una vez. Prioriza periféricos funcionales y un espacio fácil de mantener limpio.',
    ],
  },
];

function Encabezado({ titulo, descripcion }) {
  return <><h1 className="h2 font-display mb-2">{titulo}</h1>{descripcion && <p className="text-secondary mb-4">{descripcion}</p>}</>;
}
function Alerta({ error }) {
  return error ? <div className="alert alert-danger" role="alert">{error.message || String(error)}</div> : null;
}
function Campo({ titulo, valor, onChange, type = 'text', required = false, ...resto }) {
  return <label className="form-label d-block mb-3">{titulo}
    <input className="form-control mt-1" value={valor ?? ''} onChange={e => onChange(e.target.value)} type={type} required={required} {...resto} />
  </label>;
}
function LineasBoleta({ boleta }) {
  return <>
    <p className="text-secondary mb-2">Fecha: {boleta.fecha ? new Date(boleta.fecha).toLocaleString('es-CL') : '—'} · Estado: {boleta.estado}</p>
    <p>Entrega: {boleta.nombreCliente} · {boleta.region}, {boleta.comuna}, {boleta.direccion}</p>
    <div className="table-responsive"><table className="table table-dark table-hover align-middle"><thead><tr><th>Producto</th><th>Cantidad</th><th>Precio unitario</th><th>Subtotal</th></tr></thead>
      <tbody>{boleta.detalles?.map((d, i) => <tr key={`${d.productoId}-${i}`}><td>{d.nombre} <small className="text-secondary">({d.codigo})</small></td><td>{d.cantidad}</td><td>{formatearPrecio(d.precioUnitario)}</td><td>{formatearPrecio(d.subtotal)}</td></tr>)}</tbody>
    </table></div>
    <p className="fs-4 text-end">Total: <strong className="precio">{formatearPrecio(boleta.total)}</strong></p>
  </>;
}

export function Ofertas() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);
  const { agregar } = useCart();
  useEffect(() => { buscarProductos({ ofertas: true, size: 100 }).then(setDatos).catch(setError); }, []);
  return <section className="container py-5"><Encabezado titulo="Ofertas" descripcion="Precios especiales en juegos y accesorios seleccionados." /><Alerta error={error} />
    {!datos && !error && <Cargando />}
    {datos?.content?.length === 0 && <p>No hay productos en oferta por ahora.</p>}
    <div className="row g-3">{datos?.content?.map(p => <div className="col-sm-6 col-lg-3" key={p.id}><ProductCard producto={p} onAgregar={agregar} /></div>)}</div>
  </section>;
}

export function Blog() {
  return <section className="container py-5"><Encabezado titulo="Blog gamer" descripcion="Consejos y artículos de Nexus Gaming Store." />
    <div className="row g-3">{ARTICULOS.map(a => <div className="col-md-6" key={a.id}><article className="card card-nexus h-100"><div className="card-body">
      <span className="badge text-bg-primary mb-3">{a.categoria}</span><h2 className="h4">{a.titulo}</h2><p className="text-secondary small">{a.fecha}</p><p>{a.resumen}</p>
      <Link className="btn btn-outline-light" to={`/blog/${a.id}`}>Leer artículo</Link>
    </div></article></div>)}</div>
  </section>;
}
export function BlogDetalle() {
  const { id } = useParams();
  const articulo = ARTICULOS.find(a => a.id === id);
  if (!articulo) return <section className="container py-5"><h1>Artículo no encontrado</h1><Link to="/blog">Volver al blog</Link></section>;
  return <article className="container py-5" style={{maxWidth:850}}><Link to="/blog" className="small">← Blog</Link><Encabezado titulo={articulo.titulo} descripcion={`${articulo.fecha} · ${articulo.categoria}`} />
    {articulo.parrafos.map((p,i) => <p className="fs-5 lh-lg" key={i}>{p}</p>)}
  </article>;
}

const ENTREGA_VACIA = { nombre: '', correo: '', region: '', comuna: '', direccion: '', indicaciones: '' };
export function Checkout() {
  const { items, total, vaciar } = useCart();
  const { sesion } = useAuth();
  const navegar = useNavigate();
  const [form, setForm] = useState({ ...ENTREGA_VACIA, correo: sesion?.correo || '' });
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  useEffect(() => {
    miPerfil().then(p => setForm(f => ({ ...f, nombre: `${p.nombre} ${p.apellidos}`.trim(), correo: p.correo,
      region: p.region || '', comuna: p.comuna || '', direccion: p.direccion || '' })))
      .catch(() => {});
  }, []);
  const cambiar = (k, valor) => setForm(f => ({ ...f, [k]: valor, ...(k === 'region' ? {comuna:''} : {}) }));
  const confirmar = async (e) => {
    e.preventDefault();
    if (!items.length) return setError('El carrito está vacío');
    const errorEnvio = validarEnvio(form);
    if (errorEnvio) return setError(errorEnvio);
    setEnviando(true); setError('');
    try {
      const boleta = await crearBoleta(construirPedido(items, form));
      vaciar();
      navegar(`/compra/exitosa/${boleta.id}`, { replace: true });
    } catch (err) {
      navegar('/compra/fallida', {state:{mensaje:err.message}});
    } finally { setEnviando(false); }
  };
  if (!items.length) return <section className="container py-5"><h1>Tu carrito está vacío</h1><Link to="/productos">Ver productos</Link></section>;
  return <section className="container py-5"><Encabezado titulo="Confirmar compra" descripcion="Verifica tus datos antes de generar la orden de compra." />
    <div className="row g-4"><div className="col-lg-8"><form className="card card-nexus p-4" onSubmit={confirmar}>
      <h2 className="h5 mb-3">Datos de entrega</h2><Alerta error={error} />
      <div className="row"><div className="col-md-6"><Campo titulo="Nombre y apellidos" valor={form.nombre} onChange={v => cambiar('nombre', v)} maxLength={150} required /></div>
      <div className="col-md-6"><Campo titulo="Correo electrónico" valor={form.correo} onChange={v => cambiar('correo', v)} type="email" maxLength={100} required /></div>
      <div className="col-md-6"><label className="form-label d-block mb-3">Región<select required className="form-select mt-1" value={form.region} onChange={e => cambiar('region',e.target.value)}><option value="">Selecciona una región</option>{REGIONES.map(r => <option key={r.nombre} value={r.nombre}>{r.nombre}</option>)}</select></label></div>
      <div className="col-md-6"><label className="form-label d-block mb-3">Comuna<select required className="form-select mt-1" value={form.comuna} onChange={e => cambiar('comuna',e.target.value)} disabled={!form.region}><option value="">Selecciona una comuna</option>{comunasDe(form.region).map(c => <option key={c}>{c}</option>)}</select></label></div>
      <div className="col-md-12"><Campo titulo="Dirección de entrega" valor={form.direccion} onChange={v => cambiar('direccion',v)} maxLength={300} required /></div>
      <div className="col-md-12"><Campo titulo="Indicaciones (opcional)" valor={form.indicaciones} onChange={v => cambiar('indicaciones',v)} maxLength={300} /></div></div>
      <p className="small text-secondary">Esta demostración confirma una orden y descuenta stock; no procesa pagos bancarios reales.</p>
      <button type="submit" className="btn btn-nexus w-100" disabled={enviando}>{enviando ? 'Confirmando...' : 'Confirmar pedido'}</button>
    </form></div><div className="col-lg-4"><div className="card card-nexus p-4"><h2 className="h5">Tu pedido</h2>{items.map(i => <div className="d-flex justify-content-between gap-2 mb-2" key={i.id}><span>{i.nombre} × {i.cantidad}</span><strong>{formatearPrecio(i.precio*i.cantidad)}</strong></div>)}
      <hr/><p className="h4">Total estimado: {formatearPrecio(total)}</p><p className="small text-secondary">El servidor verifica el precio y el stock al confirmar.</p></div></div></div>
  </section>;
}
export function CompraExitosa() {
  const { id } = useParams(); const [boleta,setBoleta] = useState(null);const [error,setError]=useState(null);
  useEffect(() => { obtenerBoleta(id).then(setBoleta).catch(setError); }, [id]);
  return <section className="container py-5"><Encabezado titulo={`¡Pedido confirmado! #${id}`} descripcion="Tu orden fue registrada correctamente." /><Alerta error={error} />
    {!boleta && !error && <Cargando />}{boleta && <div className="card card-nexus p-4"><LineasBoleta boleta={boleta}/></div>}
    <Link to="/productos" className="btn btn-nexus mt-3">Seguir comprando</Link>
  </section>;
}
export function CompraFallida() {
  const { state } = useLocation();
  return <section className="container py-5 text-center"><h1 className="font-display">No se pudo confirmar el pedido</h1>
    <p role="alert" className="alert alert-danger mt-4">{state?.mensaje || 'Hubo un problema durante el proceso. Revisa el carrito y vuelve a intentarlo.'}</p>
    <Link className="btn btn-nexus" to="/carrito">Volver al carrito</Link>
  </section>;
}

export function AdminBoletas() {
  const [datos,setDatos]=useState(null);const [error,setError]=useState(null);
  useEffect(() => { listarBoletas().then(setDatos).catch(setError); }, []);
  return <><Encabezado titulo="Órdenes / Boletas" descripcion="Historial de pedidos registrados."/><Alerta error={error}/>{!datos&&!error&&<Cargando/>}
    <div className="table-responsive"><table className="table table-dark table-hover"><thead><tr><th>Número</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Estado</th><th></th></tr></thead><tbody>
      {datos?.map(b => <tr key={b.id}><td>#{b.id}</td><td>{new Date(b.fecha).toLocaleString('es-CL')}</td><td>{b.nombreCliente}</td><td>{formatearPrecio(b.total)}</td><td>{b.estado}</td><td><Link className="btn btn-outline-info btn-sm" to={`/admin/boletas/${b.id}`}>Ver detalle</Link></td></tr>)}
    </tbody></table></div>{datos?.length===0&&<p>No hay boletas registradas.</p>}
  </>;
}
export function AdminBoletaDetalle() {
  const {id}=useParams();const [boleta,setBoleta]=useState(null);const [error,setError]=useState(null);
  useEffect(()=>{ obtenerBoleta(id).then(setBoleta).catch(setError); },[id]);
  return <><Link to="/admin/boletas">← Volver a órdenes</Link><Encabezado titulo={`Boleta #${id}`}/><Alerta error={error}/>{!boleta&&!error&&<Cargando/>}{boleta&&<LineasBoleta boleta={boleta}/>}</>;
}
export function AdminCriticos() {
  const [datos,setDatos]=useState(null);const [error,setError]=useState(null);
  useEffect(()=>{ import('../services/productosService.js').then(s=>s.productosCriticos()).then(setDatos).catch(setError); },[]);
  return <><Encabezado titulo="Stock crítico" descripcion="Productos bajo su umbral de inventario."/><Alerta error={error}/>{!datos&&!error&&<Cargando/>}
    <div className="table-responsive"><table className="table table-dark"><thead><tr><th>Código</th><th>Producto</th><th>Stock</th><th>Umbral</th></tr></thead><tbody>{datos?.map(p=><tr key={p.id}><td>{p.codigo}</td><td>{p.nombre}</td><td className="text-warning">{p.stock}</td><td>{p.stockCritico}</td></tr>)}</tbody></table></div>
    {datos?.length===0&&<p>No hay productos con stock crítico.</p>}
  </>;
}
export function AdminReportes() {
  const [boletas,setBoletas]=useState(null);const [error,setError]=useState(null);
  useEffect(()=>{listarBoletas().then(setBoletas).catch(setError)},[]);
  const reporte=useMemo(()=>{const arr=boletas||[];const vendidos=new Map();arr.forEach(b=>b.detalles?.forEach(d=>{const item=vendidos.get(d.productoId)||{nombre:d.nombre,cantidad:0,total:0};item.cantidad+=d.cantidad;item.total+=Number(d.subtotal);vendidos.set(d.productoId,item)}));return {total:arr.reduce((t,b)=>t+Number(b.total),0),cantidad:arr.length,items:[...vendidos.values()].sort((a,b)=>b.cantidad-a.cantidad)}},[boletas]);
  return <><Encabezado titulo="Reportes de ventas" descripcion="Resumen calculado sobre las boletas registradas."/><Alerta error={error}/>{!boletas&&!error&&<Cargando/>}
    {boletas&&<><div className="row g-3 mb-4"><div className="col-md-6"><div className="card card-nexus p-4"><span>Venta total</span><strong className="fs-3 precio">{formatearPrecio(reporte.total)}</strong></div></div>
    <div className="col-md-6"><div className="card card-nexus p-4"><span>Cantidad de pedidos</span><strong className="fs-3">{reporte.cantidad}</strong></div></div></div>
    <h2 className="h5">Productos más vendidos</h2><div className="table-responsive"><table className="table table-dark"><thead><tr><th>Producto</th><th>Unidades</th><th>Monto vendido</th></tr></thead><tbody>
    {reporte.items.map((i,n)=><tr key={n}><td>{i.nombre}</td><td>{i.cantidad}</td><td>{formatearPrecio(i.total)}</td></tr>)}</tbody></table></div>{!reporte.items.length&&<p>Sin ventas todavía.</p>}</>}
  </>;
}

export function PerfilUsuario() {
  const [perfil,setPerfil]=useState(null); const [error,setError]=useState(null);const [guardado,setGuardado]=useState(false);const [ocupado,setOcupado]=useState(false);
  useEffect(()=>{miPerfil().then(setPerfil).catch(setError)},[]);
  const cambiar=(k,v)=>setPerfil(p=>({...p,[k]:v,...(k==='region'?{comuna:''}:{})}));
  const guardar=async e=>{e.preventDefault();setOcupado(true);setError(null);setGuardado(false);
    try{const {nombre,apellidos,fechaNacimiento,region,comuna,direccion}=perfil;const nuevo=await actualizarMiPerfil({nombre,apellidos,fechaNacimiento:fechaNacimiento||null,region,comuna,direccion});setPerfil(nuevo);setGuardado(true)}catch(err){setError(err)}finally{setOcupado(false)}
  };
  return <section className="container py-4" style={{maxWidth:760}}><Encabezado titulo="Mi perfil" descripcion="Actualiza tus datos de contacto y despacho."/><Alerta error={error}/>{!perfil&&!error&&<Cargando/>}{guardado&&<p className="alert alert-success">Perfil actualizado.</p>}
    {perfil&&<form onSubmit={guardar} className="card card-nexus p-4"><p className="small text-secondary">RUN: {perfil.run} · Correo: {perfil.correo} · Rol: {perfil.rol}</p>
      <Campo titulo="Nombre" valor={perfil.nombre} onChange={v=>cambiar('nombre',v)} maxLength={50} required />
      <Campo titulo="Apellidos" valor={perfil.apellidos} onChange={v=>cambiar('apellidos',v)} maxLength={100} required />
      <Campo titulo="Fecha de nacimiento" valor={perfil.fechaNacimiento} type="date" onChange={v=>cambiar('fechaNacimiento',v)} />
      <label className="form-label">Región<select className="form-select" value={perfil.region||''} onChange={e=>cambiar('region',e.target.value)}><option value="">Elige una región</option>{REGIONES.map(r=><option key={r.nombre}>{r.nombre}</option>)}</select></label>
      <label className="form-label">Comuna<select className="form-select" value={perfil.comuna||''} onChange={e=>cambiar('comuna',e.target.value)}><option value="">Selecciona comuna</option>{comunasDe(perfil.region).map(c=><option key={c}>{c}</option>)}</select></label>
      <Campo titulo="Dirección" valor={perfil.direccion} onChange={v=>cambiar('direccion',v)} maxLength={300} required />
      <button disabled={ocupado} className="btn btn-nexus">{ocupado?'Guardando...':'Guardar cambios'}</button>
    </form>}</section>;
}
export function AdminPerfil() { return <PerfilUsuario />; }

const USUARIO_VACIO={run:'',nombre:'',apellidos:'',correo:'',password:'',fechaNacimiento:'',region:'',comuna:'',direccion:'',rol:'CLIENTE'};
export function AdminUsuarioForm() {
  const {id}=useParams();const editar=Boolean(id);const navegar=useNavigate();
  const [form,setForm]=useState(USUARIO_VACIO);const [error,setError]=useState(null);const [guardando,setGuardando]=useState(false);
  useEffect(()=>{ if(editar) obtenerUsuario(id).then(u=>setForm({...u,fechaNacimiento:u.fechaNacimiento||'',password:''})).catch(setError);},[id,editar]);
  const cambiar=(k,v)=>setForm(f=>({...f,[k]:v,...(k==='region'?{comuna:''}:{})}));
  const guardar=async(e)=>{e.preventDefault();setError(null);setGuardando(true);
    try{
      if(!editar){const msg=validarRun(form.run)||validarCorreo(form.correo)||validarPassword(form.password);if(msg)throw new Error(msg);
        const {rol,...usuario}=form;await crearUsuarioComoAdmin({usuario:{...usuario,fechaNacimiento:usuario.fechaNacimiento||null},rol});}
      else {const {nombre,apellidos,fechaNacimiento,region,comuna,direccion}=form;await actualizarUsuario(id,{nombre,apellidos,fechaNacimiento:fechaNacimiento||null,region,comuna,direccion});
        await cambiarRolUsuario(id,form.rol);}
      navegar('/admin/usuarios');
    }catch(err){setError(err)}finally{setGuardando(false)}
  };
  return <><Encabezado titulo={editar?'Editar usuario':'Nuevo usuario'} descripcion="Gestión de perfiles y permisos."/><Alerta error={error}/>
    <form onSubmit={guardar} className="card card-nexus p-4" style={{maxWidth:850}}>
      {!editar&&<><Campo titulo="RUN (sin puntos ni guion)" valor={form.run} onChange={v=>cambiar('run',v.toUpperCase())} maxLength={9} required/>
      <Campo titulo="Correo" type="email" valor={form.correo} onChange={v=>cambiar('correo',v)} maxLength={100} required/>
      <Campo titulo="Contraseña (4 a 10 caracteres)" type="password" valor={form.password} onChange={v=>cambiar('password',v)} minLength={4} maxLength={10} required/></>}
      {editar&&<p className="text-secondary">RUN: {form.run} · Correo: {form.correo}</p>}
      <div className="row"><div className="col-md-6"><Campo titulo="Nombre" valor={form.nombre} onChange={v=>cambiar('nombre',v)} maxLength={50} required/></div>
      <div className="col-md-6"><Campo titulo="Apellidos" valor={form.apellidos} onChange={v=>cambiar('apellidos',v)} maxLength={100} required/></div></div>
      <Campo titulo="Fecha de nacimiento (opcional)" type="date" valor={form.fechaNacimiento||''} onChange={v=>cambiar('fechaNacimiento',v)} />
      <label className="form-label">Región<select className="form-select" value={form.region||''} onChange={e=>cambiar('region',e.target.value)} required><option value="">Seleccionar</option>{REGIONES.map(r=><option key={r.nombre}>{r.nombre}</option>)}</select></label>
      <label className="form-label">Comuna<select className="form-select" value={form.comuna||''} onChange={e=>cambiar('comuna',e.target.value)} required><option value="">Seleccionar</option>{comunasDe(form.region).map(c=><option key={c}>{c}</option>)}</select></label>
      <Campo titulo="Dirección" valor={form.direccion} onChange={v=>cambiar('direccion',v)} maxLength={300} required/>
      <label className="form-label">Tipo de usuario<select className="form-select" value={form.rol||'CLIENTE'} onChange={e=>cambiar('rol',e.target.value)}><option value="CLIENTE">Cliente</option><option value="VENDEDOR">Vendedor</option><option value="ADMIN">Administrador</option></select></label>
      <button className="btn btn-nexus mt-2" disabled={guardando}>{guardando?'Guardando...':'Guardar usuario'}</button>
    </form></>;
}
export function AdminUsuarioDetalle() {
  const {id}=useParams();const [usuario,setUsuario]=useState(null);const [boletas,setBoletas]=useState(null);const [error,setError]=useState(null);const navegar=useNavigate();
  useEffect(()=>{obtenerUsuario(id).then(setUsuario).catch(setError);listarBoletas().then(b=>setBoletas(b.filter(x=>String(x.usuarioId)===String(id)))).catch(setError)},[id]);
  const borrar=async()=>{if(!window.confirm('¿Desactivar esta cuenta? El usuario dejará de poder iniciar sesión.'))return;
    try{await desactivarUsuario(id);navegar('/admin/usuarios')}catch(err){setError(err)}};
  return <><Link to="/admin/usuarios">← Volver a usuarios</Link><Encabezado titulo={`Usuario #${id}`}/><Alerta error={error}/>
    {usuario&&<div className="card card-nexus p-4 mb-4"><h2 className="h5">{usuario.nombre} {usuario.apellidos}</h2><p>{usuario.correo} · RUN: {usuario.run}</p><p>{usuario.rol} · {usuario.region}, {usuario.comuna}, {usuario.direccion}</p>
      <div className="d-flex gap-2"><Link to={`/admin/usuarios/${id}/editar`} className="btn btn-outline-info">Editar</Link><button onClick={borrar} className="btn btn-outline-danger">Desactivar usuario</button></div></div>}
    <h2 className="h5">Compras del usuario</h2>{boletas?.length===0&&<p>No tiene compras registradas.</p>}{boletas?.map(b=><p key={b.id}><Link to={`/admin/boletas/${b.id}`}>Boleta #{b.id}</Link> · {formatearPrecio(b.total)}</p>)}
  </>;
}

export function MiCuenta() {
  const [boletas,setBoletas]=useState(null);const [error,setError]=useState(null);
  useEffect(()=>{misBoletas().then(setBoletas).catch(setError)},[]);
  return <section className="container py-5"><Encabezado titulo="Mi cuenta" descripcion="Tu información y tus pedidos en Nexus Gaming Store." />
    <Link to="/mi-perfil" className="btn btn-outline-light mb-4">Editar mi perfil</Link><h2 className="h4">Historial de compras</h2><Alerta error={error}/>{!boletas&&!error&&<Cargando/>}
    {boletas?.length===0&&<p>Aún no tienes compras registradas.</p>}
    <div className="row g-3">{boletas?.map(b=><div className="col-md-6" key={b.id}><div className="card card-nexus p-3 h-100"><h3 className="h6">Pedido #{b.id}</h3><p className="text-secondary small">{new Date(b.fecha).toLocaleString('es-CL')}</p><strong className="precio">{formatearPrecio(b.total)}</strong><Link to={`/compra/exitosa/${b.id}`} className="btn btn-outline-info btn-sm mt-3">Ver detalle</Link></div></div>)}</div>
  </section>;
}
