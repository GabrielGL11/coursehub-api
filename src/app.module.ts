import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import Joi from 'joi';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { WelcomeController } from './welcome.controller.js';
import { WelcomeService } from './welcome.service.js';
import { CoursesModule } from './courses/courses.module.js';
import { StudentsModule } from './students/students.module.js';
import { EnrollmentsModule } from './enrollments/enrollments.module.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware.js';
import { HttpErrorFilter } from './common/filters/http-error.filter.js';
import { TimingInterceptor } from './common/interceptors/timing.interceptor.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'test', 'production')
          .default('development'),
        PORT: Joi.number().port().default(3000),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().port().default(5432),
        DATABASE_USER: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        JWT_SECRET: Joi.string().min(32).required(),
        JWT_EXPIRES_IN: Joi.string().default('15m'),
        // Semana 15: ajustes de despliegue. Los valores por defecto son los seguros.
        DATABASE_SYNCHRONIZE: Joi.boolean().default(false),
        THROTTLE_TTL_MS: Joi.number().integer().min(1000).default(60_000),
        THROTTLE_LIMIT: Joi.number().integer().min(1).default(20),
      }),
    }),

    // Límite de solicitudes por IP. Por defecto 20 por minuto; se puede ajustar
    // con THROTTLE_LIMIT / THROTTLE_TTL_MS (por ejemplo, solo en la prueba de carga local).
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: Number(config.getOrThrow('THROTTLE_TTL_MS')),
          limit: Number(config.getOrThrow('THROTTLE_LIMIT')),
        },
      ],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host: config.getOrThrow<string>('DATABASE_HOST'),
        port: config.getOrThrow<number>('DATABASE_PORT'),
        username: config.getOrThrow<string>('DATABASE_USER'),
        password: config.getOrThrow<string>('DATABASE_PASSWORD'),
        database: config.getOrThrow<string>('DATABASE_NAME'),
        autoLoadEntities: true,
        // Solo en desarrollo, o si se activa de forma explícita en un entorno de práctica.
        // En producción real el esquema se gestiona con migraciones (fuera del alcance del curso).
        synchronize:
          config.get<string>('NODE_ENV') === 'development' ||
          String(config.get('DATABASE_SYNCHRONIZE')) === 'true',
      }),
    }),

    CoursesModule,
    StudentsModule,
    EnrollmentsModule,
    UsersModule,
    AuthModule,
    NotificationsModule,
  ],
  controllers: [AppController, WelcomeController],
  providers: [
    AppService,
    WelcomeService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimingInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Registro de solicitudes para todas las rutas de la API.
    consumer
      .apply(RequestLoggerMiddleware)
      .forRoutes({ path: '*path', method: RequestMethod.ALL });
  }
}