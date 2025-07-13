#!/bin/bash

# Script para gerenciar o projeto Estoque IA com Docker

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para exibir ajuda
show_help() {
    echo -e "${BLUE}Script de gerenciamento do Estoque IA${NC}"
    echo ""
    echo -e "${YELLOW}Uso: $0 [COMANDO]${NC}"
    echo ""
    echo "Comandos disponíveis:"
    echo "  build     - Faz build das imagens Docker"
    echo "  up        - Inicia todos os serviços"
    echo "  down      - Para todos os serviços"
    echo "  restart   - Reinicia todos os serviços"
    echo "  logs      - Mostra logs de todos os serviços"
    echo "  status    - Mostra status dos containers"
    echo "  clean     - Remove containers, imagens e volumes não utilizados"
    echo "  test      - Testa as APIs"
    echo "  help      - Mostra esta ajuda"
    echo ""
}

# Função para fazer build
build() {
    echo -e "${BLUE}🔨 Fazendo build das imagens...${NC}"
    docker-compose build --no-cache
    echo -e "${GREEN}✅ Build concluído com sucesso!${NC}"
}

# Função para iniciar serviços
start_services() {
    echo -e "${BLUE}🚀 Iniciando serviços...${NC}"
    docker-compose up -d
    echo -e "${GREEN}✅ Serviços iniciados com sucesso!${NC}"
    echo ""
    echo -e "${YELLOW}📊 Status dos serviços:${NC}"
    docker-compose ps
    echo ""
    echo -e "${YELLOW}🌐 URLs dos serviços:${NC}"
    echo -e "  Backend: ${GREEN}http://localhost:8080${NC}"
    echo -e "  IA Service: ${GREEN}http://localhost:5000${NC}"
    echo -e "  MySQL: ${GREEN}localhost:3307${NC}"
}

# Função para parar serviços
stop_services() {
    echo -e "${BLUE}🛑 Parando serviços...${NC}"
    docker-compose down
    echo -e "${GREEN}✅ Serviços parados com sucesso!${NC}"
}

# Função para reiniciar serviços
restart_services() {
    echo -e "${BLUE}🔄 Reiniciando serviços...${NC}"
    docker-compose down
    docker-compose up -d
    echo -e "${GREEN}✅ Serviços reiniciados com sucesso!${NC}"
}

# Função para mostrar logs
show_logs() {
    echo -e "${BLUE}📋 Mostrando logs dos serviços...${NC}"
    docker-compose logs -f
}

# Função para mostrar status
show_status() {
    echo -e "${BLUE}📊 Status dos containers:${NC}"
    docker-compose ps
    echo ""
    echo -e "${BLUE}💾 Uso de recursos:${NC}"
    docker stats --no-stream
}

# Função para limpar recursos
clean() {
    echo -e "${YELLOW}⚠️  Isso vai remover containers, imagens e volumes não utilizados.${NC}"
    read -p "Continuar? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}🧹 Limpando recursos Docker...${NC}"
        docker-compose down
        docker system prune -af
        docker volume prune -f
        echo -e "${GREEN}✅ Limpeza concluída!${NC}"
    else
        echo -e "${YELLOW}❌ Operação cancelada.${NC}"
    fi
}

# Função para testar APIs
test_apis() {
    echo -e "${BLUE}🧪 Testando APIs...${NC}"
    echo ""
    
    echo -e "${YELLOW}Testando Backend (http://localhost:8080/auth/test):${NC}"
    if curl -s -f http://localhost:8080/auth/test > /dev/null; then
        echo -e "${GREEN}✅ Backend está funcionando!${NC}"
    else
        echo -e "${RED}❌ Backend não está respondendo!${NC}"
    fi
    
    echo ""
    echo -e "${YELLOW}Testando IA Service (http://localhost:5000/):${NC}"
    if curl -s -f http://localhost:5000/ > /dev/null; then
        echo -e "${GREEN}✅ IA Service está funcionando!${NC}"
    else
        echo -e "${RED}❌ IA Service não está respondendo!${NC}"
    fi
    
    echo ""
    echo -e "${YELLOW}Testando conexão com banco de dados:${NC}"
    if docker-compose exec -T db mysqladmin ping -h localhost -u root -pestoque123 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Banco de dados está funcionando!${NC}"
    else
        echo -e "${RED}❌ Banco de dados não está respondendo!${NC}"
    fi
}

# Verificar se o docker-compose.yml existe
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}❌ Arquivo docker-compose.yml não encontrado!${NC}"
    echo -e "${YELLOW}Execute este script a partir do diretório raiz do projeto.${NC}"
    exit 1
fi

# Processar comando
case "${1:-help}" in
    build)
        build
        ;;
    up|start)
        start_services
        ;;
    down|stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    logs)
        show_logs
        ;;
    status)
        show_status
        ;;
    clean)
        clean
        ;;
    test)
        test_apis
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo -e "${RED}❌ Comando inválido: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
