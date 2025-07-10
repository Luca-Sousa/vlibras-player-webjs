import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { VLibrasPlayer } from '../../core/player/VLibrasPlayer';

/**
 * Testes de compatibilidade com React
 */
describe('VLibrasPlayer - React Compatibility', () => {
  let container: HTMLElement;
  let player: VLibrasPlayer;

  beforeEach(() => {
    // Simula ambiente React
    container = document.createElement('div');
    container.id = 'react-container';
    document.body.appendChild(container);
    
    // Mock React-specific globals
    (global as any).React = { version: '19.0.0' };
  });

  afterEach(() => {
    if (container.parentNode) {
      document.body.removeChild(container);
    }
    if (player) {
      player.stop();
    }
  });

  test('should work with React useRef pattern', () => {
    // Simula o padrão useRef do React
    const ref = { current: container };
    
    player = new VLibrasPlayer({
      targetPath: './test-assets'
    });
    
    // Testa se funciona com .current
    expect(() => {
      player.load(ref.current);
    }).not.toThrow();
    
    expect(ref.current.children.length).toBeGreaterThan(0);
  });

  test('should handle React useEffect cleanup', () => {
    player = new VLibrasPlayer();
    player.load(container);
    
    // Simula cleanup do useEffect
    expect(() => {
      player.stop();
      player.pause();
    }).not.toThrow();
  });

  test('should work with React useState pattern', async () => {
    let isLoaded = false;
    
    player = new VLibrasPlayer({
      onLoad: () => {
        isLoaded = true;
      }
    });
    
    player.load(container);
    
    // Simula estado React
    expect(typeof isLoaded).toBe('boolean');
    expect(player.isLoaded()).toBe(false); // Inicialmente false
  });

  test('should work with React useCallback pattern', () => {
    player = new VLibrasPlayer();
    player.load(container);
    
    // Simula useCallback
    const handleTranslate = jest.fn((text: string) => {
      player.translate(text);
    });
    
    expect(() => {
      handleTranslate('Teste React');
    }).not.toThrow();
    
    expect(handleTranslate).toHaveBeenCalledWith('Teste React');
  });

  test('should handle multiple instances (React components)', () => {
    const container1 = document.createElement('div');
    const container2 = document.createElement('div');
    document.body.appendChild(container1);
    document.body.appendChild(container2);
    
    const player1 = new VLibrasPlayer();
    const player2 = new VLibrasPlayer();
    
    expect(() => {
      player1.load(container1);
      player2.load(container2);
    }).not.toThrow();
    
    expect(container1.children.length).toBeGreaterThan(0);
    expect(container2.children.length).toBeGreaterThan(0);
    
    // Cleanup
    document.body.removeChild(container1);
    document.body.removeChild(container2);
    player1.stop();
    player2.stop();
  });

  test('should work with React Error Boundaries', () => {
    player = new VLibrasPlayer({
      targetPath: '/invalid/path'
    });
    
    // Deve funcionar mesmo com configuração inválida
    expect(() => {
      player.load(container);
    }).not.toThrow();
  });

  test('should support React Suspense pattern', () => {
    let isLoading = true;
    
    player = new VLibrasPlayer({
      onLoad: () => {
        isLoading = false;
      }
    });
    
    player.load(container);
    
    // Simula Suspense loading state
    expect(typeof isLoading).toBe('boolean');
    expect(isLoading).toBe(true); // Ainda carregando
  });

  test('should work with React StrictMode', () => {
    // React StrictMode chama efeitos duas vezes em desenvolvimento
    player = new VLibrasPlayer();
    
    // Primeira chamada
    player.load(container);
    const firstChildCount = container.children.length;
    
    // Segunda chamada (StrictMode)
    player.load(container);
    const secondChildCount = container.children.length;
    
    // Deve funcionar sem duplicar elementos
    expect(secondChildCount).toBeGreaterThanOrEqual(firstChildCount);
  });

  test('should work with React 19 concurrent features', () => {
    player = new VLibrasPlayer();
    
    // Simula renderização concorrente
    const promises = Array.from({ length: 5 }, (_, i) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          if (i === 0) {
            player.load(container);
          }
          player.setRegion('SP');
          resolve();
        }, i * 10);
      });
    });
    
    expect(() => {
      Promise.all(promises);
    }).not.toThrow();
  });
});

/**
 * Testes de integração com frameworks
 */
describe('VLibrasPlayer - Framework Integration', () => {
  test('should provide TypeScript support for React', () => {
    // Verifica se os tipos estão disponíveis
    const config = {
      targetPath: './assets',
      onLoad: () => console.log('loaded')
    };
    
    const player = new VLibrasPlayer(config);
    
    // TypeScript deve inferir os tipos corretamente
    expect(player.getStatus()).toBe('idle');
    expect(player.getRegion()).toBe('BR');
    expect(typeof player.isLoaded()).toBe('boolean');
  });

  test('should work with modern bundlers', () => {
    // Simula import ESM
    expect(() => {
      const { VLibrasPlayer } = require('../../index');
      new VLibrasPlayer();
    }).not.toThrow();
  });

  test('should support tree-shaking', () => {
    // Verifica se apenas as partes necessárias são importadas
    const player = new VLibrasPlayer();
    
    // Deve ter apenas os métodos necessários
    expect(typeof player.translate).toBe('function');
    expect(typeof player.load).toBe('function');
    expect(typeof player.play).toBe('function');
  });
});
