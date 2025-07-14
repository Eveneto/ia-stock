# 📡 Documentação da API

## 🔗 Base URL
```
Desenvolvimento: http://localhost:8080
Produção: https://api.estoque-ia.com
```

## 🔐 Autenticação

### Headers Obrigatórios
```http
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

### Obter Token JWT
```http
POST /auth/login
{
    "email": "usuario@exemplo.com",
    "senha": "sua_senha"
}
```

## 📦 Endpoints Detalhados

### Produtos

#### Listar Produtos
```http
GET /api/produtos
```

**Resposta:**
```json
[
    {
        "id": 1,
        "nome": "Notebook Dell",
        "descricao": "Notebook com i5",
        "preco": 2499.99,
        "quantidade": 15
    }
]
```

#### Criar Produto
```http
POST /api/produtos
{
    "nome": "Produto Teste",
    "descricao": "Descrição do produto",
    "preco": 99.99,
    "quantidade": 10
}
```

### Estoque

#### Sugestão IA
```http
POST /api/estoque/sugestao?produtoId=1&mediaVendasDiarias=3.5&diasParaProximaCompra=7
```

**Resposta:**
```json
{
    "sugestaoReposicao": 45,
    "observacao": "Estoque crítico detectado",
    "confianca": 0.92
}
```

## ❌ Códigos de Erro

| Código | Descrição |
|--------|-----------|
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Token inválido |
| 403 | Forbidden - Sem permissão |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Error - Erro do servidor |