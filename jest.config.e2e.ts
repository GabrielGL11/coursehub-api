import type { Config } from 'jest';

/**
 * Configuración de Jest para las pruebas end-to-end (e2e) de la Semana 13.
 *
 * Es independiente de `jest.config.ts` (pruebas unitarias en `src/`):
 * solo recoge los archivos `test/**\/*.e2e-spec.ts` y carga antes la
 * configuración exclusiva de prueba (`test/setup-env.ts`).
 */
const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',

  extensionsToTreatAsEsm: ['.ts'],

  testMatch: ['<rootDir>/test/**/*.e2e-spec.ts'],

  // Lee `.env.test` (o las variables del entorno) antes de cargar AppModule.
  setupFiles: ['<rootDir>/test/setup-env.ts'],

  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: 'tsconfig.e2e.json',
      },
    ],
  },

  moduleNameMapper: {
    '^@nestjs/throttler$': '<rootDir>/test/mocks/throttler.mock.ts',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  // Arrancar Nest y conectar con PostgreSQL tarda más que una prueba unitaria.
  testTimeout: 30_000,
};

export default config;
