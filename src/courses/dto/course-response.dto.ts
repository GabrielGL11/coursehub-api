import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '../../common/dto/pagination-meta.dto.js';

export class CourseResponseDto {
    @ApiProperty({ example: 6 })
    id: number;

    @ApiProperty({ example: 'Desarrollo Backend con NestJS' })
    title: string;

    @ApiProperty({ enum: ['beginner', 'intermediate', 'advanced'], example: 'intermediate' })
    level: string;

    @ApiProperty({
        type: Number,
        nullable: true,
        example: 2,
        description: 'Usuario que creó el curso; lo asigna el servidor desde el token, nunca el cuerpo',
    })
    createdByUserId: number | null;
}

export class PaginatedCoursesResponseDto {
    @ApiProperty({ type: () => [CourseResponseDto] })
    items: CourseResponseDto[];

    @ApiProperty({ type: () => PaginationMetaDto })
    meta: PaginationMetaDto;
}
