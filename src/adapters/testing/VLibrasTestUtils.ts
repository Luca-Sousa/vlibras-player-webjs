/**
 * Utilitários para testes com VLibras Player
 * Facilita mocking, simulação e assertions em testes automatizados
 */

import { VLibrasPlayer } from '../../core/player/VLibrasPlayer';
import { PlayerStatus, PlaybackResult } from '../../types/core.types';
import { PlayerEvents } from '../../infrastructure/events/VLibrasEvents';

export interface MockBehavior {
  loadDelay?: number;
  translateDelay?: number;
  playDelay?: number;
  shouldFailLoad?: boolean;
  shouldFailTranslate?: boolean;
  shouldFailPlay?: boolean;
  customLoadError?: string;
  customTranslateError?: string;
  customPlayError?: string;
  simulateSlowPerformance?: boolean;
}

export interface TestAssertion {
  player: VLibrasPlayer;
  expectedState?: PlayerStatus;
  expectedText?: string;
  expectedGloss?: string;
  timeout?: number;
}

/**
 * Classe principal de utilitários para testes
 */
export class VLibrasTestUtils {
  /**
   * Cria um player mock para testes
   */
  static createMockPlayer(behavior: MockBehavior = {}): VLibrasPlayer {
    const mockPlayer = new VLibrasPlayer({
      targetPath: '/mock/assets',
      onLoad: () => {
        if (behavior.shouldFailLoad) {
          setTimeout(() => {
            mockPlayer.eventEmitter.emit('player:error', {
              error: new Error(behavior.customLoadError || 'Mock load error'),
              player: mockPlayer,
              timestamp: Date.now()
            });
          }, behavior.loadDelay || 100);
        } else {
          setTimeout(() => {
            (mockPlayer as any).loaded = true;
            (mockPlayer as any).status = PlayerStatus.READY;
            mockPlayer.eventEmitter.emit('player:ready', {
              player: mockPlayer,
              timestamp: Date.now()
            });
          }, behavior.loadDelay || 100);
        }
      }
    });

    // Override métodos para simular comportamento
    const originalTranslate = mockPlayer.translate.bind(mockPlayer);
    mockPlayer.translate = (text: string, options = {}) => {
      mockPlayer.eventEmitter.emit('translation:start', {
        text,
        timestamp: Date.now()
      });

      setTimeout(() => {
        if (behavior.shouldFailTranslate) {
          mockPlayer.eventEmitter.emit('translation:error', {
            error: behavior.customTranslateError || 'Mock translate error',
            text,
            timestamp: Date.now()
          });
        } else {
          const mockGloss = `mock-gloss-for-${text.toLowerCase().replace(/\s+/g, '-')}`;
          mockPlayer.eventEmitter.emit('translation:complete', {
            gloss: mockGloss,
            duration: behavior.translateDelay || 500,
            timestamp: Date.now()
          });
          
          // Auto-call original translate for state management
          originalTranslate(text, options);
        }
      }, behavior.translateDelay || 500);
    };

    const originalPlay = mockPlayer.play.bind(mockPlayer);
    mockPlayer.play = (gloss?: string, options = {}) => {
      mockPlayer.eventEmitter.emit('animation:start', {
        gloss: gloss || 'mock-gloss',
        timestamp: Date.now()
      });

      // Simular progresso
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 10;
        mockPlayer.eventEmitter.emit('animation:progress', {
          progress,
          currentFrame: Math.floor(progress / 10),
          timestamp: Date.now()
        });

        if (progress >= 100) {
          clearInterval(progressInterval);
          
          if (behavior.shouldFailPlay) {
            mockPlayer.eventEmitter.emit('animation:error', {
              error: behavior.customPlayError || 'Mock play error',
              timestamp: Date.now()
            });
          } else {
            mockPlayer.eventEmitter.emit('animation:complete', {
              duration: behavior.playDelay || 2000,
              totalFrames: 10,
              timestamp: Date.now()
            });
          }
        }
      }, (behavior.playDelay || 2000) / 10);

      // Call original play for state management
      originalPlay(gloss, options);
    };

    return mockPlayer;
  }

  /**
   * Aguarda o player atingir um estado específico
   */
  static waitForState(player: VLibrasPlayer, state: PlayerStatus, timeout = 5000): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Timeout: Player não atingiu estado '${state}' em ${timeout}ms`));
      }, timeout);

      if (player.getStatus() === state) {
        clearTimeout(timeoutId);
        resolve();
        return;
      }

      const checkState = () => {
        if (player.getStatus() === state) {
          clearTimeout(timeoutId);
          resolve();
        }
      };

      // Verificar periodicamente (fallback)
      const interval = setInterval(checkState, 100);
      
      setTimeout(() => {
        clearInterval(interval);
      }, timeout);
    });
  }

  /**
   * Simula uma tradução completa
   */
  static async simulateTranslation(player: VLibrasPlayer, text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout: Simulação de tradução não completou'));
      }, 10000);

      const removeListener = player.on('translation:complete', () => {
        clearTimeout(timeout);
        removeListener();
        resolve();
      });

      player.translate(text);
    });
  }

  /**
   * Simula um erro no player
   */
  static simulateError(player: VLibrasPlayer, error: Error): void {
    player.eventEmitter.emit('player:error', {
      error,
      player,
      timestamp: Date.now()
    });
  }

  /**
   * Simula carregamento completo do player
   */
  static async simulateLoad(player: VLibrasPlayer, container?: HTMLElement): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout: Simulação de carregamento não completou'));
      }, 10000);

      const removeListener = player.on('player:ready', () => {
        clearTimeout(timeout);
        removeListener();
        resolve();
      });

      if (container) {
        player.load(container);
      } else {
        // Simular carregamento sem container real
        setTimeout(() => {
          player.eventEmitter.emit('player:ready', {
            player,
            timestamp: Date.now()
          });
        }, 100);
      }
    });
  }

  /**
   * Verifica se o player está no estado esperado
   */
  static expectState(player: VLibrasPlayer, expectedState: PlayerStatus): void {
    const currentState = player.getStatus();
    if (currentState !== expectedState) {
      throw new Error(`Estado esperado: '${expectedState}', estado atual: '${currentState}'`);
    }
  }

  /**
   * Verifica se uma tradução foi bem-sucedida
   */
  static async expectTranslation(player: VLibrasPlayer, text: string, timeout = 5000): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Timeout: Tradução de '${text}' não completou em ${timeout}ms`));
      }, timeout);

      const removeListener = player.on('translation:complete', (data) => {
        clearTimeout(timeoutId);
        removeListener();
        
        if (data.gloss && data.gloss.length > 0) {
          resolve();
        } else {
          reject(new Error('Tradução completou mas gloss está vazia'));
        }
      });

      const removeErrorListener = player.on('translation:error', (data) => {
        clearTimeout(timeoutId);
        removeListener();
        removeErrorListener();
        reject(new Error(`Erro na tradução: ${data.error}`));
      });

      player.translate(text);
    });
  }

  /**
   * Verifica se uma reprodução foi bem-sucedida
   */
  static async expectPlayback(player: VLibrasPlayer, timeout = 10000): Promise<PlaybackResult> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Timeout: Reprodução não completou em ${timeout}ms`));
      }, timeout);

      const removeListener = player.on('animation:complete', (data) => {
        clearTimeout(timeoutId);
        removeListener();
        resolve({
          duration: data.duration,
          totalFrames: data.totalFrames,
          success: true,
          startTime: Date.now() - data.duration,
          endTime: Date.now()
        });
      });

      const removeErrorListener = player.on('animation:error', (data) => {
        clearTimeout(timeoutId);
        removeListener();
        removeErrorListener();
        reject(new Error(`Erro na reprodução: ${data.error}`));
      });
    });
  }

  /**
   * Coleta estatísticas de eventos durante um período
   */
  static collectEventStats(player: VLibrasPlayer, duration: number): Promise<EventStats> {
    return new Promise((resolve) => {
      const stats: EventStats = {
        totalEvents: 0,
        eventsByType: {},
        startTime: Date.now(),
        endTime: 0,
        duration: 0
      };

      const originalEmit = player.eventEmitter.emit.bind(player.eventEmitter);
      
      player.eventEmitter.emit = function<K extends keyof PlayerEvents>(
        event: K, 
        data: PlayerEvents[K]
      ): void {
        stats.totalEvents++;
        stats.eventsByType[event as string] = (stats.eventsByType[event as string] || 0) + 1;
        originalEmit(event, data);
      };

      setTimeout(() => {
        stats.endTime = Date.now();
        stats.duration = stats.endTime - stats.startTime;
        
        // Restaurar emit original
        player.eventEmitter.emit = originalEmit;
        
        resolve(stats);
      }, duration);
    });
  }

  /**
   * Cria um ambiente de teste isolado
   */
  static createTestEnvironment(): TestEnvironment {
    if (typeof document !== 'undefined') {
      const container = document.createElement('div');
      container.id = 'vlibras-test-container';
      container.style.width = '400px';
      container.style.height = '300px';
      container.style.position = 'absolute';
      container.style.top = '-9999px';
      container.style.left = '-9999px';
      document.body.appendChild(container);

      return {
        container,
        cleanup: () => {
          if (container.parentNode) {
            container.parentNode.removeChild(container);
          }
        }
      };
    } else {
      // Mock para ambiente sem DOM (Node.js)
      const mockContainer = {
        appendChild: () => {},
        removeChild: () => {},
        id: 'vlibras-test-container',
        style: {}
      } as unknown as HTMLElement;

      return {
        container: mockContainer,
        cleanup: () => {
          // No-op para ambiente sem DOM
        }
      };
    }
  }
}

export interface EventStats {
  totalEvents: number;
  eventsByType: Record<string, number>;
  startTime: number;
  endTime: number;
  duration: number;
}

export interface TestEnvironment {
  container: HTMLElement;
  cleanup: () => void;
}

/**
 * Decorators para testes (se suportado pelo ambiente)
 */
export function withVLibrasMock(behavior?: MockBehavior) {
  return function(_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
      const mockPlayer = VLibrasTestUtils.createMockPlayer(behavior);
      return originalMethod.apply(this, [mockPlayer, ...args]);
    };
    
    return descriptor;
  };
}

export function withTestEnvironment() {
  return function(_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
      const env = VLibrasTestUtils.createTestEnvironment();
      try {
        return originalMethod.apply(this, [env, ...args]);
      } finally {
        env.cleanup();
      }
    };
    
    return descriptor;
  };
}
