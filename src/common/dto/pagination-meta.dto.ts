import { ApiProperty } from '@nestjs/swagger';

/** Metadatos de las respuestas paginadas (`items` + `meta`). */
export class PaginationMetaDto {
  @ApiProperty({ example: 7, description: 'Total de registros que cumplen el filtro' })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 1 })
  totalPages: number;
}
