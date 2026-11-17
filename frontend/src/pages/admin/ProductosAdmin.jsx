import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cargando, MensajeError } from '../../components/Estado.jsx';
import { buscarProductos, eliminarProducto } from '../../services/productosService.js';
import { formatearPrecio } from '../../utils/formato.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ProductosAdmin() {
  const { tieneRol } = useAuth();
  const puedeEditar = tieneRol('ADMIN');
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [q, setQ] = useState('');

  const cargar = useCallback(() => {
    setCargando(true);
    buscarProductos({ q, size: 200 })
      .then((p) => setProductos(p.content))
      .catch(setError)
      .finally(() => setCargando(false));
  }, [q]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const eliminar = async (p) => {
    if (!window.confirm(`¿Eliminar "${p.nombre}"? Dejará de mostrarse en la tienda.`)) return;
    try {
      await eliminarProducto(p.id);
      cargar();
    } catch (err) {
      setError(err);
    }
  };

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 font-display mb-0">Productos</h1>
        {puedeEditar && <Link to="/admin/productos/nuevo" className="btn btn-nexus">+ Nuevo producto</Link>}
      </div>
      <input
        type="search"
        className="form-control mb-3"
        placeholder="Filtrar por nombre o código"
        aria-label="Filtrar productos"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <MensajeError error={error} />
      {cargando ? (
        <Cargando />
      ) : (
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th className="text-end">Precio</th>
                <th className="text-end">Stock</th>
                <th><span className="visually-hidden">Acciones</span></th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td><code>{p.codigo}</code></td>
                  <td>
                    {p.nombre} {p.enOferta && <span className="badge text-bg-danger ms-1">Oferta</span>}
                  </td>
                  <td>{p.categoriaNombre}</td>
                  <td className="text-end">{formatearPrecio(p.precioFinal)}</td>
                  <td className="text-end">
                    {p.stock}{' '}
                    {p.critico && (
                      <span className="badge text-bg-warning" title={`Stock crítico: ${p.stockCritico}`}>
                        ⚠ crítico
                      </span>
                    )}
                  </td>
                  <td className="text-end text-nowrap">
                    {puedeEditar && <><Link to={`/admin/productos/${p.id}/editar`} className="btn btn-sm btn-outline-info me-1">Editar</Link>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => eliminar(p)}>Eliminar</button></>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
