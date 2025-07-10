/**
 * Hook personalizado para uso do VLibras no React
 * Interface Segregation: Contrato específico para React
 */

// Tipos minimalistas para evitar dependência direta do React
type SetState<T> = (value: T | ((prev: T) => T)) => void;
type EffectCallback = () => void | (() => void);
type DependencyList = ReadonlyArray<any>;

// Simulação das funções do React para compatibilidade
let reactHooks: {
  useState: <T>(initial: T) => [T, SetState<T>];
  useEffect: (effect: EffectCallback, deps?: DependencyList) => void;
  useRef: <T>(initial: T) => { current: T };
} | null = null;

// Carregamento lazy dos hooks do React
const loadReactHooks = () => {
  if (reactHooks) return reactHooks;
  
  try {
    const React = require('react');
    reactHooks = {
      useState: React.useState,
      useEffect: React.useEffect,
      useRef: React.useRef
    };
    return reactHooks;
  } catch {
    throw new Error('React não está disponível. Instale o React para usar este hook.');
  }
};

export interface UseVLibrasOptions {
  autoLoad?: boolean;
  preset?: 'dictionary' | 'quiz' | 'tutorial' | 'compact' | 'presentation' | 'accessibility' | 'development';
  theme?: 'light' | 'dark' | 'high-contrast' | 'auto';
  onReady?: () => void;
  onError?: (error: Error) => void;
}

export interface UseVLibrasReturn {
  player: any;
  translate: (text: string) => Promise<void>;
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  isLoaded: boolean;
  isPlaying: boolean;
  error: Error | null;
}

export function useVLibras(options: UseVLibrasOptions = {}): UseVLibrasReturn {
  const { useState, useEffect, useRef } = loadReactHooks();
  
  const [player, setPlayer] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    const initializePlayer = async () => {
      try {
        // Lazy load do VLibrasPlayer e presets
        const { VLibrasPlayer, VLibrasPresets } = await import('../../../../index');
        
        let playerConfig: any = {
          theme: options.theme,
          onReady: () => {
            setIsLoaded(true);
            options.onReady?.();
          },
          onError: (err: Error) => {
            setError(err);
            options.onError?.(err);
          },
          onPlay: () => setIsPlaying(true),
          onPause: () => setIsPlaying(false),
          onStop: () => setIsPlaying(false)
        };

        // Aplicar preset se especificado
        if (options.preset) {
          const presetConfig = (VLibrasPresets as any)[options.preset];
          if (presetConfig) {
            playerConfig = { ...presetConfig, ...playerConfig };
          }
        }

        const playerInstance = new VLibrasPlayer(playerConfig);
        setPlayer(playerInstance);
        playerRef.current = playerInstance;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Erro ao inicializar VLibras');
        setError(error);
        options.onError?.(error);
      }
    };

    if (options.autoLoad !== false) {
      initializePlayer();
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy?.();
      }
    };
  }, [options.autoLoad, options.preset, options.theme]);

  const translate = async (text: string): Promise<void> => {
    if (!player) {
      throw new Error('Player não inicializado');
    }
    return player.translateAsync(text);
  };

  const play = async (): Promise<void> => {
    if (!player) {
      throw new Error('Player não inicializado');
    }
    return player.playAsync();
  };

  const pause = (): void => {
    if (!player) {
      throw new Error('Player não inicializado');
    }
    player.pause();
  };

  const stop = (): void => {
    if (!player) {
      throw new Error('Player não inicializado');
    }
    player.stop();
  };

  return {
    player,
    translate,
    play,
    pause,
    stop,
    isLoaded,
    isPlaying,
    error
  };
}
