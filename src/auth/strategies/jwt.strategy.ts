import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRole } from '../../users/user-role.enum.js';
import type { JwtPayload } from '../types/jwt-payload.type.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(configService: ConfigService) {
        super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
        });
    }

    validate(payload: JwtPayload) {
        if (
        !Number.isInteger(payload.sub) ||
        payload.sub <= 0 ||
        typeof payload.email !== 'string' ||
        !Object.values(UserRole).includes(payload.role)
        ) {
        throw new UnauthorizedException('Payload JWT inválido');
        }

        return {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        };
    }
}