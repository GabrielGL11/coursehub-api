import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../users/user-role.enum.js';

/** Datos públicos de una cuenta. Nunca incluye la contraseña ni `passwordHash`. */
export class PublicUserDto {
  @ApiProperty({ example: 2 })
  id: number;

  @ApiProperty({ example: 'ana@example.com' })
  email: string;

  @ApiProperty({ enum: UserRole, example: UserRole.STUDENT })
  role: UserRole;

  @ApiProperty({ example: '2026-10-19T19:46:24.803Z' })
  createdAt: string;
}

export class LoginResponseDto {
  @ApiProperty({ description: 'JWT firmado; vence según JWT_EXPIRES_IN (15 minutos por defecto)', example: '<token-jwt>' })
  accessToken: string;

  @ApiProperty({ type: () => PublicUserDto })
  user: PublicUserDto;
}

/** Identidad que el servidor extrae del token en `GET /v1/auth/me`. */
export class AuthenticatedUserDto {
  @ApiProperty({ example: 2 })
  id: number;

  @ApiProperty({ example: 'ana@example.com' })
  email: string;

  @ApiProperty({ enum: UserRole, example: UserRole.STUDENT })
  role: UserRole;
}
