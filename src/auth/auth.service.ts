import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registra una cuenta nueva.
   * Normaliza el correo y guarda únicamente el hash de la contraseña.
   */
  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();

    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('El correo ya está registrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    try {
      const user = await this.usersService.create(email, passwordHash);

      // Nunca devolver la contraseña ni su hash.
      return {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      };
    } catch (error: unknown) {
      // Protección ante una posible condición de carrera por correo duplicado.
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === '23505'
      ) {
        throw new ConflictException('El correo ya está registrado');
      }

      throw error;
    }
  }

  /**
   * Comprueba las credenciales y emite un JWT.
   */
  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();

    const user = await this.usersService.findByEmailWithPassword(email);

    // El mensaje es igual para correo inexistente y contraseña incorrecta.
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Payload mínimo: no incluir contraseña ni passwordHash.
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }
}