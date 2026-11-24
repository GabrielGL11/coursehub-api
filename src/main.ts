import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module.js';
import { DOCS_PATH, setupSwagger, setupVersioning } from './app.setup.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración CORS: permite solicitudes desde el frontend local.
  app.enableCors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Validación global de los datos recibidos.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Versionado por URI (/v1/...). Debe ir antes de generar el documento OpenAPI.
  setupVersioning(app);

  const config = app.get(ConfigService);
  const port = config.getOrThrow<number>('PORT');

  // La documentación solo se publica fuera de producción.
  const docsEnabled = config.get<string>('NODE_ENV') !== 'production';
  if (docsEnabled) {
    setupSwagger(app);
  }

  await app.listen(port);

  console.log(`Aplicación ejecutándose en el puerto ${port}`);
  if (docsEnabled) {
    console.log(`Documentación en http://localhost:${port}/${DOCS_PATH}`);
  }
}

await bootstrap();
