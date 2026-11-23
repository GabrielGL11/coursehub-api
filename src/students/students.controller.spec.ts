import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from './students.controller.js';
import { StudentsService } from './students.service.js';
import type { Student } from './entities/student.entity.js';

describe('StudentsController', () => {
  let controller: StudentsController;
  const studentsServiceMock = {
    findAll: jest.fn<StudentsService['findAll']>(),
    findOne: jest.fn<StudentsService['findOne']>(),
    create: jest.fn<StudentsService['create']>(),
    update: jest.fn<StudentsService['update']>(),
    updateStatus: jest.fn<StudentsService['updateStatus']>(),
    remove: jest.fn<StudentsService['remove']>(),
  };
  beforeEach(async () => {
    jest.clearAllMocks();
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
  it('debe delegar la búsqueda de estudiantes al servicio', async () => {
    const resultado = {
      items: [{ id: 1, name: 'Carlos Mendoza', email: 'carlos@example.com' }],
      meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
    } as Awaited<ReturnType<StudentsService['findAll']>>;
    studentsServiceMock.findAll.mockResolvedValue(resultado);
    const query = { page: 1, limit: 10, sortBy: 'id', order: 'ASC' };
    await expect(controller.findAll(query as any)).resolves.toEqual(resultado);
    expect(studentsServiceMock.findAll).toHaveBeenCalledWith(query);
  });
  it('debe delegar la actualización del estado del estudiante', async () => {
    const estudiante = {
      id: 1,
      name: 'Carlos Mendoza',
      isActive: false,
    } as Student;
    studentsServiceMock.updateStatus.mockResolvedValue(estudiante);
    await expect(
      controller.updateStatus(1, { isActive: false }),
    ).resolves.toEqual(estudiante);
    expect(studentsServiceMock.updateStatus).toHaveBeenCalledWith(1, false);
  });
});


