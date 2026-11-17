# Documentación de API REST - Nexus Gaming Store

## 1. Acceso a la API

La API se utiliza localmente desde `http://localhost:9080/api/v1`. Las solicitudes privadas deben enviar un token JWT en el encabezado `Authorization: Bearer <JWT>`. El Gateway revisa el token y los permisos antes de dar acceso.

Los endpoints se pueden revisar en Swagger UI de cada servicio: autenticación (puerto 9081), usuarios (9082), catálogo (9083) y órdenes (9084), utilizando la ruta `/swagger-ui.html`.

## 2. Registro y autenticación

- **POST** `/auth/registro` (Público): Crear credencial y perfil como CLIENTE
- **POST** `/auth/login` (Público): Iniciar sesión y obtener access/refresh tokens
- **POST** `/auth/refresh` (Público con refresh token): Renovar JWT y rotar refresh token
- **POST** `/auth/usuarios` (ADMIN): Crear usuario y elegir rol
- **PUT** `/auth/usuarios/{id}/rol` (ADMIN): Cambiar rol de credencial y perfil
- **DELETE** `/auth/usuarios/{id}` (ADMIN): Desactivar credencial y perfil

Para iniciar sesión se envían `correo` y `password`. Si los datos son correctos, se reciben `accessToken`, `refreshToken`, `expiresIn`, `usuarioId`, `correo` y `rol`.

La renovación de sesión recibe `refreshToken`. Los administradores también pueden crear cuentas y asignar el rol correspondiente desde los endpoints de usuarios.

## 3. Usuarios

- **GET** `/usuarios/me` (Autenticado): Consultar perfil propio
- **PUT** `/usuarios/me` (Autenticado): Cambiar datos personales propios
- **GET** `/usuarios` (ADMIN): Listar perfiles activos
- **GET** `/usuarios/{id}` (ADMIN): Consultar un perfil
- **PUT** `/usuarios/{id}` (ADMIN): Editar datos personales

El perfil incluye información como RUN, nombre, apellidos, correo, fecha de nacimiento, región, comuna, dirección y rol. Los cambios de rol se realizan desde las operaciones de administración de autenticación.

## 4. Catálogo

- **GET** `/productos` (Público): Buscar productos y aplicar filtros o paginación
- **GET** `/productos/{id}` (Público): Ficha del producto
- **GET** `/productos/criticos` (ADMIN): Listar productos con stock crítico
- **POST** `/productos` (ADMIN): Crear producto
- **PUT** `/productos/{id}` (ADMIN): Actualizar producto
- **DELETE** `/productos/{id}` (ADMIN): Desactivar producto
- **GET** `/categorias` (Público): Listar categorías
- **POST** `/categorias` (ADMIN): Crear categoría
- **PUT** `/categorias/{id}` (ADMIN): Renombrar categoría

La consulta de productos acepta los parámetros `q`, `categoriaId`, `ofertas`, `page` y `size`. También entrega datos del precio, precio final y stock. Al eliminar un producto, el sistema lo desactiva para que no aparezca disponible.

## 5. Pedidos

- **POST** `/boletas` (Autenticado): Confirmar pedido y descontar stock
- **GET** `/boletas/mias` (Autenticado): Historial propio
- **GET** `/boletas` (ADMIN, VENDEDOR): Todas las boletas
- **GET** `/boletas/{id}` (Dueño, ADMIN, VENDEDOR): Detalle de boleta

Ejemplo de datos enviados al confirmar una compra:

```json
{
  "items": [{ "productoId": 1, "cantidad": 2 }],
  "envio": {
    "nombre": "Cliente",
    "correo": "usuario@gmail.com",
    "region": "Región de Valparaíso",
    "comuna": "Viña del Mar",
    "direccion": "Dirección de entrega",
    "indicaciones": ""
  }
}
```

La respuesta entrega la identificación de la boleta, fecha, estado, total y productos de la compra. El backend calcula el total y valida el stock; no se aceptan cantidades negativas ni productos repetidos dentro de un mismo pedido.

## 6. Errores

Cuando ocurre un error, la API puede responder con `status`, `detail` y detalles de validación. Entre los códigos usados están: `400` (datos inválidos), `401` (sesión no válida), `403` (sin permisos), `404` (no encontrado), `409` (dato duplicado), `422` (regla de negocio o stock) y `503` (servicio no disponible).

## 7. Endpoints internos

Las rutas `/internal/usuarios/**` y `/internal/productos/**` se usan para la comunicación entre microservicios y no deben quedar disponibles públicamente. Para el despliegue en la nube aún se deben revisar los accesos internos y la configuración de red.
