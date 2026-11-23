import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UpdateCourseUseCase } from './update-course.use-case.js';
import type { CourseRepository } from '../domain/course.repository.js';
import type { Course } from '../entities/course.entity.js';
import { UserRole } from '../../users/user-role.enum.js';
import type { AuthenticatedUser } from '../../auth/types/jwt-payload.type.js';

/**
 * Repositorio falso en memoria: demuestra que la regla de negocio se prueba
 * sin HTTP, sin TypeORM y sin PostgreSQL.
 */
class InMemoryCourseRepository implements CourseRepository {
  saveCalls = 0;
  findByIdCalls: number[] = [];

  constructor(private readonly courses: Course[]) {}

  async findById(id: number) {
    this.findByIdCalls.push(id);
    const course = this.courses.find((c) => c.id === id);
    return course ? { ...course } : null;
  }

  async save(course: Course) {
    this.saveCalls++;
    const index = this.courses.findIndex((c) => c.id === course.id);

    if (index === -1) {
      throw new NotFoundException(`Course ${course.id} not found`);
    }

    this.courses[index] = { ...course };
    return { ...course };
  }
}

describe('UpdateCourseUseCase', () => {
  let repository: InMemoryCourseRepository;
  let useCase: UpdateCourseUseCase;

  const docentePropietario: AuthenticatedUser = {
    id: 2,
    email: 'docente2@example.com',
    role: UserRole.TEACHER,
  };

  const docenteAjeno: AuthenticatedUser = {
    id: 4,
    email: 'docente4@example.com',
    role: UserRole.TEACHER,
  };

  const administrador: AuthenticatedUser = {
    id: 3,
    email: 'admin@example.com',
    role: UserRole.ADMIN,
  };

  beforeEach(() => {
    repository = new InMemoryCourseRepository([
      {
        id: 6,
        title: 'Curso original',
        level: 'beginner',
        createdByUserId: 2,
      },
    ]);

    useCase = new UpdateCourseUseCase(repository);
  });

  it('debe permitir que el docente propietario modifique su curso', async () => {
    const resultado = await useCase.execute(
      6,
      { title: 'Curso actualizado' },
      docentePropietario,
    );

    expect(resultado.title).toBe('Curso actualizado');
    expect(repository.saveCalls).toBe(1);
  });

  it('debe buscar el curso utilizando el identificador recibido', async () => {
    await useCase.execute(
      6,
      { title: 'Curso actualizado' },
      docentePropietario,
    );

    expect(repository.findByIdCalls).toEqual([6]);
  });

  it('debe permitir que el administrador modifique el curso de otro usuario', async () => {
    const resultado = await useCase.execute(
      6,
      { title: 'Editado por admin' },
      administrador,
    );

    expect(resultado.title).toBe('Editado por admin');
    expect(resultado.createdByUserId).toBe(2);
    expect(repository.saveCalls).toBe(1);
  });

  it('debe rechazar que un docente modifique el curso de otro docente', async () => {
    await expect(
      useCase.execute(6, { title: 'Intento ajeno' }, docenteAjeno),
    ).rejects.toThrow(ForbiddenException);

    expect(repository.saveCalls).toBe(0);
  });

  it('debe lanzar NotFoundException si el curso no existe', async () => {
    await expect(
      useCase.execute(999, { title: 'No existe' }, administrador),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(repository.findByIdCalls).toEqual([999]);
    expect(repository.saveCalls).toBe(0);
  });

  it('no debe cambiar el propietario del curso al actualizarlo', async () => {
    const resultado = await useCase.execute(
      6,
      { level: 'advanced' },
      docentePropietario,
    );

    expect(resultado.level).toBe('advanced');
    expect(resultado.createdByUserId).toBe(2);
  });
});

