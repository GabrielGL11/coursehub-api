# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Etapa 1 · build: instala TODAS las dependencias y compila TypeScript.
# Nada de esta etapa llega a la imagen final, salvo la carpeta `dist`.
# ---------------------------------------------------------------------------
FROM node:24 AS build
WORKDIR /app

# Misma versión de npm con la que se generó package-lock.json (ver quality.yml).
RUN npm install --global npm@11.17.0

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------------------------------------------------------------------------
# Etapa 2 · runtime: solo dependencias de producción y el código compilado.
# ---------------------------------------------------------------------------
FROM node:24-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN npm install --global npm@11.17.0

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist

# La imagen NO contiene valores de DATABASE_*, JWT_SECRET, etc.:
# se inyectan al ejecutar el contenedor (ver docker-compose.yml y .env.docker.example).

# Usuario sin privilegios: la imagen `node` ya trae el usuario `node`.
USER node

EXPOSE 3000

# Comprueba la ruta pública `GET /` (responde 200 cuando la API está en línea).
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 3000) + '/').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "dist/main.js"]
