
/**
 * Carga `.env.test` antes de importar AppModule.
 * Las variables de `.env.test` tienen prioridad sobre las del entorno,
 * para impedir que las pruebas utilicen la base de desarrollo.
 */
import { readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';

try {
  const testEnv = parseEnv(readFileSync('.env.test', 'utf8'));

  for (const [key, value] of Object.entries(testEnv)) {
    if (value !== undefined) {
      process.env[key] = value;
    }
  }
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
    throw error;
  }
}

