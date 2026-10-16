import { vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CoursesService } from './courses.service.js';
import { Course } from './entities/course.entity.js';

describe('CoursesService', () => {
  let service: CoursesService;
  const repositoryMock = {
    findAndCount: vi.fn(),
    findOneBy: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    remove: vi.fn(),
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
    await expect(service.findOne(999)).rejects.toThrow(
      'Course 999 not found',
    );
  });
  it('debe crear y guardar un curso', async () => {
    const dto = { title: 'DiseÃ±o de APIs', level: 'intermediate' };
    const curso = { id: 2, ...dto };
    repositoryMock.create.mockReturnValue(curso);
    repositoryMock.save.mockResolvedValue(curso);
    await expect(service.create(dto as any)).resolves.toEqual(curso);
    expect(repositoryMock.create).toHaveBeenCalledWith(dto);
    expect(repositoryMock.save).toHaveBeenCalledWith(curso);
  });
});
