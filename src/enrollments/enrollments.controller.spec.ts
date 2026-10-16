import { vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentsController } from './enrollments.controller.js';
import { EnrollmentsService } from './enrollments.service.js';

describe('EnrollmentsController', () => {
  let controller: EnrollmentsController;
  const enrollmentsServiceMock = {
    create: vi.fn(),
    findAll: vi.fn(),
    findByStudent: vi.fn(),
    findByCourse: vi.fn(),
    remove: vi.fn(),
  };
  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollmentsController],
      providers: [
        { provide: EnrollmentsService, useValue: enrollmentsServiceMock },
      ],
    }).compile();
    controller = module.get<EnrollmentsController>(EnrollmentsController);
  });
  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });
  it('debe delegar el listado de matrÃ­culas al servicio', async () => {
    const resultado = {
      items: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
    };
    enrollmentsServiceMock.findAll.mockResolvedValue(resultado);
    const query = { page: 1, limit: 10 };
    await expect(controller.findAll(query as any)).resolves.toEqual(resultado);
    expect(enrollmentsServiceMock.findAll).toHaveBeenCalledWith(query);
  });
  it('debe convertir el ID del estudiante a nÃºmero', async () => {
    enrollmentsServiceMock.findByStudent.mockResolvedValue([]);
    await expect(controller.findByStudent('3')).resolves.toEqual([]);
    expect(enrollmentsServiceMock.findByStudent).toHaveBeenCalledWith(3);
  });
});
