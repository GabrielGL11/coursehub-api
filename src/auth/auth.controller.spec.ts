
import { jest } from '@jest/globals';
import type { AuthService as AuthServiceType } from './auth.service.js';

jest.unstable_mockModule('@nestjs/throttler', () => ({
  Throttle: () => () => undefined,
}));

const { Test } = await import('@nestjs/testing');
const { AuthController } = await import('./auth.controller.js');
const { AuthService } = await import('./auth.service.js');
const { JwtAuthGuard } = await import('./guards/jwt-auth.guard.js');
const { UserRole } = await import('../users/user-role.enum.js');

describe('AuthController', () => {
  let controller: InstanceType<typeof AuthController>;

  const authServiceMock = {
    register: jest.fn<AuthServiceType['register']>(),
    login: jest.fn<AuthServiceType['login']>(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(AuthController);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debe delegar el registro al servicio', async () => {
    const dto = { email: 'ana@example.com', password: 'ClaveSegura123' };
    const respuesta = {
      id: 1,
      email: dto.email,
      role: UserRole.STUDENT,
    } as Awaited<ReturnType<AuthServiceType['register']>>;

    authServiceMock.register.mockResolvedValue(respuesta);

    await expect(controller.register(dto as any)).resolves.toEqual(respuesta);
    expect(authServiceMock.register).toHaveBeenCalledWith(dto);
  });

  it('debe delegar el inicio de sesión al servicio', async () => {
    const dto = { email: 'ana@example.com', password: 'ClaveSegura123' };
    const respuesta = {
      accessToken: 'token-de-prueba',
      user: { id: 1 },
    } as Awaited<ReturnType<AuthServiceType['login']>>;

    authServiceMock.login.mockResolvedValue(respuesta);

    await expect(controller.login(dto as any)).resolves.toEqual(respuesta);
    expect(authServiceMock.login).toHaveBeenCalledWith(dto);
  });

  it('debe devolver la identidad del usuario autenticado', () => {
    const user = { id: 1, email: 'ana@example.com', role: UserRole.STUDENT };

    expect(controller.getProfile({ user } as any)).toEqual(user);
  });
});
