/**
 * @file Hook para detectar hidratação do React
 * @description Hook que retorna true apenas após a hidratação no cliente,
 * útil para evitar mismatches de hidratação em SSR
 */

import { useEffect, useState } from 'react';

/**
 * Hook que detecta se o componente foi hidratado no cliente
 * 
 * @returns {boolean} true se o componente foi hidratado, false caso contrário
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isHydrated = useIsHydrated();
 *   
 *   if (!isHydrated) {
 *     return <div>Carregando...</div>;
 *   }
 *   
 *   return <ClientOnlyComponent />;
 * }
 * ```
 */
export function useIsHydrated(): boolean {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}
