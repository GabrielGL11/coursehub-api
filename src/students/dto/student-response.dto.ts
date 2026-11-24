import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '../../common/dto/pagination-meta.dto.js';

export class StudentResponseDto {
    @ApiProperty({ example: 3 })
    id: number;

    @ApiProperty({ example: 'Carlos Mendoza' })
    name: string;

    @ApiProperty({ example: 'carlos.mendoza@example.edu' })
    email: string;

    @ApiProperty({ example: 22 })
    age: number;

    @ApiProperty({ example: 'Software' })
    career: string;

    @ApiProperty({ example: 5 })
    semester: number;

    @ApiProperty({ example: true })
    isActive: boolean;
}

export class PaginatedStudentsResponseDto {
    @ApiProperty({ type: () => [StudentResponseDto] })
    items: StudentResponseDto[];

    @ApiProperty({ type: () => PaginationMetaDto })
    meta: PaginationMetaDto;
}
