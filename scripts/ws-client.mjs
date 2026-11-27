#!/usr/bin/env node
/**
 * Cliente de demostración de la extensión WebSocket (Semana 15, Sesión 30).
 * Se conecta a /notifications con un JWT y escribe cada evento que recibe.
 *
 * Variables:
 *   WS_TOKEN  JWT obtenido con POST /v1/auth/login (obligatoria; no se imprime).
 *   WS_URL    Dirección de la API. Por defecto http://localhost:3000
 *
 * Uso (PowerShell):
 *   $env:WS_TOKEN="<accessToken>"; node scripts/ws-client.mjs
 * Luego crea una matrícula (POST /v1/enrollments) y mira esta terminal.
 */
import { io } from 'socket.io-client';

const base = process.env.WS_URL ?? 'http://localhost:3000';
const token = process.env.WS_TOKEN;

if (!token) {
  console.error('✖ Falta WS_TOKEN. Inicia sesión (POST /v1/auth/login) y copia el accessToken.');
  process.exit(1);
}

// El token va en `auth`, no en la URL, para que no quede en registros.
const socket = io(`${base}/notifications`, { auth: { token }, transports: ['websocket'] });

socket.on('connect', () => console.log(`✔ Conectado a ${base}/notifications (id ${socket.id}). Esperando eventos…`));
socket.on('connect_error', (error) => {
  console.error(`✖ No se pudo conectar: ${error.message}`);
  process.exit(1);
});
socket.on('enrollment.created', (payload) => {
  console.log(`📨 enrollment.created  ${JSON.stringify(payload)}`);
});
socket.on('disconnect', (reason) => console.log(`… Desconectado (${reason})`));

process.on('SIGINT', () => {
  socket.close();
  process.exit(0);
});
