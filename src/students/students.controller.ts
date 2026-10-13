
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { StudentsService } from './students.service.js';
import { CreateStudentDto } from './dto/create-students.dto.js';
import { UpdateStudentDto } from './dto/update-students.dto.js';
import { StudentsQueryDto } from './dto/students-query.dto.js';
import { ParseStudentIdPipe } from './pipes/parse-student-id.pipe.js';

@Controller('students')
    export class StudentsController {
    constructor(
        private readonly studentsService: StudentsService,
    ) {}

    @Get()
    findAll(@Query() query: StudentsQueryDto) {
        return this.studentsService.findAll(query);
    }

    @Get(':id')
    findOne(
        @Param('id', ParseStudentIdPipe) id: number,
    ) {
        return this.studentsService.findOne(id);
    }

    @Post()
    create(@Body() createStudentDto: CreateStudentDto) {
        return this.studentsService.create(createStudentDto);
    }

    @Patch(':id/status')
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
    remove(
        @Param('id', ParseStudentIdPipe) id: number,
    ) {
        return this.studentsService.remove(id);
    }
}