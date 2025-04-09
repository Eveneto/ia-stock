#!/bin/bash

echo "🔧 Testando Controle de Estoque..."

PRODUTO_ID=2  # ajuste se quiser testar outro ID

echo "📦 Produto atual:"
curl -s http://localhost:8080/api/produtos/$PRODUTO_ID | jq

echo "⬆️ Entrada de estoque (+5)..."
curl -s -X POST "http://localhost:8080/api/estoque/entrada/$PRODUTO_ID?quantidade=5"

echo "📦 Produto após entrada:"
curl -s http://localhost:8080/api/produtos/$PRODUTO_ID | jq

echo "⬇️ Saída de estoque (-3)..."
curl -s -X POST "http://localhost:8080/api/estoque/saida/$PRODUTO_ID?quantidade=3"

echo "📦 Produto após saída:"
curl -s http://localhost:8080/api/produtos/$PRODUTO_ID | jq

echo "🚫 Testando saída com quantidade maior que estoque..."
curl -s -X POST "http://localhost:8080/api/estoque/saida/$PRODUTO_ID?quantidade=9999"

echo "🛑 Testando movimentação em produto inexistente..."
curl -s -X POST "http://localhost:8080/api/estoque/entrada/999?quantidade=1"
curl -s -X POST "http://localhost:8080/api/estoque/saida/999?quantidade=1"

echo "✅ Testes de controle de estoque finalizados."
