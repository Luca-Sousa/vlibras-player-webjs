/**
 * Sistema avançado de configuração de Canvas para VLibras Player
 * Resolve problemas de layout, aspectRatio e otimização visual
 */

export interface CanvasConfig {
  fillContainer?: boolean;
  aspectRatio?: 'auto' | '16:9' | '4:3' | '1:1' | '3:2' | '21:9' | '9:16';
  scaleMode?: 'stretch' | 'cover' | 'contain' | 'fill';
  removeBlackBorders?: boolean;
  backgroundColor?: string;
  borderRadius?: string;
  maxWidth?: string;
  maxHeight?: string;
  minWidth?: string;
  minHeight?: string;
  responsive?: boolean;
  quality?: 'low' | 'medium' | 'high' | 'ultra';
  enableAntialiasing?: boolean;
  enableHardwareAcceleration?: boolean;
}

export interface ResponsiveBreakpoints {
  mobile: CanvasConfig;
  tablet: CanvasConfig;
  desktop: CanvasConfig;
  ultrawide?: CanvasConfig;
}

/**
 * Classe principal para configuração avançada de Canvas
 */
export class VLibrasCanvasConfig {
  private static defaultConfig: CanvasConfig = {
    fillContainer: true,
    aspectRatio: 'auto',
    scaleMode: 'contain',
    removeBlackBorders: true,
    backgroundColor: 'transparent',
    responsive: true,
    quality: 'medium',
    enableAntialiasing: true,
    enableHardwareAcceleration: true
  };

  private static appliedConfigs = new Map<string, CanvasConfig>();

  /**
   * Aplica configuração de canvas a um elemento
   */
  static applyCanvasConfig(canvasElement: HTMLCanvasElement, config: CanvasConfig): void {
    const finalConfig = { ...this.defaultConfig, ...config };
    const containerId = canvasElement.parentElement?.id || 'unknown';
    
    this.appliedConfigs.set(containerId, finalConfig);

    // Aplicar configurações básicas
    this.applyBasicStyles(canvasElement, finalConfig);
    
    // Aplicar aspect ratio
    this.applyAspectRatio(canvasElement, finalConfig);
    
    // Aplicar scale mode
    this.applyScaleMode(canvasElement, finalConfig);
    
    // Configurações de qualidade
    this.applyQualitySettings(canvasElement, finalConfig);
    
    // Responsividade
    if (finalConfig.responsive) {
      this.setupResponsive(canvasElement, finalConfig);
    }

    console.log(`🎨 Canvas configurado com:`, finalConfig);
  }

  /**
   * Aplica estilos básicos ao canvas
   */
  private static applyBasicStyles(canvas: HTMLCanvasElement, config: CanvasConfig): void {
    const style = canvas.style;

    if (config.fillContainer) {
      style.width = '100%';
      style.height = '100%';
    }

    if (config.backgroundColor) {
      style.backgroundColor = config.backgroundColor;
    }

    if (config.borderRadius) {
      style.borderRadius = config.borderRadius;
    }

    if (config.maxWidth) style.maxWidth = config.maxWidth;
    if (config.maxHeight) style.maxHeight = config.maxHeight;
    if (config.minWidth) style.minWidth = config.minWidth;
    if (config.minHeight) style.minHeight = config.minHeight;

    // Remove bordas pretas se solicitado
    if (config.removeBlackBorders) {
      style.transform = 'scale(1.05)';
      style.overflow = 'hidden';
    }

    // Sempre aplicar estilo básico
    style.display = 'block';
    style.objectFit = config.scaleMode || 'contain';
  }

  /**
   * Aplica aspect ratio ao canvas
   */
  private static applyAspectRatio(canvas: HTMLCanvasElement, config: CanvasConfig): void {
    if (config.aspectRatio === 'auto') return;

    const container = canvas.parentElement;
    if (!container) return;

    const ratios: Record<string, number> = {
      '16:9': 16/9,
      '4:3': 4/3,
      '1:1': 1,
      '3:2': 3/2,
      '21:9': 21/9,
      '9:16': 9/16
    };

    const ratio = config.aspectRatio ? ratios[config.aspectRatio] : null;
    if (!ratio) return;

    // Criar wrapper para aspect ratio se não existir
    let aspectWrapper = container.querySelector('.vlibras-aspect-wrapper') as HTMLElement;
    
    if (!aspectWrapper) {
      aspectWrapper = document.createElement('div');
      aspectWrapper.className = 'vlibras-aspect-wrapper';
      aspectWrapper.style.cssText = `
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: ${(1/ratio) * 100}%;
        overflow: hidden;
      `;

      // Move canvas para dentro do wrapper
      container.insertBefore(aspectWrapper, canvas);
      aspectWrapper.appendChild(canvas);
    }

    // Configurar canvas para preencher wrapper
    canvas.style.cssText += `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    `;
  }

  /**
   * Aplica modo de escala
   */
  private static applyScaleMode(canvas: HTMLCanvasElement, config: CanvasConfig): void {
    const scaleStyles: Record<string, string> = {
      stretch: 'fill',
      cover: 'cover',
      contain: 'contain',
      fill: 'fill'
    };

    const objectFit = scaleStyles[config.scaleMode || 'contain'];
    if (objectFit) {
      canvas.style.objectFit = objectFit;
    }
  }

  /**
   * Aplica configurações de qualidade
   */
  private static applyQualitySettings(canvas: HTMLCanvasElement, config: CanvasConfig): void {
    const context = canvas.getContext('webgl') || canvas.getContext('webgl2');
    
    if (context && config.enableAntialiasing) {
      // Configurações de antialiasing via CSS
      canvas.style.imageRendering = config.quality === 'high' || config.quality === 'ultra' 
        ? 'crisp-edges' 
        : 'auto';
    }

    // Hardware acceleration
    if (config.enableHardwareAcceleration) {
      canvas.style.willChange = 'transform';
      canvas.style.backfaceVisibility = 'hidden';
    }

    // Qualidade específica
    const qualitySettings = {
      low: { filter: 'none' },
      medium: { filter: 'none' },
      high: { filter: 'contrast(1.1) brightness(1.05)' },
      ultra: { filter: 'contrast(1.15) brightness(1.1) saturate(1.05)' }
    };

    const settings = qualitySettings[config.quality || 'medium'];
    if (settings.filter) {
      canvas.style.filter = settings.filter;
    }
  }

  /**
   * Configura responsividade
   */
  private static setupResponsive(canvas: HTMLCanvasElement, config: CanvasConfig): void {
    const handleResize = () => {
      // Recalcular configurações baseado no tamanho da tela
      const width = window.innerWidth;
      let responsiveConfig = { ...config };

      if (width <= 768) {
        // Mobile
        responsiveConfig = {
          ...responsiveConfig,
          scaleMode: 'cover',
          removeBlackBorders: true,
          quality: 'medium'
        };
      } else if (width <= 1024) {
        // Tablet
        responsiveConfig = {
          ...responsiveConfig,
          quality: 'medium'
        };
      } else {
        // Desktop
        responsiveConfig = {
          ...responsiveConfig,
          quality: config.quality || 'high'
        };
      }

      this.applyBasicStyles(canvas, responsiveConfig);
    };

    // Setup inicial
    handleResize();

    // Listen para mudanças de tamanho
    window.addEventListener('resize', handleResize);
    
    // Observer para mudanças no container
    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(() => {
        handleResize();
      });

      if (canvas.parentElement) {
        resizeObserver.observe(canvas.parentElement);
      }
    }
  }

  /**
   * Configurações predefinidas para casos comuns
   */
  static presets = {
    /**
     * Configuração para dicionários - layout limpo e claro
     */
    dictionary: {
      fillContainer: true,
      aspectRatio: '4:3' as const,
      scaleMode: 'contain' as const,
      removeBlackBorders: true,
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      responsive: true,
      quality: 'high' as const
    },

    /**
     * Configuração para quiz - foco na animação
     */
    quiz: {
      fillContainer: true,
      aspectRatio: '16:9' as const,
      scaleMode: 'cover' as const,
      removeBlackBorders: true,
      backgroundColor: 'transparent',
      responsive: true,
      quality: 'medium' as const
    },

    /**
     * Configuração compacta para widgets
     */
    compact: {
      fillContainer: true,
      aspectRatio: '1:1' as const,
      scaleMode: 'cover' as const,
      removeBlackBorders: true,
      backgroundColor: 'transparent',
      maxWidth: '200px',
      maxHeight: '200px',
      quality: 'medium' as const
    },

    /**
     * Configuração para apresentações
     */
    presentation: {
      fillContainer: true,
      aspectRatio: '16:9' as const,
      scaleMode: 'contain' as const,
      removeBlackBorders: false,
      backgroundColor: '#000000',
      responsive: true,
      quality: 'ultra' as const,
      enableHardwareAcceleration: true
    },

    /**
     * Configuração para mobile
     */
    mobile: {
      fillContainer: true,
      aspectRatio: '9:16' as const,
      scaleMode: 'cover' as const,
      removeBlackBorders: true,
      backgroundColor: 'transparent',
      responsive: true,
      quality: 'medium' as const
    }
  } satisfies Record<string, CanvasConfig>;

  /**
   * Aplica um preset
   */
  static applyPreset(canvas: HTMLCanvasElement, presetName: keyof typeof VLibrasCanvasConfig.presets): void {
    const preset = this.presets[presetName];
    if (!preset) {
      throw new Error(`Preset '${presetName}' não encontrado`);
    }

    this.applyCanvasConfig(canvas, preset);
    console.log(`✅ Preset '${presetName}' aplicado ao canvas`);
  }

  /**
   * Auto-detecta e aplica a melhor configuração baseada no contexto
   */
  static autoDetectAndApply(canvas: HTMLCanvasElement): void {
    const container = canvas.parentElement;
    if (!container) return;

    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const aspectRatio = containerWidth / containerHeight;

    let autoConfig: CanvasConfig = { ...this.defaultConfig };

    // Detectar contexto baseado no tamanho
    if (containerWidth < 300 || containerHeight < 200) {
      autoConfig = this.presets.compact;
    } else if (aspectRatio > 1.5) {
      autoConfig = this.presets.presentation;
    } else if (aspectRatio < 0.8) {
      autoConfig = this.presets.mobile;
    } else {
      autoConfig = this.presets.dictionary;
    }

    this.applyCanvasConfig(canvas, autoConfig);
    console.log(`🔍 Auto-detectado e aplicado configuração baseada no contexto:`, autoConfig);
  }

  /**
   * Injeta CSS global para otimizações
   */
  static injectGlobalCSS(): void {
    if (typeof document === 'undefined') return;

    const existingStyle = document.getElementById('vlibras-canvas-config');
    if (existingStyle) return;

    const style = document.createElement('style');
    style.id = 'vlibras-canvas-config';
    style.textContent = `
      .vlibras-canvas-container {
        position: relative;
        overflow: hidden;
      }
      
      .vlibras-aspect-wrapper {
        position: relative;
        width: 100%;
        overflow: hidden;
      }
      
      .vlibras-canvas-optimized {
        image-rendering: optimizeSpeed;
        image-rendering: -moz-crisp-edges;
        image-rendering: -webkit-optimize-contrast;
        image-rendering: optimize-contrast;
        image-rendering: pixelated;
        ms-interpolation-mode: nearest-neighbor;
      }
      
      @media (max-width: 768px) {
        .vlibras-canvas-container {
          width: 100%;
          height: auto;
        }
      }
      
      @media (prefers-reduced-motion: reduce) {
        .vlibras-canvas-container canvas {
          animation: none !important;
          transition: none !important;
        }
      }
    `;

    document.head.appendChild(style);
    console.log('🎨 CSS global do VLibras Canvas Config injetado');
  }

  /**
   * Remove configuração aplicada
   */
  static removeConfig(containerId: string): void {
    this.appliedConfigs.delete(containerId);
  }

  /**
   * Obtém configuração aplicada
   */
  static getAppliedConfig(containerId: string): CanvasConfig | undefined {
    return this.appliedConfigs.get(containerId);
  }
}

/**
 * Auto-injeta CSS quando importado
 */
if (typeof document !== 'undefined') {
  VLibrasCanvasConfig.injectGlobalCSS();
}
