/**
 * Tipos da infraestrutura do VLibras
 * Dependency Inversion: Abstrações para serviços de infraestrutura
 */

// Event System Types
export interface VLibrasEventPayload {
  [key: string]: any;
}

export interface VLibrasEventListener<T = VLibrasEventPayload> {
  (payload: T): void | Promise<void>;
}

export interface VLibrasEventOptions {
  once?: boolean;
  priority?: number;
  namespace?: string;
}

// Cache System Types
export interface CacheEntry<T = any> {
  key: string;
  value: T;
  timestamp: number;
  ttl?: number;
  accessCount: number;
  lastAccessed: number;
  metadata?: Record<string, any>;
}

export interface CacheStrategy {
  name: string;
  maxSize: number;
  defaultTTL: number;
  evictionPolicy: 'lru' | 'lfu' | 'fifo' | 'ttl';
}

export interface CacheConfig {
  strategy: CacheStrategy;
  enablePersistence?: boolean;
  storageKey?: string;
  compression?: boolean;
  encryption?: boolean;
}

export interface CacheStats {
  size: number;
  maxSize: number;
  hitRate: number;
  missRate: number;
  evictions: number;
  memoryUsage: number;
}

// Styling System Types
export interface VLibrasTheme {
  name: string;
  displayName: string;
  description?: string;
  
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    text: string;
    textSecondary: string;
    border: string;
    shadow: string;
  };
  
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      bold: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  
  shadows: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  
  animation: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
    easing: {
      ease: string;
      easeIn: string;
      easeOut: string;
      easeInOut: string;
    };
  };
  
  vlibras: {
    playerBackground: string;
    controlsBackground: string;
    progressBarColor: string;
    loadingSpinnerColor: string;
    errorColor: string;
    successColor: string;
  };
}

// Canvas System Types
export interface CanvasConfig {
  width: number;
  height: number;
  aspectRatio?: string;
  responsive?: boolean;
  pixelDensity?: number;
  enableOptimizations?: boolean;
  backgroundTransparent?: boolean;
  enableAntialiasing?: boolean;
}

export interface CanvasPreset {
  name: string;
  displayName: string;
  description: string;
  config: CanvasConfig;
  cssOverrides?: string;
}

export interface ResponsiveBreakpoint {
  name: string;
  minWidth: number;
  maxWidth?: number;
  config: Partial<CanvasConfig>;
}
