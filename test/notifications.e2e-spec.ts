import type { AddressInfo } from 'node:net';
import { INestApplication } from '@nestjs/common';
import { io, type Socket } from 'socket.io-client';
import request from 'supertest';
import { UserRole } from '../src/users/user-role.enum.js';
import { createTestApp, resetDatabase, seedUser, tokenFor } from './helpers/test-app.js';

/**
 * Extensión WebSocket de la Semana 15.
 *
 * A diferencia de las demás pruebas e2e, aquí la aplicación sí escucha en un
 * puerto (el 0 deja que el sistema elija uno libre), porque Socket.IO necesita
 * una conexión real. El limitador de solicitudes sigue sustituido por el mock.
 */
describe('Notificaciones en tiempo real (e2e)', () => {
  let app: INestApplication;
  let url: string;
  const sockets: Socket[] = [];

  /** Abre una conexión al espacio /notifications y espera el resultado del handshake. */
  const connect = (token?: string): Promise<Socket> =>
    new Promise((resolve, reject) => {
      const socket = io(`${url}/notifications`, {
        auth: token ? { token } : {},
        transports: ['websocket'],
        reconnection: false,
      });
      sockets.push(socket);
      socket.on('connect', () => resolve(socket));
      socket.on('connect_error', (error) => reject(error));
    });

  /** Espera un evento concreto, con tiempo límite para no dejar la prueba colgada. */
  const nextEvent = <T>(socket: Socket, event: string, timeoutMs = 5_000): Promise<T> =>
    new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error(`No llegó el evento "${event}" en ${timeoutMs} ms`)),
        timeoutMs,
      );
      socket.once(event, (payload: T) => {
        clearTimeout(timer);
        resolve(payload);
      });
    });

  beforeAll(async () => {
    app = await createTestApp();
    await app.listen(0);
    const { port } = app.getHttpServer().address() as AddressInfo;
    url = `http://127.0.0.1:${port}`;
  });

  beforeEach(async () => {
    await resetDatabase(app);
  });

  afterEach(() => {
    while (sockets.length > 0) {
      sockets.pop()?.close();
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe('control de acceso', () => {
    it('rechaza la conexión sin token', async () => {
      await expect(connect()).rejects.toMatchObject({ message: 'No autorizado' });
    });

    it('rechaza un token inválido', async () => {
      await expect(connect('esto-no-es-un-jwt')).rejects.toMatchObject({
        message: 'No autorizado',
      });
    });

    it('acepta un token válido', async () => {
      const student = await seedUser(app, 'alumno@test.local', UserRole.STUDENT);
      const token = await tokenFor(app, student);

      const socket = await connect(token);

      expect(socket.connected).toBe(true);
    });
  });

  describe('evento enrollment.created', () => {
    it('llega al cliente conectado cuando se crea una matrícula por la API REST', async () => {
      const teacher = await seedUser(app, 'docente@test.local', UserRole.TEACHER);
      const student = await seedUser(app, 'alumno@test.local', UserRole.STUDENT);
      const teacherToken = await tokenFor(app, teacher);
      const studentToken = await tokenFor(app, student);
      const http = request(app.getHttpServer());

      const { body: course } = await http
        .post('/v1/courses')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({ title: 'Tiempo real', level: 'beginner' })
        .expect(201);

      const { body: studentRecord } = await http
        .post('/v1/students')
        .send({
          name: 'Ana Pérez',
          email: 'ana.perez@example.edu',
          age: 21,
          career: 'Software',
          semester: 3,
          isActive: true,
        })
        .expect(201);

      // El cliente se conecta ANTES de crear la matrícula y queda escuchando.
      const socket = await connect(studentToken);
      const received = nextEvent<Record<string, unknown>>(socket, 'enrollment.created');

      await http
        .post('/v1/enrollments')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({ studentId: studentRecord.id, courseId: course.id })
        .expect(201);

      const payload = await received;

      expect(payload).toMatchObject({
        enrollmentId: expect.any(Number),
        studentId: studentRecord.id,
        courseId: course.id,
      });
      expect(new Date(payload.occurredAt as string).toString()).not.toBe('Invalid Date');
      // Sin datos personales: ni nombre ni correo viajan por el WebSocket.
      expect(Object.keys(payload).sort()).toEqual([
        'courseId',
        'enrollmentId',
        'occurredAt',
        'studentId',
      ]);
    });

    it('no se emite si la matrícula se rechaza (por ejemplo, un duplicado)', async () => {
      const teacher = await seedUser(app, 'docente@test.local', UserRole.TEACHER);
      const teacherToken = await tokenFor(app, teacher);
      const http = request(app.getHttpServer());

      const { body: course } = await http
        .post('/v1/courses')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({ title: 'Sin duplicados', level: 'beginner' })
        .expect(201);
      const { body: studentRecord } = await http
        .post('/v1/students')
        .send({
          name: 'Luis Mora',
          email: 'luis.mora@example.edu',
          age: 23,
          career: 'Software',
          semester: 4,
          isActive: true,
        })
        .expect(201);
      const enrollment = { studentId: studentRecord.id, courseId: course.id };

      await http
        .post('/v1/enrollments')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send(enrollment)
        .expect(201);

      const socket = await connect(teacherToken);
      let events = 0;
      socket.on('enrollment.created', () => {
        events += 1;
      });

      await http
        .post('/v1/enrollments')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send(enrollment)
        .expect(409);

      // Margen breve para comprobar que NO llega nada.
      await new Promise((resolve) => setTimeout(resolve, 300));
      expect(events).toBe(0);
    });
  });
});
