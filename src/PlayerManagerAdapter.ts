import { UnityPlayer, PersonalizationConfig, PlaybackSpeed } from './types';

/**
 * Tipo para callbacks de eventos
 */
export type EventCallback = (...args: any[]) => void;

/**
 * Interface para eventos
 */
interface EventMap {
  [event: string]: EventCallback[];
}

/**
 * Adapter para gerenciar comunicação com o Unity Player
 */
export class PlayerManagerAdapter {
  private player: UnityPlayer | null = null;
  private listeners: EventMap = {};
  public currentBaseUrl: string = '';

  constructor() {
    // Torna os métodos de callback globalmente acessíveis para o Unity
    (window as any).VLibrasPlayerManagerAdapter = this;
  }

  /**
   * Adiciona listener para evento
   */
  on(event: string, callback: EventCallback): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  /**
   * Remove listener de evento
   */
  off(event: string, callback: EventCallback): void {
    const callbacks = this.listeners[event];
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Emite evento
   */
  private emit(event: string, ...args: any[]): void {
    const callbacks = this.listeners[event];
    if (callbacks) {
      callbacks.forEach((callback: EventCallback) => {
        try {
          callback(...args);
        } catch (error) {
          console.warn(`Erro no callback do evento ${event}:`, error);
        }
      });
    }
  }

  /**
   * Define a referência do Unity Player
   */
  setPlayerReference(player: UnityPlayer): void {
    this.player = player;
    this.emit('load');
  }

  /**
   * Define a URL base para recursos
   */
  setBaseUrl(url: string): void {
    this.currentBaseUrl = url;
    if (this.player) {
      this.sendMessage('Avatar', 'setUrl', url);
    }
  }

  /**
   * Reproduz uma glosa
   */
  play(gloss?: string): void {
    if (!this.player) return;

    if (gloss) {
      this.sendMessage('Avatar', 'setGlosa', gloss);
    }
    this.sendMessage('Avatar', 'play', '');
  }

  /**
   * Reproduz mensagem de boas-vindas
   */
  playWellcome(): void {
    if (!this.player) return;
    this.sendMessage('Avatar', 'playWelcome', '');
  }

  /**
   * Pausa a reprodução
   */
  pause(): void {
    if (!this.player) return;
    this.sendMessage('Avatar', 'pause', '');
  }

  /**
   * Para a reprodução
   */
  stop(): void {
    if (!this.player) return;
    this.sendMessage('Avatar', 'stop', '');
  }

  /**
   * Define a velocidade de reprodução
   */
  setSpeed(speed: PlaybackSpeed): void {
    if (!this.player) return;
    this.sendMessage('Avatar', 'setSpeed', speed.toString());
  }

  /**
   * Define personalização do avatar
   */
  setPersonalization(personalization: PersonalizationConfig): void {
    if (!this.player) return;
    this.sendMessage('Avatar', 'setPersonalization', JSON.stringify(personalization));
  }

  /**
   * Muda o avatar
   */
  changeAvatar(avatarName: string): void {
    if (!this.player) return;
    this.sendMessage('Avatar', 'changeAvatar', avatarName);
  }

  /**
   * Alterna exibição de legendas
   */
  toggleSubtitle(): void {
    if (!this.player) return;
    this.sendMessage('Avatar', 'toggleSubtitle', '');
  }

  /**
   * Envia mensagem para o Unity Player
   */
  private sendMessage(objectName: string, methodName: string, value: string): void {
    if (this.player && this.player.SendMessage) {
      try {
        this.player.SendMessage(objectName, methodName, value);
      } catch (error) {
        console.warn('Erro ao enviar mensagem para Unity:', error);
      }
    }
  }

  /**
   * Manipuladores para eventos do Unity (devem ser chamados pelo Unity)
   */
  
  /**
   * Chamado pelo Unity quando há progresso na animação
   */
  onProgress(progress: number): void {
    this.emit('progress', progress);
  }

  /**
   * Chamado pelo Unity quando o estado muda
   */
  onStateChange(isPlaying: boolean, isPaused: boolean, isLoading: boolean): void {
    this.emit('stateChange', isPlaying, isPaused, isLoading);
  }

  /**
   * Chamado pelo Unity com contador de glosa
   */
  onCounterGloss(counter: number, glosaLength: string): void {
    this.emit('CounterGloss', counter, glosaLength);
  }

  /**
   * Chamado pelo Unity com informações do avatar
   */
  onGetAvatar(avatar: any): void {
    this.emit('GetAvatar', avatar);
  }

  /**
   * Chamado pelo Unity quando termina boas-vindas
   */
  onFinishWelcome(finished: boolean): void {
    this.emit('FinishWelcome', finished);
  }
}
