import { ConflictException, Injectable, NotFoundException, BadRequestException} from '@nestjs/common';

import { CreateStudentDto } from './dto/create-students.dto.js';
import { UpdateStudentDto } from './dto/update-students.dto.js';

type Student = {
    id: number;
    name: string;
    email: string;
    age: number;
    career: string;
    semester: number;
    isActive: boolean;
};

@Injectable()
export class StudentsService {
    private nextId = 4;

    private students: Student[] = [
    {
        id: 1,
        name: 'Ana Pérez',
        email: 'ana@gmail.com',
        age: 20,
        career: 'Ingeniería de Software',
        semester: 4,
        isActive: true
    },
    {
        id: 2,
        name: 'Carlos Gómez',
        email: 'carlos@gmail.com',
        age: 22,
        career: 'Tecnologías de la Información',
        semester: 6,
        isActive: true
    },
    {
        id: 3,
        name: 'María López',
        email: 'maria@gmail.com',
        age: 21,
        career: 'Ingeniería de Software',
        semester: 5,
        isActive: false
    },
    ];

    findAll(
    career?: string,
    semester?: number,
    isActive?: boolean,
    ): Student[] {
    return this.students.filter((student) => {
        if (career && student.career !== career) {
            return false;
        }
        if (semester !== undefined && student.semester !== semester) {
            return false;
        }
        if (isActive !== undefined && student.isActive !== isActive) {
            return false;
        }
            return true;
    });
    }

    findOne(id: number): Student {
    const student = this.students.find((student) => student.id === id);

    if (!student) {
        throw new NotFoundException('Estudiante no encontrado');
    }
        return student;
    }

    create(createStudentDto: CreateStudentDto): Student {
    const emailExists = this.students.some(
        (student) => student.email === createStudentDto.email,
    );

    if (emailExists) {
        throw new ConflictException(
        'El correo electrónico ya está registrado',
        );
    }

    const student: Student = {
        id: this.nextId++,
        ...createStudentDto,
    };

    this.students.push(student);
        return student;
    }

    update(id: number, updateStudentDto: UpdateStudentDto): Student {
    const student = this.findOne(id);

    if (
        updateStudentDto.email &&
        updateStudentDto.email !== student.email
    ) {
        const emailExists = this.students.some(
        (item) =>
            item.email === updateStudentDto.email &&
            item.id !== id,
        );

        if (emailExists) {
        throw new ConflictException(
            'El correo electrónico ya está registrado',
        );
        }
    }

    Object.assign(student, updateStudentDto);
    return student;
    }

    remove(id: number): Student {
    const student = this.findOne(id);

    if (!student.isActive) {
        throw new BadRequestException(
        'No se puede eliminar un estudiante inactivo',
        );
    }

    const index = this.students.findIndex(
        (student) => student.id === id,
    );

    const [removedStudent] = this.students.splice(index, 1);
        return removedStudent;
    }

    updateStatus(id: number, isActive: boolean): Student {
    const student = this.findOne(id);

    student.isActive = isActive;

        return student;
    }
}