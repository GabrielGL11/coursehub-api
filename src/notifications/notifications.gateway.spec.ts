import { jest } from '@jest/globals';
import { NotificationsGateway } from './notifications.gateway.js';
import { AUTHENTICATED_ROOM } from './notifications.events.js';
import { UserRole } from '../users/user-role.enum.js';

type Next = (error?: Error) => void;
type Middleware = (socket: unknown, next: Next) => void;

function fakeSocket(handshake: { auth?: Record<string, unknown>; headers?: Record<string, string> } = {}) {
  return {
    handshake: { auth: handshake.auth ?? {}, headers: handshake.headers ?? {} },
    data: {} as Record<string, unknown>,
    join: jest.fn(),
    disconnect: jest.fn(),
  };
}

describe('NotificationsGateway', () => {
  const jwtServiceMock = { verifyAsync: jest.fn<(token: string) => Promise<unknown>>() };
  let gateway: NotificationsGateway;
  let middleware: Middleware;

  /** Ejecuta el middleware y espera a que llame a `next`. */
  const run = (socket: unknown) =>
    new Promise<Error | undefined>((resolve) => {
      middleware(socket, (error) => resolve(error));
    });

  beforeEach(() => {
    jest.clearAllMocks();
    gateway = new NotificationsGateway(jwtServiceMock as never);
    gateway.afterInit({
      use: (fn: Middleware) => {
        middleware = fn;
      },
    } as never);
  });

  describe('control de acceso del handshake', () => {
    it('rechaza la conexión sin token', async () => {
      const error = await run(fakeSocket());

      expect(error?.message).toBe('No autorizado');
      expect(jwtServiceMock.verifyAsync).not.toHaveBeenCalled();
    });

    it('rechaza un token inválido o vencido sin revelar la causa', async () => {
      jwtServiceMock.verifyAsync.mockRejectedValue(new Error('jwt expired'));

      const error = await run(fakeSocket({ auth: { token: 'token-malo' } }));

      expect(error?.message).toBe('No autorizado');
    });

    it('rechaza un token con un rol que no existe', async () => {
      jwtServiceMock.verifyAsync.mockResolvedValue({ sub: 1, email: 'a@test.local', role: 'superadmin' });

      const error = await run(fakeSocket({ auth: { token: 'token' } }));

      expect(error?.message).toBe('No autorizado');
    });

    it('acepta un token válido en auth.token y guarda el usuario', async () => {
      jwtServiceMock.verifyAsync.mockResolvedValue({ sub: 7, email: 'ana@test.local', role: UserRole.STUDENT });
      const socket = fakeSocket({ auth: { token: 'token-bueno' } });

      const error = await run(socket);

      expect(error).toBeUndefined();
      expect(jwtServiceMock.verifyAsync).toHaveBeenCalledWith('token-bueno');
      expect(socket.data.user).toEqual({ id: 7, email: 'ana@test.local', role: UserRole.STUDENT });
    });

    it('acepta el token del encabezado Authorization: Bearer', async () => {
      jwtServiceMock.verifyAsync.mockResolvedValue({ sub: 7, email: 'ana@test.local', role: UserRole.TEACHER });

      const error = await run(fakeSocket({ headers: { authorization: 'Bearer abc.def.ghi' } }));

      expect(error).toBeUndefined();
      expect(jwtServiceMock.verifyAsync).toHaveBeenCalledWith('abc.def.ghi');
    });
  });

  describe('handleConnection', () => {
    it('une al socket autenticado a la sala de avisos', () => {
      const socket = fakeSocket();
      socket.data.user = { id: 1, email: 'a@test.local', role: UserRole.STUDENT };

      gateway.handleConnection(socket as never);

      expect(socket.join).toHaveBeenCalledWith(AUTHENTICATED_ROOM);
      expect(socket.disconnect).not.toHaveBeenCalled();
    });

    it('desconecta a un socket que llegó sin autenticar', () => {
      const socket = fakeSocket();

      gateway.handleConnection(socket as never);

      expect(socket.join).not.toHaveBeenCalled();
      expect(socket.disconnect).toHaveBeenCalledWith(true);
    });
  });

  describe('broadcast', () => {
    it('emite solo a la sala de clientes autenticados', () => {
      const emit = jest.fn();
      const to = jest.fn().mockReturnValue({ emit });
      gateway.server = { to } as never;

      gateway.broadcast('enrollment.created', { enrollmentId: 1 });

      expect(to).toHaveBeenCalledWith(AUTHENTICATED_ROOM);
      expect(emit).toHaveBeenCalledWith('enrollment.created', { enrollmentId: 1 });
    });

    it('no falla si el servidor WebSocket todavía no existe', () => {
      expect(() => gateway.broadcast('enrollment.created', {})).not.toThrow();
    });
  });
});
