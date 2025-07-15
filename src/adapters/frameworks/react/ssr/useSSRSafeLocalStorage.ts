/**
 * @file Hook para localStorage compatível com SSR
 * @description Fornece acesso seguro ao localStorage em ambientes SSR
 */

import { useState, useEffect } from 'react';
import { isBrowser } from './useIsomorphicLayoutEffect';

/**
 * Hook para gerenciar localStorage de forma segura em SSR
 * @param key - Chave do localStorage
 * @param initialValue - Valor inicial
 * @returns [value, setValue] similar ao useState
 */
export function useSSRSafeLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Estado inicial usando o valor padrão
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  // Carrega o valor do localStorage após hidratação
  useEffect(() => {
    if (isBrowser) {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.warn(`Erro ao ler localStorage para a chave "${key}":`, error);
      }
      setIsHydrated(true);
    }
  }, [key]);

  // Função para definir valor
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (isBrowser) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Erro ao salvar no localStorage para a chave "${key}":`, error);
    }
  };

  return [isHydrated ? storedValue : initialValue, setValue];
}
