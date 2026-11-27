import { jest } from '@jest/globals';
import { NotificationsService } from './notifications.service.js';
import { ENROLLMENT_CREATED_EVENT } from './notifications.events.js';

describe('NotificationsService', () => {
  const gatewayMock = { broadcast: jest.fn<(event: string, payload: unknown) => void>() };
  let service: NotificationsService;

  const event = {
    enrollmentId: 10,
    studentId: 1,
    courseId: 2,
    occurredAt: '2026-11-24T20:00:00.000Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new NotificationsService(gatewayMock as never);
  });

  it('transmite enrollment.created con la carga recibida', () => {
    service.enrollmentCreated(event);

    expect(gatewayMock.broadcast).toHaveBeenCalledWith(ENROLLMENT_CREATED_EVENT, event);
  });

  it('no propaga el error si el envío falla (no debe romper la matrícula)', () => {
    gatewayMock.broadcast.mockImplementation(() => {
      throw new Error('socket caído');
    });

    expect(() => service.enrollmentCreated(event)).not.toThrow();
  });
});
