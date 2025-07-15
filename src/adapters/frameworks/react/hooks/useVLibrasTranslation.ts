import { useState, useEffect, useCallback } from 'react';
import { useVLibras } from './useVLibras';

export interface UseVLibrasTranslationOptions {
  autoTranslate?: boolean;
  debounceMs?: number;
  onTranslationStart?: (text: string) => void;
  onTranslationComplete?: () => void;
  onTranslationError?: (error: Error) => void;
}

export interface UseVLibrasTranslationReturn {
  translate: (text: string) => Promise<void>;
  translateAndPlay: (text: string) => Promise<void>;
  isTranslating: boolean;
  error: string | null;
  lastTranslation: string | null;
  translationHistory: string[];
  clearHistory: () => void;
}

/**
 * Hook específico para gerenciar traduções de texto para Libras
 */
export function useVLibrasTranslation(
  options: UseVLibrasTranslationOptions = {}
): UseVLibrasTranslationReturn {
  const { 
    autoTranslate = false,
    debounceMs = 500,
    onTranslationStart,
    onTranslationComplete,
    onTranslationError
  } = options;

  const { player, isLoaded } = useVLibras();
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTranslation, setLastTranslation] = useState<string | null>(null);
  const [translationHistory, setTranslationHistory] = useState<string[]>([]);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const translate = useCallback(async (text: string): Promise<void> => {
    if (!player || !isLoaded || !text.trim()) {
      return;
    }

    setIsTranslating(true);
    setError(null);
    onTranslationStart?.(text);

    try {
      await player.translateAsync(text);
      setLastTranslation(text);
      setTranslationHistory(prev => {
        const updated = [text, ...prev.filter(t => t !== text)];
        return updated.slice(0, 10); // Manter apenas últimas 10 traduções
      });
      onTranslationComplete?.();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro na tradução';
      setError(errorMsg);
      onTranslationError?.(err instanceof Error ? err : new Error(errorMsg));
    } finally {
      setIsTranslating(false);
    }
  }, [player, isLoaded, onTranslationStart, onTranslationComplete, onTranslationError]);

  const translateAndPlay = useCallback(async (text: string): Promise<void> => {
    if (!player || !isLoaded || !text.trim()) {
      return;
    }

    try {
      await translate(text);
      await player.playAsync();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro na tradução e reprodução';
      setError(errorMsg);
      onTranslationError?.(err instanceof Error ? err : new Error(errorMsg));
    }
  }, [player, isLoaded, translate, onTranslationError]);

  const debouncedTranslate = useCallback(async (text: string): Promise<void> => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    return new Promise<void>((resolve) => {
      const timer = setTimeout(async () => {
        if (autoTranslate) {
          await translate(text);
        }
        resolve();
      }, debounceMs);

      setDebounceTimer(timer);
    });
  }, [translate, autoTranslate, debounceMs, debounceTimer]);

  const clearHistory = useCallback(() => {
    setTranslationHistory([]);
    setLastTranslation(null);
  }, []);

  // Cleanup do timer quando componente desmonta
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return {
    translate: autoTranslate ? debouncedTranslate : translate,
    translateAndPlay,
    isTranslating,
    error,
    lastTranslation,
    translationHistory,
    clearHistory
  };
}
