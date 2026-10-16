import { vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from './students.controller.js';
import { StudentsService } from './students.service.js';

describe('StudentsController', () => {
  let controller: StudentsController;
  const studentsServiceMock = {
    findAll: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateStatus: vi.fn(),
    remove: vi.fn(),
  };
  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [
        { provide: StudentsService, useValue: studentsServiceMock },
      ],
    }).compile();
    controller = module.get<StudentsController>(StudentsController);
  });
  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });
  it('debe delegar la bÃºsqueda de estudiantes al servicio', async () => {
    const resultado = {
      items: [{ id: 1, name: 'Carlos Mendoza', email: 'carlos@example.com' }],
      meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
    };
    studentsServiceMock.findAll.mockResolvedValue(resultado);
    const query = { page: 1, limit: 10, sortBy: 'id', order: 'ASC' };
    await expect(controller.findAll(query as any)).resolves.toEqual(resultado);
    expect(studentsServiceMock.findAll).toHaveBeenCalledWith(query);
  });
  it('debe delegar la actualizaciÃ³n del estado del estudiante', async () => {
    const estudiante = { id: 1, name: 'Carlos Mendoza', isActive: false };
    studentsServiceMock.updateStatus.mockResolvedValue(estudiante);
    await expect(
      controller.updateStatus(1, { isActive: false }),
    ).resolves.toEqual(estudiante);
    expect(studentsServiceMock.updateStatus).toHaveBeenCalledWith(1, false);
  });
});
