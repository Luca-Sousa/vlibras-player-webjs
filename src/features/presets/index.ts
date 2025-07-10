/**
 * Barrel export para módulo Features/Presets
 * Open/Closed Principle: Sistema extensível de presets
 */

export { VLibrasPresets, usePreset, useVLibrasPreset } from './VLibrasPresets';

// Re-export de tipos específicos de presets
export type {
  VLibrasPreset,
  PresetCategory
} from '../../types/features.types';
