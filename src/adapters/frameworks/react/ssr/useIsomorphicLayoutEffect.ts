/**
 * @file Hook isomórfico para useLayoutEffect compatível com SSR
 * @description Substitui useLayoutEffect por useEffect no servidor para evitar warnings
 */

import { useEffect, useLayoutEffect } from 'react';

/**
 * Hook que usa useLayoutEffect no cliente e useEffect no servidor
 * Evita warnings de hidratação em ambientes SSR como NextJS
 */
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' 
  ? useLayoutEffect 
  : useEffect;

/**
 * Detecta se está sendo executado no ambiente do navegador
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * Detecta se está sendo executado no servidor (SSR)
 */
export const isServer = typeof window === 'undefined';

/**
 * Safe access to window object
 */
export const safeWindow = isBrowser ? window : undefined;

/**
 * Safe access to document object
 */
export const safeDocument = isBrowser ? document : undefined;

/**
 * Safe access to navigator object
 */
export const safeNavigator = isBrowser ? navigator : undefined;
