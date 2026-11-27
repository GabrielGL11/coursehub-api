import { Injectable, Logger } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway.js';
import {
  ENROLLMENT_CREATED_EVENT,
  type EnrollmentCreatedEvent,
} from './notifications.events.js';

/**
 * Fachada que usa el resto de la aplicación para avisar en tiempo real.
 * Los módulos de negocio dependen de este servicio y no de Socket.IO,
 * así la extensión queda aislada y puede quitarse sin tocar la lógica de matrículas.
 */
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly gateway: NotificationsGateway) {}

  /** Avisa que se creó una matrícula. Un fallo aquí nunca debe romper la matrícula. */
  enrollmentCreated(event: EnrollmentCreatedEvent): void {
    try {
      this.gateway.broadcast(ENROLLMENT_CREATED_EVENT, event);
    } catch (error) {
      this.logger.warn(
        `No se pudo enviar ${ENROLLMENT_CREATED_EVENT}: ${error instanceof Error ? error.message : 'error desconocido'}`,
      );
    }
  }
}
