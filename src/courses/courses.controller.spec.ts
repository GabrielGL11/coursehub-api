import { vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from './courses.controller.js';
import { CoursesService } from './courses.service.js';

describe('CoursesController', () => {
  let controller: CoursesController;
  const coursesServiceMock = {
    findAll: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };
  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [
        { provide: CoursesService, useValue: coursesServiceMock },
      ],
    }).compile();
    controller = module.get<CoursesController>(CoursesController);
  });
  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });
  it('debe delegar la consulta de cursos al servicio', async () => {
    const resultado = {
      items: [{ id: 1, title: 'NestJS desde cero', level: 'beginner' }],
      meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
    };
    coursesServiceMock.findAll.mockResolvedValue(resultado);
    const query = {
      page: 1,
      limit: 10,
      sortBy: 'id',
      order: 'ASC',
    };
    await expect(controller.findAll(query as any)).resolves.toEqual(resultado);
    expect(coursesServiceMock.findAll).toHaveBeenCalledWith(query);
  });
  it('debe delegar la bÃºsqueda de un curso por ID', async () => {
    const curso = { id: 1, title: 'NestJS desde cero', level: 'beginner' };
    coursesServiceMock.findOne.mockResolvedValue(curso);
    await expect(controller.findOne('1')).resolves.toEqual(curso);
    expect(coursesServiceMock.findOne).toHaveBeenCalledWith(1);
  });
});
