import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Request } from '@nestjs/common';
import { CoursesService } from './courses.service.js';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';
import { CoursesQueryDto } from './dto/courses-query.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '../users/user-role.enum.js';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type.js';

@Controller('courses')
export class CoursesController {
    constructor(
        private readonly coursesService: CoursesService,
    ) {}

    @Get()
    findAll(@Query() query: CoursesQueryDto) {
        return this.coursesService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.coursesService.findOne(Number(id));
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.TEACHER)
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
    update(
        @Param('id') id: string,
        @Body() body: UpdateCourseDto,
        @Request() req: { user: AuthenticatedUser },
    ) {
        return this.coursesService.update(
        Number(id),
        body,
        req.user,
        );
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string) {
        return this.coursesService.remove(Number(id));
    }
}