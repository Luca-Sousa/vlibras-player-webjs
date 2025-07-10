/**
 * Sistema de configuração global para VLibras Player
 * Permite configurar uma vez e usar em toda a aplicação
 */

import { PlayerConfig } from './types';

export interface GlobalConfig {
  // Configurações de assets
  assetsPath: string;
  defaultRegion: 'BR' | 'PE' | 'RJ' | 'SP';
  
  // Configurações de interface
  theme: 'light' | 'dark' | 'auto' | 'high-contrast';
  language: 'pt-BR' | 'en-US';
  
  // Configurações de comportamento
  enableStats: boolean;
  debug: boolean;
  autoRetry: boolean;
  retryAttempts: number;
  
  // Configurações de performance
  performance: {
    preloadAssets: boolean;
    cacheEnabled: boolean;
    maxCacheSize: number; // MB
    enableGPUAcceleration: boolean;
    lowLatencyMode: boolean;
  };
  
  // Configurações de analytics
  analytics: {
    enabled: boolean;
    endpoint?: string;
    anonymizeData: boolean;
    respectDoNotTrack: boolean;
    trackingId?: string;
  };
  
  // Configurações de acessibilidade
  accessibility: {
    announceStateChanges: boolean;
    keyboardNavigation: boolean;
    reduceMotion: boolean;
    highContrastMode: boolean;
    screenReaderSupport: boolean;
  };
  
  // Configurações experimentais
  experimental: {
    enableWorkers: boolean;
    enableOfflineMode: boolean;
    enablePredictiveCache: boolean;
    enableAutoScale: boolean;
  };
}

/**
 * Configuração padrão
 */
const DEFAULT_CONFIG: GlobalConfig = {
  assetsPath: '/target',
  defaultRegion: 'BR',
  theme: 'auto',
  language: 'pt-BR',
  enableStats: false,
  debug: false,
  autoRetry: true,
  retryAttempts: 3,
  
  performance: {
    preloadAssets: false,
    cacheEnabled: true,
    maxCacheSize: 50, // 50MB
    enableGPUAcceleration: true,
    lowLatencyMode: false
  },
  
  analytics: {
    enabled: false,
    anonymizeData: true,
    respectDoNotTrack: true
  },
  
  accessibility: {
    announceStateChanges: true,
    keyboardNavigation: true,
    reduceMotion: false,
    highContrastMode: false,
    screenReaderSupport: true
  },
  
  experimental: {
    enableWorkers: false,
    enableOfflineMode: false,
    enablePredictiveCache: false,
    enableAutoScale: true
  }
};

/**
 * Classe principal de configuração global
 */
export class VLibrasGlobalConfig {
  private static config: GlobalConfig = { ...DEFAULT_CONFIG };
  private static listeners: Array<(config: GlobalConfig) => void> = [];
  private static isInitialized = false;

  /**
   * Configura o VLibras globalmente
   */
  static configure(newConfig: Partial<GlobalConfig>): void {
    const previousConfig = { ...this.config };
    
    // Merge profundo da configuração
    this.config = this.deepMerge(this.config, newConfig);
    
    // Salva no localStorage se disponível
    this.saveToStorage();
    
    // Aplica configurações automaticamente
    this.applyConfiguration();
    
    // Notifica listeners
    this.notifyListeners();
    
    this.isInitialized = true;
    
    console.log('🔧 VLibras configurado:', {
      previous: previousConfig,
      current: this.config,
      changes: this.getChanges(previousConfig, this.config)
    });
  }

  /**
   * Obtém a configuração atual
   */
  static getConfig(): GlobalConfig {
    return { ...this.config };
  }

  /**
   * Obtém uma configuração específica
   */
  static get<K extends keyof GlobalConfig>(key: K): GlobalConfig[K] {
    return this.config[key];
  }

  /**
   * Define uma configuração específica
   */
  static set<K extends keyof GlobalConfig>(key: K, value: GlobalConfig[K]): void {
    this.configure({ [key]: value } as Partial<GlobalConfig>);
  }

  /**
   * Reseta para configuração padrão
   */
  static reset(): void {
    this.config = { ...DEFAULT_CONFIG };
    this.saveToStorage();
    this.applyConfiguration();
    this.notifyListeners();
    console.log('🔄 VLibras resetado para configuração padrão');
  }

  /**
   * Carrega configuração do localStorage
   */
  static loadFromStorage(): boolean {
    try {
      const stored = localStorage.getItem('vlibras-global-config');
      if (stored) {
        const parsedConfig = JSON.parse(stored);
        this.configure(parsedConfig);
        return true;
      }
    } catch (error) {
      console.warn('⚠️ Erro ao carregar configuração do storage:', error);
    }
    return false;
  }

  /**
   * Salva configuração no localStorage
   */
  static saveToStorage(): void {
    try {
      localStorage.setItem('vlibras-global-config', JSON.stringify(this.config));
    } catch (error) {
      console.warn('⚠️ Erro ao salvar configuração no storage:', error);
    }
  }

  /**
   * Adiciona listener para mudanças de configuração
   */
  static onChange(listener: (config: GlobalConfig) => void): () => void {
    this.listeners.push(listener);
    
    // Retorna função para remover o listener
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index !== -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Verifica se foi inicializado
   */
  static isConfigured(): boolean {
    return this.isInitialized;
  }

  /**
   * Cria configuração de player com base na global
   */
  static createPlayerConfig(overrides?: Partial<PlayerConfig>): PlayerConfig {
    const baseConfig: PlayerConfig = {
      targetPath: this.config.assetsPath,
      ...overrides
    };

    return baseConfig;
  }

  /**
   * Obtém configurações por ambiente
   */
  static getEnvironmentConfig(): Partial<GlobalConfig> {
    const isDevelopment = typeof process !== 'undefined' && process.env?.NODE_ENV === 'development';
    const isProduction = typeof process !== 'undefined' && process.env?.NODE_ENV === 'production';

    if (isDevelopment) {
      return {
        debug: true,
        enableStats: true,
        performance: {
          ...DEFAULT_CONFIG.performance,
          preloadAssets: false // Mais rápido em dev
        }
      };
    }

    if (isProduction) {
      return {
        debug: false,
        enableStats: false,
        performance: {
          ...DEFAULT_CONFIG.performance,
          preloadAssets: true // Melhor UX em prod
        }
      };
    }

    return {};
  }

  /**
   * Auto-configura baseado no ambiente
   */
  static autoConfigureForEnvironment(): void {
    const envConfig = this.getEnvironmentConfig();
    this.configure(envConfig);
  }

  /**
   * Valida configuração
   */
  static validateConfig(config: Partial<GlobalConfig>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (config.performance?.maxCacheSize && config.performance.maxCacheSize < 0) {
      errors.push('maxCacheSize deve ser maior ou igual a 0');
    }

    if (config.retryAttempts && config.retryAttempts < 0) {
      errors.push('retryAttempts deve ser maior ou igual a 0');
    }

    if (config.assetsPath && !config.assetsPath.trim()) {
      errors.push('assetsPath não pode estar vazio');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Aplica configurações automaticamente
   */
  private static applyConfiguration(): void {
    // Aplica tema
    this.applyTheme();
    
    // Aplica configurações de acessibilidade
    this.applyAccessibilitySettings();
    
    // Aplica configurações de performance
    this.applyPerformanceSettings();
  }

  /**
   * Aplica tema
   */
  private static applyTheme(): void {
    const { theme } = this.config;
    const root = document.documentElement;

    if (theme === 'auto') {
      // Verificar se estamos em ambiente browser e se matchMedia está disponível
      if (typeof window !== 'undefined' && window.matchMedia) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.setAttribute('data-vlibras-theme', prefersDark ? 'dark' : 'light');
      } else {
        // Fallback para light theme em ambientes sem matchMedia (como testes)
        root.setAttribute('data-vlibras-theme', 'light');
      }
    } else {
      root.setAttribute('data-vlibras-theme', theme);
    }
  }

  /**
   * Aplica configurações de acessibilidade
   */
  private static applyAccessibilitySettings(): void {
    const { accessibility } = this.config;
    const root = document.documentElement;

    if (accessibility.reduceMotion) {
      root.style.setProperty('--vlibras-animation-duration', '0.01ms');
    }

    if (accessibility.highContrastMode) {
      root.setAttribute('data-vlibras-contrast', 'high');
    }
  }

  /**
   * Aplica configurações de performance
   */
  private static applyPerformanceSettings(): void {
    const { performance } = this.config;

    if (performance.enableGPUAcceleration) {
      // Configurações de GPU acceleration serão aplicadas no Unity
    }

    if (performance.lowLatencyMode) {
      // Configurações de baixa latência
    }
  }

  /**
   * Notifica todos os listeners
   */
  private static notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.config);
      } catch (error) {
        console.error('Erro no listener de configuração:', error);
      }
    });
  }

  /**
   * Merge profundo de objetos
   */
  private static deepMerge<T>(target: T, source: Partial<T>): T {
    const output = { ...target };
    
    for (const key in source) {
      if (source[key] !== undefined) {
        if (this.isObject(source[key]) && this.isObject(target[key])) {
          (output as any)[key] = this.deepMerge(target[key], source[key] as any);
        } else {
          (output as any)[key] = source[key];
        }
      }
    }
    
    return output;
  }

  /**
   * Verifica se é objeto
   */
  private static isObject(item: any): boolean {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  /**
   * Obtém diferenças entre configurações
   */
  private static getChanges(previous: GlobalConfig, current: GlobalConfig): Record<string, any> {
    const changes: Record<string, any> = {};
    
    for (const key in current) {
      if (JSON.stringify(previous[key as keyof GlobalConfig]) !== JSON.stringify(current[key as keyof GlobalConfig])) {
        changes[key] = {
          from: previous[key as keyof GlobalConfig],
          to: current[key as keyof GlobalConfig]
        };
      }
    }
    
    return changes;
  }
}

/**
 * Classe de utilitários para configuração
 */
export class VLibrasConfigUtils {
  /**
   * Cria configuração otimizada para mobile
   */
  static getMobileConfig(): Partial<GlobalConfig> {
    return {
      performance: {
        preloadAssets: false,
        cacheEnabled: true,
        maxCacheSize: 25, // Menor cache para mobile
        enableGPUAcceleration: true,
        lowLatencyMode: true
      },
      accessibility: {
        announceStateChanges: true,
        keyboardNavigation: false, // Menos relevante em mobile
        reduceMotion: false,
        highContrastMode: false,
        screenReaderSupport: true
      }
    };
  }

  /**
   * Cria configuração otimizada para desktop
   */
  static getDesktopConfig(): Partial<GlobalConfig> {
    return {
      performance: {
        preloadAssets: true,
        cacheEnabled: true,
        maxCacheSize: 100, // Maior cache para desktop
        enableGPUAcceleration: true,
        lowLatencyMode: false
      },
      accessibility: {
        announceStateChanges: true,
        keyboardNavigation: true,
        reduceMotion: false,
        highContrastMode: false,
        screenReaderSupport: true
      }
    };
  }

  /**
   * Detecta configuração ideal baseada no dispositivo
   */
  static detectOptimalConfig(): Partial<GlobalConfig> {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const hasGoodConnection = (navigator as any).connection?.effectiveType === '4g';
    const hasHighMemory = (performance as any).memory?.jsHeapSizeLimit > 1073741824; // 1GB

    let config: Partial<GlobalConfig> = {};

    if (isMobile) {
      config = this.getMobileConfig();
    } else {
      config = this.getDesktopConfig();
    }

    // Ajustes baseados na conexão
    if (!hasGoodConnection) {
      config.performance = {
        preloadAssets: false,
        cacheEnabled: true,
        maxCacheSize: 10,
        enableGPUAcceleration: true,
        lowLatencyMode: false
      };
    }

    // Ajustes baseados na memória disponível
    if (!hasHighMemory) {
      config.performance = {
        ...(config.performance || DEFAULT_CONFIG.performance),
        maxCacheSize: Math.min(config.performance?.maxCacheSize || 25, 25)
      };
    }

    return config;
  }

  /**
   * Aplica configuração ideal automaticamente
   */
  static applyOptimalConfig(): void {
    const optimalConfig = this.detectOptimalConfig();
    VLibrasGlobalConfig.configure(optimalConfig);
  }
}

// Auto-inicialização
if (typeof window !== 'undefined') {
  // Carrega configuração salva
  VLibrasGlobalConfig.loadFromStorage();
  
  // Auto-configura para ambiente se não foi configurado manualmente
  if (!VLibrasGlobalConfig.isConfigured()) {
    VLibrasGlobalConfig.autoConfigureForEnvironment();
  }
  
  // Listener para mudanças de tema do sistema (apenas em ambiente browser)
  if (typeof window !== 'undefined' && window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (VLibrasGlobalConfig.get('theme') === 'auto') {
        VLibrasGlobalConfig.configure({}); // Re-aplica tema
      }
    });
  }
}
