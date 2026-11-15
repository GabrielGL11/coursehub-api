import { vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CoursesService } from './courses.service.js';
import { Course } from './entities/course.entity.js';
import { UserRole } from '../users/user-role.enum.js';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type.js';

describe('CoursesService', () => {
  let service: CoursesService;

  const repositoryMock = {
    findAndCount: vi.fn(),
    findOneBy: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    remove: vi.fn(),
  };

  const docentePropietario: AuthenticatedUser = {
    id: 2,
    email: 'docente2@example.com',
    role: UserRole.TEACHER,
  };

  beforeEach(async () => {
    vi.clearAllMocks();

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

  it('debe devolver un curso existente', async () => {
    const curso = { id: 1, title: 'NestJS desde cero', level: 'beginner' };
    repositoryMock.findOneBy.mockResolvedValue(curso);

    await expect(service.findOne(1)).resolves.toEqual(curso);
    expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('debe lanzar un error si el curso no existe', async () => {
    repositoryMock.findOneBy.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow('Course 999 not found');
  });

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