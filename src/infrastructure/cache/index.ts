/**
 * Barrel export para módulo Infrastructure/Cache
 * Dependency Inversion: Sistema de cache como serviço
 */

export * from './VLibrasCache';

// Re-export de tipos específicos de cache
export type {
  CacheEntry,
  CacheStrategy,
  CacheConfig,
  CacheStats
} from '../../types/infrastructure.types';
