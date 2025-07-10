"use strict";
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.setupOptimizedCSS = exports.VLibrasCSS = exports.usePreset = exports.VLibrasPresets = exports.isUnityBridgeReady = exports.setupUnityBridge = exports.UnityBridge = exports.config = exports.PlayerManagerAdapter = exports.GlosaTranslator = exports.VLibrasPlayer = void 0;
// Exportações principais
var VLibrasPlayer_1 = require("./VLibrasPlayer");
Object.defineProperty(exports, "VLibrasPlayer", { enumerable: true, get: function () { return VLibrasPlayer_1.VLibrasPlayer; } });
var GlosaTranslator_1 = require("./GlosaTranslator");
Object.defineProperty(exports, "GlosaTranslator", { enumerable: true, get: function () { return GlosaTranslator_1.GlosaTranslator; } });
var PlayerManagerAdapter_1 = require("./PlayerManagerAdapter");
Object.defineProperty(exports, "PlayerManagerAdapter", { enumerable: true, get: function () { return PlayerManagerAdapter_1.PlayerManagerAdapter; } });
var config_1 = require("./config");
Object.defineProperty(exports, "config", { enumerable: true, get: function () { return config_1.config; } });
// Novas funcionalidades baseadas no feedback
var UnityBridge_1 = require("./UnityBridge");
Object.defineProperty(exports, "UnityBridge", { enumerable: true, get: function () { return UnityBridge_1.UnityBridge; } });
Object.defineProperty(exports, "setupUnityBridge", { enumerable: true, get: function () { return UnityBridge_1.setupUnityBridge; } });
Object.defineProperty(exports, "isUnityBridgeReady", { enumerable: true, get: function () { return UnityBridge_1.isUnityBridgeReady; } });
var VLibrasPresets_1 = require("./VLibrasPresets");
Object.defineProperty(exports, "VLibrasPresets", { enumerable: true, get: function () { return VLibrasPresets_1.VLibrasPresets; } });
Object.defineProperty(exports, "usePreset", { enumerable: true, get: function () { return VLibrasPresets_1.usePreset; } });
var VLibrasCSS_1 = require("./VLibrasCSS");
Object.defineProperty(exports, "VLibrasCSS", { enumerable: true, get: function () { return VLibrasCSS_1.VLibrasCSS; } });
Object.defineProperty(exports, "setupOptimizedCSS", { enumerable: true, get: function () { return VLibrasCSS_1.setupOptimizedCSS; } });
// Exportações de tipos
__exportStar(require("./types"), exports);
// Exportação padrão para compatibilidade
var VLibrasPlayer_2 = require("./VLibrasPlayer");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return VLibrasPlayer_2.VLibrasPlayer; } });
// Versão para uso direto no browser (compatibilidade com versão antiga)
if (typeof window !== 'undefined') {
    Promise.resolve().then(() => __importStar(require('./VLibrasPlayer'))).then(({ VLibrasPlayer }) => {
        window.VLibras = {
            Player: VLibrasPlayer,
            Presets: () => Promise.resolve().then(() => __importStar(require('./VLibrasPresets'))).then(m => m.VLibrasPresets),
            CSS: () => Promise.resolve().then(() => __importStar(require('./VLibrasCSS'))).then(m => m.VLibrasCSS),
            Bridge: () => Promise.resolve().then(() => __importStar(require('./UnityBridge'))).then(m => m.UnityBridge)
        };
    });
}
//# sourceMappingURL=index.js.map