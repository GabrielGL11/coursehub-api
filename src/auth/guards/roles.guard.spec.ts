import { jest } from '@jest/globals';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import type { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard.js';
import { ROLES_KEY } from '../decorators/roles.decorator.js';
import { UserRole } from '../../users/user-role.enum.js';
import type { AuthenticatedUser } from '../types/jwt-payload.type.js';

/**
 * Pruebas de la autorización por rol. El guard decide si una identidad ya
 * autenticada puede entrar a una ruta; la regla de propiedad vive en el caso
 * de uso y no se prueba aquí.
 */
describe('RolesGuard', () => {
  const reflector = { getAllAndOverride: jest.fn() };
  const guard = new RolesGuard(reflector as unknown as Reflector);

  const manejador = () => undefined;
  class ControladorDePrueba {}

  const crearContexto = (user?: AuthenticatedUser) =>
    ({
      getHandler: () => manejador,
      getClass: () => ControladorDePrueba,
      switchToHttp: () => ({ getRequest: () => ({ user }) }),
    }) as unknown as ExecutionContext;

  const estudiante: AuthenticatedUser = {
    id: 1,
    email: 'ana@example.com',
    role: UserRole.STUDENT,
  };
  const administrador: AuthenticatedUser = {
    id: 3,
    email: 'admin@example.com',
    role: UserRole.ADMIN,
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('debe permitir la ruta cuando no declara @Roles()', () => {
    // Arrange
    reflector.getAllAndOverride.mockReturnValue(undefined);

    // Act
    const resultado = guard.canActivate(crearContexto(estudiante));

    // Assert
    expect(resultado).toBe(true);
  });

  it('debe permitir la ruta cuando la lista de roles está vacía', () => {
    // Arrange
    reflector.getAllAndOverride.mockReturnValue([]);

    // Act
    const resultado = guard.canActivate(crearContexto(estudiante));

    // Assert
    expect(resultado).toBe(true);
  });

  it('debe permitir el acceso cuando el rol del usuario está autorizado', () => {
    // Arrange
    reflector.getAllAndOverride.mockReturnValue([UserRole.ADMIN]);

    // Act
    const resultado = guard.canActivate(crearContexto(administrador));

    // Assert
    expect(resultado).toBe(true);
  });

  it('debe rechazar con ForbiddenException cuando el rol no está autorizado', () => {
    // Arrange
    reflector.getAllAndOverride.mockReturnValue([UserRole.ADMIN]);

    // Act
    const accion = () => guard.canActivate(crearContexto(estudiante));

    // Assert
    expect(accion).toThrow(ForbiddenException);
  });

  it('debe rechazar cuando no hay una identidad autenticada', () => {
    // Arrange
    reflector.getAllAndOverride.mockReturnValue([UserRole.ADMIN]);

    // Act
    const accion = () => guard.canActivate(crearContexto(undefined));

    // Assert
    expect(accion).toThrow(ForbiddenException);
  });

  it('debe consultar los metadatos del método y de la clase', () => {
    // Arrange
    reflector.getAllAndOverride.mockReturnValue(undefined);

    // Act
    guard.canActivate(crearContexto(estudiante));

    // Assert
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, [
      manejador,
      ControladorDePrueba,
    ]);
  });
});


