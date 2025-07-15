/**
 * Plugins de exemplo para demonstrar as capacidades do sistema
 */

export { AnalyticsPlugin } from './AnalyticsPlugin';
export { AccessibilityNotifierPlugin } from './AccessibilityNotifierPlugin';

// Função utilitária para registrar todos os plugins de exemplo
export function registerExamplePlugins(pluginRegistry: any): void {
  const analyticsPlugin = new (require('./AnalyticsPlugin').AnalyticsPlugin)();
  const accessibilityPlugin = new (require('./AccessibilityNotifierPlugin').AccessibilityNotifierPlugin)();

  pluginRegistry.register(analyticsPlugin);
  pluginRegistry.register(accessibilityPlugin);

  console.log('📦 Plugins de exemplo registrados:', [
    analyticsPlugin.name,
    accessibilityPlugin.name
  ]);
}
