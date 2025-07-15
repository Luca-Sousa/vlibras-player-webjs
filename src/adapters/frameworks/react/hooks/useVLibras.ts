import { useState, useEffect } from 'react';

// Tipos básicos para evitar dependência circular
export interface VLibrasPlayerConfig {
  container?: string | HTMLElement;
  width?: number;
  height?: string | number;
  responsive?: boolean;
  autoplay?: boolean;
  controls?: boolean;
  muted?: boolean;
  debug?: boolean;
  theme?: 'light' | 'dark' | 'high-contrast' | 'auto';
  language?: 'pt-br' | 'en' | 'es';
  enableCache?: boolean;
  cacheTimeout?: number;
  fallbackUrl?: string;
  targetPath?: string; // Caminho para assets do Unity
  errorCallback?: (error: Error) => void;
  loadingCallback?: (progress: number) => void;
  onReady?: () => void;
  onLoad?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onError?: (error: Error) => void;
}

export interface VLibrasPlayerInstance {
  translate(text: string, options?: any): void;
  translateAsync(text: string, options?: any): Promise<string>;
  play(gloss?: string, options?: any): void;
  playAsync(gloss?: string, options?: any): Promise<any>;
  pause(): void;
  stop(): void;
  destroy(): void;
  translateAndPlay(text: string, options?: any): Promise<any>;
  eventEmitter: any;
}

export interface UseVLibrasOptions extends VLibrasPlayerConfig {
  autoInit?: boolean;
  targetPath?: string; // Alias para assetsPath
}

export interface UseVLibrasReturn {
  player: VLibrasPlayerInstance | null;
  isLoaded: boolean;
  isPlaying: boolean;
  error: string | null;
  translate: (text: string) => Promise<void>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  destroy: () => Promise<void>;
}

/**
 * Hook React para gerenciar o VLibras Player
 * Gerencia estado, lifecycle e fornece API simplificada
 */
export function useVLibras(options: UseVLibrasOptions = {}): UseVLibrasReturn {
  const [player, setPlayer] = useState<VLibrasPlayerInstance | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initPlayer() {
      try {
        // Import usando caminho relativo correto
        const playerModule = await import('../../../../core/player/VLibrasPlayer');
        const VLibrasPlayer = playerModule.VLibrasPlayer;
        
        if (!mounted) return;

        const playerInstance = new VLibrasPlayer({
          targetPath: options.targetPath || '/assets/vlibras',
          theme: options.theme || 'auto',
          debug: options.debug || false,
          autoplay: options.autoplay || false
        });

        setPlayer(playerInstance);
        setIsLoaded(true);
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to initialize VLibras Player');
        }
      }
    }

    if (options.autoInit !== false) {
      initPlayer();
    }

    return () => {
      mounted = false;
    };
  }, [options.targetPath, options.theme, options.debug, options.autoplay, options.autoInit]);

  // Cleanup quando componente desmonta
  useEffect(() => {
    return () => {
      if (player) {
        try {
          player.destroy();
        } catch (error) {
          console.error('Error during player cleanup:', error);
        }
      }
    };
  }, [player]);

  // Handlers com error handling
  const translate = async (text: string): Promise<void> => {
    if (!player) throw new Error('Player not initialized');
    try {
      await player.translateAsync(text);
      setIsPlaying(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed');
      throw err;
    }
  };

  const play = async (): Promise<void> => {
    if (!player) throw new Error('Player not initialized');
    try {
      await player.playAsync();
      setIsPlaying(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Play failed');
      throw err;
    }
  };

  const pause = async (): Promise<void> => {
    if (!player) throw new Error('Player not initialized');
    try {
      player.pause();
      setIsPlaying(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Pause failed');
      throw err;
    }
  };

  const stop = async (): Promise<void> => {
    if (!player) throw new Error('Player not initialized');
    try {
      player.stop();
      setIsPlaying(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Stop failed');
      throw err;
    }
  };

  const destroy = async (): Promise<void> => {
    if (!player) return;
    try {
      player.destroy();
      setPlayer(null);
      setIsLoaded(false);
      setIsPlaying(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Destroy failed');
      throw err;
    }
  };

  return {
    player,
    isLoaded,
    isPlaying,
    error,
    translate,
    play,
    pause,
    stop,
    destroy
  };
}