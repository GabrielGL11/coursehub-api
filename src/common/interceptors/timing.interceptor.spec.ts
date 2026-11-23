import { jest } from '@jest/globals';
import { lastValueFrom, of, throwError } from 'rxjs';
import { TimingInterceptor } from './timing.interceptor.js';

describe('TimingInterceptor', () => {
  const interceptor = new TimingInterceptor();
  const setHeader = jest.fn();

  const context = {
    switchToHttp: () => ({
      getRequest: () => ({ method: 'GET', originalUrl: '/courses?page=1' }),
      getResponse: () => ({ setHeader }),
    }),
  } as any;

  beforeEach(() => jest.clearAllMocks());

  it('debe devolver el mismo resultado y añadir X-Response-Time', async () => {
    const resultado = { items: [] };
    const handler = { handle: () => of(resultado) };

    await expect(
      lastValueFrom(interceptor.intercept(context, handler as any)),
    ).resolves.toEqual(resultado);

    expect(setHeader).toHaveBeenCalledWith(
      'X-Response-Time',
      expect.stringMatching(/^\d+ms$/),
    );
  });

  it('no debe ocultar los errores del controlador', async () => {
    const handler = { handle: () => throwError(() => new Error('fallo')) };

    await expect(
      lastValueFrom(interceptor.intercept(context, handler as any)),
    ).rejects.toThrow('fallo');
    expect(setHeader).not.toHaveBeenCalled();
  });
});


