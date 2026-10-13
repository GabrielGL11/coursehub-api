
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-students.dto.js';
import { UpdateStudentDto } from './dto/update-students.dto.js';
import { StudentsQueryDto } from './dto/students-query.dto.js';
import { Student } from './entities/student.entity.js';

@Injectable()
    export class StudentsService {
    constructor(
        @InjectRepository(Student)
        private readonly studentsRepository: Repository<Student>,
    ) {}

    async findAll(query: StudentsQueryDto) {
        const {
        search,
        career,
        semester,
        isActive,
        page = 1,
        limit = 10,
        sortBy = 'id',
        order = 'ASC',
        } = query;

        const queryBuilder =
        this.studentsRepository.createQueryBuilder('student');

        if (career !== undefined) {
        queryBuilder.andWhere(
            'student.career = :career',
            { career },
        );
        }

        if (semester !== undefined) {
        queryBuilder.andWhere(
            'student.semester = :semester',
            { semester },
        );
        }

        if (isActive !== undefined) {
        queryBuilder.andWhere(
            'student.isActive = :isActive',
            { isActive },
        );
        }

        if (search?.trim()) {
        queryBuilder.andWhere(
            '(student.name ILIKE :search OR student.email ILIKE :search)',
            { search: `%${search.trim()}%` },
        );
        }

        const allowedSortFields = {
        id: 'student.id',
        name: 'student.name',
        email: 'student.email',
        age: 'student.age',
        career: 'student.career',
        semester: 'student.semester',
        } as const;

        const sortColumn =
        allowedSortFields[
            sortBy as keyof typeof allowedSortFields
        ] ?? 'student.id';

        queryBuilder
        .orderBy(sortColumn, order as 'ASC' | 'DESC')
        .skip((page - 1) * limit)
        .take(limit);

        const [items, total] =
        await queryBuilder.getManyAndCount();

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

        if (emailExists && emailExists.id !== id) {
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