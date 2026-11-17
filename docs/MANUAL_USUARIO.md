# Manual de usuario - Nexus Gaming Store

## 1. Ingreso a la tienda

Nexus Gaming Store se utiliza desde el navegador. En desarrollo, la página se abre en `http://localhost:5173`, siempre que React y los servicios del backend estén funcionando. Cuando la aplicación esté publicada, se ingresará mediante su dirección web.

La tienda tiene opciones diferentes según el usuario sea visitante, cliente, vendedor o administrador.

## 2. Consultar productos

En el menú principal se puede entrar a **Inicio**, **Productos**, **Categorías** y **Ofertas**. En el catálogo se puede buscar un producto y abrir su detalle para ver el precio, la descripción y el stock disponible.

También hay páginas de información de la tienda, blog y contacto.

## 3. Crear una cuenta e iniciar sesión

Para registrarse, seleccionar **Registro** y completar los datos solicitados: RUN, nombre, apellidos, correo, contraseña, región, comuna y dirección. El formulario muestra mensajes cuando falta algún dato o existe un error de validación.

Después del registro, ingresar con correo y contraseña desde la opción **Iniciar sesión**. El sistema muestra las funciones disponibles de acuerdo con el rol de la cuenta.

## 4. Carrito de compras

Al entrar a un producto se puede elegir **Agregar al carrito**, siempre que tenga stock. Desde el carrito se pueden revisar los artículos, modificar cantidades o quitar productos.

Para seguir con la compra, seleccionar **Ir a pagar**. Si no hay una sesión iniciada, primero se debe ingresar a la cuenta.

## 5. Confirmar una compra

En la pantalla de compra se revisan los artículos seleccionados y se completan los datos de entrega: nombre, correo, región, comuna, dirección e indicaciones adicionales si corresponde.

Al seleccionar **Confirmar pedido**, el sistema consulta nuevamente los precios y el stock. Si la operación se registra correctamente, aparece una confirmación con la boleta y el total. Si ocurre un error, se muestra un mensaje para revisar el pedido.

Esta función es una simulación. No se realizan cobros reales ni entregas físicas.

## 6. Consultar la cuenta

El cliente puede revisar su perfil y el historial de compras desde las opciones de su cuenta. También puede actualizar sus datos personales. El RUN y el correo no se modifican desde ese formulario.

## 7. Opciones del vendedor

Al iniciar sesión con una cuenta de vendedor se puede acceder al panel y revisar productos y órdenes. Este usuario no tiene permisos para agregar, editar ni eliminar información del catálogo.

## 8. Opciones del administrador

El administrador dispone de un panel con las funciones de gestión. Desde allí puede revisar el resumen de la tienda, mantener productos y categorías, consultar productos con stock bajo, administrar usuarios, revisar órdenes y ver reportes de ventas.

## 9. Problemas frecuentes

Si una página no carga o muestra un error de conexión, se debe revisar que el frontend y los microservicios estén funcionando. Si falla una compra, conviene revisar el stock y los datos ingresados. Si la sesión termina, se debe volver a iniciar sesión.

## 10. Capturas del sistema

Las capturas de las pantallas principales se incorporarán cuando termine la revisión funcional de la aplicación y esté disponible su versión para la presentación. Este documento describe el uso de las pantallas implementadas, pero aún no incluye esas evidencias.
