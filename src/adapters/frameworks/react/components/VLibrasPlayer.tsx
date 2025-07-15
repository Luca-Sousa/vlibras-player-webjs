import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { useVLibrasContext } from './VLibrasProvider';

export interface VLibrasPlayerProps {
  // Content
  text?: string;
  
  // Behavior
  autoPlay?: boolean;
  showControls?: boolean;
  allowReplay?: boolean;
  
  // Appearance
  width?: number | string;
  height?: number | string;
  variant?: 'default' | 'minimal' | 'compact';
  className?: string;
  style?: React.CSSProperties;
  
  // Events
  onReady?: () => void;
  onTranslationStart?: (text: string) => void;
  onTranslationComplete?: () => void;
  onError?: (error: Error) => void;
}

export const VLibrasPlayer = forwardRef<HTMLDivElement, VLibrasPlayerProps>(({
  text,
  autoPlay = false,
  showControls = true,
  allowReplay = true,
  width = 320,
  height = 240,
  variant = 'default',
  onReady,
  onTranslationStart,
  onTranslationComplete,
  onError,
  className = '',
  ...props
}, ref) => {
  const { player, isLoaded, isPlaying, error: contextError } = useVLibrasContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const [localError, setLocalError] = useState<Error | null>(null);
  
  const error = contextError || localError;

  // Initialize player in container
  useEffect(() => {
    if (isLoaded && player && containerRef.current) {
      try {
        // Player já é inicializado no contexto, apenas configura o container se necessário
        onReady?.();
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Erro ao inicializar player');
        setLocalError(error);
        onError?.(error);
      }
    }
  }, [isLoaded, player, onReady, onError]);

  // Auto-translate when text changes
  useEffect(() => {
    if (text && player && isLoaded && autoPlay) {
      onTranslationStart?.(text);
      player.translateAsync(text)
        .then(() => onTranslationComplete?.())
        .catch(err => {
          const error = err instanceof Error ? err : new Error('Erro na tradução');
          setLocalError(error);
          onError?.(error);
        });
    }
  }, [text, player, isLoaded, autoPlay, onTranslationStart, onTranslationComplete, onError]);

  const handleTranslate = () => {
    if (text && player && isLoaded) {
      onTranslationStart?.(text);
      player.translateAsync(text)
        .then(() => onTranslationComplete?.())
        .catch(err => {
          const error = err instanceof Error ? err : new Error('Erro na tradução');
          setLocalError(error);
          onError?.(error);
        });
    }
  };

  const handlePlay = () => {
    if (player && isLoaded) {
      player.playAsync().catch(err => {
        const error = err instanceof Error ? err : new Error('Erro ao reproduzir');
        setLocalError(error);
        onError?.(error);
      });
    }
  };

  const handlePause = () => {
    if (player && isLoaded) {
      player.pause();
    }
  };

  const variantClasses = {
    default: 'vlibras-player-default',
    minimal: 'vlibras-player-minimal',
    compact: 'vlibras-player-compact'
  };

  if (error) {
    return (
      <div 
        ref={ref}
        className={`vlibras-error ${className}`} 
        style={{ width, height }}
        {...props}
      >
        <div className="error-content">
          <p>❌ {error.message}</p>
          {text && (
            <button onClick={handleTranslate} className="retry-button">
              Tentar novamente
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref || containerRef}
      className={`vlibras-player ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
      {...props}
    >
      {!isLoaded && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Carregando VLibras...</p>
        </div>
      )}
      
      {showControls && isLoaded && (
        <div className="vlibras-controls">
          {text && (
            <button 
              onClick={handleTranslate}
              disabled={isPlaying}
              className="translate-button"
            >
              📝 Traduzir
            </button>
          )}
          
          <button 
            onClick={handlePlay}
            disabled={isPlaying || !text}
            className="play-button"
          >
            ▶️ Reproduzir
          </button>
          
          {isPlaying && (
            <button 
              onClick={handlePause}
              className="pause-button"
            >
              ⏸️ Pausar
            </button>
          )}
          
          {allowReplay && !isPlaying && text && (
            <button 
              onClick={handlePlay}
              className="replay-button"
            >
              🔄 Repetir
            </button>
          )}
        </div>
      )}
    </div>
  );
});

VLibrasPlayer.displayName = 'VLibrasPlayer';
