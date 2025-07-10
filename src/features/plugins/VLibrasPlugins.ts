/**
 * Sistema de Plugins Extensível para VLibras
 * Permite extensão da funcionalidade base através de plugins
 */

import { VLibrasPlayer } from '../../core/player/VLibrasPlayer';

/**
 * Interface base para plugins VLibras
 */
export interface VLibrasPlugin {
  readonly name: string;
  readonly version: string;
  readonly description?: string;
  readonly dependencies?: string[];
  readonly category?: 'analytics' | 'accessibility' | 'ui' | 'performance' | 'integration' | 'utility';
  
  setup(player: VLibrasPlayer, config?: any): void | Promise<void>;
  teardown?(player: VLibrasPlayer): void | Promise<void>;
  
  // Hooks do ciclo de vida
  onPlayerReady?(player: VLibrasPlayer): void;
  onTranslation?(text: string, player: VLibrasPlayer): void;
  onError?(error: Error, player: VLibrasPlayer): void;
}

/**
 * Resultado da validação de plugin
 */
export interface PluginValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Informações de plugin registrado
 */
export interface RegisteredPluginInfo {
  plugin: VLibrasPlugin;
  config?: any;
  active: boolean;
  setupTime?: number;
  errorCount: number;
  lastError?: Error;
}

/**
 * Event emitter simplificado para plugins
 */
class SimpleEventEmitter {
  private events = new Map<string, Function[]>();

  emit(event: string, data: any): void {
    const listeners = this.events.get(event) || [];
    listeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error(`Erro em listener do evento ${event}:`, error);
      }
    });
  }

  on(event: string, callback: Function): void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const listeners = this.events.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }
}

/**
 * Gerenciador de plugins do VLibras
 */
export class VLibrasPluginManager {
  private static instance: VLibrasPluginManager | null = null;
  private plugins = new Map<string, RegisteredPluginInfo>();
  private eventEmitter = new SimpleEventEmitter();

  private constructor() {}

  static getInstance(): VLibrasPluginManager {
    if (!VLibrasPluginManager.instance) {
      VLibrasPluginManager.instance = new VLibrasPluginManager();
    }
    return VLibrasPluginManager.instance;
  }

  /**
   * Registra um plugin
   */
  async register(plugin: VLibrasPlugin, config?: any): Promise<void> {
    const validation = this.validatePlugin(plugin);
    
    if (!validation.valid) {
      throw new Error(`Plugin inválido: ${validation.errors.join(', ')}`);
    }

    // Verificar dependências
    await this.checkDependencies(plugin);

    const info: RegisteredPluginInfo = {
      plugin,
      config,
      active: false,
      errorCount: 0
    };

    this.plugins.set(plugin.name, info);
    
    this.eventEmitter.emit('plugin:registered', { 
      name: plugin.name, 
      version: plugin.version 
    });
    
    console.log(`✅ Plugin '${plugin.name}' registrado com sucesso`);
  }

  /**
   * Ativa um plugin para um player específico
   */
  async activate(pluginName: string, player: VLibrasPlayer): Promise<void> {
    const info = this.plugins.get(pluginName);
    
    if (!info) {
      throw new Error(`Plugin '${pluginName}' não encontrado`);
    }

    if (info.active) {
      console.warn(`Plugin '${pluginName}' já está ativo`);
      return;
    }

    try {
      const startTime = performance.now();
      
      await info.plugin.setup(player, info.config);
      
      const setupTime = performance.now() - startTime;
      info.setupTime = setupTime;
      info.active = true;

      // Registrar hooks do ciclo de vida
      if (info.plugin.onPlayerReady) {
        player.on('player:ready', () => info.plugin.onPlayerReady!(player));
      }

      if (info.plugin.onTranslation) {
        player.on('translation:start', ({ text }: any) => 
          info.plugin.onTranslation!(text, player)
        );
      }

      if (info.plugin.onError) {
        player.on('player:error', ({ error }: any) => 
          info.plugin.onError!(error, player)
        );
      }

      this.eventEmitter.emit('plugin:activated', { 
        name: pluginName, 
        setupTime 
      });
      
      console.log(`🚀 Plugin '${pluginName}' ativado (${setupTime.toFixed(2)}ms)`);
      
    } catch (error: any) {
      info.errorCount++;
      info.lastError = error;
      
      this.eventEmitter.emit('plugin:error', { 
        name: pluginName, 
        error 
      });
      
      throw new Error(`Erro ao ativar plugin '${pluginName}': ${error.message}`);
    }
  }

  /**
   * Desativa um plugin
   */
  async deactivate(pluginName: string, player: VLibrasPlayer): Promise<void> {
    const info = this.plugins.get(pluginName);
    
    if (!info) {
      throw new Error(`Plugin '${pluginName}' não encontrado`);
    }

    if (!info.active) {
      console.warn(`Plugin '${pluginName}' já está inativo`);
      return;
    }

    try {
      if (info.plugin.teardown) {
        await info.plugin.teardown(player);
      }

      info.active = false;
      
      this.eventEmitter.emit('plugin:deactivated', { name: pluginName });
      
      console.log(`🛑 Plugin '${pluginName}' desativado`);
      
    } catch (error: any) {
      info.errorCount++;
      info.lastError = error;
      
      throw new Error(`Erro ao desativar plugin '${pluginName}': ${error.message}`);
    }
  }

  /**
   * Lista plugins registrados
   */
  list(): RegisteredPluginInfo[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Lista plugins por categoria
   */
  listByCategory(category: VLibrasPlugin['category']): RegisteredPluginInfo[] {
    return this.list().filter(info => info.plugin.category === category);
  }

  /**
   * Obtém informações de um plugin específico
   */
  getPluginInfo(name: string): RegisteredPluginInfo | undefined {
    return this.plugins.get(name);
  }

  /**
   * Valida um plugin
   */
  private validatePlugin(plugin: VLibrasPlugin): PluginValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validações obrigatórias
    if (!plugin.name || plugin.name.trim() === '') {
      errors.push('Nome do plugin é obrigatório');
    }

    if (!plugin.version || plugin.version.trim() === '') {
      errors.push('Versão do plugin é obrigatória');
    }

    if (typeof plugin.setup !== 'function') {
      errors.push('Método setup é obrigatório');
    }

    // Validações de boas práticas
    if (!plugin.description) {
      warnings.push('Descrição do plugin é recomendada');
    }

    if (!plugin.category) {
      warnings.push('Categoria do plugin é recomendada');
    }

    // Verificar se já existe plugin com mesmo nome
    if (this.plugins.has(plugin.name)) {
      errors.push(`Já existe plugin com nome '${plugin.name}'`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Verifica dependências do plugin
   */
  private async checkDependencies(plugin: VLibrasPlugin): Promise<void> {
    if (!plugin.dependencies || plugin.dependencies.length === 0) {
      return;
    }

    const missingDeps: string[] = [];

    for (const dep of plugin.dependencies) {
      if (!this.plugins.has(dep)) {
        missingDeps.push(dep);
      }
    }

    if (missingDeps.length > 0) {
      throw new Error(
        `Dependências não encontradas para plugin '${plugin.name}': ${missingDeps.join(', ')}`
      );
    }
  }

  /**
   * Ativa plugins automaticamente baseado em configuração
   */
  async autoActivate(player: VLibrasPlayer, config: { enabledPlugins?: string[] } = {}): Promise<void> {
    const { enabledPlugins = [] } = config;

    for (const pluginName of enabledPlugins) {
      try {
        await this.activate(pluginName, player);
      } catch (error: any) {
        console.error(`Erro ao ativar plugin '${pluginName}':`, error.message);
      }
    }
  }

  /**
   * Obtém estatísticas dos plugins
   */
  getStats() {
    const plugins = this.list();
    
    return {
      total: plugins.length,
      active: plugins.filter(p => p.active).length,
      inactive: plugins.filter(p => !p.active).length,
      withErrors: plugins.filter(p => p.errorCount > 0).length,
      byCategory: plugins.reduce((acc, p) => {
        const cat = p.plugin.category || 'unknown';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      avgSetupTime: plugins
        .filter(p => p.setupTime)
        .reduce((sum, p, _, arr) => sum + (p.setupTime! / arr.length), 0)
    };
  }

  /**
   * Adiciona listener para eventos de plugins
   */
  on(event: string, callback: Function): void {
    this.eventEmitter.on(event, callback);
  }

  /**
   * Remove todos os plugins
   */
  clear(): void {
    this.plugins.clear();
  }
}

// Plugin pré-construídos como exemplos

/**
 * Plugin de Analytics simples
 */
export const AnalyticsPlugin: VLibrasPlugin = {
  name: 'analytics',
  version: '1.0.0',
  description: 'Plugin básico para coleta de métricas de uso',
  category: 'analytics',

  setup(player: VLibrasPlayer, config: { trackingId?: string } = {}) {
    console.log('📊 Analytics Plugin ativado', config.trackingId);
    
    player.on('translation:start', ({ text }: any) => {
      console.log('📈 Analytics: Tradução iniciada', { text: text.substring(0, 50) });
    });

    player.on('animation:complete', ({ duration }: any) => {
      console.log('📈 Analytics: Animação concluída', { duration });
    });
  },

  teardown() {
    console.log('📊 Analytics Plugin desativado');
  }
};

/**
 * Plugin de Accessibility
 */
function announceMessage(message: string) {
  // Criar elemento para leitores de tela
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.style.position = 'absolute';
  announcer.style.left = '-10000px';
  announcer.textContent = message;
  
  document.body.appendChild(announcer);
  
  setTimeout(() => {
    if (document.body.contains(announcer)) {
      document.body.removeChild(announcer);
    }
  }, 1000);
}

export const AccessibilityPlugin: VLibrasPlugin = {
  name: 'accessibility',
  version: '1.0.0',
  description: 'Plugin para melhorias de acessibilidade',
  category: 'accessibility',

  setup(player: VLibrasPlayer, config: { announceChanges?: boolean } = {}) {
    if (config.announceChanges) {
      player.on('player:ready', () => {
        announceMessage('VLibras player pronto para uso');
      });

      player.on('translation:start', ({ text }: any) => {
        announceMessage(`Iniciando tradução: ${text.substring(0, 100)}`);
      });
    }
  }
};

/**
 * Plugin de Performance Monitor
 */
export const PerformancePlugin: VLibrasPlugin = {
  name: 'performance-monitor',
  version: '1.0.0',
  description: 'Monitor de performance em tempo real',
  category: 'performance',

  setup(player: VLibrasPlayer) {
    const performanceData: any[] = [];

    player.on('translation:start', ({ timestamp }: any) => {
      performanceData.push({
        type: 'translation_start',
        timestamp,
        memoryUsage: (performance as any).memory?.usedJSHeapSize || 0
      });
    });

    player.on('animation:complete', ({ duration }: any) => {
      performanceData.push({
        type: 'animation_complete',
        duration,
        memoryUsage: (performance as any).memory?.usedJSHeapSize || 0
      });

      // Log se animação demorou muito
      if (duration > 5000) {
        console.warn('⚠️ Animação lenta detectada:', duration, 'ms');
      }
    });

    // Adicionar método para obter relatório
    (this as any).getPerformanceReport = () => {
      return {
        totalEvents: performanceData.length,
        avgMemoryUsage: performanceData.reduce((sum: number, d: any) => 
          sum + (d.memoryUsage / performanceData.length), 0
        ),
        slowAnimations: performanceData
          .filter((d: any) => d.type === 'animation_complete' && d.duration > 3000)
          .length
      };
    };
  }
};

/**
 * Instância singleton do gerenciador
 */
export const vlibrasPluginManager = VLibrasPluginManager.getInstance();

/**
 * API simplificada para uso direto
 */
export const VLibrasPlugins = {
  register: (plugin: VLibrasPlugin, config?: any) => 
    vlibrasPluginManager.register(plugin, config),
  
  activate: (name: string, player: VLibrasPlayer) => 
    vlibrasPluginManager.activate(name, player),
  
  deactivate: (name: string, player: VLibrasPlayer) => 
    vlibrasPluginManager.deactivate(name, player),
  
  list: () => vlibrasPluginManager.list(),
  
  stats: () => vlibrasPluginManager.getStats(),

  // Plugins pré-construídos
  builtIn: {
    analytics: AnalyticsPlugin,
    accessibility: AccessibilityPlugin,
    performance: PerformancePlugin
  }
};
