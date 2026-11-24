import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '../../common/dto/pagination-meta.dto.js';
import { StudentResponseDto } from '../../students/dto/student-response.dto.js';
import { CourseResponseDto } from '../../courses/dto/course-response.dto.js';

export class EnrollmentResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ type: () => StudentResponseDto })
    student: StudentResponseDto;

    @ApiProperty({ type: () => CourseResponseDto })
    course: CourseResponseDto;
}

export class PaginatedEnrollmentsResponseDto {
    @ApiProperty({ type: () => [EnrollmentResponseDto] })
    items: EnrollmentResponseDto[];

    @ApiProperty({ type: () => PaginationMetaDto })
    meta: PaginationMetaDto;
}
