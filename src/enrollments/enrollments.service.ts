import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { StudentsService } from '../students/students.service.js';
import { CoursesService } from '../courses/courses.service.js';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto.js';
    type Enrollment = {
    id: number;
    studentId: number;
    courseId: number;
    };
    @Injectable()
    export class EnrollmentsService {
    private readonly enrollments: Enrollment[] = [];
    private nextId = 1;
    constructor(
        private readonly studentsService: StudentsService,
        private readonly coursesService: CoursesService,
    ) {}
    create(createEnrollmentDto: CreateEnrollmentDto): Enrollment {
        const { studentId, courseId } = createEnrollmentDto;
        const student = this.studentsService.findOne(studentId);
        if (!student.isActive) {
        throw new ConflictException(
            'No se puede matricular un estudiante inactivo',
        );
        }
        const course = this.coursesService.findOne(courseId);
        if (!course) {
        throw new NotFoundException('Curso no encontrado');
        }
        const alreadyExists = this.enrollments.some(
        (enrollment) =>
            enrollment.studentId === studentId &&
            enrollment.courseId === courseId,
        );
        if (alreadyExists) {
        throw new ConflictException(
            'El estudiante ya está matriculado en este curso',
        );
        }
        const enrollment: Enrollment = {
        id: this.nextId++,
        studentId,
        courseId,
        };
        this.enrollments.push(enrollment);
        return enrollment;
    }
    findAll(studentId?: number, courseId?: number): Enrollment[] {
        return this.enrollments.filter((enrollment) => {
        if (
            studentId !== undefined &&
            enrollment.studentId !== studentId
        ) {
            return false;
        }
        if (
            courseId !== undefined &&
            enrollment.courseId !== courseId
        ) {
            return false;
        }
        return true;
        });
    }
    findByStudent(studentId: number): Enrollment[] {
        this.studentsService.findOne(studentId);
        return this.enrollments.filter(
        (enrollment) => enrollment.studentId === studentId,
        );
    }
    findByCourse(courseId: number): Enrollment[] {
        const course = this.coursesService.findOne(courseId);
        if (!course) {
        throw new NotFoundException('Curso no encontrado');
        }
        return this.enrollments.filter(
        (enrollment) => enrollment.courseId === courseId,
        );
    }
    remove(id: number): Enrollment {
        const index = this.enrollments.findIndex(
        (enrollment) => enrollment.id === id,
        );
        if (index === -1) {
        throw new NotFoundException('Matrícula no encontrada');
        }
        const [removedEnrollment] = this.enrollments.splice(index, 1);
        return removedEnrollment;
    }
    }