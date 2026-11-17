import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarBoletas } from '../../services/boletasService.js';
import { buscarProductos } from '../../services/productosService.js';
import { listarUsuarios } from '../../services/usuariosService.js';
import { formatearPrecio } from '../../utils/formato.js';

/** Resumen del panel. Cada indicador se carga por separado: si un servicio falla, el resto se muestra igual. */
export default function Dashboard() {
  const [datos, setDatos] = useState({ productos: null, criticos: null, usuarios: null, boletas: null, ventas: null });

  useEffect(() => {
    buscarProductos({ size: 200 })
      .then((p) => setDatos((d) => ({ ...d, productos: p.totalElements, criticos: p.content.filter((x) => x.critico).length })))
      .catch(() => setDatos((d) => ({ ...d, productos: '—', criticos: '—' })));
    listarUsuarios()
      .then((u) => setDatos((d) => ({ ...d, usuarios: u.length })))
      .catch(() => setDatos((d) => ({ ...d, usuarios: '—' })));
    listarBoletas()
      .then((b) => setDatos((d) => ({ ...d, boletas: b.length, ventas: b.reduce((t, x) => t + Number(x.total), 0) })))
      .catch(() => setDatos((d) => ({ ...d, boletas: '—', ventas: null })));
  }, []);

  const tarjetas = [
    { titulo: 'Productos activos', valor: datos.productos, link: '/admin/productos', color: 'primary' },
    { titulo: 'Stock crítico', valor: datos.criticos, link: '/admin/productos/criticos', color: 'danger' },
    { titulo: 'Usuarios', valor: datos.usuarios, link: '/admin/usuarios', color: 'info' },
    { titulo: 'Boletas', valor: datos.boletas, link: '/admin/boletas', color: 'success' },
  ];

  return (
    <>
      <h1 className="h3 font-display mb-1">Dashboard</h1>
      <p className="text-secondary">Resumen general de la tienda.</p>
      <div className="row g-3 mb-4">
        {tarjetas.map((t) => (
          <div className="col-sm-6 col-xl-3" key={t.titulo}>
            <Link to={t.link} className={`card card-nexus border-start border-4 border-${t.color} text-decoration-none h-100`}>
              <div className="card-body">
                <div className="small text-secondary">{t.titulo}</div>
                <div className="fs-2 fw-bold">{t.valor ?? '…'}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div className="card card-nexus">
        <div className="card-body">
          <h2 className="h6 text-secondary">Ventas totales</h2>
          <p className="fs-3 mb-0">{datos.ventas == null ? '—' : formatearPrecio(datos.ventas)}</p>
          <p className="small text-secondary mb-0">Calculado a partir de las boletas registradas.</p>
        </div>
      </div>
    </>
  );
}
