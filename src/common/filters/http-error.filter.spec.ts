import { vi } from 'vitest';
import {
  BadRequestException,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { HttpErrorFilter } from './http-error.filter.js';

describe('HttpErrorFilter', () => {
  let filter: HttpErrorFilter;
  const json = vi.fn();
  const status = vi.fn().mockReturnValue({ json });

  const response = {
    status,
    getHeader: vi.fn().mockReturnValue('id-de-prueba'),
  };
  const request = { method: 'GET', originalUrl: '/courses/999?token=secreto' };

  const host = {
    switchToHttp: () => ({
      getResponse: () => response,
      getRequest: () => request,
    }),
  } as any;

  beforeAll(() => {
    filter = new HttpErrorFilter();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    status.mockReturnValue({ json });
    response.getHeader.mockReturnValue('id-de-prueba');

    // El filter registra los errores 500 en el log interno; se silencia en las
    // pruebas para que la salida de los tests no parezca un fallo.
    vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
  });

  it('debe conservar el estado y el mensaje de un error HTTP controlado', () => {
    filter.catch(new NotFoundException('Course 999 not found'), host);

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
        error: 'Not Found',
        message: 'Course 999 not found',
        path: '/courses/999',
        requestId: 'id-de-prueba',
      }),
    );
  });

  it('debe conservar la lista de mensajes de validación', () => {
    filter.catch(
      new BadRequestException(['email must be an email', 'age must be a number']),
      host,
    );

    const cuerpo = json.mock.calls[0][0];
    expect(cuerpo.statusCode).toBe(400);
    expect(cuerpo.message).toEqual([
      'email must be an email',
      'age must be a number',
    ]);
  });

  it('debe ocultar los detalles de un error inesperado', () => {
    filter.catch(new Error('SELECT * FROM users falló en la fila 3'), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    const cuerpo = json.mock.calls[0][0];
    expect(cuerpo.message).toBe('Internal server error');
    expect(JSON.stringify(cuerpo)).not.toContain('SELECT');
    expect(JSON.stringify(cuerpo)).not.toContain('stack');
  });

  it('no debe incluir la cadena de consulta en la ruta de la respuesta', () => {
    filter.catch(new NotFoundException(), host);

    const cuerpo = json.mock.calls[0][0];
    expect(cuerpo.path).toBe('/courses/999');
    expect(JSON.stringify(cuerpo)).not.toContain('secreto');
  });
});