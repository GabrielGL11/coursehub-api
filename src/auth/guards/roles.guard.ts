import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/user-role.enum.js';
import { ROLES_KEY } from '../decorators/roles.decorator.js';
import type { AuthenticatedUser } from '../types/jwt-payload.type.js';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.getAllAndOverride<UserRole[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
        );

        if (!roles || roles.length === 0) {
        return true;
        }

        const request = context
        .switchToHttp()
        .getRequest<{ user: AuthenticatedUser }>();

        if (!request.user || !roles.includes(request.user.role)) {
        throw new ForbiddenException(
            'No tienes permisos para realizar esta acción',
        );
        }

        return true;
    }
}