# Exemplos das Novas Funcionalidades v2.2.0

## 🎯 **Sistema de Eventos Avançado**

### Eventos Básicos
```typescript
import { VLibrasPlayer } from 'vlibras-player-webjs';

const player = new VLibrasPlayer();

// Eventos do player
player.on('player:ready', (data) => {
  console.log('Player carregado:', data.timestamp);
});

player.on('player:error', (data) => {
  console.error('Erro no player:', data.error.message);
});

// Eventos de tradução
player.on('translation:start', (data) => {
  console.log(`Iniciando tradução: "${data.text}"`);
});

player.on('translation:complete', (data) => {
  console.log(`Tradução concluída em ${data.duration}ms`);
  console.log(`Glosa gerada: ${data.gloss}`);
});

// Eventos de animação
player.on('animation:progress', (data) => {
  console.log(`Progresso: ${data.progress}% (frame ${data.currentFrame})`);
});

player.on('animation:complete', (data) => {
  console.log(`Animação concluída! Duração: ${data.duration}ms, Frames: ${data.totalFrames}`);
});
```

### Eventos de Performance
```typescript
// Monitoramento automático de performance
player.on('performance:slow', (data) => {
  console.warn(`Operação lenta detectada: ${data.operation} (${data.duration}ms)`);
});

player.on('performance:memory', (data) => {
  if (data.usage > data.limit * 0.8) {
    console.warn('Alto uso de memória detectado');
  }
});

// Eventos de cache
player.on('cache:hit', (data) => {
  console.log(`Cache hit: ${data.key} (${data.size} bytes)`);
});

player.on('cache:miss', (data) => {
  console.log(`Cache miss: ${data.key}`);
});
```

### Utilitários de Eventos
```typescript
import { VLibrasEventUtils } from 'vlibras-player-webjs';

// Aguardar por um evento específico
try {
  const data = await VLibrasEventUtils.waitForEvent(player.eventEmitter, 'player:ready', 5000);
  console.log('Player pronto:', data);
} catch (error) {
  console.error('Timeout aguardando player ficar pronto');
}

// Debounce para eventos frequentes
const cleanup = VLibrasEventUtils.debounceEvent(
  player.eventEmitter,
  'animation:progress',
  (data) => {
    // Atualiza UI apenas a cada 300ms
    updateProgressBar(data.progress);
  },
  300
);

// Limpeza
cleanup();
```

## 🔧 **DevTools e Diagnósticos**

### Diagnósticos Completos
```typescript
import { VLibrasDevTools } from 'vlibras-player-webjs';

// Executar diagnósticos completos
const diagnostics = await VLibrasDevTools.runDiagnostics();

console.log('=== DIAGNÓSTICOS VLIBRAS ===');
console.log('WebGL:', diagnostics.webgl.supported ? '✅' : '❌');
console.log('Assets:', diagnostics.assets.available ? '✅' : '❌');
console.log('Browser:', diagnostics.compatibility.supported ? '✅' : '❌');

// Verificar recomendações
diagnostics.recommendations.forEach(rec => {
  console.log('💡', rec);
});

// Exemplo de uso prático
if (!diagnostics.webgl.supported) {
  alert('Seu navegador não suporta WebGL. Atualize para uma versão mais recente.');
}

if (diagnostics.assets.loadTime > 3000) {
  console.warn('Assets carregando lentamente. Considere usar CDN.');
}
```

### Profiling de Performance
```typescript
// Iniciar profiling
VLibrasDevTools.startProfiling();

// Fazer operações
await player.load(container);
await player.translate('Olá mundo');
await player.play();

// Obter relatório
const report = VLibrasDevTools.stopProfiling();

console.log('=== RELATÓRIO DE PERFORMANCE ===');
console.log(`Operações executadas: ${report.summary.totalOperations}`);
console.log(`Tempo médio: ${report.summary.averageDuration.toFixed(2)}ms`);
console.log(`Operação mais lenta: ${report.summary.slowestOperation}`);
console.log(`Pico de memória: ${report.summary.memoryPeak / 1024}KB`);
```

### Debug Mode Avançado
```typescript
// Ativar debug mode
VLibrasDevTools.enableDebugMode();

// Informações de debug
const debugInfo = VLibrasDevTools.getDebugInfo();
console.log('=== DEBUG INFO ===');
console.log(`Versão: ${debugInfo.version}`);
console.log(`Ambiente: ${debugInfo.environment}`);
console.log(`Features: ${debugInfo.features.join(', ')}`);

// Logging estruturado
import { VLibrasLogger } from 'vlibras-player-webjs';

VLibrasLogger.info('Player inicializado', { player: 'main' });
VLibrasLogger.warn('Performance degradada', { operation: 'translate', duration: 2500 });
VLibrasLogger.error('Erro crítico', { error: 'Unity bridge falhou' });

// Obter logs
const logs = VLibrasLogger.getLogs();
console.log('Últimos logs:', logs.slice(-10));
```

## ⚙️ **Configuração Global**

### Configuração Básica
```typescript
import { VLibrasGlobalConfig } from 'vlibras-player-webjs';

// Configuração inicial
VLibrasGlobalConfig.configure({
  assetsPath: '/assets/vlibras',
  defaultRegion: 'BR',
  theme: 'dark',
  debug: true,
  
  performance: {
    preloadAssets: true,
    cacheEnabled: true,
    maxCacheSize: 100, // 100MB
    enableGPUAcceleration: true
  },
  
  accessibility: {
    announceStateChanges: true,
    keyboardNavigation: true,
    reduceMotion: false,
    screenReaderSupport: true
  }
});

// Usar configuração em players
const player1 = new VLibrasPlayer(); // Usa config global
const player2 = new VLibrasPlayer(); // Usa config global

// Override específico
const playerCustom = new VLibrasPlayer({
  targetPath: '/custom/path' // Override apenas para este player
});
```

### Auto-Configuração Inteligente
```typescript
import { VLibrasConfigUtils } from 'vlibras-player-webjs';

// Detectar configuração ideal automaticamente
VLibrasConfigUtils.applyOptimalConfig();

// Ou configurar manualmente baseado no dispositivo
const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);

if (isMobile) {
  VLibrasGlobalConfig.configure(VLibrasConfigUtils.getMobileConfig());
} else {
  VLibrasGlobalConfig.configure(VLibrasConfigUtils.getDesktopConfig());
}

// Listener para mudanças
const cleanup = VLibrasGlobalConfig.onChange((newConfig) => {
  console.log('Configuração atualizada:', newConfig);
});

// Cleanup
cleanup();
```

### Configuração por Ambiente
```typescript
// Auto-configuração baseada no ambiente
VLibrasGlobalConfig.autoConfigureForEnvironment();

// Desenvolvimento: debug on, preload off
// Produção: debug off, preload on, cache otimizado

// Configuração manual por ambiente
if (process.env.NODE_ENV === 'development') {
  VLibrasGlobalConfig.configure({
    debug: true,
    enableStats: true,
    performance: { preloadAssets: false } // Mais rápido em dev
  });
}

if (process.env.NODE_ENV === 'production') {
  VLibrasGlobalConfig.configure({
    debug: false,
    analytics: { enabled: true },
    performance: { preloadAssets: true } // Melhor UX em prod
  });
}
```

## 💾 **Cache Inteligente**

### Uso Básico
```typescript
import { vlibrasCache, VLibrasCache } from 'vlibras-player-webjs';

// Configurar cache
VLibrasCache.configure({
  type: 'hybrid', // memory + localStorage + indexedDB
  maxSize: 50, // 50MB
  ttl: 3600, // 1 hora
  compression: true
});

// Armazenar dados
await vlibrasCache.set('gloss:olá', 'dados_da_glosa_ola', 7200); // TTL customizado

// Recuperar dados
const gloss = await vlibrasCache.get('gloss:olá');
if (gloss) {
  console.log('Cache hit:', gloss);
} else {
  console.log('Cache miss - precisa buscar');
}

// Verificar se existe
const exists = await vlibrasCache.has('gloss:olá');

// Remover item
await vlibrasCache.delete('gloss:olá');

// Limpar todo cache
await vlibrasCache.clear();
```

### Cache Preditivo e Por Contexto
```typescript
// Preload de palavras comuns
await vlibrasCache.preloadCommonWords([
  'olá', 'obrigado', 'por favor', 'com licença', 'bom dia'
]);

// Cache por contexto
await vlibrasCache.preloadForContext('quiz'); // Palavras de quiz
await vlibrasCache.preloadForContext('dictionary'); // Palavras de dicionário  
await vlibrasCache.preloadForContext('tutorial'); // Palavras de tutorial

// Cache preditivo (futuro)
await vlibrasCache.enablePredictiveCache({
  enabled: true,
  relatedWordsLimit: 10,
  commonWordsLimit: 50,
  contextWords: {
    'saudação': ['olá', 'oi', 'bom dia', 'boa tarde'],
    'despedida': ['tchau', 'até logo', 'boa noite']
  }
});
```

### Estatísticas e Monitoramento
```typescript
// Obter estatísticas
const stats = vlibrasCache.getStats();

console.log('=== ESTATÍSTICAS DO CACHE ===');
console.log(`Hit rate: ${(stats.hitRate * 100).toFixed(1)}%`);
console.log(`Tamanho atual: ${(stats.currentSize / 1024 / 1024).toFixed(1)}MB`);
console.log(`Entradas: ${stats.entries}`);
console.log(`Requests totais: ${stats.totalRequests}`);

// Monitoramento automático
player.on('cache:hit', (data) => {
  console.log(`✅ Cache hit: ${data.key} (economia de rede)`);
});

player.on('cache:miss', (data) => {
  console.log(`❌ Cache miss: ${data.key} (buscar na rede)`);
});

// Utilitários
import { VLibrasCacheUtils } from 'vlibras-player-webjs';

// Chaves padronizadas
const key = VLibrasCacheUtils.createKey('gloss', 'BR', 'olá');
// Resultado: "gloss:BR:olá"

// Tamanho ideal para o dispositivo
const optimalSize = VLibrasCacheUtils.getOptimalCacheSize();
console.log(`Tamanho ideal: ${optimalSize}MB`);
```

## 🚀 **Integração Completa**

### Exemplo de App Completo
```typescript
import { 
  VLibrasPlayer, 
  VLibrasGlobalConfig, 
  VLibrasDevTools,
  VLibrasConfigUtils,
  vlibrasCache 
} from 'vlibras-player-webjs';

class VLibrasApp {
  private player: VLibrasPlayer;

  async initialize() {
    // 1. Configuração global otimizada
    VLibrasConfigUtils.applyOptimalConfig();
    
    // 2. Configurações customizadas
    VLibrasGlobalConfig.configure({
      debug: process.env.NODE_ENV === 'development',
      analytics: { enabled: true, anonymizeData: true }
    });

    // 3. Cache inteligente
    await vlibrasCache.preloadForContext('dictionary');

    // 4. Player com eventos
    this.player = new VLibrasPlayer();
    this.setupEvents();

    // 5. Diagnósticos (opcional)
    if (VLibrasGlobalConfig.get('debug')) {
      await this.runDiagnostics();
    }

    // 6. Configuração automática
    this.player.setupUnityBridge();
    this.player.setupOptimizedCSS('.vlibras-container');
  }

  private setupEvents() {
    // Performance monitoring
    this.player.on('performance:slow', (data) => {
      console.warn(`Operação lenta: ${data.operation} (${data.duration}ms)`);
    });

    // Error handling
    this.player.on('player:error', (data) => {
      console.error('Erro no VLibras:', data.error);
      // Implement retry logic
    });

    // User feedback
    this.player.on('translation:start', () => {
      this.showLoadingIndicator();
    });

    this.player.on('animation:complete', () => {
      this.hideLoadingIndicator();
    });
  }

  private async runDiagnostics() {
    const diagnostics = await this.player.runDiagnostics();
    
    if (!diagnostics.webgl.supported) {
      this.showWebGLWarning();
    }

    if (!diagnostics.assets.available) {
      this.showAssetsError();
    }

    console.log('Diagnósticos:', diagnostics);
  }

  private showLoadingIndicator() {
    // Implementar UI de loading
  }

  private hideLoadingIndicator() {
    // Esconder UI de loading
  }

  private showWebGLWarning() {
    // Mostrar aviso sobre WebGL
  }

  private showAssetsError() {
    // Mostrar erro de assets
  }
}

// Inicializar app
const app = new VLibrasApp();
app.initialize().then(() => {
  console.log('VLibras App inicializado com sucesso!');
});
```

### Exemplo para React
```typescript
import React, { useEffect, useState } from 'react';
import { VLibrasPlayer, VLibrasGlobalConfig } from 'vlibras-player-webjs';

function VLibrasComponent() {
  const [player, setPlayer] = useState<VLibrasPlayer | null>(null);
  const [status, setStatus] = useState('initializing');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Configuração global
    VLibrasGlobalConfig.configure({
      theme: 'auto',
      accessibility: { announceStateChanges: true }
    });

    // Criar player
    const vlibras = new VLibrasPlayer();

    // Eventos
    vlibras.on('player:ready', () => setStatus('ready'));
    vlibras.on('translation:start', () => setStatus('translating'));
    vlibras.on('animation:progress', (data) => setProgress(data.progress));
    vlibras.on('animation:complete', () => setStatus('completed'));

    setPlayer(vlibras);

    return () => {
      // Cleanup
      vlibras.removeAllListeners();
    };
  }, []);

  const translate = async (text: string) => {
    if (player) {
      await player.translate(text);
    }
  };

  return (
    <div className="vlibras-component">
      <div className="vlibras-container" />
      
      <div className="controls">
        <button onClick={() => translate('Olá mundo')}>
          Traduzir "Olá mundo"
        </button>
        
        <div className="status">
          Status: {status} {status === 'playing' && `(${progress}%)`}
        </div>
      </div>
    </div>
  );
}
```

## 📊 **Monitoramento e Analytics**

```typescript
// Monitoramento completo
class VLibrasMonitor {
  constructor(private player: VLibrasPlayer) {
    this.setupMonitoring();
  }

  private setupMonitoring() {
    // Performance
    this.player.on('performance:slow', (data) => {
      this.logPerformanceIssue(data);
    });

    // Cache efficiency
    this.player.on('cache:hit', () => this.incrementCacheHits());
    this.player.on('cache:miss', () => this.incrementCacheMisses());

    // Errors
    this.player.on('player:error', (data) => {
      this.logError(data.error);
    });

    // Usage
    this.player.on('translation:complete', (data) => {
      this.logTranslation(data.gloss, data.duration);
    });
  }

  private logPerformanceIssue(data: any) {
    // Send to analytics service
    console.log('Performance issue:', data);
  }

  private incrementCacheHits() {
    // Update metrics
  }

  private incrementCacheMisses() {
    // Update metrics
  }

  private logError(error: Error) {
    // Send to error tracking service
    console.error('VLibras error:', error);
  }

  private logTranslation(gloss: string, duration: number) {
    // Track usage analytics
    console.log(`Translation completed in ${duration}ms`);
  }

  async generateReport() {
    const cacheStats = vlibrasCache.getStats();
    const playerStats = this.player.getStats();
    
    return {
      cache: {
        hitRate: cacheStats.hitRate,
        size: cacheStats.currentSize,
        entries: cacheStats.entries
      },
      player: {
        status: playerStats.status,
        loaded: playerStats.loaded,
        region: playerStats.region
      },
      timestamp: Date.now()
    };
  }
}

// Uso
const monitor = new VLibrasMonitor(player);
const report = await monitor.generateReport();
console.log('Relatório:', report);
```

## 🎯 **Best Practices**

### 1. Inicialização Otimizada
```typescript
// ✅ Bom
async function initializeVLibras() {
  // Configuração global primeiro
  VLibrasConfigUtils.applyOptimalConfig();
  
  // Cache preload em background
  vlibrasCache.preloadForContext('dictionary');
  
  // Player setup
  const player = new VLibrasPlayer();
  player.setupUnityBridge();
  player.setupOptimizedCSS();
  
  return player;
}

// ❌ Evitar
function badInitialization() {
  // Configurações hardcoded
  const player = new VLibrasPlayer({
    targetPath: '/fixed/path' // Não flexível
  });
  // Sem configuração global
  // Sem preload de cache
}
```

### 2. Error Handling Robusto
```typescript
// ✅ Bom
player.on('player:error', async (data) => {
  console.error('Erro:', data.error);
  
  // Retry automático
  if (data.error.message.includes('network')) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Retry operation
  }
  
  // Fallback
  showErrorMessage('Problema temporário. Tente novamente.');
});

// ❌ Evitar
// Sem error handling
player.translate('texto'); // Pode falhar silenciosamente
```

### 3. Performance Monitoring
```typescript
// ✅ Bom
if (VLibrasGlobalConfig.get('debug')) {
  VLibrasDevTools.enableDebugMode();
  
  player.on('performance:slow', (data) => {
    if (data.duration > 2000) {
      console.warn('Operação muito lenta:', data);
    }
  });
}

// Cleanup adequado
useEffect(() => {
  return () => {
    player.removeAllListeners();
    vlibrasCache.clear();
  };
}, []);
```

Essas funcionalidades transformam o VLibras Player em uma solução robusta e completa para desenvolvimento profissional! 🚀
