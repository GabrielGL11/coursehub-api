# Sistema de Gestión Académica — CourseHub API

<p align="center">
  <a href="https://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

API REST desarrollada con **NestJS, TypeScript, PostgreSQL y TypeORM** para gestionar estudiantes, cursos y matrículas académicas. El proyecto incorpora configuración mediante variables de entorno, validaciones, consultas con filtros, búsqueda, paginación, ordenamiento y registro e inicio de sesión de usuarios con almacenamiento seguro de contraseñas.

Este proyecto forma parte de las prácticas de la asignatura **Desarrollo Backend Web con NestJS**.

## Tabla de contenidos

- [Tecnologías](#tecnologías)
- [Descripción del proyecto](#descripción-del-proyecto)
- [Arquitectura](#arquitectura)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Instalación y configuración](#instalación-y-configuración)
- [Semana 7: configuración y variables de entorno](#semana-7-configuración-y-variables-de-entorno)
- [Semana 8: usuarios y autenticación inicial](#semana-8-usuarios-y-autenticación-inicial)
- [Modelo de datos](#modelo-de-datos)
- [Endpoints de estudiantes](#endpoints-de-estudiantes)
- [Endpoints de cursos](#endpoints-de-cursos)
- [Endpoints de matrículas](#endpoints-de-matrículas)
- [Endpoints de usuarios y autenticación](#endpoints-de-usuarios-y-autenticación)
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
- Respuestas de autenticación que no deben exponer el hash de la contraseña.

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

En el registro de usuarios, el flujo incluye la validación de los datos, la comprobación del correo electrónico, el hash de la contraseña y la persistencia del nuevo usuario. En el inicio de sesión, se recupera expresamente el hash y se compara con la contraseña recibida mediante bcrypt.

## Estructura del proyecto

La siguiente estructura resume los módulos principales. Es orientativa y debe mantenerse sincronizada con los archivos que existan realmente en el repositorio.

```text
src/
├── auth/
│   ├── dto/
│   │   ├── register.dto.ts
│   │   └── login.dto.ts
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── auth.controller.spec.ts
│   └── auth.service.spec.ts
│
├── users/
│   ├── entities/
│   │   └── user.entity.ts
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
├── actuacion3/
├── actuacion5/
└── actuacion6/

.env
.env.example
.gitignore
package.json
README.md
```

La estructura es orientativa; se deben conservar los nombres y archivos que existan realmente en el repositorio.

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
```

El valor `tu_password_local` es ilustrativo y debe sustituirse por la contraseña local de PostgreSQL.

**Importante:** no publicar el archivo `.env` cuando contiene credenciales reales. El archivo que se comparte en el repositorio es `.env.example`, sin secretos personales.

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
- `.env.example`: plantilla con variables de ejemplo.
- `.gitignore`: excluye el archivo `.env` y otros archivos locales.
- `src/app.module.ts`: configuración de módulos, Joi y TypeORM.
- `src/main.ts`: configuración de validaciones globales y puerto HTTP.

## Semana 8: usuarios y autenticación inicial

Durante la Semana 8, correspondiente al avance de la Etapa 3, se amplió el módulo de cuentas de CourseHub API. Además del registro de usuarios, se incorporó el inicio de sesión mediante correo electrónico y contraseña.

La implementación utiliza NestJS, TypeScript, PostgreSQL, TypeORM y bcrypt. Los módulos `users` y `auth` mantienen separadas la administración de las cuentas y la lógica de autenticación de los módulos académicos.

### 1. Módulo users

El módulo `users` administra las cuentas almacenadas en PostgreSQL.

Archivos principales:

- `src/users/entities/user.entity.ts`
- `src/users/users.module.ts`
- `src/users/users.service.ts`

La entidad `User` contiene los siguientes campos:

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

Cuando el usuario no existe o la contraseña es incorrecta, el servicio debe utilizar un error de autenticación que no revele cuál de las dos comprobaciones falló.

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

La tabla `users` almacena el identificador, el correo, el hash de la contraseña y la fecha de creación.

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

La carpeta contiene las evidencias numeradas del 01 al 11, correspondientes a las comprobaciones realizadas durante la Semana 8.

Las capturas documentan las pruebas de los módulos de usuarios y autenticación, el registro, las validaciones, el inicio de sesión y la persistencia en PostgreSQL, según el contenido real de cada archivo.

Se deben conservar los nombres existentes de las capturas y relacionar cada una con la prueba que realmente muestra.

### 10. Alcance actual de la autenticación

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

La emisión y validación de tokens JWT, los guards de autenticación y la autorización mediante roles no forman parte del alcance implementado que se documenta en este avance. Estas funcionalidades deberán añadirse cuando estén desarrolladas y verificadas.

## Modelo de datos

El modelo académico principal relaciona tres entidades:

```text
Student 1 ───── N Enrollment N ───── 1 Course
```

- **Student:** almacena la información de los estudiantes.
- **Course:** representa los cursos disponibles.
- **Enrollment:** relaciona un estudiante con un curso.

Un estudiante puede tener varias matrículas y un curso puede tener varios estudiantes matriculados. Cada matrícula se relaciona con un estudiante y un curso mediante relaciones y claves foráneas.

El registro de usuarios utiliza la tabla adicional `users`.

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

Ejemplo:

```json
{
  "id": 3,
  "title": "Desarrollo Backend con NestJS",
  "level": "intermediate"
}
```

### Matrícula

La entidad `Enrollment` relaciona los campos `studentId` y `courseId` con los registros correspondientes de estudiantes y cursos.

Ejemplo de solicitud:

```json
{
  "studentId": 3,
  "courseId": 3
}
```

La API verifica que existan el estudiante y el curso, que el estudiante esté activo y que no exista una matrícula duplicada para la misma combinación.

### Usuario

| Campo | Descripción |
|---|---|
| `id` | Identificador generado automáticamente |
| `email` | Correo único |
| `passwordHash` | Hash de la contraseña |
| `createdAt` | Fecha de creación |

El campo `passwordHash` almacena el resultado de bcrypt, no la contraseña en texto plano.

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

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/courses` | Consultar cursos con filtros, paginación y ordenamiento |
| `GET` | `/courses/:id` | Obtener un curso por ID |
| `POST` | `/courses` | Crear un curso |
| `GET` | `/courses/:courseId/enrollments` | Consultar matrículas de un curso |

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

```http
POST /courses
Content-Type: application/json
```

Ejemplo:

```json
{
  "title": "Desarrollo Backend con NestJS",
  "level": "intermediate"
}
```

## Endpoints de matrículas

### Endpoints disponibles

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/enrollments` | Consultar matrículas con búsqueda, filtros y paginación |
| `POST` | `/enrollments` | Crear una matrícula |
| `GET` | `/students/:studentId/enrollments` | Consultar matrículas de un estudiante |
| `GET` | `/courses/:courseId/enrollments` | Consultar matrículas de un curso |
| `DELETE` | `/enrollments/:id` | Cancelar una matrícula |

### Crear una matrícula

```http
POST /enrollments
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

1. Que el estudiante exista.
2. Que el estudiante esté activo.
3. Que el curso exista.
4. Que no exista una matrícula previa para el mismo estudiante y curso.

### Consultar matrículas

La ruta `GET /enrollments` permite combinar los siguientes parámetros:

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
| `POST` | `/auth/login` | Iniciar sesión y verificar credenciales |

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

La respuesta no incluye el hash de la contraseña. Para repetir la prueba, se debe utilizar un correo que no esté registrado previamente.

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

La API valida los datos mediante `LoginDto`, normaliza el correo, busca al usuario y recupera expresamente el hash almacenado. Después utiliza `bcrypt.compare` para verificar la contraseña.

Si las credenciales son correctas, responde con `200 OK` y los datos públicos del usuario. Si el usuario no existe o la contraseña es incorrecta, debe responder con `401 Unauthorized` sin revelar cuál de las dos condiciones falló.

### Respuestas de error

| Situación | Código HTTP | Descripción |
|---|---|---|
| Registro exitoso | `201 Created` | La cuenta fue creada |
| Inicio de sesión exitoso | `200 OK` | Las credenciales fueron aceptadas |
| Correo o contraseña con formato inválido | `400 Bad Request` | Los datos no cumplen las validaciones |
| Usuario inexistente o contraseña incorrecta | `401 Unauthorized` | No se pudo autenticar al usuario |
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
- El inicio de sesión descrito no implica que existan JWT, guards o roles.

## Validaciones y respuestas HTTP

La API utiliza DTOs, `class-validator`, `class-transformer` y un `ValidationPipe` global para validar los datos de entrada y los parámetros de consulta configurados.

| Código | Significado | Ejemplo |
|---|---|---|
| `200 OK` | Consulta o inicio de sesión correcto | Listar estudiantes o autenticar un usuario |
| `201 Created` | Recurso creado | Crear un estudiante, curso, matrícula o usuario |
| `400 Bad Request` | Solicitud o parámetro inválido | `page=0`, `limit=100` o correo inválido |
| `401 Unauthorized` | Credenciales no válidas | Inicio de sesión fallido |
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

Estructura de respuesta esperada:

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

La matrícula debe almacenarse correctamente cuando ambos registros existen, el estudiante está activo y no existe una matrícula duplicada.

### 3. Reiniciar la API

Detener la aplicación y volver a iniciarla:

```bash
npm run start:dev
```

Posteriormente, consultar las matrículas:

```http
GET /enrollments
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

Los nombres documentados para las capturas de esa actuación son:

```text
01-cursos-creados.png
02-pagina-1-cursos.png
03-pagina-2-cursos.png
04-filtro-por-nivel.png
05-matricula-creada.png
06-matriculas-listadas.png
07-busqueda-por-estudiante.png
08-busqueda-por-curso.png
09-busqueda-activo-paginacion.png
10-peticion-invalida-400.png
11-busqueda-sin-resultados.png
```

Se deben conservar los nombres que coincidan con los archivos realmente guardados.

### Evidencias de la Semana 7

Las capturas de configuración y variables de entorno deben guardarse en la carpeta de evidencias correspondiente a esa actividad.

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

La carpeta contiene 11 capturas numeradas del 01 al 11. Las evidencias deben corresponder a las verificaciones realmente realizadas durante esta etapa.

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
10. Rechazo del inicio de sesión con credenciales incorrectas.
11. Comprobaciones adicionales del módulo de autenticación y su funcionamiento.

Esta lista describe el alcance de las evidencias. Cada punto debe coincidir con el contenido real de su captura; se deben conservar los nombres existentes en el repositorio y no atribuir a una imagen una comprobación que no muestre.

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

Los puntos de autenticación deben considerarse pruebas realizadas solo cuando se hayan confirmado con las solicitudes HTTP, las consultas a la base de datos o el código correspondiente.

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

Esta tabla almacena el correo, el hash de la contraseña y la fecha de creación del usuario.

La persistencia se puede verificar reiniciando la API y consultando nuevamente los registros almacenados, siempre que se utilice la misma base de datos.

La autenticación incorpora la tabla `users`, destinada a almacenar las cuentas de acceso. La contraseña original no se almacena en texto plano. La persistencia de las cuentas se comprueba consultando PostgreSQL y verificando que los registros continúan disponibles después de reiniciar la API.

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
```

El valor `change_me` es únicamente ilustrativo. Cada integrante debe configurar las credenciales que correspondan a su entorno local.

El archivo `.gitignore` debe excluir `.env` y los archivos locales de configuración que puedan contener credenciales.

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

La autenticación documentada corresponde al registro y al inicio de sesión. No se debe afirmar que existen tokens JWT, guards o roles hasta que estas funcionalidades estén implementadas y verificadas.

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

## Estado del proyecto

CourseHub API cuenta con módulos de estudiantes, cursos y matrículas, persistencia mediante PostgreSQL, relaciones gestionadas con TypeORM y validación de datos de entrada.

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
- Evidencias de las pruebas de registro, inicio de sesión y validaciones.

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

El alcance actual no incluye la emisión y validación de JWT, los guards de autenticación ni los roles de autorización. Estas funcionalidades deberán documentarse cuando estén implementadas y verificadas.

Las pruebas, las capturas y el estado del repositorio deben reflejar los resultados reales de la implementación.

## Licencia

Este proyecto se desarrolla con fines académicos para la práctica de desarrollo backend con NestJS.