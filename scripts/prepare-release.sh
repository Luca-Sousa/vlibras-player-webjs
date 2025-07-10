#!/bin/bash

# Script de preparação para publicação no npm

echo "🚀 Preparando VLibras Player WebJS para publicação..."

# 1. Limpar dist anterior
echo "🧹 Limpando builds anteriores..."
npm run clean

# 2. Instalar dependências
echo "📦 Instalando dependências..."
npm install

# 3. Executar testes
echo "🧪 Executando testes..."
npm test
if [ $? -ne 0 ]; then
    echo "❌ Testes falharam! Abortando publicação."
    exit 1
fi

# 4. Verificar lint
echo "🔍 Verificando qualidade do código..."
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ Lint falhou! Abortando publicação."
    exit 1
fi

# 5. Build final
echo "🏗️  Executando build final..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build falhou! Abortando publicação."
    exit 1
fi

# 6. Verificar arquivos que serão publicados
echo "📋 Arquivos que serão publicados:"
npm pack --dry-run

echo ""
echo "✅ Preparação concluída com sucesso!"
echo ""
echo "📝 Para publicar:"
echo "   npm version [patch|minor|major]"
echo "   npm publish"
echo ""
echo "🔗 Para testar localmente:"
echo "   npm pack"
echo "   cd ../outro-projeto"
echo "   npm install /caminho/para/vlibras-player-webjs-2.0.0.tgz"
