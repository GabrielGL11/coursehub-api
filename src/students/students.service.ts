import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-students.dto.js';
import { UpdateStudentDto } from './dto/update-students.dto.js';
import { Student } from './entities/student.entity.js';

@Injectable()
    export class StudentsService {
    constructor(
        @InjectRepository(Student)
        private readonly studentsRepository: Repository<Student>,
    ) {}

    async findAll(
        career?: string,
        semester?: number,
        isActive?: boolean,
    ): Promise<Student[]> {
        return this.studentsRepository.find({
        where: {
            ...(career !== undefined ? { career } : {}),
            ...(semester !== undefined ? { semester } : {}),
            ...(isActive !== undefined ? { isActive } : {}),
        },
        order: {
            id: 'ASC',
        },
        });
    }

    async findOne(id: number): Promise<Student> {
        const student = await this.studentsRepository.findOneBy({
        id,
        });

        if (!student) {
        throw new NotFoundException(
            'Estudiante no encontrado',
        );
        }

        return student;
    }

    async create(
        createStudentDto: CreateStudentDto,
    ): Promise<Student> {
        const emailExists =
        await this.studentsRepository.findOneBy({
            email: createStudentDto.email,
        });

        if (emailExists) {
        throw new ConflictException(
            'El correo electrónico ya está registrado',
        );
        }

        const student =
        this.studentsRepository.create(createStudentDto);

        return this.studentsRepository.save(student);
    }

    async update(
        id: number,
        updateStudentDto: UpdateStudentDto,
    ): Promise<Student> {
        const student = await this.findOne(id);

        if (
        updateStudentDto.email &&
        updateStudentDto.email !== student.email
        ) {
        const emailExists =
            await this.studentsRepository.findOneBy({
            email: updateStudentDto.email,
            });

        if (
            emailExists &&
            emailExists.id !== id
        ) {
            throw new ConflictException(
            'El correo electrónico ya está registrado',
            );
        }
        }

        Object.assign(student, updateStudentDto);

        return this.studentsRepository.save(student);
    }

    async remove(id: number): Promise<Student> {
        const student = await this.findOne(id);

        if (!student.isActive) {
        throw new BadRequestException(
            'No se puede eliminar un estudiante inactivo',
        );
        }

        await this.studentsRepository.remove(student);

        return student;
    }

    async updateStatus(
        id: number,
        isActive: boolean,
    ): Promise<Student> {
        const student = await this.findOne(id);

        student.isActive = isActive;

        return this.studentsRepository.save(student);
    }
}