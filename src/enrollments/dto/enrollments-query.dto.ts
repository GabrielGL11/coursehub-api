import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class EnrollmentsQueryDto {
    @ApiPropertyOptional({ example: 'carlos', description: 'Busca por nombre del estudiante o título del curso' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ example: 3, minimum: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    studentId?: number;

    @ApiPropertyOptional({ example: 3, minimum: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    courseId?: number;

    @ApiPropertyOptional({ example: true, description: 'Solo matrículas de estudiantes activos' })
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            return value.toLowerCase() === 'true';
        }

        return value;
    })
    @IsBoolean()
    activeOnly?: boolean;

    @ApiPropertyOptional({ default: 1, minimum: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 50 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    limit: number = 10;
}
