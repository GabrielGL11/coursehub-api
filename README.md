# Sistema de Gestión Académica — CourseHub API

<p align="center">
  <a href="https://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

API REST desarrollada con **NestJS, TypeScript, PostgreSQL y TypeORM** para gestionar estudiantes, cursos y matrículas académicas. El proyecto incorpora configuración mediante variables de entorno, validaciones, consultas con filtros, búsqueda, paginación, ordenamiento y autenticación de usuarios mediante contraseñas con bcrypt, tokens JWT y protección de rutas mediante un guard de NestJS. Desde la Semana 10 (Sesión 19) incorpora además autorización basada en roles (RBAC) y control de propiedad sobre los cursos, y (Sesión 20) controles de seguridad para una API pública: CORS restringido, limitación de solicitudes y requisito de HTTPS/TLS en producción. Desde la Semana 11 (Sesión 21) incorpora componentes transversales centralizados: middleware de registro de solicitudes, filter global de errores, interceptor de tiempo de respuesta y `ParseIntPipe` en los parámetros numéricos. En la Sesión 22 la regla de actualización de cursos se separa en un caso de uso (`UpdateCourseUseCase`) que depende de un contrato de repositorio pequeño y de un adaptador TypeORM. Desde la Semana 12 (Sesión 23) la regla de propiedad se comprueba con pruebas unitarias que usan un repositorio simulado, sin HTTP ni PostgreSQL. En la Sesión 24 se añaden pruebas del controlador (delegación de identificador, DTO e identidad autenticada), pruebas de la autorización por rol y un informe de cobertura para detectar ramas sin ejercitar. Las pruebas unitarias se ejecutan con **Jest** (se escribieron primero con Vitest y se migraron a Jest sin cambiar la lógica de negocio ni los casos de prueba); Desde la Semana 13 (Sesión 25) las pruebas end-to-end también usan **Jest y Supertest** (`npm run test:e2e`) contra una base de datos exclusiva de pruebas, y en la Sesión 26 un flujo de **GitHub Actions** ejecuta el análisis estático, las pruebas y la compilación con cada cambio. Vitest ya no ejecuta ningún comando del proyecto.

Este proyecto forma parte de las prácticas de la asignatura **Desarrollo Backend Web con NestJS**.

## Tabla de contenidos

- [Tecnologías](#tecnologías)
- [Descripción del proyecto](#descripción-del-proyecto)
- [Arquitectura](#arquitectura)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Instalación y configuración](#instalación-y-configuración)
- [Semana 7: configuración y variables de entorno](#semana-7-configuración-y-variables-de-entorno)
- [Semana 8: usuarios y autenticación inicial](#semana-8-usuarios-y-autenticación-inicial)
- [Semana 9: autenticación con JWT](#semana-9-autenticación-con-jwt)
- [Semana 10: roles, permisos y propiedad de recursos (Sesión 19)](#semana-10-roles-permisos-y-propiedad-de-recursos-sesión-19)
- [Semana 10: controles de seguridad para una API pública (Sesión 20)](#semana-10-controles-de-seguridad-para-una-api-pública-sesión-20)
- [Semana 11: componentes transversales (Sesión 21)](#semana-11-componentes-transversales-sesión-21)
- [Semana 11: casos de uso, repositorios y adaptadores (Sesión 22)](#semana-11-casos-de-uso-repositorios-y-adaptadores-sesión-22)
- [Semana 12: pruebas unitarias de reglas de negocio (Sesión 23)](#semana-12-pruebas-unitarias-de-reglas-de-negocio-sesión-23)
- [Semana 12: controladores, cobertura y calidad de pruebas (Sesión 24)](#semana-12-controladores-cobertura-y-calidad-de-pruebas-sesión-24)
- [Avance de Etapa 4 — Semana 12: pruebas unitarias que protegen reglas](#avance-de-etapa-4--semana-12-pruebas-unitarias-que-protegen-reglas)
- [Semana 13: pruebas e2e y automatización de calidad (Sesiones 25 y 26)](#semana-13-pruebas-e2e-y-automatización-de-calidad-sesiones-25-y-26)
- [Avance de Etapa 4 — Semana 13: calidad integrada y automatizada](#avance-de-etapa-4--semana-13-calidad-integrada-y-automatizada)
- [Modelo de datos](#modelo-de-datos)
- [Endpoints de estudiantes](#endpoints-de-estudiantes)
- [Endpoints de cursos](#endpoints-de-cursos)
- [Endpoints de matrículas](#endpoints-de-matrículas)
- [Endpoints de usuarios y autenticación](#endpoints-de-usuarios-y-autenticación)
- [Rutas públicas y protegidas](#11-rutas-públicas-y-protegidas)
- [Validaciones y respuestas HTTP](#validaciones-y-respuestas-http)
- [Persistencia y pruebas de la Semana 5](#persistencia-y-pruebas-de-la-semana-5)
- [Actuación 3: consultas, filtros y paginación](#actuación-3-consultas-filtros-y-paginación)
- [Pruebas y evidencias](#pruebas-y-evidencias)
- [Persistencia de datos](#persistencia-de-datos)
- [Seguridad de credenciales](#seguridad-de-credenciales)
- [Comandos disponibles](#comandos-disponibles)
- [Documentación oficial](#documentación-oficial)
- [Estado del proyecto](#estado-del-proyecto)
- [Licencia](#licencia)

## Tecnologías

- **NestJS:** framework para desarrollar aplicaciones del lado del servidor.
- **TypeScript:** lenguaje de programación utilizado en el proyecto.
- **Node.js:** entorno de ejecución.
- **PostgreSQL:** sistema de gestión de bases de datos.
- **TypeORM:** mapeo objeto-relacional para interactuar con la base de datos.
- **@nestjs/config:** administración de variables de entorno.
- **Joi:** validación de la configuración de la aplicación.
- **class-validator:** validación de datos y parámetros.
- **class-transformer:** transformación de parámetros y objetos.
- **bcrypt:** hash y verificación de contraseñas.
- **@nestjs/jwt:** firma y emisión de tokens JWT.
- **@nestjs/passport, passport y passport-jwt:** extracción del token Bearer, verificación de firma y vencimiento, y protección de rutas mediante `AuthGuard('jwt')`.
- **Guards, `Reflector` y `SetMetadata` de NestJS:** autorización por roles mediante `RolesGuard` y el decorador `@Roles()`.
- **@nestjs/throttler:** limitación de la tasa de solicitudes (rate limiting) mediante `ThrottlerModule` y `ThrottlerGuard`.
- **CORS de NestJS (`app.enableCors`):** restricción de los orígenes web que pueden leer las respuestas de la API desde un navegador.
- **Jest, `ts-jest` y `@types/jest`:** pruebas unitarias en TypeScript (`npm test`), cobertura (`npm run test:cov`) y pruebas end-to-end (`npm run test:e2e`).
- **Supertest:** envía solicitudes HTTP reales a la aplicación Nest en las pruebas e2e.
- **GitHub Actions:** flujo `quality` que instala dependencias con `npm ci`, ejecuta lint, pruebas unitarias, pruebas e2e y compilación.
- **Vitest:** se usó al inicio del proyecto. Ya no ejecuta ningún comando (las pruebas unitarias y las e2e usan Jest); `vitest.config.ts` y `vitest.config.e2e.ts` se conservan sin uso.
- **Thunder Client:** herramienta para probar los endpoints REST.
- **pgAdmin:** herramienta para administrar y verificar PostgreSQL.

## Descripción del proyecto

CourseHub API permite administrar estudiantes, cursos y sus respectivas matrículas mediante una API REST.

Las principales funcionalidades incluyen:

- Gestión de estudiantes, cursos y matrículas.
- Persistencia de datos mediante PostgreSQL y TypeORM.
- Relaciones entre estudiantes, cursos y matrículas.
- Validación de datos de entrada mediante DTOs.
- Búsqueda textual por nombre o correo electrónico de estudiantes.
- Búsqueda de matrículas por estudiante o título del curso.
- Filtros combinables por carrera, semestre, estado, nivel, estudiante o curso.
- Paginación y ordenamiento de resultados.
- Respuestas estructuradas con `items` y `meta` para las consultas paginadas.
- Validación de parámetros inválidos.
- Control de matrículas duplicadas y estudiantes inactivos.
- Configuración mediante variables de entorno.
- Validación de la configuración al iniciar la aplicación.
- Registro de usuarios mediante correo electrónico y contraseña.
- Inicio de sesión mediante correo electrónico y contraseña.
- Validación y normalización del correo electrónico.
- Hash de contraseñas mediante bcrypt antes de almacenarlas.
- Verificación de contraseñas mediante `bcrypt.compare`.
- Prevención del registro de correos duplicados.
- Respuestas de autenticación que no exponen el hash de la contraseña.
- Emisión de tokens JWT al iniciar sesión correctamente.
- Validación de tokens JWT mediante una estrategia de Passport y un guard de autenticación reutilizable.
- Consulta de los datos públicos del usuario autenticado.
- Protección de todas las rutas de matrículas mediante autenticación JWT.
- Registro y inicio de sesión como rutas públicas; respuestas `401 Unauthorized` ante tokens ausentes, alterados o expirados.
- Roles de usuario (`admin`, `teacher` y `student`), con `student` como rol predeterminado.
- Inclusión del rol en el payload del JWT.
- Autorización por rol mediante el decorador `@Roles()` y `RolesGuard`.
- Control de propiedad de los cursos mediante `createdByUserId`.
- Respuestas `403 Forbidden` cuando la identidad es válida pero no tiene permiso.
- CORS configurado con un origen explícito (`http://localhost:5173` en desarrollo).
- Limitación de solicitudes: 20 por minuto de forma global y 5 por minuto en `POST /auth/login`, con respuesta `429 Too Many Requests`.
- Requisito documentado de HTTPS/TLS y de gestión de secretos fuera del repositorio para producción.
- Registro de cada solicitud (identificador, método, ruta, estado y duración) mediante un middleware, sin datos sensibles.
- Respuestas de error con una forma uniforme mediante un filter global; los errores inesperados no exponen detalles internos.
- Medición del tiempo de respuesta de cada operación mediante un interceptor (`X-Response-Time`).
- Validación de parámetros numéricos mediante `ParseIntPipe` (`400` ante un `id` no numérico).
- Caso de uso `UpdateCourseUseCase` con la regla de propiedad, separado del controlador y de TypeORM.
- Contrato de repositorio pequeño (`CourseRepository`) y adaptador `TypeOrmCourseRepository`, conectados con `provide` y `useClass`.
- Pruebas unitarias con Jest del caso de uso `UpdateCourseUseCase` con un repositorio simulado (éxito, recurso inexistente y rechazo por regla), con la forma Arrange - Act - Assert.
- Pruebas del controlador de cursos (delegación del identificador, del DTO y de la identidad autenticada, y propagación de errores), de `RolesGuard` y de `CoursesService`.
- Informe de cobertura con Jest (`npm run test:cov`) para localizar ramas sin ejercitar.

## Arquitectura

El proyecto utiliza la arquitectura modular de NestJS.

```text
Cliente HTTP (Thunder Client)
         |
         v
    Controller
         |
         v
      Service
         |
         v
 Repository / TypeORM
         |
         v
     PostgreSQL
```

Los controladores reciben las solicitudes HTTP, los servicios implementan la lógica de negocio y los repositorios de TypeORM permiten consultar y modificar los datos almacenados en PostgreSQL.

### Flujo de una solicitud

Por ejemplo, al crear una matrícula:

```text
POST /enrollments
       |
       v
JwtAuthGuard
       |
       ├── JwtStrategy extrae el token Bearer
       ├── Verifica la firma y la expiración
       ├── validate(payload) deja la identidad del usuario en req.user
       |
       v
EnrollmentsController
       |
       v
EnrollmentsService
       |
       ├── Verifica que el estudiante exista
       ├── Verifica que el estudiante esté activo
       ├── Verifica que el curso exista
       ├── Comprueba que no exista una matrícula duplicada
       |
       v
TypeORM Repository
       |
       v
PostgreSQL
```

El guard valida la autenticación antes de permitir el acceso al controlador; si el token falta o no es válido, la petición termina con `401 Unauthorized` y el método del controlador no se ejecuta. Después, el servicio de matrículas aplica las validaciones y reglas de negocio correspondientes.

En el registro de usuarios, el flujo incluye la validación de los datos, la comprobación del correo electrónico, el hash de la contraseña y la persistencia del nuevo usuario. En el inicio de sesión, se recupera expresamente el hash y se compara con la contraseña recibida mediante bcrypt. Si las credenciales son correctas, se emite un token JWT firmado.

### Flujo de una operación con autorización por rol

Desde la Semana 10, las rutas de escritura de cursos añaden una capa de autorización. Por ejemplo, al eliminar un curso:

```text
DELETE /courses/:id
       |
       v
JwtAuthGuard ──── sin token válido ──> 401 Unauthorized
       |
       v
RolesGuard ────── rol no permitido ──> 403 Forbidden
       |
       v
CoursesController
       |
       v
CoursesService (reglas de propiedad cuando corresponden)
       |
       v
TypeORM Repository
       |
       v
PostgreSQL
```

El orden es relevante: primero la identidad (`JwtAuthGuard`) y después el permiso (`RolesGuard`). Las reglas que dependen del recurso concreto, como la propiedad de un curso, se comprueban en el servicio.

## Estructura del proyecto

La siguiente estructura resume los módulos principales. Es orientativa y debe mantenerse sincronizada con los archivos que existan realmente en el repositorio.

```text
src/
├── auth/
│   ├── decorators/
│   │   └── roles.decorator.ts
│   ├── dto/
│   │   ├── register.dto.ts
│   │   └── login.dto.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   ├── roles.guard.ts
│   │   └── roles.guard.spec.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   ├── types/
│   │   └── jwt-payload.type.ts
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── auth.controller.spec.ts
│   └── auth.service.spec.ts
│
├── common/
│   ├── filters/
│   │   ├── http-error.filter.ts
│   │   └── http-error.filter.spec.ts
│   ├── interceptors/
│   │   ├── timing.interceptor.ts
│   │   └── timing.interceptor.spec.ts
│   └── middleware/
│       ├── request-logger.middleware.ts
│       └── request-logger.middleware.spec.ts
│
├── users/
│   ├── entities/
│   │   └── user.entity.ts
│   ├── user-role.enum.ts
│   ├── users.module.ts
│   ├── users.service.ts
│   └── users.service.spec.ts
│
├── courses/
│   ├── domain/
│   │   └── course.repository.ts
│   ├── dto/
│   ├── entities/
│   ├── infrastructure/
│   │   ├── typeorm-course.repository.ts
│   │   └── typeorm-course.repository.spec.ts
│   ├── use-cases/
│   │   ├── update-course.use-case.ts
│   │   └── update-course.use-case.spec.ts
│   ├── courses.controller.ts
│   ├── courses.module.ts
│   └── courses.service.ts
│
├── students/
│   ├── dto/
│   ├── entities/
│   ├── pipes/
│   ├── students.controller.ts
│   ├── students.module.ts
│   └── students.service.ts
│
├── enrollments/
│   ├── dto/
│   ├── entities/
│   ├── enrollments.controller.ts
│   ├── enrollments.module.ts
│   └── enrollments.service.ts
│
├── app.module.ts
└── main.ts

evidencias/
├── actuacion1/
├── actuacion2/
├── actuacion3/
├── actuacion4/
├── actuacion5/
├── actuacion6/
├── actuacion7/
├── actuacion8/
├── actuacion9/
├── actuacion10/
├── actuacion11/
├── actuacion12/
├── actuacion13/
├── actuacion14/
└── actuacion15/

test/
├── helpers/
│   └── test-app.ts
├── setup-env.ts
├── app.e2e-spec.ts
├── auth.e2e-spec.ts
└── courses.e2e-spec.ts

.github/
└── workflows/
    └── quality.yml

.env
.env.example
.env.test.example
.gitignore
jest.config.ts
jest.config.e2e.ts
tsconfig.e2e.json
package.json
README.md
```

La estructura es orientativa; se deben conservar los nombres y archivos que existan realmente en el repositorio. Las ubicaciones de `roles.decorator.ts`, `roles.guard.ts` y `user-role.enum.ts` deben confirmarse contra el repositorio.

## Instalación y configuración

### 1. Requisitos previos

Antes de ejecutar el proyecto, se necesita:

- Node.js y npm.
- PostgreSQL instalado y ejecutándose.
- Una base de datos para CourseHub.
- Un cliente HTTP, como Thunder Client, para probar los endpoints.

### 2. Instalar dependencias

Desde la carpeta raíz del proyecto:

```bash
npm install
```

Las dependencias de autenticación (`@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt` y `@types/passport-jwt`) ya están declaradas en `package.json`. Solo si se parte de un proyecto sin ellas:

```bash
npm i @nestjs/jwt @nestjs/passport passport passport-jwt
npm i -D @types/passport-jwt
```

### 3. Crear la base de datos

En PostgreSQL, crear una base de datos para el proyecto. El nombre utilizado en los ejemplos es `coursehub`.

Si se utiliza otro nombre, debe configurarse en las variables de entorno.

### 4. Configurar las variables de entorno

El repositorio incluye un archivo `.env.example` como plantilla de configuración.

En PowerShell, si todavía no existe un archivo `.env`, ejecutar:

```powershell
Copy-Item .env.example .env
```

Si `.env` ya existe, conservarlo para no sobrescribir las credenciales locales.

Configurar los valores correspondientes al entorno local:

```env
NODE_ENV=development
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=coursehub
DATABASE_USER=postgres
DATABASE_PASSWORD=tu_password_local
JWT_SECRET=replace-with-a-long-random-local-secret
JWT_EXPIRES_IN=15m
```

El valor `tu_password_local` es ilustrativo y debe sustituirse por la contraseña local de PostgreSQL.

**Importante:** no publicar el archivo `.env` cuando contiene credenciales reales. El archivo que se comparte en el repositorio es `.env.example`, sin secretos personales.

`JWT_SECRET` debe ser un valor largo y aleatorio generado localmente, por ejemplo con:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

El texto de `.env.example` es solo una plantilla y no debe usarse como secreto efectivo. Al comprimir o compartir el proyecto, se debe excluir el archivo `.env`.

### 5. Ejecutar la API

Modo desarrollo:

```bash
npm run start:dev
```

Modo normal:

```bash
npm run start
```

Modo producción:

```bash
npm run start:prod
```

Con el puerto de ejemplo, la dirección base de la API es:

```text
http://localhost:3000
```

Si se configura otro puerto mediante `PORT`, se debe utilizar ese puerto en las solicitudes HTTP.

## Semana 7: configuración y variables de entorno

Durante la Semana 7 se trabajó en la configuración de CourseHub API para evitar valores de conexión escritos directamente en el código, validar las variables necesarias y adaptar la configuración de TypeORM al ambiente de ejecución.

### 1. Variables de entorno

| Variable | Descripción | Valor de ejemplo |
|---|---|---|
| `NODE_ENV` | Ambiente de ejecución | `development` |
| `PORT` | Puerto HTTP de la API | `3000` |
| `DATABASE_HOST` | Servidor de PostgreSQL | `localhost` |
| `DATABASE_PORT` | Puerto de PostgreSQL | `5432` |
| `DATABASE_NAME` | Nombre de la base de datos | `coursehub` |
| `DATABASE_USER` | Usuario de PostgreSQL | `postgres` |
| `DATABASE_PASSWORD` | Contraseña de PostgreSQL | Configurada localmente |
| `JWT_SECRET` | Secreto para firmar tokens JWT; mínimo 32 caracteres | Secreto aleatorio local, nunca publicar |
| `JWT_EXPIRES_IN` | Duración del token de acceso | `15m` |

### 2. Configuración mediante ConfigModule

Se utiliza `ConfigModule` de `@nestjs/config` para cargar las variables de entorno y permitir que los módulos accedan a ellas mediante `ConfigService`.

La configuración se establece como global para evitar importar `ConfigModule` en cada módulo.

### 3. Validación mediante Joi

Joi permite definir las reglas de validación de las variables de entorno al iniciar la aplicación.

Las validaciones incluyen:

- `NODE_ENV` solo admite `development`, `test` o `production`.
- `PORT` debe corresponder a un puerto válido.
- `DATABASE_HOST` es obligatorio.
- `DATABASE_PORT` debe corresponder a un puerto válido.
- `DATABASE_USER` es obligatorio.
- `DATABASE_PASSWORD` es obligatorio.
- `DATABASE_NAME` es obligatorio.
- `JWT_SECRET` es obligatorio y debe tener al menos 32 caracteres.
- `JWT_EXPIRES_IN` define la vigencia del token y usa `15m` por defecto.

Si una variable no cumple las reglas establecidas, la aplicación informa un error de configuración durante el inicio.

### 4. ConfigService y conexión a PostgreSQL

La conexión se configura mediante `TypeOrmModule.forRootAsync` y `ConfigService`. Este mecanismo obtiene los parámetros de conexión desde las variables de entorno, evitando escribir las credenciales directamente en `app.module.ts`.

La opción `autoLoadEntities` permite registrar las entidades asociadas a los módulos de TypeORM que las utilizan.

### 5. Política de synchronize por ambiente

La configuración de TypeORM utiliza la siguiente condición:

```typescript
synchronize: environment === 'development'
```

| Ambiente | Valor de `synchronize` |
|---|---|
| `development` | `true` |
| `test` | `false` |
| `production` | `false` |

No se recomienda utilizar `synchronize: true` en producción. Para entornos que requieren control explícito de los cambios del esquema, se deben utilizar migraciones.

### 6. Validaciones globales de solicitudes HTTP

La aplicación configura `ValidationPipe` con las siguientes opciones:

- `whitelist`: elimina las propiedades que no están declaradas en los DTOs.
- `forbidNonWhitelisted`: rechaza solicitudes que incluyen propiedades no permitidas.
- `transform`: permite transformar los valores de entrada según las reglas definidas.

Estas opciones complementan la validación de los datos y parámetros de los endpoints.

### 7. Archivos de configuración

- `.env`: configuración local de la aplicación.
- `.env.example`: plantilla con variables de ejemplo, incluidas `JWT_SECRET` y `JWT_EXPIRES_IN`.
- `.gitignore`: excluye el archivo `.env` y otros archivos locales.
- `src/app.module.ts`: configuración de módulos, Joi y TypeORM.
- `src/main.ts`: configuración de validaciones globales y puerto HTTP.

## Semana 8: usuarios y autenticación inicial

Durante la Semana 8, correspondiente al avance de la Etapa 3, se amplió el módulo de cuentas de CourseHub API. Se incorporó el registro y el inicio de sesión mediante correo electrónico y contraseña.

La implementación utiliza NestJS, TypeScript, PostgreSQL, TypeORM y bcrypt. Los módulos `users` y `auth` mantienen separadas la administración de las cuentas y la lógica de autenticación de los módulos académicos.

### 1. Módulo users

El módulo `users` administra las cuentas almacenadas en PostgreSQL.

Archivos principales:

- `src/users/entities/user.entity.ts`
- `src/users/users.module.ts`
- `src/users/users.service.ts`

La entidad `User` contiene los siguientes campos (el campo `role` se incorporó posteriormente, en la Semana 10):

| Campo | Descripción |
|---|---|
| `id` | Identificador generado automáticamente |
| `email` | Correo electrónico único |
| `passwordHash` | Hash de la contraseña |
| `createdAt` | Fecha de creación de la cuenta |

El correo electrónico cuenta con una restricción de unicidad para evitar cuentas duplicadas. La propiedad `passwordHash` utiliza `select: false` para impedir que TypeORM la incluya automáticamente en las consultas ordinarias.

Cuando se necesitan verificar las credenciales durante el inicio de sesión, el servicio recupera expresamente el hash almacenado.

### 2. Módulo auth

El módulo `auth` contiene los controladores, servicios y DTOs relacionados con el registro y el inicio de sesión.

Archivos principales:

- `src/auth/auth.controller.ts`
- `src/auth/auth.service.ts`
- `src/auth/auth.module.ts`
- `src/auth/dto/register.dto.ts`
- `src/auth/dto/login.dto.ts`

El módulo utiliza `UsersService` para consultar y registrar cuentas.

### 3. Registro de usuarios

**Endpoint:** `POST /auth/register`

Permite crear una cuenta mediante correo electrónico y contraseña.

Ejemplo de solicitud:

```http
POST /auth/register
Content-Type: application/json
```

```json
{
  "email": "ana@example.com",
  "password": "ClaveSegura123"
}
```

El ejemplo es ilustrativo. Para repetir la prueba se debe utilizar un correo que no esté registrado previamente.

El DTO `RegisterDto` valida los datos de entrada. Las reglas documentadas incluyen:

- Validación del formato del correo electrónico.
- Normalización del correo a minúsculas y eliminación de espacios externos.
- Validación de la contraseña como cadena de texto.
- Longitud de la contraseña entre 8 y 72 caracteres.
- Rechazo de propiedades no permitidas mediante el `ValidationPipe` global.

Cuando el registro se realiza correctamente, la API responde con `201 Created`.

Ejemplo de respuesta:

```json
{
  "id": 1,
  "email": "ana@example.com",
  "createdAt": "2026-10-19T19:46:24.803Z"
}
```

Los valores son ilustrativos. La respuesta no debe incluir la contraseña ni `passwordHash`.

### 4. Hash de contraseñas con bcrypt

Antes de guardar una cuenta, el servicio transforma la contraseña en un hash mediante bcrypt con un factor de costo de 12:

```typescript
const passwordHash = await bcrypt.hash(dto.password, 12);
```

El hash se almacena en la columna `passwordHash`. La contraseña original no se guarda en texto plano.

En las comprobaciones realizadas en PostgreSQL se observó el prefijo `$2` y una longitud de 60 caracteres para los hashes consultados.

### 5. Prevención de correos duplicados

Antes de registrar una cuenta, el servicio comprueba si el correo ya está registrado.

Además, PostgreSQL aplica una restricción de unicidad que protege la integridad de los datos. Esta protección complementa la comprobación del servicio y permite manejar violaciones de unicidad, incluido el código `23505`.

Cuando se intenta registrar un correo existente, la API responde con `409 Conflict`.

Ejemplo de respuesta:

```json
{
  "message": "El correo ya está registrado",
  "error": "Conflict",
  "statusCode": 409
}
```

### 6. Inicio de sesión

**Endpoint:** `POST /auth/login`

El inicio de sesión permite verificar las credenciales de una cuenta existente.

Ejemplo de solicitud:

```http
POST /auth/login
Content-Type: application/json
```

```json
{
  "email": "ana@example.com",
  "password": "ClaveSegura123"
}
```

El DTO `LoginDto` valida el correo electrónico y la contraseña. La contraseña debe cumplir las reglas de longitud establecidas en esta implementación.

El flujo de autenticación es el siguiente:

1. Recibir y validar las credenciales.
2. Normalizar el correo electrónico.
3. Buscar al usuario y recuperar expresamente su hash.
4. Comparar la contraseña recibida con el hash mediante `bcrypt.compare`.
5. Devolver los datos públicos del usuario si las credenciales son correctas.
6. Rechazar las credenciales incorrectas mediante `401 Unauthorized`.

La respuesta de inicio de sesión no debe exponer `passwordHash`.

Cuando el usuario no existe o la contraseña es incorrecta, el servicio utiliza un error de autenticación que no revela cuál de las dos comprobaciones falló.

### 7. Respuestas HTTP de autenticación

| Situación | Código HTTP | Descripción |
|---|---|---|
| Registro exitoso | `201 Created` | Se creó la cuenta |
| Inicio de sesión exitoso | `200 OK` | Las credenciales fueron aceptadas |
| Datos inválidos | `400 Bad Request` | Falló una validación |
| Credenciales incorrectas | `401 Unauthorized` | No se pudo autenticar al usuario |
| Correo duplicado | `409 Conflict` | El correo ya está registrado |

Los códigos y mensajes definitivos deben coincidir con las respuestas reales obtenidas al probar los endpoints.

### 8. Verificación en PostgreSQL

La tabla `users` almacena el identificador, el correo, el hash de la contraseña y la fecha de creación (y, desde la Semana 10, el rol).

Para consultar los usuarios sin mostrar información sensible:

```sql
SELECT id, email, "createdAt"
FROM users
ORDER BY id;
```

Para comprobar la existencia y la longitud del hash sin mostrarlo completo:

```sql
SELECT
    id,
    email,
    LEFT("passwordHash", 2) AS hash_inicio,
    LENGTH("passwordHash") AS longitud_hash
FROM users
WHERE email IN (
    'ana@example.com',
    'prueba.semana8@example.com'
);
```

Los correos utilizados en la consulta deben corresponder a usuarios existentes en la base de datos.

En las comprobaciones realizadas se observó el prefijo `$2` y una longitud de 60 caracteres para los hashes consultados.

Para consultar únicamente los usuarios y sus correos:

```sql
SELECT id, email
FROM users
ORDER BY id;
```

Esta última consulta permite comprobar los registros existentes sin mostrar hashes ni contraseñas.

### 9. Evidencias de la Semana 8 — Etapa 3

Las capturas de esta etapa se organizan en:

```text
evidencias/actuacion6/
```

La carpeta contiene las evidencias numeradas del 01 al 10, correspondientes a las comprobaciones realizadas durante la Semana 8. Los números 02 y 10 agrupan varias capturas.

Las capturas documentan las pruebas de los módulos de usuarios y autenticación, el registro, las validaciones, el inicio de sesión y la persistencia en PostgreSQL, según el contenido real de cada archivo.

Se deben conservar los nombres existentes de las capturas y relacionar cada una con la prueba que realmente muestra.

### 10. Alcance de la Semana 8

El alcance de esta etapa comprende:

- Registro de usuarios.
- Inicio de sesión.
- Validación de datos mediante DTOs.
- Normalización del correo electrónico.
- Hash de contraseñas mediante bcrypt.
- Verificación de contraseñas mediante `bcrypt.compare`.
- Persistencia de cuentas en PostgreSQL.
- Restricción de unicidad del correo.
- Respuestas que no exponen el hash de la contraseña.
- Manejo de credenciales incorrectas mediante `401 Unauthorized`.

En la Semana 8 se implementaron el registro y el inicio de sesión inicial. Posteriormente, en la Semana 9, se incorporaron la emisión y validación de tokens JWT, el guard de autenticación y la protección de rutas. Estos avances se describen en la siguiente sección.

## Semana 9: autenticación con JWT

Período de trabajo: Semana 9 (26 de octubre al 1 de noviembre de 2026), avance de la Etapa 3.

**Resultado de aprendizaje:** emitir un token de acceso JWT después de un inicio de sesión válido, verificarlo en solicitudes posteriores y proteger rutas con un guard de NestJS.

Durante la Semana 9 se amplió la autenticación de CourseHub API para emitir tokens JWT después de verificar correctamente las credenciales, validar los tokens recibidos en las solicitudes HTTP y proteger determinadas rutas mediante un guard de autenticación.

La implementación combina dos piezas complementarias: `@nestjs/jwt` firma los tokens al iniciar sesión, y `@nestjs/passport` con `passport-jwt` los extrae y verifica en cada solicitud protegida. La configuración se centraliza mediante `ConfigService`.

> **Nota:** esta sección describe el estado de la Semana 9. Desde la Semana 10 el payload del JWT incluye además el rol del usuario (véase [Semana 10](#semana-10-roles-permisos-y-propiedad-de-recursos-sesión-19)).

### 1. Variables de entorno

Se agregaron estas variables a `.env` y a la plantilla `.env.example`:

```env
JWT_SECRET=replace-with-a-long-random-local-secret
JWT_EXPIRES_IN=15m
```

`JWT_SECRET` es obligatorio y debe tener al menos 32 caracteres. Debe utilizarse un secreto aleatorio y privado en el entorno local. No se debe escribir el secreto real en el README, subirlo a Git ni compartirlo en capturas.

`JWT_EXPIRES_IN` configura la vigencia del token y utiliza `15m` como valor predeterminado.

La configuración se valida con Joi durante el inicio de la aplicación. Si falta `JWT_SECRET`, la API termina el inicio con un error de validación, en lugar de arrancar con una configuración incompleta.

### 2. Firma y contenido del token

El módulo `auth` configura `JwtModule` de forma asíncrona mediante `ConfigService`. El servicio de autenticación firma el token únicamente después de comprobar la contraseña con `bcrypt.compare`.

El payload contiene los datos mínimos de identidad:

```json
{
  "sub": 2,
  "email": "prueba.semana8@example.com",
  "iat": 1793045712,
  "exp": 1793046612
}
```

Este es un ejemplo ilustrativo de la estructura del token. `sub` identifica al usuario, `email` contiene su correo normalizado, `iat` representa el momento de emisión y `exp` el momento de expiración. Con `JWT_EXPIRES_IN=15m`, la diferencia entre `iat` y `exp` es de 900 segundos.

Los tipos `JwtPayload` (carga firmada: `sub` y `email`, más `iat` y `exp` opcionales) y `AuthenticatedUser` (identidad de la petición: `id` y `email`) se declaran en `src/auth/types/jwt-payload.type.ts`. La carga usa el nombre estándar `sub`; el resto de la aplicación trabaja con el nombre más claro `id`.

Un JWT firmado no está cifrado. Por ello, el payload no debe incluir contraseñas, `passwordHash`, secretos ni otros datos sensibles. El servicio pasa a `signAsync` un objeto explícito con `sub` y `email`, no la entidad TypeORM completa. Qué prueba la firma: que el token no fue alterado y que no ha expirado; no significa que el contenido del payload sea secreto.

### 3. Respuesta de inicio de sesión

`POST /auth/login` devuelve `200 OK` cuando las credenciales son válidas. La respuesta contiene `accessToken` y los datos públicos del usuario.

Ejemplo ilustrativo:

```json
{
  "accessToken": "<token-jwt-generado>",
  "user": {
    "id": 2,
    "email": "prueba.semana8@example.com",
    "createdAt": "2026-10-20T18:44:45.723Z"
  }
}
```

El valor `<token-jwt-generado>` es un marcador, no un token real. La respuesta no debe exponer la contraseña ni `passwordHash`.

Si el correo no existe o la contraseña es incorrecta, la API devuelve el mismo error genérico `401 Unauthorized` y no entrega un token. Los datos inválidos continúan respondiendo `400 Bad Request`.

**Contrato de `POST /auth/login`:**

| Elemento | Detalle |
|---|---|
| Entrada | JSON con `email` y `password` (`LoginDto`) |
| Salida correcta | `200 OK` con `accessToken` y `user` (`id`, `email`, `createdAt`) |
| Caducidad | Configurada con `JWT_EXPIRES_IN`; con `15m`, el token vive aproximadamente 15 minutos (900 segundos) |
| Credenciales incorrectas | `401 Unauthorized`, sin `accessToken` |
| Datos inválidos | `400 Bad Request` |

**Advertencia:** el `accessToken` es una credencial. No debe publicarse en el repositorio, en capturas públicas ni en chats de equipo. Si se expone, se debe esperar a su expiración o cambiar el secreto local para invalidarlo.

### 4. Estrategia JWT y guard de autenticación

Se incorporaron los archivos:

```text
src/auth/strategies/jwt.strategy.ts
src/auth/guards/jwt-auth.guard.ts
```

**`JwtStrategy`** extiende `PassportStrategy(Strategy, 'jwt')` y se configura con:

- `jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()`: acepta únicamente el esquema `Authorization: Bearer <token>`.
- `ignoreExpiration: false`: se respeta la caducidad firmada en el token.
- `secretOrKey`: obtenido con `configService.getOrThrow('JWT_SECRET')`, sin secretos escritos en el código.

Si la firma y la vigencia son correctas, se ejecuta `validate(payload)`. Este método comprueba que `sub` sea un entero positivo y que `email` sea una cadena; después devuelve `{ id, email }`, que Passport deja disponible en `req.user`. Si el payload no es válido, la solicitud se rechaza con `401`.

**`JwtAuthGuard`** extiende `AuthGuard('jwt')`, aplica la estrategia sobre una ruta y se reutiliza en `GET /auth/me` y en el controlador de matrículas. No duplica la lógica criptográfica: la verificación pertenece a la estrategia. Su método `handleRequest` convierte los fallos en respuestas `401 Unauthorized` con estos mensajes:

| Situación | Respuesta |
|---|---|
| Falta el encabezado `Authorization`, el esquema no es `Bearer` o el token está vacío | `401` — `Token de acceso requerido` |
| Token expirado | `401` — `Token expirado` |
| Token alterado, firmado con otro secreto o con payload inválido | `401` — `Token inválido o expirado` |

Los mensajes corresponden a la implementación actual del guard.

El formato esperado del encabezado HTTP es:

```http
Authorization: Bearer <token-jwt>
```

El marcador `<token-jwt>` debe sustituirse por el token obtenido mediante `POST /auth/login`.

**Integración en `AuthModule`:** importa `PassportModule.register({ defaultStrategy: 'jwt' })` y `JwtModule.registerAsync(...)`, registra `JwtStrategy` en `providers` y exporta `JwtModule` y `PassportModule` para que otros módulos, como `enrollments`, puedan usar el guard.

Recorrido de una solicitud protegida:

```text
GET /auth/me + Authorization: Bearer <token>
                 |
                 v
JwtAuthGuard pide la estrategia "jwt"
                 |
                 v
JwtStrategy extrae el token, verifica firma y revisa exp
                 |
                 v
validate(payload) crea { id, email } en req.user
                 |
                 v
El controlador recibe req.user y genera la respuesta
```

Si el token falla en cualquier paso, el guard responde `401` y el método del controlador no se ejecuta.

### 5. Endpoint de usuario autenticado

Se incorporó el endpoint:

**`GET /auth/me`**

Este endpoint utiliza `JwtAuthGuard` y permite consultar los datos públicos del usuario identificado mediante el token.

Para probarlo, primero se debe iniciar sesión con `POST /auth/login` y copiar el `accessToken` recibido.

En Thunder Client, configurar la solicitud:

```http
GET /auth/me
Authorization: Bearer <token-jwt>
```

Con un token válido, la API responde `200 OK` con los datos públicos del usuario autenticado:

```json
{
  "id": 2,
  "email": "prueba.semana8@example.com",
  "createdAt": "2026-10-20T18:44:45.723Z"
}
```

Los valores son ilustrativos. A partir de la identidad que deja la estrategia en `req.user`, el controlador consulta al usuario mediante `UsersService.findById`. Si la cuenta ya no existe o su correo no coincide con el del token, responde `401 Unauthorized` con el mensaje `Usuario no válido`.

La respuesta no incluye la contraseña ni el campo `passwordHash`.

Los casos de autenticación del endpoint son:

| Prueba | Encabezado | Resultado |
|---|---|---|
| Token vigente | `Bearer <token válido>` | `200 OK` |
| Sin encabezado | Ninguno | `401 Unauthorized` |
| Esquema erróneo | `Token <token>` | `401 Unauthorized` |
| Token alterado | Un carácter modificado | `401 Unauthorized` |
| Token expirado | Token que superó `exp` | `401 Unauthorized` |

### 6. Protección de las rutas de matrículas

`EnrollmentsController` aplica `@UseGuards(JwtAuthGuard)` a nivel de clase. Por ello, todas las rutas de matrículas exigen un JWT válido y reutilizan el mismo guard de `GET /auth/me`:

| Método | Ruta | Requiere JWT |
|---|---|---|
| `POST` | `/enrollments` | Sí |
| `GET` | `/enrollments` | Sí |
| `GET` | `/students/:studentId/enrollments` | Sí |
| `GET` | `/courses/:courseId/enrollments` | Sí |
| `DELETE` | `/enrollments/:id` | Sí |

La ruta de negocio utilizada para la demostración es `POST /enrollments`. La solicitud debe incluir el encabezado:

```http
Authorization: Bearer <token-jwt>
Content-Type: application/json
```

Ejemplo de cuerpo:

```json
{
  "studentId": 1,
  "courseId": 1
}
```

El DTO `CreateEnrollmentDto` valida que `studentId` y `courseId` sean números enteros positivos.

La protección de la ruta no reemplaza las validaciones ni las reglas de negocio existentes. Una solicitud autenticada debe cumplir las condiciones del módulo de matrículas:

1. El estudiante debe existir.
2. El estudiante debe estar activo.
3. El curso debe existir.
4. No debe existir una matrícula duplicada para el mismo estudiante y curso.
5. Los identificadores deben cumplir las validaciones del DTO.

Las pruebas realizadas comprobaron que una solicitud sin token recibe `401 Unauthorized` y no crea un registro en PostgreSQL.

También se comprobó que una solicitud autenticada con un `studentId` negativo recibe `400 Bad Request` y que intentar crear una matrícula duplicada recibe `409 Conflict`. Esto muestra que autenticación y validación son capas distintas.

Los endpoints de estudiantes y cursos no se modificaron en la Semana 9 y seguían sin exigir autenticación. Las rutas de escritura de cursos se protegieron posteriormente, en la Semana 10 (véase [Rutas públicas y protegidas](#11-rutas-públicas-y-protegidas)).

### 7. Pruebas realizadas

| Prueba | Resultado comprobado |
|---|---|
| Inicio de sesión correcto | `200 OK` y emisión del JWT |
| Credenciales incorrectas | `401 Unauthorized` |
| Usuario sin `passwordHash` en la respuesta | No se expone el hash |
| Payload del JWT | Contiene `sub`, `email`, `iat` y `exp` |
| Falta de `JWT_SECRET` | La configuración impide iniciar la aplicación |
| Cambio del secreto de firma | Un token firmado con otro secreto no se valida con el secreto actual |
| `GET /auth/me` con token válido | `200 OK` |
| `GET /auth/me` sin token | `401 Unauthorized` |
| `GET /auth/me` con token alterado | `401 Unauthorized` |
| `POST /enrollments` sin token | `401 Unauthorized` |
| Verificación posterior en PostgreSQL | No se produjo una inserción por la solicitud no autenticada |
| Matrícula con identificador negativo | `400 Bad Request` |
| Matrícula duplicada | `409 Conflict` |

Las respuestas indicadas corresponden a las pruebas realizadas durante el avance. Para reproducirlas, se deben utilizar los datos y las credenciales configurados en el entorno local.

### 8. Evidencias de la Semana 9

Las capturas se organizan en tres carpetas:

| Carpeta | Contenido |
|---|---|
| `evidencias/actuacion7/` | Emisión del token y configuración segura (`JWT_SECRET`, payload) |
| `evidencias/actuacion8/` | Implementación de Passport, estrategia, guard y módulo; primeras pruebas de matrículas |
| `evidencias/actuacion9/` | Verificación final: `GET /auth/me`, rutas protegidas, reglas de negocio y base de datos |

**`evidencias/actuacion7/`**

| Archivo | Comprobación |
|---|---|
| `01. Login correcto con JWT.png` | Inicio de sesión correcto con `accessToken` y datos públicos del usuario |
| `02. Credenciales incorrectas sin token.png` | Rechazo de credenciales incorrectas con `401 Unauthorized` |
| `03. Usuario sin passwordHash.png` | Respuesta sin el hash de contraseña |
| `04. Payload JWT inspeccionado.png` | Payload con `sub`, `email`, `iat` y `exp` |
| `05. Validacion JWT_SECRET requerido.png` | Validación de `JWT_SECRET` |
| `06. Aplicacion no inicia sin JWT_SECRET.png` | La aplicación no inicia si falta el secreto |
| `06. Prerequisito aplicacion no inicia sin JWT_SECRET.png` | Captura complementaria del caso de configuración |
| `06. Restauracion del archivo .env.png` | Restauración de la configuración local después de la prueba negativa |
| `07. Token anterior con secreto cambiado.png` | Comprobación de que un token no se valida con otro secreto |

**`evidencias/actuacion8/`**

| Archivo | Comprobación |
|---|---|
| `01. Dependencias Passport instaladas.png` | Dependencias de Passport instaladas |
| `02. Tipo JwtPayload y AuthenticatedUser.png` | Tipos de la carga firmada y de la identidad de la petición |
| `03. JwtStrategy configurada.png` | Configuración de `JwtStrategy` |
| `04. JwtAuthGuard con Passport.png` | `JwtAuthGuard` basado en `AuthGuard('jwt')` |
| `05. AuthModule configurado con Passport.png` | Integración de Passport y la estrategia en `AuthModule` |
| `06. Aplicacion inicia correctamente con Passport.png` | La aplicación inicia con la nueva configuración |
| `07. Auth me con Bearer valido-Obtén un token.png` | Obtención del token mediante el inicio de sesión |
| `07. Auth me con Bearer valido-Consulta tu usuario.png` | Consulta de `GET /auth/me` con el token |
| `08. Matriculas con token valido.png` | Acceso a matrículas con token válido |
| `08. Matrículas sin token.png` | Rechazo de matrículas sin token |

**`evidencias/actuacion9/`**

| Archivo | Comprobación |
|---|---|
| `01. Variables JWT en ejemplo.png` | Variables JWT en la plantilla `.env.example` |
| `02. Login y payload JWT.png` | Inicio de sesión y estructura del payload |
| `03. Auth me con Bearer valido.png` | Consulta del usuario autenticado con token válido |
| `04. Auth me sin token.png` | Rechazo de solicitud sin token |
| `05. Auth me con token alterado.png` | Rechazo de token alterado |
| `06. Matricula sin token.png` | Rechazo de creación de matrícula sin autenticación |
| `07. Token expirado.png` | Rechazo de un token expirado |
| `08. Verificar que no hubo insercion.png` | La solicitud no autenticada no insertó una matrícula |
| `09. DTO rechaza datos invalidos.png` | Validación de identificadores de matrícula inválidos |
| `10. Regla de negocio matricula primera Thunder Client.png` | Primera matrícula creada con token válido |
| `11. Regla de negocio matricula duplicada Thunder Client.png` | Rechazo de la matrícula duplicada con `409 Conflict` |
| `12. Regla de negocio matricula duplicada PgAdmin.png` | Verificación en PostgreSQL de la regla de matrícula duplicada |

Antes de entregar las capturas, se deben ocultar las contraseñas, los secretos y los tokens completos. Para mostrar el contenido del payload basta con presentar sus campos relevantes: `sub`, `email`, `iat` y `exp`.

La prueba de cambio de secreto demuestra que un token firmado con otro secreto no se valida con la configuración actual. La protección de las rutas se comprueba separadamente mediante las solicitudes a `GET /auth/me` y `POST /enrollments`.

### 9. Archivos relacionados con la implementación

Los archivos principales relacionados con la autenticación JWT son:

- `src/auth/strategies/jwt.strategy.ts`: extracción y verificación del token Bearer; construcción de `req.user`.
- `src/auth/guards/jwt-auth.guard.ts`: guard reutilizable basado en `AuthGuard('jwt')`, con respuestas `401` controladas.
- `src/auth/types/jwt-payload.type.ts`: tipos `JwtPayload` y `AuthenticatedUser`.
- `src/auth/auth.controller.ts`: endpoints de autenticación, incluido `GET /auth/me`.
- `src/auth/auth.service.ts`: registro, inicio de sesión y emisión del token.
- `src/auth/auth.module.ts`: `PassportModule`, `JwtModule.registerAsync` y registro de `JwtStrategy`.
- `src/users/users.service.ts`: consulta de las cuentas, incluida `findById` para `GET /auth/me`.
- `src/enrollments/enrollments.controller.ts`: protección de las rutas de matrículas con `JwtAuthGuard`.
- `src/enrollments/enrollments.module.ts`: importación del módulo de autenticación.
- `src/enrollments/dto/create-enrollment.dto.ts`: validación de los identificadores de la matrícula.
- `src/app.module.ts`: configuración general de la aplicación, esquema Joi con `JWT_SECRET` y `JWT_EXPIRES_IN`.
- `src/main.ts`: configuración de validaciones globales.
- `.env.example`: plantilla con los nombres de las variables JWT, sin secretos reales.

Los nombres deben mantenerse sincronizados con los archivos que existan realmente en el repositorio.

### 10. Alcance final de la Semana 9

Esta etapa incorpora:

- Emisión de tokens JWT después de un inicio de sesión válido.
- Configuración y validación de `JWT_SECRET`.
- Configuración de expiración mediante `JWT_EXPIRES_IN`.
- Estrategia `JwtStrategy` que extrae el token Bearer y respeta la expiración.
- Verificación de tokens mediante `JwtAuthGuard`.
- Identidad segura en `req.user`.
- Consulta del usuario autenticado mediante `GET /auth/me`.
- Protección de las rutas de matrículas, incluida `POST /enrollments`.
- Registro y login como rutas públicas.
- Rechazo de solicitudes sin token, con esquema distinto de Bearer, alteradas o expiradas.
- Validación de identificadores de matrícula mediante DTOs.
- Conservación de las reglas de negocio de las matrículas.
- Comprobación de que las solicitudes no autenticadas no crean matrículas.

**Fuera del alcance de la semana:** roles y permisos, respuestas `403 Forbidden`, decoradores personalizados como `@CurrentUser()`, refresh tokens, cierre de sesión con lista de revocación, recuperación de cuenta y OAuth. Una identidad ausente o inválida produce `401`; una identidad válida sin el permiso requerido produce `403`, escenario que se implementó en la Semana 10.

Con JWT, cualquier usuario autenticado puede usar las rutas protegidas. Tener un token válido prueba la identidad, no el permiso para realizar cualquier operación.

### 11. Rutas públicas y protegidas

Estado vigente de las rutas (actualizado en la Semana 10):

| Ruta | Acceso |
|---|---|
| `POST /auth/register` | Pública |
| `POST /auth/login` | Pública |
| `GET /auth/me` | Requiere JWT |
| `POST /enrollments`, `GET /enrollments`, `DELETE /enrollments/:id` | Requiere JWT |
| `GET /students/:studentId/enrollments` | Requiere JWT |
| `GET /courses/:courseId/enrollments` | Requiere JWT |
| `/students` y `/students/:id` (consulta, creación, actualización y eliminación) | Pública |
| `GET /courses` y `GET /courses/:id` | Consulta sin restricción por rol |
| `POST /courses` | Requiere JWT; rol `teacher` o `admin` |
| `PATCH /courses/:id` | Requiere JWT; `admin` o `teacher` propietario del curso |
| `DELETE /courses/:id` | Requiere JWT; solo `admin` |
| `GET /` y `GET /welcome` | Pública |

Registro y login permanecen públicos; de otro modo no sería posible obtener una cuenta ni un token. El guard se aplica de forma explícita con `@UseGuards`, no de manera global.

**Justificaciones:**

- Las matrículas relacionan estudiantes con cursos y modifican el estado académico, por lo que se decidió exigir autenticación en todo su controlador.
- En la Semana 9 los módulos de estudiantes y cursos se mantuvieron sin cambios para no alterar los contratos de las etapas anteriores. En la Semana 10 se protegieron las rutas de escritura de cursos mediante roles y propiedad; el módulo de estudiantes continúa sin exigir autenticación.

### 12. Demostración reproducible

Secuencia de hasta diez minutos para comprobar la semana:

1. Iniciar la aplicación con `npm run start:dev` sin mostrar secretos y señalar en `.env.example` los nombres `JWT_SECRET` y `JWT_EXPIRES_IN`.
2. Registrar una cuenta de práctica con `POST /auth/register` o usar una existente.
3. Iniciar sesión con `POST /auth/login` y explicar qué contiene el payload (`sub`, `email`, `iat`, `exp`) sin mostrar el token completo en evidencia pública.
4. Consultar `GET /auth/me` con el encabezado Bearer y comprobar `200 OK`.
5. Repetir `GET /auth/me` sin encabezado y con un token alterado; ambos casos responden `401 Unauthorized`.
6. Invocar `POST /enrollments` sin token y verificar en PostgreSQL que no se creó ningún registro.
7. Repetir la solicitud con un token válido y comprobar que siguen aplicándose el DTO (`400 Bad Request` con `studentId` negativo) y las reglas de negocio (`409 Conflict` ante una matrícula duplicada).

Para comprobar el vencimiento, se puede cambiar temporalmente `JWT_EXPIRES_IN` a un valor corto en el `.env` local, reiniciar la API, iniciar sesión y esperar a que expire; al terminar se debe restaurar `15m`.

### 13. Lista de comprobación antes del commit

| Pregunta | Debe cumplirse |
|---|---|
| ¿`.env`, `JWT_SECRET` o un token real aparecen en el diff? | No |
| ¿El payload se construye explícitamente y sin hash? | Sí |
| ¿El token expira? | Sí, con valor configurado |
| ¿`JwtStrategy` verifica firma y vencimiento (`ignoreExpiration: false`)? | Sí |
| ¿Una ruta privada se puede alcanzar sin token? | No |
| ¿Login y registro se pueden alcanzar sin token? | Sí |
| ¿Se usa `403` o roles antes de la Semana 10? | No |

Comprobaciones recomendadas:

```powershell
git check-ignore .env
git status
```

`git check-ignore .env` debe identificar `.env` como archivo ignorado, y `git status` no debe listar `.env` ni capturas con secretos o tokens completos.

### 14. Pruebas automatizadas (extensión opcional)

Los archivos `auth.service.spec.ts` y `auth.controller.spec.ts` contienen actualmente pruebas básicas de existencia generadas por la plantilla de NestJS. Como extensión opcional se proponen pruebas del servicio de autenticación: una de inicio de sesión correcto que confirme `accessToken`, y otra de contraseña incorrecta que espere `UnauthorizedException`. Estas pruebas deben usar un secreto ficticio controlado por el entorno de pruebas, nunca el secreto local de desarrollo.

## Semana 10: roles, permisos y propiedad de recursos (Sesión 19)

Período de trabajo: Semana 10 (2 al 8 de noviembre de 2026), Sesión 19.

**Resultado de aprendizaje:** autorizar acciones mediante roles y comprobar que una persona solo modifica los recursos sobre los que tiene permiso.

En la Semana 9 la API pasó a estar autenticada: un JWT válido prueba que la solicitud tiene una identidad. Sin embargo, no demuestra que esa identidad pueda eliminar un curso o modificar un recurso ajeno. En la Sesión 19 se añade la **autorización**: qué puede hacer cada identidad autenticada.

### 1. Autenticación y autorización

| Respuesta | Significado | Ejemplo |
|---|---|---|
| `401 Unauthorized` | No existe una identidad válida | Falta el token o su firma no es válida |
| `403 Forbidden` | La identidad existe, pero no tiene permiso | Un estudiante intenta crear o eliminar un curso |

### 2. Rol, permiso y propiedad

- **Rol:** agrupa responsabilidades generales (`admin`, `teacher` o `student`).
- **Permiso:** acción concreta sobre un recurso, como crear, actualizar o eliminar un curso.
- **Propiedad:** indica si el recurso pertenece a la identidad actual. Un docente puede tener permiso para editar cursos, pero solo los que creó.

El rol se evalúa en el guard. La propiedad se evalúa en el servicio, porque `RolesGuard` no puede saber quién creó un curso si no consulta ese curso.

### 3. Roles del sistema

| Rol | Valor almacenado | Descripción |
|---|---|---|
| `ADMIN` | `admin` | Administrador del sistema |
| `TEACHER` | `teacher` | Docente |
| `STUDENT` | `student` | Estudiante; rol predeterminado |

Los roles se modelan como una enumeración cerrada (`UserRole`), lo que evita valores ambiguos como `administrator`, `Admin` y `admin`. La entidad `User` incorpora el campo `role` con valor predeterminado `student`, el de menor privilegio: una cuenta nueva no recibe permisos de docente o administrador por accidente.

Los roles de práctica se asignaron de forma controlada en la base de datos local (véanse las evidencias `01`, `09` y `11`).

### 4. JWT con rol

La generación del token se actualizó para incluir el identificador del usuario, su correo y su rol:

```json
{
  "sub": 2,
  "email": "prueba.semana8@example.com",
  "role": "teacher",
  "iat": 1793045712,
  "exp": 1793046612
}
```

Los valores son ilustrativos. Con estos datos el sistema identifica al usuario autenticado y determina sus permisos. Se comprobó que el token emitido al iniciar sesión con la cuenta docente contiene `role: teacher`.

El token sigue sin contener contraseñas, `passwordHash` ni secretos.

### 5. Decorador `@Roles()` y `RolesGuard`

**`@Roles(...roles)`** es un decorador personalizado que guarda, mediante `SetMetadata`, los roles autorizados para una ruta. Por sí solo no concede ni deniega nada: deja escrita la política junto a la ruta.

**`RolesGuard`** lee esos metadatos con `Reflector` y compara el rol del usuario autenticado (`req.user`) con los roles permitidos. Si no cumple, la solicitud termina con `403 Forbidden`. Si la ruta no declara `@Roles()`, el guard no restringe por rol.

El guard supone que `JwtAuthGuard` ya verificó el token y dejó la identidad en `req.user`; por eso el orden es primero identidad y después permiso:

```typescript
@Delete(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
remove(@Param('id', ParseIntPipe) id: number) {
  return this.coursesService.remove(id);
}
```

Con esta política, un token ausente obtiene `401`, un token de estudiante válido obtiene `403` y un token de administrador válido continúa hacia el servicio.

### 6. Relación entre cursos y usuarios

La entidad `Course` incorpora el campo `createdByUserId`, que identifica al usuario que creó el curso. Su valor se obtiene del usuario autenticado y no de un identificador enviado en el cuerpo de la solicitud: si el cliente pudiera enviar el propietario, cualquier usuario podría atribuirse la propiedad de un curso ajeno.

### 7. Reglas de autorización de cursos

| Rol | Crear | Modificar | Eliminar |
|---|---|---|---|
| `student` | No | No | No |
| `teacher` | Sí | Solo sus propios cursos | No |
| `admin` | Sí | Cualquier curso, sin restricción de propiedad | Sí |

La eliminación de cursos está reservada para los administradores. Las restricciones de propiedad se aplican en `CoursesService` y los guards y decoradores en `CoursesController`. Un docente que intenta modificar un curso que creó otro usuario recibe `403 Forbidden`.

Ejemplo de la comprobación de propiedad en el servicio:

```typescript
const canManageAny = actor.role === UserRole.ADMIN;
const isOwner = course.createdByUserId === actor.id;

if (!canManageAny && !isOwner) {
  throw new ForbiddenException('You cannot modify this course');
}
```

El ejemplo muestra la lógica general de la sesión; el código definitivo está en `CoursesService`.

### 8. Cambio en los módulos

`CoursesModule` importa ahora `AuthModule`. Sin esa importación, Nest no podía resolver las dependencias de `JwtAuthGuard` en el controlador de cursos y la aplicación no iniciaba. Tras la corrección, el servidor inicia correctamente.

### 9. Pruebas realizadas

Las pruebas se realizaron con Thunder Client y pgAdmin. Las evidencias están en `evidencias/actuacion10/`.

| Prueba | Resultado documentado | Evidencia |
|---|---|---|
| Usuarios y roles en PostgreSQL, antes y después de asignar los roles de práctica | Se comprobaron los roles de las cuentas de prueba | `01` |
| Compilación con `npm run build` | Compilación correcta | `02` |
| Inicio del servidor | Servidor iniciado correctamente | `03` |
| Inicio de sesión como docente | `200 OK`; el JWT contiene `role: teacher` | `04` |
| Creación de un curso como docente | Curso creado con `createdByUserId` del docente | `05` |
| Inicio de sesión como estudiante y creación de un curso | Rechazo por falta de permiso (`403 Forbidden`) | `06` |
| Docente modifica su propio curso | Modificación permitida | `07` |
| Docente intenta modificar un curso de otro usuario | Rechazo (`403 Forbidden`) | `08` |
| Administrador elimina un curso temporal | Eliminación permitida (se cambió el rol de una cuenta a `admin` y se verificó en la base de datos) | `09` |
| Consultas `GET /courses` con paginación (página 1 y 2) y límites inferior y superior | Las consultas continúan funcionando | `10` |
| Cambio de rol de una cuenta de práctica y restauración del rol original | Roles de práctica restaurados al finalizar las pruebas | `11` |

Respuesta obtenida al crear un curso con la cuenta docente:

```json
{
  "id": 6,
  "title": "Curso de prueba docente",
  "level": "beginner",
  "createdByUserId": 2
}
```

Respuesta obtenida en la página 2 de `GET /courses?page=2&limit=5&sortBy=id&order=ASC` (`200 OK`):

```json
{
  "items": [
    {
      "id": 6,
      "title": "Curso de prueba docente",
      "level": "beginner",
      "createdByUserId": 2
    },
    {
      "id": 7,
      "title": "Frontend diseños UI/UX & Usabilidad",
      "level": "intermediate",
      "createdByUserId": 2
    }
  ],
  "meta": {
    "total": 7,
    "page": 2,
    "limit": 5,
    "totalPages": 2
  }
}
```

Los cursos con `createdByUserId` muestran que la propiedad queda asociada al usuario que los creó. Los valores dependen de los datos almacenados en la base local.

### 10. Pruebas sin evidencia propia

Las siguientes comprobaciones no cuentan con una captura específica en `evidencias/actuacion10/` y no se documentan como completadas:

- Solicitudes sin token a las rutas protegidas de cursos (`401 Unauthorized`).
- Intento de eliminación de un curso por un docente o por un estudiante (`403 Forbidden`).
- Modificación por parte de un administrador de un curso creado por otro usuario.

Las comprobaciones de solicitudes sin token, rechazo de estudiantes, modificación de cursos por docentes y autorización de administradores se vuelven a demostrar con capturas en `evidencias/actuacion11/` (pruebas E01 a E06 de la Sesión 20). La prueba de eliminación comprueba el rechazo de un docente (`403 Forbidden`) y el acceso del administrador a la ruta (`404 Not Found` para un curso inexistente). No se incluye una prueba específica de eliminación por parte de un estudiante.

### 11. Evidencias de la Semana 10

Las capturas se guardan en:

```text
evidencias/actuacion10/
```

| Archivo | Comprobación |
|---|---|
| `01. Usuarios y roles originales.png` | Usuarios y roles antes de los cambios de práctica |
| `01. Usuarios y roles cambiados.png` | Usuarios y roles después de asignar los roles de práctica |
| `02. Compilación del proyecto.png` | Compilación correcta del proyecto |
| `03. Servidor iniciado correctamente.png` | Inicio correcto del servidor |
| `04. Login como docente.png` | Inicio de sesión con la cuenta docente |
| `05. Creación de curso como docente.png` | Creación de un curso con `createdByUserId` |
| `06. Login como estudiante.png` | Inicio de sesión con la cuenta de estudiante |
| `06. Estudiante sin permiso para crear curso.png` | Rechazo de la creación de un curso por un estudiante |
| `07. Docente modifica su propio curso.png` | Modificación de un curso propio por el docente |
| `08. Docente no puede modificar curso ajeno.png` | Rechazo de la modificación de un curso de otro usuario |
| `09. Cambiar rol.png` | Cambio de rol de una cuenta de práctica |
| `09. Verificar rol.png` | Verificación del rol en la base de datos |
| `09. Crear curso temporal.png` | Creación de un curso temporal para la prueba de eliminación |
| `09. Administrador elimina un curso.png` | Eliminación de un curso por un administrador |
| `10. Consulta GET de cursos inferior.png` | Consulta `GET /courses` con límite inferior |
| `10. Consulta GET de cursos superior.png` | Consulta `GET /courses` con límite superior |
| `10. Paginación de cursos página 1.png` | Primera página de `GET /courses` |
| `10. Paginación de cursos página 2.png` | Segunda página de `GET /courses` |
| `11. Cambiar rol.png` | Cambio de rol de una cuenta de práctica al finalizar las pruebas |
| `11. Regresar rol.png` | Restauración del rol original de la cuenta |
| `12. Crear primera cuenta.png` | Registro de una cuenta de práctica |
| `12. Crear segunda cuenta.png` | Registro de una segunda cuenta de práctica |
| `13. Cambiar roles.png` | Asignación de los roles de práctica a las cuentas nuevas |
| `13. Verificar roles.png` | Verificación de los roles en la base de datos |

Los nombres deben coincidir con los archivos realmente guardados; si alguno difiere, debe corregirse en esta tabla. Antes de entregar las capturas, se deben ocultar las contraseñas, los secretos y los tokens completos.

### 12. Archivos relacionados con la implementación

- `src/users/user-role.enum.ts`: enumeración `UserRole`.
- `src/users/entities/user.entity.ts`: campo `role` con valor predeterminado `student`.
- `src/auth/auth.service.ts`: inclusión del rol en el JWT.
- `src/auth/decorators/roles.decorator.ts`: decorador `@Roles()`.
- `src/auth/guards/roles.guard.ts`: `RolesGuard`.
- `src/courses/entities/course.entity.ts`: campo `createdByUserId`.
- `src/courses/courses.service.ts`: reglas de propiedad y permisos.
- `src/courses/courses.controller.ts`: guards y decoradores en las rutas.
- `src/courses/courses.module.ts`: importación de `AuthModule`.

Las rutas deben mantenerse sincronizadas con los archivos que existan realmente en el repositorio.

### 13. Alcance de la Semana 10

Esta etapa incorpora:

- Roles `admin`, `teacher` y `student`.
- Rol predeterminado de menor privilegio (`student`).
- Rol incluido en el JWT.
- Decorador `@Roles()` y `RolesGuard`.
- Propiedad de los cursos mediante `createdByUserId`.
- Restricciones de creación, modificación y eliminación de cursos según el rol y la propiedad.
- Respuestas `403 Forbidden` para identidades sin permiso.

**Fuera del alcance de la Sesión 19:** refresh tokens, revocación de tokens, recuperación de cuenta y OAuth. Los controles de seguridad adicionales (CORS, limitación de solicitudes y HTTPS/TLS) se documentan en la [Sesión 20](#semana-10-controles-de-seguridad-para-una-api-pública-sesión-20).

## Semana 10: controles de seguridad para una API pública (Sesión 20)

Período de trabajo: Semana 10 (2 al 8 de noviembre de 2026), Sesión 20, Avance de la Etapa 3.

**Resultado de aprendizaje:** configurar controles básicos de consumo y comprender qué protege CORS, qué limita la tasa de solicitudes y por qué HTTPS es obligatorio fuera del entorno local.

Una API segura no depende de una sola barrera. JWT protege la identidad; la validación protege la entrada; la autorización protege las acciones; y los controles de esta sesión reducen los abusos desde clientes y navegadores. Este conjunto de capas se denomina **defensa en profundidad**.

### 1. CORS no es autorización

CORS indica qué orígenes web pueden **leer una respuesta desde un navegador**. No impide que Postman, Thunder Client, un script o un servidor externo llamen a la API. Por eso no reemplaza a JWT ni al guard de roles.

Configuración en `src/main.ts`:

```typescript
app.enableCors({
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

| Entorno | Origen permitido |
|---|---|
| Desarrollo | `http://localhost:5173` (cliente local) |
| Producción | El dominio real del cliente, definido de forma explícita; no se usa `origin: '*'` |

- Solo se admiten los orígenes documentados en esta tabla.
- Se permiten únicamente los métodos `GET`, `POST`, `PATCH` y `DELETE`.
- Solo se aceptan los encabezados `Content-Type` y `Authorization`.
- `origin: '*'` no es una decisión apropiada cuando la API usa credenciales o cuando se conoce el cliente autorizado.

**Qué comprueba el navegador:** si el origen de la página no aparece en `Access-Control-Allow-Origin`, el navegador bloquea el acceso de ese sitio a la respuesta. La petición puede llegar igualmente al servidor; lo que se impide es que el origen no autorizado lea el resultado.

### 2. Limitación de solicitudes (rate limiting)

Se utiliza `@nestjs/throttler`. Una limitación de tasa reduce las solicitudes repetidas dentro de una ventana de tiempo. No elimina todos los ataques, pero hace más costoso probar miles de contraseñas o saturar una ruta pública.

Límite global en `src/app.module.ts`, aplicado con `ThrottlerGuard` como `APP_GUARD`:

```typescript
ThrottlerModule.forRoot([{ ttl: 60_000, limit: 20 }]);
```

Límite más estricto para el inicio de sesión en `src/auth/auth.controller.ts`:

```typescript
@Throttle({ default: { limit: 5, ttl: 60_000 } })
@Post('login')
```

| Ámbito | Límite | Ventana |
|---|---|---|
| Todas las rutas | 20 solicitudes | 60 segundos |
| `POST /auth/login` | 5 solicitudes | 60 segundos |

El límite de `POST /auth/login` es más estricto porque la ruta recibe credenciales. La sexta solicitud dentro de la misma ventana responde `429 Too Many Requests`. Esa respuesta indica que el cliente debe esperar; **no revela** si el correo o la contraseña eran correctos.

### 3. HTTPS y TLS (requisito de producción)

> **Requisito:** en producción, CourseHub API debe publicarse únicamente mediante **HTTPS**.

HTTPS usa TLS para cifrar el tráfico entre el cliente y el servidor. Sin HTTPS, un token Bearer puede ser interceptado en una red no confiable, aunque su firma sea correcta.

- Durante el desarrollo local se utiliza `http://localhost`; no se configura un certificado para esa dirección.
- En producción, la terminación TLS suele hacerse en un proxy inverso, un balanceador o la plataforma de despliegue.
- Las solicitudes HTTP deben redirigirse a HTTPS o rechazarse.
- La API documenta este requisito y no asume que el cliente lo resolverá.
- Un JWT de vida corta (`JWT_EXPIRES_IN=15m`) complementa a TLS, pero no lo sustituye.

### 4. Gestión de secretos y variables de entorno

- `JWT_SECRET` se almacena únicamente en variables de entorno (mínimo 32 caracteres, aleatorio y distinto en cada entorno).
- Las credenciales de PostgreSQL (`DATABASE_USER`, `DATABASE_PASSWORD`, etc.) se almacenan en `.env`, nunca en el código.
- `.env` está excluido del repositorio mediante `.gitignore` y no se sube a GitHub.
- Se versiona `.env.example`, que contiene únicamente valores de ejemplo y ninguna contraseña real.
- No se publican tokens ni secretos en el README, en capturas de pantalla o en los commits.
- Si un secreto se expone, se debe cambiar de inmediato; los tokens firmados con el anterior dejan de ser válidos.

### 5. Matriz de capas

| Riesgo | Control principal | Control complementario |
|---|---|---|
| Cuerpo malformado | DTO y `ValidationPipe` | Límite de tamaño de petición |
| Token robado en tránsito | HTTPS/TLS | Vencimiento corto de JWT |
| Fuerza bruta de login | Rate limit | Mensaje genérico y hash bcrypt |
| Acción sin permiso | Roles y propiedad | Registro de auditoría |
| Sitio web no autorizado | CORS | JWT y autorización en el servidor |

### 6. Pruebas y evidencias de la Sesión 20

Las pruebas se realizaron con Thunder Client, el navegador, VS Code y pgAdmin. Las capturas se guardan en:

```text
evidencias/actuacion11/
```

Cuerpo utilizado en las cinco solicitudes de `PATCH /courses/6`:

```json
{ "title": "Prueba de autorización" }
```

| Código | Prueba | Resultado esperado | Archivo en `evidencias/actuacion11/` |
|---|---|---|---|
| E01 | `PATCH /courses/6` sin token | `401 Unauthorized`: no existe una identidad válida | `2. Token de acceso requerido.png` |
| E02 | `PATCH /courses/6` con estudiante (Ana, ID 1) | `403 Forbidden`: el rol `student` no puede modificar cursos | `2. Token estudiante sin permiso.png` |
| E03 | `PATCH /courses/6` con docente no propietario (ID 4) | `403 Forbidden`: tiene el rol, pero no es el propietario | `2. Token segundo maestro sin permiso.png` |
| E04 | `PATCH /courses/6` con docente propietario (ID 2) | `200 OK`: rol permitido y propietario del curso | `2. Token primer maestro acceso permitido.png` |
| E05 | `PATCH /courses/6` con administrador (ID 3) | `200 OK`: el administrador gestiona cualquier curso | `2. Token admin acceso permitido.png` |
| E06 | `DELETE /courses/999999` con docente y con administrador | Docente `403`; administrador supera los guards y recibe `404` (no se borra nada) | `3. Sin permiso para eliminar curso.png` y `3. No se puede eliminar un curso que no existe.png` |
| E07 | CORS con origen permitido (`Origin: http://localhost:5173`) y no permitido (`http://localhost:5174`) | Solo el origen permitido recibe `Access-Control-Allow-Origin` | `4. CORS origen permitido.png` y `4. CORS origen no permitido.png` |
| E08 | CORS desde el navegador: origen `5174` (bloqueado) y origen `5173` (permitido) | El navegador bloquea la lectura desde `5174` y la permite desde `5173` | `6. CORS origen bloqueado.png` y `6. CORS origen permitido navegador.png` (apoyo: `6. Servidor corriendo por el puerto 5174.png`, `6. Servidor corriendo por el puerto 5173.png` y `6. Se crea un frontend.png`) |
| E09 | Rate limit: quinto intento de `POST /auth/login` | `200 OK` | `7. Rate limit quinto intento 200.png` |
| E10 | Rate limit: sexto intento dentro del mismo minuto | `429 Too Many Requests` | `7. Rate limit sexto intento 429.png` |
| E11 | `GET /auth/me` con origen permitido y sin token | `401 Unauthorized` | `5. Auth me sin token 401.png` |
| E12 | `GET /auth/me` con origen permitido y JWT válido | `200 OK` | `5. Auth me con token 200.png` |
| E13 | Configuración de seguridad en el código | `main.ts` (CORS), `app.module.ts` (Throttler y `APP_GUARD`), `auth.controller.ts` (`@Throttle`) y `.gitignore` (`.env`) | `8. main.ts CORS.png`, `8. app.module.ts Throttler.png`, `8. app.module.ts APP_GUARD.png`, `8. auth.controller.ts Throttle.png` y `8. gitignore.png` |
| E14 | Documentación de HTTPS/TLS y secretos | Apartados 3 y 4 de esta sección | `9. README HTTPS y secretos.png` |
| E15 | Preguntas conceptuales de cierre | Apartado 7 de esta sección | `9. README preguntas.png` |

Las capturas `1. login admin.png`, `1. login estudiante.png`, `1. login maestro primero.png` y `1. login maestro segundo.png` documentan la obtención de los tokens usados en las pruebas anteriores; los tokens no se muestran completos.

Las columnas de resultado indican lo esperado; cada captura debe mostrar el resultado real obtenido.

**Consideraciones al probar:**

- Los inicios de sesión usados para obtener tokens cuentan para el límite de 5 por minuto. Se obtienen todos los tokens primero y se espera un minuto completo antes de la prueba E09 y E10.
- Los tokens duran 15 minutos; las cinco pruebas de `PATCH` se hacen seguidas.
- El límite global de 20 solicitudes por minuto afecta a todas las rutas; las pruebas se realizan sin ráfagas innecesarias.
- No se muestran tokens completos en las capturas.

### 7. Preguntas conceptuales de cierre

**1. ¿Por qué CORS no protege una API de Postman?**

CORS es una regla que aplican los **navegadores**: deciden si una página de otro origen puede leer la respuesta. Postman, Thunder Client, `curl`, un script o un servidor externo no son navegadores y no aplican esa regla, de modo que pueden enviar la petición y leer la respuesta sin restricción. Por eso la API debe protegerse en el servidor con JWT, roles y propiedad; CORS solo es una capa complementaria para clientes web.

**2. ¿Qué información no debe aparecer en la respuesta de un rate limit?**

La respuesta `429 Too Many Requests` no debe revelar si el correo existe o si la contraseña era correcta, ni mostrar tokens, secretos, trazas de error, detalles internos de la base de datos o de la configuración de la API. Solo debe indicar que el cliente excedió el límite y que debe esperar.

**3. ¿Por qué un token en HTTP es un riesgo aun si su firma es correcta?**

La firma garantiza que el token no fue alterado y que lo emitió el servidor, pero **no lo cifra** ni evita que otros lo vean. En HTTP, cualquiera que intercepte el tráfico en una red no confiable puede copiar el token Bearer y reutilizarlo hasta que expire, y el servidor lo aceptará porque su firma es válida. HTTPS/TLS cifra el tráfico y protege el token durante el transporte.

### 8. Archivos relacionados con la implementación

- `src/main.ts`: configuración de CORS.
- `src/app.module.ts`: `ThrottlerModule` con el límite global y `ThrottlerGuard` como `APP_GUARD`.
- `src/auth/auth.controller.ts`: `@Throttle` en `POST /auth/login`.
- `.env.example` y `.gitignore`: plantilla de variables sin secretos y exclusión de `.env`.
- `README.md`: requisito de HTTPS/TLS y gestión de secretos.

### 9. Alcance de la Sesión 20

Esta etapa incorpora:

- CORS limitado a los orígenes documentados.
- Limitación de solicitudes global y estricta en el inicio de sesión, con respuesta `429`.
- Comprobación de que las rutas protegidas siguen exigiendo JWT aunque CORS permita el origen.
- Documentación de HTTPS/TLS y de la gestión de secretos como requisito de producción.

**Fuera del alcance:** configuración de un certificado TLS en el entorno local, refresh tokens, revocación de tokens, recuperación de cuenta y OAuth.

## Semana 11: componentes transversales (Sesión 21)

Período de trabajo: Semana 11 (9 al 15 de noviembre de 2026), Sesión 21, Avance de la Etapa 3.

**Resultado de aprendizaje:** elegir el componente transversal correcto para registrar, validar, transformar y manejar errores sin duplicar código en los controladores.

### 1. Etapas de una solicitud

```text
Solicitud → middleware → guard → pipe → controlador → interceptor → respuesta
                                   ↓
                           filter ante excepción
```

| Componente | Momento | Responsabilidad | Uso en CourseHub API |
|---|---|---|---|
| Middleware | Antes del enrutamiento final | Trabajo HTTP general | `RequestLoggerMiddleware`: identificador y registro de la solicitud |
| Guard | Antes del controlador | Decidir si continúa | `JwtAuthGuard` y `RolesGuard` (Semanas 9 y 10) |
| Pipe | Antes del método | Validar o transformar datos | `ValidationPipe` global y `ParseIntPipe` en los parámetros numéricos |
| Interceptor | Antes y después del método | Medir o envolver el resultado | `TimingInterceptor`: encabezado `X-Response-Time` |
| Filter | Cuando ocurre una excepción | Traducir un error a HTTP | `HttpErrorFilter`: respuesta de error uniforme |

### 2. Middleware de registro seguro

`src/common/middleware/request-logger.middleware.ts` se aplica a todas las rutas desde `AppModule.configure()`. Asigna un identificador (`X-Request-Id`) y, al terminar la respuesta, registra:

```json
{ "requestId": "…", "method": "GET", "path": "/courses/6", "status": 200, "durationMs": 12 }
```

**Qué no se registra:** el encabezado `Authorization`, las contraseñas, los tokens, el cuerpo de la petición ni la cadena de consulta (por ejemplo, un correo usado en una búsqueda). Un registro útil contiene contexto operativo sin convertirse en una filtración de datos.

### 3. Pipes

- `ValidationPipe` global (`whitelist`, `forbidNonWhitelisted` y `transform`): valida los cuerpos y las consultas contra los DTOs.
- `ParseIntPipe` en los parámetros numéricos de cursos y matrículas (`:id`, `:studentId`, `:courseId`). Un valor como `abc` se rechaza con `400 Bad Request` antes de llegar al servicio; sin el pipe, `Number('abc')` produce `NaN` y la consulta fallaría más adentro.
- `ParseStudentIdPipe` (propio, de la etapa anterior) se mantiene en el módulo de estudiantes porque además exige un entero positivo.

### 4. Filter global de errores

`src/common/filters/http-error.filter.ts` se registra con `APP_FILTER` y devuelve siempre esta forma:

```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Course 999999 not found",
  "path": "/courses/999999",
  "timestamp": "2026-11-12T20:30:00.000Z",
  "requestId": "…"
}
```

| Tipo de error | Respuesta al cliente | Registro interno |
|---|---|---|
| Error HTTP controlado (400, 401, 403, 404, 409, 429) | Conserva su estado y su mensaje | No se registra como error |
| Error inesperado (500) | `Internal server error`, sin traza, consulta SQL ni variables de entorno | Traza completa, solo en el log del servidor |

Los mensajes de validación (`400`) se conservan como lista dentro de `message`. La ruta (`path`) no incluye la cadena de consulta.

### 5. Interceptor de tiempo de respuesta

`src/common/interceptors/timing.interceptor.ts` se registra con `APP_INTERCEPTOR`. Mide lo que tarda el método del controlador y lo informa en el encabezado `X-Response-Time` (por ejemplo, `12ms`). No modifica el resultado ni oculta errores: es una preocupación transversal, no una regla de negocio.

El encabezado aparece en las respuestas exitosas; cuando una operación falla, el filter responde y el tiempo queda en el registro del middleware.

### 6. Registro de los componentes

Todos se registran de forma global en `src/app.module.ts`:

```typescript
providers: [
  { provide: APP_GUARD, useClass: ThrottlerGuard },
  { provide: APP_FILTER, useClass: HttpErrorFilter },
  { provide: APP_INTERCEPTOR, useClass: TimingInterceptor },
],
// ...
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware)
      .forRoutes({ path: '*path', method: RequestMethod.ALL });
  }
}
```

### 7. Pruebas y evidencias de la Sesión 21

Las capturas se guardan en:

```text
evidencias/actuacion12/
```

| Código | Prueba | Resultado esperado | Archivo en `evidencias/actuacion12/` |
|---|---|---|---|
| E01 | `npm run build` y `npm run test` | Compilación correcta y todas las pruebas en verde (incluidas las del middleware, el filter y el interceptor) | `1. Compilación y pruebas arriba.png` y `1. Compilación y pruebas abajo.png` |
| E02 | Código de los componentes | `RequestLoggerMiddleware`, `HttpErrorFilter`, `TimingInterceptor`, registro en `app.module.ts` y `ParseIntPipe` en el controlador | `2. RequestLoggerMiddleware.png`, `2. HttpErrorFilter.png`, `2. TimingInterceptor.png`, `2. Registro en app.module.png` y `2. ParseIntPipe en courses.controller arriba.png` y `2. ParseIntPipe en courses.controller abajo.png` |
| E03 | `GET /courses/abc` | `400 Bad Request` (pipe) con la forma uniforme | `3. ParseIntPipe 400.png` |
| E04 | `POST /students` con un cuerpo inválido | `400 Bad Request` (`ValidationPipe`) con la lista de mensajes | `4. ValidationPipe 400.png` |
| E05 | `GET /courses/999999` | `404 Not Found` con la forma uniforme | `5. Recurso inexistente 404.png` |
| E06 | `GET /auth/me` sin token | `401 Unauthorized` (guard) con la forma uniforme | `6. Token requerido 401.png` |
| E07 | Error inesperado de práctica | `500` con el mensaje genérico, sin traza ni SQL | `7. Cambio en el codigo temporalmente.png` (ruta temporal) y `7. Error inesperado 500.png` |
| E08 | Terminal durante el error `500` | La traza completa aparece solo en el log interno | `7. Log interno del error 500.png` |
| E09 | Terminal durante las solicitudes anteriores | Líneas con `requestId`, método, ruta, estado y duración; sin tokens ni contraseñas | `8. Log de solicitudes.png` |
| E10 | Encabezados de una respuesta `200` | `X-Response-Time` y `X-Request-Id` | `9. X-Response-Time.png` |
| E11 | README | Esta sección y las respuestas de cierre | `10. README Sesión 21.png` y `10. README Sesión 21 - continuación.png` |

El error inesperado de la prueba E07 se provocó con una ruta temporal de práctica que se retiró antes del commit; no forma parte de la API. Las columnas de resultado indican lo esperado; cada captura debe mostrar el resultado real. Antes de entregar, se deben ocultar las contraseñas, los secretos y los tokens completos.

### 8. Preguntas de cierre

**Token inválido → guard (`JwtAuthGuard`).** Decide si la solicitud puede continuar antes de llegar al controlador y responde `401`. No se usa un middleware porque este no conoce la política de acceso de cada ruta ni deja la identidad lista para los demás componentes; tampoco un filter, que actúa cuando la excepción ya ocurrió y solo da formato a la respuesta.

**`id` no numérico → pipe (`ParseIntPipe`).** Valida y transforma el parámetro justo antes del método, así el servicio solo recibe números. No se usa un guard porque no se trata de permisos, ni un filter porque este no evita que el dato inválido llegue al servicio.

**Recurso inexistente → excepción del servicio y filter.** El servicio lanza `NotFoundException`, porque solo él sabe, tras consultar la base de datos, que el recurso no existe; el filter traduce la excepción a una respuesta uniforme. No se usa un pipe, porque comprobar la existencia es una regla de negocio y no una validación del formato del dato.

**Operación lenta → interceptor (`TimingInterceptor`).** Envuelve el método del controlador, por lo que puede medir antes y después sin tocar la lógica. No se usa un guard ni un pipe, que actúan antes de la ejecución y no pueden medir su duración, y no se mide dentro del servicio para no repetir código en cada operación.

### 9. Archivos relacionados con la implementación

- `src/common/middleware/request-logger.middleware.ts`: registro seguro de solicitudes.
- `src/common/filters/http-error.filter.ts`: respuesta de error uniforme.
- `src/common/interceptors/timing.interceptor.ts`: tiempo de respuesta.
- `src/app.module.ts`: registro global de los componentes.
- `src/courses/courses.controller.ts` y `src/enrollments/enrollments.controller.ts`: `ParseIntPipe` en los parámetros numéricos.
- Pruebas: `*.spec.ts` de los tres componentes y actualización de los specs de los controladores.

### 10. Alcance de la Sesión 21

Esta etapa incorpora:

- Registro centralizado de solicitudes sin datos sensibles.
- Respuestas de error con una forma coherente y sin detalles internos en los errores inesperados.
- Medición del tiempo de respuesta.
- Validación de parámetros numéricos con `ParseIntPipe`.

**Fuera del alcance de la Sesión 21:** la refactorización en capas (casos de uso, puertos y adaptadores) se implementa en la [Sesión 22](#semana-11-casos-de-uso-repositorios-y-adaptadores-sesión-22). Con el filter, las respuestas de error incluyen ahora `error`, `path`, `timestamp` y `requestId` además de `statusCode` y `message`; las evidencias de semanas anteriores muestran el formato previo.

## Semana 11: casos de uso, repositorios y adaptadores (Sesión 22)

Período de trabajo: Semana 11 (9 al 15 de noviembre de 2026), Sesión 22, Avance de la Etapa 3.

**Resultado de aprendizaje:** separar una regla de negocio de HTTP y de TypeORM para que sea comprensible, reutilizable y comprobable con pruebas.

### 1. El problema

Cuando un servicio llama directamente al repositorio de TypeORM, termina acumulando autorización, reglas, consultas y detalles de infraestructura. El problema no es TypeORM: aparece cuando una regla importante no se puede entender ni probar sin levantar HTTP y PostgreSQL.

La operación elegida es **actualizar un curso** (`PATCH /courses/:id`), porque contiene una regla de negocio real: solo el administrador o el docente propietario puede modificarlo.

### 2. Arquitectura en capas aplicada a CourseHub

```text
HTTP  →  CoursesController              ← conoce HTTP (rutas, guards, DTO)
              ↓
         UpdateCourseUseCase            ← regla de negocio (propiedad)
              ↓
         CourseRepository (puerto)      ← contrato que necesita la regla
              ↓
         TypeOrmCourseRepository        ← adaptador técnico (TypeORM)
              ↓
         PostgreSQL
```

| Capa | Archivo | Conoce | No conoce |
|---|---|---|---|
| HTTP | `src/courses/courses.controller.ts` | Rutas, guards, DTO y `req.user` | Reglas de negocio y TypeORM |
| Regla de negocio | `src/courses/use-cases/update-course.use-case.ts` | Quién puede modificar un curso | HTTP y TypeORM |
| Puerto | `src/courses/domain/course.repository.ts` | Qué necesita la regla (`findById` y `save`) | Cómo se almacena |
| Adaptador | `src/courses/infrastructure/typeorm-course.repository.ts` | TypeORM | La regla de negocio |

### 3. Puerto

```typescript
export const COURSE_REPOSITORY = Symbol('COURSE_REPOSITORY');

export interface CourseRepository {
  findById(id: number): Promise<Course | null>;
  save(course: Course): Promise<Course>;
}
```

El contrato es pequeño porque el caso de uso solo necesita encontrar y guardar. Las interfaces de TypeScript no existen en tiempo de ejecución; por eso se usa un `Symbol` como token de inyección.

### 4. Caso de uso

`UpdateCourseUseCase` recibe el repositorio mediante `@Inject(COURSE_REPOSITORY)` y concentra la decisión:

```typescript
const course = await this.courses.findById(id);
if (!course) throw new NotFoundException(`Course ${id} not found`);

const isAdmin = actor.role === UserRole.ADMIN;
const isOwner = course.createdByUserId === actor.id;
if (!isAdmin && !isOwner) {
  throw new ForbiddenException('No tienes permisos para modificar este curso');
}

Object.assign(course, changes);
return this.courses.save(course);
```

La autorización de propiedad permanece junto a la regla de negocio. El propietario se toma de `actor` (la identidad autenticada), nunca del cuerpo de la solicitud.

### 5. Adaptador TypeORM

`TypeOrmCourseRepository` implementa `CourseRepository` y traduce el contrato a la biblioteca (`findById` → `findOneBy` y `save` → `save`). Si el almacenamiento cambia, se modifica esta clase y no los controladores ni las reglas.

### 6. Conexión con inyección de dependencias

En `src/courses/courses.module.ts`:

```typescript
providers: [
  CoursesService,
  UpdateCourseUseCase,
  { provide: COURSE_REPOSITORY, useClass: TypeOrmCourseRepository },
],
```

`CoursesController` inyecta `UpdateCourseUseCase` y el método `update` se limita a delegar: `return this.updateCourseUseCase.execute(id, body, req.user)`. `CoursesService` conserva las consultas, la creación y la eliminación; ya no contiene `update`.

### 7. El contrato HTTP no cambia

La refactorización no altera la API: la ruta, los guards, los códigos y los mensajes siguen igual.

| Caso | Respuesta |
|---|---|
| Docente propietario o administrador | `200 OK` con el curso actualizado |
| `id` no numérico (`/courses/abc`) | `400 Bad Request` (`ParseIntPipe`) |
| Curso inexistente | `404 Not Found` — `Course <id> not found` |
| Docente que no es propietario | `403 Forbidden` — `No tienes permisos para modificar este curso` |
| Sin token | `401 Unauthorized` (`JwtAuthGuard`) |
| Estudiante | `403 Forbidden` (`RolesGuard`) |

### 8. Pruebas automatizadas

- `update-course.use-case.spec.ts`: prueba la regla con un **repositorio falso en memoria**, sin HTTP, sin TypeORM y sin PostgreSQL (propietario, administrador, docente ajeno, curso inexistente y propietario que no cambia).
- `typeorm-course.repository.spec.ts`: comprueba que el adaptador traduce `findById` y `save` a TypeORM.
- `courses.controller.spec.ts`: comprueba que el controlador delega en el caso de uso.
- `courses.service.spec.ts`: conserva las pruebas de consulta, creación y búsqueda; las de actualización se movieron al caso de uso.

### 9. Pruebas y evidencias de la Sesión 22 y del Avance de la Semana 11

Las capturas se guardan en:

```text
evidencias/actuacion13/
```

| Código | Prueba | Resultado esperado | Archivo en `evidencias/actuacion13/` |
|---|---|---|---|
| E01 | `npm run build` y `npm run test` | Compilación correcta y todas las pruebas en verde, incluidas las del caso de uso y del adaptador | `1. Compilación y pruebas arriba.png` y `1. Compilación y pruebas abajo.png` |
| E02 | Estructura del módulo `courses` | Carpetas `domain`, `use-cases` e `infrastructure` | `2. Estructura del módulo courses.png` |
| E03 | Código de las capas | Puerto, caso de uso, adaptador, registro en el módulo y controlador | `3. Puerto CourseRepository.png`, `3. UpdateCourseUseCase.png`, `3. TypeOrmCourseRepository.png`, `3. Registro en courses.module.png` y `3. CoursesController delega en el caso de uso.png` |
| E04 | Solicitud correcta: `PATCH /courses/6` con el docente propietario (ID 2) | `200 OK` | `4. Solicitud correcta 200.png` |
| E05 | Identificador inválido: `PATCH /courses/abc` | `400 Bad Request` | `5. Identificador inválido 400.png` |
| E06 | Recurso inexistente: `PATCH /courses/999999` con el administrador | `404 Not Found` | `6. Recurso inexistente 404.png` |
| E07 | Solicitud prohibida: `PATCH /courses/6` con el docente no propietario (ID 4) | `403 Forbidden` | `7. Solicitud prohibida 403.png` |
| E08 | Log de la API durante las cuatro solicitudes | Una línea por solicitud con `requestId`, estado `200`, `400`, `404` y `403`; sin tokens | `8. Log de solicitudes.png` |
| E09 | Pruebas del caso de uso por separado | Se ejecutan sin base de datos | `9. Pruebas del caso de uso.png` |
| E10 | README | Secciones de la Sesión 22 y respuesta de cierre | `10. README Sesión 22.png` |

Las columnas de resultado indican lo esperado; cada captura debe mostrar el resultado real. Antes de entregar, se deben ocultar las contraseñas, los secretos y los tokens completos.

### 10. Pregunta de cierre

**¿Qué clase cambiaría si se reemplaza TypeORM y cuál si cambia la regla «solo el propietario puede editar»?**

Si se reemplaza TypeORM, cambia **`TypeOrmCourseRepository`** (el adaptador): se escribe otra implementación de `CourseRepository` y se cambia el `useClass` del módulo; el caso de uso y el controlador no se tocan. Si cambia la regla de propiedad, cambia **`UpdateCourseUseCase`**: el adaptador y el controlador siguen igual. Son clases distintas, así que la separación cumple su propósito.

### 11. SOLID en la práctica

| Principio | Cómo se aplica |
|---|---|
| Responsabilidad única | El controlador atiende HTTP, el caso de uso decide y el adaptador persiste; cada clase cambia por una sola razón |
| Abierto/cerrado | Se puede añadir otra implementación de `CourseRepository` sin modificar el caso de uso |
| Sustitución | El repositorio falso de las pruebas reemplaza al adaptador de TypeORM sin que el caso de uso lo note |
| Segregación de interfaces | El puerto solo declara `findById` y `save`, que es lo que el caso de uso necesita |
| Inversión de dependencias | La regla depende del contrato `CourseRepository` y no de TypeORM |

### 12. Archivos relacionados con la implementación

- `src/courses/domain/course.repository.ts`: puerto y token de inyección.
- `src/courses/use-cases/update-course.use-case.ts`: regla de negocio.
- `src/courses/infrastructure/typeorm-course.repository.ts`: adaptador TypeORM.
- `src/courses/courses.module.ts`: registro con `provide` y `useClass`.
- `src/courses/courses.controller.ts`: delegación en el caso de uso.
- `src/courses/courses.service.ts`: sin el método `update`.
- Pruebas: `update-course.use-case.spec.ts`, `typeorm-course.repository.spec.ts` y actualización de `courses.controller.spec.ts` y `courses.service.spec.ts`.

### 13. Alcance de la Sesión 22

Esta etapa incorpora:

- Un caso de uso separado del controlador para la actualización de cursos.
- Un contrato de repositorio pequeño y un adaptador TypeORM.
- La autorización de propiedad dentro de la regla de negocio.
- Pruebas de la regla sin base de datos.

**Fuera del alcance:** aplicar el mismo patrón al resto de operaciones y módulos. Se aplicó a una operación representativa; las demás siguen en `CoursesService`. Las pruebas unitarias en profundidad corresponden a la Semana 12.

## Avance de Etapa 3 — Semana 11: arquitectura mantenible y comportamiento transversal

Este avance reúne las Sesiones 21 y 22.

| Requisito del avance | Estado | Dónde está |
|---|---|---|
| Middleware de registro sin secretos ni cuerpos sensibles | Cumplido | `src/common/middleware/request-logger.middleware.ts` |
| Errores con forma consistente y sin trazas internas | Cumplido | `src/common/filters/http-error.filter.ts` |
| Un módulo de negocio con un caso de uso separado del controlador | Cumplido | `UpdateCourseUseCase` en el módulo `courses` |
| Contrato de repositorio pequeño y adaptador TypeORM | Cumplido | `CourseRepository` y `TypeOrmCourseRepository` |
| La autorización de propiedad junto a la regla de negocio | Cumplido | `UpdateCourseUseCase` |

### Demostración (hasta ocho minutos)

Sobre `PATCH /courses/:id`:

1. **Solicitud correcta:** docente propietario (ID 2) sobre el curso 6 → `200`.
2. **Identificador inválido:** `/courses/abc` → `400`, rechazado por `ParseIntPipe` antes de llegar al caso de uso.
3. **Recurso inexistente:** `/courses/999999` con el administrador → `404`, lanzado por el caso de uso.
4. **Solicitud prohibida:** docente no propietario (ID 4) sobre el curso 6 → `403`, decidido por la regla de propiedad.

Después, se señala en el código dónde vive cada responsabilidad:

| Responsabilidad | Dónde vive |
|---|---|
| HTTP (ruta, guards, DTO, `ParseIntPipe`) | `courses.controller.ts` |
| Regla de negocio (propiedad) | `update-course.use-case.ts` |
| Persistencia (TypeORM) | `typeorm-course.repository.ts` |
| Registro, formato de errores y tiempo de respuesta | `src/common/` (aplicados una sola vez, de forma global) |

### Criterio de éxito

La regla de propiedad se lee y se prueba sin conocer rutas ni TypeORM (el repositorio falso del test lo demuestra), mientras los componentes transversales se aplican una sola vez mediante `app.module.ts`.

## Semana 12: pruebas unitarias de reglas de negocio (Sesión 23)

Período de trabajo: Semana 12 (16 al 22 de noviembre de 2026), Sesión 23, Avance de la Etapa 4.

**Resultado de aprendizaje:** crear pruebas unitarias para un caso de uso con un repositorio simulado, sin iniciar HTTP ni PostgreSQL.

### 1. Qué protege una prueba unitaria

Probar una ruta a mano es valioso, pero no escala: cada cambio obligaría a repetir decenas de escenarios. Una prueba unitaria protege una decisión pequeña: «un docente no edita un curso ajeno», «un curso inexistente produce `404`» o «un administrador sí puede actualizarlo». No demuestra que PostgreSQL o HTTP funcionen juntos; demuestra, de forma rápida y repetible, que una unidad cumple una regla concreta.

### 2. Herramienta: Jest (migrada desde Vitest)

El material del curso muestra los ejemplos con Jest. Este proyecto se generó con **Vitest** y las pruebas de la Semana 12 se escribieron primero con esa herramienta. Después se **migraron a Jest**, conservando la lógica de negocio y los casos de prueba. Desde la migración, `npm test` ejecuta las pruebas unitarias con Jest.

**Qué incluyó la migración:**

- Instalación de `jest`, `@types/jest` y `ts-jest`.
- Configuración de Jest mediante `jest.config.ts`, que le indica cómo encontrar y ejecutar las pruebas; `ts-jest` compila los archivos TypeScript al ejecutarlas.
- Creación de `tsconfig.spec.json`, la configuración de TypeScript usada para compilar y ejecutar las pruebas.
- Adaptación de la configuración para trabajar con TypeScript y módulos ESM, y corrección de importaciones y de la compatibilidad de algunos tests con ESM.
- Exclusión de `src/app.controller.spec.ts` del conjunto unitario de Jest, porque corresponde a una prueba de integración HTTP y no a una prueba unitaria.
- Conservación de Vitest para el comando E2E existente: no se eliminaron sus dependencias ni su configuración (`vitest.config.e2e.ts`). En la Semana 13 el comando E2E también pasó a Jest y esos archivos de Vitest quedaron sin uso.
- **No se modificó la lógica de negocio** (casos de uso, servicios, controladores, endpoints ni entidades): solo cambió la herramienta que ejecuta las pruebas.

**Equivalencias aplicadas en las pruebas:**

| Vitest (versión inicial) | Jest (versión actual) |
|---|---|
| `vi.fn()` | `jest.fn()` |
| `vi.clearAllMocks()` / `vi.resetAllMocks()` | `jest.clearAllMocks()` / `jest.resetAllMocks()` |
| `describe`, `it`, `expect` | Igual, con las funciones de Jest |

Los matchers (`toBe`, `toEqual`, `toHaveBeenCalledWith`, `rejects.toThrow`, `not.toHaveBeenCalled`) y los dobles como `mockResolvedValue` se usan igual. También se conserva el enfoque **Arrange - Act - Assert** descrito a continuación.

### 3. La forma Arrange - Act - Assert

1. **Arrange:** preparar las entradas y las dependencias controladas.
2. **Act:** ejecutar la unidad que se quiere comprobar.
3. **Assert:** verificar el resultado, el error o la interacción esperada.

Cada prueba tiene un propósito evidente y un nombre que explica la regla; cuando una falla, el equipo sabe qué comportamiento revisar.

### 4. Repositorio simulado

`src/courses/use-cases/update-course.use-case.spec.ts` sustituye al adaptador TypeORM por un **repositorio falso en memoria** que cumple el contrato `CourseRepository`, registra cuántas veces se llamó a `save` y qué identificadores se buscaron:

```typescript
class InMemoryCourseRepository implements CourseRepository {
  saveCalls = 0;
  findByIdCalls: number[] = [];

  constructor(private readonly courses: Course[]) {}

  async findById(id: number) {
    this.findByIdCalls.push(id);
    const course = this.courses.find((c) => c.id === id);
    return course ? { ...course } : null;
  }

  async save(course: Course) {
    this.saveCalls++;
    // ... reemplaza el curso en el arreglo y lo devuelve
  }
}

beforeEach(() => {
  repository = new InMemoryCourseRepository([
    { id: 6, title: 'Curso original', level: 'beginner', createdByUserId: 2 },
  ]);
  useCase = new UpdateCourseUseCase(repository);
});
```

Gracias a la inversión de dependencias de la Sesión 22, el caso de uso recibe cualquier objeto que cumpla el contrato: en producción es `TypeOrmCourseRepository` y en la prueba es este repositorio en memoria. No abre conexiones ni depende de datos previos. (El controlador, en cambio, se prueba con dependencias simuladas con `jest.fn()`; véase la Sesión 24.)

### 5. Casos probados

| Grupo | Prueba | Qué comprueba |
|---|---|---|
| Permitido | Docente propietario modifica su curso | El resultado trae el título nuevo y `save` se llama una vez |
| Permitido | Búsqueda con el identificador recibido | `findById` se llama con el `id` recibido |
| Permitido | Administrador modifica el curso de otro usuario | La regla de administrador prevalece sobre la propiedad |
| Permitido | El propietario original se conserva | `createdByUserId` no cambia al actualizar |
| Rechazo | Docente que no es el propietario | `ForbiddenException` y `save` no se llama |
| Rechazo | Curso inexistente | `NotFoundException` y `save` no se llama |

Total: 6 pruebas del caso de uso. En las de rechazo se verifican **dos cosas distintas**: el tipo de error (lo que ve quien llama) y que `save` no se llamó (que no se modificaron datos).

### 6. Cómo ejecutar las pruebas

```powershell
npm test                       # todas las pruebas unitarias una vez (Jest)
npm test -- update-course      # solo las del caso de uso
npm run test:watch             # modo observador mientras se desarrolla
npm run test:cov               # con cobertura
```

`npm test -- update-course` filtra los archivos de prueba cuya ruta coincide con `update-course`. Las pruebas no necesitan la API en ejecución ni PostgreSQL.

### 7. Comprobar que una prueba protege algo

Una prueba que nunca falla no protege nada. Para comprobarlo se cambió temporalmente la **regla de producción** en `update-course.use-case.ts` (`if (!isAdmin && !isOwner)` por `if (false)`), se ejecutó `npm test -- update-course` y falló la prueba de rechazo del docente que no es propietario. Al restaurar la línea original, el conjunto volvió a verde. El cambio temporal no se incluye en el commit. La demostración se ejecutó con Jest: con `if (false)` falló 1 prueba y, al restaurar la regla, volvieron a pasar las 6. Las capturas están en la tabla de evidencias del [Avance de la Etapa 4](#avance-de-etapa-4--semana-12-pruebas-unitarias-que-protegen-reglas).

### 8. Pruebas y evidencias de la Sesión 23

Las capturas de la Sesión 23 se reúnen con las de la Sesión 24 en una sola carpeta para toda la Semana 12:

```text
evidencias/actuacion14/
```

La tabla completa (compilación, repositorio simulado, casos de éxito y de rechazo, ejecución de `npm test -- update-course` y demostración de la regla modificada) está en el [Avance de la Etapa 4](#avance-de-etapa-4--semana-12-pruebas-unitarias-que-protegen-reglas). Las capturas de ejecución (terminal) se tomaron con Jest.

### 9. Preguntas de cierre

**¿Por qué esta prueba no necesita PostgreSQL?**

Porque `UpdateCourseUseCase` depende del contrato `CourseRepository`, no de TypeORM. En la prueba, el contrato lo cumple un repositorio falso en memoria que devuelve lo que cada caso necesita, de modo que la regla se ejecuta de forma aislada: no se abre ninguna conexión ni se requieren datos previos.

**¿Qué diferencia hay entre probar que se lanzó `ForbiddenException` y probar que no se llamó a `save`?**

Verifican cosas distintas. `rejects.toThrow(ForbiddenException)` comprueba **qué ve quien llama**: el tipo de error. `expect(repository.saveCalls).toBe(0)` comprueba **el efecto secundario**: que no se persistió ningún cambio. Una regla de seguridad estaría incompleta si respondiera un error después de modificar datos; por eso las pruebas de rechazo incluyen las dos comprobaciones.

### 10. Archivos relacionados con la implementación

- `src/courses/use-cases/update-course.use-case.spec.ts`: pruebas del caso de uso con repositorio simulado.
- `src/courses/use-cases/update-course.use-case.ts`: regla de negocio probada (sin cambios).
- `src/courses/domain/course.repository.ts`: contrato que se simula.
- `jest.config.ts`: configuración de Jest para las pruebas unitarias.
- `tsconfig.spec.json`: configuración de TypeScript para compilar y ejecutar las pruebas.
- `vitest.config.e2e.ts`: configuración de Vitest del comando E2E original; en la Semana 13 quedó sin uso porque el E2E pasó a Jest (`jest.config.e2e.ts`).

### 11. Alcance de la Sesión 23

Esta etapa incorpora:

- Pruebas unitarias del caso de uso con un repositorio simulado, en la forma Arrange - Act - Assert.
- Casos de éxito, de recurso inexistente y de rechazo del docente que no es propietario.
- Verificación de que el repositorio no guarda cambios cuando la regla rechaza.
- Instrucciones para ejecutar el conjunto de pruebas.
- Migración de las pruebas unitarias de Vitest a Jest, sin cambios en la lógica de negocio.

**Fuera del alcance:** las pruebas de controladores y la cobertura se tratan en la Sesión 24; las pruebas e2e, la base de datos de pruebas y la automatización CI/CD pertenecen a la Semana 13.

## Semana 12: controladores, cobertura y calidad de pruebas (Sesión 24)

Período de trabajo: Semana 12 (16 al 22 de noviembre de 2026), Sesión 24, Avance de la Etapa 4.

**Resultado de aprendizaje:** probar que un controlador delega correctamente, interpretar la cobertura y distinguir una prueba útil de una que solo aumenta porcentajes.

### 1. Qué prueba un controlador

El controlador es deliberadamente pequeño: recibe parámetros HTTP ya transformados, delega en un caso de uso o servicio y devuelve el resultado. Por eso sus pruebas **no repiten la regla de negocio**: comprueban que el puente HTTP invoca el componente correcto con los argumentos correctos.

| Se prueba aquí | Se prueba en otro lugar |
|---|---|
| El controlador conserva el `id` | La regla de propiedad: `UpdateCourseUseCase` |
| No modifica el DTO | La autorización por rol: `RolesGuard` |
| Entrega la identidad autenticada | La validación del cuerpo: `ValidationPipe` |
| No oculta los errores del caso de uso | Las consultas a la base de datos: pruebas de integración (Semana 13) |

### 2. Controlador con dependencia simulada

En `src/courses/courses.controller.spec.ts` se simula el **caso de uso**, no el controlador:

```typescript
const updateCourseUseCaseMock = { execute: jest.fn() };

const module = await Test.createTestingModule({
  controllers: [CoursesController],
  providers: [
    { provide: CoursesService, useValue: coursesService },
    { provide: UpdateCourseUseCase, useValue: updateCourseUseCaseMock },
  ],
})
  .overrideGuard(JwtAuthGuard).useValue({ canActivate: () => true })
  .overrideGuard(RolesGuard).useValue({ canActivate: () => true })
  .compile();

it('debe delegar el identificador, el DTO y la identidad autenticada', async () => {
  const dto = { title: 'NestJS avanzado' };
  updateCourse.execute.mockResolvedValue({ id: 7, ...dto });

  const respuesta = await controller.update(7, dto, { user: docente });

  expect(respuesta).toEqual({ id: 7, ...dto });
  expect(updateCourseUseCaseMock.execute).toHaveBeenCalledWith(courseId, dto, authenticatedUser);
});
```

Los guards se reemplazan porque se prueban por separado (`RolesGuard` tiene su propio archivo de pruebas).

### 3. Casos probados del controlador

| Grupo | Prueba | Qué comprueba |
|---|---|---|
| Consultas | Delegación de la consulta de cursos | `findAll` recibe los parámetros tal como llegan |
| Consultas | Delegación de la búsqueda por identificador | `findOne` recibe el `id` numérico |
| Actualización | Delegación de identificador, DTO e identidad | `execute` recibe los tres argumentos correctos |
| Actualización | `ForbiddenException` se propaga | El error del caso de uso no se convierte en un falso `200` |
| Actualización | `NotFoundException` se propaga | Igual para el curso inexistente |
| Creación | Delegación con la identidad autenticada | `create` recibe el DTO y el usuario |
| Eliminación | Delegación del identificador | `remove` recibe el `id` numérico |

### 4. Cobertura como señal

```powershell
npm test               # pruebas unitarias con Jest
npm run test:watch     # modo observador
npm run test:cov       # pruebas con informe de cobertura
```

La cobertura indica qué líneas, funciones y ramas se ejecutaron durante las pruebas. Se configura mediante `jest.config.ts` y el informe se genera en `coverage/`, carpeta que `.gitignore` excluye del repositorio.

**Resultado actual de `npm run test:cov` (Jest):**

| Métrica | Resultado |
|---|---:|
| Sentencias | 61,38 % |
| Ramas | 52,60 % |
| Funciones | 62,16 % |
| Líneas | 61,45 % |

El conjunto que produce estos resultados es de 15 suites y 68 pruebas aprobadas, sin pruebas fallidas. El porcentaje global es una señal para localizar rutas sin ejercitar, no un objetivo en sí mismo (véase la primera pregunta de cierre).

**Cobertura inicial (Jest, sin los specs de `RolesGuard` y `CoursesService`):** sentencias 54,45 %, ramas 47,39 %, funciones 52,7 % y líneas 53,81 %, con 13 suites y 53 pruebas aprobadas. En esa ejecución `roles.guard.ts` tenía 20 % de sentencias y 11,11 % de líneas, y `courses.service.ts` 13,33 % de sentencias y 7,14 % de líneas.

| Pregunta | Mejor evidencia |
|---|---|
| ¿Se ejecutó la rama de rechazo? | Cobertura de ramas y una prueba de error |
| ¿La regla es correcta? | Una expectativa clara sobre el resultado o la excepción |
| ¿La prueba es independiente? | No depende del orden, del reloj real ni de una base local |
| ¿El nombre explica el contrato? | Un nombre como `debe rechazar a un docente que no es el propietario` |

Una cobertura alta no garantiza calidad: se puede ejecutar una línea sin comprobar su resultado. Una cobertura baja sí puede revelar rutas sin ejercitar.

### 5. Ramas sin cubrir y pruebas añadidas

Al ejecutar la cobertura antes de añadir las pruebas del guard y del servicio, se buscaron ramas relevantes sin ejercitar. Con Jest, la cobertura inicial se obtuvo ignorando temporalmente los specs de `RolesGuard` y `CoursesService`. Se eligieron dos zonas:

| Zona | Qué no estaba cubierto | Pruebas añadidas |
|---|---|---|
| `src/auth/guards/roles.guard.ts` | Toda la autorización por rol: ruta sin `@Roles()`, rol permitido, rol rechazado y usuario ausente | 6 pruebas en `roles.guard.spec.ts` |
| `src/courses/courses.service.ts` | `findAll` (paginación, filtro por nivel y total de páginas) y `remove` (curso existente e inexistente) | 5 pruebas en `courses.service.spec.ts` |

Las pruebas de `RolesGuard` verifican que un rol no autorizado y una identidad ausente producen `ForbiddenException`, y que una ruta sin `@Roles()` no restringe. Las de `remove` comprueban además que, si el curso no existe, no se llama a `remove` del repositorio.

### 6. Qué no debe simularse

No se simula la unidad que se está probando; se simula su dependencia:

| Se prueba | Se simula |
|---|---|
| `UpdateCourseUseCase` | `CourseRepository` (no el caso de uso) |
| `CoursesController` | `UpdateCourseUseCase` y `CoursesService` (no el controlador) |
| `RolesGuard` | `Reflector` y el contexto de ejecución (no el guard) |
| `CoursesService` | El repositorio de TypeORM (no el servicio) |

Este límite mantiene cada prueba enfocada y hace evidente qué falló cuando una prueba se pone en rojo.

### 7. Pruebas y evidencias de la Sesión 24

Las capturas de la Sesión 24 (pruebas del controlador y cobertura) se guardan en la misma carpeta de toda la Semana 12:

```text
evidencias/actuacion14/
```

El detalle está en la tabla de evidencias del [Avance de la Etapa 4](#avance-de-etapa-4--semana-12-pruebas-unitarias-que-protegen-reglas).

### 8. Preguntas de cierre

**¿Por qué una cobertura de 100 % no autoriza eliminar la revisión de código?**

Porque la cobertura mide qué líneas **se ejecutaron**, no si se **comprobó su resultado**: una prueba sin expectativas útiles puede recorrer una línea y dejar la cobertura en 100 %. Tampoco detecta requisitos que nunca se programaron, expectativas equivocadas, simulaciones que ocultan fallos de integración, ni problemas de diseño, seguridad o legibilidad, que son justamente lo que revisa una persona al leer el código.

**¿Qué prueba unitaria se agregaría antes de modificar la regla de propiedad?**

Primero, una prueba que describa el **comportamiento nuevo** y que falle con el código actual; por ejemplo, si cambiara la regla para permitir a un segundo docente asignado al curso, `debe permitir que el docente asignado actualice el curso`. Se confirma que falla, se cambia la regla y se comprueba que pasa. Las pruebas existentes (docente ajeno y curso inexistente, siempre con la verificación de que `save` no se llama) se conservan como red de seguridad para que el cambio no abra una vía no prevista.

### 9. Archivos relacionados con la implementación

- `src/courses/courses.controller.spec.ts`: pruebas del controlador con dependencias simuladas.
- `src/courses/courses.service.spec.ts`: pruebas de `findAll`, `findOne`, `create` y `remove`.
- `src/auth/guards/roles.guard.spec.ts`: pruebas de la autorización por rol.
- `jest.config.ts`: configuración de Jest y de la cobertura.
- `tsconfig.spec.json`: configuración de TypeScript para compilar y ejecutar las pruebas.

### 10. Alcance de la Sesión 24

Esta etapa incorpora:

- Pruebas de un controlador que delegan en un caso de uso, sin repetir la regla de negocio.
- Pruebas de propagación de errores del caso de uso.
- Informe de cobertura con Jest (`npm run test:cov`) y pruebas para ramas sin ejercitar.
- Criterios para distinguir una prueba útil de una que solo aumenta porcentajes.

**Fuera del alcance:** las pruebas de integración, las pruebas e2e, la base de datos de pruebas y la automatización CI/CD pertenecen a la Semana 13.

## Avance de Etapa 4 — Semana 12: pruebas unitarias que protegen reglas

Este avance reúne las Sesiones 23 y 24.

| Requisito del avance | Estado | Dónde está |
|---|---|---|
| Pruebas unitarias de un caso de uso con repositorio simulado | Cumplido | `update-course.use-case.spec.ts` |
| Éxito, recurso inexistente y una regla de autorización rechazada | Cumplido | El mismo archivo (6 pruebas) |
| Prueba de controlador que verifica delegación de identificador, DTO e identidad autenticada | Cumplido | `courses.controller.spec.ts` |
| Las pruebas no usan PostgreSQL ni red | Cumplido | Repositorio y casos de uso simulados |
| El README indica el comando para ejecutar las pruebas | Cumplido | Apartado 6 de la Sesión 23 y "Comandos disponibles" |
| Pruebas unitarias ejecutadas con Jest tras la migración desde Vitest | Cumplido | `npm test`: 15 suites y 68 pruebas aprobadas, 0 fallidas |
| Informe de cobertura | Cumplido | `npm run test:cov`: 61,38 % de sentencias |
| Compilación del proyecto | Cumplido | `npm run build` finalizó sin errores |

### Resultados actuales (Jest)

| Comprobación | Resultado |
|---|---|
| `npm test` | 15 suites aprobadas, 68 pruebas aprobadas, 0 fallidas |
| `npm run test:cov` | Sentencias 61,38 %; ramas 52,60 %; funciones 62,16 %; líneas 61,45 % |
| `npm run build` | Finalizó correctamente, sin errores |

**Resultado histórico (Vitest, antes de la migración):** 16 archivos y 69 pruebas aprobadas. La diferencia con el resultado actual se debe a que `src/app.controller.spec.ts`, una prueba de integración HTTP, se excluyó del conjunto unitario de Jest. En la Semana 13 el comando E2E también pasó a Jest.

### Demostración

1. Ejecutar el conjunto completo: `npm run test` (con Jest: 15 suites y 68 pruebas aprobadas, 0 fallidas).
2. Cambiar temporalmente la regla en `src/courses/use-cases/update-course.use-case.ts`: reemplazar `if (!isAdmin && !isOwner)` por `if (false)`.
3. Ejecutar `npm test -- update-course`: **falla la prueba de rechazo del docente que no es propietario** (`debe rechazar que un docente modifique el curso de otro docente`).
4. Restaurar la línea original (`if (!isAdmin && !isOwner)`) y comprobar que las pruebas vuelven a verde.

*Nota:* los pasos 3 y 4 se ejecutaron con Jest: con `if (false)` falló 1 prueba (1 fallida y 5 aprobadas) y, al restaurar la regla, volvieron a pasar las 6.

**Qué quedaría desprotegido si se borrara esa prueba:** si se borra la prueba del docente ajeno, ninguna prueba fallaría aunque alguien rompiera la regla, y un docente podría modificar los cursos de otro sin que el equipo se enterara hasta que alguien lo notara en producción. Una regla de seguridad sin una prueba que la proteja puede romperse sin que nadie lo vea.

### Evidencias del avance (`evidencias/actuacion14/`)

| Código | Requisito o prueba | Qué muestra | Archivo |
|---|---|---|---|
| E01 | Compilación y conjunto completo | `npm run build` sin errores y `npm run test` con 15 suites y 68 pruebas en verde (Jest) | `1. Compilación y pruebas arriba.png` y `1. Compilación y pruebas abajo.png` |
| E02 | Caso de uso con repositorio simulado: éxito, recurso inexistente y regla rechazada | La clase `InMemoryCourseRepository` y el `beforeEach` que la entrega al caso de uso; la prueba de éxito; y las de curso inexistente y docente ajeno con `saveCalls` igual a 0 | `2. Repositorio simulado.png`, `2. Caso exitoso.png` y `2. Casos de rechazo.png` |
| E03 | Ejecución de las pruebas del caso de uso | `npm test -- update-course`: las 6 pruebas en verde | `3. Pruebas del caso de uso.png` |
| E04 | Prueba de controlador: delegación de identificador, DTO e identidad | El controlador con el caso de uso simulado, la propagación de errores y `npm test -- courses.controller` con las 8 pruebas en verde | `4. Controlador con dependencia simulada.png`, `4. Delegación del ID, el DTO y la identidad.png`, `4. Delegación y propagación de errores.png` y `4. Pruebas del controlador.png` |
| E05 | Las pruebas no usan PostgreSQL ni red | Los `import` del archivo de pruebas: solo Nest, el contrato y el propio caso de uso | `5. Imports sin PostgreSQL ni red.png` |
| E06 | Demostración: regla modificada temporalmente | La línea `if (false)` en `update-course.use-case.ts`, la prueba de rechazo del docente ajeno en rojo y la regla restaurada con todo en verde | `6. Regla modificada.png`, `6. Pruebas en rojo.png` y `6. Regla restaurada en verde.png` |
| E07 | Cobertura (complementaria) | Informe `npm run test:cov` con Jest antes de añadir las pruebas del guard y del servicio (13 suites, 53 pruebas, 54,45 % de sentencias) y después (15 suites, 68 pruebas, 61,38 %) | `7. Cobertura inicial arriba.png`, `7. Cobertura inicial abajo.png`, `7. Cobertura final arriba.png` y `7. Cobertura final abajo.png` |
| E08 | El README indica el comando para ejecutar las pruebas | Vista previa de los apartados de ejecución de pruebas y de "Comandos disponibles" | `8. README comandos de prueba.png` |

Las capturas de ejecución de esta tabla se tomaron con Jest y coinciden con los "Resultados actuales (Jest)" (15 suites, 68 pruebas, cobertura de 61,38 % en sentencias y compilación exitosa). En la cobertura inicial (E07) se ignoraron temporalmente los specs del guard y del servicio, por eso muestra 13 suites y 53 pruebas. Las capturas deben mostrar el resultado real obtenido. Antes de entregar, se deben ocultar las contraseñas, los secretos y los tokens completos.

### Criterio de éxito

Las pruebas son rápidas (no abren conexiones), deterministas (no dependen de datos previos, del reloj ni del orden), legibles (cada nombre explica la regla) y verifican decisiones de negocio reales —quién puede modificar un curso— en vez de limitarse a ejecutar líneas.

## Semana 13: pruebas e2e y automatización de calidad (Sesiones 25 y 26)

### Sesión 25 · Pruebas de integración y end-to-end

#### 1. Qué comprueba cada tipo de prueba

| Tipo | Qué ejecuta | Qué usa | Dónde está |
|---|---|---|---|
| Unitaria | Una regla aislada (caso de uso, guard, servicio) | Dependencias simuladas, sin HTTP ni PostgreSQL | `src/**/*.spec.ts` (`npm test`) |
| Integración / e2e | La aplicación Nest completa: ruta, guards, pipes, controlador, filter y persistencia | Solicitudes HTTP reales con Supertest y una base PostgreSQL de pruebas | `test/*.e2e-spec.ts` (`npm run test:e2e`) |

Las pruebas e2e verifican que las capas colaboran entre sí, pero no sustituyen a las unitarias: estas siguen siendo más rápidas para las reglas de negocio.

#### 2. Herramientas

- **Jest** ejecuta las pruebas e2e con su propia configuración, `jest.config.e2e.ts`, separada de la de las pruebas unitarias (`jest.config.ts`). Cada una recoge solo sus archivos: las unitarias, `src/**/*.spec.ts`; las e2e, `test/**/*.e2e-spec.ts`.
- **Supertest** envía las solicitudes a `app.getHttpServer()` sin abrir un puerto fijo.
- La aplicación se crea con el `AppModule` real y con la misma validación global de `src/main.ts` (`ValidationPipe` con `whitelist`, `forbidNonWhitelisted` y `transform`).
- Único componente sustituido: `@nestjs/throttler`, mediante `test/mocks/throttler.mock.ts`, para que el limitador de solicitudes no interfiera con las pruebas.
- El comando `npm run test:e2e` antes ejecutaba Vitest con `vitest.config.e2e.ts`. Ahora ejecuta Jest, y el archivo de Vitest se conserva sin uso.

#### 3. Configuración y datos exclusivos de prueba

- Las pruebas usan una base de datos distinta de la de desarrollo, por ejemplo `coursehub_test`. Sus variables se definen en `.env.test`, que se crea a partir de `.env.test.example` y no se sube a Git.
- `test/setup-env.ts` carga `.env.test` antes de crear la aplicación. Si una variable ya existe en el entorno (como en GitHub Actions), no se sobrescribe.
- `test/helpers/test-app.ts` **se niega a ejecutarse si `DATABASE_NAME` no termina en `_test`**, para que una prueba nunca pueda borrar la base de desarrollo.
- Con `NODE_ENV=test` la aplicación no sincroniza el esquema. Al arrancar, el helper crea las tablas desde cero (`synchronize(true)`) únicamente en la base de pruebas.
- Las cuentas de práctica (`admin`, `teacher` y `student`) se insertan directamente en la base de pruebas y se firman con el secreto de prueba. No se usan cuentas, datos ni contraseñas personales.

#### 4. Aislamiento y repetibilidad

- `beforeEach` llama a `resetDatabase`, que ejecuta `TRUNCATE ... RESTART IDENTITY CASCADE` sobre todas las tablas de las entidades. Cada prueba crea los datos que necesita, por lo que ninguna depende de otra ni del orden de ejecución.
- Los tokens de las rutas protegidas se firman con `JwtService` (mismo secreto y mismo contenido que emite `POST /auth/login`). Así cada prueba no necesita iniciar sesión; los inicios de sesión reales se prueban de forma explícita en `auth.e2e-spec.ts`.
- El limitador de solicitudes (`@nestjs/throttler`) se sustituye por un mock exclusivo de las pruebas e2e (`test/mocks/throttler.mock.ts`), configurado con `moduleNameMapper` en `jest.config.e2e.ts`. Así las pruebas no dependen de los límites de 20 solicitudes por minuto en general y 5 en `POST /auth/login`. Esos límites se comprobaron manualmente en la Sesión 20 (`evidencias/actuacion11/`) y no forman parte de este conjunto e2e.
- Se usa `--runInBand` para que los archivos se ejecuten uno tras otro sobre la misma base.

#### 5. Casos comprobados

| Archivo | Caso | Tipo | Respuesta esperada |
|---|---|---|---|
| `app.e2e-spec.ts` | `GET /` | Ruta pública | `200` y el mensaje `CourseHub API está en línea` |
| `courses.e2e-spec.ts` | `GET /courses` | Ruta pública | `200`, lista y paginación (`meta.total`) |
| `courses.e2e-spec.ts` | `GET /courses/999999` | Rechazo | `404` con la forma uniforme de error |
| `courses.e2e-spec.ts` | `POST /courses` con docente | Ruta protegida | `201` y `createdByUserId` del docente, también en la base |
| `courses.e2e-spec.ts` | `POST /courses` sin token | Rechazo | `401` |
| `courses.e2e-spec.ts` | `POST /courses` con estudiante | Rechazo | `403` y ningún curso creado |
| `courses.e2e-spec.ts` | `POST /courses` con cuerpo inválido | Rechazo | `400` con la lista de mensajes |
| `auth.e2e-spec.ts` | `POST /auth/register` | Ruta pública | `201`, rol `student`, sin contraseña en la respuesta |
| `auth.e2e-spec.ts` | `POST /auth/register` con correo repetido | Rechazo | `409` |
| `auth.e2e-spec.ts` | `POST /auth/login` válido | Ruta pública | `200` y `accessToken` |
| `auth.e2e-spec.ts` | `POST /auth/login` con contraseña incorrecta | Rechazo | `401` `Credenciales inválidas` |
| `auth.e2e-spec.ts` | `GET /auth/me` con token | Ruta protegida | `200` con `id`, `email` y `role` |
| `auth.e2e-spec.ts` | `GET /auth/me` sin token y con token alterado | Rechazo | `401` |

#### 6. Cómo ejecutarlas localmente

1. Crear la base de pruebas (una sola vez):

```powershell
psql -U postgres -c "CREATE DATABASE coursehub_test;"
```

2. Crear `.env.test` y poner la contraseña local de PostgreSQL (si ya existe, conservarlo):

```powershell
Copy-Item .env.test.example .env.test
```

3. Ejecutar las pruebas e2e. Se recomienda ejecutarlas dos veces: el resultado debe ser idéntico.

```bash
npm run test:e2e
npm run test:e2e
```

Las pruebas e2e **sí necesitan PostgreSQL** (la base `coursehub_test`); las unitarias (`npm test`) no.

#### 7. Cómo interpretar un fallo e2e

Un fallo de Supertest indica la respuesta esperada y la recibida. Por ejemplo, `expected 200 "OK", got 201 "Created"` significa que la ruta respondió `201` y la prueba esperaba `200`. El nombre de la prueba y el archivo indican qué rama se verificaba. Si la respuesta es `500`, el filter global oculta el detalle al cliente: la traza está en el registro de la terminal.

### Sesión 26 · Automatización de calidad con GitHub Actions

El archivo `.github/workflows/quality.yml` define el flujo `quality`, que se ejecuta con cada `push` y con cada `pull_request`.

| Paso | Comando o acción | Qué señal ofrece |
|---|---|---|
| Obtener el código | `actions/checkout` | Trabaja con el commit que se verifica |
| Configurar Node.js 22 con caché de npm | `actions/setup-node` | Entorno limpio y reproducible |
| Fijar la versión de npm | `npm install --global npm@10.9.4` y `npm --version` | Misma versión de npm con la que se validó el `package-lock.json` |
| Instalar dependencias | `npm ci` | Usa exactamente `package-lock.json` |
| Análisis estático | `npm run lint` | Detecta problemas sin ejecutar el código |
| Pruebas unitarias | `npm test` | Reglas de negocio sin PostgreSQL |
| Pruebas e2e | `npm run test:e2e` | Colaboración entre capas contra PostgreSQL |
| Compilación | `npm run build` | El proyecto compila |
| Auditoría de dependencias | `npm audit --omit=dev --audit-level=high` | Señal informativa; no bloquea el flujo (`continue-on-error`) |

- **PostgreSQL de prueba:** el flujo levanta un contenedor `postgres:16` con la base `coursehub_test`, exclusivo de esa ejecución. Las variables del flujo (`DATABASE_*`, `JWT_SECRET`) son solo de prueba; no contienen secretos reales ni credenciales de producción.
- **Revisión de dependencias:** el trabajo `dependency-review` usa `actions/dependency-review-action` y se ejecuta solo en solicitudes de integración. En repositorios privados esta acción puede requerir que GitHub Advanced Security esté habilitado.
- **Sin actualizaciones al azar:** si `npm audit` o la revisión de dependencias reportan un paquete, primero se identifica el paquete afectado, su compatibilidad, las pruebas necesarias y la actualización mínima segura; no se cambian versiones sin ese análisis.
- **Alcance:** la integración continua es una señal repetible y no reemplaza la revisión de código. Este flujo no despliega la aplicación.

**Fallo controlado.** Para comprobar que el flujo reporta los errores, se cambia una expectativa en una rama de práctica (por ejemplo, `.expect(201)` por `.expect(200)` en la creación de un curso), se envía a GitHub y se verifica que el paso **Pruebas e2e (Jest + Supertest)** aparece en rojo. Después se restaura la expectativa y se comprueba que el flujo vuelve a verde.

## Avance de Etapa 4 — Semana 13: calidad integrada y automatizada

Este avance reúne las Sesiones 25 y 26.

| Requisito del avance | Estado | Dónde está |
|---|---|---|
| Pruebas e2e de una ruta pública, una ruta protegida y un caso de rechazo | Implementado | `test/courses.e2e-spec.ts` y `test/auth.e2e-spec.ts` |
| Configuración y datos exclusivos de prueba | Implementado | `.env.test.example`, `test/setup-env.ts` y `test/helpers/test-app.ts` |
| Preparación y limpieza que hacen el conjunto repetible | Implementado | `resetDatabase` en `beforeEach` y ejecución repetida con el mismo resultado |
| Flujo que instala dependencias, ejecuta pruebas y construye el proyecto | Implementado | `.github/workflows/quality.yml` |
| El README explica cómo ejecutar las verificaciones localmente | Implementado | Apartado 6 de la Sesión 25 y "Comandos disponibles" |

El estado de cada requisito se confirma con las capturas de `evidencias/actuacion15/`, que deben mostrar los resultados reales de la ejecución.

### Demostración

1. Ejecutar el conjunto e2e (`npm run test:e2e`) y mostrar la ejecución automática correcta en GitHub Actions.
2. Introducir una expectativa incorrecta en `test/courses.e2e-spec.ts` (cambiar `.expect(201)` por `.expect(200)` en la creación del curso).
3. Ejecutar `npm run test:e2e`: la prueba falla con `expected 200 "OK", got 201 "Created"`. El mensaje indica que la ruta funciona (crea el curso) y que la expectativa es la incorrecta.
4. Restaurar `.expect(201)` y comprobar que el conjunto vuelve a verde.

### Evidencias del avance (`evidencias/actuacion15/`)

| Código | Requisito o prueba | Qué muestra | Archivo |
|---|---|---|---|
| E01 | Compilación y conjuntos de pruebas | `npm run build` sin errores, `npm test` (15 suites y 68 pruebas), `npm run test:e2e` (3 suites y 14 pruebas) y `npm run lint` sin errores | `1. Compilación y pruebas arriba.png`, `1. Compilación y pruebas media1.png`, `1. Compilación y pruebas media2.png` y `1. Compilación y pruebas abajo.png` |
| E02 | Ruta pública | El caso de `GET /courses` y el de `GET /courses/999999` | `2. Ruta pública.png` |
| E03 | Ruta protegida | `POST /courses` con token de docente y `GET /auth/me` con token | `3. Ruta protegida.png` y `3. Ruta protegida auth.png` |
| E04 | Casos de rechazo | Las pruebas de `401`, `403` y `400` | `4. Casos de rechazo arriba.png` y `4. Casos de rechazo abajo.png` |
| E05 | Configuración y datos exclusivos | `.env.test.example`, el guard `_test` del helper y la base `coursehub_test` distinta de la de desarrollo | `5. Base de datos de pruebas env.png`, `5. Configuración de prueba.png` y `5. Base de datos de pruebas en PgAdmin.png` |
| E06 | Preparación, limpieza y repetibilidad | `resetDatabase` en `beforeEach` y dos ejecuciones seguidas con el mismo resultado | `6. Preparación y limpieza.png`, `6. Limpieza de base de datos.png`, `6. Primera ejecución.png` y `6. Segunda ejecución.png` |
| E07 | Flujo de integración continua | `.github/workflows/quality.yml` con instalación, pruebas y compilación | `7. Flujo quality.yml.png` |
| E08 | Ejecución automática correcta | La ejecución de `quality` en verde, con sus pasos | `8. GitHub Actions en verde por fuera.png`, `8. GitHub Actions en verde por dentro.png` y `8. GitHub Actions en verde detalles.png` |
| E09 | El README explica la ejecución local | Vista previa del apartado 6 de la Sesión 25 y de "Comandos disponibles" | `9. README verificaciones locales.png` y `9. README Comandos disponibles.png` |
| E10 | Demostración local | La expectativa incorrecta, la prueba en rojo con su mensaje y la expectativa restaurada en verde | `10. Expectativa incorrecta.png`, `10. Prueba e2e en rojo.png` y `10. Expectativa restaurada en verde.png` |
| E11 | Fallo controlado en GitHub Actions | El flujo en rojo señalando el paso que falló y, después, de nuevo en verde | `11. Actions en rojo por fuera.png`, `11. Actions en rojo por dentro.png`, `11. Actions en rojo detalle.png`, `11. Actions restaurado en verde por fuera.png` y `11. Actions restaurado en verde por dentro.png` |
| E12 | Revisión de dependencias (complementaria) | Resultado del paso `npm audit` (0 vulnerabilidades) | `12. Revisión de dependencias.png` |

Las capturas deben mostrar el resultado real obtenido. Antes de entregar, se deben ocultar las contraseñas, los secretos y los tokens completos.

### Criterio de éxito

La API se valida de punta a punta sin depender de datos manuales, y el equipo recibe una señal automática antes de integrar cambios.

## Modelo de datos

El modelo académico principal relaciona tres entidades:

```text
Student 1 ───── N Enrollment N ───── 1 Course
```

- **Student:** almacena la información de los estudiantes.
- **Course:** representa los cursos disponibles.
- **Enrollment:** relaciona un estudiante con un curso.

Un estudiante puede tener varias matrículas y un curso puede tener varios estudiantes matriculados. Cada matrícula se relaciona con un estudiante y un curso mediante relaciones y claves foráneas.

El registro de usuarios utiliza la tabla adicional `users`. Desde la Semana 10, cada curso registra además el usuario que lo creó mediante `createdByUserId`.

### Estudiante

| Campo | Descripción |
|---|---|
| `id` | Identificador del estudiante |
| `name` | Nombre del estudiante |
| `email` | Correo electrónico |
| `age` | Edad |
| `career` | Carrera |
| `semester` | Semestre |
| `isActive` | Estado de actividad |

Ejemplo de respuesta:

```json
{
  "id": 3,
  "name": "Carlos Mendoza",
  "email": "carlos.mendoza@example.edu",
  "age": 22,
  "career": "Software",
  "semester": 5,
  "isActive": true
}
```

### Curso

| Campo | Descripción |
|---|---|
| `id` | Identificador del curso |
| `title` | Título del curso |
| `level` | Nivel del curso |
| `createdByUserId` | Identificador del usuario que creó el curso (Semana 10) |

Ejemplo:

```json
{
  "id": 6,
  "title": "Curso de prueba docente",
  "level": "beginner",
  "createdByUserId": 2
}
```

`createdByUserId` se asigna a partir del usuario autenticado, no del cuerpo de la solicitud. Los cursos creados antes de la Semana 10 pueden no tener propietario asociado, según los datos existentes en la base de datos local.

### Matrícula

La entidad `Enrollment` relaciona los campos `studentId` y `courseId` con los registros correspondientes de estudiantes y cursos.

Ejemplo de solicitud:

```json
{
  "studentId": 3,
  "courseId": 3
}
```

La API verifica que existan el estudiante y el curso, que el estudiante esté activo y que no exista una matrícula duplicada para la misma combinación. En la implementación actual, la creación de matrículas también requiere autenticación mediante JWT.

### Usuario

| Campo | Descripción |
|---|---|
| `id` | Identificador generado automáticamente |
| `email` | Correo único |
| `passwordHash` | Hash de la contraseña |
| `role` | Rol del usuario: `admin`, `teacher` o `student`; predeterminado `student` (Semana 10) |
| `createdAt` | Fecha de creación |

El campo `passwordHash` almacena el resultado de bcrypt, no la contraseña en texto plano. La propiedad utiliza `select: false` para evitar su inclusión automática en consultas ordinarias.

El campo `role` es una enumeración (`UserRole`). El registro público siempre crea cuentas con el rol `student`; los roles `teacher` y `admin` se asignan de forma controlada en la base de datos.

## Endpoints de estudiantes

### Endpoints disponibles

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/students` | Consultar estudiantes con filtros, búsqueda, paginación y ordenamiento |
| `GET` | `/students/:id` | Obtener un estudiante por ID |
| `POST` | `/students` | Crear un estudiante |
| `PATCH` | `/students/:id` | Actualizar los datos de un estudiante |
| `PATCH` | `/students/:id/status` | Actualizar el estado de un estudiante |
| `DELETE` | `/students/:id` | Eliminar un estudiante, sujeto a las reglas implementadas |

### Consulta avanzada de estudiantes

La ruta `GET /students` permite combinar filtros, búsqueda textual, paginación y ordenamiento.

| Parámetro | Tipo | Descripción | Predeterminado |
|---|---|---|---|
| `search` | string | Busca por nombre o correo electrónico | — |
| `career` | string | Filtra por carrera | — |
| `semester` | number | Filtra por semestre | — |
| `isActive` | boolean | Filtra por estado activo | — |
| `page` | number | Número de página | `1` |
| `limit` | number | Cantidad de resultados por página | `10` |
| `sortBy` | string | Campo de ordenamiento | `id` |
| `order` | string | Dirección del ordenamiento | `ASC` |

El parámetro `limit` acepta valores entre `1` y `50`.

Los campos permitidos para `sortBy` son:

```text
id
name
email
age
career
semester
```

Los valores permitidos para `order` son `ASC` y `DESC`.

### Ejemplos de consulta

```http
GET /students?page=1&limit=10
GET /students?search=carlos
GET /students?career=Software&semester=5&isActive=true
GET /students?sortBy=name&order=ASC
GET /students?search=carlos&page=1&limit=5
```

La respuesta utiliza la estructura `items` y `meta`. Los valores reales dependen de los datos almacenados en la base de datos.

### Crear un estudiante

```http
POST /students
Content-Type: application/json
```

Ejemplo de cuerpo:

```json
{
  "name": "Carlos Mendoza",
  "email": "carlos.mendoza@example.edu",
  "age": 22,
  "career": "Software",
  "semester": 5,
  "isActive": true
}
```

El correo debe cumplir las reglas de validación y no estar registrado previamente.

### Consultar, actualizar y eliminar estudiantes

Consultar por ID:

```http
GET /students/3
```

Actualizar datos:

```http
PATCH /students/3
```

Actualizar estado:

```http
PATCH /students/3/status
```

Ejemplo de cuerpo:

```json
{
  "isActive": false
}
```

Eliminar:

```http
DELETE /students/3
```

La eliminación está sujeta a las reglas de negocio implementadas.

## Endpoints de cursos

### Endpoints disponibles

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| `GET` | `/courses` | Consultar cursos con filtros, paginación y ordenamiento | Sin restricción por rol |
| `GET` | `/courses/:id` | Obtener un curso por ID | Sin restricción por rol |
| `POST` | `/courses` | Crear un curso | JWT; rol `teacher` o `admin` |
| `PATCH` | `/courses/:id` | Actualizar un curso | JWT; `admin` o `teacher` propietario |
| `DELETE` | `/courses/:id` | Eliminar un curso | JWT; solo `admin` |
| `GET` | `/courses/:courseId/enrollments` | Consultar matrículas de un curso | JWT |

Las restricciones de escritura se introdujeron en la Semana 10 (véase [Semana 10](#semana-10-roles-permisos-y-propiedad-de-recursos-sesión-19)). Un token ausente o inválido produce `401 Unauthorized`; una identidad válida sin permiso produce `403 Forbidden`.

### Consulta de cursos

La ruta `GET /courses` permite filtrar por nivel y controlar la paginación y el ordenamiento.

| Parámetro | Tipo | Descripción | Predeterminado |
|---|---|---|---|
| `level` | string | Filtra por nivel | — |
| `page` | number | Número de página | `1` |
| `limit` | number | Resultados por página | `10` |
| `sortBy` | string | Campo de ordenamiento | `id` |
| `order` | string | Dirección del ordenamiento | `ASC` |

Los campos permitidos para `sortBy` son `id`, `title` y `level`. Para `order`, se admiten `ASC` y `DESC`. El límite por página es de `1` a `50` resultados.

La respuesta paginada utiliza esta estructura:

```json
{
  "items": [],
  "meta": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "totalPages": 0
  }
}
```

### Ejemplos de consulta

```http
GET /courses?page=1&limit=2&sortBy=id&order=ASC
GET /courses?page=2&limit=2&sortBy=id&order=ASC
GET /courses?level=beginner&page=1&limit=10
GET /courses?sortBy=title&order=ASC
GET /courses?sortBy=title&order=DESC
```

Los resultados dependen de los registros existentes y de los filtros enviados.

### Crear un curso

Requiere un JWT de una cuenta con rol `teacher` o `admin`:

```http
POST /courses
Authorization: Bearer <token-jwt>
Content-Type: application/json
```

Ejemplo:

```json
{
  "title": "Desarrollo Backend con NestJS",
  "level": "intermediate"
}
```

La respuesta incluye `createdByUserId`, que corresponde al usuario autenticado. Si la solicitud la realiza una cuenta `student`, se rechaza con `403 Forbidden`.

### Actualizar y eliminar un curso

```http
PATCH /courses/6
Authorization: Bearer <token-jwt>
```

Un `admin` puede actualizar cualquier curso; un `teacher` solo los que creó. Si un docente intenta modificar un curso de otro usuario, la respuesta es `403 Forbidden`.

```http
DELETE /courses/6
Authorization: Bearer <token-jwt>
```

La eliminación está reservada para el rol `admin`.

## Endpoints de matrículas

### Endpoints disponibles

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/enrollments` | Consultar matrículas con búsqueda, filtros y paginación; requiere JWT |
| `POST` | `/enrollments` | Crear una matrícula; requiere JWT |
| `GET` | `/students/:studentId/enrollments` | Consultar matrículas de un estudiante; requiere JWT |
| `GET` | `/courses/:courseId/enrollments` | Consultar matrículas de un curso; requiere JWT |
| `DELETE` | `/enrollments/:id` | Cancelar una matrícula; requiere JWT |

Desde la Semana 9, `EnrollmentsController` aplica `JwtAuthGuard` a todas sus rutas. Cada solicitud debe incluir `Authorization: Bearer <token-jwt>`; sin él, la respuesta es `401 Unauthorized`. La Semana 10 no añadió restricciones por rol a las matrículas.

### Crear una matrícula

**Endpoint protegido:** `POST /enrollments`

La solicitud debe incluir un token JWT válido:

```http
POST /enrollments
Authorization: Bearer <token-jwt>
Content-Type: application/json
```

Cuerpo:

```json
{
  "studentId": 3,
  "courseId": 3
}
```

La operación comprueba:

1. Que el usuario esté autenticado mediante un token JWT válido.
2. Que los identificadores enviados sean enteros positivos.
3. Que el estudiante exista.
4. Que el estudiante esté activo.
5. Que el curso exista.
6. Que no exista una matrícula previa para el mismo estudiante y curso.

Una solicitud sin token se rechaza con `401 Unauthorized`. Si los identificadores no cumplen las validaciones del DTO, la solicitud responde con `400 Bad Request`. Una matrícula duplicada se rechaza con `409 Conflict`.

### Consultar matrículas

La ruta `GET /enrollments` requiere `Authorization: Bearer <token-jwt>` y permite combinar los siguientes parámetros:

| Parámetro | Tipo | Descripción | Predeterminado |
|---|---|---|---|
| `search` | string | Busca por nombre del estudiante o título del curso | — |
| `studentId` | number | Filtra por estudiante | — |
| `courseId` | number | Filtra por curso | — |
| `activeOnly` | boolean | Filtra matrículas de estudiantes activos | — |
| `page` | number | Número de página | `1` |
| `limit` | number | Resultados por página | `10` |

El límite por página documentado es de `1` a `50`. Los parámetros se pueden combinar.

La respuesta paginada utiliza esta estructura:

```json
{
  "items": [],
  "meta": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "totalPages": 0
  }
}
```

### Ejemplos de consulta

```http
GET /enrollments?search=carlos
GET /enrollments?search=nestjs
GET /enrollments?studentId=3
GET /enrollments?courseId=3
GET /enrollments?activeOnly=true
GET /enrollments?search=carlos&activeOnly=true&page=1&limit=1
```

La búsqueda consulta el nombre del estudiante y el título del curso. La implementación utiliza `QueryBuilder` y parámetros para construir la consulta.

Las respuestas incluyen información relacionada con el estudiante y el curso cuando así lo establece la implementación del endpoint.

### Cancelar una matrícula

La ruta requiere `Authorization: Bearer <token-jwt>`.

```http
DELETE /enrollments/1
```

Después de cancelar una matrícula, se puede comprobar el resultado consultando nuevamente:

```http
GET /enrollments
```

## Endpoints de usuarios y autenticación

### Endpoints disponibles

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/auth/register` | Registrar una cuenta |
| `POST` | `/auth/login` | Iniciar sesión y obtener un JWT |
| `GET` | `/auth/me` | Obtener los datos públicos del usuario autenticado; requiere JWT |

`POST /auth/register` y `POST /auth/login` son públicos. Véase también [Rutas públicas y protegidas](#11-rutas-públicas-y-protegidas).

### Registro de usuarios

Solicitud:

```http
POST /auth/register
Content-Type: application/json
```

```json
{
  "email": "ana@example.com",
  "password": "ClaveSegura123"
}
```

Respuesta ilustrativa:

```json
{
  "id": 1,
  "email": "ana@example.com",
  "createdAt": "2026-10-19T19:46:24.803Z"
}
```

La respuesta no incluye el hash de la contraseña. Para repetir la prueba, se debe utilizar un correo que no esté registrado previamente. Toda cuenta registrada mediante este endpoint recibe el rol `student`.

### Inicio de sesión

Solicitud:

```http
POST /auth/login
Content-Type: application/json
```

```json
{
  "email": "ana@example.com",
  "password": "ClaveSegura123"
}
```

La API valida los datos mediante `LoginDto`, normaliza el correo, busca al usuario y recupera expresamente el hash almacenado. Después utiliza `bcrypt.compare` para verificar la contraseña. Si las credenciales son válidas, genera un token JWT firmado con el secreto configurado, que desde la Semana 10 incluye el rol del usuario, y devuelve `accessToken` junto con el objeto público `user`.

Respuesta ilustrativa:

```json
{
  "accessToken": "<token-jwt-generado>",
  "user": {
    "id": 1,
    "email": "ana@example.com",
    "createdAt": "2026-10-19T19:46:24.803Z"
  }
}
```

El valor `<token-jwt-generado>` es un marcador, no un token real. El token vence según `JWT_EXPIRES_IN` (`15m` por defecto) y no debe publicarse.

Si las credenciales son correctas, responde con `200 OK`. Si el usuario no existe o la contraseña es incorrecta, responde con el mismo error genérico `401 Unauthorized`, sin revelar cuál de las dos condiciones falló ni entregar un token.

### Consultar el usuario autenticado

Solicitud:

```http
GET /auth/me
Authorization: Bearer <token-jwt>
```

El endpoint requiere un JWT válido. Cuando el token es aceptado, devuelve `id`, `email` y `createdAt` del usuario autenticado. Si la cuenta ya no existe o su correo no coincide con el del token, responde `401 Unauthorized`.

La respuesta no incluye la contraseña ni `passwordHash`.

Si no se proporciona un token válido, la solicitud se rechaza con `401 Unauthorized`.

### Respuestas de error

| Situación | Código HTTP | Descripción |
|---|---|---|
| Registro exitoso | `201 Created` | La cuenta fue creada |
| Inicio de sesión exitoso | `200 OK` | Las credenciales fueron aceptadas |
| Correo o contraseña con formato inválido | `400 Bad Request` | Los datos no cumplen las validaciones |
| Usuario inexistente o contraseña incorrecta | `401 Unauthorized` | No se pudo autenticar al usuario |
| Token ausente, con esquema distinto de Bearer, alterado, firmado con otro secreto o expirado en una ruta protegida | `401 Unauthorized` | Se requiere autenticación válida |
| Token válido sin el rol o la propiedad requeridos | `403 Forbidden` | La identidad existe, pero no tiene permiso |
| Token válido con cuerpo inválido en una ruta protegida | `400 Bad Request` | La autenticación y la validación son capas distintas |
| Correo duplicado | `409 Conflict` | El correo ya está registrado |

Los mensajes exactos de validación dependen de las reglas configuradas en los DTOs y de las excepciones implementadas.

### Consideraciones de seguridad

- Los correos se normalizan antes de registrar o buscar cuentas.
- La contraseña se transforma en un hash mediante bcrypt.
- El hash se almacena en `passwordHash`.
- El campo `passwordHash` no se selecciona automáticamente en consultas ordinarias.
- El hash se recupera expresamente cuando se necesita verificar la contraseña.
- Las respuestas no deben exponer contraseñas ni hashes.
- La unicidad del correo se comprueba desde el servicio y la base de datos.
- El inicio de sesión emite un JWT firmado.
- Las rutas protegidas utilizan `JwtAuthGuard` y `JwtStrategy` para validar los tokens.
- Todas las rutas de matrículas, incluida `POST /enrollments`, requieren autenticación.
- Una identidad ausente o inválida produce `401`; una identidad válida sin el rol o la propiedad requeridos produce `403`.
- El payload del JWT no debe contener contraseñas ni secretos.
- El registro público siempre asigna el rol `student`; los roles superiores se asignan de forma controlada.
- La propiedad de un curso se obtiene del usuario autenticado, nunca del cuerpo de la solicitud.

## Validaciones y respuestas HTTP

La API utiliza DTOs, `class-validator`, `class-transformer` y un `ValidationPipe` global para validar los datos de entrada y los parámetros de consulta configurados.

| Código | Significado | Ejemplo |
|---|---|---|
| `200 OK` | Consulta o inicio de sesión correcto | Listar estudiantes, iniciar sesión o consultar `/auth/me` con JWT válido |
| `201 Created` | Recurso creado | Crear un estudiante, curso, matrícula o usuario |
| `400 Bad Request` | Solicitud o parámetro inválido | `page=0`, `limit=100`, correo inválido o identificador de matrícula no positivo |
| `401 Unauthorized` | Autenticación no válida | Credenciales incorrectas, token ausente o token inválido en ruta protegida |
| `403 Forbidden` | Identidad válida sin permiso | Un estudiante intenta crear un curso o un docente modifica un curso ajeno |
| `404 Not Found` | Recurso inexistente | Consultar un estudiante inexistente |
| `409 Conflict` | Conflicto con los datos | Matrícula duplicada, estudiante inactivo o correo duplicado |

Los códigos concretos dependen del endpoint y de las excepciones implementadas.

### Parámetros inválidos

Ejemplo de consulta que supera el límite máximo:

```http
GET /courses?limit=100
```

La API debe responder con `400 Bad Request` si se mantiene la validación del límite máximo de 50 resultados.

También se puede probar:

```http
GET /students?page=0
```

El número de página debe ser mayor o igual a uno.

Para comprobar la validación del DTO de matrículas, enviar una solicitud autenticada con:

```json
{
  "studentId": -1,
  "courseId": 1
}
```

El identificador negativo debe ser rechazado con `400 Bad Request`.

### Matrículas duplicadas

No se permite registrar dos veces la misma combinación:

```text
studentId + courseId
```

Respuesta ilustrativa:

```json
{
  "message": "El estudiante ya está matriculado en este curso",
  "error": "Conflict",
  "statusCode": 409
}
```

### Estudiantes inactivos

La API impide matricular estudiantes cuyo estado sea inactivo.

Ejemplo del estado:

```json
{
  "isActive": false
}
```

Respuesta ilustrativa:

```json
{
  "message": "No se puede matricular un estudiante inactivo",
  "error": "Conflict",
  "statusCode": 409
}
```

### Correos duplicados

El registro de usuarios rechaza un correo que ya existe:

```json
{
  "message": "El correo ya está registrado",
  "error": "Conflict",
  "statusCode": 409
}
```

### Búsquedas sin resultados

Cuando una búsqueda de colección no encuentra coincidencias, la respuesta esperada es una colección vacía.

Ejemplo:

```http
GET /enrollments?search=xyz999
```

Esta consulta requiere un token JWT válido. Estructura de respuesta esperada:

```json
{
  "items": [],
  "meta": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "totalPages": 0
  }
}
```

Los resultados y códigos deben comprobarse con la aplicación ejecutándose y los datos disponibles en la base de datos.

## Persistencia y pruebas de la Semana 5

Como parte de la práctica de la Semana 5 se verificó la persistencia de los datos utilizando PostgreSQL y TypeORM.

### 1. Crear un curso y un estudiante activo

Para la demostración se utilizaron registros de ejemplo:

```text
Estudiante: Carlos Mendoza
Curso: Desarrollo Backend con NestJS
```

Los identificadores reales dependen de los registros existentes en la base de datos.

### 2. Crear una matrícula válida

Solicitud:

```json
{
  "studentId": 3,
  "courseId": 3
}
```

La matrícula debe almacenarse correctamente cuando ambos registros existen, el estudiante está activo y no existe una matrícula duplicada. En la implementación actual, la solicitud debe incluir también un token JWT válido.

### 3. Reiniciar la API

Detener la aplicación y volver a iniciarla:

```bash
npm run start:dev
```

Posteriormente, consultar las matrículas:

```http
GET /enrollments
Authorization: Bearer <token-jwt>
```

La matrícula debe continuar disponible después del reinicio, siempre que no se haya eliminado y la conexión apunte a la misma base de datos.

### 4. Intentar una matrícula duplicada

Se vuelve a enviar la misma solicitud. La regla de negocio debe rechazarla con `409 Conflict`.

### 5. Intentar matricular un estudiante inactivo

Se desactiva un estudiante y se intenta crear una matrícula asociada a él. La operación debe rechazarse con `409 Conflict`.

## Actuación 3: consultas, filtros y paginación

Durante la Semana 6 se implementaron funcionalidades de consulta avanzada para cursos y matrículas. Posteriormente, se amplió el endpoint de estudiantes para incorporar búsqueda, filtros, paginación y ordenamiento.

### Demostración de cursos y matrículas

Para demostrar la paginación se pueden utilizar cinco cursos de ejemplo:

```text
NestJS desde cero
Diseño de APIs
Desarrollo Backend con NestJS
Bases de Datos con PostgreSQL
APIs REST con NestJS
```

Solicitar páginas consecutivas:

```http
GET /courses?page=1&limit=2&sortBy=id&order=ASC
GET /courses?page=2&limit=2&sortBy=id&order=ASC
```

Filtrar cursos por nivel:

```http
GET /courses?level=beginner&page=1&limit=10
```

Buscar matrículas por estudiante:

```http
GET /enrollments?search=carlos
```

Buscar matrículas por curso:

```http
GET /enrollments?search=nestjs
```

Combinar búsqueda, filtro y paginación:

```http
GET /enrollments?search=carlos&activeOnly=true&page=1&limit=1
```

Probar una petición inválida:

```http
GET /courses?limit=100
```

Buscar sin resultados:

```http
GET /enrollments?search=xyz999
```

La respuesta debe respetar los filtros enviados y presentar los metadatos correspondientes.

**Nota:** desde la Semana 9, las consultas de `/enrollments` requieren el encabezado `Authorization: Bearer <token-jwt>`. Las consultas `GET` de cursos y estudiantes no se vieron afectadas por esa protección. En la Semana 10 se comprobó que `GET /courses` y su paginación siguen funcionando después de añadir los roles.

### Demostración de consultas de estudiantes

Se pueden verificar mediante Thunder Client las siguientes consultas:

1. Consulta paginada con `page` y `limit`.
2. Búsqueda por nombre o correo electrónico.
3. Combinación de filtros por carrera, semestre y estado activo.
4. Ordenamiento por nombre.
5. Rechazo de `page=0` con `400 Bad Request`.
6. Rechazo de `limit=100` con `400 Bad Request`.

## Pruebas y evidencias

Las pruebas de los endpoints se realizan con **Thunder Client**. La base de datos se puede inspeccionar mediante **pgAdmin**.

### Evidencias de la Actuación 3

Las evidencias anteriores de cursos y matrículas se guardan en:

```text
evidencias/actuacion3/
```

Los nombres de las capturas de esa actuación son:

```text
1_Crear primer curso.png
1_Crear segundo curso.png
2_Primera página.png
2_Segunda página.png
3_Filtra cursos por nivel y comprueba los metadatos..png
4_Buscar por parte del nombre.png
4_Buscar por título del curso.png
4_Crear la matrícula.png
5_Combina búsqueda, estudiante activo y paginación..png
6_Petición inválida que responda 400.png
7_Búsqueda sin resultados.png
8_Listar estudiantes con paginación.png
9_Buscar por nombre o correo.png
10_Combinar filtros.png
11_Ordenar por nombre.png
12_Comprobar parámetro inválido.png
13_límite máximo de paginación.png
14_Consulta paginada y filtros combinados.png
15_Búsqueda y ordenamiento.png
16_Validaciones 0.png
16_Validaciones 100.png
```

Las evidencias de las actuaciones previas se encuentran en `evidencias/actuacion1/` (pruebas iniciales de matrículas, filtros y validaciones) y `evidencias/actuacion2/` (persistencia, matrícula duplicada, estudiante inactivo y cancelación).

Se deben conservar los nombres que coincidan con los archivos realmente guardados.

### Evidencias de la Semana 7

Las capturas de configuración y variables de entorno se guardan en:

```text
evidencias/actuacion4/
```

La carpeta contiene las capturas `01-compilacion-correcta.png` a `13-readme-configuracion.png`.

Las comprobaciones incluyen:

1. Archivo `.env.example` sin contraseñas reales.
2. Inicio correcto de la API con la configuración local.
3. Error de validación de Joi al utilizar un valor inválido para `NODE_ENV`.
4. Consultas de cursos con paginación y ordenamiento.
5. Creación de una matrícula y consulta después de reiniciar la API.
6. Rechazo de una matrícula duplicada con `409 Conflict`.
7. Rechazo de una matrícula para un estudiante inactivo con `409 Conflict`.
8. Consulta de matrículas con filtros combinados.
9. Parámetro inválido con respuesta `400 Bad Request`.
10. Código de `app.module.ts` que muestra la configuración de `synchronize` según el ambiente.

Las capturas deben mostrar resultados reales obtenidos durante las pruebas. No se deben presentar resultados esperados como si ya hubieran sido comprobados.

### Evidencias de la Semana 8 — Sesión 15

Las capturas del registro inicial de usuarios se guardaron en:

```text
evidencias/actuacion5/
```

| Archivo | Comprobación |
|---|---|
| `1. Confirmar la tabla users.png` | Verificación de la tabla `users` |
| `2. Registrar a Ana en Thunder Client.png` | Registro de un usuario mediante la API |
| `3. Verificar el user sin contraseña en PostgreSQL.png` | Consulta de datos del usuario sin exponer el hash |
| `4. Verificar el hash en PostgreSQL.png` | Inspección del prefijo y longitud del hash |
| `5. Probar correo duplicado.png` | Rechazo de un correo ya registrado |
| `6. Rechazar correo inválido.png` | Validación del formato del correo |
| `7. Rechazar contraseña corta.png` | Validación de longitud mínima de contraseña |
| `8. Verificar que no se crearon usuarios inválidos.png` | Comprobación de los registros después de los intentos inválidos |

### Evidencias de la Semana 8 — Etapa 3

Las capturas del avance de cuentas y autenticación se encuentran en:

```text
evidencias/actuacion6/
```

La carpeta contiene las evidencias numeradas del 01 al 10 (los números 02 y 10 agrupan varias capturas). Las evidencias deben corresponder a las verificaciones realmente realizadas durante esta etapa.

Entre las comprobaciones relevantes se encuentran:

1. Existencia de la tabla `users`.
2. Registro de un usuario mediante Thunder Client.
3. Consulta de los datos públicos del usuario sin mostrar la contraseña.
4. Verificación del hash bcrypt en PostgreSQL.
5. Rechazo de un correo duplicado con `409 Conflict`.
6. Rechazo de un correo inválido.
7. Rechazo de una contraseña que no cumple la longitud mínima.
8. Comprobación de que las solicitudes inválidas no crean cuentas.
9. Inicio de sesión con credenciales válidas.
10. Rechazo del inicio de sesión con credenciales incorrectas, correo inexistente, correo inválido y contraseña demasiado corta.
11. Pruebas de las rutas de cursos, estudiantes y matrículas en Thunder Client.

Esta lista describe el alcance de las evidencias. Cada punto debe coincidir con el contenido real de su captura; se deben conservar los nombres existentes en el repositorio y no atribuir a una imagen una comprobación que no muestre.

### Evidencias de la Semana 9 — JWT

Las capturas de autenticación y protección de rutas se encuentran en:

```text
evidencias/actuacion7/
evidencias/actuacion8/
evidencias/actuacion9/
```

El detalle de cada archivo está en la sección [Semana 9, apartado 8](#8-evidencias-de-la-semana-9).

Las evidencias documentan:

- Inicio de sesión y emisión del token JWT.
- Verificación de los datos incluidos en el payload.
- Validación de las variables de entorno para JWT.
- Rechazo de credenciales incorrectas.
- Validación de `GET /auth/me` con token válido, sin token y con token alterado.
- Rechazo de un token expirado (`401`).
- Protección de `POST /enrollments`.
- Comprobación de que una solicitud no autenticada no inserta una matrícula.
- Validación de datos inválidos en el DTO de matrículas.
- Rechazo de una matrícula duplicada.

Antes de entregar las capturas, se deben ocultar las contraseñas, los secretos y los tokens completos. No se deben publicar tokens reales en el README, en Git ni en documentación compartida.

### Evidencias de la Semana 10 — Sesión 19

Las capturas de roles, permisos y propiedad de cursos se encuentran en:

```text
evidencias/actuacion10/
```

El detalle de cada archivo está en la sección [Semana 10, apartado 11](#11-evidencias-de-la-semana-10).

Las evidencias documentan:

- Usuarios y roles en PostgreSQL, antes y después de asignar los roles de práctica.
- Compilación correcta e inicio del servidor tras importar `AuthModule` en `CoursesModule`.
- Inicio de sesión como docente y como estudiante.
- Creación de un curso por un docente, con `createdByUserId`.
- Rechazo de la creación de un curso por un estudiante.
- Modificación de un curso propio por un docente.
- Rechazo de la modificación de un curso de otro usuario.
- Eliminación de un curso temporal por un administrador.
- Consultas `GET /courses` con paginación y límites inferior y superior.
- Restauración de los roles de práctica al finalizar las pruebas.

Las comprobaciones sin captura específica están indicadas en [Semana 10, apartado 10](#10-pruebas-sin-evidencia-propia). Antes de entregar las capturas, se deben ocultar las contraseñas, los secretos y los tokens completos.

### Evidencias de la Semana 10 — Sesión 20

Las capturas de CORS, limitación de solicitudes y autorización por roles se encuentran en:

```text
evidencias/actuacion11/
```

El detalle de cada prueba está en la sección [Semana 10, Sesión 20, apartado 6](#6-pruebas-y-evidencias-de-la-sesión-20).

Las evidencias documentan:

- Cinco casos de `PATCH /courses/6`: sin token (`401`), estudiante (`403`), docente no propietario (`403`), docente propietario (`200`) y administrador (`200`).
- Ruta exclusiva de administración (`DELETE /courses/999999`) con docente y con administrador.
- CORS con origen permitido y con origen no permitido.
- Limitación de solicitudes de `POST /auth/login`: quinto intento (`200`) y sexto intento (`429`).
- `GET /auth/me` con el origen permitido, sin token (`401`) y con token (`200`).
- Configuración de seguridad en el código y documentación de HTTPS/TLS y secretos.

Antes de entregar las capturas, se deben ocultar las contraseñas, los secretos y los tokens completos.

### Evidencias de la Semana 11 — Sesión 21

Las capturas de los componentes transversales se encuentran en:

```text
evidencias/actuacion12/
```

El detalle de cada archivo está en la sección [Semana 11, Sesión 21, apartado 7](#7-pruebas-y-evidencias-de-la-sesión-21).

Las evidencias documentan:

- Compilación correcta y pruebas automatizadas del middleware, el filter y el interceptor.
- Código de los componentes y su registro global.
- Errores `400` (pipe y `ValidationPipe`), `404`, `401` y `500` con la misma forma de respuesta.
- Error inesperado sin traza ni SQL en la respuesta, con la traza solo en el log interno.
- Registro de solicitudes y encabezado `X-Response-Time`.

Antes de entregar las capturas, se deben ocultar las contraseñas, los secretos y los tokens completos.

### Evidencias de la Semana 11 — Sesión 22 y Avance de Etapa 3

Las capturas de la arquitectura en capas y de la demostración del avance se encuentran en:

```text
evidencias/actuacion13/
```

El detalle de cada archivo está en la sección [Semana 11, Sesión 22, apartado 9](#9-pruebas-y-evidencias-de-la-sesión-22-y-del-avance-de-la-semana-11).

Las evidencias documentan:

- Compilación correcta y pruebas automatizadas del caso de uso y del adaptador.
- Estructura del módulo `courses` y código de cada capa.
- Las cuatro solicitudes de la demostración (`200`, `400`, `404` y `403`) sobre `PATCH /courses/:id`.
- El log de solicitudes de esas cuatro peticiones.
- Las pruebas de la regla de negocio con un repositorio falso, sin base de datos.

Antes de entregar las capturas, se deben ocultar las contraseñas, los secretos y los tokens completos.

### Evidencias de la Semana 12 — Sesiones 23 y 24 y Avance de Etapa 4

Toda la Semana 12 comparte una sola carpeta de capturas:

```text
evidencias/actuacion14/
```

La tabla de evidencias está en el [Avance de la Etapa 4](#avance-de-etapa-4--semana-12-pruebas-unitarias-que-protegen-reglas).

Las evidencias documentan:

- Compilación correcta y conjunto de pruebas en verde (Jest: 15 suites y 68 pruebas aprobadas).
- Repositorio simulado y pruebas de éxito, recurso inexistente y regla rechazada.
- Pruebas del controlador: delegación del identificador, del DTO y de la identidad autenticada, y propagación de errores.
- Pruebas que no usan PostgreSQL ni red.
- La regla de propiedad modificada temporalmente, las pruebas en rojo y la regla restaurada.
- Informe de cobertura con Jest antes (54,45 % de sentencias) y después (61,38 %) de añadir las pruebas del guard y del servicio.

Antes de entregar las capturas, se deben ocultar las contraseñas, los secretos y los tokens completos.

### Evidencias de la Semana 13 — Sesiones 25 y 26 y Avance de Etapa 4

Toda la Semana 13 comparte una sola carpeta de capturas:

```text
evidencias/actuacion15/
```

La tabla de evidencias está en el [Avance de la Etapa 4](#avance-de-etapa-4--semana-13-calidad-integrada-y-automatizada). Documentan las pruebas e2e (ruta pública, ruta protegida y rechazos), la configuración y los datos exclusivos de prueba, la repetibilidad, el flujo de GitHub Actions y la demostración de un fallo controlado.

### Pruebas funcionales

Las pruebas realizadas en las distintas etapas incluyen:

- Creación de estudiantes.
- Creación de cursos.
- Creación de matrículas.
- Persistencia después de reiniciar la API.
- Rechazo de matrículas duplicadas.
- Rechazo de estudiantes inactivos.
- Filtrado por estudiante y por curso.
- Cancelación de matrículas.
- Paginación de cursos, matrículas y estudiantes.
- Filtrado de cursos por nivel.
- Ordenamiento de cursos.
- Búsqueda por nombre de estudiante.
- Búsqueda por título del curso.
- Filtro de estudiantes activos.
- Combinación de búsqueda, filtros y paginación.
- Validación de parámetros inválidos.
- Respuesta de colección vacía cuando no existen resultados.
- Validación de variables de entorno.
- Verificación de la conexión mediante configuración externa.
- Comprobación de la política de `synchronize` por ambiente.
- Registro de usuarios con correo y contraseña.
- Hash de contraseñas con bcrypt.
- Rechazo de correos duplicados.
- Rechazo de correos inválidos.
- Rechazo de contraseñas demasiado cortas.
- Verificación del almacenamiento del hash y de la respuesta sin contraseña.
- Inicio de sesión mediante `POST /auth/login`.
- Validación de credenciales mediante `bcrypt.compare`.
- Rechazo de credenciales incorrectas con `401 Unauthorized`.
- Comprobación de la unicidad del correo en PostgreSQL.
- Verificación de que el hash bcrypt no se expone en las respuestas.
- Comprobación de la persistencia de las cuentas en PostgreSQL.
- Emisión y validación de tokens JWT.
- Validación de `GET /auth/me` con token válido.
- Rechazo de solicitudes protegidas sin token.
- Rechazo de tokens alterados.
- Protección de las rutas de matrículas.
- Validación de identificadores de matrícula mediante DTOs.
- Verificación de que una solicitud de matrícula sin autenticación no produce inserciones.
- Rechazo de matrículas duplicadas después de autenticar al usuario.
- JWT con el rol del usuario (`teacher`) tras el inicio de sesión.
- Creación de cursos por un docente con `createdByUserId`.
- Rechazo de la creación de cursos por un estudiante.
- Modificación de un curso propio por un docente.
- Rechazo de la modificación de un curso ajeno por un docente.
- Eliminación de un curso por un administrador.
- Consulta y paginación de cursos después de añadir los roles.
- Cinco casos de autorización sobre `PATCH /courses/:id` (401, 403, 403, 200 y 200).
- CORS con origen permitido y con origen no permitido.
- Limitación de solicitudes en `POST /auth/login` (`429` en el sexto intento dentro de un minuto).
- Verificación de que `GET /auth/me` sigue exigiendo JWT con CORS habilitado.
- Rechazo de un `id` no numérico con `ParseIntPipe` (`400`).
- Respuestas de error uniformes (`400`, `401`, `404` y `500`) mediante el filter global.
- Ocultamiento de los detalles de un error inesperado en la respuesta, con registro interno.
- Registro de solicitudes y medición del tiempo de respuesta sin exponer datos sensibles.
- Actualización de cursos mediante un caso de uso con repositorio falso: propietario, administrador, docente ajeno (`403`) y curso inexistente (`404`).
- Adaptador TypeORM que traduce `findById` y `save` al repositorio de la biblioteca.
- Pruebas unitarias (Jest) del caso de uso con repositorio simulado: éxito, recurso inexistente y rechazo del docente ajeno, verificando que `save` no se llama cuando la regla rechaza.
- Comprobación de que una prueba falla cuando se modifica una expectativa y vuelve a pasar al restaurarla.
- Controlador de cursos: delegación del identificador, del DTO y de la identidad autenticada, y propagación de `ForbiddenException` y `NotFoundException` sin convertirlas en una respuesta exitosa.
- `RolesGuard`: ruta sin `@Roles()`, rol autorizado, rol no autorizado e identidad ausente.
- `CoursesService`: paginación, filtro por nivel, total de páginas y eliminación de cursos existentes e inexistentes.
- Informe de cobertura con Jest para localizar ramas sin ejercitar (61,38 % de sentencias en el resultado actual).
- Cambio temporal de la regla de propiedad: la prueba de rechazo del docente ajeno pasa a rojo y vuelve a verde al restaurarla.

Los puntos deben considerarse pruebas realizadas solo cuando se hayan confirmado con las solicitudes HTTP, las consultas a la base de datos o el código correspondiente.

## Persistencia de datos

La información del proyecto se almacena en PostgreSQL mediante TypeORM.

Las tablas principales del sistema académico son:

```text
students
courses
enrollments
```

La tabla `enrollments` relaciona estudiantes y cursos mediante claves foráneas.

La funcionalidad de registro añade la tabla:

```text
users
```

Esta tabla almacena el correo, el hash de la contraseña, el rol y la fecha de creación del usuario. La tabla `courses` almacena, además, el identificador del usuario que creó cada curso (`createdByUserId`).

La persistencia se puede verificar reiniciando la API y consultando nuevamente los registros almacenados, siempre que se utilice la misma base de datos.

La autenticación incorpora la tabla `users`, destinada a almacenar las cuentas de acceso. La contraseña original no se almacena en texto plano. La persistencia de las cuentas se comprueba consultando PostgreSQL y verificando que los registros continúan disponibles después de reiniciar la API.

Las solicitudes no autenticadas a `POST /enrollments` se rechazan antes de crear la matrícula. Esta comprobación se realizó contrastando el resultado HTTP con el recuento de registros en PostgreSQL.

Para comprobar los roles asignados a las cuentas de práctica, se puede consultar (sin mostrar hashes):

```sql
SELECT id, email, role
FROM users
ORDER BY id;
```

## Seguridad de credenciales

Las credenciales reales de PostgreSQL deben mantenerse fuera del repositorio.

El archivo `.env` contiene la configuración local y no debe publicarse cuando incluye secretos.

El archivo `.env.example` sirve como plantilla para los integrantes del proyecto:

```env
NODE_ENV=development
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=coursehub
DATABASE_USER=postgres
DATABASE_PASSWORD=change_me
JWT_SECRET=replace-with-a-long-random-local-secret
JWT_EXPIRES_IN=15m
```

El valor `change_me` es únicamente ilustrativo. Cada integrante debe configurar las credenciales que correspondan a su entorno local.

El archivo `.gitignore` debe excluir `.env` y los archivos locales de configuración que puedan contener credenciales. `JWT_SECRET` debe ser un secreto aleatorio de al menos 32 caracteres, distinto en cada entorno y nunca versionado.

Antes de publicar cambios, se puede comprobar que `.env` esté ignorado mediante:

```powershell
git check-ignore .env
```

El comando debe identificar `.env` como un archivo ignorado.

### Seguridad de contraseñas de usuarios

Las contraseñas de las cuentas no se almacenan en texto plano. El registro aplica bcrypt antes de guardar el valor en `passwordHash`. Para comprobar las credenciales durante el inicio de sesión se utiliza `bcrypt.compare`.

Además:

- La entidad establece `select: false` para `passwordHash`.
- La respuesta de registro contiene los datos públicos del usuario, no su contraseña ni el hash.
- El hash se recupera expresamente cuando se necesita verificar una contraseña.
- Los correos se normalizan antes de registrar o buscar cuentas.
- La base de datos mantiene la restricción de unicidad del correo.
- No se deben incluir contraseñas reales, tokens ni otros secretos en el README, en capturas de pantalla o en los commits.
- El JWT contiene únicamente `sub`, `email` y `role` como datos propios del payload; `iat` y `exp` se añaden para emisión y expiración.
- La vigencia configurada del token es de 15 minutos mediante `JWT_EXPIRES_IN=15m`.
- Las rutas protegidas validan el JWT mediante `JwtStrategy` y `JwtAuthGuard`; la estrategia respeta la expiración (`ignoreExpiration: false`).
- El payload se construye de forma explícita; no se pasa la entidad `User` a `signAsync`.
- Un secreto distinto en cada ambiente: si cambia, los tokens emitidos con el anterior dejan de ser válidos.
- El `.env` real no debe incluirse en archivos comprimidos ni compartirse; solo se comparte `.env.example`.
- Si un token se expone, se debe esperar a su expiración o cambiar el secreto local para invalidarlo.
- El rol predeterminado de una cuenta nueva es `student`, el de menor privilegio.
- Los roles `teacher` y `admin` se asignan de forma controlada en la base de datos; no existe un endpoint público que permita elegir el rol al registrarse.
- La propiedad de un curso (`createdByUserId`) se toma del usuario autenticado y no puede enviarse en el cuerpo de la solicitud.
- Los roles de práctica modificados durante las pruebas se restauraron al finalizar.
- En producción la API debe servirse solo mediante HTTPS/TLS; un token Bearer enviado por HTTP puede ser interceptado aunque su firma sea correcta.
- CORS admite únicamente los orígenes documentados y no sustituye a JWT ni a la autorización en el servidor.
- `POST /auth/login` está limitado a 5 solicitudes por minuto y las demás rutas a 20; la respuesta `429` no revela si las credenciales eran correctas.

## Comandos disponibles

Instalar dependencias:

```bash
npm install
```

Iniciar en desarrollo:

```bash
npm run start:dev
```

Iniciar en modo normal:

```bash
npm run start
```

Compilar el proyecto:

```bash
npm run build
```

Iniciar en producción:

```bash
npm run start:prod
```

Ejecutar pruebas unitarias (Jest):

```bash
npm run test
```

Ejecutar solo las pruebas de un archivo (por ejemplo, el caso de uso de actualización de cursos):

```bash
npm test -- update-course
```

Ejecutar las pruebas en modo observador:

```bash
npm run test:watch
```

Ejecutar las pruebas con informe de cobertura (Jest; el informe se genera en `coverage/`):

```bash
npm run test:cov
```

Ejecutar pruebas end-to-end (Jest y Supertest; requieren PostgreSQL y la base `coursehub_test` configurada en `.env.test`):

```bash
npm run test:e2e
```

Ejecutar las verificaciones del flujo de integración continua en el mismo orden:

```bash
npm run lint
npm test
npm run test:e2e
npm run build
```

Los comandos disponibles dependen de los scripts declarados en `package.json`.

## Documentación oficial

- [NestJS](https://docs.nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [Configuración de NestJS](https://docs.nestjs.com/techniques/configuration)
- [class-validator](https://github.com/typestack/class-validator)
- [class-transformer](https://github.com/typestack/class-transformer)
- [Joi](https://joi.dev/)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [Autenticación en NestJS](https://docs.nestjs.com/security/authentication)
- [@nestjs/jwt](https://github.com/nestjs/jwt)
- [Passport en NestJS](https://docs.nestjs.com/recipes/passport)
- [Guards de NestJS](https://docs.nestjs.com/guards)
- [Autorización en NestJS](https://docs.nestjs.com/security/authorization)
- [passport-jwt](https://www.passportjs.org/packages/passport-jwt/)
- [RFC 7519: JSON Web Token](https://www.rfc-editor.org/rfc/rfc7519)

## Estado del proyecto

CourseHub API cuenta con módulos de estudiantes, cursos y matrículas, persistencia mediante PostgreSQL, relaciones gestionadas con TypeORM, validación de datos de entrada, autenticación con JWT y autorización basada en roles.

Las funcionalidades documentadas incluyen:

- Gestión de estudiantes, cursos y matrículas.
- Consultas y filtros de recursos.
- Búsqueda textual por estudiante y curso.
- Paginación de cursos, matrículas y estudiantes.
- Ordenamiento mediante campos permitidos.
- Validación de parámetros de consulta.
- Control de matrículas duplicadas.
- Validación del estado activo de los estudiantes al matricular.
- Persistencia de datos después de reiniciar la API.
- Respuestas de colección vacía para búsquedas sin resultados.
- Configuración mediante variables de entorno.
- Validación de la configuración con Joi.
- Obtención de la configuración mediante `ConfigService`.
- Validaciones globales de solicitudes HTTP.
- Configuración de `synchronize` según el ambiente.
- Módulo de usuarios con entidad y servicio.
- Registro de usuarios mediante `POST /auth/register`.
- Inicio de sesión mediante `POST /auth/login`.
- Validación y normalización del correo electrónico.
- Hash de contraseñas mediante bcrypt.
- Verificación de contraseñas mediante `bcrypt.compare`.
- Prevención de correos duplicados.
- Respuestas de autenticación sin contraseña ni hash.
- Emisión de tokens JWT con `sub`, `email` y `role` en el payload.
- Validación de `JWT_SECRET` obligatorio mediante Joi.
- Configuración de expiración del token mediante `JWT_EXPIRES_IN` (15 minutos).
- Verificación de tokens mediante `JwtStrategy` (Passport) y `JwtAuthGuard`.
- Consulta del usuario autenticado mediante `GET /auth/me`.
- Protección de todas las rutas de matrículas, incluida `POST /enrollments`.
- Registro y login como rutas públicas.
- Rechazo de solicitudes protegidas sin token válido (`401`).
- Validación de datos mediante DTOs en la creación de matrículas.
- Roles `admin`, `teacher` y `student`, con `student` como predeterminado.
- Autorización mediante `@Roles()` y `RolesGuard`.
- Control de propiedad de cursos mediante `createdByUserId`.
- Restricciones de creación, modificación y eliminación de cursos según rol y propiedad, con respuestas `403 Forbidden`.
- Pruebas de inicio de sesión, payload, ausencia de secreto y cambio de secreto.
- CORS restringido a los orígenes documentados.
- Limitación de solicitudes (`@nestjs/throttler`): 20 por minuto de forma global y 5 por minuto en el inicio de sesión (`429`).
- Documentación de HTTPS/TLS y de la gestión de secretos como requisito de producción.
- Middleware de registro de solicitudes, filter global de errores, interceptor de tiempo de respuesta y `ParseIntPipe`.
- Caso de uso `UpdateCourseUseCase`, contrato `CourseRepository` y adaptador `TypeOrmCourseRepository`.
- Pruebas unitarias del caso de uso con repositorio simulado, ejecutadas con Jest (migradas desde Vitest).
- Pruebas del controlador, de `RolesGuard` y de `CoursesService`, e informe de cobertura: 15 suites y 68 pruebas aprobadas, con 61,38 % de cobertura de sentencias.
- Evidencias de las pruebas de registro, inicio de sesión, validaciones, protección de rutas, permisos por rol y controles de las Sesiones 20, 21, 22, 23 y 24.

En la Semana 6 se amplió `GET /students` para incorporar búsqueda textual, filtros combinables, paginación, ordenamiento controlado y validación de parámetros.

En la Semana 7 se trabajó en la configuración de la aplicación mediante variables de entorno, la validación de la configuración, el uso de `ConfigService` y la adaptación de la sincronización de TypeORM al ambiente de ejecución.

### Avance de la Semana 8 — Etapa 3

Se ampliaron los módulos `users` y `auth` para gestionar las cuentas de acceso de CourseHub API.

La implementación contempla el registro y el inicio de sesión mediante correo electrónico y contraseña, validaciones mediante DTOs, normalización del correo, almacenamiento de hashes con bcrypt y verificación de contraseñas mediante `bcrypt.compare`.

La tabla `users` dispone de una restricción de unicidad para el correo electrónico. También se utiliza `select: false` para evitar que el hash de la contraseña se incluya automáticamente en las consultas ordinarias.

Los endpoints de autenticación son:

- `POST /auth/register`
- `POST /auth/login`

Los códigos HTTP previstos son `201 Created` para el registro, `200 OK` para el inicio de sesión correcto, `400 Bad Request` para datos inválidos, `401 Unauthorized` para credenciales incorrectas y `409 Conflict` para correos duplicados, de acuerdo con las reglas implementadas.

Las evidencias de esta etapa se organizan en `evidencias/actuacion6/`.

### Avance de la Semana 9 — Etapa 3

En la Semana 9 se amplió el módulo de autenticación para emitir y validar tokens JWT y proteger rutas que requieren un usuario autenticado.

Las funcionalidades incorporadas incluyen:

- Emisión de JWT después de iniciar sesión correctamente.
- Validación de `JWT_SECRET` al iniciar la aplicación.
- Configuración de la expiración del token mediante `JWT_EXPIRES_IN`.
- Implementación de `JwtStrategy` (extracción del token Bearer y respeto de la expiración).
- Implementación de `JwtAuthGuard`, reutilizado en varias rutas.
- Endpoint `GET /auth/me` protegido por JWT.
- Protección de todas las rutas de matrículas, incluida `POST /enrollments`.
- Registro y login como rutas públicas.
- Rechazo de solicitudes protegidas sin token válido, con esquema distinto de Bearer, alteradas o expiradas (`401`).
- Validación de los identificadores de matrícula.
- Conservación de las reglas de negocio que impiden matrículas duplicadas.
- Verificación en PostgreSQL de que una solicitud no autenticada no inserta una matrícula.

Las evidencias de JWT y protección de rutas se guardan en `evidencias/actuacion7/`, `evidencias/actuacion8/` y `evidencias/actuacion9/`.

### Avance de la Semana 10 — Sesión 19

Se implementó la autorización basada en roles y la propiedad de los cursos.

Las funcionalidades incorporadas incluyen:

- Enumeración `UserRole` (`admin`, `teacher`, `student`) y campo `role` en `User`, con `student` como valor predeterminado.
- Inclusión del rol en el JWT.
- Decorador `@Roles()` y `RolesGuard`, aplicados después de `JwtAuthGuard`.
- Campo `createdByUserId` en `Course`, asignado desde el usuario autenticado.
- Reglas de autorización en `CoursesService` y `CoursesController`: los docentes crean cursos y solo modifican los propios, los administradores gestionan cualquier curso y son los únicos que los eliminan, y los estudiantes no pueden crear, modificar ni eliminar.
- Importación de `AuthModule` en `CoursesModule`.
- Respuestas `403 Forbidden` para identidades válidas sin permiso.

Las pruebas con evidencia comprueban el rol en el JWT, la creación de cursos por un docente, el rechazo de un estudiante, la modificación de un curso propio, el rechazo de la modificación de un curso ajeno, la eliminación por un administrador y la continuidad de las consultas `GET /courses` con paginación. Las comprobaciones sin captura propia se indican en [Semana 10, apartado 10](#10-pruebas-sin-evidencia-propia).

Las evidencias de esta etapa se guardan en `evidencias/actuacion10/`.

Los refresh tokens y la revocación de tokens no se incluyen en este avance. Los controles de seguridad adicionales se implementaron en la Sesión 20 (véase el avance siguiente).

### Avance de la Semana 10 — Sesión 20

Se incorporaron controles de seguridad para una API pública, siguiendo el enfoque de defensa en profundidad.

Las funcionalidades incorporadas incluyen:

- CORS configurado con `app.enableCors` para admitir únicamente el origen documentado (`http://localhost:5173` en desarrollo), con los métodos `GET`, `POST`, `PATCH` y `DELETE` y los encabezados `Content-Type` y `Authorization`.
- Limitación de solicitudes con `@nestjs/throttler`: `ThrottlerGuard` global con 20 solicitudes por minuto y `@Throttle` de 5 por minuto en `POST /auth/login`, que responde `429 Too Many Requests` al superar el límite.
- Comprobación de que las rutas protegidas siguen requiriendo JWT aunque CORS permita el origen.
- README con HTTPS/TLS como requisito de producción y con la gestión de secretos mediante variables de entorno.
- Respuestas a las tres preguntas conceptuales de cierre.

La demostración muestra una misma ruta (`PATCH /courses/6`) con cinco casos: sin token (`401`), token de estudiante (`403`), token de docente ajeno (`403`), token de docente propietario (`200`) y token de administrador (`200`).

Las evidencias de esta etapa se guardan en `evidencias/actuacion11/`. El detalle está en la sección [Semana 10, Sesión 20](#semana-10-controles-de-seguridad-para-una-api-pública-sesión-20).

Los refresh tokens, la revocación de tokens y la configuración de un certificado TLS local quedan fuera de este avance.

### Avance de la Semana 11 — Sesión 21

Se incorporaron los componentes transversales de NestJS para centralizar tareas que no pertenecen a los controladores.

Las funcionalidades incorporadas incluyen:

- `RequestLoggerMiddleware`: registro de cada solicitud con identificador, método, ruta, estado y duración, sin tokens, contraseñas, cuerpos ni cadenas de consulta.
- `HttpErrorFilter` (global): respuesta de error uniforme; los errores inesperados devuelven un mensaje genérico y la traza queda solo en el log interno.
- `TimingInterceptor` (global): tiempo de respuesta en el encabezado `X-Response-Time`.
- `ParseIntPipe` en los parámetros numéricos de cursos y matrículas; el `ValidationPipe` global se mantiene.
- Pruebas unitarias de los tres componentes y actualización de las pruebas de los controladores.

Las evidencias de esta etapa se guardan en `evidencias/actuacion12/`. El detalle está en la sección [Semana 11, Sesión 21](#semana-11-componentes-transversales-sesión-21).

La refactorización en capas (casos de uso, puertos y adaptadores) se implementó en la Sesión 22 (véase el avance siguiente).

### Avance de la Semana 11 — Sesión 22

Se separó la regla de actualización de cursos de HTTP y de TypeORM.

Las funcionalidades incorporadas incluyen:

- `UpdateCourseUseCase`: concentra la regla «solo el administrador o el docente propietario puede modificar un curso».
- `CourseRepository` (puerto) con solo `findById` y `save`, y `COURSE_REPOSITORY` como token de inyección.
- `TypeOrmCourseRepository` (adaptador), conectado con `provide` y `useClass` en `CoursesModule`.
- `CoursesController` delega la actualización en el caso de uso; el contrato HTTP no cambia.
- Pruebas de la regla con un repositorio falso en memoria, sin base de datos.

Las evidencias de esta etapa se guardan en `evidencias/actuacion13/`. El detalle está en la sección [Semana 11, Sesión 22](#semana-11-casos-de-uso-repositorios-y-adaptadores-sesión-22) y en el [Avance de Etapa 3](#avance-de-etapa-3--semana-11-arquitectura-mantenible-y-comportamiento-transversal).

Solo la operación de actualización de cursos se migró a este patrón; las demás operaciones continúan en sus servicios. Las pruebas unitarias del caso de uso se implementaron en la Sesión 23 (véase el avance siguiente).

### Avance de la Semana 12 — Sesión 23

Se incorporaron pruebas unitarias para la regla de propiedad de la actualización de cursos.

Las funcionalidades incorporadas incluyen:

- Pruebas de `UpdateCourseUseCase` con un repositorio falso en memoria, sin HTTP ni PostgreSQL.
- Seis casos: propietario, búsqueda con el identificador recibido, administrador, conservación del propietario, curso inexistente y rechazo del docente ajeno.
- Verificación de que `save` no se llama cuando la regla rechaza.
- Instrucciones de ejecución (`npm test -- update-course`) en el README.
- Migración posterior de estas pruebas de Vitest a Jest, sin cambios en la lógica de negocio.

Las evidencias de esta etapa se guardan en `evidencias/actuacion14/`. El detalle está en la sección [Semana 12, Sesión 23](#semana-12-pruebas-unitarias-de-reglas-de-negocio-sesión-23).

Las pruebas de controladores y la cobertura se implementaron en la Sesión 24 (véase el avance siguiente).

### Avance de la Semana 12 — Sesión 24

Se completó el conjunto de pruebas unitarias con el controlador, la autorización por rol y la cobertura.

Las funcionalidades incorporadas incluyen:

- Pruebas de `CoursesController` con el caso de uso simulado: delegación del identificador, del DTO y de la identidad autenticada, y propagación de errores.
- Pruebas de `RolesGuard` (6) y ampliación de las de `CoursesService` con `findAll` y `remove` (5).
- Configuración de cobertura mediante `jest.config.ts` y comando `npm run test:cov`.
- Al añadir estas pruebas, el conjunto original con Vitest pasó a 16 archivos y 69 pruebas (resultado histórico).
- Resultado actual con Jest: 15 suites y 68 pruebas aprobadas, 0 fallidas; cobertura de 61,38 % en sentencias, 52,60 % en ramas, 62,16 % en funciones y 61,45 % en líneas; `npm run build` sin errores.

Las evidencias de esta etapa se guardan en `evidencias/actuacion14/`. El detalle está en la sección [Semana 12, Sesión 24](#semana-12-controladores-cobertura-y-calidad-de-pruebas-sesión-24) y en el [Avance de Etapa 4](#avance-de-etapa-4--semana-12-pruebas-unitarias-que-protegen-reglas).

Las pruebas de integración y la automatización se implementaron en la Semana 13 (véase el avance siguiente).

### Avance de la Semana 13 — Sesiones 25 y 26

Se incorporaron pruebas e2e y un flujo de integración continua.

Las funcionalidades incorporadas incluyen:

- Pruebas e2e con Jest y Supertest para una ruta pública, rutas protegidas y casos de rechazo (`401`, `403`, `400`, `404` y `409`).
- Base de datos y configuración exclusivas de prueba (`.env.test`, base `coursehub_test`) con una protección que impide ejecutarlas contra otra base.
- Limpieza de datos antes de cada prueba para que el conjunto sea repetible y no dependa del orden.
- Flujo `.github/workflows/quality.yml`: `npm ci`, lint, pruebas unitarias, pruebas e2e, compilación, auditoría de dependencias y revisión de dependencias en pull requests.
- Migración del comando `npm run test:e2e` de Vitest a Jest.

Las evidencias de esta etapa se guardan en `evidencias/actuacion15/`. El detalle está en la sección [Semana 13](#semana-13-pruebas-e2e-y-automatización-de-calidad-sesiones-25-y-26) y en el [Avance de Etapa 4](#avance-de-etapa-4--semana-13-calidad-integrada-y-automatizada).

Las pruebas, las capturas y el estado del repositorio deben reflejar los resultados reales de la implementación.

## Licencia

Este proyecto se desarrolla con fines académicos para la práctica de desarrollo backend con NestJS.