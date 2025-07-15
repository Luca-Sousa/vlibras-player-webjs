/**
 * @file Hook VLibras compatível com SSR
 * @description Hook que combina useVLibras com verificações SSR-safe
 */

import { useVLibras, UseVLibrasOptions, UseVLibrasReturn } from '../hooks/useVLibras';
import { useIsHydrated } from './useIsHydrated';
import { isBrowser } from './useIsomorphicLayoutEffect';

export interface UseSSRSafeVLibrasReturn extends UseVLibrasReturn {
  /** Se o componente foi hidratado no cliente */
  isHydrated: boolean;
  /** Se está executando no browser */
  isBrowser: boolean;
  /** Se está pronto para usar (hidratado + browser) */
  isReady: boolean;
}

/**
 * Hook SSR-safe para VLibras que combina funcionalidades do useVLibras
 * com verificações de hidratação e ambiente browser
 * 
 * @param options - Opções do VLibras
 * @returns Estado e métodos do VLibras com informações SSR
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { player, isLoaded, isHydrated, isReady } = useSSRSafeVLibras();
 *   
 *   if (!isReady) {
 *     return <div>Carregando VLibras...</div>;
 *   }
 *   
 *   return <VLibrasPlayer />;
 * }
 * ```
 */
export function useSSRSafeVLibras(
  options?: UseVLibrasOptions
): UseSSRSafeVLibrasReturn {
  const vlibrasState = useVLibras(options);
  const isHydrated = useIsHydrated();
  
  return {
    ...vlibrasState,
    isHydrated,
    isBrowser,
    isReady: isHydrated && isBrowser && vlibrasState.isLoaded
  };
}
