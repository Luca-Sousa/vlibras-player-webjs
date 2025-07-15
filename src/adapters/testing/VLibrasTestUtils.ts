/**
 * VLibras Testing Utilities
 * Utilitários para testes sem dependência externa
 */

export class VLibrasTestUtils {
  /**
   * Cria um mock do VLibrasPlayer para testes
   */
  static createMockPlayer() {
    return {
      init: jest?.fn ? jest.fn() : () => {},
      translateAsync: jest?.fn ? jest.fn().mockResolvedValue(undefined) : () => Promise.resolve(),
      playAsync: jest?.fn ? jest.fn().mockResolvedValue(undefined) : () => Promise.resolve(),
      pause: jest?.fn ? jest.fn() : () => {},
      stop: jest?.fn ? jest.fn() : () => {},
      destroy: jest?.fn ? jest.fn() : () => {},
      isLoaded: true,
      isPlaying: false
    };
  }

  /**
   * Mock de eventos do VLibras
   */
  static createMockEvents() {
    const events: Record<string, Function[]> = {};
    
    return {
      emit: (event: string, data?: any) => {
        if (events[event]) {
          events[event].forEach(callback => callback(data));
        }
      },
      on: (event: string, callback: Function) => {
        if (!events[event]) events[event] = [];
        events[event].push(callback);
      },
      off: (event: string, callback: Function) => {
        if (events[event]) {
          events[event] = events[event].filter(cb => cb !== callback);
        }
      }
    };
  }

  /**
   * Utilitários para DOM em testes
   */
  static createMockContainer() {
    if (typeof document !== 'undefined') {
      const container = document.createElement('div');
      container.id = 'vlibras-test-container';
      return container;
    }
    
    // Fallback para ambiente Node.js
    return {
      id: 'vlibras-test-container',
      appendChild: () => {},
      removeChild: () => {},
      querySelector: () => null,
      addEventListener: () => {},
      removeEventListener: () => {}
    };
  }

  /**
   * Aguarda um elemento estar pronto (para testes async)
   */
  static async waitForElement(selector: string, timeout = 5000): Promise<Element | null> {
    if (typeof document === 'undefined') return null;

    return new Promise((resolve) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, timeout);
    });
  }
}
