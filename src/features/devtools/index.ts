/**
 * Barrel export para módulo Features/DevTools
 * Open/Closed Principle: Ferramentas extensíveis de desenvolvimento
 */

export * from './VLibrasDevTools';

// Re-export de tipos específicos de devtools
export type {
  DiagnosticResult,
  PerformanceMetrics,
  CompatibilityInfo,
  DevToolsConfig
} from '../../types/features.types';
