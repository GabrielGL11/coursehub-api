#!/usr/bin/env node
/**
 * Prueba de carga básica de la Semana 15 (Sesión 30). Sin dependencias: usa `fetch` de Node 24.
 *
 * Mide latencia y errores de UNA ruta con una cantidad pequeña y controlada de solicitudes.
 * No certifica que la API sea escalable: solo describe lo observado en este entorno.
 *
 * Variables (todas opcionales):
 *   LOAD_URL          Ruta a probar.               Por defecto http://localhost:3000/v1/courses
 *   LOAD_REQUESTS     Solicitudes medidas.         Por defecto 200   (máximo 5000)
 *   LOAD_CONCURRENCY  Solicitudes simultáneas.     Por defecto 10    (máximo 50)
 *   LOAD_TOKEN        JWT para rutas protegidas (se envía como Bearer).
 *   LOAD_LABEL        Etiqueta del escenario en el informe.
 *
 * Límites de seguridad:
 *   - Solo acepta localhost / 127.0.0.1 / ::1. Para otro destino hay que confirmar
 *     por escrito que se tiene autorización: LOAD_AUTHORIZED_HOST=<nombre-del-host>.
 *   - Tope de solicitudes y de concurrencia, para no convertir la prueba en un ataque.
 *
 * Uso:
 *   node scripts/load-test.mjs
 *   $env:LOAD_URL="http://localhost:3000/v1/enrollments"; $env:LOAD_TOKEN="<jwt>"; node scripts/load-test.mjs
 */
import { performance } from 'node:perf_hooks';

const MAX_REQUESTS = 5000;
const MAX_CONCURRENCY = 50;
const WARMUP = 5;

const url = new URL(process.env.LOAD_URL ?? 'http://localhost:3000/v1/courses');
const total = Number(process.env.LOAD_REQUESTS ?? 200);
const concurrency = Number(process.env.LOAD_CONCURRENCY ?? 10);
const token = process.env.LOAD_TOKEN;
const label = process.env.LOAD_LABEL ?? `${url.pathname}${token ? ' (con token)' : ' (sin token)'}`;

function fail(message) {
  console.error(`✖ ${message}`);
  process.exit(1);
}

const isLocal = ['localhost', '127.0.0.1', '[::1]', '::1'].includes(url.hostname);
if (!isLocal && process.env.LOAD_AUTHORIZED_HOST !== url.hostname) {
  fail(
    `El destino "${url.hostname}" no es local. Solo se prueba una API propia o con autorización. ` +
      `Si la tienes, confirma con LOAD_AUTHORIZED_HOST=${url.hostname}.`,
  );
}
if (!Number.isInteger(total) || total < 1 || total > MAX_REQUESTS) {
  fail(`LOAD_REQUESTS debe ser un entero entre 1 y ${MAX_REQUESTS}.`);
}
if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > MAX_CONCURRENCY) {
  fail(`LOAD_CONCURRENCY debe ser un entero entre 1 y ${MAX_CONCURRENCY}.`);
}

const headers = { accept: 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) };

async function hit() {
  const start = performance.now();
  try {
    const response = await fetch(url, { headers });
    await response.arrayBuffer(); // libera la conexión
    return { status: response.status, ms: performance.now() - start };
  } catch {
    return { status: 'error de red', ms: performance.now() - start };
  }
}

function percentile(sorted, p) {
  if (sorted.length === 0) return 0;
  return sorted[Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1)];
}

// Calentamiento: no se mide (conexiones, caché de rutas, etc.).
for (let i = 0; i < WARMUP; i += 1) await hit();

console.log(`▶ ${label}`);
console.log(`  destino=${url.href}  solicitudes=${total}  concurrencia=${concurrency}`);

const results = [];
let next = 0;
const startedAt = performance.now();

await Promise.all(
  Array.from({ length: concurrency }, async () => {
    while (next < total) {
      next += 1;
      results.push(await hit());
    }
  }),
);

const seconds = (performance.now() - startedAt) / 1000;
const latencies = results.map((r) => r.ms).sort((a, b) => a - b);
const statuses = {};
for (const { status } of results) statuses[status] = (statuses[status] ?? 0) + 1;

const ok = results.filter((r) => typeof r.status === 'number' && r.status >= 200 && r.status < 300).length;
const fmt = (n) => n.toFixed(1);

const report = {
  escenario: label,
  fecha: new Date().toISOString(),
  solicitudes: results.length,
  concurrencia: concurrency,
  duracion_s: Number(seconds.toFixed(2)),
  solicitudes_por_s: Number((results.length / seconds).toFixed(1)),
  exitosas_2xx: ok,
  tasa_exito_pct: Number(((ok / results.length) * 100).toFixed(1)),
  estados: statuses,
  latencia_ms: {
    min: Number(fmt(latencies[0])),
    promedio: Number(fmt(latencies.reduce((a, b) => a + b, 0) / latencies.length)),
    p50: Number(fmt(percentile(latencies, 50))),
    p95: Number(fmt(percentile(latencies, 95))),
    p99: Number(fmt(percentile(latencies, 99))),
    max: Number(fmt(latencies.at(-1))),
  },
};

console.log(JSON.stringify(report, null, 2));

if (statuses[429]) {
  console.log(
    `\nℹ ${statuses[429]} respuestas 429: es el limitador de solicitudes (THROTTLE_LIMIT) funcionando. ` +
      'Para medir la latencia de la ruta, sube el límite solo durante esta prueba local y vuélvelo a dejar en 20.',
  );
}
if (ok < results.length) {
  console.log('\nℹ Hubo respuestas que no fueron 2xx: investiga la causa antes de aumentar la carga.');
}
