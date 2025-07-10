# 🤟 VLibras Player WebJS - Biblioteca Moderna

Uma biblioteca JavaScript/TypeScript moderna para integração do VLibras Player em aplicações web, permitindo fácil tradução de texto para Libras (Língua Brasileira de Sinais) através de um avatar animado.

![Version](https://img.shields.io/badge/version-v2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-LGPLv3-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)

## ✨ Principais Melhorias

### 🆕 Novidades da v2.0
- **TypeScript nativo** com tipagem completa
- **Suporte ESM/CJS/UMD** para máxima compatibilidade
- **API moderna** com Promises e async/await
- **Tree-shaking** para bundles menores
- **Zero dependências** em runtime
- **Testes automatizados** com Jest
- **Documentação completa** com exemplos

### 🚀 Benefícios vs CDN
- ✅ **Controle de versão** preciso via npm
- ✅ **Bundle otimizado** com tree-shaking
- ✅ **IntelliSense completo** no VS Code
- ✅ **Integração nativa** com frameworks modernos
- ✅ **Cache eficiente** pelo npm/bundler
- ✅ **Desenvolvimento offline** sem dependência de CDN
- ✅ **Versionamento semântico** para atualizações seguras

## 📦 Instalação

```bash
# npm
npm install @vlibras/player-webjs

# yarn
yarn add @vlibras/player-webjs

# pnpm
pnpm add @vlibras/player-webjs
```

## 🚀 Uso Rápido

### JavaScript/ES6
```javascript
import { VLibrasPlayer } from '@vlibras/player-webjs';

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
import { VLibrasPlayer, PlayerConfig, PlayerStatus } from '@vlibras/player-webjs';

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
import { VLibrasPlayer } from '@vlibras/player-webjs';

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
import { VLibrasPlayer } from '@vlibras/player-webjs';

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
import { VLibrasPlayer } from '@vlibras/player-webjs';

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
import { VLibrasPlayer } from '@vlibras/player-webjs';

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
          from: 'node_modules/@vlibras/player-webjs/assets', 
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

LGPL-3.0 © [VLibras Team](https://www.vlibras.gov.br/)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 🆘 Suporte

- 📖 [Documentação Oficial](https://www.vlibras.gov.br/doc)
- 🐛 [Reportar Bug](https://github.com/vlibras/player-webjs/issues)
- 💬 [Discussões](https://github.com/vlibras/player-webjs/discussions)
- 📧 [Contato](mailto:contato@vlibras.gov.br)

## 🗺️ Roadmap

- [ ] Suporte a mais formatos de avatar
- [ ] Integração com Web Components
- [ ] Plugin para WordPress
- [ ] Suporte a PWA
- [ ] Cache inteligente de glosas
- [ ] Modo offline

---

**Desenvolvido com ❤️ pela equipe VLibras para tornar a web mais acessível!**
