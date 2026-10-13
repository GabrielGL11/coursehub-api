<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Sistema de Gestión Académica — CourseHub API

API REST desarrollada con **NestJS, TypeScript, PostgreSQL y TypeORM** para gestionar estudiantes, cursos y matrículas académicas.

Este proyecto forma parte de las prácticas de la asignatura **Desarrollo Backend Web con NestJS**. Incluye persistencia de datos, relaciones entre entidades, validaciones y consultas con filtros, búsqueda, paginación y ordenamiento.

## Tabla de contenidos

- [Tecnologías](#tecnologías)
- [Descripción del proyecto](#descripción-del-proyecto)
- [Arquitectura](#arquitectura)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Instalación y configuración](#instalación-y-configuración)
- [Modelo de datos](#modelo-de-datos)
- [Endpoints de estudiantes](#endpoints-de-estudiantes)
- [Endpoints de cursos](#endpoints-de-cursos)
- [Endpoints de matrículas](#endpoints-de-matrículas)
- [Validaciones y respuestas HTTP](#validaciones-y-respuestas-http)
- [Persistencia y pruebas de la Semana 5](#persistencia-y-pruebas-de-la-semana-5)
- [Actuación 3: consultas, filtros y paginación](#actuación-3-consultas-filtros-y-paginación)
- [Pruebas y evidencias](#pruebas-y-evidencias)
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

La siguiente estructura representa los módulos principales de la aplicación:

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
```

Los archivos auxiliares y la distribución de los DTOs pueden variar según la implementación actual del repositorio.

## Instalación y configuración

### 1. Instalar las dependencias

```bash
npm install
```

### 2. Configurar PostgreSQL

Crea la base de datos que utilizará el proyecto y configura las variables de conexión en el archivo `.env`.

Ejemplo:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=coursehub
DATABASE_USER=postgres
DATABASE_PASSWORD=tu_password
```

Los valores deben coincidir con la configuración de PostgreSQL de tu entorno. Si la base de datos tiene otro nombre, utiliza el nombre configurado localmente.

**Importante:** no subas el archivo `.env` con credenciales reales al repositorio. Utiliza `.env.example` como plantilla y mantén las credenciales privadas.

Ejemplo de plantilla:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=coursehub
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password_here
```

### 3. Ejecutar la API

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

La dirección base utilizada en los ejemplos de este documento es:

```text
http://localhost:3000
```

Si el proyecto utiliza otro puerto, sustituye el valor por el que tengas configurado.

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

---

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

La ruta `GET /students` permite combinar filtros, búsqueda textual, paginación y ordenamiento mediante parámetros de consulta.

```http
GET /students
```

#### Parámetros disponibles

| Parámetro | Tipo | Obligatorio | Descripción | Predeterminado |
|---|---|---|---|---|
| `search` | string | No | Busca coincidencias por nombre o correo electrónico | — |
| `career` | string | No | Filtra por carrera | — |
| `semester` | number | No | Filtra por semestre | — |
| `isActive` | boolean | No | Filtra por estado activo | — |
| `page` | number | No | Número de página | `1` |
| `limit` | number | No | Cantidad de resultados por página | `10` |
| `sortBy` | string | No | Campo de ordenamiento | `id` |
| `order` | string | No | Dirección del ordenamiento | `ASC` |

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

Los valores permitidos para `order` son:

```text
ASC
DESC
```

La búsqueda textual utiliza PostgreSQL y permite buscar coincidencias parciales sin distinguir entre mayúsculas y minúsculas.

### Ejemplo 1. Listar estudiantes con paginación

```http
GET /students?page=1&limit=10
```

La respuesta utiliza la siguiente estructura:

```json
{
  "items": [
    {
      "id": 1,
      "name": "Ana Torres",
      "email": "ana.torres@example.edu",
      "age": 20,
      "career": "Software",
      "semester": 4,
      "isActive": true
    }
  ],
  "meta": {
    "total": 3,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

Los registros y metadatos reales dependen de los datos almacenados en la base de datos.

### Ejemplo 2. Buscar por nombre o correo electrónico

```http
GET /students?search=carlos
```

La consulta busca coincidencias en el nombre o el correo electrónico de los estudiantes.

### Ejemplo 3. Combinar filtros

```http
GET /students?career=Software&semester=5&isActive=true
```

La consulta devuelve los estudiantes que cumplen simultáneamente los tres filtros.

### Ejemplo 4. Ordenar por nombre

Orden ascendente:

```http
GET /students?sortBy=name&order=ASC
```

Orden descendente:

```http
GET /students?sortBy=name&order=DESC
```

### Ejemplo 5. Combinar búsqueda y paginación

```http
GET /students?search=carlos&page=1&limit=5
```

Esta consulta aplica la búsqueda textual y devuelve como máximo cinco resultados de la página solicitada.

### Ejemplo 6. Parámetros inválidos

Solicitud:

```http
GET /students?page=0
```

Respuesta observada:

```json
{
  "message": [
    "page must not be less than 1"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

También se comprobó la validación del límite máximo:

```http
GET /students?limit=100
```

Respuesta observada:

```json
{
  "message": [
    "limit must not be greater than 50"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

Estas respuestas fueron verificadas mediante Thunder Client.

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

Ejemplo de cuerpo para actualizar el estado:

```json
{
  "isActive": false
}
```

Eliminar:

```http
DELETE /students/3
```

Según las reglas implementadas, no se permite eliminar un estudiante inactivo.

---

## Endpoints de cursos

### Endpoints disponibles

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/courses` | Consultar cursos con filtros, paginación y ordenamiento |
| `GET` | `/courses/:id` | Obtener un curso por ID |
| `POST` | `/courses` | Crear un curso |
| `GET` | `/courses/:courseId/enrollments` | Consultar matrículas de un curso |

### Consulta de cursos

```http
GET /courses
```

| Parámetro | Tipo | Obligatorio | Descripción | Predeterminado |
|---|---|---|---|---|
| `level` | string | No | Filtra por nivel | — |
| `page` | number | No | Número de página | `1` |
| `limit` | number | No | Resultados por página | `10` |
| `sortBy` | string | No | Campo de ordenamiento | `id` |
| `order` | string | No | Dirección del ordenamiento | `ASC` |

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

Con los cinco cursos utilizados en la demostración, los resultados esperados son:

```text
Página 1: ID 1 e ID 2
Página 2: ID 3 e ID 4
Página 3: ID 5
```

Los metadatos permiten comprobar el total de registros, la página actual, el límite y el número de páginas.

### Filtrar por nivel

```http
GET /courses?level=beginner&page=1&limit=10
```

Con los datos de demostración, los cursos de nivel `beginner` son:

```text
ID 1: NestJS desde cero
ID 4: Bases de Datos con PostgreSQL
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

### Ordenar por título

Orden ascendente:

```http
GET /courses?sortBy=title&order=ASC
```

Orden descendente:

```http
GET /courses?sortBy=title&order=DESC
```

El sistema restringe los campos de ordenamiento permitidos para evitar utilizar campos no autorizados.

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

---

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

```http
GET /enrollments
```

| Parámetro | Tipo | Obligatorio | Descripción | Predeterminado |
|---|---|---|---|---|
| `search` | string | No | Busca por nombre del estudiante o título del curso | — |
| `studentId` | number | No | Filtra por estudiante | — |
| `courseId` | number | No | Filtra por curso | — |
| `activeOnly` | boolean | No | Filtra matrículas de estudiantes activos | — |
| `page` | number | No | Número de página | `1` |
| `limit` | number | No | Resultados por página | `10` |

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

También se puede utilizar:

```http
GET /enrollments?search=carl
```

### Buscar por título del curso

```http
GET /enrollments?search=nestjs
```

La búsqueda consulta tanto el nombre del estudiante como el título del curso. La implementación utiliza `QueryBuilder` y parámetros para construir la consulta.

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

### Combinar búsqueda, filtro y paginación

```http
GET /enrollments?search=carlos&activeOnly=true&page=1&limit=1
```

Esta consulta combina la búsqueda por texto, el filtro de estudiantes activos y la paginación.

Ejemplo de respuesta utilizado durante la demostración:

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

### Cancelar una matrícula

```http
DELETE /enrollments/1
```

Después de cancelar una matrícula, se puede comprobar el resultado consultando nuevamente:

```http
GET /enrollments
```

---

## Validaciones y respuestas HTTP

La API utiliza DTOs, `class-validator` y `class-transformer` para validar los datos y parámetros configurados.

Los códigos HTTP relevantes incluyen:

| Código | Significado | Ejemplo |
|---|---|---|
| `200 OK` | Consulta correcta | Listar estudiantes o matrículas |
| `201 Created` | Recurso creado | Crear un estudiante, curso o matrícula |
| `400 Bad Request` | Solicitud o parámetro inválido | `page=0` o `limit=100` |
| `404 Not Found` | Recurso inexistente | Consultar un estudiante inexistente |
| `409 Conflict` | Conflicto con los datos | Matrícula duplicada o estudiante inactivo |

Los códigos concretos dependen del endpoint y de las excepciones implementadas.

### Parámetros inválidos

Por ejemplo, la siguiente consulta supera el límite máximo documentado:

```http
GET /courses?limit=100
```

Respuesta:

```json
{
  "message": [
    "limit must not be greater than 50"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

La consulta de estudiantes también fue probada con parámetros inválidos:

```http
GET /students?page=0
```

La API respondió con `400 Bad Request` porque el número de página debe ser mayor o igual a uno.

### Matrículas duplicadas

No se permite registrar dos veces la misma combinación:

```text
studentId + courseId
```

Respuesta observada:

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

Respuesta observada:

```json
{
  "message": "No se puede matricular un estudiante inactivo",
  "error": "Conflict",
  "statusCode": 409
}
```

### Búsquedas sin resultados

Cuando una búsqueda de colección no encuentra coincidencias, la respuesta esperada es una colección vacía, en lugar de tratarla como un recurso inexistente.

Ejemplo:

```http
GET /enrollments?search=xyz999
```

Respuesta de ejemplo:

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

Durante las pruebas de la Actuación 3 se verificó este comportamiento con una respuesta `200 OK`.

---

## Persistencia y pruebas de la Semana 5

Como parte de la práctica de la Semana 5 se verificó la persistencia de los datos utilizando PostgreSQL y TypeORM.

### 1. Crear un curso y un estudiante activo

Para la demostración se utilizaron los siguientes registros:

Estudiante:

```text
Nombre: Carlos Mendoza
ID: 3
Estado: activo
```

Curso:

```text
Título: Desarrollo Backend con NestJS
ID: 3
Nivel: intermediate
```

### 2. Crear una matrícula válida

Solicitud:

```json
{
  "studentId": 3,
  "courseId": 3
}
```

La matrícula fue almacenada correctamente en PostgreSQL.

### 3. Reiniciar la API

Se detuvo la aplicación y se volvió a iniciar:

```bash
npm run start:dev
```

Posteriormente se consultaron las matrículas:

```http
GET /enrollments
```

La matrícula continuó disponible. Esto demuestra que los datos persisten en la base de datos y no dependen únicamente de un arreglo almacenado en memoria.

### 4. Intentar una matrícula duplicada

Se volvió a enviar la misma solicitud:

```json
{
  "studentId": 3,
  "courseId": 3
}
```

La API respondió con `409 Conflict` y el mensaje:

```text
El estudiante ya está matriculado en este curso
```

Se comprobó correctamente el rechazo de matrículas duplicadas.

### 5. Intentar matricular un estudiante inactivo

Se desactivó el estudiante correspondiente y posteriormente se intentó crear una matrícula.

La API respondió con `409 Conflict`:

```text
No se puede matricular un estudiante inactivo
```

La operación fue rechazada correctamente.

---

## Actuación 3: consultas, filtros y paginación

Durante la Semana 6 se implementaron y probaron funcionalidades de consulta avanzada para cursos y matrículas. Posteriormente, se amplió el endpoint de estudiantes para incorporar búsqueda, filtros, paginación y ordenamiento.

### Demostración de cursos y matrículas

#### 1. Crear suficientes cursos

Se utilizaron cinco cursos para demostrar la paginación:

```text
ID 1: NestJS desde cero
ID 2: Diseño de APIs
ID 3: Desarrollo Backend con NestJS
ID 4: Bases de Datos con PostgreSQL
ID 5: APIs REST con NestJS
```

#### 2. Solicitar dos páginas consecutivas

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

Metadatos esperados:

```json
{
  "total": 5,
  "page": 2,
  "limit": 2,
  "totalPages": 3
}
```

#### 3. Filtrar cursos por nivel

Solicitud:

```http
GET /courses?level=beginner&page=1&limit=10
```

Resultado con los datos de demostración:

```text
ID 1: NestJS desde cero
ID 4: Bases de Datos con PostgreSQL
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

#### 4. Buscar matrículas

Por parte del nombre del estudiante:

```http
GET /enrollments?search=carlos
```

Por parte del título del curso:

```http
GET /enrollments?search=nestjs
```

Estas consultas se utilizaron para demostrar la búsqueda de matrículas por estudiante y por curso.

#### 5. Combinar búsqueda, estudiante activo y paginación

Solicitud:

```http
GET /enrollments?search=carlos&activeOnly=true&page=1&limit=1
```

Resultado utilizado durante la demostración:

```text
Estudiante: Carlos Mendoza
Estado: activo
Página: 1
Límite: 1
Total: 1
```

#### 6. Probar una petición inválida

Solicitud:

```http
GET /courses?limit=100
```

La API respondió con `400 Bad Request`, demostrando que se valida el límite máximo permitido.

#### 7. Buscar sin resultados

Solicitud:

```http
GET /enrollments?search=xyz999
```

La API devolvió una colección vacía con sus metadatos, en lugar de responder con `404 Not Found`.

### Demostración de consultas de estudiantes

Se verificaron mediante Thunder Client las siguientes consultas:

1. Consulta paginada con `page` y `limit`.
2. Búsqueda por nombre o correo electrónico.
3. Combinación de filtros por carrera, semestre y estado activo.
4. Ordenamiento por nombre.
5. Rechazo de `page=0` con `400 Bad Request`.
6. Rechazo de `limit=100` con `400 Bad Request`.

Estas pruebas confirman el comportamiento observado de `GET /students` en el entorno local.

---

## Pruebas y evidencias

Las pruebas de los endpoints se realizan con **Thunder Client**. La base de datos se puede inspeccionar mediante **pgAdmin**.

### Evidencias de la Actuación 3

Las evidencias de cursos y matrículas se encuentran en:

```text
evidencias/actuacion3/
```

Los archivos documentados son:

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

Estas capturas permiten documentar las consultas paginadas, los filtros, las búsquedas, las validaciones y las consultas relacionadas con matrículas.

Las nuevas capturas correspondientes a estudiantes deben conservarse en la carpeta de evidencias que estés utilizando. Asegúrate de que los nombres incluidos en el README coincidan con los archivos que realmente guardaste.

### Pruebas funcionales documentadas

Se incluyen pruebas de:

- Creación de estudiantes.
- Creación de cursos.
- Creación de matrículas.
- Persistencia después de reiniciar la API.
- Rechazo de matrículas duplicadas.
- Rechazo de estudiantes inactivos.
- Filtrado por estudiante.
- Filtrado por curso.
- Cancelación de matrículas.
- Verificación de eliminación.
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

---

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
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=coursehub
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password_here
```

Sustituye los valores de ejemplo por la configuración de tu entorno al ejecutar la aplicación. No incluyas contraseñas reales en el README.

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

## Documentación oficial

- [NestJS](https://docs.nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [class-validator](https://github.com/typestack/class-validator)
- [class-transformer](https://github.com/typestack/class-transformer)

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
- Evidencias de las consultas y pruebas realizadas.

En la Semana 6 se amplió `GET /students` para incorporar búsqueda textual, filtros combinables, paginación, ordenamiento controlado y validación de parámetros. Las pruebas realizadas en el entorno local se documentan en este README y deben acompañarse de sus respectivas evidencias.

## Licencia

Este proyecto se desarrolla con fines académicos para la práctica de desarrollo backend con NestJS.