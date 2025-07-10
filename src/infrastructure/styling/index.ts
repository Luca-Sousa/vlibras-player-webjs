/**
 * Barrel export para módulo Infrastructure/Styling
 * Dependency Inversion: Sistema de estilos como serviço
 */

export { VLibrasCSS, setupOptimizedCSS } from './VLibrasCSS';
export * from './VLibrasThemes';

// Re-export de tipos específicos de styling
export type {
  VLibrasTheme
} from '../../types/infrastructure.types';
