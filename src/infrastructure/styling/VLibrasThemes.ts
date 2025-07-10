/**
 * Sistema de Temas Integrado para VLibras
 * Permite personalização visual completa da interface
 */

import { VLibrasGlobalConfig } from '../../core/config/VLibrasGlobalConfig';

/**
 * Interface para definição de tema
 */
export interface VLibrasTheme {
  name: string;
  displayName: string;
  description?: string;
  
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    text: string;
    textSecondary: string;
    border: string;
    shadow: string;
  };
  
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      bold: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  
  shadows: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  
  animation: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
    easing: {
      ease: string;
      easeIn: string;
      easeOut: string;
      easeInOut: string;
    };
  };
  
  // Configurações específicas do VLibras
  vlibras: {
    playerBackground: string;
    controlsBackground: string;
    progressBarColor: string;
    loadingSpinnerColor: string;
    errorColor: string;
    successColor: string;
  };
}

/**
 * Tema claro padrão
 */
export const lightTheme: VLibrasTheme = {
  name: 'light',
  displayName: 'Claro',
  description: 'Tema claro padrão com alta legibilidade',
  
  colors: {
    primary: '#2563eb',
    secondary: '#64748b',
    background: '#ffffff',
    surface: '#f8fafc',
    error: '#dc2626',
    success: '#16a34a',
    warning: '#d97706',
    info: '#0284c7',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    shadow: 'rgba(0, 0, 0, 0.1)'
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  },
  
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem'
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      bold: 700
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75
    }
  },
  
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    full: '9999px'
  },
  
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  },
  
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms'
    },
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out'
    }
  },
  
  vlibras: {
    playerBackground: '#ffffff',
    controlsBackground: '#f8fafc',
    progressBarColor: '#2563eb',
    loadingSpinnerColor: '#2563eb',
    errorColor: '#dc2626',
    successColor: '#16a34a'
  }
};

/**
 * Tema escuro
 */
export const darkTheme: VLibrasTheme = {
  ...lightTheme,
  name: 'dark',
  displayName: 'Escuro',
  description: 'Tema escuro para reduzir fadiga visual',
  
  colors: {
    primary: '#3b82f6',
    secondary: '#94a3b8',
    background: '#0f172a',
    surface: '#1e293b',
    error: '#ef4444',
    success: '#22c55e',
    warning: '#f59e0b',
    info: '#06b6d4',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    border: '#334155',
    shadow: 'rgba(0, 0, 0, 0.25)'
  },
  
  vlibras: {
    playerBackground: '#1e293b',
    controlsBackground: '#0f172a',
    progressBarColor: '#3b82f6',
    loadingSpinnerColor: '#3b82f6',
    errorColor: '#ef4444',
    successColor: '#22c55e'
  }
};

/**
 * Tema de alto contraste
 */
export const highContrastTheme: VLibrasTheme = {
  ...lightTheme,
  name: 'high-contrast',
  displayName: 'Alto Contraste',
  description: 'Tema com alto contraste para acessibilidade',
  
  colors: {
    primary: '#000000',
    secondary: '#333333',
    background: '#ffffff',
    surface: '#f0f0f0',
    error: '#cc0000',
    success: '#008800',
    warning: '#ff8800',
    info: '#0066cc',
    text: '#000000',
    textSecondary: '#333333',
    border: '#000000',
    shadow: 'rgba(0, 0, 0, 0.5)'
  },
  
  vlibras: {
    playerBackground: '#ffffff',
    controlsBackground: '#f0f0f0',
    progressBarColor: '#000000',
    loadingSpinnerColor: '#000000',
    errorColor: '#cc0000',
    successColor: '#008800'
  }
};

/**
 * Tema compacto para espaços reduzidos
 */
export const compactTheme: VLibrasTheme = {
  ...lightTheme,
  name: 'compact',
  displayName: 'Compacto',
  description: 'Tema otimizado para espaços reduzidos',
  
  spacing: {
    xs: '0.125rem',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem'
  },
  
  typography: {
    ...lightTheme.typography,
    fontSize: {
      xs: '0.625rem',
      sm: '0.75rem',
      md: '0.875rem',
      lg: '1rem',
      xl: '1.125rem'
    }
  },
  
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.25rem',
    lg: '0.375rem',
    full: '9999px'
  }
};

/**
 * Gerenciador de temas do VLibras
 */
export class VLibrasThemeManager {
  private static instance: VLibrasThemeManager | null = null;
  private themes = new Map<string, VLibrasTheme>();
  private currentTheme: VLibrasTheme = lightTheme;
  private styleElement: HTMLStyleElement | null = null;

  private constructor() {
    // Registrar temas padrão
    this.registerTheme(lightTheme);
    this.registerTheme(darkTheme);
    this.registerTheme(highContrastTheme);
    this.registerTheme(compactTheme);
    
    // Auto-detectar preferência do sistema
    this.detectSystemPreference();
  }

  static getInstance(): VLibrasThemeManager {
    if (!VLibrasThemeManager.instance) {
      VLibrasThemeManager.instance = new VLibrasThemeManager();
    }
    return VLibrasThemeManager.instance;
  }

  /**
   * Registra um novo tema
   */
  registerTheme(theme: VLibrasTheme): void {
    this.themes.set(theme.name, theme);
    console.log(`🎨 Tema '${theme.displayName}' registrado`);
  }

  /**
   * Lista todos os temas disponíveis
   */
  getAvailableThemes(): VLibrasTheme[] {
    return Array.from(this.themes.values());
  }

  /**
   * Obtém um tema por nome
   */
  getTheme(name: string): VLibrasTheme | undefined {
    return this.themes.get(name);
  }

  /**
   * Obtém o tema atual
   */
  getCurrentTheme(): VLibrasTheme {
    return this.currentTheme;
  }

  /**
   * Aplica um tema
   */
  applyTheme(themeName: string): void {
    const theme = this.themes.get(themeName);
    
    if (!theme) {
      console.error(`Tema '${themeName}' não encontrado`);
      return;
    }

    this.currentTheme = theme;
    this.injectCSS(theme);
    
    // Salvar preferência
    if (['light', 'dark', 'high-contrast', 'auto'].includes(themeName)) {
      VLibrasGlobalConfig.configure({ theme: themeName as any });
    }
    localStorage.setItem('vlibras-theme', themeName);
    
    // Emitir evento
    document.dispatchEvent(new CustomEvent('vlibras:theme-changed', {
      detail: { theme }
    }));
    
    console.log(`🎨 Tema '${theme.displayName}' aplicado`);
  }

  /**
   * Auto-detecta preferência do sistema
   */
  private detectSystemPreference(): void {
    // Verificar se estamos em ambiente browser
    if (typeof window === 'undefined' || !window.matchMedia) {
      // Em ambiente servidor/Node.js, usar tema light como padrão
      return;
    }

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.applyTheme('dark');
    } else {
      this.applyTheme('light');
    }

    // Detectar preferência de alto contraste
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      this.applyTheme('high-contrast');
    }
    
    // Detectar preferência reduzida de movimento
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.updateAnimations(false);
    }

    // Escutar mudanças nas preferências
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (e.matches) {
        this.applyTheme('dark');
      } else {
        this.applyTheme('light');
      }
    });
  }

  /**
   * Injeta CSS do tema no documento
   */
  private injectCSS(theme: VLibrasTheme): void {
    // Remover estilo anterior
    if (this.styleElement) {
      this.styleElement.remove();
    }

    // Criar novo elemento de estilo
    this.styleElement = document.createElement('style');
    this.styleElement.id = 'vlibras-theme';
    
    const css = this.generateCSS(theme);
    this.styleElement.textContent = css;
    
    document.head.appendChild(this.styleElement);
  }

  /**
   * Gera CSS a partir do tema
   */
  private generateCSS(theme: VLibrasTheme): string {
    return `
      :root {
        /* Cores */
        --vlibras-primary: ${theme.colors.primary};
        --vlibras-secondary: ${theme.colors.secondary};
        --vlibras-background: ${theme.colors.background};
        --vlibras-surface: ${theme.colors.surface};
        --vlibras-error: ${theme.colors.error};
        --vlibras-success: ${theme.colors.success};
        --vlibras-warning: ${theme.colors.warning};
        --vlibras-info: ${theme.colors.info};
        --vlibras-text: ${theme.colors.text};
        --vlibras-text-secondary: ${theme.colors.textSecondary};
        --vlibras-border: ${theme.colors.border};
        --vlibras-shadow: ${theme.colors.shadow};
        
        /* Espaçamentos */
        --vlibras-spacing-xs: ${theme.spacing.xs};
        --vlibras-spacing-sm: ${theme.spacing.sm};
        --vlibras-spacing-md: ${theme.spacing.md};
        --vlibras-spacing-lg: ${theme.spacing.lg};
        --vlibras-spacing-xl: ${theme.spacing.xl};
        
        /* Tipografia */
        --vlibras-font-family: ${theme.typography.fontFamily};
        --vlibras-font-size-xs: ${theme.typography.fontSize.xs};
        --vlibras-font-size-sm: ${theme.typography.fontSize.sm};
        --vlibras-font-size-md: ${theme.typography.fontSize.md};
        --vlibras-font-size-lg: ${theme.typography.fontSize.lg};
        --vlibras-font-size-xl: ${theme.typography.fontSize.xl};
        
        /* Border radius */
        --vlibras-radius-none: ${theme.borderRadius.none};
        --vlibras-radius-sm: ${theme.borderRadius.sm};
        --vlibras-radius-md: ${theme.borderRadius.md};
        --vlibras-radius-lg: ${theme.borderRadius.lg};
        --vlibras-radius-full: ${theme.borderRadius.full};
        
        /* Sombras */
        --vlibras-shadow-none: ${theme.shadows.none};
        --vlibras-shadow-sm: ${theme.shadows.sm};
        --vlibras-shadow-md: ${theme.shadows.md};
        --vlibras-shadow-lg: ${theme.shadows.lg};
        --vlibras-shadow-xl: ${theme.shadows.xl};
        
        /* Animações */
        --vlibras-duration-fast: ${theme.animation.duration.fast};
        --vlibras-duration-normal: ${theme.animation.duration.normal};
        --vlibras-duration-slow: ${theme.animation.duration.slow};
        
        /* VLibras específico */
        --vlibras-player-bg: ${theme.vlibras.playerBackground};
        --vlibras-controls-bg: ${theme.vlibras.controlsBackground};
        --vlibras-progress-color: ${theme.vlibras.progressBarColor};
        --vlibras-loading-color: ${theme.vlibras.loadingSpinnerColor};
        --vlibras-error-color: ${theme.vlibras.errorColor};
        --vlibras-success-color: ${theme.vlibras.successColor};
      }

      .vlibras-player {
        font-family: var(--vlibras-font-family);
        background-color: var(--vlibras-player-bg);
        color: var(--vlibras-text);
        border: 1px solid var(--vlibras-border);
        border-radius: var(--vlibras-radius-md);
        box-shadow: var(--vlibras-shadow-md);
      }

      .vlibras-controls {
        background-color: var(--vlibras-controls-bg);
        border-top: 1px solid var(--vlibras-border);
        padding: var(--vlibras-spacing-sm);
        border-radius: 0 0 var(--vlibras-radius-md) var(--vlibras-radius-md);
      }

      .vlibras-button {
        background-color: var(--vlibras-primary);
        color: white;
        border: none;
        padding: var(--vlibras-spacing-sm) var(--vlibras-spacing-md);
        border-radius: var(--vlibras-radius-sm);
        font-size: var(--vlibras-font-size-sm);
        cursor: pointer;
        transition: background-color var(--vlibras-duration-normal);
      }

      .vlibras-button:hover {
        background-color: color-mix(in srgb, var(--vlibras-primary) 80%, black);
      }

      .vlibras-button:disabled {
        background-color: var(--vlibras-secondary);
        cursor: not-allowed;
        opacity: 0.6;
      }

      .vlibras-progress {
        width: 100%;
        height: 4px;
        background-color: var(--vlibras-border);
        border-radius: var(--vlibras-radius-full);
        overflow: hidden;
      }

      .vlibras-progress-bar {
        height: 100%;
        background-color: var(--vlibras-progress-color);
        transition: width var(--vlibras-duration-normal);
      }

      .vlibras-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--vlibras-loading-color);
        padding: var(--vlibras-spacing-lg);
      }

      .vlibras-error {
        color: var(--vlibras-error-color);
        background-color: color-mix(in srgb, var(--vlibras-error-color) 10%, transparent);
        border: 1px solid var(--vlibras-error-color);
        border-radius: var(--vlibras-radius-sm);
        padding: var(--vlibras-spacing-md);
      }

      .vlibras-success {
        color: var(--vlibras-success-color);
        background-color: color-mix(in srgb, var(--vlibras-success-color) 10%, transparent);
        border: 1px solid var(--vlibras-success-color);
        border-radius: var(--vlibras-radius-sm);
        padding: var(--vlibras-spacing-md);
      }

      @media (prefers-reduced-motion: reduce) {
        .vlibras-player * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
  }

  /**
   * Atualiza configurações de animação
   */
  private updateAnimations(enabled: boolean): void {
    document.documentElement.style.setProperty(
      '--vlibras-animations-enabled',
      enabled ? '1' : '0'
    );
  }

  /**
   * Cria um tema personalizado
   */
  createCustomTheme(baseTheme: string, customizations: Partial<VLibrasTheme>): VLibrasTheme {
    const base = this.themes.get(baseTheme);
    
    if (!base) {
      throw new Error(`Tema base '${baseTheme}' não encontrado`);
    }

    const customTheme: VLibrasTheme = {
      ...base,
      ...customizations,
      name: customizations.name || `custom-${Date.now()}`,
      colors: { ...base.colors, ...customizations.colors },
      spacing: { ...base.spacing, ...customizations.spacing },
      typography: { 
        ...base.typography, 
        ...customizations.typography,
        fontSize: { ...base.typography.fontSize, ...customizations.typography?.fontSize }
      },
      vlibras: { ...base.vlibras, ...customizations.vlibras }
    };

    this.registerTheme(customTheme);
    return customTheme;
  }

  /**
   * Remove um tema customizado
   */
  removeTheme(themeName: string): void {
    if (['light', 'dark', 'high-contrast', 'compact'].includes(themeName)) {
      console.warn('Não é possível remover temas padrão');
      return;
    }

    this.themes.delete(themeName);
    console.log(`🗑️ Tema '${themeName}' removido`);
  }
}

/**
 * Instância singleton do gerenciador de temas
 */
export const vlibrasThemeManager = VLibrasThemeManager.getInstance();

/**
 * API simplificada para uso direto
 */
export const VLibrasThemes = {
  apply: (themeName: string) => vlibrasThemeManager.applyTheme(themeName),
  
  get current() { return vlibrasThemeManager.getCurrentTheme(); },
  
  get available() { return vlibrasThemeManager.getAvailableThemes(); },
  
  register: (theme: VLibrasTheme) => vlibrasThemeManager.registerTheme(theme),
  
  createCustom: (baseTheme: string, customizations: Partial<VLibrasTheme>) => 
    vlibrasThemeManager.createCustomTheme(baseTheme, customizations),
  
  // Temas pré-definidos
  light: lightTheme,
  dark: darkTheme,
  highContrast: highContrastTheme,
  compact: compactTheme
};
