import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { AppModule } from '../../src/app.module.js';
import { setupVersioning } from '../../src/app.setup.js';
import { User } from '../../src/users/entities/user.entity.js';
import { UserRole } from '../../src/users/user-role.enum.js';

/** Contraseña común de las cuentas de práctica. Solo existe en la base de pruebas. */
export const TEST_PASSWORD = 'Password123!';

/**
 * Las pruebas e2e borran y recrean el esquema. Para que nunca puedan tocar
 * la base de desarrollo, se niegan a ejecutarse si el nombre no termina en `_test`.
 */
function assertTestDatabase(): void {
  const name = process.env.DATABASE_NAME ?? '';

  if (!name.endsWith('_test')) {
    throw new Error(
      `Las pruebas e2e solo se ejecutan contra una base cuyo nombre termine en "_test" ` +
        `(DATABASE_NAME actual: "${name || 'sin definir'}"). ` +
        `Revisa .env.test o las variables del entorno.`,
    );
  }
}

/**
 * Crea la aplicación completa (AppModule real) como en `main.ts`,
 * con la misma validación global, y deja el esquema vacío y listo.
 */
export async function createTestApp(): Promise<INestApplication> {
  assertTestDatabase();

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();

  // Debe coincidir con la configuración de `src/main.ts`.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Versionado por URI (/v1/...): igual que en `src/main.ts`.
  setupVersioning(app);

  await app.init();

  // En `NODE_ENV=test` TypeORM no sincroniza el esquema: se crea aquí,
  // desde cero, solo en la base de pruebas.
  await app.get(DataSource).synchronize(true);

  return app;
}

/** Vacía todas las tablas y reinicia los identificadores: cada prueba parte de cero. */
export async function resetDatabase(app: INestApplication): Promise<void> {
  const dataSource = app.get(DataSource);
  const tables = dataSource.entityMetadatas
    .map((metadata) => `"${metadata.tableName}"`)
    .join(', ');

  await dataSource.query(
    `TRUNCATE TABLE ${tables} RESTART IDENTITY CASCADE`,
  );
}

/** Inserta una cuenta de práctica directamente en la base de pruebas. */
export async function seedUser(
  app: INestApplication,
  email: string,
  role: UserRole,
  password: string = TEST_PASSWORD,
): Promise<User> {
  // Coste bajo: en pruebas solo importa la rapidez.
  const passwordHash = await bcrypt.hash(password, 4);

  return app.get(DataSource).getRepository(User).save({
    email,
    passwordHash,
    role,
  });
}

/**
 * Firma un JWT con el mismo secreto y el mismo contenido que emite `POST /auth/login`
 * (`sub`, `email`, `role`). Evita iniciar sesión en cada prueba y así no
 * choca con el límite de 5 inicios de sesión por minuto.
 */
export function tokenFor(app: INestApplication, user: User): Promise<string> {
  return app.get(JwtService).signAsync({
    sub: user.id,
    email: user.email,
    role: user.role,
  });
}
