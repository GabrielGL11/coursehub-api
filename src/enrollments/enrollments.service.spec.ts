import { vi } from 'vitest';
import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EnrollmentsService } from './enrollments.service.js';
import { Enrollment } from './entities/enrollment.entity.js';
import { StudentsService } from '../students/students.service.js';
import { CoursesService } from '../courses/courses.service.js';

describe('EnrollmentsService', () => {
  let service: EnrollmentsService;
  const repositoryMock = {
    findOne: vi.fn(),
    find: vi.fn(),
    createQueryBuilder: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    remove: vi.fn(),
  };
  const studentsServiceMock = {
    findOne: vi.fn(),
  };
  const coursesServiceMock = {
    findOne: vi.fn(),
  };
  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentsService,
        {
          provide: getRepositoryToken(Enrollment),
          useValue: repositoryMock,
        },
        { provide: StudentsService, useValue: studentsServiceMock },
        { provide: CoursesService, useValue: coursesServiceMock },
      ],
    }).compile();
    service = module.get<EnrollmentsService>(EnrollmentsService);
  });
  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });
  it('debe rechazar una matrÃ­cula si el estudiante estÃ¡ inactivo', async () => {
    studentsServiceMock.findOne.mockResolvedValue({
      id: 2,
      name: 'David Zambrano',
      isActive: false,
    });
    await expect(
      service.create({ studentId: 2, courseId: 1 }),
    ).rejects.toThrow(ConflictException);
    expect(coursesServiceMock.findOne).not.toHaveBeenCalled();
    expect(repositoryMock.save).not.toHaveBeenCalled();
  });
  it('debe rechazar una matrÃ­cula duplicada', async () => {
    studentsServiceMock.findOne.mockResolvedValue({
      id: 1,
      name: 'Carlos Mendoza',
      isActive: true,
    });
    coursesServiceMock.findOne.mockResolvedValue({
      id: 1,
      title: 'NestJS desde cero',
    });
    repositoryMock.findOne.mockResolvedValue({
      id: 10,
      student: { id: 1 },
      course: { id: 1 },
    });
    await expect(
      service.create({ studentId: 1, courseId: 1 }),
    ).rejects.toThrow(ConflictException);
    expect(repositoryMock.save).not.toHaveBeenCalled();
  });
});
