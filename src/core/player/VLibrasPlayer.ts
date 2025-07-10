import { config } from '../config/config';
import { PlayerManagerAdapter } from './PlayerManagerAdapter';
import { GlosaTranslator, TranslationCallback } from '../unity/GlosaTranslator';
import {
  VLibrasPlayerConfig,
  PlayerStatus,
  TranslateOptions,
  PlayOptions,
  PersonalizationConfig,
  PlaybackSpeed,
  SupportedRegion,
  IUnityLoader,
  UnityPlayer,
  PlaybackResult
} from '../../types/core.types';
import { setupUnityBridge } from '../unity/UnityBridge';
import { setupOptimizedCSS } from '../../infrastructure/styling/VLibrasCSS';
import { VLibrasEventEmitter } from '../../infrastructure/events/VLibrasEvents';
import { VLibrasDevTools } from '../../features/devtools/VLibrasDevTools';

/**
 * VLibras Player - Classe principal para controle do avatar de Libras
 */
export class VLibrasPlayer {
  private options: Partial<VLibrasPlayerConfig>;
  private playerManager: PlayerManagerAdapter;
  private translator: GlosaTranslator;
  private text?: string;
  private gloss?: string;
  public eventEmitter: VLibrasEventEmitter; // Tornado público para uso nos exemplos
  private loaded: boolean = false;
  private gameContainer?: HTMLElement;
  private player?: UnityPlayer;
  private status: PlayerStatus = PlayerStatus.IDLE;
  private region: SupportedRegion = 'BR';
  private globalGlossLength: string = '';

  constructor(options: VLibrasPlayerConfig = {}) {
    this.options = {
      ...options,
      // Valores padrão para compatibilidade
      fallbackUrl: options.fallbackUrl || config.translatorUrl,
      targetPath: options.targetPath || config.defaultTargetPath,
    };

    this.playerManager = new PlayerManagerAdapter();
    this.translator = new GlosaTranslator(this.options.fallbackUrl || config.translatorUrl);
    this.eventEmitter = new VLibrasEventEmitter();

    this.setupPlayerManagerEvents();
  }

  /**
   * Configura eventos do PlayerManager
   */
  private setupPlayerManagerEvents(): void {
    this.playerManager.on('load', () => {
      this.loaded = true;
      this.onLoad();
      this.playerManager.setBaseUrl(config.dictionaryUrl + this.region + '/');
      
      if (this.options.onReady) {
        this.options.onReady();
      } else {
        this.play(undefined, { fromTranslation: true });
      }
    });

    this.playerManager.on('progress', (progress: number) => {
      this.onAnimationProgress(progress);
    });

    this.playerManager.on('stateChange', (isPlaying: boolean, isPaused: boolean, isLoading: boolean) => {
      if (isPaused) {
        this.onAnimationPause();
      } else if (isPlaying && !isPaused) {
        this.onAnimationPlay();
        this.changeStatus(PlayerStatus.PLAYING);
      } else if (!isPlaying && !isLoading) {
        this.onAnimationEnd();
        this.changeStatus(PlayerStatus.IDLE);
      }
    });

    this.playerManager.on('CounterGloss', (counter: number, glossLength: string) => {
      this.onGlossResponse(counter, glossLength);
      this.globalGlossLength = glossLength;
    });

    this.playerManager.on('GetAvatar', (avatar: any) => {
      this.onGetAvatar(avatar);
    });

    this.playerManager.on('FinishWelcome', (finished: boolean) => {
      this.onStopWelcome(finished);
    });
  }

  /**
   * Carrega o player no elemento wrapper especificado
   */
  load(wrapper: HTMLElement): void {
    this.gameContainer = document.createElement('div');
    this.gameContainer.setAttribute('id', config.unity.containerId);
    this.gameContainer.classList.add('emscripten');

    wrapper.appendChild(this.gameContainer);
    this.initializeUnity();
  }

  /**
   * Traduz texto para glosa e reproduz
   */
  translate(text: string, options: TranslateOptions = {}): void {
    const { isEnabledStats = true } = options;
    
    this.onTranslateStart();

    if (this.loaded) {
      this.stop();
    }

    this.text = text;

    const callback: TranslationCallback = (gloss, error) => {
      if (error) {
        if (error === 'timeout_error') {
          this.onError('timeout_error');
        } else {
          this.onTranslateEnd();
          return;
        }
      }

      if (gloss) {
        this.play(gloss, { fromTranslation: true, isEnabledStats });
      }
      this.onTranslateEnd();
    };

    this.translator.translate(text, window.location.host, callback);
  }

  /**
   * Reproduz glosa
   */
  play(gloss?: string, options: PlayOptions = {}): void {
    const { isEnabledStats = true } = options;

    // Gerencia URLs de dicionário baseado em estatísticas
    if (!isEnabledStats && this.isDefaultUrl()) {
      this.playerManager.setBaseUrl(config.dictionaryStaticUrl + this.region + '/');
    } else if (isEnabledStats && !this.isDefaultUrl()) {
      this.playerManager.setBaseUrl(config.dictionaryUrl + this.region + '/');
    }

    this.gloss = gloss || this.gloss;

    if (this.gloss !== undefined && this.loaded) {
      this.changeStatus(PlayerStatus.INITIALIZING);
      this.playerManager.play(this.gloss);
    }
  }

  /**
   * Reproduz mensagem de boas-vindas
   */
  playWelcome(): void {
    this.playerManager.playWellcome();
    this.onStartWelcome();
  }

  /**
   * Continua reprodução
   */
  continue(): void {
    this.playerManager.play();
  }

  /**
   * Repete reprodução atual
   */
  repeat(): void {
    this.play();
  }

  /**
   * Pausa reprodução
   */
  pause(): void {
    this.playerManager.pause();
  }

  /**
   * Para reprodução
   */
  stop(): void {
    this.playerManager.stop();
  }

  /**
   * Define velocidade de reprodução
   */
  setSpeed(speed: PlaybackSpeed): void {
    this.playerManager.setSpeed(speed);
  }

  /**
   * Define personalização do avatar
   */
  setPersonalization(personalization: PersonalizationConfig): void {
    this.playerManager.setPersonalization(personalization);
  }

  /**
   * Muda avatar
   */
  changeAvatar(avatarName: string): void {
    this.playerManager.changeAvatar(avatarName);
  }

  /**
   * Alterna legendas
   */
  toggleSubtitle(): void {
    this.playerManager.toggleSubtitle();
  }

  /**
   * Define região
   */
  setRegion(region: SupportedRegion): void {
    this.region = region;
    this.playerManager.setBaseUrl(config.dictionaryUrl + region + '/');
  }

  // Getters públicos
  getStatus(): PlayerStatus {
    return this.status;
  }

  getText(): string | undefined {
    return this.text;
  }

  getGloss(): string | undefined {
    return this.gloss;
  }

  isLoaded(): boolean {
    return this.loaded;
  }

  getRegion(): SupportedRegion {
    return this.region;
  }

  /**
   * Obtém o event emitter do player
   */
  getEventEmitter(): VLibrasEventEmitter {
    return this.eventEmitter;
  }

  // Métodos privados
  private isDefaultUrl(): boolean {
    return this.playerManager.currentBaseUrl === config.dictionaryUrl + this.region + '/';
  }

  private getTargetScript(): string {
    return this.joinUrl(this.options.targetPath || config.defaultTargetPath, config.unity.loaderFile);
  }

  private joinUrl(...parts: string[]): string {
    return parts.join('/').replace(/\/+/g, '/').replace(/\/$/, '');
  }

  private initializeUnity(): void {
    const targetSetup = this.joinUrl(this.options.targetPath || config.defaultTargetPath, config.unity.configFile);
    const targetScript = document.createElement('script');

    targetScript.src = this.getTargetScript();
    targetScript.onload = () => {
      const unityLoader = (window as any).UnityLoader as IUnityLoader;
      
      if (!unityLoader) {
        this.onError('unity_loader_not_found');
        return;
      }

      this.player = unityLoader.instantiate(config.unity.containerId, targetSetup, {
        compatibilityCheck: (_: any, accept: () => void, deny: () => void) => {
          if (unityLoader.SystemInfo.hasWebGL) {
            return accept();
          }
          
          this.onError('unsupported');
          alert('Seu navegador não suporta WebGL');
          console.error('Seu navegador não suporta WebGL');
          deny();
        }
      });

      this.playerManager.setPlayerReference(this.player);
    };

    targetScript.onerror = () => {
      this.onError('unity_script_load_failed');
    };

    document.body.appendChild(targetScript);
  }

  private changeStatus(status: PlayerStatus): void {
    switch (status) {
      case PlayerStatus.IDLE:
        if (this.status === PlayerStatus.PLAYING) {
          this.status = status;
          this.onGlossEnd(this.globalGlossLength);
        }
        break;

      case PlayerStatus.INITIALIZING:
        this.status = status;
        break;

      case PlayerStatus.PLAYING:
        if (this.status === PlayerStatus.INITIALIZING) {
          this.status = status;
          this.onGlossStart();
        }
        break;
    }
  }

  // Event handlers - podem ser sobrescritos
  protected onLoad(): void {
    // Implementação padrão vazia - pode ser sobrescrita
  }

  protected onTranslateStart(): void {
    // Implementação padrão vazia - pode ser sobrescrita
  }

  protected onTranslateEnd(): void {
    // Implementação padrão vazia - pode ser sobrescrita
  }

  protected onGlossStart(): void {
    // Implementação padrão vazia - pode ser sobrescrita
  }

  protected onGlossEnd(_glossLength: string): void {
    // Implementação padrão vazia - pode ser sobrescrita
  }

  protected onAnimationPlay(): void {
    // Implementação padrão vazia - pode ser sobrescrita
  }

  protected onAnimationPause(): void {
    // Implementação padrão vazia - pode ser sobrescrita
  }

  protected onAnimationEnd(): void {
    // Implementação padrão vazia - pode ser sobrescrita
  }

  protected onAnimationProgress(_progress: number): void {
    // Implementação padrão vazia - pode ser sobrescrita
  }

  protected onGlossResponse(_counter: number, _glossLength: string): void {
    // Implementação padrão vazia - pode ser sobrescrita
  }

  protected onGetAvatar(_avatar: any): void {
    // Implementação padrão vazia - pode ser sobrescrita
  }

  protected onStartWelcome(): void {
    // Implementação padrão vazia - pode ser sobrescrita
  }

  protected onStopWelcome(_finished: boolean): void {
    // Implementação padrão vazia - pode ser sobrescrita
  }

  protected onError(error: string): void {
    console.error('VLibras Player Error:', error);
    this.eventEmitter.emit('player:error', { 
      error: new Error(error), 
      player: this, 
      timestamp: Date.now() 
    });
  }

  // === NOVAS FUNCIONALIDADES v2.1.0 ===

  /**
   * Adiciona listener para eventos do player
   */  on<K extends keyof import('../../infrastructure/events/VLibrasEvents').PlayerEvents>(
    event: K,
    listener: (data: import('../../infrastructure/events/VLibrasEvents').PlayerEvents[K]) => void
  ): () => void {
    return this.eventEmitter.on(event, listener);
  }

  /**
   * Remove listener de evento
   */  off<K extends keyof import('../../infrastructure/events/VLibrasEvents').PlayerEvents>(
    event: K,
    listener: (data: import('../../infrastructure/events/VLibrasEvents').PlayerEvents[K]) => void
  ): void {
    this.eventEmitter.off(event, listener);
  }

  /**
   * Configura Unity Bridge automaticamente
   */
  setupUnityBridge(): void {
    setupUnityBridge();
  }

  /**
   * Aplica CSS otimizado automaticamente
   */
  setupOptimizedCSS(containerSelector?: string): void {
    setupOptimizedCSS(containerSelector);
  }

  /**
   * Executa diagnósticos do sistema
   */
  async runDiagnostics() {
    return await VLibrasDevTools.runDiagnostics();
  }

  /**
   * Ativa modo debug
   */
  enableDebugMode(): void {
    VLibrasDevTools.enableDebugMode();
  }

  /**
   * Desativa modo debug
   */
  disableDebugMode(): void {
    VLibrasDevTools.disableDebugMode();
  }

  /**
   * Verifica se está em modo debug
   */
  isDebugMode(): boolean {
    return VLibrasDevTools.isDebugEnabled();
  }

  /**
   * Obtém estatísticas do player
   */
  getStats() {
    return {
      status: this.status,
      loaded: this.loaded,
      region: this.region,
      text: this.text,
      gloss: this.gloss
    };
  }

  /**
   * Carrega o player de forma assíncrona
   */
  async loadAsync(wrapper: HTMLElement): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Timeout: Player não carregou em 30 segundos'));
      }, 30000);

      const cleanupAndResolve = () => {
        clearTimeout(timeoutId);
        resolve();
      };

      const cleanupAndReject = (error: Error) => {
        clearTimeout(timeoutId);
        reject(error);
      };

      // Escuta eventos de carregamento
      const removeListeners = this.on('player:ready', () => {
        removeListeners();
        cleanupAndResolve();
      });

      this.on('player:error', (data) => {
        removeListeners();
        cleanupAndReject(data.error);
      });

      // Inicia carregamento
      try {
        this.load(wrapper);
      } catch (error) {
        cleanupAndReject(error instanceof Error ? error : new Error(String(error)));
      }
    });
  }

  /**
   * Traduz texto de forma assíncrona
   */
  async translateAsync(text: string, options: TranslateOptions = {}): Promise<string> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Timeout: Tradução não completou em 15 segundos'));
      }, 15000);

      const cleanupAndResolve = (gloss: string) => {
        clearTimeout(timeoutId);
        resolve(gloss);
      };

      const cleanupAndReject = (error: Error) => {
        clearTimeout(timeoutId);
        reject(error);
      };

      // Escuta eventos de tradução
      const removeListeners = this.on('translation:complete', (data) => {
        removeListeners();
        cleanupAndResolve(data.gloss);
      });

      this.on('translation:error', (data) => {
        removeListeners();
        cleanupAndReject(new Error(data.error));
      });

      // Inicia tradução
      try {
        this.translate(text, options);
      } catch (error) {
        cleanupAndReject(error instanceof Error ? error : new Error(String(error)));
      }
    });
  }

  /**
   * Reproduz glosa de forma assíncrona
   */
  async playAsync(gloss?: string, options: PlayOptions = {}): Promise<PlaybackResult> {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const timeoutId = setTimeout(() => {
        reject(new Error('Timeout: Reprodução não completou em 60 segundos'));
      }, 60000);

      const cleanupAndResolve = (result: PlaybackResult) => {
        clearTimeout(timeoutId);
        resolve(result);
      };

      const cleanupAndReject = (error: Error) => {
        clearTimeout(timeoutId);
        reject(error);
      };

      // Escuta eventos de animação
      const removeListeners = this.on('animation:complete', (data) => {
        removeListeners();
        cleanupAndResolve({
          duration: data.duration,
          totalFrames: data.totalFrames,
          success: true,
          startTime,
          endTime: Date.now()
        });
      });

      this.on('animation:error', (data) => {
        removeListeners();
        cleanupAndReject(new Error(data.error));
      });

      // Inicia reprodução
      try {
        this.play(gloss, options);
      } catch (error) {
        cleanupAndReject(error instanceof Error ? error : new Error(String(error)));
      }
    });
  }

  /**
   * Traduz e reproduz texto em uma única operação assíncrona
   */
  async translateAndPlay(text: string, options: TranslateOptions = {}): Promise<PlaybackResult> {
    try {
      const gloss = await this.translateAsync(text, options);
      return await this.playAsync(gloss, options);
    } catch (error) {
      this.eventEmitter.emit('player:error', {
        error: error instanceof Error ? error : new Error(String(error)),
        player: this,
        timestamp: Date.now()
      });
      throw error;
    }
  }

  /**
   * Aguarda até o player estar pronto
   */
  async waitForReady(): Promise<void> {
    if (this.loaded && this.status === PlayerStatus.READY) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Timeout: Player não ficou pronto em 30 segundos'));
      }, 30000);

      const cleanup = () => {
        clearTimeout(timeoutId);
      };

      const removeListeners = this.on('player:ready', () => {
        cleanup();
        removeListeners();
        resolve();
      });

      this.on('player:error', (data) => {
        cleanup();
        removeListeners();
        reject(data.error);
      });
    });
  }
}
