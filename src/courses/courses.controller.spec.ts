import { vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from './courses.controller.js';
import { CoursesService } from './courses.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { UserRole } from '../users/user-role.enum.js';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type.js';

describe('CoursesController', () => {
  let controller: CoursesController;

  const coursesServiceMock = {
    findAll: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  const docente: AuthenticatedUser = {
    id: 2,
    email: 'docente2@example.com',
    role: UserRole.TEACHER,
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [{ provide: CoursesService, useValue: coursesServiceMock }],
    })
      // Los guards se prueban por separado; aquí se reemplazan para probar el controlador.
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

  it('debe delegar la consulta de cursos al servicio', async () => {
    const resultado = {
      items: [{ id: 1, title: 'NestJS desde cero', level: 'beginner' }],
      meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
    };
    coursesServiceMock.findAll.mockResolvedValue(resultado);

    const query = { page: 1, limit: 10, sortBy: 'id', order: 'ASC' };

    await expect(controller.findAll(query as any)).resolves.toEqual(resultado);
    expect(coursesServiceMock.findAll).toHaveBeenCalledWith(query);
  });

  it('debe delegar la búsqueda de un curso por ID', async () => {
    const curso = { id: 1, title: 'NestJS desde cero', level: 'beginner' };
    coursesServiceMock.findOne.mockResolvedValue(curso);

    await expect(controller.findOne('1')).resolves.toEqual(curso);
    expect(coursesServiceMock.findOne).toHaveBeenCalledWith(1);
  });

  it('debe crear un curso pasando el usuario autenticado al servicio', async () => {
    const dto = { title: 'Curso nuevo', level: 'beginner' };
    const creado = { id: 8, ...dto, createdByUserId: 2 };
    coursesServiceMock.create.mockResolvedValue(creado);

    await expect(controller.create(dto, { user: docente })).resolves.toEqual(
      creado,
    );
    expect(coursesServiceMock.create).toHaveBeenCalledWith(dto, docente);
  });

  it('debe actualizar un curso pasando el ID numérico y el usuario autenticado', async () => {
    const body = { title: 'Título nuevo' };
    coursesServiceMock.update.mockResolvedValue({ id: 6, ...body });

    await controller.update('6', body, { user: docente });

    expect(coursesServiceMock.update).toHaveBeenCalledWith(6, body, docente);
  });

  it('debe eliminar un curso convirtiendo el ID a número', async () => {
    coursesServiceMock.remove.mockResolvedValue({ id: 7 });

    await controller.remove('7');

    expect(coursesServiceMock.remove).toHaveBeenCalledWith(7);
  });
});