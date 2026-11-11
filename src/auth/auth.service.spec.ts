import { vi } from 'vitest';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service.js';
import { UsersService } from '../users/users.service.js';
import { UserRole } from '../users/user-role.enum.js';

describe('AuthService', () => {
  let service: AuthService;
  let passwordHash: string;

  const usersServiceMock = {
    findByEmail: vi.fn(),
    findByEmailWithPassword: vi.fn(),
    create: vi.fn(),
  };

  const jwtServiceMock = {
    signAsync: vi.fn(),
  };

  beforeAll(async () => {
    // Hash real con costo bajo para que la prueba sea rápida.
    passwordHash = await bcrypt.hash('ClaveSegura123', 4);
  });

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debe emitir un token con sub, email y role en un inicio de sesión correcto', async () => {
    usersServiceMock.findByEmailWithPassword.mockResolvedValue({
      id: 2,
      email: 'docente@example.com',
      passwordHash,
      role: UserRole.TEACHER,
      createdAt: new Date('2026-11-01T00:00:00Z'),
    });
    jwtServiceMock.signAsync.mockResolvedValue('token-de-prueba');

    const resultado = await service.login({
      email: ' Docente@Example.com ',
      password: 'ClaveSegura123',
    });

    expect(usersServiceMock.findByEmailWithPassword).toHaveBeenCalledWith(
      'docente@example.com',
    );
    expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({
      sub: 2,
      email: 'docente@example.com',
      role: UserRole.TEACHER,
    });
    expect(resultado.accessToken).toBe('token-de-prueba');
    expect(resultado.user).not.toHaveProperty('passwordHash');
  });

  it('debe rechazar una contraseña incorrecta sin emitir token', async () => {
    usersServiceMock.findByEmailWithPassword.mockResolvedValue({
      id: 2,
      email: 'docente@example.com',
      passwordHash,
      role: UserRole.TEACHER,
    });

    await expect(
      service.login({ email: 'docente@example.com', password: 'otra-clave' }),
    ).rejects.toThrow(UnauthorizedException);
    expect(jwtServiceMock.signAsync).not.toHaveBeenCalled();
  });

  it('debe rechazar un correo inexistente con el mismo error genérico', async () => {
    usersServiceMock.findByEmailWithPassword.mockResolvedValue(null);

    await expect(
      service.login({ email: 'nadie@example.com', password: 'ClaveSegura123' }),
    ).rejects.toThrow('Credenciales inválidas');
    expect(jwtServiceMock.signAsync).not.toHaveBeenCalled();
  });

  it('debe registrar una cuenta con el rol student y sin exponer el hash', async () => {
    usersServiceMock.findByEmail.mockResolvedValue(null);
    usersServiceMock.create.mockResolvedValue({
      id: 5,
      email: 'nueva@example.com',
      passwordHash: 'no-debe-salir',
      role: UserRole.STUDENT,
      createdAt: new Date('2026-11-01T00:00:00Z'),
    });

    const resultado = await service.register({
      email: 'Nueva@Example.com',
      password: 'ClaveSegura123',
    });

    expect(usersServiceMock.create).toHaveBeenCalledWith(
      'nueva@example.com',
      expect.stringMatching(/^\$2[aby]\$/),
    );
    expect(resultado.role).toBe(UserRole.STUDENT);
    expect(resultado).not.toHaveProperty('passwordHash');
  });

  it('debe rechazar el registro de un correo duplicado', async () => {
    usersServiceMock.findByEmail.mockResolvedValue({ id: 1 });

    await expect(
      service.register({
        email: 'ana@example.com',
        password: 'ClaveSegura123',
      }),
    ).rejects.toThrow(ConflictException);
    expect(usersServiceMock.create).not.toHaveBeenCalled();
  });
});