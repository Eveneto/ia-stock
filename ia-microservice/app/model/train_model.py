import numpy as np 
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import joblib

# Gerando dados simulados 
np.random.seed(42)
data = {
    "produto_id": np.random.randint(1, 100, size=1000),
    "quantidade_em_estoque": np.random.randint(10, 500, size=1000),
    "media_vendas_diarias": np.random.uniform(1, 50, size=1000),
    "dias_para_proxima_compra": np.random.randint(7, 30, size=1000),
    "quantidade_reposicao": np.random.randint(10, 200, size=1000)
}

df = pd.DataFrame(data)

# Separando variáveis independentes (x) e dependentes (y)
X = df[["quantidade_em_estoque", "media_vendas_diarias", "dias_para_proxima_compra"]]
y = df["quantidade_reposicao"]

# Dividindo os dados em conjunto de treino e teste
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Criando o modelo de regressão linear
modelo = LinearRegression()

# Treinando o modelo
modelo.fit(X_train, y_train)

# Fazendo previsões no conjunto de teste
y_pred = modelo.predict(X_test)

# Avaliando o modelo
mse = mean_squared_error(y_test, y_pred)
print(f"Mean Squared Error (MSE): {mse}")

# Salvando o modelo treinado
joblib.dump(modelo, "app/model/modelo_reposicao.pkl")