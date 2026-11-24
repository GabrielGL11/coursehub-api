import { PartialType } from '@nestjs/swagger';
import { CreateCourseDto } from './create-course.dto.js';

// PartialType de @nestjs/swagger conserva los metadatos de validación y de documentación.
export class UpdateCourseDto extends PartialType(CreateCourseDto) {}
