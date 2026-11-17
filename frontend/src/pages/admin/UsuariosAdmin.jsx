import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cargando, MensajeError } from '../../components/Estado.jsx';
import { listarUsuarios } from '../../services/usuariosService.js';

const COLOR_ROL = { ADMIN: 'danger', VENDEDOR: 'warning', CLIENTE: 'info' };

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    listarUsuarios()
      .then(setUsuarios)
      .catch(setError)
      .finally(() => setCargando(false));
  }, []);

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 font-display mb-0">Usuarios</h1>
        <Link to="/admin/usuarios/nuevo" className="btn btn-nexus">
          + Nuevo usuario
        </Link>
      </div>
      <MensajeError error={error} />
      {cargando ? (
        <Cargando />
      ) : (
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle">
            <thead>
              <tr>
                <th>RUN</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Comuna</th>
                <th>Tipo</th>
                <th><span className="visually-hidden">Acciones</span></th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td><code>{u.run}</code></td>
                  <td>{u.nombre} {u.apellidos}</td>
                  <td>{u.correo}</td>
                  <td>{u.comuna}</td>
                  <td><span className={`badge text-bg-${COLOR_ROL[u.rol] ?? 'secondary'}`}>{u.rol}</span></td>
                  <td className="text-end">
                    <Link to={`/admin/usuarios/${u.id}`} className="btn btn-sm btn-outline-info">
                      Mostrar
                    </Link>
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
