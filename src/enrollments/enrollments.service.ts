import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentsService } from '../students/students.service.js';
import { CoursesService } from '../courses/courses.service.js';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto.js';
import { EnrollmentsQueryDto } from './dto/enrollments-query.dto.js';
import { Enrollment } from './entities/enrollment.entity.js';

@Injectable()
export class EnrollmentsService {
    constructor(
        @InjectRepository(Enrollment)
        private readonly enrollmentsRepository: Repository<Enrollment>,
        private readonly studentsService: StudentsService,
        private readonly coursesService: CoursesService,
    ) {}
    async create(
        createEnrollmentDto: CreateEnrollmentDto,
    ): Promise<Enrollment> {
        const { studentId, courseId } =
            createEnrollmentDto;
        const student =
            await this.studentsService.findOne(studentId);
        if (!student.isActive) {
            throw new ConflictException(
                'No se puede matricular un estudiante inactivo',
            );
        }
        const course =
            await this.coursesService.findOne(courseId);
        const alreadyExists =
            await this.enrollmentsRepository.findOne({
                where: {
                    student: {
                        id: studentId,
                    },
                    course: {
                        id: courseId,
                    },
                },
            });
        if (alreadyExists) {
            throw new ConflictException(
                'El estudiante ya está matriculado en este curso',
            );
        }
        const enrollment =
            this.enrollmentsRepository.create({
                student,
                course,
            });
        return this.enrollmentsRepository.save(
            enrollment,
        );
    }
    async findAll(query: EnrollmentsQueryDto) {
        const {
            search,
            studentId,
            courseId,
            activeOnly,
            page,
            limit,
        } = query;
        const queryBuilder =
            this.enrollmentsRepository
                .createQueryBuilder('enrollment')
                .leftJoinAndSelect(
                    'enrollment.student',
                    'student',
                )
                .leftJoinAndSelect(
                    'enrollment.course',
                    'course',
                );
        if (search) {
            queryBuilder.andWhere(
                `(
                    LOWER(student.name) LIKE LOWER(:search)
                    OR LOWER(course.title) LIKE LOWER(:search)
                )`,
                {
                    search: `%${search}%`,
                },
            );
        }
        if (studentId !== undefined) {
            queryBuilder.andWhere(
                'student.id = :studentId',
                {
                    studentId,
                },
            );
        }
        if (courseId !== undefined) {
            queryBuilder.andWhere(
                'course.id = :courseId',
                {
                    courseId,
                },
            );
        }
        if (activeOnly === true) {
            queryBuilder.andWhere(
                'student.isActive = :activeOnly',
                {
                    activeOnly: true,
                },
            );
        }
        const [items, total] =
            await queryBuilder
                .orderBy('enrollment.id', 'ASC')
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();
        return {
            items,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(
                    total / limit,
                ),
            },
        };
    }
    async findByStudent(
        studentId: number,
    ): Promise<Enrollment[]> {
        await this.studentsService.findOne(studentId);
        return this.enrollmentsRepository.find({
            where: {
                student: {
                    id: studentId,
                },
            },
            relations: {
                student: true,
                course: true,
            },
        });
    }
    async findByCourse(
        courseId: number,
    ): Promise<Enrollment[]> {
        await this.coursesService.findOne(courseId);
        return this.enrollmentsRepository.find({
            where: {
                course: {
                    id: courseId,
                },
            },
            relations: {
                student: true,
                course: true,
            },
        });
    }
    async remove(id: number): Promise<Enrollment> {
        const enrollment =
            await this.enrollmentsRepository.findOne({
                where: {
                    id,
                },
                relations: {
                    student: true,
                    course: true,
                },
            });
        if (!enrollment) {
            throw new NotFoundException(
                'Matrícula no encontrada',
            );
        }
        await this.enrollmentsRepository.remove(
            enrollment,
        );
        return enrollment;
    }
}