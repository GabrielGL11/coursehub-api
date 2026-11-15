import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

/**
 * Registra cada solicitud HTTP con datos operativos mínimos:
 * identificador, método, ruta, estado y duración.
 *
 * Nunca registra el encabezado Authorization, contraseñas, tokens,
 * el cuerpo de la petición ni la cadena de consulta (query string).
 */
@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const startedAt = Date.now();
    const requestId = randomUUID();

    // El identificador permite relacionar la respuesta con el registro interno.
    res.setHeader('X-Request-Id', requestId);

    res.on('finish', () => {
      this.logger.log(
        JSON.stringify({
          requestId,
          method: req.method,
          path: req.originalUrl.split('?')[0],
          status: res.statusCode,
          durationMs: Date.now() - startedAt,
        }),
      );
    });

    next();
  }
}
