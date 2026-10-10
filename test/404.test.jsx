import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import NoEncontrada from '../src/pages/NoEncontrada.jsx';

describe('404', () =>
  it('muestra página no encontrada', () => {
    render(
      <MemoryRouter>
        <NoEncontrada />
      </MemoryRouter>
    );
    expect(screen.getByText('404 - Página no encontrada')).toBeInTheDocument();
  }));
