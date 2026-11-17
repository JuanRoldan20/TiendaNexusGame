# Nexus Gaming Store

## Descripción general

**Nexus Gaming Store** es una aplicación web de comercio electrónico orientada a la venta de videojuegos, consolas y accesorios. El proyecto permite explorar el catálogo, consultar productos, gestionar una cuenta de usuario y realizar un proceso de compra simulado.

La solución está desarrollada con una arquitectura distribuida en microservicios. El frontend se comunica con el backend mediante un API Gateway, que dirige las solicitudes al servicio correspondiente.

Este proyecto fue desarrollado para la asignatura **Desarrollo Fullstack II (DSY1104)**.

## Funcionalidades principales

### Tienda

- Página de inicio y navegación por las secciones de la tienda.
- Visualización del catálogo de productos.
- Consulta de productos por categorías.
- Vista de detalle de cada producto.
- Carrito de compras.
- Registro e inicio de sesión de usuarios.
- Formulario y sección de contacto.
- Páginas informativas de la tienda.

### Administración

- Panel de administración.
- Gestión de productos.
- Gestión de categorías.
- Consulta y administración de usuarios.

### Backend

- Registro e inicio de sesión.
- Autenticación mediante tokens JWT.
- Gestión de perfiles de usuario.
- Administración del catálogo, categorías y stock.
- Registro y consulta de boletas.
- Comunicación entre servicios mediante clientes HTTP.
- Validación de datos y manejo centralizado de excepciones.

> El proceso de compra corresponde a una simulación. El sistema registra la boleta y gestiona el stock, pero no realiza pagos bancarios ni despachos reales.

## Tecnologías utilizadas

| Área | Tecnologías |
|---|---|
| Frontend | React 18, JavaScript, Vite |
| Navegación | React Router |
| Estilos e interfaz | Bootstrap 5 y CSS |
| Backend | Java 21, Spring Boot y Maven |
| Comunicación | Spring Cloud Gateway y clientes HTTP |
| Persistencia | MySQL y Spring Data JPA |
| Seguridad | Spring Security y JWT |
| Pruebas frontend | Jasmine, Karma y Testing Library |
| Pruebas backend | JUnit |
| Herramientas de apoyo | Postman |

## Arquitectura del sistema

El proyecto se organiza en tres partes principales:

1. **Frontend:** aplicación React que presenta la tienda y sus paneles.
2. **API Gateway:** punto de entrada para las solicitudes del frontend. Redirige cada ruta al microservicio correspondiente.
3. **Microservicios:** módulos independientes que gestionan autenticación, usuarios, catálogo y órdenes.

### Microservicios y puertos

| Componente | Puerto | Responsabilidad |
|---|---:|---|
| Frontend (Vite) | `5173` | Interfaz de usuario |
| API Gateway | `9080` | Entrada y enrutamiento de solicitudes |
| Auth Service | `9081` | Registro, inicio de sesión y tokens |
| Users Service | `9082` | Datos y perfiles de usuarios |
| Catalog Service | `9083` | Productos, categorías y stock |
| Order Service | `9084` | Boletas y órdenes |
| MySQL | `3306` | Persistencia de información |

El frontend utiliza por defecto la dirección `http://localhost:9080/api/v1` para comunicarse con el API Gateway.

### Bases de datos

Se utilizan cuatro bases de datos MySQL independientes:

| Base de datos | Servicio |
|---|---|
| `nexus_auth` | Autenticación |
| `nexus_users` | Usuarios |
| `nexus_catalog` | Catálogo |
| `nexus_orders` | Órdenes y boletas |

El script `mysql/crear_bases_datos.sql` crea estos esquemas. Las tablas se administran mediante JPA al iniciar los servicios.

## Estructura del proyecto

La siguiente estructura muestra las carpetas y archivos principales. Se omiten archivos internos y clases individuales para facilitar la lectura.

```text
nexus-game/
|
+-- backend/
|   +-- pom.xml
|   |
|   +-- api-gateway/
|   |   +-- pom.xml
|   |   +-- src/main/java/com/nexusgame/gateway/
|   |   |   +-- config/
|   |   |   +-- filter/
|   |   |   +-- ApiGatewayApplication.java
|   |   +-- src/main/resources/
|   |       +-- application.properties
|   |
|   +-- auth-service/
|   |   +-- pom.xml
|   |   +-- src/main/java/com/nexusgame/auth/
|   |   |   +-- client/
|   |   |   +-- config/
|   |   |   +-- controller/
|   |   |   +-- domain/
|   |   |   +-- dto/
|   |   |   +-- exception/
|   |   |   +-- repository/
|   |   |   +-- service/
|   |   |   +-- validation/
|   |   +-- src/main/resources/
|   |   +-- src/test/
|   |
|   +-- users-service/
|   |   +-- pom.xml
|   |   +-- src/main/java/com/nexusgame/users/
|   |   |   +-- controller/
|   |   |   +-- domain/
|   |   |   +-- dto/
|   |   |   +-- exception/
|   |   |   +-- repository/
|   |   |   +-- service/
|   |   |   +-- validation/
|   |   +-- src/main/resources/
|   |   +-- src/test/
|   |
|   +-- catalog-service/
|   |   +-- pom.xml
|   |   +-- src/main/java/com/nexusgame/catalog/
|   |   |   +-- controller/
|   |   |   +-- domain/
|   |   |   +-- dto/
|   |   |   +-- exception/
|   |   |   +-- repository/
|   |   |   +-- service/
|   |   +-- src/main/resources/
|   |   +-- src/test/
|   |
|   +-- order-service/
|       +-- pom.xml
|       +-- src/main/java/com/nexusgame/orders/
|       |   +-- client/
|       |   +-- config/
|       |   +-- controller/
|       |   +-- domain/
|       |   +-- dto/
|       |   +-- exception/
|       |   +-- repository/
|       |   +-- service/
|       +-- src/main/resources/
|       +-- src/test/
|
+-- frontend/
|   +-- public/
|   +-- src/
|   |   +-- components/
|   |   |   +-- layout/
|   |   +-- context/
|   |   +-- data/
|   |   +-- pages/
|   |   |   +-- admin/
|   |   +-- services/
|   |   +-- styles/
|   |   +-- utils/
|   |   +-- App.jsx
|   |   +-- config.js
|   |   +-- main.jsx
|   +-- tests/
|   +-- index.html
|   +-- package.json
|   +-- vite.config.js
|
+-- mysql/
|   +-- crear_bases_datos.sql
|
+-- postman/
|   +-- NexusGame.postman_collection.json
|
+-- docs/
|   +-- API.md
|   +-- ERS.md
|   +-- INTEGRACION.md
|   +-- MANUAL_USUARIO.md
|   +-- TESTING.md
|
+-- documentos_entrega/
|   +-- API.pdf
|   +-- ERS.pdf
|   +-- INTEGRACION.pdf
|   +-- MANUAL_USUARIO.pdf
|   +-- TESTING.pdf
|
+-- .gitignore
+-- README.md
```

## Explicación de las carpetas

### `frontend/`

Contiene la aplicación desarrollada en React.

- `components/`: componentes reutilizables, tarjetas de productos, formularios, estados y elementos de navegación.
- `components/layout/`: estructura general de la tienda, como barra de navegación, pie de página y diseño del administrador.
- `context/`: contextos para mantener el estado de autenticación y del carrito.
- `data/`: datos auxiliares utilizados por la interfaz.
- `pages/`: páginas principales de la tienda, como inicio, productos, categorías, carrito, registro y acceso.
- `pages/admin/`: vistas del panel de administración.
- `services/`: funciones que realizan solicitudes al backend.
- `styles/`: hojas de estilo.
- `utils/`: funciones auxiliares para carrito, compra, formato y validaciones.
- `tests/`: pruebas automatizadas del frontend.

### `backend/`

Contiene los proyectos Java y Spring Boot. Cada microservicio tiene su propio `pom.xml`, configuración y estructura de código.

- `api-gateway/`: recibe las solicitudes del frontend y las dirige a los servicios internos.
- `auth-service/`: controla el registro, el inicio de sesión, los roles y la generación o renovación de tokens.
- `users-service/`: administra la información y los perfiles de usuario.
- `catalog-service/`: administra productos, categorías y stock.
- `order-service/`: registra las boletas y coordina las operaciones relacionadas con las compras.

En los microservicios, los paquetes siguen una separación por responsabilidad:

- `controller/`: recibe las solicitudes HTTP y expone los endpoints.
- `domain/`: contiene las entidades del dominio.
- `dto/`: define los objetos utilizados para recibir o entregar información.
- `repository/`: realiza el acceso a los datos.
- `service/`: contiene la lógica de negocio.
- `exception/`: maneja los errores de la aplicación.
- `config/`: agrupa configuraciones del servicio.
- `client/`: permite la comunicación con otros microservicios.
- `validation/`: contiene reglas y validaciones, cuando corresponde.

### `mysql/`

Incluye el script SQL para crear las cuatro bases de datos utilizadas por el backend.

### `postman/`

Contiene una colección de Postman con solicitudes para probar los endpoints de la API.

### `docs/` y `documentos_entrega/`

Incluyen documentación funcional y técnica del proyecto en Markdown y PDF: API, especificación de requerimientos, integración, manual de usuario y pruebas.

## Requisitos para ejecutar el proyecto

Antes de iniciar, instala y configura:

- Java JDK 21.
- Apache Maven.
- Node.js y npm.
- MySQL Server.
- Un editor de código, por ejemplo Visual Studio Code o IntelliJ IDEA.

Comprueba las instalaciones desde una terminal:

```bash
java -version
mvn -version
node -v
npm -v
```

## Configuración de la base de datos

1. Inicia el servidor MySQL.
2. Ejecuta el script `mysql/crear_bases_datos.sql`.
3. Crea o configura un usuario MySQL con permisos sobre las cuatro bases de datos.
4. Configura las variables de entorno que utilizarán los microservicios.

El backend utiliza estas variables de configuración:

| Variable | Uso |
|---|---|
| `DB_URL` | Dirección JDBC de la base de datos del servicio |
| `DB_USER` | Usuario de MySQL |
| `DB_PASSWORD` | Contraseña de MySQL |
| `JWT_SECRET` | Clave secreta utilizada para firmar los JWT |
| `JWT_EXPIRATION` | Duración del token de acceso |
| `AUTH_SERVICE_URL` | Dirección del servicio de autenticación |
| `USERS_SERVICE_URL` | Dirección del servicio de usuarios |
| `CATALOG_SERVICE_URL` | Dirección del servicio de catálogo |
| `ORDER_SERVICE_URL` | Dirección del servicio de órdenes |
| `CORS_ALLOWED_ORIGINS` | Orígenes permitidos para las solicitudes del frontend |

Los valores predeterminados de conexión y puertos están definidos en los archivos `application.properties` de cada servicio. `DB_PASSWORD` y `JWT_SECRET` deben configurarse antes de iniciar los servicios que los requieren. No publiques claves ni contraseñas reales en GitHub.

Para el frontend se puede definir `VITE_API_URL` en un archivo `.env` dentro de `frontend/`. Si no se define, se utiliza `http://localhost:9080/api/v1`.

Ejemplo de archivo `frontend/.env`:

```env
VITE_API_URL=http://localhost:9080/api/v1
```

## Ejecución del proyecto

Se recomienda iniciar primero MySQL, después los microservicios y finalmente el frontend.

### 1. Compilar el backend

Abre una terminal en la carpeta raíz del repositorio y ejecuta:

```bash
cd backend
mvn clean package -DskipTests
```

Para ejecutar las pruebas durante la compilación:

```bash
mvn clean verify
```

### 2. Iniciar los microservicios

Cada servicio debe ejecutarse en una terminal independiente. Desde la carpeta `backend`, utiliza los siguientes comandos:

Terminal 1:

```bash
mvn -pl auth-service spring-boot:run
```

Terminal 2:

```bash
mvn -pl users-service spring-boot:run
```

Terminal 3:

```bash
mvn -pl catalog-service spring-boot:run
```

Terminal 4:

```bash
mvn -pl order-service spring-boot:run
```

Terminal 5:

```bash
mvn -pl api-gateway spring-boot:run
```

Verifica que las variables de entorno estén configuradas en las terminales desde las que se inician los servicios.

### 3. Iniciar el frontend

Abre otra terminal y ejecuta:

```bash
cd frontend
npm ci
npm run dev
```

Vite mostrará la dirección local de la aplicación. Por defecto es:

```text
http://localhost:5173
```

El API Gateway queda disponible en:

```text
http://localhost:9080
```

## Pruebas

### Frontend

Desde la carpeta `frontend/`:

```bash
npm test
```

Para ejecutar las pruebas de lógica con Node.js:

```bash
npm run test:logic
```

También se puede generar la versión de producción:

```bash
npm run build
```

### Backend

Desde la carpeta `backend/`:

```bash
mvn test
```

Las pruebas de los microservicios se encuentran en sus respectivas carpetas `src/test/`.

### Postman

Importa `postman/NexusGame.postman_collection.json` en Postman para disponer de las solicitudes incluidas en el proyecto. El API Gateway debe estar iniciado y los servicios requeridos deben encontrarse disponibles.

## Documentación adicional

La carpeta `docs/` contiene la documentación del sistema:

- `API.md`: descripción de la API.
- `ERS.md`: especificación de requerimientos.
- `INTEGRACION.md`: información de integración entre componentes.
- `MANUAL_USUARIO.md`: instrucciones para utilizar la aplicación.
- `TESTING.md`: documentación de pruebas.

También se incluyen versiones PDF de estos documentos en `documentos_entrega/`.

## Consideraciones del proyecto

- Los servicios backend se ejecutan de manera independiente.
- El API Gateway centraliza el acceso del frontend a los microservicios.
- Cada microservicio utiliza su propia base de datos MySQL.
- Las tablas se actualizan mediante la configuración JPA de los servicios.
- La compra es una simulación y no integra una pasarela de pago real.
- Para ejecutar el sistema completo se necesita que MySQL y los servicios backend estén disponibles.

## Autoría

Proyecto académico desarrollado para **Desarrollo Fullstack II (DSY1104)**.

**Nexus Gaming Store**  
Aplicación web de comercio electrónico de videojuegos, consolas y accesorios.
