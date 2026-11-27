# Prueba de carga básica · Semana 15 (Sesión 30)

> Plantilla para registrar la prueba. **Completa las celdas con lo que midas tú**; no copies cifras de otra persona ni de otro equipo: dependen de tu máquina.

## 1. Hipótesis

`GET /v1/courses` (ruta pública) atiende 200 solicitudes con 10 simultáneas desde esta misma máquina sin errores del servidor (5xx) y con una latencia p95 estable, y el limitador de solicitudes responde `429` cuando se supera `THROTTLE_LIMIT`.

## 2. Límites de seguridad

- Solo contra **localhost** (la API en Docker de este equipo). El script se niega a apuntar a otro host salvo autorización expresa.
- Máximo 5000 solicitudes y 50 simultáneas (tope del script). Aquí: 200 y 10.
- No se prueba `POST /v1/auth/login` (límite estricto de 5 por minuto, protege contra adivinar contraseñas).
- Si aparecen errores 5xx, **se investiga antes de subir la carga**.

## 3. Entorno

| Dato | Valor |
|---|---|
| Fecha | _completar_ |
| Equipo (CPU / RAM) | _completar_ |
| API | Contenedor `coursehub-api:local` (`docker compose`), `NODE_ENV=production` |
| Base de datos | PostgreSQL 16 en contenedor, con _completar_ cursos |
| Herramienta | `node scripts/load-test.mjs` (fetch de Node 24) |

## 4. Escenarios y resultados

Antes de cada escenario, anota la configuración (`THROTTLE_LIMIT`) y repite la medición 2 o 3 veces: una sola ejecución no es evidencia de nada.

| # | Escenario | THROTTLE_LIMIT | Solicitudes / simultáneas | Estados observados | Éxito 2xx | p50 (ms) | p95 (ms) | p99 (ms) | Solicitudes/s |
|---|---|---|---|---|---|---|---|---|---|
| A | `GET /v1/courses` con el límite por defecto | 20 | 200 / 10 | _completar_ | _completar_ | _completar_ | _completar_ | _completar_ | _completar_ |
| B | `GET /v1/courses` con el límite ampliado | _completar_ | 200 / 10 | _completar_ | _completar_ | _completar_ | _completar_ | _completar_ | _completar_ |
| C (opcional) | `GET /v1/enrollments` con token, mismo límite que B | _completar_ | 200 / 10 | _completar_ | _completar_ | _completar_ | _completar_ | _completar_ | _completar_ |

> El escenario C solo se compara con B si las condiciones son equivalentes (misma máquina, mismo límite, misma cantidad de datos). La ruta protegida añade validar el JWT y consultar con relaciones, así que no es la misma carga.

## 5. Observaciones

- ¿El escenario A devolvió `429`? _Qué significa: el limitador protege la API; no es un fallo._
- ¿Hubo 5xx en B o C? _Si sí, ¿qué dicen los registros de `docker compose logs api`?_
- ¿La latencia p95 se mantuvo cerca del p50 o se disparó al final? _completar_
- ¿Qué parte sospechas que limita (CPU del equipo, la base de datos, una consulta sin paginar)? _completar, indicando cómo lo comprobarías_

## 6. Qué NO concluye esta prueba

- No demuestra que la API sea escalable ni cuántos usuarios soporta: es una muestra pequeña, desde la misma máquina que ejecuta la API y la base.
- No cubre escritura concurrente, sesiones largas ni crecimiento de datos.
- Los números cambian entre ejecuciones y entre equipos; sirven para comparar antes y después de un cambio en **este** entorno.

## 7. Cierre

- [ ] `THROTTLE_LIMIT` vuelto a `20` en `.env.docker` y contenedor reiniciado (`docker compose --env-file .env.docker up -d`).
- [ ] Ningún token ni contraseña en las capturas.
