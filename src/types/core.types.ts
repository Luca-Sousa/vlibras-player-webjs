/**
 * Tipos do núcleo (Core) do VLibras
 * Single Responsibility: Tipos apenas do core do sistema
 */

// Player Types
export interface VLibrasPlayerConfig {
  container?: string | HTMLElement;
  width?: number;
  height?: string | number;
  responsive?: boolean;
  autoplay?: boolean;
  controls?: boolean;
  muted?: boolean;
  debug?: boolean;
  theme?: 'light' | 'dark' | 'high-contrast' | 'auto';
  language?: 'pt-br' | 'en' | 'es';
  enableCache?: boolean;
  cacheTimeout?: number;
  fallbackUrl?: string;
  targetPath?: string; // Caminho para assets do Unity
  errorCallback?: (error: Error) => void;
  loadingCallback?: (progress: number) => void;
  onReady?: () => void;
  onLoad?: () => void; // Compatibilidade com versões anteriores
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Configurações específicas para presets
 */
export interface PresetConfig extends VLibrasPlayerConfig {
  // Configurações específicas do preset
  name?: string;
  description?: string;
  
  // Configurações de UI
  autoPlay?: boolean;
  showControls?: boolean;
  showProgress?: boolean;
  showWordBadge?: boolean;
  allowReplay?: boolean;
  hideText?: boolean;
  allowSkip?: boolean;
  showSubtitles?: boolean;
  minimalUI?: boolean;
  autoScale?: boolean;
  showQualitySelector?: boolean;
  showEssentialControlsOnly?: boolean;
  
  // Configurações de tamanho
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  
  // Callbacks específicos
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  onStateChange?: (state: string) => void;
  onSkip?: () => void;
  
  // Configurações avançadas
  enableKeyboardShortcuts?: boolean;
  enableAnalytics?: boolean;
  cacheEnabled?: boolean;
}

export interface VLibrasPlayerState {
  isLoaded: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  error?: Error;
}

export interface PlaybackResult {
  success: boolean;
  duration?: number;
  totalFrames?: number;
  startTime?: number;
  endTime?: number;
  error?: Error;
  metadata?: {
    text: string;
    language: string;
    timestamp: number;
  };
}

// Unity Types
export interface UnityConfig {
  unityLoaderUrl: string;
  buildUrl: string;
  companyName: string;
  productName: string;
  productVersion: string;
}

export interface GlosaConfig {
  enableGloss?: boolean;
  glossSpeed?: number;
  glossDelay?: number;
  customGlossMap?: Map<string, string>;
}

// Configuration Types
export interface GlobalConfigOptions {
  debug?: boolean;
  logLevel?: 'error' | 'warn' | 'info' | 'debug';
  theme?: 'light' | 'dark' | 'high-contrast' | 'auto';
  language?: 'pt-br' | 'en' | 'es';
  accessibility?: {
    enableKeyboardNavigation?: boolean;
    enableScreenReader?: boolean;
    enableHighContrast?: boolean;
    enableReducedMotion?: boolean;
    ariaLabels?: Record<string, string>;
  };
  performance?: {
    enableOptimizations?: boolean;
    preloadAssets?: boolean;
    enableWebWorkers?: boolean;
    maxConcurrentRequests?: number;
  };
  api?: {
    baseUrl?: string;
    timeout?: number;
    retryAttempts?: number;
    enableCors?: boolean;
  };
}

// === LEGACY TYPES (Compatibilidade) ===

/**
 * Configuração legacy do player
 */
export interface PlayerConfig {
  translator?: string;
  targetPath?: string;
  onLoad?: () => void;
  progress?: (wrapper: HTMLElement) => any;
}

/**
 * Estados do player (legacy)
 */
export enum PlayerStatus {
  IDLE = 'idle',
  INITIALIZING = 'initializing',
  LOADING_ASSETS = 'loading_assets',
  READY = 'ready',
  TRANSLATING = 'translating',
  PLAYING = 'playing',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  ERROR = 'error'
}

/**
 * Opções para tradução
 */
export interface TranslateOptions {
  isEnabledStats?: boolean;
}

/**
 * Opções para reprodução
 */
export interface PlayOptions {
  fromTranslation?: boolean;
  isEnabledStats?: boolean;
}

/**
 * Configurações de personalização do avatar
 */
export interface PersonalizationConfig {
  appearance?: {
    skinColor?: string;
    hairColor?: string;
    clothingColor?: string;
  };
  speed?: number;
}

/**
 * Velocidades suportadas
 */
export type PlaybackSpeed = 0.5 | 1.0 | 1.5 | 2.0;

/**
 * Regiões suportadas
 */
export type SupportedRegion = 'BR' | 'PE' | 'RJ' | 'SP';

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
