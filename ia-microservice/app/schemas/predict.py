import numpy as np
from core.model import StockModel

def make_prediction(model: StockModel, data: dict):
    try:
        entrada = np.array([[data["quantidade_em_estoque"],
                             data["media_vendas_diarias"],
                             data["dias_para_proxima_compra"]]])
        sugestao = model.predict(entrada)[0]
        return max(0, round(sugestao))
    except Exception as e:
        raise ValueError(f"Erro na previsão: {str(e)}")