/**
 * Barrel export para módulo Infrastructure/Canvas
 * Dependency Inversion: Sistema de canvas como serviço
 */

export * from './VLibrasCanvasConfig';

// Re-export de tipos específicos de canvas
export type {
  CanvasConfig,
  CanvasPreset,
  ResponsiveBreakpoint
} from '../../types/infrastructure.types';
