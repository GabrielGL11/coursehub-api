import { INestApplication } from '@nestjs/common';
import type { OpenAPIObject } from '@nestjs/swagger';
import request from 'supertest';
import { buildOpenApiDocument } from '../src/app.setup.js';
import { createTestApp } from './helpers/test-app.js';

/**
 * Contrato OpenAPI y versionado.
 * Comprueba que el documento generado coincide con las rutas que la API
 * realmente sirve: la documentación no debe contradecir el comportamiento.
 */
describe('Contrato OpenAPI y versionado (e2e)', () => {
  let app: INestApplication;
  let document: OpenAPIObject;

  beforeAll(async () => {
    app = await createTestApp();
    document = buildOpenApiDocument(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('versionado por URI', () => {
    it('documenta las rutas de negocio solo con el prefijo /v1', () => {
      const paths = Object.keys(document.paths);

      expect(paths).toEqual(
        expect.arrayContaining([
          '/v1/auth/register',
          '/v1/auth/login',
          '/v1/auth/me',
          '/v1/courses',
          '/v1/courses/{id}',
          '/v1/students',
          '/v1/enrollments',
        ]),
      );

      // Solo la ruta de estado `/` queda sin versión; el resto debe llevar /v1.
      const unversioned = paths.filter(
        (path) => path !== '/' && !path.startsWith('/v1/'),
      );
      expect(unversioned).toEqual([]);
    });

    it('sirve la ruta versionada y no la ruta sin versión', async () => {
      await request(app.getHttpServer()).get('/v1/courses').expect(200);

      const { body } = await request(app.getHttpServer())
        .get('/courses')
        .expect(404);

      expect(body.statusCode).toBe(404);
    });
  });

  describe('seguridad documentada', () => {
    it('declara el esquema Bearer JWT', () => {
      expect(document.components?.securitySchemes).toHaveProperty('bearer');
      expect(document.components?.securitySchemes?.bearer).toMatchObject({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      });
    });

    it('marca las rutas protegidas con Bearer y documenta 401 y 403', () => {
      const create = document.paths['/v1/courses']?.post;

      expect(create?.security).toEqual([{ bearer: [] }]);
      expect(Object.keys(create?.responses ?? {})).toEqual(
        expect.arrayContaining(['201', '400', '401', '403']),
      );
    });

    it('no pide token en las rutas públicas', () => {
      expect(document.paths['/v1/courses']?.get?.security).toBeUndefined();
      expect(document.paths['/v1/auth/login']?.post?.security).toBeUndefined();
      expect(document.paths['/v1/auth/register']?.post?.security).toBeUndefined();
    });

    it('la ruta protegida documentada rechaza una solicitud sin token con 401', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/v1/courses')
        .send({ title: 'Sin token', level: 'beginner' })
        .expect(401);

      expect(body).toMatchObject({
        statusCode: 401,
        path: '/v1/courses',
      });
    });
  });

  describe('errores documentados', () => {
    it('describe los errores con la forma uniforme del filter', () => {
      const schemas = document.components?.schemas ?? {};

      expect(schemas).toHaveProperty('ErrorResponseDto');
      expect(
        Object.keys(
          (schemas.ErrorResponseDto as { properties: Record<string, unknown> })
            .properties,
        ),
      ).toEqual(
        expect.arrayContaining([
          'statusCode',
          'error',
          'message',
          'path',
          'timestamp',
          'requestId',
        ]),
      );
    });

    it('no expone el hash de la contraseña en ningún esquema de respuesta', () => {
      expect(JSON.stringify(document)).not.toContain('passwordHash');
    });
  });
});
