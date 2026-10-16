# Sistema de Gestión Académica — CourseHub API

<p align="center">
  <a href="https://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

API REST desarrollada con **NestJS, TypeScript, PostgreSQL y TypeORM** para gestionar estudiantes, cursos y matrículas académicas.

Este proyecto forma parte de las prácticas de la asignatura **Desarrollo Backend Web con NestJS**. Incluye persistencia de datos, relaciones entre entidades, validaciones, consultas con filtros, búsqueda, paginación, ordenamiento y configuración mediante variables de entorno.

## Tabla de contenidos

- [Tecnologías](#tecnologías)
- [Descripción del proyecto](#descripción-del-proyecto)
- [Arquitectura](#arquitectura)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Instalación y configuración](#instalación-y-configuración)
- [Semana 7: configuración y variables de entorno](#semana-7-configuración-y-variables-de-entorno)
- [Modelo de datos](#modelo-de-datos)
- [Endpoints de estudiantes](#endpoints-de-estudiantes)
- [Endpoints de cursos](#endpoints-de-cursos)
- [Endpoints de matrículas](#endpoints-de-matrículas)
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
- Paginación de resultados.
- Ordenamiento por campos permitidos.
- Respuestas estructuradas con `items` y `meta` para las consultas paginadas.
- Validación de parámetros inválidos.
- Control de matrículas duplicadas y estudiantes inactivos.
- Configuración mediante variables de entorno.
- Validación de la configuración al iniciar la aplicación.
- Configuración de TypeORM según el ambiente de ejecución.

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

## Estructura del proyecto

La siguiente estructura representa los módulos principales de la aplicación. La ubicación de los archivos auxiliares puede variar según la implementación actual.

```text
src/
├── courses/
│   ├── dto/
│   │   ├── create-course.dto.ts
│   │   ├── update-course.dto.ts
│   │   └── courses-query.dto.ts
│   ├── entities/
│   │   └── course.entity.ts
│   ├── courses.controller.ts
│   ├── courses.module.ts
│   └── courses.service.ts
│
├── students/
│   ├── dto/
│   │   ├── create-students.dto.ts
│   │   ├── update-students.dto.ts
│   │   └── students-query.dto.ts
│   ├── entities/
│   │   └── student.entity.ts
│   ├── pipes/
│   ├── students.controller.ts
│   ├── students.module.ts
│   └── students.service.ts
│
├── enrollments/
│   ├── dto/
│   │   ├── create-enrollment.dto.ts
│   │   └── enrollments-query.dto.ts
│   ├── entities/
│   │   └── enrollment.entity.ts
│   ├── enrollments.controller.ts
│   ├── enrollments.module.ts
│   └── enrollments.service.ts
│
├── app.module.ts
└── main.ts

.env
.env.example
.gitignore
package.json
README.md
```

## Instalación y configuración

### 1. Requisitos previos

Antes de ejecutar el proyecto, se necesita:

- Node.js y npm.
- PostgreSQL instalado y ejecutándose.
- Una base de datos para CourseHub.
- Un cliente HTTP, como Thunder Client, para probar los endpoints.

### 2. Obtener las dependencias

Desde la carpeta raíz del proyecto, ejecutar:

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

Editar el archivo `.env` y configurar los valores correspondientes al entorno local:

```env
NODE_ENV=development
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=coursehub
DATABASE_USER=postgres
DATABASE_PASSWORD=tu_password_local
```

El valor `tu_password_local` es ilustrativo y debe sustituirse por la contraseña real de PostgreSQL en el archivo local `.env`.

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

La aplicación utiliza las siguientes variables:

| Variable | Descripción | Valor predeterminado o ejemplo |
|---|---|---|
| `NODE_ENV` | Ambiente de ejecución | `development` |
| `PORT` | Puerto HTTP de la API | `3000` |
| `DATABASE_HOST` | Servidor de PostgreSQL | `localhost` |
| `DATABASE_PORT` | Puerto de PostgreSQL | `5432` |
| `DATABASE_NAME` | Nombre de la base de datos | `coursehub` |
| `DATABASE_USER` | Usuario de PostgreSQL | `postgres` |
| `DATABASE_PASSWORD` | Contraseña de PostgreSQL | Configurada localmente |

Los valores predeterminados de `NODE_ENV`, `PORT` y `DATABASE_PORT` se establecen en el esquema de configuración. Las variables de conexión obligatorias deben estar definidas para que la aplicación pueda iniciarse correctamente.

### 2. Configuración mediante ConfigModule

Se utiliza `ConfigModule` de `@nestjs/config` para cargar las variables de entorno y permitir que los módulos de la aplicación accedan a ellas.

La configuración se establece como global para que `ConfigService` pueda utilizarse sin tener que importar `ConfigModule` en cada módulo.

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

Por ejemplo, utilizar un valor no permitido para `NODE_ENV` debe producir un error de validación, en lugar de permitir que la aplicación se inicie con una configuración inválida.

### 4. ConfigService y conexión a PostgreSQL

La conexión se configura mediante `TypeOrmModule.forRootAsync` y `ConfigService`.

Este mecanismo obtiene los parámetros de conexión desde las variables de entorno, evitando escribir las credenciales directamente en `app.module.ts`.

Los parámetros utilizados son:

- Host.
- Puerto.
- Usuario.
- Contraseña.
- Nombre de la base de datos.

La opción `autoLoadEntities` permite registrar las entidades asociadas a los módulos de TypeORM que las utilizan.

### 5. Política de synchronize por ambiente

La configuración de TypeORM establece la sincronización automática del esquema según el ambiente de ejecución.

| Ambiente | Valor de `synchronize` | Propósito |
|---|---|---|
| `development` | `true` | Facilitar el desarrollo local |
| `test` | `false` | Evitar sincronización automática |
| `production` | `false` | Evitar modificaciones automáticas del esquema |

La configuración utiliza la condición:

```typescript
synchronize: environment === 'development'
```

De esta manera, `synchronize` solo se habilita cuando `NODE_ENV` tiene el valor `development`.

**Importante:** no se debe utilizar `synchronize: true` en producción. Para entornos que requieren un control explícito de los cambios del esquema, se deben utilizar migraciones de base de datos.

### 6. Validaciones globales de solicitudes HTTP

La aplicación configura `ValidationPipe` con las siguientes opciones:

- `whitelist`: elimina las propiedades que no están declaradas en los DTOs.
- `forbidNonWhitelisted`: rechaza solicitudes que incluyen propiedades no permitidas.
- `transform`: permite transformar los valores de entrada según las reglas definidas.

Estas opciones complementan la validación de los datos y parámetros de los endpoints.

### 7. Archivos de configuración

- `.env`: configuración local de la aplicación.
- `.env.example`: plantilla con nombres de variables y valores de ejemplo.
- `.gitignore`: excluye el archivo `.env` y otros archivos locales de configuración.
- `src/app.module.ts`: configura `ConfigModule`, Joi y la conexión con TypeORM.
- `src/main.ts`: configura las validaciones globales y obtiene el puerto mediante `ConfigService`.

### 8. Verificación de la configuración

Para comprobar la configuración:

1. Verificar que `.env` tenga las variables necesarias.
2. Iniciar la API con `npm run start:dev`.
3. Confirmar que NestJS inicie correctamente y que pueda conectarse a PostgreSQL.
4. Comprobar que un valor no permitido de `NODE_ENV` provoque un error de validación.
5. Ejecutar las consultas HTTP habituales para comprobar que los módulos siguen funcionando.

Las capturas de estas comprobaciones deben guardarse en la carpeta de evidencias correspondiente a la Semana 7.

## Modelo de datos

El modelo principal relaciona tres entidades:

```text
Student 1 ─────── N Enrollment N ─────── 1 Course
```

- **Student:** almacena la información de los estudiantes.
- **Course:** representa los cursos disponibles.
- **Enrollment:** relaciona un estudiante con un curso.

Un estudiante puede tener varias matrículas y un curso puede tener varios estudiantes matriculados. Cada matrícula se relaciona con un estudiante y un curso mediante las relaciones y claves foráneas correspondientes.

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

La búsqueda textual permite buscar coincidencias parciales sin distinguir entre mayúsculas y minúsculas.

### Ejemplos de consulta

Listar estudiantes con paginación:

```http
GET /students?page=1&limit=10
```

Buscar por nombre o correo:

```http
GET /students?search=carlos
```

Combinar filtros:

```http
GET /students?career=Software&semester=5&isActive=true
```

Ordenar por nombre:

```http
GET /students?sortBy=name&order=ASC
```

Buscar y paginar:

```http
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

### Ejemplos de paginación

Primera página:

```http
GET /courses?page=1&limit=2&sortBy=id&order=ASC
```

Segunda página:

```http
GET /courses?page=2&limit=2&sortBy=id&order=ASC
```

Con cinco cursos y orden ascendente por ID, se esperan dos registros en las dos primeras páginas y uno en la tercera, siempre que los cinco registros existan y no haya otros filtros activos.

### Filtrar por nivel

```http
GET /courses?level=beginner&page=1&limit=10
```

El resultado contiene los cursos que cumplen el filtro de nivel.

### Ordenar por título

Orden ascendente:

```http
GET /courses?sortBy=title&order=ASC
```

Orden descendente:

```http
GET /courses?sortBy=title&order=DESC
```

El sistema restringe los campos de ordenamiento permitidos.

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

### Buscar por estudiante

```http
GET /enrollments?search=carlos
```

La búsqueda admite coincidencias parciales en el nombre del estudiante.

### Buscar por título del curso

```http
GET /enrollments?search=nestjs
```

La búsqueda consulta el nombre del estudiante y el título del curso. La implementación utiliza `QueryBuilder` y parámetros para construir la consulta.

### Filtrar por estudiante o curso

Por estudiante:

```http
GET /enrollments?studentId=3
```

Por curso:

```http
GET /enrollments?courseId=3
```

### Filtrar por estudiantes activos

```http
GET /enrollments?activeOnly=true
```

Este filtro permite consultar las matrículas asociadas a estudiantes activos.

### Combinar búsqueda, filtros y paginación

```http
GET /enrollments?search=carlos&activeOnly=true&page=1&limit=1
```

Esta consulta combina la búsqueda textual, el filtro de estudiantes activos y la paginación.

Las respuestas incluyen información relacionada con el estudiante y el curso cuando así lo establece la implementación del endpoint.

### Cancelar una matrícula

```http
DELETE /enrollments/1
```

Después de cancelar una matrícula, se puede comprobar el resultado consultando nuevamente:

```http
GET /enrollments
```

## Validaciones y respuestas HTTP

La API utiliza DTOs, `class-validator`, `class-transformer` y un `ValidationPipe` global para validar los datos de entrada y los parámetros de consulta configurados.

| Código | Significado | Ejemplo |
|---|---|---|
| `200 OK` | Consulta correcta | Listar estudiantes o matrículas |
| `201 Created` | Recurso creado | Crear un estudiante, curso o matrícula |
| `400 Bad Request` | Solicitud o parámetro inválido | `page=0` o `limit=100` |
| `404 Not Found` | Recurso inexistente | Consultar un estudiante inexistente |
| `409 Conflict` | Conflicto con los datos | Matrícula duplicada o estudiante inactivo |

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

Respuesta esperada de la regla de negocio:

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

Respuesta esperada de la regla de negocio:

```json
{
  "message": "No se puede matricular un estudiante inactivo",
  "error": "Conflict",
  "statusCode": 409
}
```

### Búsquedas sin resultados

Cuando una búsqueda de colección no encuentra coincidencias, la respuesta esperada es una colección vacía en lugar de tratarla como un recurso inexistente.

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

Se detiene la aplicación y se vuelve a iniciar:

```bash
npm run start:dev
```

Posteriormente, se consultan las matrículas:

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

#### 1. Crear suficientes cursos

Para demostrar la paginación se pueden utilizar cinco cursos de ejemplo:

```text
NestJS desde cero
Diseño de APIs
Desarrollo Backend con NestJS
Bases de Datos con PostgreSQL
APIs REST con NestJS
```

#### 2. Solicitar páginas consecutivas

Primera página:

```http
GET /courses?page=1&limit=2&sortBy=id&order=ASC
```

Segunda página:

```http
GET /courses?page=2&limit=2&sortBy=id&order=ASC
```

Los registros concretos dependen de los datos existentes y de sus identificadores.

#### 3. Filtrar cursos por nivel

```http
GET /courses?level=beginner&page=1&limit=10
```

El resultado contiene los cursos que cumplen el filtro de nivel.

#### 4. Buscar matrículas

Por nombre del estudiante:

```http
GET /enrollments?search=carlos
```

Por título del curso:

```http
GET /enrollments?search=nestjs
```

#### 5. Combinar búsqueda, filtro y paginación

```http
GET /enrollments?search=carlos&activeOnly=true&page=1&limit=1
```

La respuesta debe respetar todos los filtros enviados y presentar los metadatos correspondientes.

#### 6. Probar una petición inválida

```http
GET /courses?limit=100
```

La API debe devolver `400 Bad Request` si el límite máximo está validado en el DTO.

#### 7. Buscar sin resultados

```http
GET /enrollments?search=xyz999
```

La consulta debe devolver una colección vacía con metadatos si no existen coincidencias.

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

Se propone guardar las nuevas capturas en:

```text
evidencias/semana7/
```

Las evidencias que se prepararán incluyen:

1. Archivo `.env.example` con las variables de entorno de ejemplo, sin contraseñas reales.
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

### Pruebas funcionales

Las pruebas realizadas en las distintas etapas incluyen:

- Creación de estudiantes.
- Creación de cursos.
- Creación de matrículas.
- Persistencia después de reiniciar la API.
- Rechazo de matrículas duplicadas.
- Rechazo de estudiantes inactivos.
- Filtrado por estudiante.
- Filtrado por curso.
- Cancelación de matrículas.
- Paginación de cursos.
- Paginación de matrículas.
- Filtrado de cursos por nivel.
- Ordenamiento de cursos.
- Búsqueda por nombre de estudiante.
- Búsqueda por título del curso.
- Filtro de estudiantes activos.
- Combinación de búsqueda, filtros y paginación.
- Validación de parámetros inválidos.
- Respuesta de colección vacía cuando no existen resultados.
- Búsqueda, filtros y ordenamiento de estudiantes.
- Validación de variables de entorno.
- Verificación de la conexión mediante configuración externa.
- Comprobación de la política de `synchronize` por ambiente.

## Persistencia de datos

La información del proyecto se almacena en PostgreSQL mediante TypeORM.

Las tablas principales son:

```text
students
courses
enrollments
```

La tabla `enrollments` relaciona estudiantes y cursos mediante claves foráneas.

Representación simplificada:

```text
students
   |
   | 1:N
   |
enrollments
   |
   | N:1
   |
courses
```

La persistencia se puede verificar reiniciando la API y consultando nuevamente los registros almacenados.

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

El valor `change_me` es únicamente ilustrativo. Cada integrante debe configurar las credenciales que correspondan a su propio entorno local.

El archivo `.gitignore` debe excluir `.env` y los archivos locales de configuración que puedan contener credenciales.

Antes de publicar cambios, se debe comprobar que no se haya incluido accidentalmente el archivo `.env`:

```powershell
git check-ignore .env
```

El comando debe identificar `.env` como un archivo ignorado.

No se deben incluir contraseñas reales, tokens ni otros secretos en el README, en capturas de pantalla o en los commits.

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
- Documentación y evidencias de las pruebas realizadas.

En la Semana 6 se amplió `GET /students` para incorporar búsqueda textual, filtros combinables, paginación, ordenamiento controlado y validación de parámetros.

En la Semana 7 se trabajó en la configuración de la aplicación mediante variables de entorno, la validación de la configuración, el uso de `ConfigService` y la adaptación de la sincronización de TypeORM al ambiente de ejecución.

Las pruebas y capturas correspondientes deben reflejar el comportamiento real de la implementación actual.

## Licencia

Este proyecto se desarrolla con fines académicos para la práctica de desarrollo backend con NestJS.