# Sistema de Gestión Académica - CourseHub API

API REST desarrollada con **NestJS**, **TypeScript**, **PostgreSQL** y **TypeORM** para gestionar estudiantes, cursos y matrículas académicas.

El proyecto forma parte de la práctica de **Desarrollo Backend Web con NestJS**, enfocada en la implementación de persistencia de datos mediante PostgreSQL y TypeORM.

---

## Tecnologías utilizadas

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

## Descripción del proyecto

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

## Arquitectura

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

### Flujo de una solicitud

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

Ejemplo:

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

Ejemplo de configuración:

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

## Students

### Obtener todos los estudiantes

```http
GET /students
```

### Obtener un estudiante

```http
GET /students/:id
```

### Crear un estudiante

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

### Actualizar el estado de un estudiante

```http
PATCH /students/:id/status
```

---

# Courses

### Obtener todos los cursos

```http
GET /courses
```

### Obtener un curso

```http
GET /courses/:id
```

### Crear un curso

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

## Consultar todas las matrículas

```http
GET /enrollments
```

---

## Filtrar por estudiante

```http
GET /enrollments?studentId=3
```

---

## Filtrar por curso

```http
GET /enrollments?courseId=3
```

También existen rutas específicas:

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

La API devuelve actualmente:

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

Si se intenta realizar una matrícula duplicada, la API devuelve:

```json
{
  "message": "El estudiante ya está matriculado en este curso",
  "error": "Conflict",
  "statusCode": 409
}
```

---

# Práctica de persistencia y matrículas

Como parte de la práctica de la Semana 5 se verificó el funcionamiento de la persistencia utilizando PostgreSQL y TypeORM.

## 1. Crear un curso y un estudiante activo

Se creó un estudiante:

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

## 6. Filtrar matrículas

### Por estudiante

```http
GET /enrollments?studentId=3
```

Resultado:

```json
[
  {
    "id": 1,
    "studentId": 3,
    "courseId": 3
  }
]
```

### Por curso

```http
GET /enrollments?courseId=3
```

La API devolvió la matrícula correspondiente al curso indicado.

---

## 7. Cancelar una matrícula

Se utilizó:

```http
DELETE /enrollments/1
```

Posteriormente:

```http
GET /enrollments
```

La matrícula eliminada dejó de aparecer.

Esto permitió comprobar que la operación de cancelación funciona correctamente y que el registro fue eliminado de PostgreSQL.

---

# Ejemplo completo del flujo

```text
1. Crear Student
       ↓
2. Crear Course
       ↓
3. Crear Enrollment
       ↓
4. Guardar en PostgreSQL
       ↓
5. Reiniciar API
       ↓
6. Consultar Enrollment
       ↓
7. Intentar duplicar
       ↓
   409 Conflict
       ↓
8. Desactivar Student
       ↓
9. Intentar matricular
       ↓
   Error
       ↓
10. Filtrar Enrollment
       ↓
11. Cancelar Enrollment
       ↓
12. Verificar que ya no existe
```

---

# Estructura del proyecto

```text
src/
├── courses/
│   ├── dto/
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
│   │   └── create-enrollment.dto.ts
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
                 │   Repository    │
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
* DTOs para creación de matrículas.
* Validación de datos.
* Relaciones entre estudiantes, cursos y matrículas.
* Persistencia mediante PostgreSQL.
* Integración con TypeORM.
* Consulta y filtrado de matrículas.
* Validación de estudiantes activos.
* Control de matrículas duplicadas.
* Cancelación de matrículas.
* Verificación de persistencia después del reinicio de la API.

---

# Licencia

Este proyecto se desarrolla con fines académicos para la práctica de desarrollo backend con NestJS.
