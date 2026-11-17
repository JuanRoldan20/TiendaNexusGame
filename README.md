# Nexus Gaming Store

Nexus Gaming Store es una tienda web de videojuegos, consolas y accesorios. El proyecto corresponde a la asignatura Desarrollo Fullstack II (DSY1104) y está dividido en frontend, backend y base de datos.

## Tecnologías utilizadas

- Frontend: React, Vite y Bootstrap.
- Backend: Java 21, Spring Boot y Spring Cloud Gateway.
- Base de datos: MySQL y Spring Data JPA.
- Seguridad: Spring Security, JWT y permisos según el tipo de usuario.
- Pruebas: Jasmine y Karma en el frontend, JUnit en el backend y pruebas de lógica con Node.js.

## Cómo está organizado

El frontend contiene las páginas de la tienda, el carrito, el registro, el inicio de sesión y las vistas administrativas. Las solicitudes pasan por el API Gateway, que comunica el frontend con los cuatro microservicios.

| Componente | Puerto local | Función |
|---|---:|---|
| Frontend | 5173 | Interfaz de la tienda |
| API Gateway | 9080 | Entrada a las API y permisos |
| Auth Service | 9081 | Registro, login y tokens |
| Users Service | 9082 | Datos de usuarios |
| Catalog Service | 9083 | Productos, categorías y stock |
| Order Service | 9084 | Compras y boletas |
| MySQL | 3306 | Almacenamiento de datos |

En MySQL se utilizan cuatro bases de datos: `nexus_auth`, `nexus_users`, `nexus_catalog` y `nexus_orders`.

## Carpetas principales

- `frontend`: aplicación React y sus pruebas.
- `backend`: los cinco proyectos Spring Boot.
- `mysql`: script de creación de las bases de datos.
- `postman`: colección para revisar los endpoints.
- `docs`: documentos del proyecto en formato Markdown.
- `documentos_entrega`: copias en PDF de los documentos.

## Configuración y ejecución local

Se necesita Java 21, Maven, Node.js y MySQL. Los microservicios tienen sus ajustes en `application.properties` y toman la conexión y las claves desde variables de entorno. No se incluyen contraseñas reales en esta entrega.

Primero se crean las cuatro bases de datos con `mysql/crear_bases_datos.sql`. También se debe configurar un usuario MySQL con acceso a esos esquemas. Las tablas se gestionan mediante JPA al iniciar los servicios.

Para compilar el backend, entrar a la carpeta `backend` y ejecutar:

```powershell
mvn clean package -DskipTests
```

Para instalar dependencias y ejecutar React, entrar a `frontend`:

```powershell
npm ci
npm run dev
```

El frontend se abre localmente en `http://localhost:5173`. El API Gateway utiliza `http://localhost:9080`. Los microservicios deben estar iniciados para utilizar las funciones que consultan datos.

## Estado del proyecto

Se logró compilar el backend y el frontend en Windows 11. Esto comprueba que los proyectos se pueden empaquetar, pero no reemplaza las pruebas de funcionamiento conjunto. La conexión de todos los servicios, los permisos y el flujo de compra todavía deben revisarse de principio a fin.

La compra es una simulación: se registra una boleta y se actualiza el stock, pero no hay pago bancario ni despacho real. El despliegue en la nube todavía no está realizado.
