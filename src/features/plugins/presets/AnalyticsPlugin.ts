import { IVLibrasPlugin, PluginContext } from '../interfaces/IPlugin';

/**
 * Plugin exemplo para analytics básico
 */
export class AnalyticsPlugin implements IVLibrasPlugin {
  name = 'analytics';
  version = '1.0.0';
  description = 'Coleta métricas básicas de uso do VLibras';
  
  private analytics: {
    translations: number;
    totalTime: number;
    errors: number;
    startTime: number;
  } = {
    translations: 0,
    totalTime: 0,
    errors: 0,
    startTime: Date.now()
  };

  async init(context: PluginContext): Promise<void> {
    console.log('📊 Analytics Plugin iniciado');
    
    // Resetar métricas
    this.analytics = {
      translations: 0,
      totalTime: 0,
      errors: 0,
      startTime: Date.now()
    };

    // Configurar eventos
    this.setupEventListeners(context);
  }

  private setupEventListeners(context: PluginContext): void {
    if (context.events) {
      context.events.on('translation:start', () => {
        this.analytics.translations++;
        context.utils.logger('Translation started', 'info');
      });

      context.events.on('translation:complete', (data: any) => {
        if (data?.duration) {
          this.analytics.totalTime += data.duration;
        }
        context.utils.logger('Translation completed', 'info');
      });

      context.events.on('player:error', () => {
        this.analytics.errors++;
        context.utils.logger('Error occurred', 'error');
      });
    }
  }

  async destroy(): Promise<void> {
    console.log('📊 Analytics Plugin - Relatório Final:', this.getReport());
  }

  getReport(): object {
    const sessionTime = Date.now() - this.analytics.startTime;
    
    return {
      translations: this.analytics.translations,
      totalTranslationTime: this.analytics.totalTime,
      averageTranslationTime: this.analytics.translations > 0 
        ? this.analytics.totalTime / this.analytics.translations 
        : 0,
      errors: this.analytics.errors,
      errorRate: this.analytics.translations > 0 
        ? this.analytics.errors / this.analytics.translations 
        : 0,
      sessionDuration: sessionTime,
      timestamp: new Date().toISOString()
    };
  }

  exportData(): string {
    return JSON.stringify(this.getReport(), null, 2);
  }

  hooks = {
    beforePlay: async (text: string): Promise<string> => {
      console.log(`📊 Analytics: Iniciando reprodução para texto com ${text.length} caracteres`);
      return text;
    },

    afterPlay: async (result: any): Promise<void> => {
      console.log('📊 Analytics: Reprodução concluída', result);
    },

    onError: async (error: Error): Promise<void> => {
      console.log('📊 Analytics: Erro capturado', error.message);
    }
  };
}
