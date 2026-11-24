import { ApiProperty } from '@nestjs/swagger';

/**
 * Forma uniforme de error que produce `HttpErrorFilter`.
 * Solo se documenta lo que el cliente realmente recibe: nunca trazas ni SQL.
 */
export class ErrorResponseDto {
  @ApiProperty({ example: 404, description: 'Código de estado HTTP' })
  statusCode: number;

  @ApiProperty({ example: 'Not Found', description: 'Nombre del error HTTP' })
  error: string;

  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
    example: 'Course 999999 not found',
    description: 'Mensaje para el cliente; en errores 400 de validación es una lista',
  })
  message: string | string[];

  @ApiProperty({ example: '/v1/courses/999999', description: 'Ruta solicitada, sin cadena de consulta' })
  path: string;

  @ApiProperty({ example: '2026-11-23T20:30:00.000Z' })
  timestamp: string;

  @ApiProperty({ example: '0b7a1f9e-5c1d-4f0e-9c52-6f1d2a8b7e10', description: 'Identificador de la solicitud (X-Request-Id)' })
  requestId: string;
}
