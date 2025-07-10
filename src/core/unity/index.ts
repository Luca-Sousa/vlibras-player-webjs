/**
 * Barrel export para módulo Core/Unity
 * Single Responsibility: Apenas integração com Unity
 */

export { UnityBridge, setupUnityBridge, isUnityBridgeReady } from './UnityBridge';
export { GlosaTranslator } from './GlosaTranslator';

// Re-export de tipos específicos do Unity
export type {
  UnityConfig,
  GlosaConfig
} from '../../types/core.types';

export type {
  UnityInstance,
  UnityLoader
} from '../../types/external.types';
