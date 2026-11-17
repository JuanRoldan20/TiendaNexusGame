# Integración de frontend, backend y base de datos

## 1. Estructura del sistema

Nexus Gaming Store está dividido en una aplicación React y cinco servicios desarrollados con Spring Boot. React se encarga de las pantallas que utiliza el usuario. El API Gateway recibe las solicitudes y las dirige al servicio que corresponde.

| Componente | Puerto local | Función |
|---|---:|---|
| React | 5173 | Interfaz del usuario |
| API Gateway | 9080 | Rutas y validación de acceso |
| Auth Service | 9081 | Registro e inicio de sesión |
| Users Service | 9082 | Información de usuarios |
| Catalog Service | 9083 | Productos y categorías |
| Order Service | 9084 | Boletas y pedidos |

Los datos se guardan en MySQL mediante JPA. Cada microservicio utiliza su propia base de datos.

## 2. Registro e inicio de sesión

Cuando un usuario completa el registro, React envía los datos al backend. Auth Service guarda las credenciales y se comunica con Users Service para registrar el perfil. Las contraseñas se almacenan protegidas.

En el inicio de sesión se entrega un token JWT que identifica al usuario y su rol. Las solicitudes que requieren autorización pasan por el Gateway, donde se comprueba el token. El sistema también contempla la renovación de la sesión mediante un refresh token.

## 3. Consulta de productos

Las páginas de inicio, categorías y catálogo solicitan los productos a través del Gateway. Catalog Service consulta MySQL y devuelve la información para mostrar los resultados, los precios, las ofertas y la disponibilidad.

Las acciones para agregar, editar o desactivar productos quedan reservadas para el administrador.

## 4. Proceso de compra

El carrito guarda los productos seleccionados en el navegador. Cuando se confirma el pedido, React envía al backend los identificadores y cantidades de cada producto, además de los datos de entrega.

Order Service consulta a Catalog Service para comprobar el precio y el stock. Si se puede realizar la operación, descuenta las unidades y guarda la boleta con su detalle en MySQL. Después el frontend muestra la confirmación.

En el código existe un manejo de errores para intentar devolver stock si falla una parte del proceso. Como participan servicios distintos, todavía es necesario comprobar este comportamiento con pruebas de integración, especialmente cuando hay errores de conexión.

## 5. Bases de datos y relaciones

- `nexus_auth`: credenciales, roles y renovación de tokens.
- `nexus_users`: datos personales.
- `nexus_catalog`: categorías y productos.
- `nexus_orders`: boletas y sus detalles.

Los servicios se relacionan mediante identificadores de usuarios y productos. No hay una relación directa con claves foráneas entre las cuatro bases de datos.

## 6. Permisos

El catálogo se puede consultar sin iniciar sesión. Para comprar se requiere una cuenta. El cliente accede a sus compras, el vendedor puede revisar productos y órdenes, y el administrador tiene las herramientas de gestión.

Los permisos se comprueban en el backend. Ocultar botones en React ayuda a la navegación, pero no reemplaza esa validación.

## 7. Pruebas de integración pendientes

Antes de presentar la aplicación se debe comprobar el registro, inicio de sesión, consulta de productos, compra, descuento de stock, historial y permisos por rol. También es necesario comprobar qué ocurre cuando un servicio deja de responder.

Por el momento se verificó la compilación del backend y frontend, pero todavía no se cuenta con un resultado completo de estas pruebas. El despliegue en la nube está pendiente.
