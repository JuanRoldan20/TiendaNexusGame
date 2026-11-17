import { calcularDv, validarCorreo, validarPassword, validarRun } from '../src/utils/validaciones.js';

describe('validaciones (reglas del Anexo 1)', () => {
  describe('validarCorreo', () => {
    it('acepta los dominios permitidos', () => {
      expect(validarCorreo('alumno@duoc.cl')).toBe('');
      expect(validarCorreo('profe@profesor.duoc.cl')).toBe('');
      expect(validarCorreo('gamer@gmail.com')).toBe('');
    });

    it('rechaza otros dominios con un mensaje claro', () => {
      expect(validarCorreo('alguien@hotmail.com')).toContain('Solo se permiten');
    });

    it('es requerido salvo que se indique lo contrario', () => {
      expect(validarCorreo('')).toBe('El correo es requerido');
      expect(validarCorreo('', { requerido: false })).toBe('');
    });

    it('no permite más de 100 caracteres', () => {
      expect(validarCorreo(`${'a'.repeat(95)}@gmail.com`)).toBe('Máximo 100 caracteres');
    });
  });

  describe('validarPassword', () => {
    it('exige entre 4 y 10 caracteres', () => {
      expect(validarPassword('abc')).toContain('entre 4 y 10');
      expect(validarPassword('abcd')).toBe('');
      expect(validarPassword('abcdefghij')).toBe('');
      expect(validarPassword('abcdefghijk')).toContain('entre 4 y 10');
    });
  });

  describe('validarRun', () => {
    it('calcula el dígito verificador con módulo 11', () => {
      expect(calcularDv('12345678')).toBe('5');
      expect(calcularDv('19011029')).toBe('K');
    });

    it('acepta RUN válidos sin puntos ni guion', () => {
      expect(validarRun('123456785')).toBe('');
      expect(validarRun('19011029k')).toBe('');
    });

    it('rechaza puntos/guion, largo incorrecto y dígito verificador erróneo', () => {
      expect(validarRun('12.345.678-5')).toContain('sin puntos ni guion');
      expect(validarRun('12345')).toContain('entre 7 y 9');
      expect(validarRun('123456789')).toBe('El dígito verificador no es correcto');
    });
  });
});
