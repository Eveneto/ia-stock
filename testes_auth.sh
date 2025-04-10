#!/bin/bash

echo "🔐 Testando Autenticação de Usuários..."

# Dados do usuário
NOME="João Teste"
EMAIL="joao@email.com"
SENHA="123456"

echo "📝 Registrando usuário..."
RESPONSE=$(curl -s -X POST http://localhost:8080/auth/register \
-H "Content-Type: application/json" \
-d "{\"nome\": \"$NOME\", \"email\": \"$EMAIL\", \"senha\": \"$SENHA\"}")

echo "Resposta do registro:"
echo "$RESPONSE"

echo "🔑 Realizando login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8080/auth/login \
-H "Content-Type: application/json" \
-d "{\"email\": \"$EMAIL\", \"senha\": \"$SENHA\"}")

echo "Resposta do login:"
echo "$LOGIN_RESPONSE"

# Extraindo token (se a resposta for JSON no formato {"token": "..."} )
TOKEN=$(echo $LOGIN_RESPONSE | sed -E 's/.*"token":"([^"]+)".*/\1/')

echo "📄 Token JWT:"
echo "$TOKEN"
