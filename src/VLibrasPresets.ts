/**
 * Sistema de Presets para VLibras Player
 * 
 * Implementa a funcionalidade sugerida no FUNCOES-UTILITARIAS-VLIBRAS.md
 * para configurações prontas para diferentes casos de uso.
 */

import { PlayerConfig } from './types';

/**
 * Configurações específicas para diferentes casos de uso
 */
export interface PresetConfig extends PlayerConfig {
  // Configurações de UI
  autoPlay?: boolean;
  showControls?: boolean;
  showProgress?: boolean;
  showWordBadge?: boolean;
  allowReplay?: boolean;
  hideText?: boolean;
  allowSkip?: boolean;
  showSubtitles?: boolean;
  minimalUI?: boolean;
  autoScale?: boolean;
  showQualitySelector?: boolean;
  
  // Configurações de tamanho
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  
  // Callbacks específicos
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  onStateChange?: (state: string) => void;
  
  // Configurações avançadas
  enableKeyboardShortcuts?: boolean;
  enableAnalytics?: boolean;
  cacheEnabled?: boolean;
}

/**
 * Presets prontos para diferentes casos de uso
 */
export class VLibrasPresets {
  /**
   * Preset para dicionários e catálogos de palavras
   * - Não reproduz automaticamente
   * - Mostra controles para o usuário
   * - Permite repetir a animação
   * - Exibe badge com a palavra
   */
  static readonly dictionary: PresetConfig = {
    autoPlay: false,
    showControls: true,
    showProgress: true,
    showWordBadge: true,
    allowReplay: true,
    hideText: false,
    size: 'medium',
    enableKeyboardShortcuts: true,
    cacheEnabled: true,
    onComplete: () => {
      console.log('[VLibras] Tradução do dicionário concluída');
    }
  };

  /**
   * Preset para jogos e quizzes
   * - Reproduz automaticamente
   * - Esconde controles para não atrapalhar o jogo
   * - Pode esconder o texto (modo adivinhação)
   * - Callback quando termina para continuar o jogo
   */
  static readonly quiz: PresetConfig = {
    autoPlay: true,
    showControls: false,
    showProgress: false,
    hideText: true,
    allowReplay: false,
    size: 'medium',
    minimalUI: true,
    enableAnalytics: true,
    onComplete: () => {
      console.log('[VLibras] Quiz - tradução concluída, aguardando resposta');
    }
  };

  /**
   * Preset para tutoriais e cursos
   * - Reproduz automaticamente
   * - Mostra progresso para o usuário acompanhar
   * - Permite pular se necessário
   * - Mostra legendas para reforçar o aprendizado
   */
  static readonly tutorial: PresetConfig = {
    autoPlay: true,
    showControls: true,
    showProgress: true,
    allowSkip: true,
    showSubtitles: true,
    size: 'large',
    enableKeyboardShortcuts: true,
    cacheEnabled: true,
    onProgress: (progress: number) => {
      console.log(`[VLibras] Tutorial - progresso: ${progress}%`);
    }
  };

  /**
   * Preset para widgets e componentes compactos
   * - Interface mínima para economizar espaço
   * - Apenas controles essenciais
   * - Tamanho pequeno
   */
  static readonly compact: PresetConfig = {
    autoPlay: false,
    showControls: true,
    showProgress: false,
    size: 'small',
    minimalUI: true,
    showWordBadge: false,
    allowReplay: true,
    enableKeyboardShortcuts: false
  };

  /**
   * Preset para apresentações em tela cheia
   * - Tamanho grande para boa visualização
   * - Auto-escala conforme o container
   * - Seletor de qualidade disponível
   * - Controles completos
   */
  static readonly presentation: PresetConfig = {
    autoPlay: true,
    showControls: true,
    showProgress: true,
    size: 'fullscreen',
    autoScale: true,
    showQualitySelector: true,
    allowReplay: true,
    enableKeyboardShortcuts: true,
    showSubtitles: true
  };

  /**
   * Preset para acessibilidade máxima
   * - Todas as opções de acessibilidade habilitadas
   * - Navegação por teclado completa
   * - Anúncios de estado para leitores de tela
   * - Alto contraste disponível
   */
  static readonly accessibility: PresetConfig = {
    autoPlay: false,
    showControls: true,
    showProgress: true,
    showSubtitles: true,
    enableKeyboardShortcuts: true,
    size: 'large',
    allowReplay: true,
    onStateChange: (state: string) => {
      // Anunciar mudanças de estado para leitores de tela
      console.log(`[VLibras] Estado alterado para: ${state}`);
    }
  };

  /**
   * Preset para desenvolvimento e debug
   * - Logs detalhados habilitados
   * - Analytics para acompanhar performance
   * - Controles completos para testes
   */
  static readonly debug: PresetConfig = {
    autoPlay: false,
    showControls: true,
    showProgress: true,
    enableAnalytics: true,
    enableKeyboardShortcuts: true,
    size: 'medium',
    onStateChange: (state: string) => {
      console.log(`[VLibras Debug] Estado: ${state} - ${new Date().toISOString()}`);
    },
    onProgress: (progress: number) => {
      console.log(`[VLibras Debug] Progresso: ${progress}%`);
    },
    onComplete: () => {
      console.log('[VLibras Debug] Tradução concluída');
    }
  };

  /**
   * Combina um preset base com configurações customizadas
   */
  static combine(preset: PresetConfig, overrides: Partial<PresetConfig>): PresetConfig {
    return {
      ...preset,
      ...overrides
    };
  }

  /**
   * Lista todos os presets disponíveis
   */
  static getAvailablePresets(): string[] {
    return [
      'dictionary',
      'quiz', 
      'tutorial',
      'compact',
      'presentation',
      'accessibility',
      'debug'
    ];
  }

  /**
   * Obtém um preset por nome
   */
  static getPreset(name: string): PresetConfig | null {
    const presets: Record<string, PresetConfig> = {
      dictionary: VLibrasPresets.dictionary,
      quiz: VLibrasPresets.quiz,
      tutorial: VLibrasPresets.tutorial,
      compact: VLibrasPresets.compact,
      presentation: VLibrasPresets.presentation,
      accessibility: VLibrasPresets.accessibility,
      debug: VLibrasPresets.debug
    };

    return presets[name] || null;
  }

  /**
   * Cria um preset customizado baseado em um caso de uso
   */
  static createCustom(basePreset: string, customizations: Partial<PresetConfig>): PresetConfig | null {
    const base = VLibrasPresets.getPreset(basePreset);
    if (!base) {
      console.warn(`[VLibras] Preset '${basePreset}' não encontrado`);
      return null;
    }

    return VLibrasPresets.combine(base, customizations);
  }
}

/**
 * Função helper para usar presets de forma mais simples
 */
export function usePreset(presetName: string, customizations?: Partial<PresetConfig>): PresetConfig | null {
  if (customizations) {
    return VLibrasPresets.createCustom(presetName, customizations);
  }
  return VLibrasPresets.getPreset(presetName);
}

/**
 * Exemplo de uso dos presets:
 * 
 * // Uso básico
 * const player = new VLibrasPlayer(VLibrasPresets.quiz);
 * 
 * // Com customizações
 * const customQuiz = VLibrasPresets.combine(VLibrasPresets.quiz, {
 *   size: 'large',
 *   showProgress: true
 * });
 * 
 * // Usando helper function
 * const dictConfig = usePreset('dictionary', { autoPlay: true });
 */
