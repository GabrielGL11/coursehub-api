import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class EnrollmentsQueryDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    studentId?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    courseId?: number;

    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            return value.toLowerCase() === 'true';
        }

        return value;
    })
    @IsBoolean()
    activeOnly?: boolean;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    limit: number = 10;
}