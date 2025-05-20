from fastapi import APIRouter, HTTPException
from pydantic import Field
from main import modelo, SugestaoRequest, SugestaoResponse
import numpy as np

router = APIRouter()

@router.get("/")
def root():
    return {"mensagem": "Microserviço de IA rodando com modelo real!"}

@router.post("/sugestao", response_model=SugestaoResponse)
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