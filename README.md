# 🤟 VLibras Player WebJS - Biblioteca Moderna

Uma biblioteca JavaScript/TypeScript moderna para integração do VLibras Player em aplicações web, permitindo fácil tradução de texto para Libras (Língua Brasileira de Sinais) através de um avatar animado.

![Version](https://img.shields.io/badge/version-v2.3.0-blue.svg)
![License](https://img.shields.io/badge/license-LGPLv3-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)

## 🎪 **Demo Completa**

**Veja todas as funcionalidades em ação!** Abra o arquivo [`demo/demo-completa.html`](./demo/demo-completa.html) em seu navegador para uma demonstração interativa completa de todas as funcionalidades da v2.3.0.

A demo inclui:
- ⚙️ **Configuração Global** - Temas, regiões, debug mode
- 🎭 **Player Principal** - Inicialização assíncrona e status
- 🔤 **Tradução e Reprodução** - API Promise-based
- 🎛️ **Presets Avançados** - Blog, educação, corporativo, etc.
- 🗄️ **Cache Inteligente** - Preload, contextos, compressão
- 🛠️ **DevTools** - Diagnósticos, profiling, logs
- 🔌 **Sistema de Plugins** - Analytics, acessibilidade, performance
- 📊 **Estatísticas** - Métricas em tempo real

## ✨ Principais Melhorias

### 🆕 Novidades da v2.3.0
- **API Promise-based completa** com `loadAsync()`, `translateAsync()`, `playAsync()`
- **Presets avançados** para casos reais (blog, educação, corporativo, etc.)
- **Sistema de temas integrado** (light, dark, high-contrast, compact)
- **Canvas responsivo** com presets para mobile, tablet, desktop
- **Sistema de plugins extensível** (analytics, acessibilidade, performance)
- **Utilitários de teste** com mocks e assertions
- **Configuração avançada de canvas** com auto-responsividade

### 🎯 Funcionalidades da v2.2.0
- **Sistema de eventos type-safe** com VLibrasEventEmitter
- **DevTools avançado** com diagnósticos e profiling
- **Configuração global** com persistência e auto-configuração
- **Cache inteligente** com estratégias híbridas e TTL
- **Debug mode** e logging estruturado
- **Temas automáticos** (light/dark/auto)
- **Configurações de acessibilidade** avançadas

### 🚀 Funcionalidades Anteriores (v2.0/v2.1)
- **TypeScript nativo** com tipagem completa
- **Suporte ESM/CJS/UMD** para máxima compatibilidade
- **API moderna** com Promises e async/await
- **Tree-shaking** para bundles menores
- **Zero dependências** em runtime
- **Testes automatizados** com Jest
- **Unity Bridge** e CSS otimizado
- **Estados claros** e presets prontos

### 🎯 Benefícios vs CDN
- ✅ **Controle de versão** preciso via npm
- ✅ **Bundle otimizado** com tree-shaking
- ✅ **IntelliSense completo** no VS Code
- ✅ **Integração nativa** com frameworks modernos
- ✅ **Cache eficiente** pelo npm/bundler
- ✅ **Desenvolvimento offline** sem dependência de CDN
- ✅ **Versionamento semântico** para atualizações seguras

## 🎯 Novas Funcionalidades v2.2.0

### Sistema de Eventos Type-Safe
```typescript
import { VLibrasPlayer } from 'vlibras-player-webjs';

const player = new VLibrasPlayer();

// Eventos detalhados com tipagem completa
player.on('player:ready', (data) => {
  console.log('Player pronto em:', data.timestamp);
});

player.on('translation:complete', (data) => {
  console.log(`Tradução concluída: ${data.gloss} (${data.duration}ms)`);
});

player.on('performance:slow', (data) => {
  console.warn(`Operação lenta: ${data.operation} - ${data.duration}ms`);
});
```

### DevTools e Diagnósticos
```typescript
import { VLibrasDevTools } from 'vlibras-player-webjs';

// Ativar modo debug
player.enableDebugMode();

// Executar diagnósticos completos
const diagnostics = await player.runDiagnostics();
console.log('WebGL suportado:', diagnostics.webgl.supported);
console.log('Assets carregados:', diagnostics.assets.loaded);

// Relatório de performance
const performance = VLibrasDevTools.getPerformanceReport();
console.log('Operações lentas:', performance.slowOperations);
```

### Cache Inteligente
```typescript
import { vlibrasCache, VLibrasCache } from 'vlibras-player-webjs';

// Configurar cache híbrido
VLibrasCache.configure({
  type: 'hybrid', // memory + localStorage + indexedDB
  maxSize: 50, // 50MB
  ttl: 3600, // 1 hora
  compression: true
});

// Preload de palavras comuns
await vlibrasCache.preloadCommonWords(['olá', 'obrigado', 'por favor']);

// Cache por contexto
await vlibrasCache.preloadForContext('tutorial');
```

### Configuração Global
```typescript
import { VLibrasGlobalConfig } from 'vlibras-player-webjs';

// Auto-configuração por ambiente
VLibrasGlobalConfig.autoConfigureForEnvironment();

// Configuração personalizada
VLibrasGlobalConfig.configure({
  theme: 'auto', // light/dark/auto
  debug: true,
  performance: {
    preloadAssets: true,
    cacheEnabled: true,
    enableGPUAcceleration: true
  },
  accessibility: {
    announceStateChanges: true,
    keyboardNavigation: true,
    screenReaderSupport: true
  }
});
```

## 📦 Instalação

```bash
# npm
npm install vlibras-player-webjs

# yarn
yarn add vlibras-player-webjs

# pnpm
pnpm add vlibras-player-webjs
```

## 🚀 Uso Rápido

### JavaScript/ES6
```javascript
import { VLibrasPlayer } from 'vlibras-player-webjs';

const player = new VLibrasPlayer({
  targetPath: './assets/vlibras'
});

// Carrega o player no elemento
const container = document.getElementById('vlibras-container');
player.load(container);

// Traduz e reproduz texto
player.translate('Olá! Bem-vindo ao nosso site.');
```

### TypeScript
```typescript
import { VLibrasPlayer, PlayerConfig, PlayerStatus } from 'vlibras-player-webjs';

const config: PlayerConfig = {
  targetPath: './assets/vlibras',
  onLoad: () => console.log('Player carregado!')
};

const player = new VLibrasPlayer(config);
player.load(document.getElementById('vlibras-container')!);

// Com tipagem completa
player.translate('Texto para traduzir', { isEnabledStats: true });
```

### React (18 e 19)
```jsx
import React, { useEffect, useRef } from 'react';
import { VLibrasPlayer } from 'vlibras-player-webjs';

function VLibrasComponent() {
  const containerRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      playerRef.current = new VLibrasPlayer({
        targetPath: '/assets/vlibras',
        onLoad: () => console.log('VLibras carregado!')
      });
      
      playerRef.current.load(containerRef.current);
    }

    return () => {
      // Cleanup se necessário
    };
  }, []);

  const handleTranslate = () => {
    if (playerRef.current) {
      playerRef.current.translate('Olá mundo!');
    }
  };

  return (
    <div>
      <div ref={containerRef} style={{ width: 400, height: 500 }} />
      <button onClick={handleTranslate}>Traduzir</button>
    </div>
  );
}
```

#### Hook Customizado para React 19
```jsx
import { useRef, useEffect, useState, useCallback } from 'react';
import { VLibrasPlayer } from 'vlibras-player-webjs';

function useVLibras(config = {}) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    playerRef.current = new VLibrasPlayer({
      ...config,
      onLoad: () => {
        setIsLoaded(true);
        if (config.onLoad) config.onLoad();
      }
    });

    playerRef.current.load(containerRef.current);

    return () => {
      if (playerRef.current) {
        playerRef.current.stop();
      }
    };
  }, []);

  const translate = useCallback((text, options = {}) => {
    if (playerRef.current && isLoaded) {
      return playerRef.current.translate(text, options);
    }
  }, [isLoaded]);

  return { containerRef, player: playerRef.current, isLoaded, translate };
}
```

### Vue 3
```vue
<template>
  <div>
    <div ref="vlibrasContainer" class="vlibras-player"></div>
    <button @click="translateText">Traduzir</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { VLibrasPlayer } from 'vlibras-player-webjs';

const vlibrasContainer = ref(null);
let player = null;

onMounted(() => {
  player = new VLibrasPlayer({
    targetPath: '/assets/vlibras'
  });
  
  player.load(vlibrasContainer.value);
});

const translateText = () => {
  player?.translate('Olá Vue!');
};
</script>

<style scoped>
.vlibras-player {
  width: 400px;
  height: 500px;
}
</style>
```

### Angular
```typescript
// vlibras.component.ts
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { VLibrasPlayer } from 'vlibras-player-webjs';

@Component({
  selector: 'app-vlibras',
  template: `
    <div #vlibrasContainer class="vlibras-player"></div>
    <button (click)="translateText()">Traduzir</button>
  `,
  styles: [`
    .vlibras-player {
      width: 400px;
      height: 500px;
    }
  `]
})
export class VLibrasComponent implements AfterViewInit {
  @ViewChild('vlibrasContainer', { static: true }) 
  containerRef!: ElementRef;

  private player!: VLibrasPlayer;

  ngAfterViewInit() {
    this.player = new VLibrasPlayer({
      targetPath: '/assets/vlibras'
    });
    
    this.player.load(this.containerRef.nativeElement);
  }

  translateText() {
    this.player.translate('Olá Angular!');
  }
}
```

## 📚 API Completa

### Classe VLibrasPlayer

#### Constructor
```typescript
new VLibrasPlayer(config?: PlayerConfig)
```

#### Métodos Principais
```typescript
// Carregamento
load(wrapper: HTMLElement): void

// Tradução e reprodução
translate(text: string, options?: TranslateOptions): void
play(gloss?: string, options?: PlayOptions): void
playWelcome(): void

// Controles de reprodução
continue(): void
pause(): void
stop(): void
repeat(): void

// Configurações
setSpeed(speed: PlaybackSpeed): void // 0.5, 1.0, 1.5, 2.0
setRegion(region: SupportedRegion): void // 'BR', 'PE', 'RJ', 'SP'
setPersonalization(config: PersonalizationConfig): void
changeAvatar(avatarName: string): void
toggleSubtitle(): void

// Estado
getStatus(): PlayerStatus
isLoaded(): boolean
getText(): string | undefined
getGloss(): string | undefined
getRegion(): SupportedRegion
```

### Tipos TypeScript

```typescript
interface PlayerConfig {
  translator?: string;
  targetPath?: string;
  onLoad?: () => void;
  progress?: (wrapper: HTMLElement) => any;
}

enum PlayerStatus {
  IDLE = 'idle',
  PREPARING = 'preparing',
  PLAYING = 'playing'
}

interface TranslateOptions {
  isEnabledStats?: boolean;
}

interface PlayOptions {
  fromTranslation?: boolean;
  isEnabledStats?: boolean;
}

type PlaybackSpeed = 0.5 | 1.0 | 1.5 | 2.0;
type SupportedRegion = 'BR' | 'PE' | 'RJ' | 'SP';
```

## 🎨 Eventos e Callbacks

### Usando herança (recomendado para casos complexos)
```typescript
class MyVLibrasPlayer extends VLibrasPlayer {
  protected onLoad(): void {
    console.log('Player carregado!');
  }

  protected onTranslateStart(): void {
    console.log('Iniciando tradução...');
  }

  protected onTranslateEnd(): void {
    console.log('Tradução concluída!');
  }

  protected onGlossStart(): void {
    console.log('Iniciando reprodução da glosa');
  }

  protected onGlossEnd(glossLength: string): void {
    console.log('Reprodução finalizada:', glossLength);
  }

  protected onError(error: string): void {
    console.error('Erro no VLibras:', error);
  }
}
```

## 🛠️ Configuração de Assets

### Estrutura de diretórios
```
public/
  assets/
    vlibras/
      UnityLoader.js
      playerweb.json
      playerweb.data.unityweb
      playerweb.wasm.code.unityweb
      playerweb.wasm.framework.unityweb
```

### Webpack
```javascript
// webpack.config.js
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  plugins: [
    new CopyPlugin({
      patterns: [
        { 
          from: 'node_modules/vlibras-player-webjs/assets', 
          to: 'assets/vlibras' 
        }
      ]
    })
  ]
};
```

### Vite
```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  assetsInclude: ['**/*.unityweb'],
  publicDir: 'public'
});
```

## 🔧 Configuração Avançada

### Customização completa
```typescript
const player = new VLibrasPlayer({
  translator: 'https://meu-tradutor.com/api',
  targetPath: './assets/vlibras-custom',
  onLoad: () => {
    // Player carregado
    player.setRegion('SP');
    player.setSpeed(1.5);
  },
  progress: (wrapper) => {
    // Implementar barra de progresso customizada
    const progress = document.createElement('div');
    progress.className = 'vlibras-loading';
    wrapper.appendChild(progress);
    return progress;
  }
});

// Configurar personalização do avatar
player.setPersonalization({
  appearance: {
    skinColor: '#F4C2A1',
    hairColor: '#8B4513',
    clothingColor: '#0066CC'
  },
  speed: 1.2
});
```

## 📱 Responsividade

### CSS para diferentes tamanhos
```css
.vlibras-container {
  width: 400px;
  height: 500px;
}

@media (max-width: 768px) {
  .vlibras-container {
    width: 300px;
    height: 375px;
  }
}

@media (max-width: 480px) {
  .vlibras-container {
    width: 250px;
    height: 312px;
  }
}
```

## 🧪 Testes

```bash
# Executar testes
npm test

# Testes com coverage
npm run test:coverage

# Testes em modo watch
npm run test:watch
```

## 🏗️ Build e Desenvolvimento

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Lint
npm run lint

# Demo local
npm run demo
```

## 📄 Licença

LGPL-3.0 © [VLibras Team](https://www.gov.br/governodigital/pt-br/acessibilidade-e-usuario/vlibras)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📚 Documentação Completa

- 📖 [CHANGELOG.md](./CHANGELOG.md) - Histórico detalhado de mudanças
- 🚀 [EXEMPLOS v2.2.0](./EXEMPLOS-v2.2.0.md) - Guias práticos das novas funcionalidades
- 🔄 [MIGRATION-GUIDE.md](./MIGRATION-GUIDE.md) - Guia de migração entre versões
- 🛠️ [CONTRIBUTING.md](./CONTRIBUTING.md) - Como contribuir com o projeto
- ⚙️ [FUNCOES-UTILITARIAS-VLIBRAS.md](./FUNCOES-UTILITARIAS-VLIBRAS.md) - Requisitos e especificações

## 🚀 Funcionalidades Avançadas (v2.3.0+)

### API Promise-based
```typescript
import { VLibrasPlayer } from 'vlibras-player-webjs';

const player = new VLibrasPlayer();

// Métodos assíncronos
await player.loadAsync('#vlibras-container');
const result = await player.translateAsync('Olá mundo!');
await player.playAsync();

// Métodos combinados
const playbackResult = await player.translateAndPlay('Bem-vindos!');
console.log('Tradução:', playbackResult.translation);
console.log('Duração:', playbackResult.duration);
```

### Presets Avançados
```typescript
import { VLibrasPresets, usePreset } from 'vlibras-player-webjs';

// Presets prontos para uso
const blogConfig = VLibrasPresets.blog();
const eduConfig = VLibrasPresets.education();
const corpConfig = VLibrasPresets.corporate();

// Aplicar preset com customizações
const customConfig = usePreset('blog', {
  showControls: false,
  autoPlay: true
});

const player = new VLibrasPlayer(customConfig);
```

### Configuração Avançada de Canvas
```typescript
import { VLibrasCanvasConfig } from 'vlibras-player-webjs';

// Configuração responsiva automática
VLibrasCanvasConfig.setupResponsive('#vlibras-container', {
  mobile: { width: 200, height: 200 },
  tablet: { width: 300, height: 300 },
  desktop: { width: 400, height: 400 }
});

// Presets de qualidade
VLibrasCanvasConfig.applyQualityPreset('high-quality');

// Auto-injeção de CSS otimizado
VLibrasCanvasConfig.injectOptimizedCSS();
```

### Utilitários de Teste
```typescript
import { VLibrasTestUtils } from 'vlibras-player-webjs';

// Mock para testes
const mockPlayer = VLibrasTestUtils.createMockPlayer();

// Assertions específicas
await VLibrasTestUtils.assertPlayerLoaded(player);
await VLibrasTestUtils.assertTranslationCompleted(player, 'teste');

// Helpers de teste
const testHelper = VLibrasTestUtils.createTestHelper();
await testHelper.setupTestEnvironment();
```

## 🆘 Suporte

- 📖 [Documentação Oficial](https://www.gov.br/governodigital/pt-br/acessibilidade-e-usuario/vlibras)

## 🗺️ Roadmap

- [x] ✅ Sistema de eventos type-safe (v2.2.0)
- [x] ✅ DevTools e diagnósticos (v2.2.0) 
- [x] ✅ Cache inteligente (v2.2.0)
- [x] ✅ Configuração global (v2.2.0)
- [x] ✅ API Promise-based (v2.3.0)
- [x] ✅ Presets avançados (v2.3.0)
- [x] ✅ Utilitários de teste (v2.3.0)
- [x] ✅ Canvas otimizado (v2.3.0)
- [ ] Modo offline completo
- [ ] WebWorker para processamento
- [ ] Plugin system extensível

---

**Desenvolvido com ❤️ para tornar a web mais acessível!**
