# Pruebas del proyecto y cobertura

## 1. Herramientas

En el frontend se prepararon pruebas con Jasmine y Karma, además de pruebas de lógica que pueden ejecutarse con Node.js. Para el backend hay pruebas unitarias con JUnit y Mockito.

## 2. Comprobaciones realizadas

| Comprobación | Resultado | Observación |
|---|---|---|
| Compilación del backend con Maven | Correcto | Compilaron los cinco módulos Spring Boot. |
| Instalación de dependencias de React | Correcto | Se ejecutó `npm ci`. |
| Compilación del frontend con Vite | Correcto | Se generó la versión de producción. |
| Revisión de dependencias de producción | Sin alertas reportadas | `npm audit --omit=dev` mostró 0 vulnerabilidades después de actualizar React Router. |
| Pruebas de lógica con Node.js | 6 aprobadas | Se revisó la lógica del carrito, checkout y validaciones. |

Estas comprobaciones corresponden al trabajo local realizado el 14 de noviembre de 2026. La compilación de Maven se ejecutó con `-DskipTests`, por lo que en ese paso no se ejecutaron las pruebas JUnit.

## 3. Pruebas que faltan comprobar

| Prueba | Estado actual |
|---|---|
| Ejecución completa de Jasmine/Karma | Pendiente de registrar el resultado. |
| Cobertura de las pruebas del frontend | Pendiente de medir. |
| Ejecución completa de JUnit | Pendiente de registrar el resultado. |
| Registro y login conectados a MySQL | Pendiente de prueba de integración. |
| Renovación de sesión JWT | Pendiente de prueba de integración. |
| Compra y descuento de stock | Pendiente de prueba de integración. |
| Permisos de administrador, vendedor y cliente | Pendiente de prueba de integración. |
| Historial y reportes | Pendiente de prueba de integración. |

## 4. Cobertura de testing

Todavía no hay un porcentaje de cobertura confirmado para el frontend. Para obtenerlo es necesario ejecutar las pruebas de Karma con su reporte de cobertura y revisar los porcentajes de líneas, funciones, sentencias y condiciones.

Por este motivo, en este documento no se presenta un porcentaje estimado como si fuera un resultado medido. La cobertura y las pruebas integradas deben completarse antes de la entrega final.
