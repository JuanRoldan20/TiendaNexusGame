import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { AuthProvider } from '../src/context/AuthContext.jsx';
import Login from '../src/pages/Login.jsx';
function renderLogin(){return render(<MemoryRouter><AuthProvider><Login/></AuthProvider></MemoryRouter>)}
beforeEach(()=>localStorage.clear());
describe('autenticación admin',()=>{
  it('rechaza contraseña incorrecta',async()=>{const u=userEvent.setup();renderLogin();await u.type(screen.getByLabelText(/Usuario o email/i),'admin');await u.type(screen.getByLabelText(/Contraseña/i),'xxxx');await u.click(screen.getByRole('button',{name:/Ingresar/i}));expect(screen.getByText(/Credenciales incorrectas/i)).toBeInTheDocument();});
  it('permite admin / 1234',async()=>{const u=userEvent.setup();renderLogin();await u.type(screen.getByLabelText(/Usuario o email/i),'admin');await u.type(screen.getByLabelText(/Contraseña/i),'1234');await u.click(screen.getByRole('button',{name:/Ingresar/i}));expect(localStorage.getItem('nexus_usuario_activo')).toContain('admin');});
});
