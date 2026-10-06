import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CoursesQueryDto {
    @IsOptional()
    @IsString()
    level?: string;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    limit: number = 10;

    @IsOptional()
    @IsIn(['id', 'title', 'level'])
    sortBy: 'id' | 'title' | 'level' = 'id';

    @Transform(({ value }) =>
        typeof value === 'string' ? value.toUpperCase() : value,
    )
    @IsIn(['ASC', 'DESC'])
    order: 'ASC' | 'DESC' = 'ASC';
}