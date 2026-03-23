import joblib
import os

class ComplaintClassifier:
    def __init__(self):
        self.load_models()

    def load_models(self):
        try:
            self.cat_model = joblib.load('models/category_model.pkl')
            self.pri_model = joblib.load('models/priority_model.pkl')
            print("[ML] Models loaded/reloaded successfully.")
            return True
        except Exception as e:
            print(f"[ML ERROR] Failed to load models: {e}")
            return False

    def predict(self, text):
        category = self.cat_model.predict([text])[0]
        priority = self.pri_model.predict([text])[0]
        
        return {
            "category": category,
            "priority": priority,
            "aiCategoryConfidence": 0.85,
            "aiPriorityConfidence": 0.80
        }

classifier = ComplaintClassifier() if os.path.exists('models/category_model.pkl') else None

