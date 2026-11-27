/**
 * Contrato de los eventos en tiempo real (extensión WebSocket de la Semana 15).
 *
 * Solo hay un evento: el servidor avisa y los clientes escuchan. Los clientes no
 * envían mensajes al servidor, por lo que esta extensión no abre ninguna vía
 * nueva de escritura sobre la API.
 */

/** Nombre del espacio (namespace) de Socket.IO: `http://host:puerto/notifications`. */
export const NOTIFICATIONS_NAMESPACE = 'notifications';

/** Sala a la que solo se une quien presentó un JWT válido al conectarse. */
export const AUTHENTICATED_ROOM = 'authenticated';

/** Se emite cuando una matrícula se crea correctamente. */
export const ENROLLMENT_CREATED_EVENT = 'enrollment.created';

/**
 * Carga del evento `enrollment.created`.
 * Lleva solo identificadores y la hora: ningún nombre, correo ni dato personal.
 */
export interface EnrollmentCreatedEvent {
  enrollmentId: number;
  studentId: number;
  courseId: number;
  /** Fecha y hora del evento en formato ISO 8601 (UTC). */
  occurredAt: string;
}
