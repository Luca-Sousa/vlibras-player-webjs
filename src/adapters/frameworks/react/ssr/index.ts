/**
 * @file Utilitários para Server-Side Rendering (SSR) - NextJS, Remix, etc.
 * @description Fornece ferramentas para garantir compatibilidade com ambientes SSR
 */

// Hooks e utilitários TypeScript
export * from './useIsomorphicLayoutEffect';
export * from './useSSRSafeLocalStorage';
export * from './useIsHydrated';
export * from './useSSRSafeVLibras';

// Componentes React (TSX)
export * from './SSRSafeProvider';
export * from './NoSSR';
export * from './withNoSSR';
export * from './NextJSCompatibility';
