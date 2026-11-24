import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UserRole } from '../src/users/user-role.enum.js';
import {
  TEST_PASSWORD,
  createTestApp,
  resetDatabase,
  seedUser,
  tokenFor,
} from './helpers/test-app.js';

/**
 * El limitador de solicitudes (`@nestjs/throttler`) se sustituye por un mock
 * en las pruebas e2e (`test/mocks/throttler.mock.ts`), por lo que los límites
 * de 20 y 5 solicitudes por minuto no se comprueban aquí.
 */
describe('Autenticación (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(async () => {
    await resetDatabase(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('rutas públicas', () => {
    it('POST /v1/auth/register crea la cuenta con rol student y sin exponer la contraseña', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/v1/auth/register')
        .send({ email: 'Nuevo@Test.local', password: TEST_PASSWORD })
        .expect(201);

      expect(body).toMatchObject({ email: 'nuevo@test.local', role: 'student' });
      expect(body).not.toHaveProperty('password');
      expect(body).not.toHaveProperty('passwordHash');
    });

    it('POST /v1/auth/register rechaza con 409 un correo ya registrado', async () => {
      await seedUser(app, 'repetido@test.local', UserRole.STUDENT);

      await request(app.getHttpServer())
        .post('/v1/auth/register')
        .send({ email: 'repetido@test.local', password: TEST_PASSWORD })
        .expect(409);
    });

    it('POST /v1/auth/login devuelve 200 y un accessToken con credenciales válidas', async () => {
      await seedUser(app, 'docente@test.local', UserRole.TEACHER);

      const { body } = await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({ email: 'docente@test.local', password: TEST_PASSWORD })
        .expect(200);

      expect(typeof body.accessToken).toBe('string');
      expect(body.user).toMatchObject({
        email: 'docente@test.local',
        role: 'teacher',
      });
      expect(body.user).not.toHaveProperty('passwordHash');
    });

    it('POST /v1/auth/login rechaza con 401 una contraseña incorrecta', async () => {
      await seedUser(app, 'docente@test.local', UserRole.TEACHER);

      const { body } = await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({ email: 'docente@test.local', password: 'otra-clave-123' })
        .expect(401);

      expect(body.message).toBe('Credenciales inválidas');
    });
  });

  describe('ruta protegida: GET /v1/auth/me', () => {
    it('devuelve 200 y la identidad del token', async () => {
      const admin = await seedUser(app, 'admin@test.local', UserRole.ADMIN);
      const token = await tokenFor(app, admin);

      const { body } = await request(app.getHttpServer())
        .get('/v1/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(body).toEqual({
        id: admin.id,
        email: 'admin@test.local',
        role: 'admin',
      });
    });

    it('rechaza con 401 sin token', async () => {
      await request(app.getHttpServer()).get('/v1/auth/me').expect(401);
    });

    it('rechaza con 401 un token alterado', async () => {
      const admin = await seedUser(app, 'admin@test.local', UserRole.ADMIN);
      const token = await tokenFor(app, admin);

      await request(app.getHttpServer())
        .get('/v1/auth/me')
        .set('Authorization', `Bearer ${token}x`)
        .expect(401);
    });
  });
});
