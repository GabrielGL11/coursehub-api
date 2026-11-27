import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { NotificationsGateway } from './notifications.gateway.js';
import { NotificationsService } from './notifications.service.js';

/**
 * Extensión de la Semana 15: notificaciones en tiempo real por WebSocket.
 * Reutiliza `JwtService` de `AuthModule` para validar el mismo JWT de la API REST.
 */
@Module({
  imports: [AuthModule],
  providers: [NotificationsGateway, NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
