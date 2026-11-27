import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import type { OnGatewayConnection, OnGatewayInit } from '@nestjs/websockets';
import type { Namespace, Socket } from 'socket.io';
import { UserRole } from '../users/user-role.enum.js';
import type {
  AuthenticatedUser,
  JwtPayload,
} from '../auth/types/jwt-payload.type.js';
import { AUTHENTICATED_ROOM, NOTIFICATIONS_NAMESPACE } from './notifications.events.js';

/**
 * Puerta de enlace WebSocket (Socket.IO) de solo lectura para los clientes.
 *
 * Seguridad:
 * - La conexión exige un JWT válido (el mismo que emite `POST /v1/auth/login`).
 *   Se valida en el apretón de manos (handshake), ANTES de abrir la conexión.
 * - El token viaja en `auth.token` (o en el encabezado `Authorization: Bearer`),
 *   nunca en la URL, para que no quede en registros ni en el historial.
 * - Solo los sockets autenticados entran a la sala `authenticated` y reciben avisos.
 * - No hay `@SubscribeMessage`: los clientes no pueden enviar órdenes al servidor.
 *
 * El CORS coincide con el de `main.ts` (solo afecta a navegadores).
 */
@WebSocketGateway({
  namespace: NOTIFICATIONS_NAMESPACE,
  cors: { origin: ['http://localhost:5173'] },
})
export class NotificationsGateway implements OnGatewayInit, OnGatewayConnection {
  private readonly logger = new Logger(NotificationsGateway.name);

  @WebSocketServer()
  server: Namespace;

  constructor(private readonly jwtService: JwtService) {}

  /** Registra el control de acceso del handshake. */
  afterInit(server: Namespace): void {
    server.use((socket, next) => {
      this.authenticate(socket)
        .then((user) => {
          socket.data.user = user;
          next();
        })
        .catch((error: unknown) => {
          // La causa se registra en el servidor; al cliente solo se le dice "No autorizado".
          this.logger.warn(
            `Conexión rechazada: ${error instanceof Error ? error.message : 'error desconocido'}`,
          );
          next(new Error('No autorizado'));
        });
    });
  }

  /** Une el socket autenticado a la sala que recibe los avisos. */
  handleConnection(client: Socket): void {
    if (!client.data.user) {
      client.disconnect(true);
      return;
    }

    void client.join(AUTHENTICATED_ROOM);
    this.logger.log(`Cliente conectado (usuario ${(client.data.user as AuthenticatedUser).id})`);
  }

  /** Envía un evento a todos los clientes autenticados. No lanza si el servidor aún no inició. */
  broadcast(event: string, payload: unknown): void {
    this.server?.to(AUTHENTICATED_ROOM).emit(event, payload);
  }

  private async authenticate(socket: Socket): Promise<AuthenticatedUser> {
    const token = this.extractToken(socket);

    if (!token) {
      throw new Error('Token de acceso requerido');
    }

    const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

    // Mismas comprobaciones que `JwtStrategy.validate` en las rutas HTTP.
    if (
      !Number.isInteger(payload.sub) ||
      payload.sub <= 0 ||
      typeof payload.email !== 'string' ||
      !Object.values(UserRole).includes(payload.role)
    ) {
      throw new Error('Payload JWT inválido');
    }

    return { id: payload.sub, email: payload.email, role: payload.role };
  }

  private extractToken(socket: Socket): string | undefined {
    const fromAuth: unknown = socket.handshake.auth?.token;

    if (typeof fromAuth === 'string' && fromAuth.length > 0) {
      return fromAuth;
    }

    const header = socket.handshake.headers.authorization;

    if (typeof header === 'string' && header.startsWith('Bearer ')) {
      return header.slice('Bearer '.length);
    }

    return undefined;
  }
}
