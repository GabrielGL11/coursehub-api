import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentsService } from '../students/students.service.js';
import { CoursesService } from '../courses/courses.service.js';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto.js';
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
        const { studentId, courseId } = createEnrollmentDto;

        // 1. Buscar estudiante
        const student = await this.studentsService.findOne(studentId);

        // 2. Verificar que el estudiante esté activo
        if (!student.isActive) {
        throw new ConflictException(
            'No se puede matricular un estudiante inactivo',
        );
        }

        // 3. Buscar curso
        const course = await this.coursesService.findOne(courseId);

        // 4. Verificar matrícula duplicada
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

        // 5. Crear matrícula
        const enrollment = this.enrollmentsRepository.create({
        student,
        course,
        });

        // 6. Guardar en PostgreSQL
        return this.enrollmentsRepository.save(enrollment);
    }

    async findAll(
        studentId?: number,
        courseId?: number,
    ): Promise<Enrollment[]> {
        const query = this.enrollmentsRepository
        .createQueryBuilder('enrollment')
        .leftJoinAndSelect('enrollment.student', 'student')
        .leftJoinAndSelect('enrollment.course', 'course');

        if (studentId !== undefined) {
        query.andWhere('student.id = :studentId', {
            studentId,
        });
        }

        if (courseId !== undefined) {
        query.andWhere('course.id = :courseId', {
            courseId,
        });
        }

        return query.getMany();
    }

    async findByStudent(
        studentId: number,
    ): Promise<Enrollment[]> {
        // Verificar que exista el estudiante
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
        // Verificar que exista el curso
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

        await this.enrollmentsRepository.remove(enrollment);

        return enrollment;
    }
}