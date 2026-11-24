import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ErrorResponseDto } from '../dto/error-response.dto.js';

interface ErrorExample {
  description: string;
  error: string;
  message: string | string[];
}

// Un ejemplo por código: el ejemplo de cada respuesta debe coincidir con su estado.
const ERRORS: Record<number, ErrorExample> = {
  400: {
    description: 'Datos o parámetros inválidos',
    error: 'Bad Request',
    message: [
      'title should not be empty',
      'level must be one of the following values: beginner, intermediate, advanced',
    ],
  },
  401: {
    description: 'Token ausente, inválido o expirado',
    error: 'Unauthorized',
    message: 'Token de acceso requerido',
  },
  403: {
    description: 'Identidad válida sin permiso (rol o propiedad)',
    error: 'Forbidden',
    message: 'No tienes permisos para realizar esta acción',
  },
  404: {
    description: 'Recurso inexistente',
    error: 'Not Found',
    message: 'Course 999999 not found',
  },
  409: {
    description: 'Conflicto con los datos existentes',
    error: 'Conflict',
    message: 'El correo ya está registrado',
  },
  429: {
    description: 'Demasiadas solicitudes: se superó el límite',
    error: 'ThrottlerException',
    message: 'ThrottlerException: Too Many Requests',
  },
};

/**
 * Documenta, con la forma uniforme de `ErrorResponseDto`, los errores
 * que una ruta puede devolver. Uso: `@ApiStandardErrors(400, 401, 403)`.
 * Los ejemplos son ilustrativos; el mensaje exacto depende de cada ruta.
 */
export function ApiStandardErrors(...statuses: number[]) {
  return applyDecorators(
    ApiExtraModels(ErrorResponseDto),
    ...statuses.map((status) => {
      const detail = ERRORS[status];

      return ApiResponse({
        status,
        description: detail?.description ?? 'Error',
        schema: {
          allOf: [{ $ref: getSchemaPath(ErrorResponseDto) }],
          example: {
            statusCode: status,
            error: detail?.error ?? 'Error',
            message: detail?.message ?? 'Error',
            path: '/v1/courses',
            timestamp: '2026-11-23T20:30:00.000Z',
            requestId: '0b7a1f9e-5c1d-4f0e-9c52-6f1d2a8b7e10',
          },
        },
      });
    }),
  );
}