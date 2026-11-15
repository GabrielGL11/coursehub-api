
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';

/**
 * Filter global: traduce cualquier excepción a una respuesta HTTP con
 * una forma uniforme.
 *
 * - Errores HTTP controlados (400, 401, 403, 404, 409, 429...): se conserva
 *   su mensaje, que ya fue pensado para el cliente.
 * - Errores inesperados (500): el cliente recibe un mensaje genérico.
 *   La traza completa se registra solo en el log interno.
 */
@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger('ErrorFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error';

    // Los errores HTTP controlados conservan su mensaje original.
    if (isHttpException && status < 500) {
      const body = exception.getResponse();

      if (typeof body === 'string') {
        message = body;
      } else {
        const detail = body as {
          message?: string | string[];
          error?: string;
        };

        message = detail.message ?? exception.message;
        error = detail.error ?? exception.name;
      }
    }

    // Los detalles internos (traza, consulta SQL, etc.) solo van al log interno.
    if (status >= 500) {
      const trace =
        exception instanceof Error ? exception.stack : String(exception);

      this.logger.error(
        `${request.method} ${request.originalUrl.split('?')[0]} -> ${status}`,
        trace,
      );
    }

    response.status(status).json({
      statusCode: status,
      error,
      message,
      path: request.originalUrl.split('?')[0],
      timestamp: new Date().toISOString(),
      requestId: response.getHeader('X-Request-Id'),
    });
  }
}
