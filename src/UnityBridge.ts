/**
 * Unity Bridge - Funções globais automáticas para o Unity WebGL
 * 
 * Resolve o problema crítico identificado no FUNCOES-UTILITARIAS-VLIBRAS.md
 * onde cada desenvolvedor precisa implementar manualmente as funções bridge.
 */

export interface UnityBridgeFunctions {
  onPlayingStateChange: (isPlaying: boolean) => void;
  GetAvatar: (avatar: unknown) => void;
  onLoadPlayer: () => void;
  onProgress: (progress: number) => void;
  onCounterGloss: (counter: number, glossLength: string) => void;
  onFinishWelcome: (finished: boolean) => void;
  onError: (error: string) => void;
}

/**
 * Configurações automáticas do Unity Bridge
 */
export interface UnityBridgeConfig {
  autoSetup: boolean;
  logCalls: boolean;
  prefix: string; // Prefixo para evitar conflitos globais
}

/**
 * Classe responsável por configurar automaticamente o Unity Bridge
 */
export class UnityBridge {
  private static instance: UnityBridge;
  private static isSetup = false;
  private config: UnityBridgeConfig;
  private callbacks: Partial<UnityBridgeFunctions> = {};

  constructor(config: Partial<UnityBridgeConfig> = {}) {
    this.config = {
      autoSetup: true,
      logCalls: false,
      prefix: 'VLibras',
      ...config
    };
  }

  /**
   * Configura automaticamente as funções globais que o Unity espera
   */
  static setupAutomatically(config?: Partial<UnityBridgeConfig>): UnityBridge {
    if (UnityBridge.isSetup) {
      return UnityBridge.instance;
    }

    UnityBridge.instance = new UnityBridge(config);
    
    if (typeof window !== 'undefined') {
      UnityBridge.instance.registerGlobalFunctions();
      UnityBridge.isSetup = true;
    }

    return UnityBridge.instance;
  }

  /**
   * Registra callbacks para os eventos do Unity
   */
  setCallbacks(callbacks: Partial<UnityBridgeFunctions>): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  /**
   * Registra as funções globais no window
   */
  private registerGlobalFunctions(): void {
    const globalObj = window as any;
    const prefix = this.config.prefix;

    // Função para log opcional
    const log = (name: string, ...args: any[]) => {
      if (this.config.logCalls) {
        console.log(`[${prefix}Bridge] ${name}:`, ...args);
      }
    };

    // onPlayingStateChange - Estado de reprodução
    globalObj[`${prefix}_onPlayingStateChange`] = (isPlaying: boolean) => {
      log('onPlayingStateChange', isPlaying);
      this.callbacks.onPlayingStateChange?.(isPlaying);
    };

    // GetAvatar - Recebe o avatar do Unity
    globalObj[`${prefix}_GetAvatar`] = (avatar: unknown) => {
      log('GetAvatar', avatar);
      this.callbacks.GetAvatar?.(avatar);
    };

    // onLoadPlayer - Player carregado
    globalObj[`${prefix}_onLoadPlayer`] = () => {
      log('onLoadPlayer');
      this.callbacks.onLoadPlayer?.();
    };

    // onProgress - Progresso de carregamento
    globalObj[`${prefix}_onProgress`] = (progress: number) => {
      log('onProgress', progress);
      this.callbacks.onProgress?.(progress);
    };

    // onCounterGloss - Contador de gloss
    globalObj[`${prefix}_onCounterGloss`] = (counter: number, glossLength: string) => {
      log('onCounterGloss', counter, glossLength);
      this.callbacks.onCounterGloss?.(counter, glossLength);
    };

    // onFinishWelcome - Fim da animação de boas-vindas
    globalObj[`${prefix}_onFinishWelcome`] = (finished: boolean) => {
      log('onFinishWelcome', finished);
      this.callbacks.onFinishWelcome?.(finished);
    };

    // onError - Erros do Unity
    globalObj[`${prefix}_onError`] = (error: string) => {
      log('onError', error);
      this.callbacks.onError?.(error);
    };

    // Função de compatibilidade com nomes antigos
    this.setupLegacyCompatibility(globalObj);
  }

  /**
   * Compatibilidade com nomes de função legados
   */
  private setupLegacyCompatibility(globalObj: any): void {
    const prefix = this.config.prefix;

    // Aliases para compatibilidade
    globalObj.onPlayingStateChange = globalObj[`${prefix}_onPlayingStateChange`];
    globalObj.GetAvatar = globalObj[`${prefix}_GetAvatar`];
    globalObj.onLoadPlayer = globalObj[`${prefix}_onLoadPlayer`];
    globalObj.onProgress = globalObj[`${prefix}_onProgress`];
    globalObj.onCounterGloss = globalObj[`${prefix}_onCounterGloss`];
    globalObj.onFinishWelcome = globalObj[`${prefix}_onFinishWelcome`];
    globalObj.onError = globalObj[`${prefix}_onError`];
  }

  /**
   * Remove as funções globais (cleanup)
   */
  cleanup(): void {
    if (typeof window === 'undefined') return;

    const globalObj = window as any;
    const prefix = this.config.prefix;

    // Remove funções prefixadas
    delete globalObj[`${prefix}_onPlayingStateChange`];
    delete globalObj[`${prefix}_GetAvatar`];
    delete globalObj[`${prefix}_onLoadPlayer`];
    delete globalObj[`${prefix}_onProgress`];
    delete globalObj[`${prefix}_onCounterGloss`];
    delete globalObj[`${prefix}_onFinishWelcome`];
    delete globalObj[`${prefix}_onError`];

    // Remove aliases
    delete globalObj.onPlayingStateChange;
    delete globalObj.GetAvatar;
    delete globalObj.onLoadPlayer;
    delete globalObj.onProgress;
    delete globalObj.onCounterGloss;
    delete globalObj.onFinishWelcome;
    delete globalObj.onError;

    UnityBridge.isSetup = false;
  }

  /**
   * Verifica se o bridge está configurado
   */
  static isConfigured(): boolean {
    return UnityBridge.isSetup;
  }

  /**
   * Obtém a instância atual do bridge
   */
  static getInstance(): UnityBridge | null {
    return UnityBridge.instance || null;
  }
}

/**
 * Função de conveniência para setup automático
 */
export function setupUnityBridge(config?: Partial<UnityBridgeConfig>): UnityBridge {
  return UnityBridge.setupAutomatically(config);
}

/**
 * Hook para verificar se o Unity Bridge está pronto
 */
export function isUnityBridgeReady(): boolean {
  return UnityBridge.isConfigured();
}
