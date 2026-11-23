import { jest } from '@jest/globals';
import type { Repository } from 'typeorm';
import { TypeOrmCourseRepository } from './typeorm-course.repository.js';
import type { Course } from '../entities/course.entity.js';

describe('TypeOrmCourseRepository', () => {
  const typeOrmMock = {
    findOneBy: jest.fn<(where: unknown) => Promise<Course | null>>(),
    save: jest.fn<(entity: Course) => Promise<Course>>(),
  };
  let adapter: TypeOrmCourseRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    adapter = new TypeOrmCourseRepository(
      typeOrmMock as unknown as Repository<Course>,
    );
  });

  it('debe traducir findById a findOneBy de TypeORM', async () => {
    const curso = { id: 6, title: 'Curso', level: 'beginner' } as Course;
    typeOrmMock.findOneBy.mockResolvedValue(curso);

    await expect(adapter.findById(6)).resolves.toEqual(curso);
    expect(typeOrmMock.findOneBy).toHaveBeenCalledWith({ id: 6 });
  });

  it('debe devolver null cuando TypeORM no encuentra el curso', async () => {
    typeOrmMock.findOneBy.mockResolvedValue(null);

    await expect(adapter.findById(999)).resolves.toBeNull();
  });

  it('debe traducir save a save de TypeORM', async () => {
    const curso = { id: 6, title: 'Curso', level: 'beginner' } as Course;
    typeOrmMock.save.mockResolvedValue(curso);

    await expect(adapter.save(curso)).resolves.toEqual(curso);
    expect(typeOrmMock.save).toHaveBeenCalledWith(curso);
  });
});


