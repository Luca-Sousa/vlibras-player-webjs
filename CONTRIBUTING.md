# Contributing to VLibras Player WebJS

Obrigado por considerar contribuir para o VLibras Player WebJS! 🎉

## 🚀 Como Contribuir

### 1. Fork e Clone
```bash
git clone https://github.com/seu-usuario/vlibras-player-webjs.git
cd vlibras-player-webjs
```

### 2. Instale Dependências
```bash
npm install
```

### 3. Execute em Modo Desenvolvimento
```bash
npm run dev
```

### 4. Execute os Testes
```bash
npm test
npm run test:watch  # Para modo watch
```

## 📋 Diretrizes de Desenvolvimento

### Estrutura do Projeto
```
src/
├── types/           # Definições TypeScript
├── VLibrasPlayer.ts # Classe principal
├── GlosaTranslator.ts
├── PlayerManagerAdapter.ts
├── config.ts
└── index.ts
```

### Padrões de Código
- **TypeScript** para todo código novo
- **Interfaces** para todas as APIs públicas
- **JSDoc** para documentação de métodos
- **Testes** obrigatórios para novas funcionalidades

### Convenções de Commit
```
feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
test: adiciona ou modifica testes
refactor: refatora código
chore: tarefas de manutenção
```

## 🧪 Testes

### Executar Testes
```bash
npm test                 # Todos os testes
npm run test:watch      # Modo watch
npm run test:coverage   # Com coverage
```

### Escrever Testes
```typescript
import { VLibrasPlayer } from '../VLibrasPlayer';

describe('VLibrasPlayer', () => {
  test('should create instance', () => {
    const player = new VLibrasPlayer();
    expect(player).toBeInstanceOf(VLibrasPlayer);
  });
});
```

## 📦 Build e Release

### Build Local
```bash
npm run build  # Gera dist/ com todos os formatos
```

### Verificar Qualidade
```bash
npm run lint    # ESLint
npm test        # Testes
npm run build   # Build final
```

## 🐛 Reportando Bugs

Ao reportar bugs, inclua:
- **Versão** do VLibras Player WebJS
- **Navegador** e versão
- **Framework** usado (React, Vue, etc.)
- **Passos** para reproduzir
- **Comportamento esperado** vs **atual**

### Template de Bug Report
```markdown
**Versão:** 2.0.0
**Navegador:** Chrome 91
**Framework:** React 18

**Passos:**
1. Inicializar player
2. Chamar translate()
3. Erro ocorre

**Esperado:** Tradução funcionar
**Atual:** Erro na console
```

## 💡 Sugerindo Features

Para sugerir novas funcionalidades:
1. Verifique se já existe issue similar
2. Descreva o caso de uso
3. Explique como beneficiaria outros usuários
4. Proponha uma API se aplicável

## 🔄 Pull Request Process

### Antes de Submeter
```bash
npm run lint        # ✅ Sem erros de lint
npm test           # ✅ Todos os testes passando
npm run build      # ✅ Build sem erros
```

### Template de PR
```markdown
## Descrição
Breve descrição das mudanças

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## Checklist
- [ ] Testes adicionados/atualizados
- [ ] Documentação atualizada
- [ ] Lint passing
- [ ] Build successful
```

## 📝 Documentação

### README
- Mantenha exemplos atualizados
- Adicione novos casos de uso
- Documente breaking changes

### JSDoc
```typescript
/**
 * Traduz texto para glosa
 * @param text Texto a ser traduzido
 * @param options Opções de tradução
 * @example
 * ```typescript
 * player.translate('Olá mundo!', { isEnabledStats: true });
 * ```
 */
translate(text: string, options?: TranslateOptions): void;
```

## 🎯 Roadmap

Áreas que precisam de contribuição:
- [ ] Suporte a Web Components
- [ ] Plugin para WordPress
- [ ] Melhorias de performance
- [ ] Mais testes de integração
- [ ] Documentação em inglês

## 🤝 Comunidade

- **Discussões:** GitHub Discussions
- **Issues:** GitHub Issues
- **Chat:** [Discord/Slack se houver]

## 📄 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a LGPL-3.0.

---

**Obrigado por tornar o VLibras melhor! 🚀**
