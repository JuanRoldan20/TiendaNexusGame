# Especificación de Requisitos de Software (ERS)

## 1. Descripción del proyecto

**Nombre:** Nexus Gaming Store  
**Asignatura:** Desarrollo Fullstack II (DSY1104)

El proyecto consiste en una tienda online enfocada en videojuegos, consolas y accesorios. Los clientes pueden consultar productos, registrarse, armar un carrito y realizar una compra de demostración. También incluye un panel para administrar la información de la tienda.

El sistema está desarrollado con React en el frontend, Spring Boot en el backend y MySQL para almacenar los datos.

## 2. Usuarios del sistema

- **Visitante:** puede revisar el catálogo, las ofertas y las páginas informativas. También puede registrarse o iniciar sesión.
- **Cliente:** puede utilizar el carrito, confirmar compras, consultar sus boletas y modificar datos de su perfil.
- **Vendedor:** puede revisar el listado y detalle de productos y órdenes, pero no modificarlos.
- **Administrador:** puede gestionar productos, categorías y usuarios, además de consultar pedidos, stock y reportes.

## 3. Requisitos funcionales

- **RF01 - Catálogo:** Mostrar productos con precio, descripción, categoría y disponibilidad; permitir búsquedas y filtros.
- **RF02 - Registro:** Crear una cuenta con validación de RUN, correo, contraseña y datos personales.
- **RF03 - Inicio de sesión:** Permitir ingreso según rol y utilizar JWT para las sesiones.
- **RF04 - Carrito:** Agregar y quitar productos, cambiar cantidades y mantener el carrito en el navegador.
- **RF05 - Compras:** Validar los productos y el stock desde el backend, registrar una boleta y actualizar el inventario.
- **RF06 - Historial:** Mostrar al cliente sus propias compras; permitir que vendedor y administrador consulten las órdenes.
- **RF07 - Productos:** Permitir que el administrador agregue, edite y desactive productos y mantenga las categorías.
- **RF08 - Usuarios:** Permitir que el administrador consulte y edite cuentas y cambie sus roles.
- **RF09 - Reportes:** Mostrar información de ventas, pedidos y productos vendidos.
- **RF10 - Contenido:** Incluir páginas informativas, ofertas, blog y contacto.
- **RF11 - API REST:** Comunicar las pantallas con el backend mediante rutas versionadas.

## 4. Reglas de negocio

Para crear una cuenta se debe ingresar un RUN chileno válido y un correo de los dominios permitidos por el proyecto: `duoc.cl`, `profesor.duoc.cl` o `gmail.com`. La contraseña debe tener entre 4 y 10 caracteres, según la validación implementada.

No se debe permitir la compra de un producto inactivo o sin stock suficiente. El precio y la cantidad disponible se revisan en el servidor y no se toman directamente desde el carrito.

Los clientes solo pueden consultar sus propias boletas. El vendedor tiene acceso de consulta a productos y órdenes, mientras que el administrador puede realizar los cambios correspondientes en el sistema.

## 5. Requisitos no funcionales

- **Usabilidad:** navegación clara, formularios con mensajes de error y diseño adaptable a distintos tamaños de pantalla.
- **Seguridad:** contraseñas protegidas, autenticación con JWT y validación de permisos según el rol.
- **Persistencia:** almacenamiento de usuarios, productos y pedidos en MySQL.
- **Mantenimiento:** división del backend en servicios con responsabilidades específicas.
- **Pruebas:** uso de Jasmine y Karma para el frontend y JUnit para el backend.
- **Control de versiones:** manejo del código en repositorios GitHub para registrar los cambios del proyecto.

## 6. Bases de datos

| Base de datos | Tablas principales | Información |
|---|---|---|
| `nexus_auth` | `credencial`, `refresh_token` | Accesos, roles y sesiones. |
| `nexus_users` | `usuario` | Información personal de los usuarios. |
| `nexus_catalog` | `categoria`, `producto` | Catálogo, precios y stock. |
| `nexus_orders` | `boleta`, `detalle_boleta` | Compras y detalle de productos vendidos. |

Cada microservicio trabaja con su propia base de datos. La relación entre usuarios, productos y boletas se hace mediante identificadores.

## 7. Criterios para comprobar el funcionamiento

1. Se pueden consultar productos sin iniciar sesión.
2. El sistema rechaza un registro con RUN incorrecto.
3. Cada tipo de usuario ve las opciones que le corresponden.
4. Una compra con stock disponible registra una boleta y descuenta las unidades vendidas.
5. Si no hay stock suficiente, se informa el problema y no se completa la compra.
6. Un cliente no puede acceder a las boletas de otro cliente.
7. Los datos almacenados en MySQL se mantienen entre sesiones.
8. Se ejecutan las pruebas y se registra su cobertura real.

## 8. Alcance y limitaciones

La aplicación permite registrar compras de prueba, pero no integra pagos con tarjetas ni servicios de despacho. Antes de dejarla disponible públicamente es necesario completar las pruebas de integración y revisar la seguridad de las conexiones entre microservicios.
