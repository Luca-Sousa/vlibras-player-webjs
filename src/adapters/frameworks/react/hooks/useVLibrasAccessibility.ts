import { useState, useEffect, useCallback, useRef } from 'react';
import { useVLibras } from './useVLibras';

export interface AccessibilityOptions {
  enableScreenReader?: boolean;
  announceTranslations?: boolean;
  enableKeyboardNav?: boolean;
  enableReducedMotion?: boolean;
  enableHighContrast?: boolean;
  textSize?: 'small' | 'medium' | 'large' | 'x-large';
  language?: 'pt-BR' | 'en' | 'es';
}

export interface UseVLibrasAccessibilityReturn {
  options: AccessibilityOptions;
  updateOptions: (newOptions: Partial<AccessibilityOptions>) => void;
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  isReducedMotion: boolean;
  isHighContrast: boolean;
  focusPlayer: () => void;
  getKeyboardShortcuts: () => Record<string, string>;
}

/**
 * Hook para funcionalidades de acessibilidade do VLibras
 */
export function useVLibrasAccessibility(
  initialOptions: AccessibilityOptions = {}
): UseVLibrasAccessibilityReturn {
  const defaultOptions: AccessibilityOptions = {
    enableScreenReader: true,
    announceTranslations: true,
    enableKeyboardNav: true,
    enableReducedMotion: false,
    enableHighContrast: false,
    textSize: 'medium',
    language: 'pt-BR'
  };

  const { player, isLoaded, isPlaying } = useVLibras();
  const [options, setOptions] = useState<AccessibilityOptions>({
    ...defaultOptions,
    ...initialOptions
  });

  const announceRef = useRef<HTMLDivElement | null>(null);

  // Detectar preferências do sistema
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);

  // Detectar preferências de movimento reduzido
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
      setOptions(prev => ({ ...prev, enableReducedMotion: e.matches }));
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Detectar preferências de alto contraste
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setIsHighContrast(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches);
      setOptions(prev => ({ ...prev, enableHighContrast: e.matches }));
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Criar região de anúncios para leitores de tela
  useEffect(() => {
    if (!options.enableScreenReader) return;

    let announceDiv = document.getElementById('vlibras-announcements') as HTMLDivElement;
    
    if (!announceDiv) {
      announceDiv = document.createElement('div');
      announceDiv.id = 'vlibras-announcements';
      announceDiv.setAttribute('aria-live', 'polite');
      announceDiv.setAttribute('aria-atomic', 'true');
      announceDiv.style.position = 'absolute';
      announceDiv.style.left = '-10000px';
      announceDiv.style.width = '1px';
      announceDiv.style.height = '1px';
      announceDiv.style.overflow = 'hidden';
      document.body.appendChild(announceDiv);
    }
    
    announceRef.current = announceDiv;

    return () => {
      if (announceDiv && announceDiv.parentNode) {
        announceDiv.parentNode.removeChild(announceDiv);
      }
    };
  }, [options.enableScreenReader]);

  const updateOptions = useCallback((newOptions: Partial<AccessibilityOptions>) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
  }, []);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!options.enableScreenReader || !announceRef.current) return;

    announceRef.current.setAttribute('aria-live', priority);
    announceRef.current.textContent = message;

    // Limpar depois de um tempo para permitir novos anúncios
    setTimeout(() => {
      if (announceRef.current) {
        announceRef.current.textContent = '';
      }
    }, 1000);
  }, [options.enableScreenReader]);

  const focusPlayer = useCallback(() => {
    const playerElement = document.querySelector('[data-vlibras-player]') as HTMLElement;
    if (playerElement && playerElement.focus) {
      playerElement.focus();
    }
  }, []);

  const getKeyboardShortcuts = useCallback(() => {
    return {
      'Space': 'Pausar/Continuar reprodução',
      'Enter': 'Traduzir texto selecionado',
      'Escape': 'Parar reprodução',
      'r': 'Repetir última tradução',
      'f': 'Focar no player',
      '+/-': 'Aumentar/Diminuir velocidade',
      '1-4': 'Alterar tamanho do player'
    };
  }, []);

  // Configurar atalhos de teclado
  useEffect(() => {
    if (!options.enableKeyboardNav) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      // Evitar conflitos quando usuário está digitando
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case ' ':
          event.preventDefault();
          if (isPlaying) {
            player?.pause();
            announce('Reprodução pausada');
          } else {
            player?.play();
            announce('Reprodução iniciada');
          }
          break;

        case 'enter':
          event.preventDefault();
          const selectedText = window.getSelection()?.toString();
          if (selectedText && player) {
            player.translateAsync(selectedText);
            announce(`Traduzindo: ${selectedText}`);
          }
          break;

        case 'escape':
          event.preventDefault();
          player?.stop();
          announce('Reprodução parada');
          break;

        case 'r':
          if (event.ctrlKey || event.metaKey) return; // Evitar conflito com refresh
          event.preventDefault();
          player?.play();
          announce('Repetindo última tradução');
          break;

        case 'f':
          if (event.ctrlKey || event.metaKey) return; // Evitar conflito com busca
          event.preventDefault();
          focusPlayer();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [options.enableKeyboardNav, isPlaying, player, announce, focusPlayer]);

  // Anunciar mudanças de estado
  useEffect(() => {
    if (!options.announceTranslations) return;

    if (isLoaded) {
      announce('VLibras carregado e pronto para uso');
    }
  }, [isLoaded, options.announceTranslations, announce]);

  useEffect(() => {
    if (!options.announceTranslations) return;

    if (isPlaying) {
      announce('Reproduzindo tradução em Libras');
    }
  }, [isPlaying, options.announceTranslations, announce]);

  // Aplicar estilos de acessibilidade
  useEffect(() => {
    const root = document.documentElement;
    
    // Tamanho do texto
    const textSizeMap = {
      'small': '0.875rem',
      'medium': '1rem', 
      'large': '1.125rem',
      'x-large': '1.25rem'
    };
    
    root.style.setProperty('--vlibras-text-size', textSizeMap[options.textSize || 'medium']);
    
    // Alto contraste
    if (options.enableHighContrast) {
      root.classList.add('vlibras-high-contrast');
    } else {
      root.classList.remove('vlibras-high-contrast');
    }
    
    // Movimento reduzido
    if (options.enableReducedMotion) {
      root.classList.add('vlibras-reduced-motion');
    } else {
      root.classList.remove('vlibras-reduced-motion');
    }
  }, [options.textSize, options.enableHighContrast, options.enableReducedMotion]);

  return {
    options,
    updateOptions,
    announce,
    isReducedMotion,
    isHighContrast,
    focusPlayer,
    getKeyboardShortcuts
  };
}
