import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

/**
 * Mide cuánto tarda el método del controlador y lo informa en el
 * encabezado X-Response-Time. No modifica el resultado ni oculta errores.
 */
@Injectable()
export class TimingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Timing');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const startedAt = Date.now();

    return next.handle().pipe(
      tap(() => {
        const durationMs = Date.now() - startedAt;
        response.setHeader('X-Response-Time', `${durationMs}ms`);
        this.logger.log(
          `${request.method} ${request.originalUrl.split('?')[0]} handler=${durationMs}ms`,
        );
      }),
    );
  }
}
