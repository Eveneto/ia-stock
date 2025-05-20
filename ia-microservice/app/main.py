from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import joblib
import os
import numpy as np

app = FastAPI(title="EstoqueIA - Microserviço de IA")

# Caminho do modelo
modelo_path = os.path.join(os.path.dirname(__file__), "model", "modelo_reposicao.pkl")

# Verificar se o modelo existe
if not os.path.exists(modelo_path):
    raise FileNotFoundError(f"Modelo não encontrado em {modelo_path}")
modelo = joblib.load(modelo_path)

# Modelo de entrada
class SugestaoRequest(BaseModel):
    produto_id: int = Field(..., gt=0, example=101, description="ID do produto")
    nome: str = Field(..., min_length=1, example="Caneta Azul", description="Nome do produto")
    quantidade_em_estoque: int = Field(..., ge=0, example=50, description="Quantidade atual em estoque")
    media_vendas_diarias: float = Field(..., ge=0, example=3.5, description="Média de vendas diárias")
    dias_para_proxima_compra: int = Field(..., gt=0, example=10, description="Dias até a próxima compra")

# Modelo de saída
class SugestaoResponse(BaseModel):
    sugestao_reposicao: int = Field(..., example=35, description="Quantidade sugerida para reposição")
    observacao: str = Field(..., example="Sugestão para Caneta Azul com base em estoque atual (50) e vendas diárias (3.50).")

@app.get("/")
def root():
    return {"mensagem": "Microserviço de IA rodando com modelo treinado!"}

@app.post("/sugestao", response_model=SugestaoResponse)
def sugestao_compra(request: SugestaoRequest):
    try:
        entrada = np.array([[request.quantidade_em_estoque,
                             request.media_vendas_diarias,
                             request.dias_para_proxima_compra]])
        sugestao = modelo.predict(entrada)[0]
        sugestao = max(0, round(sugestao))
        observacao = f"Sugestão para {request.nome} com base em estoque atual ({request.quantidade_em_estoque}) e vendas diárias ({request.media_vendas_diarias:.2f})."
        return SugestaoResponse(sugestao_reposicao=sugestao, observacao=observacao)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na previsão: {str(e)}")

@app.post("/reload-model")
def reload_model():
    global modelo
    try:
        modelo = joblib.load(modelo_path)
        return {"mensagem": "Modelo recarregado com sucesso!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao recarregar modelo: {str(e)}")