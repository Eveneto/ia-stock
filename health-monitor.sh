#!/bin/bash

# Health Monitor Script for Estoque IA
# This script continuously monitors the health of all services

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Monitor de Saúde - Estoque IA"
echo "================================="

check_service() {
    local service_name=$1
    local url=$2
    local expected_status=${3:-200}
    
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "$expected_status"; then
        echo -e "${GREEN}✅ $service_name: OK${NC}"
        return 0
    else
        echo -e "${RED}❌ $service_name: FALHA${NC}"
        return 1
    fi
}

check_container() {
    local container_name=$1
    
    if docker ps --format "table {{.Names}}" | grep -q "$container_name"; then
        echo -e "${GREEN}✅ Container $container_name: RODANDO${NC}"
        return 0
    else
        echo -e "${RED}❌ Container $container_name: PARADO${NC}"
        return 1
    fi
}

monitor_loop() {
    while true; do
        clear
        echo "🔍 Monitor de Saúde - Estoque IA - $(date '+%Y-%m-%d %H:%M:%S')"
        echo "=================================================================="
        
        echo -e "\n📦 Containers:"
        check_container "estoque-ia-backend-1"
        check_container "estoque-ia-ia-1"
        check_container "estoque-ia-db-1"
        
        echo -e "\n🌐 APIs:"
        check_service "Backend" "http://localhost:8080/auth/test"
        check_service "IA Service" "http://localhost:5000/"
        
        echo -e "\n📊 Uso de Recursos:"
        docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" | head -4
        
        echo -e "\n${YELLOW}💡 Pressione Ctrl+C para sair${NC}"
        sleep 30
    done
}

# Check if containers are running first
if ! docker ps | grep -q "estoque-ia"; then
    echo -e "${RED}❌ Nenhum container do estoque-ia está rodando!${NC}"
    echo "Execute: ./docker-manager.sh up"
    exit 1
fi

# Start monitoring
monitor_loop
