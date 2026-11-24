import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, Request } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { CoursesService } from './courses.service.js';
import { UpdateCourseUseCase } from './use-cases/update-course.use-case.js';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';
import { CoursesQueryDto } from './dto/courses-query.dto.js';
import {
    CourseResponseDto,
    PaginatedCoursesResponseDto,
} from './dto/course-response.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '../users/user-role.enum.js';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type.js';
import { ApiStandardErrors } from '../common/swagger/api-standard-errors.decorator.js';

@ApiTags('Cursos')
@Controller({ path: 'courses', version: '1' })
export class CoursesController {
    constructor(
        private readonly coursesService: CoursesService,
        private readonly updateCourseUseCase: UpdateCourseUseCase,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Listar cursos con filtro, paginación y orden (sin token)' })
    @ApiOkResponse({ description: 'Página de cursos', type: PaginatedCoursesResponseDto })
    @ApiStandardErrors(400)
    findAll(@Query() query: CoursesQueryDto) {
        return this.coursesService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un curso por identificador (sin token)' })
    @ApiOkResponse({ description: 'Curso encontrado', type: CourseResponseDto })
    @ApiStandardErrors(400, 404)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.coursesService.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.TEACHER)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Crear un curso (requiere JWT; rol teacher o admin)',
        description: 'El propietario (`createdByUserId`) se toma del token, no del cuerpo.',
    })
    @ApiCreatedResponse({ description: 'Curso creado', type: CourseResponseDto })
    @ApiStandardErrors(400, 401, 403)
    create(
        @Body() createCourseDto: CreateCourseDto,
        @Request() req: { user: AuthenticatedUser },
    ) {
        return this.coursesService.create(
        createCourseDto,
        req.user,
        );
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.TEACHER)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Actualizar un curso (requiere JWT; admin o teacher propietario)',
        description: 'Un docente solo puede modificar los cursos que creó; el administrador, cualquiera.',
    })
    @ApiOkResponse({ description: 'Curso actualizado', type: CourseResponseDto })
    @ApiStandardErrors(400, 401, 403, 404)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateCourseDto,
        @Request() req: { user: AuthenticatedUser },
    ) {
        return this.updateCourseUseCase.execute(
        id,
        body,
        req.user,
        );
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Eliminar un curso (requiere JWT; solo admin)' })
    @ApiOkResponse({ description: 'Curso eliminado (se devuelve el registro borrado)', type: CourseResponseDto })
    @ApiStandardErrors(400, 401, 403, 404)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.coursesService.remove(id);
    }
}
