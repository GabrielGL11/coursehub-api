import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import {
  AuthenticatedUserDto,
  LoginResponseDto,
  PublicUserDto,
} from './dto/auth-response.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import type { AuthenticatedUser } from './types/jwt-payload.type.js';
import { ApiStandardErrors } from '../common/swagger/api-standard-errors.decorator.js';

@ApiTags('Autenticación')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar una cuenta (ruta pública)',
    description: 'Toda cuenta nueva recibe el rol `student`. Los roles superiores se asignan de forma controlada en la base de datos.',
  })
  @ApiCreatedResponse({ description: 'Cuenta creada', type: PublicUserDto })
  @ApiStandardErrors(400, 409, 429)
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({
    default: {
      limit: 5,
      ttl: 60_000,
    },
  })
  @ApiOperation({
    summary: 'Iniciar sesión y obtener un JWT (ruta pública)',
    description: 'Límite estricto: 5 solicitudes por minuto. Las credenciales incorrectas devuelven el mismo `401` genérico.',
  })
  @ApiOkResponse({ description: 'Credenciales válidas', type: LoginResponseDto })
  @ApiStandardErrors(400, 401, 429)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Consultar la identidad del token (requiere JWT)' })
  @ApiOkResponse({ description: 'Identidad extraída del token', type: AuthenticatedUserDto })
  @ApiStandardErrors(401)
  getProfile(@Req() req: Request & { user: AuthenticatedUser }) {
    return req.user;
  }
}
