# Salve como app/model/gerar_dados.py
import numpy as np
import pandas as pd

np.random.seed(42)
n = 1000
data = {
    "produto_id": np.random.randint(1, 100, size=n),
    "quantidade_em_estoque": np.random.randint(10, 500, size=n),
    "media_vendas_diarias": np.random.uniform(1, 50, size=n),
    "dias_para_proxima_compra": np.random.randint(7, 30, size=n),
}
df = pd.DataFrame(data)
df["quantidade_reposicao"] = (df["media_vendas_diarias"] * df["dias_para_proxima_compra"] * 1.2 + np.random.normal(0, 10, n)).clip(10, 200).astype(int)
df.to_csv("app/model/dados_semi_reais.csv", index=False)
print("CSV gerado em app/model/dados_semi_reais.csv")