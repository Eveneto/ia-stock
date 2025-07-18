# 🛠️ Roadmap de Desenvolvimento - Sistema de Gerenciamento de Estoque com IA

---

## ✅ Etapa 1 – Preparação do Ambiente
- [x] Instalar Java 17
- [x] Instalar Maven
- [x] Instalar Docker + Docker Compose
- [x] Configurar VS Code com extensões
- [x] Testar ambiente com comandos básicos

---

## 📐 Etapa 2 – Planejamento e Modelagem
- [X] Definir escopo do sistema
- [X] Modelar entidades principais (Produto, Usuário, Estoque, etc.)
- [X] Definir relacionamento entre entidades
- [X] Escolher banco de dados (MySQL)

---

## 🧱 Etapa 3 – Criação do Projeto Backend
- [X] Gerar projeto Spring Boot com Maven
- [X] Criar estrutura de pacotes (controller, service, repository, model, dto)
- [X] Configurar banco de dados com Docker
- [X] Configurar `application.yml` ou `application.properties`

---

## 🧑‍💻 Etapa 4 – Funcionalidades principais (API REST)
- [X] CRUD de produtos
- [X] Controle de estoque
- [X] CRUD de usuários com autenticação JWT 
- [X] Regras de negócio básicas
- [X] Testes unitários (JUnit)

---

## 🧠 Etapa 5 – Integração da IA
- [X] Escolher estratégia (TensorFlow / microserviço Python)
- [X] Criar endpoint de sugestão inteligente de compra/reposição
- [X] Treinar modelo com dados simulados
- [X] Refinar os dados e salvar o modelo definitivo 
- [X] Integrar IA ao backend


---

## 🐳 Etapa 6 – Dockerização do Backend
- [X] Criar Dockerfile para o backend
- [X] Criar docker-compose.yml com banco e backend
- [X] Testar orquestração com containers

---

## 🧪 Etapa 7 – Testes e Documentação
- [ ] Criar testes de integração (ADIADO)
- [X] Documentar endpoints com Swagger/OpenAPI
- [X] Criar script de carga de dados fake
- [X] Escrever documentação do projeto

---

## 🎨 Etapa 8 – Desenvolvimento do Frontend (Angular + Tailwind)
- [X] Criar estrutura do projeto Angular
- [X] Criar telas: login, dashboard, produtos, estoque
- [X] Integrar com API REST
- [X] Adicionar feedbacks visuais e UX
- [X] Exibir dados e sugestões da IA

---

## 🚀 Etapa 9 – Deploy
- [ ] Criar build final do frontend e backend
- [ ] Gerar imagens Docker de produção
- [ ] Testar ambiente final
- [ ] Realizar deploy (Vercel, Render, VPS, etc.)

---

## 💎 Etapa 10 – Funcionalidades Bônus
- [ ] Painel administrativo completo
- [ ] Exportação de relatórios em PDF e CSV
- [ ] Gráficos com dados de vendas/estoque
- [ ] Implementar modo escuro (dark mode)

---

> Mantenha este roadmap atualizado à medida que for completando as etapas.
