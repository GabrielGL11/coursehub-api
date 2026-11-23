import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentsController } from './enrollments.controller.js';
import { EnrollmentsService } from './enrollments.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

describe('EnrollmentsController', () => {
  let controller: EnrollmentsController;

  const enrollmentsServiceMock = {
    create: jest.fn<EnrollmentsService['create']>(),
    findAll: jest.fn<EnrollmentsService['findAll']>(),
    findByStudent: jest.fn<EnrollmentsService['findByStudent']>(),
    findByCourse: jest.fn<EnrollmentsService['findByCourse']>(),
    remove: jest.fn<EnrollmentsService['remove']>(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollmentsController],
      providers: [
        { provide: EnrollmentsService, useValue: enrollmentsServiceMock },
      ],
    })
      // El guard JWT se prueba por separado; aquí se reemplaza para probar el controlador.
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<EnrollmentsController>(EnrollmentsController);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debe delegar el listado de matrículas al servicio', async () => {
    const resultado = {
      items: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
    };
    enrollmentsServiceMock.findAll.mockResolvedValue(resultado);

    const query = { page: 1, limit: 10 };

    await expect(controller.findAll(query as any)).resolves.toEqual(resultado);
    expect(enrollmentsServiceMock.findAll).toHaveBeenCalledWith(query);
  });

  it('debe convertir el ID del estudiante a número', async () => {
    enrollmentsServiceMock.findByStudent.mockResolvedValue([]);

    await expect(controller.findByStudent(3)).resolves.toEqual([]);
    expect(enrollmentsServiceMock.findByStudent).toHaveBeenCalledWith(3);
  });
});

