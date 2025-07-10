// Exportações principais
export { VLibrasPlayer } from './VLibrasPlayer';
export { GlosaTranslator } from './GlosaTranslator';
export { PlayerManagerAdapter } from './PlayerManagerAdapter';
export { config } from './config';

// Exportações de tipos
export * from './types';

// Exportação padrão para compatibilidade
export { VLibrasPlayer as default } from './VLibrasPlayer';

// Versão para uso direto no browser (compatibilidade com versão antiga)
if (typeof window !== 'undefined') {
  import('./VLibrasPlayer').then(({ VLibrasPlayer }) => {
    (window as any).VLibras = {
      Player: VLibrasPlayer
    };
  });
}
