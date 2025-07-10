/**
 * Barrel export para módulo Features/Plugins
 * Open/Closed Principle: Sistema extensível de plugins
 */

export * from './VLibrasPlugins';
export * from './interfaces';

// Re-export de tipos específicos de plugins
export type {
  PluginRegistry,
  PluginConfig
} from '../../types/features.types';
