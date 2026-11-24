
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { StudentsService } from './students.service.js';
import { CreateStudentDto } from './dto/create-students.dto.js';
import { UpdateStudentDto } from './dto/update-students.dto.js';
import { StudentsQueryDto } from './dto/students-query.dto.js';
import {
    PaginatedStudentsResponseDto,
    StudentResponseDto,
} from './dto/student-response.dto.js';
import { ParseStudentIdPipe } from './pipes/parse-student-id.pipe.js';
import { ApiStandardErrors } from '../common/swagger/api-standard-errors.decorator.js';

@ApiTags('Estudiantes')
@Controller({ path: 'students', version: '1' })
    export class StudentsController {
    constructor(
        private readonly studentsService: StudentsService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Listar estudiantes con búsqueda, filtros, paginación y orden (sin token)' })
    @ApiOkResponse({ description: 'Página de estudiantes', type: PaginatedStudentsResponseDto })
    @ApiStandardErrors(400)
    findAll(@Query() query: StudentsQueryDto) {
        return this.studentsService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un estudiante por identificador (sin token)' })
    @ApiOkResponse({ description: 'Estudiante encontrado', type: StudentResponseDto })
    @ApiStandardErrors(400, 404)
    findOne(
        @Param('id', ParseStudentIdPipe) id: number,
    ) {
        return this.studentsService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Crear un estudiante (sin token)' })
    @ApiCreatedResponse({ description: 'Estudiante creado', type: StudentResponseDto })
    @ApiStandardErrors(400, 409)
    create(@Body() createStudentDto: CreateStudentDto) {
        return this.studentsService.create(createStudentDto);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Activar o desactivar un estudiante (sin token)' })
    @ApiBody({
        schema: {
            type: 'object',
            required: ['isActive'],
            properties: { isActive: { type: 'boolean', example: false } },
        },
    })
    @ApiOkResponse({ description: 'Estudiante con el estado actualizado', type: StudentResponseDto })
    @ApiStandardErrors(400, 404)
    updateStatus(
        @Param('id', ParseStudentIdPipe) id: number,
        @Body() body: { isActive: boolean },
    ) {
        return this.studentsService.updateStatus(
        id,
        body.isActive,
        );
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar datos de un estudiante (sin token)' })
    @ApiOkResponse({ description: 'Estudiante actualizado', type: StudentResponseDto })
    @ApiStandardErrors(400, 404, 409)
    update(
        @Param('id', ParseStudentIdPipe) id: number,
        @Body() updateStudentDto: UpdateStudentDto,
    ) {
        return this.studentsService.update(
        id,
        updateStudentDto,
        );
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Eliminar un estudiante (sin token)',
        description: 'Un estudiante inactivo no se puede eliminar (`400`).',
    })
    @ApiOkResponse({ description: 'Estudiante eliminado (se devuelve el registro borrado)', type: StudentResponseDto })
    @ApiStandardErrors(400, 404)
    remove(
        @Param('id', ParseStudentIdPipe) id: number,
    ) {
        return this.studentsService.remove(id);
    }
}
