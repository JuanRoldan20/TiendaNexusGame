import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CampoFormulario from '../src/components/CampoFormulario.jsx';
import { AuthProvider } from '../src/context/AuthContext.jsx';
import Login from '../src/pages/Login.jsx';

function renderLogin() {
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('CampoFormulario', () => {
  it('muestra el mensaje de error solo cuando hay error (renderizado condicional)', () => {
    const { rerender } = render(<CampoFormulario id="x" label="Campo X" value="" onChange={() => {}} />);
    expect(screen.queryByRole('alert')).toBeNull();

    rerender(<CampoFormulario id="x" label="Campo X" value="" onChange={() => {}} error="Campo requerido" />);
    expect(screen.getByRole('alert').textContent).toBe('Campo requerido');
    expect(screen.getByLabelText('Campo X').className).toContain('is-invalid');
  });
});

describe('Login', () => {
  beforeEach(() => localStorage.clear());

  it('actualiza el estado del formulario cuando el usuario escribe (state)', () => {
    renderLogin();
    const correo = screen.getByLabelText('Correo');
    fireEvent.change(correo, { target: { value: 'cliente@gmail.com' } });
    expect(correo.value).toBe('cliente@gmail.com');
  });

  it('muestra errores al enviar con datos inválidos y no llama al backend', () => {
    spyOn(window, 'fetch');
    renderLogin();
    fireEvent.change(screen.getByLabelText('Correo'), { target: { value: 'alguien@hotmail.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: '12' } });
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    const errores = screen.getAllByRole('alert').map((e) => e.textContent);
    expect(errores).toContain('Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com');
    expect(errores).toContain('La contraseña debe tener entre 4 y 10 caracteres');
    expect(window.fetch).not.toHaveBeenCalled();
  });

  // TODO alumno: agregar una prueba que simule un login correcto (spyOn(window, 'fetch')
  // devolviendo una respuesta exitosa) y verifique que se guarda la sesión en localStorage.
});
