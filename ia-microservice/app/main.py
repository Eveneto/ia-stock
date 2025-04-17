from fastapi import FastAPI
from pydantic import BaseModel, Field
import joblib
import os
import numpy as np

app = FastAPI(title="EstoqueIA - Microserviço de IA")

# Caminho do modelo
modelo_path = os.path.join(os.path.dirname(__file__), "model", "modelo_reposicao.pkl")
modelo = joblib.load(modelo_path)

# 📥 Modelo de entrada com exemplos no Swagger
class SugestaoRequest(BaseModel):
    produto_id: int = Field(..., example=101, description="ID do produto")
    nome: str = Field(..., example="Caneta Azul", description="Nome do produto")
    quantidade_em_estoque: int = Field(..., example=50, description="Quantidade atual em estoque")
    media_vendas_diarias: float = Field(..., example=3.5, description="Média de vendas diárias do produto")
    dias_para_proxima_compra: int = Field(..., example=10, description="Dias até a próxima compra prevista")

# 📤 Modelo de saída com exemplos no Swagger
class SugestaoResponse(BaseModel):
    sugestao_reposicao: int = Field(..., example=35, description="Quantidade sugerida para reposição")
    observacao: str = Field(..., example="Sugestão gerada com base no modelo treinado com dados simulados.",
                            description="Mensagem explicativa da IA")

@app.get("/")
def root():
    return {"mensagem": "Microserviço de IA rodando com modelo real!"}

@app.post("/sugestao", response_model=SugestaoResponse)
def sugestao_compra(request: SugestaoRequest):
    entrada = np.array([[request.quantidade_em_estoque,
                         request.media_vendas_diarias,
                         request.dias_para_proxima_compra]])
    
    sugestao = modelo.predict(entrada)[0]
    sugestao = max(0, round(sugestao))  # Evita valores negativos

    observacao = "Sugestão gerada com base no modelo treinado com dados simulados."

    return SugestaoResponse(sugestao_reposicao=sugestao, observacao=observacao)
