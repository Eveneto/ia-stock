# Docker Setup Guide - Estoque IA

## 📋 Resumo

Este projeto foi completamente dockerizado com três serviços principais:
- **Backend**: Spring Boot (Java) - Porta 8080
- **IA Microservice**: FastAPI (Python) - Porta 5000  
- **Database**: MySQL 8.0 - Porta 3307

## 🚀 Quick Start

### Usando o Script de Gerenciamento (Recomendado)

```bash
# Dar permissão de execução (apenas na primeira vez)
chmod +x docker-manager.sh

# Construir e iniciar todos os serviços
./docker-manager.sh build
./docker-manager.sh up

# Verificar status
./docker-manager.sh status

# Testar APIs
./docker-manager.sh test

# Ver logs
./docker-manager.sh logs

# Parar serviços
./docker-manager.sh down
```

### Comandos Docker Manuais

```bash
# Construir e iniciar
docker-compose up --build -d

# Parar
docker-compose down

# Ver logs
docker-compose logs -f [service_name]

# Status
docker ps
```

## 🛠️ Comandos Disponíveis no Script

| Comando | Descrição |
|---------|-----------|
| `build` | Constrói todas as imagens Docker |
| `up` | Inicia todos os serviços |
| `down` | Para todos os serviços |
| `restart` | Reinicia todos os serviços |
| `logs [service]` | Mostra logs (opcional: serviço específico) |
| `status` | Mostra status e uso de recursos |
| `clean` | Remove containers, imagens e volumes não utilizados |
| `test` | Testa endpoints das APIs |

## 🌐 Endpoints Disponíveis

### Backend (Spring Boot)
- **Base URL**: http://localhost:8080
- **Health Check**: `GET /auth/test`
- **API Docs**: Verificar controller para rotas completas

### IA Microservice (FastAPI)
- **Base URL**: http://localhost:5000
- **Health Check**: `GET /`
- **API Docs**: http://localhost:5000/docs (Swagger UI)
- **Predição**: `POST /predict` (ver schemas para formato)

### Database (MySQL)
- **Host**: localhost
- **Port**: 3307
- **Database**: estoque_ia
- **User**: estoque_user
- **Password**: estoque_password

## 📁 Estrutura de Arquivos Docker

```
estoque-ia/
├── docker-compose.yml          # Orquestração dos serviços
├── docker-manager.sh           # Script de gerenciamento
├── backend/
│   ├── Dockerfile              # Imagem do Spring Boot
│   └── .dockerignore           # Exclusões do build
└── ia-microservice/
    ├── Dockerfile              # Imagem do FastAPI
    └── .dockerignore           # Exclusões do build
```

## 🔧 Troubleshooting

### Problemas Comuns

1. **Porta já em uso**
   ```bash
   sudo lsof -i :8080  # Verificar porta 8080
   sudo lsof -i :5000  # Verificar porta 5000
   sudo lsof -i :3307  # Verificar porta 3307
   ```

2. **Erro de permissão no script**
   ```bash
   chmod +x docker-manager.sh
   ```

3. **Container não inicia**
   ```bash
   docker-compose logs [service_name]
   ```

4. **Limpeza completa**
   ```bash
   ./docker-manager.sh clean
   # ou
   docker system prune -a --volumes
   ```

### Verificação de Saúde

```bash
# Verificar se todos os serviços estão respondendo
curl http://localhost:8080/auth/test
curl http://localhost:5000/

# Verificar logs em tempo real
docker-compose logs -f backend
docker-compose logs -f ia
docker-compose logs -f db
```

## 🚀 Deploy e Produção

Para ambiente de produção, considere:

1. **Variáveis de Ambiente**: Use `.env` file para configurações sensíveis
2. **Volumes**: Configure volumes persistentes para dados
3. **Health Checks**: Implemente health checks nos Dockerfiles
4. **Monitoring**: Adicione ferramentas de monitoramento
5. **Load Balancer**: Configure load balancer para alta disponibilidade

## 📊 Monitoramento de Recursos

O script `docker-manager.sh status` mostra:
- Status de cada container
- Uso de CPU e memória
- Tráfego de rede
- I/O de disco
- Número de processos

## 🔄 Atualizações

Para atualizar os serviços:

```bash
# Parar serviços
./docker-manager.sh down

# Reconstruir com últimas alterações
./docker-manager.sh build

# Iniciar novamente
./docker-manager.sh up
```

---

**Nota**: Este setup foi otimizado para desenvolvimento. Para produção, ajuste as configurações de segurança, volumes e rede conforme necessário.
