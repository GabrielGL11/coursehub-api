import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(
    err: any,
    user: TUser,
    info: any,
    context: ExecutionContext,
  ): TUser {
    const request = context.switchToHttp().getRequest<Request>();
    const authorization = request.headers.authorization;

    if (
      !authorization ||
      !authorization.startsWith('Bearer ') ||
      !authorization.slice('Bearer '.length).trim()
    ) {
      throw new UnauthorizedException('Token de acceso requerido');
    }

    if (err || !user) {
      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expirado');
      }

      throw new UnauthorizedException('Token inválido o expirado');
    }

    return user;
  }
}