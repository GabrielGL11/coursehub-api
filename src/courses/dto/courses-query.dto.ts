import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CoursesQueryDto {
    @ApiPropertyOptional({ example: 'beginner', description: 'Filtra por nivel' })
    @IsOptional()
    @IsString()
    level?: string;

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

    @ApiPropertyOptional({ enum: ['id', 'title', 'level'], default: 'id' })
    @IsOptional()
    @IsIn(['id', 'title', 'level'])
    sortBy: 'id' | 'title' | 'level' = 'id';

    @ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'ASC' })
    @Transform(({ value }) =>
        typeof value === 'string' ? value.toUpperCase() : value,
    )
    @IsIn(['ASC', 'DESC'])
    order: 'ASC' | 'DESC' = 'ASC';
}
