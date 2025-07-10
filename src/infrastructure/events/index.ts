/**
 * Barrel export para módulo Infrastructure/Events
 * Dependency Inversion: Sistema de eventos como serviço
 */

export * from './VLibrasEvents';

// Re-export de tipos específicos de eventos
export type {
  VLibrasEventPayload,
  VLibrasEventListener,
  VLibrasEventOptions
} from '../../types/infrastructure.types';
