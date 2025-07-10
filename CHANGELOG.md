# Changelog

## [2.1.0] - 2025-07-10

### 🚀 **Melhorias Baseadas no Feedback da Comunidade**

#### ✨ Adicionado
- **Unity Bridge Automático** - Funções globais do Unity configuradas automaticamente
- **Sistema de Presets** - Configurações prontas para casos específicos (quiz, dicionário, tutorial, etc.)
- **CSS Otimizado Automático** - Remove bordas pretas e otimiza canvas automaticamente  
- **Estados Claros** - Estados mais específicos e mensagens amigáveis
- **Responsividade Automática** - Adaptação automática para mobile/tablet/desktop

#### 🔧 Funcionalidades Críticas Resolvidas
- ✅ **Unity Bridge Manual** → Agora automático com `setupUnityBridge()`
- ✅ **CSS/Canvas Problemático** → Otimização automática com `setupOptimizedCSS()`
- ✅ **Estados Confusos** → Estados claros: INITIALIZING, LOADING_ASSETS, TRANSLATING, PLAYING, etc.
- ✅ **Configuração Repetitiva** → Presets prontos: `VLibrasPresets.quiz`, `VLibrasPresets.dictionary`

#### 💡 APIs Simplificadas
```typescript
// Unity Bridge automático
const bridge = setupUnityBridge();

// CSS otimizado automático  
setupOptimizedCSS('.vlibras-container', {
  fillContainer: true,
  removeBlackBorders: true
});

// Presets para casos específicos
const player = new VLibrasPlayer(VLibrasPresets.quiz);
```

#### 📱 Melhorias de UX
- Estados visuais automáticos (loading, error, ready)
- Animações suaves entre estados
- Responsividade para todos os tamanhos de tela
- Feedback visual inteligente

## [2.0.0] - 2025-07-10

### ✨ Added
- **TypeScript nativo** com tipagem completa para melhor experiência de desenvolvimento
- **Suporte múltiplos formatos** - ESM, CJS e UMD para máxima compatibilidade
- **API moderna** mantendo compatibilidade com versão anterior
- **Testes automatizados** com Jest para garantir qualidade
- **Zero dependências** em runtime para bundles menores
- **Tree-shaking** automático para otimização de bundle
- **Documentação completa** com exemplos para React, Vue e Angular

### 🔄 Changed
- Migração completa de JavaScript para TypeScript
- Estrutura de build modernizada com Webpack 5
- Sistema de eventos simplificado sem dependências externas
- Configuração de desenvolvimento com hot reload

### 🚀 Improved
- **Performance** - Bundle otimizado e menor
- **DX (Developer Experience)** - IntelliSense completo no VS Code
- **Integração** - Suporte nativo a frameworks modernos
- **Manutenibilidade** - Código tipado e testado

### 📦 Package
- Publicado como `vlibras-player-webjs`
- Suporte a Node.js >= 16.0.0
- Compatível com bundlers modernos (Webpack, Vite, Rollup)

---

## [1.1.0] - Versão Anterior

### Features
- Player básico para VLibras
- Integração com Unity WebGL
- Tradução de texto para glosa
- Controles básicos de reprodução
