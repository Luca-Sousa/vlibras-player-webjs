# Exemplos VLibras v2.3.0 - Funcionalidades Avançadas

> 🚀 **Guia prático das novas funcionalidades Promise-based, presets avançados, canvas config e utilitários de teste**

## 📖 Índice

- [API Promise-Based](#-api-promise-based)
- [Presets Avançados](#-presets-avançados)
- [Canvas Config Responsivo](#-canvas-config-responsivo)
- [Utilitários de Teste](#-utilitários-de-teste)
- [Casos de Uso Reais](#-casos-de-uso-reais)

---

## 🎯 API Promise-Based

### Uso Básico com Async/Await

```typescript
import { VLibrasPlayer } from 'vlibras-player-webjs';

async function exemploBasico() {
  const player = new VLibrasPlayer();
  
  try {
    // Carregamento assíncrono
    await player.loadAsync('#vlibras-container');
    console.log('✅ Player carregado!');
    
    // Tradução assíncrona
    const translation = await player.translateAsync('Olá mundo!');
    console.log('🔄 Tradução:', translation);
    
    // Reprodução assíncrona
    await player.playAsync();
    console.log('▶️ Reprodução iniciada!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}
```

### Métodos Combinados

```typescript
async function exemploMetodosCombinados() {
  const player = new VLibrasPlayer();
  
  // Traduzir e reproduzir em uma só chamada
  const result = await player.translateAndPlay('Bem-vindos ao nosso site!');
  
  console.log('📊 Resultado:', {
    success: result.success,
    duration: `${result.duration}ms`,
    translation: result.translation.text,
    glossLength: result.translation.glossLength
  });
}
```

### Aguardar Estado Específico

```typescript
async function aguardarEstado() {
  const player = new VLibrasPlayer();
  
  // Carregar em paralelo
  const loadPromise = player.loadAsync('#container');
  
  // Aguardar estar pronto
  await player.waitForReady();
  console.log('🎯 Player está pronto para uso!');
  
  // Agora pode usar normalmente
  await player.translateAsync('Conteúdo importante');
}
```

---

## 🎨 Presets Avançados

### Presets Prontos

```typescript
import { VLibrasPresets, usePreset } from 'vlibras-player-webjs';

// Blog/Artigos
const blogPlayer = new VLibrasPlayer(VLibrasPresets.blog());

// Educacional
const eduPlayer = new VLibrasPlayer(VLibrasPresets.education());

// Corporativo
const corpPlayer = new VLibrasPlayer(VLibrasPresets.corporate());

// E-commerce
const shopPlayer = new VLibrasPlayer(VLibrasPresets.ecommerce());

// Gaming
const gamePlayer = new VLibrasPlayer(VLibrasPresets.gaming());
```

### Customização de Presets

```typescript
// Preset blog customizado
const blogCustom = usePreset('blog', {
  autoPlay: false,
  showControls: true,
  theme: 'dark'
});

const player = new VLibrasPlayer(blogCustom);
```

### Preset Dinâmico

```typescript
function criarPlayerDinamico(tipo: string, opcoes?: any) {
  let config;
  
  switch (tipo) {
    case 'tutorial':
      config = usePreset('education', {
        showProgress: true,
        allowSkip: true,
        ...opcoes
      });
      break;
      
    case 'produto':
      config = usePreset('ecommerce', {
        showWordBadge: true,
        allowReplay: true,
        ...opcoes
      });
      break;
      
    default:
      config = VLibrasPresets.blog();
  }
  
  return new VLibrasPlayer(config);
}

// Uso
const tutorialPlayer = criarPlayerDinamico('tutorial', { 
  height: 400 
});
```

### Hook React com Presets

```typescript
import React from 'react';
import { useVLibrasPreset } from 'vlibras-player-webjs';

function ComponenteComPreset() {
  const { config, preset, availablePresets } = useVLibrasPreset('blog', {
    autoPlay: true
  });
  
  return (
    <div>
      <h3>Usando preset: {preset.name}</h3>
      <div id="vlibras" data-config={JSON.stringify(config)} />
      
      <select onChange={(e) => {
        // Trocar preset dinamicamente
        const newConfig = usePreset(e.target.value as any);
        // Aplicar nova config...
      }}>
        {availablePresets.map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
    </div>
  );
}
```

---

## 🖼️ Canvas Config Responsivo

### Setup Responsivo Automático

```typescript
import { VLibrasCanvasConfig } from 'vlibras-player-webjs';

// Configuração responsiva automática
VLibrasCanvasConfig.setupResponsive('#vlibras-container', {
  mobile: {
    width: 200,
    height: 200,
    quality: 'low-quality'
  },
  tablet: {
    width: 300,
    height: 300,
    quality: 'balanced'
  },
  desktop: {
    width: 400,
    height: 400,
    quality: 'high-quality'
  }
});
```

### Presets de Qualidade

```typescript
// Aplicar preset baseado na capacidade do dispositivo
const deviceCapability = VLibrasCanvasConfig.detectDeviceCapability();

if (deviceCapability === 'high-end') {
  VLibrasCanvasConfig.applyQualityPreset('ultra-quality');
} else if (deviceCapability === 'mid-range') {
  VLibrasCanvasConfig.applyQualityPreset('high-quality');
} else {
  VLibrasCanvasConfig.applyQualityPreset('balanced');
}
```

### CSS Otimizado Automático

```typescript
// Injetar CSS otimizado automaticamente
VLibrasCanvasConfig.injectOptimizedCSS({
  removeBlackBorders: true,
  optimizeForMobile: true,
  enableHardwareAcceleration: true
});
```

### Configuração Avançada

```typescript
const config = VLibrasCanvasConfig.createAdvancedConfig({
  container: '#vlibras',
  responsive: {
    enabled: true,
    maintainAspectRatio: true,
    breakpoints: {
      mobile: { maxWidth: 768 },
      tablet: { maxWidth: 1024 },
      desktop: { minWidth: 1025 }
    }
  },
  quality: {
    preset: 'adaptive', // Adapta automaticamente
    customSettings: {
      antialiasing: true,
      shadows: true,
      textureQuality: 'high'
    }
  },
  performance: {
    enableGPUAcceleration: true,
    optimizeForBattery: false,
    targetFPS: 60
  }
});

const player = new VLibrasPlayer(config);
```

---

## 🧪 Utilitários de Teste

### Mock Player para Testes

```typescript
import { VLibrasTestUtils } from 'vlibras-player-webjs';

describe('VLibras Player Tests', () => {
  test('deve traduzir texto corretamente', async () => {
    // Criar mock player
    const mockPlayer = VLibrasTestUtils.createMockPlayer({
      translateDelay: 100,
      playDelay: 200,
      shouldSucceed: true
    });
    
    // Simular tradução
    await VLibrasTestUtils.simulateTranslation(mockPlayer, 'teste');
    
    // Verificar estado
    VLibrasTestUtils.assertPlayerState(mockPlayer, 'completed');
  });
});
```

### Assertions Específicas

```typescript
import { VLibrasTestUtils } from 'vlibras-player-webjs';

async function testarFluxoCompleto() {
  const player = new VLibrasPlayer();
  
  // Aguardar carregamento
  await VLibrasTestUtils.assertPlayerLoaded(player, 5000);
  
  // Testar tradução
  const translation = await player.translateAsync('teste');
  await VLibrasTestUtils.assertTranslationCompleted(player, 'teste');
  
  // Testar reprodução
  await player.playAsync();
  await VLibrasTestUtils.assertAnimationStarted(player);
  
  console.log('✅ Todos os testes passaram!');
}
```

### Helpers de Teste

```typescript
// Setup de ambiente de teste
const testHelper = VLibrasTestUtils.createTestHelper();

beforeEach(async () => {
  await testHelper.setupTestEnvironment();
  testHelper.mockUnityBridge();
  testHelper.mockAssets();
});

afterEach(() => {
  testHelper.cleanup();
});

test('interação do usuário', async () => {
  const player = testHelper.createTestPlayer();
  
  // Simular clique
  await testHelper.simulateUserInteraction('click', '#play-button');
  
  // Verificar resultado
  expect(player.isPlaying).toBe(true);
});
```

### Decorators para Testes

```typescript
import { TestOnly, MockBehavior } from 'vlibras-player-webjs';

class MinhaClasseDeTeste {
  @TestOnly
  @MockBehavior({ delay: 100, successRate: 0.9 })
  async metodoDeTeste() {
    // Este método só executa em ambiente de teste
    // e simula comportamento realista
  }
}
```

---

## 💼 Casos de Uso Reais

### Blog com VLibras

```typescript
import { VLibrasPlayer, usePreset } from 'vlibras-player-webjs';

class BlogVLibras {
  private player: VLibrasPlayer;
  
  constructor() {
    // Preset otimizado para blog
    const config = usePreset('blog', {
      autoPlay: false,
      showControls: true,
      showWordBadge: true
    });
    
    this.player = new VLibrasPlayer(config);
  }
  
  async inicializar() {
    await this.player.loadAsync('#vlibras');
    this.setupEventListeners();
  }
  
  private setupEventListeners() {
    // Traduzir quando hover em títulos
    document.querySelectorAll('h1, h2, h3').forEach(titulo => {
      titulo.addEventListener('mouseenter', async () => {
        if (titulo.textContent) {
          await this.player.translateAsync(titulo.textContent);
        }
      });
    });
    
    // Traduzir parágrafo quando clicado
    document.querySelectorAll('p').forEach(paragrafo => {
      paragrafo.addEventListener('click', async () => {
        if (paragrafo.textContent) {
          await this.player.translateAndPlay(paragrafo.textContent);
        }
      });
    });
  }
}

// Uso
const blogVlibras = new BlogVLibras();
await blogVlibras.inicializar();
```

### E-commerce com VLibras

```typescript
class EcommerceVLibras {
  private player: VLibrasPlayer;
  
  constructor() {
    const config = usePreset('ecommerce', {
      showWordBadge: true,
      allowReplay: true,
      autoPlay: true
    });
    
    this.player = new VLibrasPlayer(config);
  }
  
  async traduzirProduto(produtoId: string) {
    const produto = await fetch(`/api/produtos/${produtoId}`).then(r => r.json());
    
    const texto = `
      ${produto.nome}. 
      Preço: ${produto.preco}. 
      ${produto.descricao}
    `;
    
    return await this.player.translateAndPlay(texto);
  }
  
  async traduzirCarrinho() {
    const itens = this.getItensCarrinho();
    const total = this.calcularTotal();
    
    const texto = `
      Carrinho com ${itens.length} itens. 
      Total: ${total}. 
      ${itens.map(item => `${item.nome}, quantidade ${item.qty}`).join('. ')}
    `;
    
    return await this.player.translateAndPlay(texto);
  }
}
```

### Tutorial Interativo

```typescript
class TutorialVLibras {
  private player: VLibrasPlayer;
  private passoAtual = 0;
  private passos: string[] = [];
  
  constructor(passos: string[]) {
    this.passos = passos;
    
    const config = usePreset('education', {
      showProgress: true,
      allowSkip: true,
      showSubtitles: true
    });
    
    this.player = new VLibrasPlayer(config);
  }
  
  async iniciarTutorial() {
    await this.player.loadAsync('#vlibras');
    await this.reproduzirPasso();
  }
  
  private async reproduzirPasso() {
    if (this.passoAtual >= this.passos.length) {
      await this.finalizarTutorial();
      return;
    }
    
    const passo = this.passos[this.passoAtual];
    const progressoTexto = `Passo ${this.passoAtual + 1} de ${this.passos.length}`;
    
    // Reproduzir passo com progresso
    await this.player.translateAndPlay(`${progressoTexto}. ${passo}`);
    
    // Aguardar interação do usuário
    await this.aguardarProximoPasso();
  }
  
  private async aguardarProximoPasso() {
    return new Promise<void>(resolve => {
      const botaoProximo = document.getElementById('proximo-passo');
      botaoProximo?.addEventListener('click', () => {
        this.passoAtual++;
        this.reproduzirPasso();
        resolve();
      }, { once: true });
    });
  }
  
  private async finalizarTutorial() {
    await this.player.translateAndPlay('Tutorial finalizado! Parabéns!');
  }
}

// Uso
const tutorial = new TutorialVLibras([
  'Bem-vindo ao tutorial!',
  'Primeiro, clique no botão verde',
  'Agora digite seu nome no campo',
  'Por último, clique em salvar'
]);

await tutorial.iniciarTutorial();
```

---

## 🎯 Melhores Práticas v2.3.0

### ✅ Performance
- Use `waitForReady()` antes de operações críticas
- Implemente presets adequados ao seu caso de uso
- Configure cache inteligente para conteúdo repetitivo
- Use responsive config para otimização automática

### ✅ UX/Acessibilidade
- Sempre forneça feedback visual durante carregamento
- Use presets apropriados para seu contexto
- Implemente tratamento de erros robusto
- Configure temas adequados ao seu design

### ✅ Desenvolvimento
- Use utilitários de teste para garantir qualidade
- Implemente mock players em ambiente de desenvolvimento
- Configure diagnósticos em modo debug
- Use TypeScript para type-safety completa

---

**Implementado com ❤️ para tornar a web mais acessível!**
