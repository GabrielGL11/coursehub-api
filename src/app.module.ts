import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { WelcomeController } from './welcome.controller.js';
import { WelcomeService } from './welcome.service.js';
import { CoursesModule } from './courses/courses.module.js';
import { StudentsModule } from './students/students.module.js';
import { EnrollmentsModule } from './enrollments/enrollments.module.js';
@Module({
  imports: [
    // Configuración de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Configuración de PostgreSQL con TypeORM
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.getOrThrow<string>('DATABASE_HOST'),
        port: Number(config.getOrThrow<string>('DATABASE_PORT')),
        username: config.getOrThrow<string>('DATABASE_USER'),
        password: config.getOrThrow<string>('DATABASE_PASSWORD'),
        database: config.getOrThrow<string>('DATABASE_NAME'),
        // Carga automáticamente las entidades registradas
        autoLoadEntities: true,
        // Sincroniza las tablas con las entidades
        synchronize: true,
      }),
    }),
    // Módulos de la aplicación
  CoursesModule, StudentsModule, EnrollmentsModule],
  controllers: [AppController, WelcomeController],
  providers: [AppService, WelcomeService],
})
export class AppModule {}