import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import joblib
import os

# Criar diretório para salvar o modelo
os.makedirs("app/model", exist_ok=True)

# Carregar dados semi-reais do CSV
df = pd.read_csv("app/model/dados_semi_reais.csv")

# Separando variáveis
X = df[["quantidade_em_estoque", "media_vendas_diarias", "dias_para_proxima_compra"]]
y = df["quantidade_reposicao"]

# Dividindo os dados
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Treinando o modelo
modelo = RandomForestRegressor(n_estimators=100, random_state=42)
modelo.fit(X_train, y_train)

# Avaliando
y_pred = modelo.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)
print(f"Mean Squared Error (MSE): {mse}")
print(f"R² Score: {r2}")
print(f"Mean Absolute Error (MAE): {mae}")

# Validação cruzada
cv_scores = cross_val_score(modelo, X, y, cv=5, scoring='neg_mean_squared_error')
print(f"Cross-Validation MSE: {-cv_scores.mean()}")

# Salvando o modelo
joblib.dump(modelo, "app/model/modelo_reposicao.pkl")
print("Modelo salvo em app/model/modelo_reposicao.pkl")