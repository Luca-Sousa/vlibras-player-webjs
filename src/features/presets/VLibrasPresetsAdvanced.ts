/**
 * Presets prontos para casos de uso comuns do VLibras Player
 * Simplifica a configuração para diferentes cenários
 */

import { VLibrasPlayerConfig } from '../../types/core.types';

export interface PresetConfig extends VLibrasPlayerConfig {
  // Configurações específicas do preset
  name?: string;
  description?: string;
  
  // UI/UX
  autoPlay?: boolean;
  showControls?: boolean;
  showWordBadge?: boolean;
  allowReplay?: boolean;
  hideText?: boolean;
  showProgress?: boolean;
  allowSkip?: boolean;
  showSubtitles?: boolean;
  
  // Layout
  size?: 'small' | 'medium' | 'large';
  minimalUI?: boolean;
  showEssentialControlsOnly?: boolean;
  autoScale?: boolean;
  showQualitySelector?: boolean;
  
  // Callbacks específicos
  onComplete?: () => void;
  onSkip?: () => void;
  onReplay?: () => void;
}

/**
 * Presets prontos para diferentes cenários de uso
 */
export class VLibrasPresets {
  /**
   * Preset para dicionários e catálogos de palavras
   * - Não reproduz automaticamente
   * - Mostra controles para o usuário
   * - Permite repetir a animação
   * - Mostra badge com a palavra
   */
  static get dictionary(): PresetConfig {
    return {
      name: 'dictionary',
      description: 'Configuração otimizada para dicionários e catálogos',
      autoPlay: false,
      showControls: true,
      showWordBadge: true,
      allowReplay: true,
      showSubtitles: true,
      size: 'medium',
      targetPath: '/assets/vlibras',
      onLoad: () => {
        console.log('🔖 VLibras Dicionário carregado e pronto');
      }
    };
  }

  /**
   * Preset para jogos e quizzes
   * - Reproduz automaticamente
   * - Esconde controles
   * - Esconde texto (modo quiz)
   * - Callback quando termina
   */
  static get quiz(): PresetConfig {
    return {
      name: 'quiz',
      description: 'Configuração otimizada para jogos e quizzes',
      autoPlay: true,
      showControls: false,
      hideText: true,
      allowReplay: false,
      showSubtitles: false,
      size: 'medium',
      targetPath: '/assets/vlibras',
      onComplete: () => {
        console.log('🎯 Quiz: Animação concluída');
      },
      onLoad: () => {
        console.log('🎮 VLibras Quiz carregado e pronto');
      }
    };
  }

  /**
   * Preset para tutoriais e cursos
   * - Reproduz automaticamente
   * - Mostra progresso
   * - Permite pular
   * - Mostra legendas
   */
  static get tutorial(): PresetConfig {
    return {
      name: 'tutorial',
      description: 'Configuração otimizada para tutoriais e cursos',
      autoPlay: true,
      showProgress: true,
      allowSkip: true,
      showSubtitles: true,
      showControls: true,
      size: 'large',
      targetPath: '/assets/vlibras',
      onSkip: () => {
        console.log('⏭️ Tutorial: Conteúdo pulado');
      },
      onLoad: () => {
        console.log('📚 VLibras Tutorial carregado e pronto');
      }
    };
  }

  /**
   * Preset para widgets compactos
   * - Interface mínima
   * - Tamanho pequeno
   * - Controles essenciais apenas
   */
  static get compact(): PresetConfig {
    return {
      name: 'compact',
      description: 'Configuração compacta para widgets e espaços pequenos',
      size: 'small',
      minimalUI: true,
      showEssentialControlsOnly: true,
      autoPlay: false,
      showControls: true,
      showWordBadge: false,
      targetPath: '/assets/vlibras',
      onLoad: () => {
        console.log('📦 VLibras Compact carregado e pronto');
      }
    };
  }

  /**
   * Preset para apresentações em tela cheia
   * - Tamanho grande
   * - Auto-escala
   * - Seletor de qualidade
   * - Interface completa
   */
  static get presentation(): PresetConfig {
    return {
      name: 'presentation',
      description: 'Configuração para apresentações em tela cheia',
      size: 'large',
      autoScale: true,
      showQualitySelector: true,
      showControls: true,
      showProgress: true,
      autoPlay: true,
      showSubtitles: true,
      targetPath: '/assets/vlibras',
      onLoad: () => {
        console.log('🎥 VLibras Presentation carregado e pronto');
      }
    };
  }

  /**
   * Preset para acessibilidade máxima
   * - Todas as funcionalidades de acessibilidade ativadas
   * - Navegação por teclado
   * - Alto contraste
   * - Anúncios para screen readers
   */
  static get accessibility(): PresetConfig {
    return {
      name: 'accessibility',
      description: 'Configuração com máxima acessibilidade',
      showControls: true,
      showSubtitles: true,
      showProgress: true,
      allowReplay: true,
      size: 'large',
      targetPath: '/assets/vlibras',
      onLoad: () => {
        console.log('♿ VLibras Accessibility carregado e pronto');
      }
    };
  }

  /**
   * Preset para desenvolvimento e debug
   * - Logs detalhados
   * - Controles completos
   * - Informações de debug
   */
  static get development(): PresetConfig {
    return {
      name: 'development',
      description: 'Configuração para desenvolvimento e debug',
      showControls: true,
      showSubtitles: true,
      showProgress: true,
      allowReplay: true,
      showWordBadge: true,
      size: 'large',
      targetPath: '/assets/vlibras',
      onLoad: () => {
        console.log('🔧 VLibras Development carregado e pronto');
        console.log('Debug mode ativo - todas as funcionalidades disponíveis');
      }
    };
  }

  /**
   * Aplica um preset ao player
   */
  static apply(presetName: keyof typeof VLibrasPresets, customConfig?: Partial<PresetConfig>): PresetConfig {
    const preset = this[presetName] as PresetConfig;
    
    if (!preset) {
      throw new Error(`Preset '${presetName}' não encontrado`);
    }

    // Merge com configurações customizadas
    const finalConfig = {
      ...preset,
      ...customConfig
    };

    console.log(`✅ Preset '${preset.name}' aplicado:`, preset.description);
    
    return finalConfig;
  }

  /**
   * Lista todos os presets disponíveis
   */
  static list(): Array<{ name: string; description: string }> {
    return [
      { name: 'dictionary', description: this.dictionary.description || '' },
      { name: 'quiz', description: this.quiz.description || '' },
      { name: 'tutorial', description: this.tutorial.description || '' },
      { name: 'compact', description: this.compact.description || '' },
      { name: 'presentation', description: this.presentation.description || '' },
      { name: 'accessibility', description: this.accessibility.description || '' },
      { name: 'development', description: this.development.description || '' }
    ];
  }

  /**
   * Cria um preset customizado baseado em um existente
   */
  static createCustom(basePreset: keyof typeof VLibrasPresets, customConfig: Partial<PresetConfig>): PresetConfig {
    const base = this[basePreset] as PresetConfig;
    
    if (!base) {
      throw new Error(`Preset base '${basePreset}' não encontrado`);
    }

    return {
      ...base,
      ...customConfig,
      name: customConfig.name || `custom-${basePreset}`,
      description: customConfig.description || `Preset customizado baseado em ${basePreset}`
    };
  }
}

/**
 * Função utilitária para usar presets de forma simples
 */
export function usePreset(presetName: keyof typeof VLibrasPresets, customConfig?: Partial<PresetConfig>): PresetConfig {
  return VLibrasPresets.apply(presetName, customConfig);
}

/**
 * Hook para React (se estiver sendo usado)
 */
export function useVLibrasPreset(presetName: keyof typeof VLibrasPresets, customConfig?: Partial<PresetConfig>) {
  const config = usePreset(presetName, customConfig);
  
  return {
    config,
    preset: VLibrasPresets[presetName] as PresetConfig,
    availablePresets: VLibrasPresets.list()
  };
}
