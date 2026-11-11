# Sistema de Gestión Académica — CourseHub API

<p align="center">
  <a href="https://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

API REST desarrollada con **NestJS, TypeScript, PostgreSQL y TypeORM** para gestionar estudiantes, cursos y matrículas académicas. El proyecto incorpora configuración mediante variables de entorno, validaciones, consultas con filtros, búsqueda, paginación, ordenamiento y autenticación de usuarios mediante contraseñas con bcrypt, tokens JWT y protección de rutas mediante un guard de NestJS. Desde la Semana 10 (Sesión 19) incorpora además autorización basada en roles (RBAC) y control de propiedad sobre los cursos, y (Sesión 20) controles de seguridad para una API pública: CORS restringido, limitación de solicitudes y requisito de HTTPS/TLS en producción.

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
│   │   └── roles.guard.ts
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
├── users/
│   ├── entities/
│   │   └── user.entity.ts
│   ├── user-role.enum.ts
│   ├── users.module.ts
│   ├── users.service.ts
│   └── users.service.spec.ts
│
├── courses/
│   ├── dto/
│   ├── entities/
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
└── actuacion11/

.env
.env.example
.gitignore
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

Ejecutar pruebas unitarias:

```bash
npm run test
```

Ejecutar pruebas end-to-end:

```bash
npm run test:e2e
```

Generar cobertura de pruebas:

```bash
npm run test:cov
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
- Evidencias de las pruebas de registro, inicio de sesión, validaciones, protección de rutas, permisos por rol y controles de la Sesión 20.

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

Las pruebas, las capturas y el estado del repositorio deben reflejar los resultados reales de la implementación.

## Licencia

Este proyecto se desarrolla con fines académicos para la práctica de desarrollo backend con NestJS.