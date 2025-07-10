# VLibras Player WebJS - Biblioteca Moderna

Este é um projeto modernizado do VLibras Player WebJS para distribuição como pacote npm.

## 🚀 Como usar esta estrutura

### 1. Substitua o package.json atual
```bash
cp package-new.json package.json
```

### 2. Instale as dependências modernas
```bash
npm install
```

### 3. Configure os assets do Unity
Copie os arquivos do Unity da pasta `src/target/` para `assets/`:
```bash
mkdir -p assets
cp -r src/target/* assets/
```

### 4. Build da biblioteca
```bash
npm run build
```

### 5. Teste localmente
```bash
npm run demo
```

## 📁 Estrutura Final

```
vlibras-player-webjs/
├── src/                          # Código-fonte TypeScript
│   ├── types/                    # Definições de tipos
│   ├── VLibrasPlayer.ts         # Classe principal
│   ├── GlosaTranslator.ts       # Tradutor moderno
│   ├── PlayerManagerAdapter.ts  # Adaptador Unity
│   ├── config.ts                # Configurações
│   └── index.ts                 # Entrada principal
├── assets/                      # Assets do Unity (copiados de src/target)
├── dist/                       # Build final
│   ├── esm/                    # ES Modules
│   ├── cjs/                    # CommonJS
│   ├── umd/                    # UMD (browser)
│   └── types/                  # TypeScript declarations
├── demo/                       # Demonstrações
├── package.json               # Configuração moderna
├── tsconfig.json              # TypeScript config
├── webpack.config.modern.js   # Webpack moderno
└── README-new.md             # Documentação completa
```

## 🎯 Benefícios da Migração

### Para Desenvolvedores
- ✅ **IntelliSense completo** no VS Code
- ✅ **Type safety** com TypeScript
- ✅ **Tree-shaking** automático
- ✅ **Compatibilidade** com todos os bundlers modernos
- ✅ **Versionamento semântico** preciso

### Para Projetos
- ✅ **Bundle menor** com apenas o código usado
- ✅ **Cache eficiente** do npm
- ✅ **Offline-first** development
- ✅ **Melhor performance** sem CDN
- ✅ **Controle de versão** granular

### Para Frameworks
- ✅ **React/Vue/Angular** nativo
- ✅ **Next.js/Nuxt/SvelteKit** compatível
- ✅ **Vite/Webpack/Rollup** otimizado
- ✅ **Monorepo** friendly

## 📦 Como Publicar no NPM

### 1. Configure o escopo (recomendado)
```bash
npm login
npm init --scope=@vlibras
```

### 2. Publique
```bash
npm publish --access public
```

### 3. Uso pelos desenvolvedores
```bash
npm install @vlibras/player-webjs
```

```javascript
import { VLibrasPlayer } from '@vlibras/player-webjs';

const player = new VLibrasPlayer();
player.load(document.getElementById('vlibras'));
player.translate('Olá mundo!');
```

## 🔄 Migração Gradual

### Fase 1: Coexistência
- Mantenha a versão CDN atual
- Publique a versão npm como @vlibras/player-webjs@2.0.0
- Desenvolvedores podem escolher

### Fase 2: Adoçãogit add .
git commit -m "feat: versão 2.0.0 - biblioteca TypeScript moderna com suporte ESM/CJS/UMD"
git push origin dev
- Promova a versão npm
- Adicione exemplos para todos os frameworks
- Crie plugins específicos (WordPress, etc.)

### Fase 3: Deprecação
- Marque versão CDN como deprecated
- Migre documentação oficial
- Suporte apenas para correções críticas na versão antiga

## 🎨 Exemplos de Integração

### React Hook
```tsx
import { useVLibras } from '@vlibras/react-hooks';

function MyComponent() {
  const { player, translate, isLoaded } = useVLibras({
    targetPath: '/assets/vlibras'
  });

  return (
    <div>
      <div ref={player.containerRef} />
      <button 
        onClick={() => translate('Olá React!')}
        disabled={!isLoaded}
      >
        Traduzir
      </button>
    </div>
  );
}
```

### Vue Composable
```vue
<script setup>
import { useVLibras } from '@vlibras/vue-composables';

const { container, translate, isLoaded } = useVLibras({
  targetPath: '/assets/vlibras'
});
</script>

<template>
  <div>
    <div ref="container" />
    <button @click="translate('Olá Vue!')" :disabled="!isLoaded">
      Traduzir
    </button>
  </div>
</template>
```

## 🚀 Próximos Passos

1. **Revisar e testar** a estrutura proposta
2. **Migrar assets** do Unity para a nova estrutura
3. **Instalar dependências** e fazer o primeiro build
4. **Testar compatibilidade** com projetos reais
5. **Configurar CI/CD** para publicação automática
6. **Documentar migração** para usuários existentes
7. **Publicar primeira versão** beta no npm

Esta estrutura transforma o projeto em uma biblioteca npm moderna e profissional, mantendo compatibilidade com a versão anterior e oferecendo uma experiência muito melhor para desenvolvedores! 🎉
