import React, { ComponentType, forwardRef, useEffect } from 'react';
import { useVLibrasAccessibility, AccessibilityOptions } from '../hooks/useVLibrasAccessibility';

export interface WithVLibrasAccessibilityProps {
  accessibilityOptions?: AccessibilityOptions;
  'data-vlibras-player'?: boolean;
}

/**
 * HOC que adiciona funcionalidades de acessibilidade a qualquer componente
 */
export function withVLibrasAccessibility<P extends object>(
  WrappedComponent: ComponentType<P>,
  defaultOptions: AccessibilityOptions = {}
) {
  const WithAccessibilityComponent = forwardRef<any, P & WithVLibrasAccessibilityProps>((props, ref) => {
    const { accessibilityOptions, ...otherProps } = props;
    
    const accessibility = useVLibrasAccessibility({
      ...defaultOptions,
      ...accessibilityOptions
    });

    // Aplicar atributos de acessibilidade
    useEffect(() => {
      const element = ref && 'current' in ref ? ref.current : null;
      if (element) {
        // Adicionar atributos ARIA
        element.setAttribute('role', 'application');
        element.setAttribute('aria-label', 'VLibras - Tradutor de Libras');
        
        if (accessibility.options.enableKeyboardNav) {
          element.setAttribute('tabindex', '0');
        }
      }
    }, [ref, accessibility.options.enableKeyboardNav]);

    // Injetar estilos de acessibilidade
    useEffect(() => {
      const style = document.createElement('style');
      style.id = 'vlibras-accessibility-styles';
      
      const css = `
        .vlibras-high-contrast {
          --vlibras-bg-color: #000;
          --vlibras-text-color: #fff;
          --vlibras-border-color: #fff;
          --vlibras-focus-color: #ff0;
        }
        
        .vlibras-reduced-motion {
          --vlibras-animation-duration: 0.01ms !important;
          --vlibras-transition-duration: 0.01ms !important;
        }
        
        .vlibras-high-contrast .vlibras-player {
          background-color: var(--vlibras-bg-color);
          color: var(--vlibras-text-color);
          border: 2px solid var(--vlibras-border-color);
        }
        
        .vlibras-reduced-motion * {
          animation-duration: var(--vlibras-animation-duration) !important;
          transition-duration: var(--vlibras-transition-duration) !important;
        }
        
        [data-vlibras-player]:focus {
          outline: 3px solid var(--vlibras-focus-color, #0066cc);
          outline-offset: 2px;
        }
        
        .vlibras-controls button {
          font-size: var(--vlibras-text-size, 1rem);
          min-height: 44px;
          min-width: 44px;
          padding: 8px 16px;
        }
        
        .vlibras-controls button:focus {
          outline: 2px solid var(--vlibras-focus-color, #0066cc);
          outline-offset: 2px;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .vlibras-player * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        @media (prefers-contrast: high) {
          .vlibras-player {
            background-color: CanvasText;
            color: Canvas;
            border: 2px solid Canvas;
          }
        }
      `;
      
      style.textContent = css;
      
      if (!document.head.querySelector('#vlibras-accessibility-styles')) {
        document.head.appendChild(style);
      }
      
      return () => {
        const existingStyle = document.head.querySelector('#vlibras-accessibility-styles');
        if (existingStyle) {
          existingStyle.remove();
        }
      };
    }, []);

    return (
      <WrappedComponent
        {...(otherProps as P)}
        ref={ref}
        data-vlibras-player={true}
        data-accessibility-enabled={accessibility.options.enableScreenReader}
        data-keyboard-nav={accessibility.options.enableKeyboardNav}
      />
    );
  });

  WithAccessibilityComponent.displayName = `withVLibrasAccessibility(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithAccessibilityComponent;
}
