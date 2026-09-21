import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service.js';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto.js';
    @Controller()
    export class EnrollmentsController {
    constructor(
        private readonly enrollmentsService: EnrollmentsService,
    ) {}
    @Post('enrollments')
    create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
        return this.enrollmentsService.create(createEnrollmentDto);
    }
    @Get('enrollments')
    findAll(
        @Query('studentId') studentId?: string,
        @Query('courseId') courseId?: string,
    ) {
        return this.enrollmentsService.findAll(
        studentId !== undefined ? Number(studentId) : undefined,
        courseId !== undefined ? Number(courseId) : undefined,
        );
    }
    @Get('students/:studentId/enrollments')
    findByStudent(@Param('studentId') studentId: string) {
        return this.enrollmentsService.findByStudent(Number(studentId));
    }
    @Get('courses/:courseId/enrollments')
    findByCourse(@Param('courseId') courseId: string) {
        return this.enrollmentsService.findByCourse(Number(courseId));
    }
    @Delete('enrollments/:id')
    remove(@Param('id') id: string) {
        return this.enrollmentsService.remove(Number(id));
    }
    }