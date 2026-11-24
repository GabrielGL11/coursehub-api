import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateCourseDto {
    @ApiProperty({ example: 'Desarrollo Backend con NestJS', description: 'Título del curso' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ enum: ['beginner', 'intermediate', 'advanced'], example: 'intermediate' })
    @IsIn(['beginner', 'intermediate', 'advanced'])
    level: string;
}
