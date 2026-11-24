import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsString, Max, Min} from 'class-validator';

export class CreateStudentDto {
    @ApiProperty({ example: 'Carlos Mendoza' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'carlos.mendoza@example.edu' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 22, minimum: 1 })
    @IsInt()
    @Min(1)
    age: number;

    @ApiProperty({ example: 'Software' })
    @IsString()
    @IsNotEmpty()
    career: string;

    @ApiProperty({ example: 5, minimum: 1, maximum: 10 })
    @IsInt()
    @Min(1)
    @Max(10)
    semester: number;

    @ApiProperty({ example: true })
    @IsBoolean()
    isActive: boolean;
}
