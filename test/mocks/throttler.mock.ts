import { Injectable, Module } from '@nestjs/common';
import type {
  CanActivate,
  DynamicModule,
  ExecutionContext,
  MethodDecorator,
  ClassDecorator,
  ParameterDecorator,
} from '@nestjs/common';

/**
 * Mock exclusivo de las pruebas E2E.
 * No aplica límites de solicitudes durante las pruebas.
 */
@Module({})
export class ThrottlerModule {
  static forRoot(_options: unknown[]): DynamicModule {
    return {
      module: ThrottlerModule,
    };
  }

  static forRootAsync(_options: unknown): DynamicModule {
    return {
      module: ThrottlerModule,
    };
  }
}

@Injectable()
export class ThrottlerGuard implements CanActivate {
  canActivate(_context: ExecutionContext): boolean {
    return true;
  }
}

function noopDecorator(): MethodDecorator & ClassDecorator {
  return (() => undefined) as MethodDecorator & ClassDecorator;
}

/** Decorador sin efecto durante las pruebas E2E. */
export function Throttle(..._args: unknown[]): MethodDecorator & ClassDecorator {
  return noopDecorator();
}

/** Decorador sin efecto durante las pruebas E2E. */
export function SkipThrottle(..._args: unknown[]): MethodDecorator & ClassDecorator {
  return noopDecorator();
}

/** Decoradores de inyección simulados para compatibilidad. */
export function InjectThrottlerOptions(): ParameterDecorator {
  return (() => undefined) as ParameterDecorator;
}

export function InjectThrottlerStorage(): ParameterDecorator {
  return (() => undefined) as ParameterDecorator;
}
