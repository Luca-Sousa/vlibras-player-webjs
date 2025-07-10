/**
 * Barrel export para módulo Core/Player
 * Single Responsibility: Apenas funcionalidades do player
 */

export { VLibrasPlayer } from './VLibrasPlayer';
export { PlayerManagerAdapter } from './PlayerManagerAdapter';

// Re-export de tipos específicos do player
export type {
  VLibrasPlayerConfig,
  VLibrasPlayerState,
  PlaybackResult,
  PresetConfig
} from '../../types/core.types';
