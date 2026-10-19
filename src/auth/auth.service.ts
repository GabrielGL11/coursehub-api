import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();

    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('El correo ya está registrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    try {
      const user = await this.usersService.create(email, passwordHash);

      return {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      };
    } catch (error: unknown) {
      // PostgreSQL: 23505 significa violación de UNIQUE.
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
}
