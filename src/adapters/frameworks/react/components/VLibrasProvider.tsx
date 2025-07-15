import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { VLibrasPlayer as CorePlayer } from '../../../../core/player/VLibrasPlayer';

interface VLibrasContextType {
  player: CorePlayer | null;
  isLoaded: boolean;
  isPlaying: boolean;
  error: Error | null;
  config: VLibrasConfig;
  updateConfig: (newConfig: Partial<VLibrasConfig>) => void;
}

interface VLibrasConfig {
  targetPath: string;
  theme: 'light' | 'dark' | 'auto';
  autoInitialize: boolean;
  enableCache: boolean;
  debug: boolean;
}

const VLibrasContext = createContext<VLibrasContextType | undefined>(undefined);

export interface VLibrasProviderProps {
  children: ReactNode;
  config?: Partial<VLibrasConfig>;
}

const defaultConfig: VLibrasConfig = {
  targetPath: '/assets/vlibras',
  theme: 'auto',
  autoInitialize: true,
  enableCache: true,
  debug: false
};

export function VLibrasProvider({ children, config: userConfig = {} }: VLibrasProviderProps) {
  const [config, setConfig] = useState<VLibrasConfig>({ ...defaultConfig, ...userConfig });
  const [player, setPlayer] = useState<CorePlayer | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (config.autoInitialize && !player) {
      try {
        const playerInstance = new CorePlayer({
          targetPath: config.targetPath,
          theme: config.theme,
          enableCache: config.enableCache,
          debug: config.debug,
          onReady: () => setIsLoaded(true),
          onError: (err: Error) => setError(err),
          onPlay: () => setIsPlaying(true),
          onPause: () => setIsPlaying(false),
          onStop: () => setIsPlaying(false)
        });
        setPlayer(playerInstance);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao inicializar VLibras'));
      }
    }
  }, [config, player]);

  const updateConfig = (newConfig: Partial<VLibrasConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const value = {
    player,
    isLoaded,
    isPlaying,
    error,
    config,
    updateConfig
  };

  return (
    <VLibrasContext.Provider value={value}>
      {children}
    </VLibrasContext.Provider>
  );
}

export function useVLibrasContext() {
  const context = useContext(VLibrasContext);
  if (context === undefined) {
    throw new Error('useVLibrasContext must be used within a VLibrasProvider');
  }
  return context;
}

export type { VLibrasConfig, VLibrasContextType };
