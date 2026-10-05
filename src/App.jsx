import { useEffect, useState } from 'react';
import { inicializarStorage } from './lib/storage.js';
import Inicio from './pages/Inicio.jsx';
import Productos from './pages/Productos.jsx';
import Carrito from './pages/Carrito.jsx';
import Checkout from './pages/Checkout.jsx';
import Sucursal from './pages/Sucursal.jsx';
import LoginUsuario from './pages/LoginUsuario.jsx';
import LoginCliente from './pages/LoginCliente.jsx';
import LoginAdmin from './pages/LoginAdmin.jsx';
import Registro from './pages/Registro.jsx';
import Admin from './pages/Admin.jsx';

function rutaActual(){return (window.location.hash.replace(/^#/, '')||'/').replace(/\/$/,'')||'/';}
export default function App(){const [ruta,setRuta]=useState(rutaActual());useEffect(()=>{inicializarStorage();const fn=()=>setRuta(rutaActual());window.addEventListener('hashchange',fn);return()=>window.removeEventListener('hashchange',fn)},[]);switch(ruta){case '/catalogo':return <Productos/>;case '/carrito':return <Carrito/>;case '/checkout':return <Checkout/>;case '/sucursal':return <Sucursal/>;case '/login':return <LoginUsuario/>;case '/login/cliente':return <LoginCliente/>;case '/login/admin':return <LoginAdmin/>;case '/registro':return <Registro/>;case '/admin':return <Admin/>;default:return <Inicio/>}}
