import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service.js';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto.js';
import { EnrollmentsQueryDto } from './dto/enrollments-query.dto.js';
import {
  EnrollmentResponseDto,
  PaginatedEnrollmentsResponseDto,
} from './dto/enrollment-response.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { ApiStandardErrors } from '../common/swagger/api-standard-errors.decorator.js';

// Todas las rutas de matrículas exigen un JWT válido.
@ApiTags('Matrículas')
@ApiBearerAuth()
@Controller({ version: '1' })
@UseGuards(JwtAuthGuard)
export class EnrollmentsController {
  constructor(
    private readonly enrollmentsService: EnrollmentsService,
  ) {}

  @Post('enrollments')
  @ApiOperation({ summary: 'Matricular a un estudiante en un curso (requiere JWT)' })
  @ApiCreatedResponse({ description: 'Matrícula creada', type: EnrollmentResponseDto })
  @ApiStandardErrors(400, 401, 404, 409)
  create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    return this.enrollmentsService.create(createEnrollmentDto);
  }

  @Get('enrollments')
  @ApiOperation({ summary: 'Listar matrículas con búsqueda, filtros y paginación (requiere JWT)' })
  @ApiOkResponse({ description: 'Página de matrículas', type: PaginatedEnrollmentsResponseDto })
  @ApiStandardErrors(400, 401)
  findAll(@Query() query: EnrollmentsQueryDto) {
    return this.enrollmentsService.findAll(query);
  }

  @Get('students/:studentId/enrollments')
  @ApiOperation({ summary: 'Listar las matrículas de un estudiante (requiere JWT)' })
  @ApiOkResponse({ description: 'Matrículas del estudiante', type: EnrollmentResponseDto, isArray: true })
  @ApiStandardErrors(400, 401, 404)
  findByStudent(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.enrollmentsService.findByStudent(studentId);
  }

  @Get('courses/:courseId/enrollments')
  @ApiOperation({ summary: 'Listar las matrículas de un curso (requiere JWT)' })
  @ApiOkResponse({ description: 'Matrículas del curso', type: EnrollmentResponseDto, isArray: true })
  @ApiStandardErrors(400, 401, 404)
  findByCourse(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.enrollmentsService.findByCourse(courseId);
  }

  @Delete('enrollments/:id')
  @ApiOperation({ summary: 'Cancelar una matrícula (requiere JWT)' })
  @ApiOkResponse({ description: 'Matrícula cancelada (se devuelve el registro borrado)', type: EnrollmentResponseDto })
  @ApiStandardErrors(400, 401, 404)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.enrollmentsService.remove(id);
  }
}
