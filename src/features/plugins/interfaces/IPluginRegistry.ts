/**
 * Interface específica para registro de plugins
 * Interface Segregation Principle: Contrato focado apenas no registro
 */

import type { IVLibrasPlugin } from './IPlugin';

export interface IPluginRegistry {
  register(plugin: IVLibrasPlugin): void;
  unregister(name: string): void;
  get(name: string): IVLibrasPlugin | undefined;
  getAll(): IVLibrasPlugin[];
  isRegistered(name: string): boolean;
  enable(name: string): void;
  disable(name: string): void;
  isEnabled(name: string): boolean;
}
