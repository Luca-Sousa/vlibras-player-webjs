/**
 * Tipos das funcionalidades específicas (Features)
 * Open/Closed Principle: Tipos extensíveis para novas funcionalidades
 */

// Presets System Types
export interface VLibrasPreset {
  name: string;
  displayName: string;
  description: string;
  config: {
    width: number;
    height: string | number;
    responsive: boolean;
    controls: boolean;
    autoplay: boolean;
    theme: 'light' | 'dark' | 'high-contrast' | 'auto';
  };
  cssOverrides?: string;
  jsOverrides?: string;
  metadata?: {
    category: string;
    tags: string[];
    version: string;
    author?: string;
  };
}

export interface PresetCategory {
  name: string;
  displayName: string;
  description: string;
  presets: VLibrasPreset[];
}

// Plugin System Types
export interface IVLibrasPlugin {
  name: string;
  version: string;
  description?: string;
  dependencies?: string[];
  
  init(context: PluginContext): void | Promise<void>;
  destroy?(): void | Promise<void>;
  
  hooks?: {
    beforePlay?: (text: string) => string | Promise<string>;
    afterPlay?: (result: any) => void | Promise<void>;
    onError?: (error: Error) => void | Promise<void>;
    onReady?: () => void | Promise<void>;
  };
}

export interface PluginContext {
  player: any; // VLibrasPlayer instance
  events: any; // VLibrasEventEmitter instance
  config: any; // Global config
  utils: {
    logger: (message: string, level?: string) => void;
    cache: any; // Cache instance
    themes: any; // Theme manager
  };
}

export interface PluginRegistry {
  register(plugin: IVLibrasPlugin): void;
  unregister(name: string): void;
  get(name: string): IVLibrasPlugin | undefined;
  getAll(): IVLibrasPlugin[];
  isRegistered(name: string): boolean;
}

export interface PluginConfig {
  enabled: boolean;
  autoLoad?: boolean;
  loadOrder?: number;
  options?: Record<string, any>;
}

// DevTools Types
export interface DiagnosticResult {
  category: 'performance' | 'compatibility' | 'configuration' | 'network' | 'general';
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  details?: string;
  suggestion?: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  frameRate: number;
  cacheHitRate: number;
  networkLatency: number;
  errorRate: number;
}

export interface CompatibilityInfo {
  browser: {
    name: string;
    version: string;
    engine: string;
    supported: boolean;
  };
  features: {
    webgl: boolean;
    webassembly: boolean;
    webworkers: boolean;
    localstorage: boolean;
    indexeddb: boolean;
  };
  performance: {
    deviceMemory?: number;
    hardwareConcurrency?: number;
    effectiveType?: string;
  };
}

export interface DevToolsConfig {
  enabled: boolean;
  showInProduction?: boolean;
  autoOpen?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  hotkeys?: {
    toggle?: string;
    clear?: string;
    export?: string;
  };
}
