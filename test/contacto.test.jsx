import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import Contacto from '../src/pages/Contacto.jsx';

describe('Contacto', () => {
  it('valida un mensaje correctamente', async () => {
    const u = userEvent.setup();
    
    render(
      <MemoryRouter>
        <Contacto />
      </MemoryRouter>
    );

    await u.type(screen.getByLabelText(/Email/i), 'cliente@test.cl');
    await u.type(screen.getByLabelText(/Asunto/i), 'Consulta');
    await u.type(screen.getByLabelText(/Mensaje/i), 'Necesito ayuda con mi compra');
    
    await u.click(screen.getByRole('button', { name: /Validar mensaje/i }));
    
    expect(screen.getByText('Mensaje validado correctamente.')).toBeInTheDocument();
  });
});