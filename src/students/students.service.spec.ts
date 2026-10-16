import { vi } from 'vitest';
import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StudentsService } from './students.service.js';
import { Student } from './entities/student.entity.js';

describe('StudentsService', () => {
  let service: StudentsService;
  const repositoryMock = {
    findOneBy: vi.fn(),
    findAndCount: vi.fn(),
    createQueryBuilder: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    remove: vi.fn(),
  };
  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        {
          provide: getRepositoryToken(Student),
          useValue: repositoryMock,
        },
      ],
    }).compile();
    service = module.get<StudentsService>(StudentsService);
  });
  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });
  it('debe devolver un estudiante existente', async () => {
    const estudiante = {
      id: 1,
      name: 'Carlos Mendoza',
      email: 'carlos@example.com',
      age: 21,
      career: 'Software',
      semester: 5,
      isActive: true,
    };
    repositoryMock.findOneBy.mockResolvedValue(estudiante);
    await expect(service.findOne(1)).resolves.toEqual(estudiante);
    expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });
  it('debe lanzar un error cuando el estudiante no existe', async () => {
    repositoryMock.findOneBy.mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow(
      'Estudiante no encontrado',
    );
  });
  it('debe rechazar el registro de un correo ya existente', async () => {
    repositoryMock.findOneBy.mockResolvedValue({
      id: 1,
      email: 'carlos@example.com',
    });
    await expect(
      service.create({
        name: 'Carlos Mendoza',
        email: 'carlos@example.com',
        age: 21,
        career: 'Software',
        semester: 5,
      } as any),
    ).rejects.toThrow(ConflictException);
    expect(repositoryMock.create).not.toHaveBeenCalled();
    expect(repositoryMock.save).not.toHaveBeenCalled();
  });
});
