/**
 * VLibras Player WebJS - Estrutura SOLID
 * Exportações principais organizadas por responsabilidade
 */

// === CORE (Núcleo do Sistema) ===
// Player principal
export { VLibrasPlayer } from './core/player/VLibrasPlayer';
export { PlayerManagerAdapter } from './core/player/PlayerManagerAdapter';

// Integração Unity
export { GlosaTranslator } from './core/unity/GlosaTranslator';
export { UnityBridge, setupUnityBridge, isUnityBridgeReady } from './core/unity/UnityBridge';

// Configuração global
export { config } from './core/config/config';
export { VLibrasGlobalConfig } from './core/config/VLibrasGlobalConfig';

// === INFRASTRUCTURE (Serviços de Infraestrutura) ===
// Sistema de eventos
export * from './infrastructure/events/VLibrasEvents';

// Sistema de cache
export * from './infrastructure/cache/VLibrasCache';

// Sistema de estilos e temas
export { VLibrasCSS, setupOptimizedCSS } from './infrastructure/styling/VLibrasCSS';
export * from './infrastructure/styling/VLibrasThemes';

// Sistema de canvas
export * from './infrastructure/canvas/VLibrasCanvasConfig';

// === FEATURES (Funcionalidades Específicas) ===
// Sistema de presets
export { VLibrasPresets, usePreset, useVLibrasPreset } from './features/presets/VLibrasPresets';

// Sistema de plugins
export * from './features/plugins/VLibrasPlugins';

// Ferramentas de desenvolvimento
export * from './features/devtools/VLibrasDevTools';

// === ADAPTERS (Integrações Externas) ===
// Testing utilities
export * from './adapters/testing/VLibrasTestUtils';

// React components are available via separate exports:
// import { VLibrasPlayer } from 'vlibras-player-webjs/react';
// import { useVLibras } from 'vlibras-player-webjs/react/hooks';

// === TYPES (Tipos Centralizados) ===
// export * from './types';

// === LEGACY COMPATIBILITY (Compatibilidade com versão anterior) ===
export enum PlayerStatus {
  IDLE = 'idle',
  INITIALIZING = 'initializing',     // Inicializando biblioteca
  LOADING_ASSETS = 'loading_assets', // Carregando assets do Unity
  READY = 'ready',                   // Pronto para usar
  TRANSLATING = 'translating',       // Convertendo texto para glosa
  PLAYING = 'playing',               // Reproduzindo animação
  PAUSED = 'paused',                 // Pausado
  COMPLETED = 'completed',           // Animação terminada
  ERROR = 'error'                    // Erro ocorrido
}

/**
 * Evento de mudança de estado com informações detalhadas
 */
export interface StateChangeEvent {
  state: PlayerStatus;
  previousState: PlayerStatus;
  progress?: number;        // 0-100 para loading/progress
  message?: string;         // Mensagem amigável para o usuário
  timestamp: number;        // Timestamp do evento
  details?: any;           // Detalhes específicos do estado
}

/**
 * Configuração de mensagens amigáveis para cada estado
 */
export interface StateMessages {
  [PlayerStatus.IDLE]: string;
  [PlayerStatus.INITIALIZING]: string;
  [PlayerStatus.LOADING_ASSETS]: string;
  [PlayerStatus.READY]: string;
  [PlayerStatus.TRANSLATING]: string;
  [PlayerStatus.PLAYING]: string;
  [PlayerStatus.PAUSED]: string;
  [PlayerStatus.COMPLETED]: string;
  [PlayerStatus.ERROR]: string;
}

/**
 * Mensagens padrão em português
 */
export const DEFAULT_STATE_MESSAGES: StateMessages = {
  [PlayerStatus.IDLE]: 'Aguardando...',
  [PlayerStatus.INITIALIZING]: 'Inicializando player...',
  [PlayerStatus.LOADING_ASSETS]: 'Carregando assets...',
  [PlayerStatus.READY]: 'Pronto para usar!',
  [PlayerStatus.TRANSLATING]: 'Traduzindo texto...',
  [PlayerStatus.PLAYING]: 'Reproduzindo em Libras',
  [PlayerStatus.PAUSED]: 'Pausado',
  [PlayerStatus.COMPLETED]: 'Tradução concluída!',
  [PlayerStatus.ERROR]: 'Erro ocorrido'
};

/**
 * Opções para tradução
 */
export interface TranslateOptions {
  /** Habilitar estatísticas de uso */
  isEnabledStats?: boolean;
}

/**
 * Opções para reprodução
 */
export interface PlayOptions {
  /** Indica se a reprodução vem de uma tradução */
  fromTranslation?: boolean;
  /** Habilitar estatísticas de uso */
  isEnabledStats?: boolean;
}

/**
 * Configurações de personalização do avatar
 */
export interface PersonalizationConfig {
  /** Configurações de aparência */
  appearance?: {
    skinColor?: string;
    hairColor?: string;
    clothingColor?: string;
  };
  /** Configurações de velocidade */
  speed?: number;
}

/**
 * Informações sobre o progresso da animação
 */
export interface AnimationProgress {
  /** Progresso atual (0-1) */
  current: number;
  /** Duração total */
  total: number;
  /** Tempo decorrido */
  elapsed: number;
}

/**
 * Eventos legacy - mantidos para compatibilidade
 * Para novos projetos, use PlayerEvents de VLibrasEvents.ts
 */
export interface LegacyPlayerEvents {
  /** Player foi carregado e está pronto */
  'load': () => void;
  /** Iniciou tradução */
  'translate:start': () => void;
  /** Terminou tradução */
  'translate:end': () => void;
  /** Iniciou reprodução da glosa */
  'gloss:start': () => void;
  /** Terminou reprodução da glosa */
  'gloss:end': (glossLength: string) => void;
  /** Animação iniciou */
  'animation:play': () => void;
  /** Animação pausou */
  'animation:pause': () => void;
  /** Animação terminou */
  'animation:end': () => void;
  /** Progresso da animação */
  'animation:progress': (progress: AnimationProgress) => void;
  /** Resposta com informações da glosa */
  'response:glosa': (counter: number, glossLength: string) => void;
  /** Informações do avatar */
  'GetAvatar': (avatar: any) => void;
  /** Boas-vindas iniciaram */
  'start:welcome': () => void;
  /** Boas-vindas terminaram */
  'stop:welcome': (finished: boolean) => void;
  /** Erro ocorreu */
  'error': (error: string) => void;
}

/**
 * Interface para o Unity Player
 */
export interface UnityPlayer {
  SendMessage: (objectName: string, methodName: string, value?: any) => void;
}

/**
 * Interface para o UnityLoader global
 */
export interface IUnityLoader {
  instantiate: (containerId: string, configPath: string, options: any) => UnityPlayer;
  SystemInfo: {
    hasWebGL: boolean;
  };
}

/**
 * Regiões suportadas
 */
export type SupportedRegion = 'BR' | 'PE' | 'RJ' | 'SP';

/**
 * Velocidades suportadas
 */
export type PlaybackSpeed = 0.5 | 1.0 | 1.5 | 2.0;

/**
 * Resultado de uma operação de reprodução
 */
export interface PlaybackResult {
  duration: number;
  totalFrames: number;
  success: boolean;
  startTime: number;
  endTime: number;
}
