import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CoursesService } from './courses.service.js';
import { Course } from './entities/course.entity.js';
import { UserRole } from '../users/user-role.enum.js';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type.js';

describe('CoursesService', () => {
  let service: CoursesService;

  // Doble del repositorio de TypeORM: solo los métodos que usa CoursesService,
  // con los tipos de retorno reales de la entidad Course.
  const repositoryMock = {
    findAndCount: jest.fn<(options: unknown) => Promise<[Course[], number]>>(),
    findOneBy: jest.fn<(where: unknown) => Promise<Course | null>>(),
    create: jest.fn<(entityLike: unknown) => Course>(),
    save: jest.fn<(entity: Course) => Promise<Course>>(),
    remove: jest.fn<(entity: Course) => Promise<Course>>(),
  };

  const docentePropietario: AuthenticatedUser = {
    id: 2,
    email: 'docente2@example.com',
    role: UserRole.TEACHER,
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: getRepositoryToken(Course),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('debe aplicar paginación y orden, y calcular el total de páginas', async () => {
      // Arrange
      const cursos = [{ id: 6 }, { id: 7 }] as Course[];
      repositoryMock.findAndCount.mockResolvedValue([cursos, 12]);

      // Act
      const resultado = await service.findAll({
        page: 2,
        limit: 5,
        sortBy: 'title',
        order: 'DESC',
      });

      // Assert
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith({
        where: {},
        order: { title: 'DESC' },
        skip: 5,
        take: 5,
      });
      expect(resultado).toEqual({
        items: cursos,
        meta: { total: 12, page: 2, limit: 5, totalPages: 3 },
      });
    });

    it('debe filtrar por nivel cuando se envía level', async () => {
      // Arrange
      repositoryMock.findAndCount.mockResolvedValue([[], 0]);

      // Act
      await service.findAll({
        level: 'beginner',
        page: 1,
        limit: 10,
        sortBy: 'id',
        order: 'ASC',
      });

      // Assert
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ where: { level: 'beginner' } }),
      );
    });

    it('debe informar cero páginas cuando no hay cursos', async () => {
      // Arrange
      repositoryMock.findAndCount.mockResolvedValue([[], 0]);

      // Act
      const resultado = await service.findAll({
        page: 1,
        limit: 10,
        sortBy: 'id',
        order: 'ASC',
      });

      // Assert
      expect(resultado.items).toEqual([]);
      expect(resultado.meta.totalPages).toBe(0);
    });
  });

  describe('findOne', () => {
    it('debe devolver un curso existente', async () => {
      const curso = {
        id: 1,
        title: 'NestJS desde cero',
        level: 'beginner',
      } as Course;
      repositoryMock.findOneBy.mockResolvedValue(curso);

      await expect(service.findOne(1)).resolves.toEqual(curso);
      expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('debe lanzar un error si el curso no existe', async () => {
      repositoryMock.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow('Course 999 not found');
    });
  });

  describe('create', () => {
    it('debe crear un curso asignando el propietario desde el usuario autenticado', async () => {
      const dto = { title: 'Diseño de APIs', level: 'intermediate' };
      const curso = { id: 2, ...dto, createdByUserId: docentePropietario.id };

      repositoryMock.create.mockReturnValue(curso);
      repositoryMock.save.mockResolvedValue(curso);

      await expect(
        service.create(dto as any, docentePropietario),
      ).resolves.toEqual(curso);

      expect(repositoryMock.create).toHaveBeenCalledWith({
        ...dto,
        createdByUserId: docentePropietario.id,
      });
      expect(repositoryMock.save).toHaveBeenCalledWith(curso);
    });
  });

  describe('remove', () => {
    it('debe eliminar un curso existente y devolverlo', async () => {
      // Arrange
      const curso = { id: 7, title: 'NestJS', level: 'beginner' } as Course;
      repositoryMock.findOneBy.mockResolvedValue(curso);
      repositoryMock.remove.mockResolvedValue(curso);

      // Act
      const resultado = await service.remove(7);

      // Assert
      expect(resultado).toEqual(curso);
      expect(repositoryMock.remove).toHaveBeenCalledWith(curso);
    });

    it('debe lanzar NotFoundException si el curso no existe y no eliminar nada', async () => {
      // Arrange
      repositoryMock.findOneBy.mockResolvedValue(null);

      // Act
      const accion = service.remove(999);

      // Assert
      await expect(accion).rejects.toThrow('Course 999 not found');
      expect(repositoryMock.remove).not.toHaveBeenCalled();
    });
  });
});


