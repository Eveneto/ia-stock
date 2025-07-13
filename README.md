# Estoque IA - Sistema Inteligente de Gestão de Estoque

Sistema completo de gestão de estoque com inteligência artificial para sugestões automáticas de reposição.

## 🏗️ Arquitetura

- **Backend**: Spring Boot (Java) - API REST e autenticação
- **IA Microservice**: FastAPI (Python) - Modelo de machine learning para previsões
- **Database**: MySQL - Armazenamento de dados
- **Containerização**: Docker + Docker Compose

## 🚀 Início Rápido com Docker

O projeto está completamente dockerizado para facilitar o desenvolvimento e deploy.

### Pré-requisitos
- Docker
- Docker Compose

### Execução
```bash
# Clonar o repositório
git clone <repository-url>
cd estoque-ia

# Dar permissão de execução ao script de gerenciamento
chmod +x docker-manager.sh

# Construir e iniciar todos os serviços
./docker-manager.sh build
./docker-manager.sh up

# Verificar se tudo está funcionando
./docker-manager.sh test
```

### Acesso aos Serviços
- **Backend API**: http://localhost:8080
- **IA Microservice**: http://localhost:5000
- **IA API Docs**: http://localhost:5000/docs
- **MySQL**: localhost:3307

## 📚 Documentação Completa

- **[Setup Docker](DOCKER.md)** - Guia completo de dockerização
- **[Roadmap](ROADMAP.md)** - Planejamento e funcionalidades

## 🛠️ Gerenciamento dos Serviços

Use o script `docker-manager.sh` para facilitar o gerenciamento:

```bash
./docker-manager.sh build     # Construir imagens
./docker-manager.sh up        # Iniciar serviços
./docker-manager.sh down      # Parar serviços
./docker-manager.sh status    # Ver status e recursos
./docker-manager.sh logs      # Ver logs
./docker-manager.sh test      # Testar APIs
./docker-manager.sh clean     # Limpeza completa
```

## 🔧 Desenvolvimento

### Estrutura do Projeto
```
estoque-ia/
├── backend/              # Spring Boot API
├── ia-microservice/      # FastAPI ML Service
├── docs/                 # Documentação
├── docker-compose.yml    # Orquestração Docker
└── docker-manager.sh     # Script de gerenciamento
```

### Backend (Spring Boot)
- **Tecnologias**: Java, Spring Boot, Spring Security, JPA/Hibernate
- **Porta**: 8080
- **Database**: MySQL

### IA Microservice (FastAPI)
- **Tecnologias**: Python, FastAPI, scikit-learn, pandas
- **Porta**: 5000
- **Modelo**: Regressão para previsão de reposição de estoque

## 🧪 Testes

```bash
# Testar APIs automaticamente
./docker-manager.sh test

# Testar manualmente
curl http://localhost:8080/auth/test
curl http://localhost:5000/
```

## 📊 Monitoramento

```bash
# Ver status e uso de recursos
./docker-manager.sh status

# Logs em tempo real
./docker-manager.sh logs
./docker-manager.sh logs backend  # Serviço específico
```

## 🚀 Deploy

Para ambiente de produção, consulte [DOCKER.md](DOCKER.md) para configurações avançadas de:
- Variáveis de ambiente
- Volumes persistentes
- Health checks
- Monitoramento
- Load balancing

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Nota**: Este projeto foi dockerizado para facilitar o desenvolvimento e deploy. Todos os serviços podem ser executados com um único comando!
