# Proposta de Estrutura SOLID para VLibras Player WebJS

## Análise da Estrutura Atual

A estrutura atual possui todos os módulos na pasta `src/` raiz, o que dificulta:
- **Single Responsibility**: Módulos com responsabilidades diferentes ficam misturados
- **Open/Closed**: Dificulta extensão sem modificação de código existente
- **Liskov Substitution**: Não há clara separação de abstrações e implementações
- **Interface Segregation**: Interfaces específicas ficam misturadas com implementações
- **Dependency Inversion**: Dependências concretas e abstratas não são claramente separadas

## Nova Estrutura Proposta

```
src/
├── core/                           # Núcleo central - Single Responsibility
│   ├── player/                     # Responsabilidade do Player principal
│   │   ├── VLibrasPlayer.ts
│   │   ├── PlayerManagerAdapter.ts
│   │   └── player.types.ts
│   ├── unity/                      # Responsabilidade da integração Unity
│   │   ├── UnityBridge.ts
│   │   ├── GlosaTranslator.ts
│   │   └── unity.types.ts
│   └── config/                     # Responsabilidade de configuração central
│       ├── config.ts
│       ├── VLibrasGlobalConfig.ts
│       └── config.types.ts
├── infrastructure/                 # Infraestrutura - Dependency Inversion
│   ├── events/                     # Sistema de eventos
│   │   ├── VLibrasEvents.ts
│   │   ├── EventEmitter.ts
│   │   └── events.types.ts
│   ├── cache/                      # Sistema de cache
│   │   ├── VLibrasCache.ts
│   │   ├── CacheStrategy.ts
│   │   └── cache.types.ts
│   ├── styling/                    # Sistema de estilos
│   │   ├── VLibrasCSS.ts
│   │   ├── VLibrasThemes.ts
│   │   └── styling.types.ts
│   └── canvas/                     # Sistema de canvas
│       ├── VLibrasCanvasConfig.ts
│       ├── CanvasOptimizer.ts
│       └── canvas.types.ts
├── features/                       # Funcionalidades específicas - Open/Closed
│   ├── presets/                    # Sistema de presets
│   │   ├── VLibrasPresets.ts
│   │   ├── VLibrasPresetsAdvanced.ts
│   │   ├── PresetManager.ts
│   │   └── presets.types.ts
│   ├── plugins/                    # Sistema de plugins
│   │   ├── VLibrasPlugins.ts
│   │   ├── PluginManager.ts
│   │   ├── interfaces/
│   │   │   ├── IPlugin.ts
│   │   │   └── IPluginRegistry.ts
│   │   └── plugins.types.ts
│   └── devtools/                   # Ferramentas de desenvolvimento
│       ├── VLibrasDevTools.ts
│       ├── Diagnostics.ts
│       ├── Logger.ts
│       └── devtools.types.ts
├── adapters/                       # Adaptadores externos - Interface Segregation
│   ├── frameworks/                 # Adaptadores para frameworks
│   │   ├── react/
│   │   │   ├── VLibrasReact.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useVLibras.ts
│   │   │   │   └── useVLibrasEvents.ts
│   │   │   └── components/
│   │   │       └── VLibrasWidget.tsx
│   │   ├── vue/                    # Futuro suporte Vue
│   │   └── angular/                # Futuro suporte Angular
│   └── testing/                    # Adaptadores para testes
│       ├── VLibrasTestUtils.ts
│       ├── mocks/
│       │   ├── MockPlayer.ts
│       │   └── MockUnity.ts
│       └── testing.types.ts
├── utils/                          # Utilitários compartilhados
│   ├── common/                     # Utilitários comuns
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   └── helpers.ts
│   ├── browser/                    # Utilitários específicos do browser
│   │   ├── detection.ts
│   │   └── performance.ts
│   └── constants/                  # Constantes globais
│       ├── defaults.ts
│       └── messages.ts
├── types/                          # Tipos centralizados - Interface Segregation
│   ├── index.ts                    # Exportação de todos os tipos
│   ├── core.types.ts               # Tipos do núcleo
│   ├── infrastructure.types.ts     # Tipos da infraestrutura
│   ├── features.types.ts           # Tipos das funcionalidades
│   └── external.types.ts           # Tipos de dependências externas
└── __tests__/                      # Testes organizados por módulo
    ├── core/
    ├── infrastructure/
    ├── features/
    ├── adapters/
    ├── utils/
    └── integration/                # Testes de integração
```

## Benefícios da Nova Estrutura

### 1. Single Responsibility Principle (SRP)
- **Antes**: Todos os módulos na pasta `src/` raiz
- **Depois**: Cada pasta tem uma responsabilidade específica:
  - `core/`: Funcionalidades centrais do player
  - `infrastructure/`: Serviços de infraestrutura
  - `features/`: Funcionalidades específicas
  - `adapters/`: Integrações externas
  - `utils/`: Utilitários compartilhados

### 2. Open/Closed Principle (OCP)
- **Plugins**: Sistema extensível em `features/plugins/` com interfaces bem definidas
- **Presets**: Sistema extensível em `features/presets/` para novos presets
- **Adapters**: Facilita adição de novos frameworks sem modificar código existente

### 3. Liskov Substitution Principle (LSP)
- **Interfaces claras**: Pasta `types/` centraliza contratos
- **Abstrações**: Interfaces em `features/plugins/interfaces/`
- **Implementações**: Podem ser substituídas sem quebrar o código

### 4. Interface Segregation Principle (ISP)
- **Tipos específicos**: Cada módulo tem seus próprios tipos
- **Interfaces focadas**: `IPlugin`, `IPluginRegistry`, etc.
- **Contratos mínimos**: Cada interface expõe apenas o necessário

### 5. Dependency Inversion Principle (DIP)
- **Abstrações**: Core depende de interfaces, não implementações
- **Inversão**: Infraestrutura implementa contratos definidos pelo core
- **Injeção**: Facilita testes e mocking