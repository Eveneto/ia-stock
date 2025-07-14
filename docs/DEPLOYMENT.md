# 🚀 Guia de Deployment

## 🐳 Docker Production

### 1. Build das Imagens
```bash
# Backend
docker build -t estoque-ia/backend ./backend

# IA Service
docker build -t estoque-ia/ia-service ./ia-service
```

### 2. Docker Compose Production
```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: estoque_ia
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

  backend:
    image: estoque-ia/backend
    environment:
      SPRING_PROFILES_ACTIVE: prod
      DB_HOST: mysql
      DB_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
    ports:
      - "8080:8080"
    depends_on:
      - mysql

  ia-service:
    image: estoque-ia/ia-service
    ports:
      - "5000:5000"

volumes:
  mysql_data:
```

### 3. Variáveis de Ambiente
```bash
# .env
DB_PASSWORD=sua_senha_super_segura
JWT_SECRET=sua_chave_jwt_segura_256_bits
```

## ☁️ Cloud Deployment

### AWS ECS
```bash
# 1. Push para ECR
aws ecr get-login-password | docker login --username AWS --password-stdin
docker tag estoque-ia/backend:latest AWS_ACCOUNT.dkr.ecr.REGION.amazonaws.com/estoque-ia
docker push AWS_ACCOUNT.dkr.ecr.REGION.amazonaws.com/estoque-ia

# 2. Deploy ECS
aws ecs update-service --cluster estoque-ia --service backend --force-new-deployment
```

### Google Cloud Run
```bash
# 1. Build e Push
gcloud builds submit --tag gcr.io/PROJECT_ID/estoque-ia

# 2. Deploy
gcloud run deploy estoque-ia \
  --image gcr.io/PROJECT_ID/estoque-ia \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## 🔧 Configurações de Produção

### application-prod.yml
```yaml
spring:
  datasource:
    url: jdbc:mysql://${DB_HOST:localhost}:3306/estoque_ia
    username: ${DB_USER:root}
    password: ${DB_PASSWORD}
  
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false

jwt:
  secret: ${JWT_SECRET}
  expiration: 86400000

logging:
  level:
    com.estoqueia: INFO
    org.springframework: WARN
```

## 📊 Monitoramento

### Health Checks
```bash
# Backend
curl http://localhost:8080/actuator/health

# IA Service
curl http://localhost:5000/health
```

### Logs
```bash
# Docker logs
docker logs estoque-ia_backend_1 -f

# Kubernetes logs
kubectl logs -f deployment/estoque-ia
```