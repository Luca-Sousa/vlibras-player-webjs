/**
 * Utilitários específicos para integração React
 */

import { useRef, useEffect, useState } from 'react';

/**
 * Hook para detectar mudanças no texto e automatizar traduções
 */
export function useTextWatcher(
  text: string,
  onTextChange: (text: string) => void,
  debounceMs: number = 500
) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (text && text.trim()) {
        onTextChange(text);
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, onTextChange, debounceMs]);
}

/**
 * Hook para detectar quando um elemento entra na viewport
 */
export function useIntersectionObserver(
  callback: (isIntersecting: boolean) => void,
  options: IntersectionObserverInit = {}
) {
  const targetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => callback(entry.isIntersecting),
      options
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [callback, options]);

  return targetRef;
}

/**
 * Utilitário para extrair texto de elementos React
 */
export function extractTextFromReactNode(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(extractTextFromReactNode).join(' ');
  }

  if (node && typeof node === 'object' && 'props' in node) {
    return extractTextFromReactNode((node as any).props.children);
  }

  return '';
}

/**
 * Hook para persistir configurações no localStorage
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultValue;
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setStoredValue = (newValue: T | ((val: T) => T)) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error saving to localStorage:`, error);
    }
  };

  return [value, setStoredValue] as const;
}

/**
 * Validador de texto para tradução
 */
export function validateTranslationText(text: string): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Verificações básicas
  if (!text || !text.trim()) {
    errors.push('Texto não pode estar vazio');
  }

  if (text.length > 5000) {
    errors.push('Texto muito longo (máximo 5000 caracteres)');
  }

  if (text.length < 3) {
    warnings.push('Texto muito curto pode não ser traduzido corretamente');
  }

  // Verificar caracteres especiais excessivos
  const specialCharsRatio = (text.match(/[^a-zA-ZÀ-ÿ0-9\s]/g) || []).length / text.length;
  if (specialCharsRatio > 0.3) {
    warnings.push('Muitos caracteres especiais podem afetar a tradução');
  }

  // Verificar se é apenas números
  if (/^\d+$/.test(text.trim())) {
    warnings.push('Texto contém apenas números');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Utilitário para formatação de texto para Libras
 */
export function prepareTextForLibras(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, ' ') // Normalizar espaços
    .replace(/[""]/g, '"') // Normalizar aspas
    .replace(/['']/g, "'") // Normalizar apóstrofes
    .replace(/…/g, '...') // Normalizar reticências
    .replace(/–|—/g, '-'); // Normalizar travessões
}
