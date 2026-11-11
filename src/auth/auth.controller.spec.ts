import { vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { UserRole } from '../users/user-role.enum.js';

describe('AuthController', () => {
  let controller: AuthController;

  const authServiceMock = {
    register: vi.fn(),
    login: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debe delegar el registro al servicio', async () => {
    const dto = { email: 'ana@example.com', password: 'ClaveSegura123' };
    const respuesta = { id: 1, email: dto.email, role: UserRole.STUDENT };
    authServiceMock.register.mockResolvedValue(respuesta);

    await expect(controller.register(dto as any)).resolves.toEqual(respuesta);
    expect(authServiceMock.register).toHaveBeenCalledWith(dto);
  });

  it('debe delegar el inicio de sesión al servicio', async () => {
    const dto = { email: 'ana@example.com', password: 'ClaveSegura123' };
    const respuesta = { accessToken: 'token-de-prueba', user: { id: 1 } };
    authServiceMock.login.mockResolvedValue(respuesta);

    await expect(controller.login(dto as any)).resolves.toEqual(respuesta);
    expect(authServiceMock.login).toHaveBeenCalledWith(dto);
  });

  it('debe devolver la identidad del usuario autenticado', () => {
    const user = { id: 1, email: 'ana@example.com', role: UserRole.STUDENT };

    expect(controller.getProfile({ user } as any)).toEqual(user);
  });
});