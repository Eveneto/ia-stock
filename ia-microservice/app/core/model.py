import joblib
import os

class StockModel:
    def __init__(self, model_path):
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Modelo não encontrado em {model_path}")
        self.model = joblib.load(model_path)
    
    def predict(self, data):
        return self.model.predict(data)
    
    def reload(self, model_path):
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Modelo não encontrado em {model_path}")
        self.model = joblib.load(model_path)