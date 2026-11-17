import { useEffect, useState } from 'react';
import { MensajeError } from '../../components/Estado.jsx';
import { actualizarCategoria, crearCategoria, listarCategorias } from '../../services/productosService.js';
import { validarLargoMaximo, validarRequerido } from '../../utils/validaciones.js';

export default function CategoriasAdmin() {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState('');
  const [errorCampo, setErrorCampo] = useState('');
  const [error, setError] = useState(null);
  const [editando, setEditando] = useState(null); // { id, nombre }

  const cargar = () => listarCategorias().then(setCategorias).catch(setError);

  useEffect(() => {
    cargar();
  }, []);

  const validar = (v) => validarRequerido(v, 'El nombre') || validarLargoMaximo(v, 80);

  const crear = async (e) => {
    e.preventDefault();
    const msg = validar(nombre);
    setErrorCampo(msg);
    if (msg) return;
    try {
      await crearCategoria(nombre.trim());
      setNombre('');
      setError(null);
      cargar();
    } catch (err) {
      setError(err);
    }
  };

  const guardarEdicion = async () => {
    if (validar(editando.nombre)) return;
    try {
      await actualizarCategoria(editando.id, editando.nombre.trim());
      setEditando(null);
      cargar();
    } catch (err) {
      setError(err);
    }
  };

  return (
    <>
      <h1 className="h3 font-display mb-3">Categorías</h1>
      <MensajeError error={error} />
      <form noValidate onSubmit={crear} className="d-flex gap-2 mb-4" style={{ maxWidth: 520 }}>
        <div className="flex-grow-1">
          <label htmlFor="nuevaCategoria" className="visually-hidden">Nueva categoría</label>
          <input
            id="nuevaCategoria"
            className={`form-control${errorCampo ? ' is-invalid' : ''}`}
            placeholder="Nueva categoría"
            maxLength={80}
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              setErrorCampo('');
            }}
          />
          {errorCampo && <div className="invalid-feedback">{errorCampo}</div>}
        </div>
        <button className="btn btn-nexus" type="submit">Agregar</button>
      </form>
      <ul className="list-group" style={{ maxWidth: 520 }}>
        {categorias.map((c) => (
          <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center gap-2">
            {editando?.id === c.id ? (
              <>
                <input
                  className="form-control form-control-sm"
                  aria-label="Nuevo nombre"
                  value={editando.nombre}
                  onChange={(e) => setEditando({ ...editando, nombre: e.target.value })}
                />
                <button className="btn btn-sm btn-success" onClick={guardarEdicion}>Guardar</button>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditando(null)}>Cancelar</button>
              </>
            ) : (
              <>
                <span>{c.nombre}</span>
                <button className="btn btn-sm btn-outline-info" onClick={() => setEditando({ id: c.id, nombre: c.nombre })}>
                  Editar
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
