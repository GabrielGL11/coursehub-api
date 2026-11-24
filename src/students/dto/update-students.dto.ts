import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsString, Max, Min, IsOptional } from 'class-validator';

export class UpdateStudentDto {
    @ApiPropertyOptional({ example: 'Carlos Mendoza' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @ApiPropertyOptional({ example: 'carlos.mendoza@example.edu' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ example: 22, minimum: 1 })
    @IsOptional()
    @IsInt()
    @Min(1)
    age?: number;

    @ApiPropertyOptional({ example: 'Software' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    career?: string;

    @ApiPropertyOptional({ example: 5, minimum: 1, maximum: 10 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(10)
    semester?: number;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
