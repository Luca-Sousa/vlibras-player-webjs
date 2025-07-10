/**
 * Sistema de eventos padronizado e type-safe para VLibras Player
 * Fornece eventos detalhados sobre o ciclo de vida do player
 */

export interface PlayerEvents {
  // Eventos do player principal
  'player:ready': { player: any; timestamp: number };
  'player:error': { error: Error; player: any; timestamp: number };
  'player:destroy': { player: any; timestamp: number };
  
  // Eventos de tradução
  'translation:start': { text: string; timestamp: number };
  'translation:progress': { progress: number; stage: string; timestamp: number };
  'translation:complete': { gloss: string; duration: number; timestamp: number };
  'translation:error': { error: string; text: string; timestamp: number };
  
  // Eventos de animação
  'animation:start': { gloss: string; timestamp: number };
  'animation:progress': { progress: number; currentFrame: number; timestamp: number };
  'animation:pause': { timestamp: number };
  'animation:resume': { timestamp: number };
  'animation:complete': { duration: number; totalFrames: number; timestamp: number };
  'animation:error': { error: string; timestamp: number };
  
  // Eventos de cache
  'cache:hit': { key: string; size: number; timestamp: number };
  'cache:miss': { key: string; timestamp: number };
  'cache:clear': { timestamp: number };
  
  // Eventos de performance
  'performance:slow': { operation: string; duration: number; threshold: number; timestamp: number };
  'performance:memory': { usage: number; limit: number; timestamp: number };
  'performance:fps': { fps: number; timestamp: number };
  
  // Eventos de diagnóstico
  'diagnostic:webgl': { supported: boolean; version: string; timestamp: number };
  'diagnostic:assets': { loaded: boolean; size: number; version: string; timestamp: number };
  'diagnostic:compatibility': { browser: string; version: string; supported: boolean; timestamp: number };
}

/**
 * Event Emitter type-safe para VLibras
 */
export class VLibrasEventEmitter {
  private listeners: Map<keyof PlayerEvents, Array<(...args: any[]) => void>> = new Map();
  private onceListeners: Map<keyof PlayerEvents, Array<(...args: any[]) => void>> = new Map();

  /**
   * Adiciona um listener para um evento específico
   */
  on<K extends keyof PlayerEvents>(
    event: K, 
    listener: (data: PlayerEvents[K]) => void
  ): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
    
    // Retorna função para remover o listener
    return () => this.off(event, listener);
  }

  /**
   * Adiciona um listener que será executado apenas uma vez
   */
  once<K extends keyof PlayerEvents>(
    event: K, 
    listener: (data: PlayerEvents[K]) => void
  ): () => void {
    if (!this.onceListeners.has(event)) {
      this.onceListeners.set(event, []);
    }
    this.onceListeners.get(event)!.push(listener);
    
    return () => this.off(event, listener);
  }

  /**
   * Remove um listener específico
   */
  off<K extends keyof PlayerEvents>(
    event: K, 
    listener: (data: PlayerEvents[K]) => void
  ): void {
    // Remove from regular listeners
    const regularListeners = this.listeners.get(event);
    if (regularListeners) {
      const index = regularListeners.indexOf(listener);
      if (index !== -1) {
        regularListeners.splice(index, 1);
      }
    }

    // Remove from once listeners
    const onceListeners = this.onceListeners.get(event);
    if (onceListeners) {
      const index = onceListeners.indexOf(listener);
      if (index !== -1) {
        onceListeners.splice(index, 1);
      }
    }
  }

  /**
   * Emite um evento para todos os listeners
   */
  emit<K extends keyof PlayerEvents>(event: K, data: PlayerEvents[K]): void {
    // Emit to regular listeners
    const regularListeners = this.listeners.get(event);
    if (regularListeners) {
      regularListeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error(`Erro no listener do evento ${event}:`, error);
        }
      });
    }

    // Emit to once listeners and remove them
    const onceListeners = this.onceListeners.get(event);
    if (onceListeners) {
      onceListeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error(`Erro no listener once do evento ${event}:`, error);
        }
      });
      this.onceListeners.set(event, []); // Clear once listeners
    }
  }

  /**
   * Remove todos os listeners de um evento ou de todos os eventos
   */
  removeAllListeners(event?: keyof PlayerEvents): void {
    if (event) {
      this.listeners.delete(event);
      this.onceListeners.delete(event);
    } else {
      this.listeners.clear();
      this.onceListeners.clear();
    }
  }

  /**
   * Retorna o número de listeners para um evento
   */
  listenerCount(event: keyof PlayerEvents): number {
    const regular = this.listeners.get(event)?.length || 0;
    const once = this.onceListeners.get(event)?.length || 0;
    return regular + once;
  }

  /**
   * Retorna todos os eventos que têm listeners
   */
  eventNames(): Array<keyof PlayerEvents> {
    const events = new Set<keyof PlayerEvents>();
    
    for (const event of this.listeners.keys()) {
      events.add(event);
    }
    
    for (const event of this.onceListeners.keys()) {
      events.add(event);
    }
    
    return Array.from(events);
  }
}

/**
 * Utilitários para eventos
 */
export class VLibrasEventUtils {
  /**
   * Cria um timestamp padronizado
   */
  static createTimestamp(): number {
    return Date.now();
  }

  /**
   * Aguarda por um evento específico
   */
  static waitForEvent<K extends keyof PlayerEvents>(
    emitter: VLibrasEventEmitter,
    event: K,
    timeout = 5000
  ): Promise<PlayerEvents[K]> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Timeout aguardando evento ${event}`));
      }, timeout);

      const cleanup = emitter.once(event, (data) => {
        clearTimeout(timer);
        resolve(data);
      });

      // Se o timeout acontecer, remove o listener
      setTimeout(() => {
        if (timer) {
          cleanup();
        }
      }, timeout);
    });
  }

  /**
   * Debounce para eventos frequentes
   */
  static debounceEvent<K extends keyof PlayerEvents>(
    emitter: VLibrasEventEmitter,
    event: K,
    callback: (data: PlayerEvents[K]) => void,
    delay = 300
  ): () => void {
    let timeoutId: NodeJS.Timeout | null = null;
    let lastData: PlayerEvents[K] | null = null;

    const cleanup = emitter.on(event, (data) => {
      lastData = data;
      
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        if (lastData) {
          callback(lastData);
          lastData = null;
        }
      }, delay);
    });

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      cleanup();
    };
  }
}

// Instância global de eventos
export const globalEventEmitter = new VLibrasEventEmitter();
