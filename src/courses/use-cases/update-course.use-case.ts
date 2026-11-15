import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { COURSE_REPOSITORY, type CourseRepository } from '../domain/course.repository.js';
import type { UpdateCourseDto } from '../dto/update-course.dto.js';
import { UserRole } from '../../users/user-role.enum.js';
import type { AuthenticatedUser } from '../../auth/types/jwt-payload.type.js';

/**
 * Caso de uso: actualizar un curso.
 *
 * Aquí vive la regla de negocio «solo el administrador o el docente
 * propietario puede modificar un curso». No conoce HTTP (rutas, guards)
 * ni TypeORM: solo depende del contrato CourseRepository.
 */
@Injectable()
export class UpdateCourseUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courses: CourseRepository,
  ) {}

  async execute(
    id: number,
    changes: UpdateCourseDto,
    actor: AuthenticatedUser,
  ) {
    const course = await this.courses.findById(id);

    if (!course) {
      throw new NotFoundException(`Course ${id} not found`);
    }

    const isAdmin = actor.role === UserRole.ADMIN;
    const isOwner = course.createdByUserId === actor.id;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException(
        'No tienes permisos para modificar este curso',
      );
    }

    Object.assign(course, changes);

    return this.courses.save(course);
  }
}
