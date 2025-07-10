/**
 * Interfaces para sistema de plugins
 * Interface Segregation Principle: Contratos específicos e focados
 */

export interface IVLibrasPlugin {
  name: string;
  version: string;
  description?: string;
  dependencies?: string[];
  
  init(context: PluginContext): void | Promise<void>;
  destroy?(): void | Promise<void>;
  
  hooks?: {
    beforePlay?: (text: string) => string | Promise<string>;
    afterPlay?: (result: any) => void | Promise<void>;
    onError?: (error: Error) => void | Promise<void>;
    onReady?: () => void | Promise<void>;
  };
}

export interface PluginContext {
  player: any; // VLibrasPlayer instance
  events: any; // VLibrasEventEmitter instance
  config: any; // Global config
  utils: {
    logger: (message: string, level?: string) => void;
    cache: any; // Cache instance
    themes: any; // Theme manager
  };
}
