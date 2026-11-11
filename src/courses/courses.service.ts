import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';
import { CoursesQueryDto } from './dto/courses-query.dto.js';
import { Course } from './entities/course.entity.js';
import { UserRole } from '../users/user-role.enum.js';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type.js';

@Injectable()
export class CoursesService {
    constructor(
        @InjectRepository(Course)
        private readonly coursesRepository: Repository<Course>,
    ) {}

    async findAll(query: CoursesQueryDto) {
        const {
        level,
        page,
        limit,
        sortBy,
        order,
        } = query;

        const [items, total] =
        await this.coursesRepository.findAndCount({
            where: level ? { level } : {},
            order: {
            [sortBy]: order,
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
        items,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
        };
    }

    async findOne(id: number): Promise<Course> {
        const course = await this.coursesRepository.findOneBy({
        id,
        });

        if (!course) {
        throw new NotFoundException(
            `Course ${id} not found`,
        );
        }

        return course;
    }

    create(dto: CreateCourseDto, actor: AuthenticatedUser) {
        const course = this.coursesRepository.create({
        ...dto,
        createdByUserId: actor.id,
        });

        return this.coursesRepository.save(course);
    }

    async update(
        id: number,
        dto: UpdateCourseDto,
        actor: AuthenticatedUser,
    ) {
        const course = await this.findOne(id);

        const isAdmin = actor.role === UserRole.ADMIN;
        const isOwner = course.createdByUserId === actor.id;

        if (!isAdmin && !isOwner) {
        throw new ForbiddenException(
            'No tienes permisos para modificar este curso',
        );
        }

        Object.assign(course, dto);

        return this.coursesRepository.save(course);
    }

    async remove(id: number) {
        const course = await this.findOne(id);

        await this.coursesRepository.remove(course);

        return course;
    }
}