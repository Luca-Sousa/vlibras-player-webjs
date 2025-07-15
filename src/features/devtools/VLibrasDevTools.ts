/**
 * Utilitários de desenvolvimento e diagnóstico para VLibras Player
 * Fornece ferramentas para debugging, profiling e diagnósticos
 */

export interface DiagnosticResult {
  webgl: {
    supported: boolean;
    version: string;
    renderer: string;
    vendor: string;
  };
  assets: {
    available: boolean;
    size: number;
    version: string;
    loadTime: number;
  };
  performance: {
    loadTime: number;
    memoryUsage: number;
    fps: number;
  };
  compatibility: {
    browser: string;
    version: string;
    supported: boolean;
    userAgent: string;
  };
  recommendations: string[];
}

export interface PerformanceReport {
  operations: Array<{
    name: string;
    duration: number;
    timestamp: number;
    memory?: number;
  }>;
  summary: {
    totalOperations: number;
    averageDuration: number;
    slowestOperation: string;
    memoryPeak: number;
  };
}

export interface CacheInfo {
  size: number;
  entries: number;
  hitRate: number;
  missRate: number;
  storage: 'memory' | 'localStorage' | 'indexedDB';
}

export interface DebugInfo {
  version: string;
  buildTime: string;
  environment: 'development' | 'production';
  features: string[];
  configuration: Record<string, any>;
}

/**
 * Classe principal de utilitários de desenvolvimento
 */
export class VLibrasDevTools {
  private static isDebugMode = false;
  private static performanceData: Array<{ name: string; duration: number; timestamp: number; memory?: number }> = [];
  private static profilingStartTime: number | null = null;

  /**
   * Ativa o modo debug
   */
  static enableDebugMode(): void {
    this.isDebugMode = true;
    console.log('🔧 VLibras Debug Mode ativado');
    
    // Adiciona estilo CSS para debug
    this.injectDebugStyles();
    
    // Monitora performance automaticamente
    this.startAutoPerformanceMonitoring();
  }

  /**
   * Desativa o modo debug
   */
  static disableDebugMode(): void {
    this.isDebugMode = false;
    console.log('🔧 VLibras Debug Mode desativado');
  }

  /**
   * Verifica se está no modo debug
   */
  static isDebugEnabled(): boolean {
    return this.isDebugMode;
  }

  /**
   * Executa diagnósticos completos do sistema
   */
  static async runDiagnostics(): Promise<DiagnosticResult> {
    console.log('🔍 Executando diagnósticos do VLibras...');
    
    const webglInfo = this.checkWebGL();
    const assetsInfo = await this.checkAssets();
    const performanceInfo = this.checkPerformance();
    const compatibilityInfo = this.checkCompatibility();
    const recommendations = this.generateRecommendations(webglInfo, assetsInfo, performanceInfo, compatibilityInfo);

    const result: DiagnosticResult = {
      webgl: webglInfo,
      assets: assetsInfo,
      performance: performanceInfo,
      compatibility: compatibilityInfo,
      recommendations
    };

    console.log('✅ Diagnósticos concluídos:', result);
    return result;
  }

  /**
   * Inicia profiling de performance
   */
  static startProfiling(): void {
    this.performanceData = [];
    this.profilingStartTime = performance.now();
    console.log('📊 Profiling iniciado');
  }

  /**
   * Para profiling e retorna relatório
   */
  static stopProfiling(): PerformanceReport {
    if (!this.profilingStartTime) {
      throw new Error('Profiling não foi iniciado');
    }

    const report: PerformanceReport = {
      operations: [...this.performanceData],
      summary: {
        totalOperations: this.performanceData.length,
        averageDuration: this.performanceData.reduce((acc, op) => acc + op.duration, 0) / this.performanceData.length || 0,
        slowestOperation: this.performanceData.reduce((slowest, current) => 
          current.duration > slowest.duration ? current : slowest, 
          this.performanceData[0] || { name: 'none', duration: 0, timestamp: 0 }
        ).name,
        memoryPeak: Math.max(...this.performanceData.map(op => op.memory || 0))
      }
    };

    console.log('📊 Profiling concluído:', report);
    this.profilingStartTime = null;
    return report;
  }

  /**
   * Registra uma operação para profiling
   */
  static recordOperation(name: string, duration: number, memory?: number): void {
    if (this.profilingStartTime) {
      this.performanceData.push({
        name,
        duration,
        timestamp: performance.now(),
        memory
      });
    }

    if (this.isDebugMode) {
      console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
    }
  }

  /**
   * Obtém informações de debug
   */
  static getDebugInfo(): DebugInfo {
    return {
      version: '2.4.0',
      buildTime: new Date().toISOString(),
      environment: typeof process !== 'undefined' && process.env?.NODE_ENV === 'development' ? 'development' : 'production',
      features: [
        'UnityBridge',
        'VLibrasPresets',
        'VLibrasCSS',
        'VLibrasEvents',
        'VLibrasDevTools',
        'ReactHooks',
        'AccessibilitySupport',
        'PerformanceMonitoring'
      ],
      configuration: {
        debugMode: this.isDebugMode,
        profilingActive: this.profilingStartTime !== null,
        operationsRecorded: this.performanceData.length
      }
    };
  }

  /**
   * Limpa dados de cache (placeholder - implementar com sistema de cache real)
   */
  static async clearCache(): Promise<void> {
    console.log('🗑️ Limpando cache...');
    // TODO: Implementar limpeza de cache quando sistema de cache for criado
    localStorage.removeItem('vlibras-cache');
    console.log('✅ Cache limpo');
  }

  /**
   * Obtém informações do cache (placeholder)
   */
  static getCacheInfo(): CacheInfo {
    // TODO: Implementar com sistema de cache real
    return {
      size: 0,
      entries: 0,
      hitRate: 0,
      missRate: 0,
      storage: 'memory'
    };
  }

  /**
   * Verifica suporte e informações do WebGL
   */
  private static checkWebGL(): DiagnosticResult['webgl'] {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
      
      if (!gl) {
        return {
          supported: false,
          version: 'Not supported',
          renderer: 'Unknown',
          vendor: 'Unknown'
        };
      }

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      
      return {
        supported: true,
        version: gl.getParameter(gl.VERSION),
        renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown',
        vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unknown'
      };
    } catch (error) {
      return {
        supported: false,
        version: 'Error checking',
        renderer: 'Error',
        vendor: 'Error'
      };
    }
  }

  /**
   * Verifica assets do VLibras
   */
  private static async checkAssets(): Promise<DiagnosticResult['assets']> {
    const startTime = performance.now();
    
    try {
      // Simula verificação de assets - ajustar com paths reais
      const assetPaths = [
        '/target/playerweb.wasm.code.unityweb',
        '/target/playerweb.wasm.framework.unityweb',
        '/target/playerweb.data.unityweb'
      ];

      let totalSize = 0;
      let availableAssets = 0;

      for (const path of assetPaths) {
        try {
          const response = await fetch(path, { method: 'HEAD' });
          if (response.ok) {
            availableAssets++;
            const contentLength = response.headers.get('content-length');
            if (contentLength) {
              totalSize += parseInt(contentLength, 10);
            }
          }
        } catch {
          // Asset não disponível
        }
      }

      const loadTime = performance.now() - startTime;

      return {
        available: availableAssets === assetPaths.length,
        size: totalSize,
        version: '2.1.0',
        loadTime
      };
    } catch (error) {
      return {
        available: false,
        size: 0,
        version: 'Unknown',
        loadTime: performance.now() - startTime
      };
    }
  }

  /**
   * Verifica informações de performance
   */
  private static checkPerformance(): DiagnosticResult['performance'] {
    const memory = (performance as any).memory;
    
    return {
      loadTime: performance.now(),
      memoryUsage: memory ? memory.usedJSHeapSize : 0,
      fps: this.estimateFPS()
    };
  }

  /**
   * Verifica compatibilidade do browser
   */
  private static checkCompatibility(): DiagnosticResult['compatibility'] {
    const userAgent = navigator.userAgent;
    let browser = 'Unknown';
    let version = 'Unknown';
    let supported = false;

    // Detecção básica de browser
    if (userAgent.includes('Chrome')) {
      browser = 'Chrome';
      const match = userAgent.match(/Chrome\/(\d+)/);
      version = match ? match[1] : 'Unknown';
      supported = parseInt(version) >= 80;
    } else if (userAgent.includes('Firefox')) {
      browser = 'Firefox';
      const match = userAgent.match(/Firefox\/(\d+)/);
      version = match ? match[1] : 'Unknown';
      supported = parseInt(version) >= 75;
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      browser = 'Safari';
      const match = userAgent.match(/Version\/(\d+)/);
      version = match ? match[1] : 'Unknown';
      supported = parseInt(version) >= 13;
    } else if (userAgent.includes('Edge')) {
      browser = 'Edge';
      const match = userAgent.match(/Edge\/(\d+)/);
      version = match ? match[1] : 'Unknown';
      supported = parseInt(version) >= 79;
    }

    return {
      browser,
      version,
      supported,
      userAgent
    };
  }

  /**
   * Gera recomendações baseadas nos diagnósticos
   */
  private static generateRecommendations(
    webgl: DiagnosticResult['webgl'],
    assets: DiagnosticResult['assets'],
    performance: DiagnosticResult['performance'],
    compatibility: DiagnosticResult['compatibility']
  ): string[] {
    const recommendations: string[] = [];

    if (!webgl.supported) {
      recommendations.push('WebGL não é suportado. Considere usar um browser mais recente ou habilitar aceleração de hardware.');
    }

    if (!assets.available) {
      recommendations.push('Assets do VLibras não estão disponíveis. Verifique se os arquivos estão no caminho correto.');
    }

    if (assets.loadTime > 3000) {
      recommendations.push('Tempo de carregamento de assets está alto. Considere usar CDN ou otimizar assets.');
    }

    if (performance.memoryUsage > 100 * 1024 * 1024) {
      recommendations.push('Uso de memória está alto. Considere otimizar o código ou limpar cache.');
    }

    if (performance.fps < 30) {
      recommendations.push('FPS está baixo. Verifique a performance do dispositivo.');
    }

    if (!compatibility.supported) {
      recommendations.push(`Browser ${compatibility.browser} ${compatibility.version} pode não ser totalmente compatível. Atualize para uma versão mais recente.`);
    }

    if (recommendations.length === 0) {
      recommendations.push('Sistema está funcionando corretamente! 🎉');
    }

    return recommendations;
  }

  /**
   * Estima FPS (simplificado)
   */
  private static estimateFPS(): number {
    // Implementação simplificada - em produção usar requestAnimationFrame
    return 60;
  }

  /**
   * Injeta estilos CSS para debug
   */
  private static injectDebugStyles(): void {
    const style = document.createElement('style');
    style.id = 'vlibras-debug-styles';
    style.textContent = `
      .vlibras-debug-overlay {
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px;
        border-radius: 5px;
        font-family: monospace;
        font-size: 12px;
        z-index: 9999;
        max-width: 300px;
      }
      
      .vlibras-debug-item {
        margin: 2px 0;
      }
      
      .vlibras-debug-warning {
        color: #ff9800;
      }
      
      .vlibras-debug-error {
        color: #f44336;
      }
      
      .vlibras-debug-success {
        color: #4caf50;
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Inicia monitoramento automático de performance
   */
  private static startAutoPerformanceMonitoring(): void {
    if (this.isDebugMode) {
      setInterval(() => {
        const memory = (performance as any).memory;
        if (memory && memory.usedJSHeapSize > 50 * 1024 * 1024) {
          console.warn('⚠️ Alto uso de memória detectado:', memory.usedJSHeapSize / (1024 * 1024), 'MB');
        }
      }, 5000);
    }
  }
}

/**
 * Decorador para medir performance automaticamente
 */
export function measurePerformance(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;
  
  descriptor.value = function (...args: any[]) {
    const startTime = performance.now();
    const startMemory = (performance as any).memory?.usedJSHeapSize || 0;
    
    const result = method.apply(this, args);
    
    const endTime = performance.now();
    const endMemory = (performance as any).memory?.usedJSHeapSize || 0;
    const duration = endTime - startTime;
    const memoryDelta = endMemory - startMemory;
    
    VLibrasDevTools.recordOperation(
      `${target.constructor.name}.${propertyName}`,
      duration,
      memoryDelta
    );
    
    return result;
  };
  
  return descriptor;
}

/**
 * Utilitários de logging estruturado
 */
export class VLibrasLogger {
  private static logs: Array<{ level: string; message: string; timestamp: number; data?: any }> = [];

  static debug(message: string, data?: any): void {
    this.log('DEBUG', message, data);
  }

  static info(message: string, data?: any): void {
    this.log('INFO', message, data);
  }

  static warn(message: string, data?: any): void {
    this.log('WARN', message, data);
  }

  static error(message: string, data?: any): void {
    this.log('ERROR', message, data);
  }

  private static log(level: string, message: string, data?: any): void {
    const logEntry = {
      level,
      message,
      timestamp: Date.now(),
      data
    };

    this.logs.push(logEntry);

    if (VLibrasDevTools.isDebugEnabled()) {
      const style = this.getLogStyle(level);
      console.log(`%c[VLibras ${level}]%c ${message}`, style, '', data);
    }

    // Manter apenas os últimos 1000 logs
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
    }
  }

  private static getLogStyle(level: string): string {
    switch (level) {
      case 'DEBUG':
        return 'color: #2196f3; font-weight: bold;';
      case 'INFO':
        return 'color: #4caf50; font-weight: bold;';
      case 'WARN':
        return 'color: #ff9800; font-weight: bold;';
      case 'ERROR':
        return 'color: #f44336; font-weight: bold;';
      default:
        return 'font-weight: bold;';
    }
  }

  static getLogs(): Array<{ level: string; message: string; timestamp: number; data?: any }> {
    return [...this.logs];
  }

  static clearLogs(): void {
    this.logs = [];
  }
}

// Auto-ativar debug mode em desenvolvimento
if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
  VLibrasDevTools.enableDebugMode();
}
