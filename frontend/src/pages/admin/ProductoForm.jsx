import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CampoFormulario from '../../components/CampoFormulario.jsx';
import { Cargando } from '../../components/Estado.jsx';
import { actualizarProducto, crearProducto, listarCategorias, obtenerProducto } from '../../services/productosService.js';
import { validarFormulario, validarLargoMaximo, validarRequerido } from '../../utils/validaciones.js';

const VACIO = { codigo: '', nombre: '', descripcion: '', precio: '', precioOferta: '', stock: '', stockCritico: '', categoriaId: '', imagen: '' };

const esEntero = (v) => /^\d+$/.test(String(v));

/** Validaciones del formulario "Nuevo/Editar producto" (Anexo 1). Exportada para poder probarla. */
export function validarProducto(d) {
  return validarFormulario({
    codigo: () => validarRequerido(d.codigo, 'El código') || (d.codigo.trim().length < 3 ? 'Mínimo 3 caracteres' : ''),
    nombre: () => validarRequerido(d.nombre, 'El nombre') || validarLargoMaximo(d.nombre, 100),
    descripcion: () => validarLargoMaximo(d.descripcion, 500),
    precio: () => {
      if (d.precio === '') return 'El precio es requerido';
      return Number(d.precio) < 0 || Number.isNaN(Number(d.precio)) ? 'El precio mínimo es 0' : '';
    },
    precioOferta: () => {
      if (d.precioOferta === '') return '';
      if (Number(d.precioOferta) < 0) return 'No puede ser negativo';
      return Number(d.precioOferta) >= Number(d.precio) ? 'Debe ser menor al precio normal' : '';
    },
    stock: () => {
      if (d.stock === '') return 'El stock es requerido';
      return esEntero(d.stock) ? '' : 'Solo números enteros desde 0';
    },
    stockCritico: () => (d.stockCritico === '' || esEntero(d.stockCritico) ? '' : 'Solo números enteros desde 0'),
    categoriaId: () => validarRequerido(d.categoriaId, 'La categoría'),
  });
}

export default function ProductoForm() {
  const { id } = useParams();
  const editando = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(VACIO);
  const [categorias, setCategorias] = useState([]);
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState('');
  const [cargando, setCargando] = useState(editando);

  useEffect(() => {
    listarCategorias().then(setCategorias).catch(() => setCategorias([]));
    if (editando) {
      obtenerProducto(id)
        .then((p) =>
          setForm({
            codigo: p.codigo,
            nombre: p.nombre,
            descripcion: p.descripcion ?? '',
            precio: String(p.precio),
            precioOferta: p.precioOferta == null ? '' : String(p.precioOferta),
            stock: String(p.stock),
            stockCritico: p.stockCritico == null ? '' : String(p.stockCritico),
            categoriaId: String(p.categoriaId),
            imagen: p.imagen ?? '',
          }),
        )
        .catch((e) => setErrorServidor(e.message))
        .finally(() => setCargando(false));
    }
  }, [id, editando]);

  const alCambiar = (e) => {
    const nuevo = { ...form, [e.target.name]: e.target.value };
    setForm(nuevo);
    setErrores((prev) => ({ ...prev, [e.target.name]: validarProducto(nuevo)[e.target.name] }));
  };

  const alEnviar = async (e) => {
    e.preventDefault();
    const encontrados = validarProducto(form);
    setErrores(encontrados);
    if (Object.keys(encontrados).length > 0) return;
    const payload = {
      ...form,
      precio: Number(form.precio),
      precioOferta: form.precioOferta === '' ? null : Number(form.precioOferta),
      stock: Number(form.stock),
      stockCritico: form.stockCritico === '' ? null : Number(form.stockCritico),
      categoriaId: Number(form.categoriaId),
      imagen: form.imagen || null,
    };
    try {
      if (editando) await actualizarProducto(id, payload);
      else await crearProducto(payload);
      navigate('/admin/productos');
    } catch (err) {
      setErrorServidor(err.message);
      setErrores((prev) => ({ ...prev, ...err.errores }));
    }
  };

  if (cargando) return <Cargando />;

  const campo = (name, label, extra = {}) => (
    <CampoFormulario id={name} label={label} value={form[name]} onChange={alCambiar} error={errores[name]} {...extra} />
  );

  return (
    <>
      <h1 className="h3 font-display mb-3">{editando ? 'Editar producto' : 'Nuevo producto'}</h1>
      {errorServidor && <div className="alert alert-danger" role="alert">{errorServidor}</div>}
      <form noValidate onSubmit={alEnviar} className="card card-nexus p-4" style={{ maxWidth: 820 }}>
        <div className="row">
          <div className="col-md-4">{campo('codigo', 'Código', { placeholder: 'JPC010', ayuda: 'Mínimo 3 caracteres' })}</div>
          <div className="col-md-8">{campo('nombre', 'Nombre', { maxLength: 100 })}</div>
          <div className="col-12">
            {campo('descripcion', 'Descripción (opcional)', { as: 'textarea', rows: 3, maxLength: 500, ayuda: `${form.descripcion.length}/500` })}
          </div>
          <div className="col-md-3">{campo('precio', 'Precio', { type: 'number', min: 0, step: '0.01', ayuda: '0 = producto gratis' })}</div>
          <div className="col-md-3">{campo('precioOferta', 'Precio oferta', { type: 'number', min: 0, step: '0.01', ayuda: 'Opcional' })}</div>
          <div className="col-md-3">{campo('stock', 'Stock', { type: 'number', min: 0, step: 1 })}</div>
          <div className="col-md-3">{campo('stockCritico', 'Stock crítico', { type: 'number', min: 0, step: 1, ayuda: 'Opcional' })}</div>
          <div className="col-md-6">
            {campo('categoriaId', 'Categoría', {
              as: 'select',
              children: [
                <option key="" value="">Selecciona una categoría</option>,
                ...categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>),
              ],
            })}
          </div>
          <div className="col-md-6">{campo('imagen', 'URL de imagen (opcional)', { type: 'url', placeholder: 'https://...' })}</div>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-nexus" type="submit">Guardar</button>
          <Link to="/admin/productos" className="btn btn-outline-secondary">Cancelar</Link>
        </div>
      </form>
    </>
  );
}
