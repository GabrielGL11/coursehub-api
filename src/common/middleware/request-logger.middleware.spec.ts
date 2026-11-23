import { jest } from '@jest/globals';
import { Logger } from '@nestjs/common';
import { RequestLoggerMiddleware } from './request-logger.middleware.js';

describe('RequestLoggerMiddleware', () => {
  let middleware: RequestLoggerMiddleware;
  let logSpy: ReturnType<typeof jest.spyOn>;

  beforeEach(() => {
    middleware = new RequestLoggerMiddleware();
    logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => jest.restoreAllMocks());

  function ejecutar(headers: Record<string, string> = {}) {
    let onFinish: () => void = () => undefined;
    const req = {
      method: 'POST',
      originalUrl: '/auth/login?email=ana@example.com',
      headers,
      body: { password: 'ClaveSecreta123' },
    };
    const res = {
      statusCode: 200,
      setHeader: jest.fn(),
      on: jest.fn((evento: string, cb: () => void) => {
        if (evento === 'finish') onFinish = cb;
      }),
    };
    const next = jest.fn();

    middleware.use(req as any, res as any, next);
    onFinish();
    return { res, next };
  }

  it('debe continuar con la solicitud y asignar un identificador', () => {
    const { res, next } = ejecutar();

    expect(next).toHaveBeenCalled();
    expect(res.setHeader).toHaveBeenCalledWith(
      'X-Request-Id',
      expect.any(String),
    );
  });

  it('debe registrar método, ruta, estado y duración', () => {
    ejecutar();

    const registro = JSON.parse(logSpy.mock.calls[0][0] as string);
    expect(registro).toMatchObject({
      method: 'POST',
      path: '/auth/login',
      status: 200,
    });
    expect(typeof registro.durationMs).toBe('number');
  });

  it('no debe registrar tokens, contraseñas ni la cadena de consulta', () => {
    ejecutar({ authorization: 'Bearer token-secreto' });

    const texto = logSpy.mock.calls[0][0] as string;
    expect(texto).not.toContain('token-secreto');
    expect(texto).not.toContain('ClaveSecreta123');
    expect(texto).not.toContain('ana@example.com');
  });
});


