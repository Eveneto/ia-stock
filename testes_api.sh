#!/bin/bash

API_URL="http://localhost:8080/api/produtos"
CONTENT_TYPE="Content-Type: application/json"

echo "🔧 Testando API de Produtos..."

# Criar produto
echo -e "\n🟢 Criando produto..."
RESPONSE=$(curl -s -X POST $API_URL \
-H "$CONTENT_TYPE" \
-d '{"nome": "Mouse", "descricao": "Mouse sem fio", "quantidade": 20, "preco": 99.90}')
echo "Resposta: $RESPONSE"
ID=$(echo $RESPONSE | grep -oP '"id":\K[0-9]+')

# Listar produtos
echo -e "\n📄 Listando produtos..."
curl -s -X GET $API_URL

# Buscar por ID
echo -e "\n🔍 Buscando produto ID $ID..."
curl -s -X GET "$API_URL/$ID"

# Atualizar produto
echo -e "\n✏️ Atualizando produto ID $ID..."
curl -s -X PUT "$API_URL/$ID" \
-H "$CONTENT_TYPE" \
-d '{"nome": "Mouse Gamer", "descricao": "Mouse com RGB", "quantidade": 15, "preco": 149.90}'

# Buscar atualizado
echo -e "\n🔍 Produto atualizado ID $ID..."
curl -s -X GET "$API_URL/$ID"

# Deletar produto
echo -e "\n🗑️ Deletando produto ID $ID..."
curl -s -X DELETE "$API_URL/$ID"

# Buscar deletado
echo -e "\n❌ Buscando produto deletado (esperado 404)..."
curl -s -w "\nStatus: %{http_code}\n" -X GET "$API_URL/$ID"

# Testar busca inválida
echo -e "\n❌ Testando busca ID inexistente..."
curl -s -w "\nStatus: %{http_code}\n" -X GET "$API_URL/9999"

# Testar update inválido
echo -e "\n❌ Testando atualização de ID inexistente..."
curl -s -w "\nStatus: %{http_code}\n" -X PUT "$API_URL/9999" \
-H "$CONTENT_TYPE" \
-d '{"nome": "Invalido", "descricao": "n/a", "quantidade": 0, "preco": 0.0}'

# Testar delete inválido
echo -e "\n❌ Testando deleção de ID inexistente..."
curl -s -w "\nStatus: %{http_code}\n" -X DELETE "$API_URL/9999"

echo -e "\n✅ Testes finalizados."
