/**
 * @file Componente NoSSR para renderização apenas no cliente
 * @description Impede que componentes sejam renderizados no servidor
 */

import React, { ReactNode, useState, useEffect } from 'react';

export interface NoSSRProps {
  /** Conteúdo a ser renderizado apenas no cliente */
  children: ReactNode;
  /** Componente ou JSX a ser exibido durante o carregamento no servidor */
  fallback?: ReactNode;
  /** Atraso em ms antes de renderizar no cliente */
  delay?: number;
}

/**
 * Componente que renderiza children apenas no cliente (após hidratação)
 * Útil para componentes que dependem de APIs do navegador
 */
export function NoSSR({ children, fallback = null, delay = 0 }: NoSSRProps): JSX.Element {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setIsMounted(true), delay);
      return () => clearTimeout(timer);
    } else {
      setIsMounted(true);
      return undefined;
    }
  }, [delay]);

  if (!isMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Hook para verificar se o componente está montado no cliente
 */
export function useIsMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}
