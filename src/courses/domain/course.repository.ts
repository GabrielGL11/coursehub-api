import type { Course } from '../entities/course.entity.js';

/**
 * Token de inyección del puerto. Las interfaces de TypeScript no existen en
 * tiempo de ejecución, por eso Nest necesita un valor (Symbol) para
 * identificar qué implementación debe inyectar.
 */
export const COURSE_REPOSITORY = Symbol('COURSE_REPOSITORY');

/**
 * Puerto: contrato mínimo que necesita el caso de uso de actualización.
 * Solo declara los dos métodos que realmente se usan (segregación de interfaces).
 */
export interface CourseRepository {
  findById(id: number): Promise<Course | null>;
  save(course: Course): Promise<Course>;
}
