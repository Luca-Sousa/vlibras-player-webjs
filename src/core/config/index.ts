/**
 * Barrel export para módulo Core/Config
 * Single Responsibility: Apenas configuração global
 */

export { config } from './config';
export { VLibrasGlobalConfig } from './VLibrasGlobalConfig';

// Re-export de tipos específicos de configuração
export type {
  GlobalConfigOptions
} from '../../types/core.types';
