import { Test, type TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { CoursesController } from './courses.controller.js';
import { CoursesService } from './courses.service.js';
import { UpdateCourseUseCase } from './use-cases/update-course.use-case.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import type { CoursesQueryDto } from './dto/courses-query.dto.js';
import type { CreateCourseDto } from './dto/create-course.dto.js';
import type { UpdateCourseDto } from './dto/update-course.dto.js';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type.js';
import { UserRole } from '../users/user-role.enum.js';

describe('CoursesController', () => {
  let controller: CoursesController;

  // Mock del servicio de cursos con tipos explícitos para Jest.
  const coursesServiceMock = {
    findAll: jest.fn<(query: CoursesQueryDto) => Promise<any>>(),
    findOne: jest.fn<(id: number) => Promise<any>>(),
    create: jest.fn<
      (dto: CreateCourseDto, user: AuthenticatedUser) => Promise<any>
    >(),
    remove: jest.fn<(id: number) => Promise<void>>(),
  };

  // Mock del caso de uso de actualización.
  const updateCourseUseCaseMock = {
    execute: jest.fn<
      (
        id: number,
        dto: UpdateCourseDto,
        user: AuthenticatedUser,
      ) => Promise<any>
    >(),
  };

  const authenticatedUser = {
    id: 7,
    email: 'docente@example.com',
    role: UserRole.TEACHER,
  } as AuthenticatedUser;

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [
        {
          provide: CoursesService,
          useValue: coursesServiceMock,
        },
        {
          provide: UpdateCourseUseCase,
          useValue: updateCourseUseCaseMock,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CoursesController>(CoursesController);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('debe delegar la consulta al servicio', async () => {
      const query = {
        page: 1,
        limit: 10,
      } as unknown as CoursesQueryDto;

      const expected = { items: [], meta: {} };

      coursesServiceMock.findAll.mockResolvedValue(expected);

      await expect(controller.findAll(query)).resolves.toEqual(expected);

      expect(coursesServiceMock.findAll).toHaveBeenCalledWith(query);
      expect(coursesServiceMock.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('debe delegar el identificador al servicio', async () => {
      const courseId = 5;
      const expected = { id: courseId, title: 'NestJS' };

      coursesServiceMock.findOne.mockResolvedValue(expected);

      await expect(controller.findOne(courseId)).resolves.toEqual(expected);

      expect(coursesServiceMock.findOne).toHaveBeenCalledWith(courseId);
    });
  });

  describe('create', () => {
    it('debe delegar el DTO y el usuario autenticado al servicio', async () => {
      const dto = {
        title: 'Curso de prueba',
      } as unknown as CreateCourseDto;

      const expected = { id: 10, title: 'Curso de prueba' };

      coursesServiceMock.create.mockResolvedValue(expected);

      await expect(
        controller.create(dto, { user: authenticatedUser }),
      ).resolves.toEqual(expected);

      expect(coursesServiceMock.create).toHaveBeenCalledWith(
        dto,
        authenticatedUser,
      );

      expect(coursesServiceMock.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('debe delegar el ID, el DTO y el usuario autenticado al caso de uso', async () => {
      const courseId = 10;

      const dto = {
        title: 'Curso actualizado',
      } as unknown as UpdateCourseDto;

      const expected = { id: courseId, title: 'Curso actualizado' };

      updateCourseUseCaseMock.execute.mockResolvedValue(expected);

      await expect(
        controller.update(courseId, dto, { user: authenticatedUser }),
      ).resolves.toEqual(expected);

      expect(updateCourseUseCaseMock.execute).toHaveBeenCalledWith(
        courseId,
        dto,
        authenticatedUser,
      );

      expect(updateCourseUseCaseMock.execute).toHaveBeenCalledTimes(1);
    });

    it('debe propagar el error cuando el usuario no tiene autorización', async () => {
      const error = new ForbiddenException(
        'No tienes permisos para modificar este curso',
      );

      updateCourseUseCaseMock.execute.mockRejectedValue(error);

      await expect(
        controller.update(
          10,
          {} as UpdateCourseDto,
          { user: authenticatedUser },
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('debe propagar el error cuando el curso no existe', async () => {
      const error = new NotFoundException('Course 10 not found');

      updateCourseUseCaseMock.execute.mockRejectedValue(error);

      await expect(
        controller.update(
          10,
          {} as UpdateCourseDto,
          { user: authenticatedUser },
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debe delegar el identificador al servicio', async () => {
      const courseId = 15;

      coursesServiceMock.remove.mockResolvedValue(undefined);

      await expect(controller.remove(courseId)).resolves.toBeUndefined();

      expect(coursesServiceMock.remove).toHaveBeenCalledWith(courseId);
      expect(coursesServiceMock.remove).toHaveBeenCalledTimes(1);
    });
  });
});
