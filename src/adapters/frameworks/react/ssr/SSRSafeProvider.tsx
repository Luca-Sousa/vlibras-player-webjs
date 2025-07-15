/**
 * @file Provider VLibras compatível com SSR
 * @description Provider que funciona corretamente em ambientes SSR
 */

import React, { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { GlobalConfig } from '../../../../core/config/VLibrasGlobalConfig';
import { VLibrasGlobalConfig } from '../../../../core/config/VLibrasGlobalConfig';
import { useIsHydrated } from './useIsHydrated';
import { isBrowser } from './useIsomorphicLayoutEffect';

export interface SSRSafeVLibrasContextValue {
  /** Configuração atual do VLibras */
  config: GlobalConfig;
  /** Atualiza a configuração */
  updateConfig: (newConfig: Partial<GlobalConfig>) => void;
  /** Indica se o provider foi hidratado no cliente */
  isHydrated: boolean;
  /** Indica se está em ambiente de navegador */
  isBrowser: boolean;
  /** Inicializa o VLibras Player */
  initializePlayer: (containerId: string) => Promise<void>;
  /** Traduz texto para Libras */
  translateText: (text: string) => Promise<void>;
}

const SSRSafeVLibrasContext = createContext<SSRSafeVLibrasContextValue | null>(null);

export interface SSRSafeVLibrasProviderProps {
  /** Configuração inicial do VLibras */
  config?: Partial<GlobalConfig>;
  /** Componentes filhos */
  children: ReactNode;
  /** Fallback durante carregamento no servidor */
  fallback?: ReactNode;
}

/**
 * Provider VLibras que funciona corretamente com SSR
 * Evita erros de hidratação e problemas com APIs do navegador
 */
export function SSRSafeVLibrasProvider({
  config: initialConfig = {},
  children,
  fallback = null
}: SSRSafeVLibrasProviderProps): JSX.Element {
  const isHydrated = useIsHydrated();
  const [config, setConfig] = useState<GlobalConfig>(() => {
    // Durante SSR, usa configuração padrão
    if (!isBrowser) {
      return {
        assetsPath: '/vlibras',
        debug: false,
        enableStats: false,
        autoRetry: true,
        retryAttempts: 3,
        ...initialConfig
      } as GlobalConfig;
    }
    
    // No cliente, tenta obter configuração existente
    try {
      return VLibrasGlobalConfig.getConfig();
    } catch {
      return {
        assetsPath: '/vlibras',
        debug: false,
        enableStats: false,
        autoRetry: true,
        retryAttempts: 3,
        ...initialConfig
      } as GlobalConfig;
    }
  });

  // Configura VLibras após hidratação
  useEffect(() => {
    if (isHydrated && isBrowser) {
      try {
        VLibrasGlobalConfig.configure(initialConfig);
        setConfig(VLibrasGlobalConfig.getConfig());
      } catch (error) {
        console.warn('Erro ao configurar VLibras:', error);
      }
    }
  }, [isHydrated, initialConfig]);

  const updateConfig = (newConfig: Partial<GlobalConfig>) => {
    if (!isBrowser) return;
    
    try {
      VLibrasGlobalConfig.configure(newConfig);
      setConfig(VLibrasGlobalConfig.getConfig());
    } catch (error) {
      console.warn('Erro ao atualizar configuração VLibras:', error);
    }
  };

  const initializePlayer = async (containerId: string): Promise<void> => {
    if (!isBrowser || !isHydrated) {
      console.warn('VLibras Player só pode ser inicializado no cliente após hidratação');
      return;
    }

    try {
      // Aqui seria a inicialização real do player
      // Por enquanto, apenas log
      console.log('Inicializando VLibras Player no container:', containerId);
    } catch (error) {
      console.error('Erro ao inicializar VLibras Player:', error);
      throw error;
    }
  };

  const translateText = async (text: string): Promise<void> => {
    if (!isBrowser || !isHydrated) {
      console.warn('Tradução VLibras só funciona no cliente após hidratação');
      return;
    }

    try {
      // Aqui seria a tradução real
      console.log('Traduzindo texto:', text);
    } catch (error) {
      console.error('Erro ao traduzir texto:', error);
      throw error;
    }
  };

  const contextValue: SSRSafeVLibrasContextValue = {
    config,
    updateConfig,
    isHydrated,
    isBrowser,
    initializePlayer,
    translateText
  };

  // Durante SSR ou antes da hidratação, mostra fallback se fornecido
  if (!isHydrated && fallback) {
    return <>{fallback}</>;
  }

  return (
    <SSRSafeVLibrasContext.Provider value={contextValue}>
      {children}
    </SSRSafeVLibrasContext.Provider>
  );
}

/**
 * Hook para usar o contexto SSR-safe do VLibras
 */
export function useSSRSafeVLibrasContext(): SSRSafeVLibrasContextValue {
  const context = useContext(SSRSafeVLibrasContext);
  
  if (!context) {
    throw new Error('useSSRSafeVLibrasContext deve ser usado dentro de SSRSafeVLibrasProvider');
  }
  
  return context;
}
