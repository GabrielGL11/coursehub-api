import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';
export class CreateEnrollmentDto {
    @ApiProperty({ example: 3, minimum: 1, description: 'Identificador del estudiante (debe existir y estar activo)' })
    @IsInt()
    @IsPositive()
    studentId: number;
    @ApiProperty({ example: 3, minimum: 1, description: 'Identificador del curso (debe existir)' })
    @IsInt()
    @IsPositive()
    courseId: number;
}
