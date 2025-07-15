/**
 * @file Utilitários específicos para NextJS
 * @description Componentes e hooks otimizados para NextJS
 */

import React, { ComponentType } from 'react';
import { NoSSR } from './NoSSR';
import { SSRSafeVLibrasProvider, SSRSafeVLibrasProviderProps } from './SSRSafeProvider';
import { withVLibrasNoSSR } from './withNoSSR';

// Importação condicional do NextJS dynamic
let nextDynamic: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  nextDynamic = require('next/dynamic');
} catch {
  // NextJS não disponível
}

/**
 * Configurações específicas para NextJS
 */
export interface NextJSVLibrasConfig extends Omit<SSRSafeVLibrasProviderProps, 'children'> {
  /** Caminho para os assets do VLibras no diretório public/ */
  publicAssetsPath?: string;
  /** Se deve usar importação dinâmica */
  useDynamicImport?: boolean;
  /** Loading component para importação dinâmica */
  loadingComponent?: React.ComponentType;
  /** Se deve desabilitar SSR completamente */
  ssr?: boolean;
}

/**
 * Provider VLibras otimizado para NextJS
 * Automaticamente configura caminhos e comportamentos específicos do NextJS
 */
export const NextJSVLibrasProvider = ({
  publicAssetsPath = '/vlibras',
  children,
  config,
  ...props
}: NextJSVLibrasConfig & { children: React.ReactNode }) => {
  const mergedConfig = {
    assetsPath: publicAssetsPath,
    ...config
  };

  return (
    <SSRSafeVLibrasProvider config={mergedConfig} {...props}>
      {children}
    </SSRSafeVLibrasProvider>
  );
};

/**
 * Hook para criar componentes VLibras dinâmicos no NextJS
 */
export function useNextJSDynamicVLibras<P extends object>(
  componentImport: () => Promise<{ default: ComponentType<P> }>,
  options: {
    loading?: ComponentType;
    ssr?: boolean;
  } = {}
) {
  if (!nextDynamic) {
    throw new Error('NextJS dynamic import não está disponível. Certifique-se de estar usando NextJS.');
  }

  return nextDynamic(componentImport, {
    ssr: options.ssr ?? false,
    loading: options.loading || (() => (
      <div className="vlibras-loading-nextjs">
        Carregando VLibras...
      </div>
    ))
  });
}

/**
 * Cria uma versão dinâmica de um componente VLibras para NextJS
 */
export function createNextJSVLibrasComponent<P extends object>(
  Component: ComponentType<P>,
  options: {
    ssr?: boolean;
    loading?: ComponentType;
    fallback?: React.ReactNode;
  } = {}
): ComponentType<P> {
  if (options.ssr === false && nextDynamic) {
    // Usa dynamic import do NextJS se disponível
    return nextDynamic(() => Promise.resolve(Component), {
      ssr: false,
      loading: options.loading || (() => (
        <div className="vlibras-loading-nextjs">
          Carregando VLibras...
        </div>
      ))
    }) as ComponentType<P>;
  }

  // Usa nosso wrapper NoSSR como fallback
  return withVLibrasNoSSR(Component, options.fallback);
}

/**
 * Utilitários para páginas NextJS
 */
export const NextJSUtils = {
  /**
   * getStaticProps helper para VLibras
   */
  getVLibrasStaticProps: () => ({
    props: {
      vlibrasConfig: {
        assetsPath: '/vlibras',
        ssr: false
      }
    }
  }),

  /**
   * getServerSideProps helper para VLibras
   */
  getVLibrasServerSideProps: () => ({
    props: {
      vlibrasConfig: {
        assetsPath: '/vlibras',
        ssr: false
      }
    }
  }),

  /**
   * Head tags para VLibras
   */
  VLibrasHeadTags: () => (
    <>
      <link rel="preload" href="/vlibras/playerweb.data.unityweb" as="fetch" crossOrigin="anonymous" />
      <link rel="preload" href="/vlibras/playerweb.wasm.code.unityweb" as="fetch" crossOrigin="anonymous" />
      <link rel="preload" href="/vlibras/playerweb.wasm.framework.unityweb" as="fetch" crossOrigin="anonymous" />
      <meta name="vlibras-ssr-safe" content="true" />
    </>
  )
};

/**
 * Componente wrapper para páginas NextJS
 */
export function NextJSPageWrapper({ 
  children, 
  vlibrasConfig 
}: { 
  children: React.ReactNode;
  vlibrasConfig?: NextJSVLibrasConfig;
}) {
  return (
    <NextJSVLibrasProvider {...vlibrasConfig}>
      <NoSSR fallback={<div>Carregando recursos de acessibilidade...</div>}>
        {children}
      </NoSSR>
    </NextJSVLibrasProvider>
  );
}

// Type helper para props de página NextJS com VLibras
export interface NextJSPageProps {
  vlibrasConfig?: NextJSVLibrasConfig;
}

/**
 * HOC para páginas NextJS com VLibras
 */
export function withNextJSVLibras<P extends object>(
  Page: ComponentType<P>,
  vlibrasConfig?: NextJSVLibrasConfig
) {
  const WrappedPage = (props: P) => (
    <NextJSPageWrapper vlibrasConfig={vlibrasConfig}>
      <Page {...props} />
    </NextJSPageWrapper>
  );

  WrappedPage.displayName = `withNextJSVLibras(${Page.displayName || Page.name})`;

  return WrappedPage;
}
