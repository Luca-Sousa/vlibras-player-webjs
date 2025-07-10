/**
 * VLibras Player WebJS - Estrutura SOLID
 * Exportações principais organizadas por responsabilidade
 */
// === CORE (Núcleo do Sistema) ===
// Player principal
export { VLibrasPlayer } from './core/player/VLibrasPlayer';
export { PlayerManagerAdapter } from './core/player/PlayerManagerAdapter';
// Integração Unity
export { GlosaTranslator } from './core/unity/GlosaTranslator';
export { UnityBridge, setupUnityBridge, isUnityBridgeReady } from './core/unity/UnityBridge';
// Configuração global
export { config } from './core/config/config';
export { VLibrasGlobalConfig } from './core/config/VLibrasGlobalConfig';
// === INFRASTRUCTURE (Serviços de Infraestrutura) ===
// Sistema de eventos
export * from './infrastructure/events/VLibrasEvents';
// Sistema de cache
export * from './infrastructure/cache/VLibrasCache';
// Sistema de estilos e temas
export { VLibrasCSS, setupOptimizedCSS } from './infrastructure/styling/VLibrasCSS';
export * from './infrastructure/styling/VLibrasThemes';
// Sistema de canvas
export * from './infrastructure/canvas/VLibrasCanvasConfig';
// === FEATURES (Funcionalidades Específicas) ===
// Sistema de presets
export { VLibrasPresets, usePreset } from './features/presets/VLibrasPresets';
export * from './features/presets/VLibrasPresetsAdvanced';
// Sistema de plugins
export * from './features/plugins/VLibrasPlugins';
// Ferramentas de desenvolvimento
export * from './features/devtools/VLibrasDevTools';
// === ADAPTERS (Integrações Externas) ===
// Utilitários de teste
export * from './adapters/testing/VLibrasTestUtils';
// === TYPES (Tipos Centralizados) ===
// export * from './types';
// === LEGACY COMPATIBILITY (Compatibilidade com versão anterior) ===
export var PlayerStatus;
(function (PlayerStatus) {
    PlayerStatus["IDLE"] = "idle";
    PlayerStatus["INITIALIZING"] = "initializing";
    PlayerStatus["LOADING_ASSETS"] = "loading_assets";
    PlayerStatus["READY"] = "ready";
    PlayerStatus["TRANSLATING"] = "translating";
    PlayerStatus["PLAYING"] = "playing";
    PlayerStatus["PAUSED"] = "paused";
    PlayerStatus["COMPLETED"] = "completed";
    PlayerStatus["ERROR"] = "error"; // Erro ocorrido
})(PlayerStatus || (PlayerStatus = {}));
/**
 * Mensagens padrão em português
 */
export const DEFAULT_STATE_MESSAGES = {
    [PlayerStatus.IDLE]: 'Aguardando...',
    [PlayerStatus.INITIALIZING]: 'Inicializando player...',
    [PlayerStatus.LOADING_ASSETS]: 'Carregando assets...',
    [PlayerStatus.READY]: 'Pronto para usar!',
    [PlayerStatus.TRANSLATING]: 'Traduzindo texto...',
    [PlayerStatus.PLAYING]: 'Reproduzindo em Libras',
    [PlayerStatus.PAUSED]: 'Pausado',
    [PlayerStatus.COMPLETED]: 'Tradução concluída!',
    [PlayerStatus.ERROR]: 'Erro ocorrido'
};
//# sourceMappingURL=index.js.map