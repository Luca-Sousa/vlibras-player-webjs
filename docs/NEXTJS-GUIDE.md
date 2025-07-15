# VLibras Player WebJS - Guia NextJS

## Compatibilidade com Server-Side Rendering (SSR)

O VLibras Player WebJS v2.4.1 inclui suporte completo para NextJS e outros frameworks SSR. Este guia mostra como usar a biblioteca de forma segura em aplicações NextJS.

## Instalação

```bash
npm install vlibras-player-webjs
```

## Configuração Básica para NextJS

### 1. Provider SSR-Safe

Use o `SSRSafeVLibrasProvider` em vez do provider padrão:

```jsx
// _app.js ou _app.tsx
import { SSRSafeVLibrasProvider } from 'vlibras-player-webjs/react/ssr';

export default function App({ Component, pageProps }) {
  return (
    <SSRSafeVLibrasProvider 
      config={{
        assetsPath: '/vlibras', // assets no diretório public/vlibras/
        debug: process.env.NODE_ENV === 'development'
      }}
    >
      <Component {...pageProps} />
    </SSRSafeVLibrasProvider>
  );
}
```

### 2. Componentes com Import Dinâmico

Para componentes que dependem de APIs do navegador:

```jsx
// components/VLibrasPlayerSSR.js
import { createNextJSVLibrasComponent } from 'vlibras-player-webjs/nextjs';
import { VLibrasPlayer } from 'vlibras-player-webjs/react/components';

// Versão SSR-safe do player
export const VLibrasPlayerSSR = createNextJSVLibrasComponent(VLibrasPlayer, {
  ssr: false, // Desabilita SSR para este componente
  fallback: <div>Carregando VLibras...</div>
});
```

### 3. Hook Dinâmico para NextJS

```jsx
// components/DynamicVLibras.js
import { useNextJSDynamicVLibras } from 'vlibras-player-webjs/nextjs';

const DynamicVLibrasPlayer = useNextJSDynamicVLibras(
  () => import('vlibras-player-webjs/react/components').then(mod => ({ default: mod.VLibrasPlayer })),
  {
    loading: () => <div>Carregando VLibras...</div>,
    ssr: false
  }
);

export default function Page() {
  return (
    <div>
      <h1>Minha Página</h1>
      <DynamicVLibrasPlayer />
    </div>
  );
}
```

## Configuração de Assets

### 1. Estrutura de Diretórios

Organize os assets do VLibras no diretório `public/`:

```
public/
  vlibras/
    playerweb.data.unityweb
    playerweb.json
    playerweb.wasm.code.unityweb
    playerweb.wasm.framework.unityweb
    UnityLoader.js
```

### 2. Otimização de Assets

Para melhor performance, adicione ao `next.config.js`:

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/vlibras/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  },
  
  webpack: (config) => {
    // Otimizações para VLibras
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false
    };
    
    return config;
  }
};
```

## Padrões de Uso

### 1. HOC para Páginas

```jsx
// pages/acessibilidade.js
import { withNextJSVLibras } from 'vlibras-player-webjs/nextjs';
import { VLibrasPlayerSSR } from '../components/VLibrasPlayerSSR';

function AcessibilidadePage() {
  return (
    <div>
      <h1>Página de Acessibilidade</h1>
      <VLibrasPlayerSSR />
    </div>
  );
}

export default withNextJSVLibras(AcessibilidadePage, {
  publicAssetsPath: '/vlibras'
});
```

### 2. Componente NoSSR

Para casos específicos onde você precisa de controle total:

```jsx
// components/VLibrasWrapper.js
import { NoSSR } from 'vlibras-player-webjs/react/ssr';
import { VLibrasPlayer } from 'vlibras-player-webjs/react/components';

export function VLibrasWrapper() {
  return (
    <NoSSR fallback={<div>Carregando recursos de acessibilidade...</div>}>
      <VLibrasPlayer />
    </NoSSR>
  );
}
```

### 3. Hook de Hidratação

```jsx
// hooks/useVLibrasHydrated.js
import { useIsHydrated } from 'vlibras-player-webjs/react/ssr';
import { useSSRSafeVLibrasContext } from 'vlibras-player-webjs/react/ssr';

export function useVLibrasHydrated() {
  const isHydrated = useIsHydrated();
  const vlibras = useSSRSafeVLibrasContext();
  
  return {
    ...vlibras,
    isReady: isHydrated && vlibras.isBrowser
  };
}
```

## Otimizações de Performance

### 1. Preload de Assets

```jsx
// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';
import { NextJSUtils } from 'vlibras-player-webjs/nextjs';

export default function Document() {
  return (
    <Html>
      <Head>
        <NextJSUtils.VLibrasHeadTags />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

### 2. Bundle Splitting

```jsx
// next.config.js
module.exports = {
  experimental: {
    optimizePackageImports: ['vlibras-player-webjs']
  },
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups.vlibras = {
        name: 'vlibras',
        test: /vlibras-player-webjs/,
        chunks: 'all',
        priority: 10
      };
    }
    
    return config;
  }
};
```

## Solução de Problemas

### Erro: "window is not defined"

**Solução**: Use os componentes SSR-safe:

```jsx
// ❌ Errado
import { VLibrasPlayer } from 'vlibras-player-webjs/react/components';

// ✅ Correto
import { createNextJSVLibrasComponent } from 'vlibras-player-webjs/nextjs';
import { VLibrasPlayer as BasePlayer } from 'vlibras-player-webjs/react/components';

const VLibrasPlayer = createNextJSVLibrasComponent(BasePlayer, { ssr: false });
```

### Erro: "Hydration mismatch"

**Solução**: Use o hook `useIsHydrated`:

```jsx
import { useIsHydrated } from 'vlibras-player-webjs/react/ssr';

function MyComponent() {
  const isHydrated = useIsHydrated();
  
  if (!isHydrated) {
    return <div>Carregando...</div>;
  }
  
  return <VLibrasPlayer />;
}
```

### Assets não encontrados

**Solução**: Verifique os caminhos e configure corretamente:

```jsx
// Certifique-se de que os assets estão em public/vlibras/
<SSRSafeVLibrasProvider 
  config={{
    assetsPath: '/vlibras' // Sem barra no final
  }}
>
```

## Exemplo Completo

```jsx
// pages/index.js
import { NextJSPageWrapper } from 'vlibras-player-webjs/nextjs';
import { VLibrasPlayerSSR } from '../components/VLibrasPlayerSSR';

export default function HomePage() {
  return (
    <NextJSPageWrapper vlibrasConfig={{ publicAssetsPath: '/vlibras' }}>
      <main>
        <h1>Bem-vindo!</h1>
        <p>Esta página inclui tradução para Libras.</p>
        <VLibrasPlayerSSR />
      </main>
    </NextJSPageWrapper>
  );
}

export async function getStaticProps() {
  return NextJSUtils.getVLibrasStaticProps();
}
```

## Migração de Versões Anteriores

Se você estava usando versões anteriores sem suporte SSR:

```jsx
// Antes (v2.3.x)
import { VLibrasProvider, VLibrasPlayer } from 'vlibras-player-webjs';

// Depois (v2.4.1+)
import { SSRSafeVLibrasProvider } from 'vlibras-player-webjs/react/ssr';
import { createNextJSVLibrasComponent } from 'vlibras-player-webjs/nextjs';
import { VLibrasPlayer as BasePlayer } from 'vlibras-player-webjs/react/components';

const VLibrasPlayer = createNextJSVLibrasComponent(BasePlayer, { ssr: false });
```

## Recursos Adicionais

- [Documentação completa da API](./API.md)
- [Guia de Performance](./PERFORMANCE.md)
- [VLibras Official](https://vlibras.gov.br)
