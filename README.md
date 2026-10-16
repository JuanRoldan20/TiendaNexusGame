# Nexus Gaming Store — React + Vite

Migración completa del proyecto HTML original `NEXUS GAMING STORE` a React JSX.

## Incluye

- Inicio con hero y productos destacados.
- Catálogo completo de 52 videojuegos.
- Búsqueda, filtro por categoría y paginación de 12 productos.
- Carrito persistente con `localStorage`.
- Checkout con tarjeta o transferencia.
- Registro e inicio de sesión de clientes.
- Inicio de sesión de administrador.
- Panel administrativo CRUD de productos.
- Historial de ventas y generación de licencia de ejemplo.
- Descuento de stock al confirmar una compra.
- Sucursal en Viña del Mar con mapa Leaflet/OpenStreetMap.
- Carrusel de fondos de autenticación de 60 segundos.
- Diseño responsive y estilos cyberpunk/dark del proyecto original.

## Ejecutar

Requisitos: Node.js 18+ recomendado.

```bash
npm install
npm run dev
```

Para producción:

```bash
npm run build
npm run preview
```

## Acceso administrador de demostración

- Correo: `admin@nexus.com`
- Contraseña: `admin123`
- Token: opcional; si se utiliza, `12345`

## Persistencia

La aplicación mantiene las mismas claves principales del proyecto HTML:

- `nexus_productos`
- `nexus_carrito`
- `nexus_usuarios`
- `nexus_usuario_activo`
- `historialVentas`

> Es una aplicación frontend de demostración. Las credenciales y datos se almacenan en `localStorage`, por lo que no debe utilizarse como sistema de autenticación real en producción.

## Nota sobre el mapa

El mapa usa Leaflet cargado desde CDN y OpenStreetMap como proveedor de mapas, igual que la implementación HTML original. Requiere conexión a Internet para cargar las teselas y la librería del mapa.
