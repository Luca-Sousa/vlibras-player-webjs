/**
 * @file Higher-Order Component para desabilitar SSR
 * @description HOC que envolve componentes para renderização apenas no cliente
 */

import React, { ComponentType, ReactNode } from 'react';
import { NoSSR } from './NoSSR';

export interface WithNoSSROptions {
  /** Componente ou JSX a ser exibido durante o carregamento no servidor */
  fallback?: ReactNode;
  /** Atraso em ms antes de renderizar no cliente */
  delay?: number;
  /** Nome para o componente resultante (útil para debugging) */
  displayName?: string;
}

/**
 * HOC que envolve um componente para renderização apenas no cliente
 * @param Component - Componente a ser envolvido
 * @param options - Opções de configuração
 * @returns Componente envolvido com NoSSR
 */
export function withNoSSR<P extends object>(
  Component: ComponentType<P>,
  options: WithNoSSROptions = {}
): ComponentType<P> {
  const { fallback, delay, displayName } = options;

  const WrappedComponent = (props: P) => (
    <NoSSR fallback={fallback} delay={delay}>
      <Component {...props} />
    </NoSSR>
  );

  WrappedComponent.displayName = displayName || `withNoSSR(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

/**
 * HOC específico para componentes VLibras
 * Inclui fallback padrão e configurações otimizadas
 */
export function withVLibrasNoSSR<P extends object>(
  Component: ComponentType<P>,
  customFallback?: ReactNode
): ComponentType<P> {
  const defaultFallback = (
    <div 
      className="vlibras-ssr-placeholder"
      style={{
        display: 'inline-block',
        width: '50px',
        height: '50px',
        backgroundColor: '#1976d2',
        borderRadius: '50%',
        opacity: 0.7,
        animation: 'vlibras-pulse 1.5s ease-in-out infinite alternate'
      }}
      aria-label="Carregando VLibras..."
    >
      <style>{`
        @keyframes vlibras-pulse {
          from { opacity: 0.7; }
          to { opacity: 0.3; }
        }
      `}</style>
    </div>
  );

  return withNoSSR(Component, {
    fallback: customFallback || defaultFallback,
    delay: 100, // Pequeno delay para melhor experiência
    displayName: `withVLibrasNoSSR(${Component.displayName || Component.name})`
  });
}
