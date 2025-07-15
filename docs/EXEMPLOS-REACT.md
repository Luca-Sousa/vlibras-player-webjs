# 🎯 Exemplos de Uso - React Components

## 📦 **Instalação**

```bash
npm install vlibras-player-webjs@2.4.0
# ou
yarn add vlibras-player-webjs@2.4.0
```

## 🚀 **Uso Básico**

### **1. Importação Correta**

```typescript
// ✅ CORRETO - Usar vlibras-player-webjs/react
import { 
  VLibrasProvider, 
  VLibrasPlayer, 
  VLibrasSettings 
} from 'vlibras-player-webjs/react';

// ✅ CORRETO - Hooks especializados
import { 
  useVLibras,
  useVLibrasTranslation,
  useVLibrasPerformance,
  useVLibrasAccessibility 
} from 'vlibras-player-webjs/react/hooks';

// ✅ CORRETO - Utilitários (opcional)
import { 
  useTextWatcher,
  validateTranslationText 
} from 'vlibras-player-webjs/react/utils';
```

### **2. Exemplo Básico**

```typescript
import React from 'react';
import { VLibrasProvider, VLibrasPlayer } from 'vlibras-player-webjs/react';

function App() {
  return (
    <VLibrasProvider>
      <div>
        <h1>Minha Aplicação</h1>
        <VLibrasPlayer 
          text="Olá! Bem-vindo à nossa aplicação acessível."
          showControls={true}
          allowReplay={true}
        />
      </div>
    </VLibrasProvider>
  );
}

export default App;
```

### **3. Exemplo com Hook de Tradução**

```typescript
import React, { useState } from 'react';
import { VLibrasProvider } from 'vlibras-player-webjs/react';
import { useVLibrasTranslation } from 'vlibras-player-webjs/react/hooks';

function TranslatorComponent() {
  const [text, setText] = useState('');
  
  const {
    translate,
    translateAndPlay,
    isTranslating,
    error,
    translationHistory
  } = useVLibrasTranslation({
    autoTranslate: false,
    debounceMs: 500,
    onTranslationComplete: () => console.log('Tradução concluída!')
  });

  return (
    <div>
      <textarea 
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Digite o texto para traduzir..."
      />
      
      <button 
        onClick={() => translateAndPlay(text)}
        disabled={isTranslating || !text.trim()}
      >
        {isTranslating ? 'Traduzindo...' : 'Traduzir e Reproduzir'}
      </button>

      {error && <p style={{color: 'red'}}>{error}</p>}
      
      <div>
        <h3>Histórico ({translationHistory.length})</h3>
        <ul>
          {translationHistory.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function App() {
  return (
    <VLibrasProvider config={{
      theme: 'auto',
      enableAccessibility: true,
      autoInitialize: true
    }}>
      <TranslatorComponent />
    </VLibrasProvider>
  );
}

export default App;
```

### **4. Exemplo com Configurações Avançadas**

```typescript
import React from 'react';
import { 
  VLibrasProvider, 
  VLibrasPlayer, 
  VLibrasSettings 
} from 'vlibras-player-webjs/react';
import { 
  useVLibrasAccessibility,
  useVLibrasPerformance 
} from 'vlibras-player-webjs/react/hooks';

function AccessibleApp() {
  const accessibility = useVLibrasAccessibility({
    enableScreenReader: true,
    announceTranslations: true,
    enableKeyboardNav: true,
    enableHighContrast: true
  });

  const performance = useVLibrasPerformance({
    enableAnalytics: true,
    collectMetrics: true
  });

  const handleSettingsChange = (settings: any) => {
    console.log('Configurações alteradas:', settings);
    accessibility.announce('Configurações atualizadas');
  };

  return (
    <VLibrasProvider config={{
      theme: 'auto',
      enableAccessibility: true,
      playbackSpeed: 1,
      language: 'pt-BR'
    }}>
      <div>
        <h1>Aplicação Totalmente Acessível</h1>
        
        <VLibrasPlayer 
          text="Esta é uma aplicação com acessibilidade total para pessoas surdas."
          variant="default"
          width={400}
          height={300}
          showControls={true}
          onReady={() => accessibility.announce('VLibras carregado')}
          onTranslationComplete={() => accessibility.announce('Tradução concluída')}
        />

        <VLibrasSettings 
          position="top-right"
          showQuickSettings={true}
          onSettingsChange={handleSettingsChange}
        />

        {performance.metrics && (
          <div style={{ marginTop: '20px', padding: '15px', background: '#f5f5f5' }}>
            <h3>Métricas de Performance</h3>
            <p>Tempo médio: {performance.metrics.translationTime}ms</p>
            <p>Total de traduções: {performance.metrics.totalTranslations}</p>
            <p>Taxa de erro: {(performance.metrics.errorRate * 100).toFixed(2)}%</p>
          </div>
        )}
      </div>
    </VLibrasProvider>
  );
}

export default AccessibleApp;
```

### **5. Exemplo com Validação de Texto**

```typescript
import React, { useState } from 'react';
import { VLibrasProvider, VLibrasPlayer } from 'vlibras-player-webjs/react';
import { useVLibrasTranslation } from 'vlibras-player-webjs/react/hooks';
import { 
  validateTranslationText, 
  prepareTextForLibras 
} from 'vlibras-player-webjs/react/utils';

function ValidatedTranslator() {
  const [text, setText] = useState('');
  const [validation, setValidation] = useState<any>(null);

  const { translate, isTranslating } = useVLibrasTranslation();

  const handleTextChange = (newText: string) => {
    setText(newText);
    const result = validateTranslationText(newText);
    setValidation(result);
  };

  const handleTranslate = async () => {
    if (validation?.isValid) {
      const preparedText = prepareTextForLibras(text);
      await translate(preparedText);
    }
  };

  return (
    <div>
      <div>
        <label htmlFor="text-input">Texto para traduzir:</label>
        <textarea 
          id="text-input"
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Digite o texto..."
          style={{
            border: validation?.isValid === false ? '2px solid red' : '2px solid #ccc'
          }}
        />
      </div>

      {validation && (
        <div>
          {validation.errors.length > 0 && (
            <div style={{ color: 'red' }}>
              <strong>Erros:</strong>
              <ul>
                {validation.errors.map((error: string, index: number) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {validation.warnings.length > 0 && (
            <div style={{ color: 'orange' }}>
              <strong>Avisos:</strong>
              <ul>
                {validation.warnings.map((warning: string, index: number) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <button 
        onClick={handleTranslate}
        disabled={!validation?.isValid || isTranslating}
      >
        {isTranslating ? 'Traduzindo...' : 'Traduzir'}
      </button>

      <VLibrasPlayer text={text} />
    </div>
  );
}

function App() {
  return (
    <VLibrasProvider>
      <ValidatedTranslator />
    </VLibrasProvider>
  );
}

export default App;
```

## 🔧 **Configurações Avançadas**

### **Provider com Configuração Completa**

```typescript
<VLibrasProvider config={{
  targetPath: '/assets/vlibras', // Caminho dos assets
  theme: 'auto', // 'light' | 'dark' | 'auto' | 'high-contrast'
  autoInitialize: true, // Inicializar automaticamente
  enableCache: true, // Habilitar cache
  debug: false, // Modo debug
  playbackSpeed: 1, // Velocidade de reprodução
  language: 'pt-BR', // Idioma
  enableAccessibility: true // Acessibilidade
}}>
  <YourApp />
</VLibrasProvider>
```

## 🎯 **Dicas de Uso**

### **1. Performance**
- Use `useVLibrasPerformance` para monitorar a aplicação
- Habilite cache para melhor performance
- Use debounce em traduções automáticas

### **2. Acessibilidade**
- Sempre use `VLibrasProvider` no topo da aplicação
- Configure `enableAccessibility: true`
- Use `useVLibrasAccessibility` para funcionalidades avançadas

### **3. Troubleshooting**

#### **Erro de Importação**
```typescript
// ❌ ERRADO
import { VLibrasPlayer } from 'vlibras-player-webjs/react/components';

// ✅ CORRETO
import { VLibrasPlayer } from 'vlibras-player-webjs/react';
```

#### **Assets não encontrados**
```typescript
// Configure o caminho correto
<VLibrasProvider config={{
  targetPath: '/public/vlibras-assets' // Seu caminho
}}>
```

#### **TypeScript**
```typescript
// Instale os tipos do React se necessário
npm install --save-dev @types/react @types/react-dom
```

## 📚 **Recursos Adicionais**

- [Documentação Completa](./RELEASE-v2.4.0.md)
- [Exemplos Avançados](./demo/demo-v2.4.0.html)
- [Guia de Acessibilidade](https://vlibras.gov.br)
