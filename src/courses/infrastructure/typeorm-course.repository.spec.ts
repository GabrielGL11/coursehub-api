import { vi } from 'vitest';
import { TypeOrmCourseRepository } from './typeorm-course.repository.js';

describe('TypeOrmCourseRepository', () => {
  const typeOrmMock = {
    findOneBy: vi.fn(),
    save: vi.fn(),
  };
  let adapter: TypeOrmCourseRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    adapter = new TypeOrmCourseRepository(typeOrmMock as any);
  });

  it('debe traducir findById a findOneBy de TypeORM', async () => {
    const curso = { id: 6, title: 'Curso', level: 'beginner' };
    typeOrmMock.findOneBy.mockResolvedValue(curso);

    await expect(adapter.findById(6)).resolves.toEqual(curso);
    expect(typeOrmMock.findOneBy).toHaveBeenCalledWith({ id: 6 });
  });

  it('debe devolver null cuando TypeORM no encuentra el curso', async () => {
    typeOrmMock.findOneBy.mockResolvedValue(null);

    await expect(adapter.findById(999)).resolves.toBeNull();
  });

  it('debe traducir save a save de TypeORM', async () => {
    const curso = { id: 6, title: 'Curso', level: 'beginner' } as any;
    typeOrmMock.save.mockResolvedValue(curso);

    await expect(adapter.save(curso)).resolves.toEqual(curso);
    expect(typeOrmMock.save).toHaveBeenCalledWith(curso);
  });
});
