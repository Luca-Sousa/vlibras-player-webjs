"use strict";
/**
 * VLibras Player WebJS - Estrutura SOLID
 * Exportações principais organizadas por responsabilidade
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_STATE_MESSAGES = exports.PlayerStatus = exports.useVLibrasPreset = exports.usePreset = exports.VLibrasPresets = exports.setupOptimizedCSS = exports.VLibrasCSS = exports.VLibrasGlobalConfig = exports.config = exports.isUnityBridgeReady = exports.setupUnityBridge = exports.UnityBridge = exports.GlosaTranslator = exports.PlayerManagerAdapter = exports.VLibrasPlayer = void 0;
// === CORE (Núcleo do Sistema) ===
// Player principal
var VLibrasPlayer_1 = require("./core/player/VLibrasPlayer");
Object.defineProperty(exports, "VLibrasPlayer", { enumerable: true, get: function () { return VLibrasPlayer_1.VLibrasPlayer; } });
var PlayerManagerAdapter_1 = require("./core/player/PlayerManagerAdapter");
Object.defineProperty(exports, "PlayerManagerAdapter", { enumerable: true, get: function () { return PlayerManagerAdapter_1.PlayerManagerAdapter; } });
// Integração Unity
var GlosaTranslator_1 = require("./core/unity/GlosaTranslator");
Object.defineProperty(exports, "GlosaTranslator", { enumerable: true, get: function () { return GlosaTranslator_1.GlosaTranslator; } });
var UnityBridge_1 = require("./core/unity/UnityBridge");
Object.defineProperty(exports, "UnityBridge", { enumerable: true, get: function () { return UnityBridge_1.UnityBridge; } });
Object.defineProperty(exports, "setupUnityBridge", { enumerable: true, get: function () { return UnityBridge_1.setupUnityBridge; } });
Object.defineProperty(exports, "isUnityBridgeReady", { enumerable: true, get: function () { return UnityBridge_1.isUnityBridgeReady; } });
// Configuração global
var config_1 = require("./core/config/config");
Object.defineProperty(exports, "config", { enumerable: true, get: function () { return config_1.config; } });
var VLibrasGlobalConfig_1 = require("./core/config/VLibrasGlobalConfig");
Object.defineProperty(exports, "VLibrasGlobalConfig", { enumerable: true, get: function () { return VLibrasGlobalConfig_1.VLibrasGlobalConfig; } });
// === INFRASTRUCTURE (Serviços de Infraestrutura) ===
// Sistema de eventos
__exportStar(require("./infrastructure/events/VLibrasEvents"), exports);
// Sistema de cache
__exportStar(require("./infrastructure/cache/VLibrasCache"), exports);
// Sistema de estilos e temas
var VLibrasCSS_1 = require("./infrastructure/styling/VLibrasCSS");
Object.defineProperty(exports, "VLibrasCSS", { enumerable: true, get: function () { return VLibrasCSS_1.VLibrasCSS; } });
Object.defineProperty(exports, "setupOptimizedCSS", { enumerable: true, get: function () { return VLibrasCSS_1.setupOptimizedCSS; } });
__exportStar(require("./infrastructure/styling/VLibrasThemes"), exports);
// Sistema de canvas
__exportStar(require("./infrastructure/canvas/VLibrasCanvasConfig"), exports);
// === FEATURES (Funcionalidades Específicas) ===
// Sistema de presets
var VLibrasPresets_1 = require("./features/presets/VLibrasPresets");
Object.defineProperty(exports, "VLibrasPresets", { enumerable: true, get: function () { return VLibrasPresets_1.VLibrasPresets; } });
Object.defineProperty(exports, "usePreset", { enumerable: true, get: function () { return VLibrasPresets_1.usePreset; } });
Object.defineProperty(exports, "useVLibrasPreset", { enumerable: true, get: function () { return VLibrasPresets_1.useVLibrasPreset; } });
// Sistema de plugins
__exportStar(require("./features/plugins/VLibrasPlugins"), exports);
// Ferramentas de desenvolvimento
__exportStar(require("./features/devtools/VLibrasDevTools"), exports);
// === ADAPTERS (Integrações Externas) ===
// Utilitários de teste
__exportStar(require("./adapters/testing/VLibrasTestUtils"), exports);
// === TYPES (Tipos Centralizados) ===
// export * from './types';
// === LEGACY COMPATIBILITY (Compatibilidade com versão anterior) ===
var PlayerStatus;
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
})(PlayerStatus || (exports.PlayerStatus = PlayerStatus = {}));
/**
 * Mensagens padrão em português
 */
exports.DEFAULT_STATE_MESSAGES = {
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