# 🤝 Guia de Contribuição

## 🎯 Como Contribuir

### 1. Setup do Ambiente
```bash
# Fork e clone
git clone https://github.com/SEU_USER/estoque-ia.git
cd estoque-ia

# Instalar dependências
cd backend && mvn install
cd ../ia-service && pip install -r requirements.txt
```

### 2. Padrões de Código

#### Java (Backend)
- Seguir **Google Java Style Guide**
- Usar **Lombok** para reduzir boilerplate
- **Javadoc** em métodos públicos
- **Testes unitários** obrigatórios

#### Python (IA)
- Seguir **PEP 8**
- **Type hints** obrigatórios
- **Docstrings** em funções
- **Tests** com pytest

### 3. Workflow de Desenvolvimento
```bash
# 1. Criar branch
git checkout -b feature/nova-funcionalidade

# 2. Desenvolver e testar
mvn test

# 3. Commit
git commit -m "feat: adiciona nova funcionalidade"

# 4. Push e PR
git push origin feature/nova-funcionalidade
```

### 4. Tipos de Contribuição
- 🐛 **Bug fixes**
- ✨ **Novas funcionalidades**
- 📚 **Documentação**
- 🧪 **Testes**
- 🔧 **Refatoração**

## 📋 Checklist para PR

- [ ] Código testado
- [ ] Documentação atualizada
- [ ] Sem quebrar funcionalidades existentes
- [ ] Seguir padrões de código
- [ ] Commit messages claros