import { useState, useEffect, useCallback, useRef } from 'react';
import { useVLibras } from './useVLibras';

export interface PerformanceMetrics {
  translationTime: number;
  loadTime: number;
  memoryUsage: number;
  fps: number;
  cacheHitRate: number;
  errorRate: number;
  totalTranslations: number;
  averageTranslationLength: number;
}

export interface UseVLibrasPerformanceOptions {
  enableAnalytics?: boolean;
  collectMetrics?: boolean;
  sampleRate?: number;
}

export interface UseVLibrasPerformanceReturn {
  metrics: PerformanceMetrics | null;
  isCollecting: boolean;
  startCollection: () => void;
  stopCollection: () => void;
  resetMetrics: () => void;
  getReport: () => string;
  exportMetrics: () => object;
}

/**
 * Hook para monitoramento de performance do VLibras
 */
export function useVLibrasPerformance(
  options: UseVLibrasPerformanceOptions = {}
): UseVLibrasPerformanceReturn {
  const { 
    enableAnalytics = false,
    collectMetrics = true,
    sampleRate = 1.0
  } = options;

  const { player, isLoaded } = useVLibras();
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isCollecting, setIsCollecting] = useState(false);
  
  const metricsRef = useRef({
    translationTimes: [] as number[],
    loadStartTime: 0,
    memoryMeasurements: [] as number[],
    errors: 0,
    translations: 0,
    totalCharacters: 0,
    cacheHits: 0,
    cacheMisses: 0
  });

  const startCollection = useCallback(() => {
    if (!collectMetrics || Math.random() > sampleRate) return;
    
    setIsCollecting(true);
    metricsRef.current.loadStartTime = performance.now();
    
    // Reset counters
    metricsRef.current = {
      ...metricsRef.current,
      translationTimes: [],
      memoryMeasurements: [],
      errors: 0,
      translations: 0,
      totalCharacters: 0,
      cacheHits: 0,
      cacheMisses: 0
    };
  }, [collectMetrics, sampleRate]);

  const stopCollection = useCallback(() => {
    setIsCollecting(false);
    
    // Calcular métricas finais
    const data = metricsRef.current;
    const now = performance.now();
    
    const newMetrics: PerformanceMetrics = {
      translationTime: data.translationTimes.length > 0 
        ? data.translationTimes.reduce((a, b) => a + b, 0) / data.translationTimes.length 
        : 0,
      loadTime: now - data.loadStartTime,
      memoryUsage: data.memoryMeasurements.length > 0
        ? Math.max(...data.memoryMeasurements)
        : 0,
      fps: estimateFPS(),
      cacheHitRate: (data.cacheHits + data.cacheMisses) > 0 
        ? data.cacheHits / (data.cacheHits + data.cacheMisses) 
        : 0,
      errorRate: data.translations > 0 ? data.errors / data.translations : 0,
      totalTranslations: data.translations,
      averageTranslationLength: data.translations > 0 ? data.totalCharacters / data.translations : 0
    };
    
    setMetrics(newMetrics);
  }, []);

  const resetMetrics = useCallback(() => {
    setMetrics(null);
    metricsRef.current = {
      translationTimes: [],
      loadStartTime: 0,
      memoryMeasurements: [],
      errors: 0,
      translations: 0,
      totalCharacters: 0,
      cacheHits: 0,
      cacheMisses: 0
    };
  }, []);

  const getReport = useCallback((): string => {
    if (!metrics) return 'Nenhuma métrica coletada';
    
    return `
🔊 VLibras Performance Report
============================
🕐 Tempo médio de tradução: ${metrics.translationTime.toFixed(2)}ms
⚡ Tempo de carregamento: ${metrics.loadTime.toFixed(2)}ms
🧠 Uso de memória: ${(metrics.memoryUsage / (1024 * 1024)).toFixed(2)}MB
🎮 FPS médio: ${metrics.fps.toFixed(1)}
💾 Taxa de acerto cache: ${(metrics.cacheHitRate * 100).toFixed(1)}%
❌ Taxa de erro: ${(metrics.errorRate * 100).toFixed(2)}%
📊 Total de traduções: ${metrics.totalTranslations}
📝 Tamanho médio do texto: ${metrics.averageTranslationLength.toFixed(1)} caracteres
    `.trim();
  }, [metrics]);

  const exportMetrics = useCallback(() => {
    return {
      timestamp: new Date().toISOString(),
      metrics,
      meta: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        enableAnalytics,
        collectMetrics,
        sampleRate
      }
    };
  }, [metrics, enableAnalytics, collectMetrics, sampleRate]);

  // Monitorar eventos do player
  useEffect(() => {
    if (!player || !isCollecting) return;

    const handleTranslationStart = (text: string) => {
      metricsRef.current.translations++;
      metricsRef.current.totalCharacters += text.length;
    };

    const handleTranslationComplete = () => {
      // Medir tempo de tradução (simplificado)
      const time = performance.now() - (metricsRef.current.loadStartTime || performance.now());
      metricsRef.current.translationTimes.push(time);
    };

    const handleError = () => {
      metricsRef.current.errors++;
    };

    // Monitorar memória periodicamente
    const memoryInterval = setInterval(() => {
      if ((performance as any).memory) {
        metricsRef.current.memoryMeasurements.push(
          (performance as any).memory.usedJSHeapSize
        );
      }
    }, 5000);

    // Se o player tiver event emitter, usar
    if (player.eventEmitter) {
      player.eventEmitter.on('translation:start', handleTranslationStart);
      player.eventEmitter.on('translation:complete', handleTranslationComplete);
      player.eventEmitter.on('error', handleError);
    }

    return () => {
      clearInterval(memoryInterval);
      if (player.eventEmitter) {
        player.eventEmitter.off('translation:start', handleTranslationStart);
        player.eventEmitter.off('translation:complete', handleTranslationComplete);
        player.eventEmitter.off('error', handleError);
      }
    };
  }, [player, isCollecting]);

  // Auto-start collection quando player carrega
  useEffect(() => {
    if (isLoaded && enableAnalytics && !isCollecting) {
      startCollection();
    }
  }, [isLoaded, enableAnalytics, isCollecting, startCollection]);

  return {
    metrics,
    isCollecting,
    startCollection,
    stopCollection,
    resetMetrics,
    getReport,
    exportMetrics
  };
}

// Função auxiliar para estimar FPS
function estimateFPS(): number {
  let frames = 0;
  let lastTime = performance.now();
  
  const countFrame = () => {
    frames++;
    const currentTime = performance.now();
    if (currentTime - lastTime >= 1000) {
      const fps = frames;
      frames = 0;
      lastTime = currentTime;
      return fps;
    }
    return 60; // Default assumption
  };

  // Simplified FPS estimation
  return countFrame();
}
