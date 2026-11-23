import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './helpers/test-app.js';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET / es público y responde 200 con el mensaje de la API', async () => {
    await request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('CourseHub API está en línea');
  });
});
