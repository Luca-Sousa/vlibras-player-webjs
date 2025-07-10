/**
 * Sistema de CSS Automático para VLibras Player
 * 
 * Resolve o problema identificado no FUNCOES-UTILITARIAS-VLIBRAS.md
 * onde o canvas do Unity não ocupa o espaço corretamente e tem bordas pretas.
 */

export interface CanvasConfig {
  fillContainer?: boolean;           // Ocupar 100% do container
  aspectRatio?: 'auto' | '16:9' | '4:3' | '1:1' | 'custom';
  scaleMode?: 'stretch' | 'cover' | 'contain' | 'none';
  removeBlackBorders?: boolean;      // scale(1.1) automático para remover bordas
  backgroundColor?: string;          // Cor de fundo personalizada
  borderRadius?: string;            // Bordas arredondadas
  customWidth?: string;             // Largura customizada
  customHeight?: string;            // Altura customizada
}

export interface ResponsiveConfig {
  enabled: boolean;
  breakpoints: {
    mobile: { maxWidth: string; config: CanvasConfig };
    tablet: { maxWidth: string; config: CanvasConfig };
    desktop: { minWidth: string; config: CanvasConfig };
  };
}

/**
 * Classe responsável por otimizar automaticamente o CSS do canvas Unity
 */
export class VLibrasCSS {
  private static injectedStyleId = 'vlibras-auto-css';
  private static cssInjected = false;

  /**
   * Injeta CSS automático para otimizar o canvas
   */
  static injectOptimizedCSS(
    containerSelector: string = '.vlibras-container',
    canvasConfig: CanvasConfig = {},
    responsive?: ResponsiveConfig
  ): void {
    if (typeof document === 'undefined') return;

    // Remove CSS anterior se existir
    VLibrasCSS.removeInjectedCSS();

    const config: CanvasConfig = {
      fillContainer: true,
      aspectRatio: 'auto' as const,
      scaleMode: 'cover' as const,
      removeBlackBorders: true,
      backgroundColor: 'transparent',
      borderRadius: '8px',
      ...canvasConfig
    };

    const css = VLibrasCSS.generateOptimizedCSS(containerSelector, config, responsive);
    
    const styleElement = document.createElement('style');
    styleElement.id = VLibrasCSS.injectedStyleId;
    styleElement.textContent = css;
    
    document.head.appendChild(styleElement);
    VLibrasCSS.cssInjected = true;

    console.log('[VLibras CSS] CSS otimizado injetado automaticamente');
  }

  /**
   * Gera o CSS otimizado com base na configuração
   */
  private static generateOptimizedCSS(
    containerSelector: string,
    config: CanvasConfig,
    responsive?: ResponsiveConfig
  ): string {
    let css = `
/* VLibras Player - CSS Automático Otimizado */
${containerSelector} {
  position: relative;
  overflow: hidden;
  ${config.borderRadius ? `border-radius: ${config.borderRadius};` : ''}
  ${config.backgroundColor ? `background-color: ${config.backgroundColor};` : ''}
  ${config.fillContainer ? 'width: 100%; height: 100%;' : ''}
}

${containerSelector} canvas {
  display: block;
  ${config.fillContainer ? 'width: 100% !important; height: 100% !important;' : ''}
  ${config.customWidth ? `width: ${config.customWidth} !important;` : ''}
  ${config.customHeight ? `height: ${config.customHeight} !important;` : ''}
  ${config.backgroundColor ? `background-color: ${config.backgroundColor};` : ''}
  ${config.borderRadius ? `border-radius: ${config.borderRadius};` : ''}
  
  /* Remove bordas pretas do Unity */
  ${config.removeBlackBorders ? 'transform: scale(1.05);' : ''}
  
  /* Modo de escala */
  object-fit: ${config.scaleMode === 'stretch' ? 'fill' : 
               config.scaleMode === 'cover' ? 'cover' :
               config.scaleMode === 'contain' ? 'contain' : 'none'};
}

/* Proporção de aspecto */
${VLibrasCSS.generateAspectRatioCSS(containerSelector, config.aspectRatio)}

/* Container para centralizar o canvas */
${containerSelector} .unity-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Loading state styling */
${containerSelector} .vlibras-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

/* Estados visuais */
${containerSelector}[data-state="loading"] {
  background: linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
              linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
              linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
              linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  animation: vlibras-loading-bg 2s linear infinite;
}

${containerSelector}[data-state="error"] {
  background-color: #fee;
  border: 2px solid #fcc;
}

${containerSelector}[data-state="ready"] {
  background-color: #efe;
  border: 2px solid #cfc;
}

@keyframes vlibras-loading-bg {
  0% { background-position: 0 0, 0 10px, 10px -10px, -10px 0px; }
  100% { background-position: 20px 20px, 20px 30px, 30px 10px, 10px 20px; }
}

/* Animações suaves */
${containerSelector} canvas {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

${containerSelector}[data-state="playing"] canvas {
  transform: scale(${config.removeBlackBorders ? '1.05' : '1'});
  opacity: 1;
}

${containerSelector}[data-state="loading"] canvas {
  opacity: 0.7;
}
`;

    // CSS responsivo
    if (responsive?.enabled) {
      css += VLibrasCSS.generateResponsiveCSS(containerSelector, responsive);
    }

    return css;
  }

  /**
   * Gera CSS para proporção de aspecto
   */
  private static generateAspectRatioCSS(containerSelector: string, aspectRatio?: string): string {
    if (!aspectRatio || aspectRatio === 'auto') return '';

    const ratios: Record<string, string> = {
      '16:9': '56.25%',  // (9/16) * 100
      '4:3': '75%',      // (3/4) * 100
      '1:1': '100%'      // (1/1) * 100
    };

    const paddingTop = ratios[aspectRatio];
    if (!paddingTop) return '';

    return `
${containerSelector}::before {
  content: '';
  display: block;
  padding-top: ${paddingTop};
}

${containerSelector} .unity-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
`;
  }

  /**
   * Gera CSS responsivo
   */
  private static generateResponsiveCSS(containerSelector: string, responsive: ResponsiveConfig): string {
    return `
/* Mobile */
@media (max-width: ${responsive.breakpoints.mobile.maxWidth}) {
  ${containerSelector} {
    ${VLibrasCSS.configToCSS(responsive.breakpoints.mobile.config)}
  }
}

/* Tablet */
@media (min-width: calc(${responsive.breakpoints.mobile.maxWidth} + 1px)) and (max-width: ${responsive.breakpoints.tablet.maxWidth}) {
  ${containerSelector} {
    ${VLibrasCSS.configToCSS(responsive.breakpoints.tablet.config)}
  }
}

/* Desktop */
@media (min-width: ${responsive.breakpoints.desktop.minWidth}) {
  ${containerSelector} {
    ${VLibrasCSS.configToCSS(responsive.breakpoints.desktop.config)}
  }
}
`;
  }

  /**
   * Converte config para propriedades CSS
   */
  private static configToCSS(config: CanvasConfig): string {
    let css = '';
    
    if (config.customWidth) css += `width: ${config.customWidth} !important; `;
    if (config.customHeight) css += `height: ${config.customHeight} !important; `;
    if (config.backgroundColor) css += `background-color: ${config.backgroundColor}; `;
    if (config.borderRadius) css += `border-radius: ${config.borderRadius}; `;
    
    return css;
  }

  /**
   * Remove o CSS injetado
   */
  static removeInjectedCSS(): void {
    if (typeof document === 'undefined') return;

    const existingStyle = document.getElementById(VLibrasCSS.injectedStyleId);
    if (existingStyle) {
      existingStyle.remove();
      VLibrasCSS.cssInjected = false;
    }
  }

  /**
   * Verifica se o CSS foi injetado
   */
  static isCSSInjected(): boolean {
    return VLibrasCSS.cssInjected;
  }

  /**
   * Aplica classe de estado ao container
   */
  static setContainerState(containerElement: HTMLElement, state: string): void {
    if (!containerElement) return;
    
    containerElement.setAttribute('data-state', state);
  }

  /**
   * Configurações responsivas padrão
   */
  static getDefaultResponsiveConfig(): ResponsiveConfig {
    return {
      enabled: true,
      breakpoints: {
        mobile: {
          maxWidth: '768px',
          config: {
            customHeight: '200px',
            removeBlackBorders: true,
            borderRadius: '4px'
          }
        },
        tablet: {
          maxWidth: '1024px', 
          config: {
            customHeight: '300px',
            removeBlackBorders: true,
            borderRadius: '6px'
          }
        },
        desktop: {
          minWidth: '1025px',
          config: {
            fillContainer: true,
            removeBlackBorders: true,
            borderRadius: '8px'
          }
        }
      }
    };
  }
}

/**
 * Função de conveniência para setup automático de CSS
 */
export function setupOptimizedCSS(
  containerSelector?: string,
  config?: CanvasConfig,
  responsive?: boolean
): void {
  const responsiveConfig = responsive ? VLibrasCSS.getDefaultResponsiveConfig() : undefined;
  VLibrasCSS.injectOptimizedCSS(containerSelector, config, responsiveConfig);
}

/**
 * Exemplo de uso:
 * 
 * // Setup básico
 * setupOptimizedCSS();
 * 
 * // Setup customizado
 * setupOptimizedCSS('.meu-container', {
 *   fillContainer: true,
 *   removeBlackBorders: true,
 *   backgroundColor: '#f5f5f5',
 *   aspectRatio: '16:9'
 * }, true);
 */
