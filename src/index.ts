// Exportações principais
export { VLibrasPlayer } from './VLibrasPlayer';
export { GlosaTranslator } from './GlosaTranslator';
export { PlayerManagerAdapter } from './PlayerManagerAdapter';
export { config } from './config';

// Novas funcionalidades baseadas no feedback
export { UnityBridge, setupUnityBridge, isUnityBridgeReady } from './UnityBridge';
export { VLibrasPresets, usePreset } from './VLibrasPresets';
export { VLibrasCSS, setupOptimizedCSS } from './VLibrasCSS';

// Novas funcionalidades críticas implementadas
export * from './VLibrasEvents';
export * from './VLibrasDevTools';
export * from './VLibrasGlobalConfig';
export * from './VLibrasCache';

// Exportações de tipos
export * from './types';

// Exportação padrão para compatibilidade
export { VLibrasPlayer as default } from './VLibrasPlayer';

// Versão para uso direto no browser (compatibilidade com versão antiga)
if (typeof window !== 'undefined') {
  import('./VLibrasPlayer').then(({ VLibrasPlayer }) => {
    (window as any).VLibras = {
      Player: VLibrasPlayer,
      Presets: () => import('./VLibrasPresets').then(m => m.VLibrasPresets),
      CSS: () => import('./VLibrasCSS').then(m => m.VLibrasCSS),
      Bridge: () => import('./UnityBridge').then(m => m.UnityBridge)
    };
  });
}
