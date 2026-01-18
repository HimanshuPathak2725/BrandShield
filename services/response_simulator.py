import numpy as np
from typing import Dict, List, Any
import random
from sentence_transformers import SentenceTransformer
import faiss

# Historical Crisis Embeddings (Mocked for initial setup if no index exists)
class ResponseSimulatorService:
    def __init__(self):
        try:
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
            self.dimension = 384
            self.index = faiss.IndexFlatL2(self.dimension)
            
            # Seed with some mock historical data (Crisis Text -> Sentiment Shift 0.0-1.0)
            # 1.0 = Great Recovery, 0.0 = Disaster
            mock_crises = [
                "We are sorry and will fix it immediately", # Good
                "It's not our fault, users are wrong", # Bad
                "We are investigating the claims", # Neutral
            ]
            mock_outcomes = [0.9, 0.1, 0.5]
            
            self.history_outcomes = mock_outcomes
            embeddings = self.model.encode(mock_crises)
            self.index.add(np.array(embeddings).astype('float32'))
            
        except Exception as e:
            print(f"Simulator init failed: {e}")
            self.model = None

    def simulate_outcome(self, response_text: str) -> Dict[str, Any]:
        if not self.model:
            return {"predicted_sentiment_curve": [0.5]*5, "risk_score": 0.5}

        # Embed input
        vec = self.model.encode([response_text])
        
        # Find closest historical case
        D, I = self.index.search(np.array(vec).astype('float32'), 1)
        closest_idx = I[0][0]
        base_outcome = self.history_outcomes[closest_idx] if closest_idx < len(self.history_outcomes) else 0.5
        
        # Simulate curve (5 points over 24h)
        # Add some random noise
        curve = []
        val = 0.3 # Starting negative sentiment
        for _ in range(5):
             val += (base_outcome - 0.5) * 0.2 + random.uniform(-0.05, 0.05)
             val = max(0, min(1, val))
             curve.append(val)
             
        # Risk score (inverse of final sentiment)
        risk_score = 1.0 - curve[-1]
        
        return {
            "predicted_sentiment_curve": curve,
            "risk_score": risk_score
        }

    def simulate_all(self, strategies: List[Dict[str, str]]) -> Dict[str, Any]:
        results = []
        for strat in strategies:
            sim = self.simulate_outcome(strat['text'])
            results.append({
                "style": strat['style'],
                "text": strat['text'],
                "curve": sim["predicted_sentiment_curve"],
                "risk_score": sim["risk_score"]
            })
            
        # Find best (lowest risk)
        best = min(results, key=lambda x: x['risk_score'])
        return {"all_simulations": results, "best_strategy": best}

response_simulator = ResponseSimulatorService()
