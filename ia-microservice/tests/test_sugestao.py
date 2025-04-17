import sys
import os
from fastapi.testclient import TestClient

# Adiciona o diretório 'app' ao sys.path para resolver o erro de importação
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'app')))

from app.main import app  # Ajustado para importar corretamente

# Criação do cliente de teste
client = TestClient(app)

def test_sugestao_endpoint():
    payload = {
        "produto_id": 101,
        "nome": "Caneta Azul",
        "quantidade_em_estoque": 50,
        "media_vendas_diarias": 3.5,
        "dias_para_proxima_compra": 10
    }

    # Fazendo a requisição POST para o endpoint /sugestao
    response = client.post("/sugestao", json=payload)

    # Verificando se a resposta é 200 OK
    assert response.status_code == 200

    # Verificando se os dados de resposta contêm os campos esperados
    data = response.json()
    assert "sugestao_reposicao" in data
    assert "observacao" in data

    # Verificando se o valor de 'sugestao_reposicao' é um inteiro e positivo
    assert isinstance(data["sugestao_reposicao"], int)
    assert data["sugestao_reposicao"] >= 0
