import { VersioningType } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { OpenAPIObject } from '@nestjs/swagger';

/** Ruta donde se publica la interfaz Swagger (el JSON queda en `/docs-json`). */
export const DOCS_PATH = 'docs';

/**
 * Versionado por URI: las rutas de negocio se publican como `/v1/courses`.
 * Debe aplicarse ANTES de crear el documento OpenAPI y la usan tanto
 * `main.ts` como las pruebas e2e, para que ambas vean las mismas rutas.
 */
export function setupVersioning(app: INestApplication): void {
  app.enableVersioning({ type: VersioningType.URI });
}

/** Construye el contrato OpenAPI a partir de los decoradores de los controladores. */
export function buildOpenApiDocument(app: INestApplication): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle('CourseHub API')
    .setDescription(
      'API REST para gestionar estudiantes, cursos y matrículas. ' +
        'Las rutas de negocio usan versionado por URI (`/v1/...`). ' +
        'Las rutas protegidas requieren un JWT en el encabezado ' +
        '`Authorization: Bearer <token>`, que se obtiene con `POST /v1/auth/login`.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  return SwaggerModule.createDocument(app, config);
}

/** Publica la interfaz de documentación. Solo se usa fuera de producción. */
export function setupSwagger(app: INestApplication): void {
  SwaggerModule.setup(DOCS_PATH, app, buildOpenApiDocument(app));
}
