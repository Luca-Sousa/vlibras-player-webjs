# VLibras Player WebJS v2.3.1 - Release Notes

## 🚀 Novidades e Melhorias

### 1. Assets Self-Contained
- Todos os arquivos necessários para o funcionamento do player (UnityLoader.js, .json, .wasm, .data, etc.) agora são empacotados automaticamente junto com a biblioteca.
- Não é mais necessário copiar manualmente os assets para outros projetos. Basta instalar o pacote via NPM e usar normalmente.

### 2. Integração Plug-and-Play
- O player detecta automaticamente o caminho dos assets, sem exigir configuração manual do parâmetro `targetPath`.
- Usuários podem instanciar o player sem se preocupar com paths:
  ```typescript
  import { VLibrasPlayer } from 'vlibras-player-webjs';
  const player = new VLibrasPlayer();
  player.load(document.getElementById('vlibras-container'));
  ```

### 3. Build Moderno
- O processo de build utiliza o plugin `copy-webpack-plugin` para garantir que os assets estejam presentes no diretório de saída e no pacote NPM.
- O campo `files` do `package.json` garante que os assets sejam publicados junto com o código.

### 4. Compatibilidade
- Funciona em ambientes de desenvolvimento, produção, e via CDN, sem necessidade de ajustes adicionais.

## 📦 Como atualizar
- Atualize para a versão 2.3.1 via NPM:
  ```bash
  npm install vlibras-player-webjs@latest
  ```
- Remova qualquer lógica manual de cópia de assets do seu projeto.

## 📝 Observações
- Para personalizações avançadas, ainda é possível sobrescrever o caminho dos assets via parâmetro `targetPath`.
- Recomenda-se atualizar a documentação do seu projeto para refletir a nova integração simplificada.

---
VLibras Team - 2025
