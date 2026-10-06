<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Sistema de Gestión Académica - CourseHub API

API REST desarrollada con **NestJS**, **TypeScript**, **PostgreSQL** y **TypeORM** para gestionar estudiantes, cursos y matrículas académicas.

El proyecto forma parte de la práctica de **Desarrollo Backend Web con NestJS** y actualmente incorpora:

* Persistencia de datos mediante PostgreSQL y TypeORM.
* CRUD de estudiantes y cursos.
* Gestión de matrículas.
* Validación de datos mediante DTOs.
* Relaciones entre estudiantes, cursos y matrículas.
* Paginación de cursos.
* Filtrado de cursos por nivel.
* Ordenamiento seguro de cursos.
* Búsqueda de matrículas por estudiante o curso.
* Filtros de matrículas por estudiante, curso y estado activo.
* Paginación de matrículas.
* Validación de parámetros y respuestas HTTP coherentes.

---

# Tecnologías utilizadas

* **NestJS**
* **TypeScript**
* **Node.js**
* **PostgreSQL**
* **TypeORM**
* **class-validator**
* **class-transformer**
* **Thunder Client** para pruebas de la API
* **pgAdmin** para administrar y verificar la base de datos

---

# Descripción del proyecto

El sistema permite gestionar:

* Estudiantes.
* Cursos.
* Matrículas.

La aplicación implementa una API REST donde los datos se almacenan de forma persistente en **PostgreSQL** mediante **TypeORM**.

La relación principal del sistema es:

```text
Student
   │
   │ 1:N
   ▼
Enrollment
   ▲
   │ N:1
   │
Course
```

Un estudiante puede tener varias matrículas y un curso puede tener varios estudiantes matriculados.

---

# Arquitectura

El proyecto utiliza la estructura modular de NestJS:

```text
Cliente
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Repository / TypeORM
   │
   ▼
PostgreSQL
```

## Flujo de una solicitud

Por ejemplo, al crear una matrícula:

```text
POST /enrollments
        │
        ▼
EnrollmentsController
        │
        ▼
EnrollmentsService
        │
        ├── Verifica que el estudiante exista
        ├── Verifica que el estudiante esté activo
        ├── Verifica que el curso exista
        ├── Verifica que no exista una matrícula duplicada
        │
        ▼
TypeORM Repository
        │
        ▼
PostgreSQL
```

---

# Módulos principales

## Students

Gestiona la información de los estudiantes.

Cada estudiante contiene:

* `id`
* `name`
* `email`
* `age`
* `career`
* `semester`
* `isActive`

Ejemplo:

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

---

## Courses

Gestiona los cursos disponibles.

Cada curso contiene:

* `id`
* `title`
* `level`

Ejemplo:

```json
{
  "id": 3,
  "title": "Desarrollo Backend con NestJS",
  "level": "intermediate"
}
```

---

## Enrollments

Gestiona las matrículas entre estudiantes y cursos.

Cada matrícula relaciona:

```text
studentId
courseId
```

La entidad `Enrollment` utiliza relaciones `ManyToOne` con:

* `Student`
* `Course`

Relación:

```text
Student 1 ──────── N Enrollment N ──────── 1 Course
```

---

# Persistencia con PostgreSQL y TypeORM

El proyecto utiliza **PostgreSQL** como sistema de gestión de base de datos.

TypeORM permite conectar las entidades de NestJS con las tablas de PostgreSQL.

Las principales tablas utilizadas son:

```text
students
courses
enrollments
```

La tabla `enrollments` mantiene las relaciones entre estudiantes y cursos.

La configuración de la conexión se realiza mediante variables de entorno.

Ejemplo:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=coursehub
DATABASE_USER=postgres
DATABASE_PASSWORD=********
```

> La contraseña real no debe subirse al repositorio.

Se recomienda mantener las credenciales reales en `.env` y utilizar `.env.example` como plantilla.

---

# Configuración del proyecto

## 1. Instalar dependencias

```bash
npm install
```

## 2. Configurar PostgreSQL

Crear una base de datos PostgreSQL y configurar las variables correspondientes en `.env`.

Ejemplo:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=coursehub
DATABASE_USER=postgres
DATABASE_PASSWORD=tu_password
```

## 3. Ejecutar el proyecto

### Modo desarrollo

```bash
npm run start
```

### Modo watch

```bash
npm run start:dev
```

### Modo producción

```bash
npm run start:prod
```

La API se ejecuta actualmente en:

```text
http://localhost:3000
```

---

# Endpoints principales

# Students

## Obtener todos los estudiantes

```http
GET /students
```

## Obtener un estudiante

```http
GET /students/:id
```

## Crear un estudiante

```http
POST /students
```

Ejemplo:

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

## Actualizar el estado de un estudiante

```http
PATCH /students/:id/status
```

---

# Courses

## Obtener cursos con paginación

```http
GET /courses
```

El endpoint permite consultar cursos mediante los siguientes parámetros:

| Parámetro | Tipo   | Obligatorio | Descripción                | Valor predeterminado |
| --------- | ------ | ----------- | -------------------------- | -------------------- |
| `level`   | string | No          | Filtra por nivel           | —                    |
| `page`    | number | No          | Número de página           | `1`                  |
| `limit`   | number | No          | Resultados por página      | `10`                 |
| `sortBy`  | string | No          | Campo de ordenamiento      | `id`                 |
| `order`   | string | No          | Dirección del ordenamiento | `ASC`                |

Los valores permitidos para `sortBy` son:

```text
id
title
level
```

Los valores permitidos para `order` son:

```text
ASC
DESC
```

El parámetro `limit` acepta valores entre:

```text
1 y 50
```

La respuesta siempre utiliza la siguiente estructura:

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

---

## Ejemplo de paginación

Primera página:

```http
GET /courses?page=1&limit=2&sortBy=id&order=ASC
```

Segunda página:

```http
GET /courses?page=2&limit=2&sortBy=id&order=ASC
```

Con los datos utilizados durante la demostración:

```text
Página 1 → ID 1, ID 2
Página 2 → ID 3, ID 4
Página 3 → ID 5
```

Esto permite comprobar que los resultados se distribuyen correctamente y que no existen elementos repetidos entre páginas consecutivas.

---

## Ejemplo de filtro por nivel

```http
GET /courses?level=beginner&page=1&limit=10
```

Ejemplo de respuesta:

```json
{
  "items": [
    {
      "id": 1,
      "title": "NestJS desde cero",
      "level": "beginner"
    },
    {
      "id": 4,
      "title": "Bases de Datos con PostgreSQL",
      "level": "beginner"
    }
  ],
  "meta": {
    "total": 2,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

## Ejemplo de ordenamiento

Orden ascendente por título:

```http
GET /courses?sortBy=title&order=ASC
```

Orden descendente por título:

```http
GET /courses?sortBy=title&order=DESC
```

El sistema restringe los campos de ordenamiento permitidos para evitar utilizar campos no autorizados.

---

## Obtener un curso

```http
GET /courses/:id
```

## Crear un curso

```http
POST /courses
```

Ejemplo:

```json
{
  "title": "Desarrollo Backend con NestJS",
  "level": "intermediate"
}
```

---

# Enrollments

## Crear una matrícula

```http
POST /enrollments
```

Ejemplo:

```json
{
  "studentId": 3,
  "courseId": 3
}
```

La API verifica:

1. Que el estudiante exista.
2. Que el estudiante esté activo.
3. Que el curso exista.
4. Que no exista una matrícula previa para el mismo estudiante y curso.

---

# Consulta de matrículas

## Obtener matrículas

```http
GET /enrollments
```

El endpoint permite utilizar los siguientes parámetros:

| Parámetro    | Tipo    | Obligatorio | Descripción                                        | Valor predeterminado |
| ------------ | ------- | ----------- | -------------------------------------------------- | -------------------- |
| `search`     | string  | No          | Busca por nombre del estudiante o título del curso | —                    |
| `studentId`  | number  | No          | Filtra por estudiante                              | —                    |
| `courseId`   | number  | No          | Filtra por curso                                   | —                    |
| `activeOnly` | boolean | No          | Muestra solamente estudiantes activos              | —                    |
| `page`       | number  | No          | Número de página                                   | `1`                  |
| `limit`      | number  | No          | Resultados por página                              | `10`                 |

El límite de resultados por página acepta valores entre:

```text
1 y 50
```

La respuesta utiliza la estructura:

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

---

## Búsqueda por nombre del estudiante

```http
GET /enrollments?search=carlos
```

La búsqueda es insensible a mayúsculas y minúsculas.

También puede buscarse solamente una parte del nombre:

```http
GET /enrollments?search=carl
```

---

## Búsqueda por título del curso

```http
GET /enrollments?search=nestjs
```

La búsqueda consulta tanto el nombre del estudiante como el título del curso.

Internamente se utiliza `QueryBuilder` y parámetros para realizar la búsqueda de forma segura.

---

## Filtrar por estudiante

```http
GET /enrollments?studentId=3
```

## Filtrar por curso

```http
GET /enrollments?courseId=3
```

## Filtrar estudiantes activos

```http
GET /enrollments?activeOnly=true
```

---

## Combinar búsqueda, estudiante activo y paginación

Ejemplo utilizado durante la demostración:

```http
GET /enrollments?search=carlos&activeOnly=true&page=1&limit=1
```

Esta consulta permite demostrar simultáneamente:

* Búsqueda por nombre.
* Filtrado de estudiantes activos.
* Paginación.

Resultado utilizado:

```json
{
  "items": [
    {
      "id": 2,
      "student": {
        "id": 3,
        "name": "Carlos Mendoza",
        "isActive": true
      },
      "course": {
        "id": 3,
        "title": "Desarrollo Backend con NestJS"
      }
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 1,
    "totalPages": 1
  }
}
```

---

## Rutas específicas de matrículas

También existen las siguientes rutas:

```http
GET /students/:studentId/enrollments
```

```http
GET /courses/:courseId/enrollments
```

---

## Cancelar una matrícula

```http
DELETE /enrollments/:id
```

Ejemplo:

```http
DELETE /enrollments/1
```

---

# Validaciones de matrículas

El sistema evita que se realicen operaciones inválidas.

## Estudiante inexistente

Si se intenta matricular un estudiante que no existe, la API devuelve un error.

## Curso inexistente

Si se intenta utilizar un curso que no existe, la API devuelve un error.

## Estudiante inactivo

Un estudiante con:

```json
{
  "isActive": false
}
```

no puede ser matriculado.

La API devuelve:

```json
{
  "message": "No se puede matricular un estudiante inactivo",
  "error": "Conflict",
  "statusCode": 409
}
```

## Matrícula duplicada

No se permite registrar dos veces la misma combinación:

```text
studentId + courseId
```

La API devuelve:

```json
{
  "message": "El estudiante ya está matriculado en este curso",
  "error": "Conflict",
  "statusCode": 409
}
```

---

# Validación de parámetros de consulta

Los parámetros de paginación y consulta son validados mediante DTOs y `class-validator`.

Por ejemplo, el límite máximo permitido es `50`.

Una petición como:

```http
GET /courses?limit=100
```

responde:

```json
{
  "message": [
    "limit must not be greater than 50"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

Esto demuestra que los parámetros inválidos son rechazados mediante una respuesta HTTP `400 Bad Request`.

---

# Búsquedas sin resultados

Cuando una búsqueda no encuentra coincidencias, la API no devuelve `404`.

En su lugar, responde correctamente con una colección vacía.

Ejemplo:

```http
GET /enrollments?search=xyz999
```

Respuesta:

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

Esto mantiene un contrato consistente para las consultas de colección.

---

# Práctica de persistencia y matrículas — Semana 5

Como parte de la práctica de la Semana 5 se verificó el funcionamiento de la persistencia utilizando PostgreSQL y TypeORM.

## 1. Crear un curso y un estudiante activo

Se utilizó un estudiante activo:

```text
Nombre: Carlos Mendoza
ID: 3
Estado: activo
```

Y un curso:

```text
Título: Desarrollo Backend con NestJS
ID: 3
Nivel: intermediate
```

---

## 2. Crear una matrícula válida

Se utilizó:

```json
{
  "studentId": 3,
  "courseId": 3
}
```

La matrícula fue almacenada correctamente en PostgreSQL.

---

## 3. Reiniciar la API

Se detuvo la aplicación y se volvió a iniciar:

```bash
npm run start:dev
```

Posteriormente se realizó:

```http
GET /enrollments
```

La matrícula continuó disponible.

Esto demuestra que los datos son persistentes y no dependen de un arreglo almacenado únicamente en memoria.

---

## 4. Intentar una matrícula duplicada

Se volvió a enviar:

```json
{
  "studentId": 3,
  "courseId": 3
}
```

La API respondió:

```json
{
  "message": "El estudiante ya está matriculado en este curso",
  "error": "Conflict",
  "statusCode": 409
}
```

Se comprobó correctamente el rechazo de matrículas duplicadas.

---

## 5. Intentar matricular un estudiante inactivo

Se desactivó el estudiante correspondiente y posteriormente se intentó crear una matrícula.

La API respondió:

```json
{
  "message": "No se puede matricular un estudiante inactivo",
  "error": "Conflict",
  "statusCode": 409
}
```

La operación fue rechazada correctamente.

---

# Actuación 3 — Consultas, filtros y paginación

Durante la Semana 6 se implementaron y probaron funcionalidades de consulta avanzada para cursos y matrículas.

## Demostración realizada

### 1. Crear suficientes cursos

Se utilizaron cinco cursos para demostrar la paginación:

```text
ID 1 → NestJS desde cero
ID 2 → Diseño de APIs
ID 3 → Desarrollo Backend con NestJS
ID 4 → Bases de Datos con PostgreSQL
ID 5 → APIs REST con NestJS
```

---

### 2. Solicitar dos páginas consecutivas

Primera página:

```http
GET /courses?page=1&limit=2&sortBy=id&order=ASC
```

Resultado:

```text
ID 1
ID 2
```

Segunda página:

```http
GET /courses?page=2&limit=2&sortBy=id&order=ASC
```

Resultado:

```text
ID 3
ID 4
```

Los resultados no presentan elementos repetidos entre las páginas.

Los metadatos permiten verificar:

```text
total: 5
limit: 2
totalPages: 3
```

---

### 3. Filtrar cursos por nivel

Se utilizó:

```http
GET /courses?level=beginner&page=1&limit=10
```

Resultado:

```text
ID 1 → NestJS desde cero
ID 4 → Bases de Datos con PostgreSQL
```

Metadatos:

```json
{
  "total": 2,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

---

### 4. Buscar matrículas

Por parte del nombre del estudiante:

```http
GET /enrollments?search=carlos
```

Por parte del título del curso:

```http
GET /enrollments?search=nestjs
```

Ambas búsquedas permitieron encontrar la matrícula relacionada con Carlos Mendoza y el curso Desarrollo Backend con NestJS.

---

### 5. Combinar búsqueda, estudiante activo y paginación

Se utilizó:

```http
GET /enrollments?search=carlos&activeOnly=true&page=1&limit=1
```

Resultado:

```text
Estudiante: Carlos Mendoza
Estado: activo
Página: 1
Límite: 1
Total: 1
```

---

### 6. Petición inválida

Se probó:

```http
GET /courses?limit=100
```

La API respondió:

```json
{
  "message": [
    "limit must not be greater than 50"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

Se comprobó correctamente la validación de parámetros.

---

### 7. Búsqueda sin resultados

Se realizó:

```http
GET /enrollments?search=xyz999
```

La API respondió:

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

Se comprobó que una colección vacía responde correctamente con `200` y no con `404`.

---

# Evidencias

Las evidencias de la Actuación 3 se encuentran en:

```text
evidencias/actuacion3/
```

Incluyen capturas de:

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

Estas evidencias permiten verificar el funcionamiento de la paginación, filtros, búsquedas, validaciones y consultas relacionadas.

---

# Filtrado de matrículas

Por estudiante:

```http
GET /enrollments?studentId=3
```

Por curso:

```http
GET /enrollments?courseId=3
```

Estas consultas permiten obtener las matrículas asociadas a un estudiante o curso específico.

---

# Cancelación de matrículas

Se utiliza:

```http
DELETE /enrollments/:id
```

Ejemplo:

```http
DELETE /enrollments/1
```

Posteriormente se puede comprobar la eliminación mediante:

```http
GET /enrollments
```

---

# Estructura del proyecto

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
│   ├── entities/
│   │   └── student.entity.ts
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
```

---

# Flujo de datos

```text
                 ┌─────────────────┐
                 │     Cliente     │
                 │ Thunder Client  │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │   Controller    │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │     Service     │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │     TypeORM     │
                 │    Repository   │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │   PostgreSQL    │
                 └─────────────────┘
```

---

# Pruebas realizadas

Las pruebas de la API se realizaron utilizando **Thunder Client**.

Se verificaron:

* Creación de estudiantes.
* Creación de cursos.
* Creación de matrículas.
* Persistencia después de reiniciar la API.
* Rechazo de matrículas duplicadas.
* Rechazo de estudiantes inactivos.
* Filtrado por estudiante.
* Filtrado por curso.
* Cancelación de matrículas.
* Verificación de eliminación.
* Paginación de cursos.
* Paginación de matrículas.
* Filtrado de cursos por nivel.
* Ordenamiento de cursos.
* Búsqueda por nombre de estudiante.
* Búsqueda por título de curso.
* Filtro de estudiantes activos.
* Combinación de búsqueda, filtros y paginación.
* Validación de parámetros inválidos.
* Respuesta de colección vacía cuando no existen resultados.

---

# Base de datos

La aplicación utiliza PostgreSQL para almacenar permanentemente la información.

Tablas principales:

```text
students
courses
enrollments
```

Relación:

```text
students
   │
   │
   └──────< enrollments >──────┐
                               │
                               │
                            courses
```

La tabla `enrollments` funciona como entidad intermedia entre estudiantes y cursos.

---

# Seguridad de credenciales

Las credenciales de PostgreSQL no deben almacenarse directamente en el código fuente.

El archivo:

```text
.env
```

debe permanecer fuera del repositorio cuando contiene credenciales reales.

Se recomienda utilizar:

```text
.env.example
```

como plantilla para otros integrantes del proyecto.

Ejemplo:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=coursehub
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password_here
```

---

# Comandos útiles

Instalar dependencias:

```bash
npm install
```

Ejecutar en desarrollo:

```bash
npm run start:dev
```

Compilar:

```bash
npm run build
```

Ejecutar producción:

```bash
npm run start:prod
```

Ejecutar pruebas:

```bash
npm run test
```

Pruebas end-to-end:

```bash
npm run test:e2e
```

Cobertura:

```bash
npm run test:cov
```

---

# Documentación

Documentación oficial de NestJS:

https://docs.nestjs.com

Documentación de TypeORM:

https://typeorm.io

Documentación de PostgreSQL:

https://www.postgresql.org/docs/

---

# Estado del proyecto

Actualmente el proyecto cuenta con:

* API REST desarrollada con NestJS.
* Módulo de estudiantes.
* Módulo de cursos.
* Módulo de matrículas.
* DTOs para creación y consulta.
* Validación de datos.
* Relaciones entre estudiantes, cursos y matrículas.
* Persistencia mediante PostgreSQL.
* Integración con TypeORM.
* Consulta y filtrado de matrículas.
* Búsqueda por estudiante y curso.
* Filtrado de estudiantes activos.
* Paginación de cursos.
* Paginación de matrículas.
* Filtrado de cursos por nivel.
* Ordenamiento seguro de cursos.
* Validación de parámetros de consulta.
* Control de matrículas duplicadas.
* Validación de estudiantes activos.
* Cancelación de matrículas.
* Verificación de persistencia después del reinicio de la API.
* Respuestas de colección vacía para búsquedas sin resultados.
* Evidencias de la Actuación 3.

---

# Licencia

Este proyecto se desarrolla con fines académicos para la práctica de desarrollo backend con NestJS.
