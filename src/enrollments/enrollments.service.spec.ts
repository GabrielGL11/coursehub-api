import { jest } from '@jest/globals';
import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EnrollmentsService } from './enrollments.service.js';
import { Enrollment } from './entities/enrollment.entity.js';
import { StudentsService } from '../students/students.service.js';
import { CoursesService } from '../courses/courses.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import type { Student } from '../students/entities/student.entity.js';
import type { Course } from '../courses/entities/course.entity.js';

describe('EnrollmentsService', () => {
  let service: EnrollmentsService;
  const repositoryMock = {
    findOne: jest.fn<(options: unknown) => Promise<Enrollment | null>>(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };
  const studentsServiceMock = {
    findOne: jest.fn<StudentsService['findOne']>(),
  };
  const coursesServiceMock = {
    findOne: jest.fn<CoursesService['findOne']>(),
  };
  const notificationsServiceMock = {
    enrollmentCreated: jest.fn<NotificationsService['enrollmentCreated']>(),
  };
  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentsService,
        {
          provide: getRepositoryToken(Enrollment),
          useValue: repositoryMock,
        },
        { provide: StudentsService, useValue: studentsServiceMock },
        { provide: CoursesService, useValue: coursesServiceMock },
        { provide: NotificationsService, useValue: notificationsServiceMock },
      ],
    }).compile();
    service = module.get<EnrollmentsService>(EnrollmentsService);
  });
  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });
  it('debe rechazar una matrícula si el estudiante está inactivo', async () => {
    studentsServiceMock.findOne.mockResolvedValue({
      id: 2,
      name: 'David Zambrano',
      isActive: false,
    } as Student);
    await expect(
      service.create({ studentId: 2, courseId: 1 }),
    ).rejects.toThrow(ConflictException);
    expect(coursesServiceMock.findOne).not.toHaveBeenCalled();
    expect(repositoryMock.save).not.toHaveBeenCalled();
  });
  it('debe rechazar una matrícula duplicada', async () => {
    studentsServiceMock.findOne.mockResolvedValue({
      id: 1,
      name: 'Carlos Mendoza',
      isActive: true,
    } as Student);
    coursesServiceMock.findOne.mockResolvedValue({
      id: 1,
      title: 'NestJS desde cero',
    } as Course);
    repositoryMock.findOne.mockResolvedValue({
      id: 10,
      student: { id: 1 },
      course: { id: 1 },
    } as Enrollment);
    await expect(
      service.create({ studentId: 1, courseId: 1 }),
    ).rejects.toThrow(ConflictException);
    expect(repositoryMock.save).not.toHaveBeenCalled();
  });
  it('debe avisar en tiempo real solo con identificadores al crear la matrícula', async () => {
    const student = { id: 1, name: 'Carlos Mendoza', isActive: true } as Student;
    const course = { id: 2, title: 'NestJS desde cero' } as Course;
    const saved = { id: 10, student, course } as Enrollment;
    studentsServiceMock.findOne.mockResolvedValue(student);
    coursesServiceMock.findOne.mockResolvedValue(course);
    repositoryMock.findOne.mockResolvedValue(null);
    repositoryMock.create.mockReturnValue({ student, course });
    repositoryMock.save.mockResolvedValue(saved);

    await expect(service.create({ studentId: 1, courseId: 2 })).resolves.toBe(saved);

    expect(notificationsServiceMock.enrollmentCreated).toHaveBeenCalledTimes(1);
    const event = notificationsServiceMock.enrollmentCreated.mock.calls[0][0];
    expect(event).toMatchObject({ enrollmentId: 10, studentId: 1, courseId: 2 });
    expect(Object.keys(event).sort()).toEqual([
      'courseId',
      'enrollmentId',
      'occurredAt',
      'studentId',
    ]);
  });
  it('no debe avisar si la matrícula se rechaza', async () => {
    studentsServiceMock.findOne.mockResolvedValue({ id: 2, isActive: false } as Student);
    await expect(
      service.create({ studentId: 2, courseId: 1 }),
    ).rejects.toThrow(ConflictException);
    expect(notificationsServiceMock.enrollmentCreated).not.toHaveBeenCalled();
  });
});


