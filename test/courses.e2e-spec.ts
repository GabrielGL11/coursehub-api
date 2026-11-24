import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { Course } from '../src/courses/entities/course.entity.js';
import { UserRole } from '../src/users/user-role.enum.js';
import { createTestApp, resetDatabase, seedUser, tokenFor } from './helpers/test-app.js';

/**
 * El limitador de solicitudes (`@nestjs/throttler`) se sustituye por un mock
 * en las pruebas e2e (`test/mocks/throttler.mock.ts`), por lo que su límite
 * no interviene en este archivo.
 */
describe('Cursos (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  // Preparación y limpieza: cada prueba empieza con la base vacía.
  beforeEach(async () => {
    await resetDatabase(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('ruta pública: GET /v1/courses', () => {
    it('lista los cursos sin token y devuelve la paginación', async () => {
      await app.get(DataSource).getRepository(Course).save([
        { title: 'NestJS básico', level: 'beginner', createdByUserId: null },
        { title: 'NestJS avanzado', level: 'advanced', createdByUserId: null },
      ]);

      const { body } = await request(app.getHttpServer())
        .get('/v1/courses')
        .expect(200);

      expect(body.items).toHaveLength(2);
      expect(body.meta).toMatchObject({ total: 2, page: 1, limit: 10 });
    });

    it('responde 404 con la forma uniforme si el curso no existe', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/v1/courses/999999')
        .expect(404);

      expect(body).toMatchObject({
        statusCode: 404,
        error: 'Not Found',
        path: '/v1/courses/999999',
      });
    });
  });

  describe('ruta protegida: POST /v1/courses', () => {
    it('crea el curso (201) con un docente y registra quién lo creó', async () => {
      const teacher = await seedUser(app, 'docente@test.local', UserRole.TEACHER);
      const token = await tokenFor(app, teacher);

      const { body } = await request(app.getHttpServer())
        .post('/v1/courses')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Pruebas e2e', level: 'intermediate' })
        .expect(201);

      expect(body).toMatchObject({
        title: 'Pruebas e2e',
        level: 'intermediate',
        createdByUserId: teacher.id,
      });

      // La respuesta HTTP debe coincidir con lo que quedó en la base.
      const saved = await app
        .get(DataSource)
        .getRepository(Course)
        .findOneBy({ id: body.id });

      expect(saved?.createdByUserId).toBe(teacher.id);
    });

    it('rechaza con 401 si no se envía token', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/v1/courses')
        .send({ title: 'Sin token', level: 'beginner' })
        .expect(401);

      expect(body.message).toBe('Token de acceso requerido');
    });

    it('rechaza con 403 si el rol es student', async () => {
      const student = await seedUser(app, 'estudiante@test.local', UserRole.STUDENT);
      const token = await tokenFor(app, student);

      await request(app.getHttpServer())
        .post('/v1/courses')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Sin permiso', level: 'beginner' })
        .expect(403);

      // El rechazo no debe dejar datos: no se creó ningún curso.
      const total = await app.get(DataSource).getRepository(Course).count();

      expect(total).toBe(0);
    });

    it('rechaza con 400 un cuerpo inválido', async () => {
      const teacher = await seedUser(app, 'docente@test.local', UserRole.TEACHER);
      const token = await tokenFor(app, teacher);

      const { body } = await request(app.getHttpServer())
        .post('/v1/courses')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: '', level: 'experto' })
        .expect(400);

      expect(body.statusCode).toBe(400);
      expect(Array.isArray(body.message)).toBe(true);
    });
  });
});
