import test from 'node:test';
import assert from 'node:assert/strict';
import { agregarItem, cambiarCantidad, quitarItem, calcularTotal, contarUnidades } from '../src/utils/carrito.js';
import { construirPedido, validarEnvio } from '../src/utils/checkout.js';
import { validarRun, validarCorreo, validarPassword } from '../src/utils/validaciones.js';

const producto={id:10,codigo:'JUEGO1',nombre:'Juego',precio:20000,precioFinal:15000,stock:3};
const envio={nombre:'Camila Torres',correo:'cliente@gmail.com',region:'Región de Valparaíso',comuna:'Concón',direccion:'Calle 12',indicaciones:''};
test('carrito agrega y acumula cantidades sin superar stock',()=>{
 let items=agregarItem([],producto);
 items=agregarItem(items,producto,4);
 assert.equal(items.length,1);
 assert.equal(items[0].cantidad,3);
 assert.equal(calcularTotal(items),45000);
 assert.equal(contarUnidades(items),3);
});
test('carrito cambia cantidad dentro del stock y quita producto',()=>{
 let items=agregarItem([],producto);
 items=cambiarCantidad(items,10,2);
 assert.equal(items[0].cantidad,2);
 assert.equal(quitarItem(items,10).length,0);
});
test('checkout nunca envía el precio calculado en el cliente',()=>{
 const items=agregarItem([],producto,2);
 const solicitud=construirPedido(items,envio);
 assert.deepEqual(solicitud.items,[{productoId:10,cantidad:2}]);
 assert.equal(solicitud.items[0].precio,undefined);
});
test('checkout rechaza carrito vacío y datos incompletos',()=>{
 assert.throws(()=>construirPedido([],envio),/vacío/);
 assert.match(validarEnvio({...envio, direccion:''}),/Completa/);
 assert.equal(validarEnvio(envio),'');
});
test('reglas de correo y contraseña',()=>{
 assert.equal(validarCorreo('cliente@gmail.com'),'');
 assert.notEqual(validarCorreo('foo@invalido.com'),'');
 assert.equal(validarPassword('abcde'),'');
 assert.notEqual(validarPassword('a'),'');
});
test('reglas RUN rechazan valores inválidos',()=>{
 assert.notEqual(validarRun('123'),'');
 assert.equal(validarRun('19011029K'),'');
});
