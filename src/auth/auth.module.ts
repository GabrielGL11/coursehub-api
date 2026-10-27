import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import type { SignOptions } from 'jsonwebtoken';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [
    UsersModule,

    // Utiliza el mismo secreto y tiempo de expiración
    // configurados mediante las variables de entorno.
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.getOrThrow<string>(
            'JWT_EXPIRES_IN',
          ) as SignOptions['expiresIn'],
        },
      }),
    }),
  ],

  controllers: [AuthController],

  // El guard utiliza JwtService para verificar la firma y expiración.
  providers: [AuthService, JwtAuthGuard],

  // Permite que otros módulos utilicen el guard y JwtService.
  exports: [JwtModule, JwtAuthGuard],
})
export class AuthModule {}