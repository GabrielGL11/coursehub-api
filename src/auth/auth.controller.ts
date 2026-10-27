import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import type { AuthenticatedRequest } from './guards/jwt-auth.guard.js';
import { UsersService } from '../users/users.service.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * POST /auth/register
   * Registra una cuenta y devuelve sus datos públicos.
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /**
   * POST /auth/login
   * Comprueba las credenciales y devuelve un JWT.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /**
   * GET /auth/me
   * Requiere un JWT válido en el encabezado Authorization.
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() request: AuthenticatedRequest) {
    // El guard verifica el token y coloca su payload en request.user.
    const user = await this.usersService.findById(request.user.sub);

    // Comprueba que la cuenta siga existiendo y coincida con el token.
    if (!user || user.email !== request.user.email) {
      throw new UnauthorizedException('Usuario no válido');
    }

    // Devolver únicamente los campos públicos.
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}