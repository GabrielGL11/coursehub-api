import { vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service.js';
import { User } from './entities/user.entity.js';

describe('UsersService', () => {
  let service: UsersService;

  const repositoryMock = {
    findOne: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    createQueryBuilder: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: repositoryMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debe buscar un usuario por correo', async () => {
    const usuario = { id: 1, email: 'ana@example.com' };
    repositoryMock.findOne.mockResolvedValue(usuario);

    await expect(service.findByEmail('ana@example.com')).resolves.toEqual(
      usuario,
    );
    expect(repositoryMock.findOne).toHaveBeenCalledWith({
      where: { email: 'ana@example.com' },
    });
  });

  it('debe buscar un usuario por ID', async () => {
    const usuario = { id: 1, email: 'ana@example.com' };
    repositoryMock.findOne.mockResolvedValue(usuario);

    await expect(service.findById(1)).resolves.toEqual(usuario);
    expect(repositoryMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('debe crear un usuario guardando el hash y sin elegir el rol', async () => {
    const usuario = { id: 3, email: 'nuevo@example.com' };
    repositoryMock.create.mockReturnValue(usuario);
    repositoryMock.save.mockResolvedValue(usuario);

    await expect(
      service.create('nuevo@example.com', 'hash-de-prueba'),
    ).resolves.toEqual(usuario);

    expect(repositoryMock.create).toHaveBeenCalledWith({
      email: 'nuevo@example.com',
      passwordHash: 'hash-de-prueba',
    });
    expect(repositoryMock.save).toHaveBeenCalledWith(usuario);
  });
});