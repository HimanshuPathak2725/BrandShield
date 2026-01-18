import logging
from typing import Dict
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# Configure Logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SentimentModel:
    def __init__(self):
        self.use_transformer = False
        self.pipeline = None
        self.vader = SentimentIntensityAnalyzer()
        
        # Try Initialize Transformer (RoBERTa)
        # We delay-load this to avoid slowing down server start if not needed immediately
        # or if internet is slow.
        self._init_transformer()

    def _init_transformer(self):
        try:
            from transformers import pipeline
            logger.info("⏳ Loading Transformer Model (cardiffnlp/twitter-roberta-base-sentiment)...")
            # Using the 'pipeline' API for ease of use
            # "cardiffnlp/twitter-roberta-base-sentiment-latest" is popular for tweets
            self.pipeline = pipeline(
                "sentiment-analysis", 
                model="cardiffnlp/twitter-roberta-base-sentiment",
                tokenizer="cardiffnlp/twitter-roberta-base-sentiment"
            )
            self.use_transformer = True
            logger.info("✅ Transformer Model Loaded Successfully.")
        except Exception as e:
            logger.warning(f"⚠️ Transformer load failed ({e}). Falling back to VADER.")
            self.use_transformer = False

    def analyze(self, text: str) -> Dict[str, Any]:
        """
        Returns: {
            "label": "positive" | "negative" | "neutral",
            "score": float (confidence or compound score),
            "model": "roberta" | "vader"
        }
        """
        if not text:
            return {"label": "neutral", "score": 0.0, "model": "none"}

        if self.use_transformer and self.pipeline:
            try:
                # RoBERTa returns [{'label': 'LABEL_0', 'score': 0.9}]
                # LABEL_0: Negative, LABEL_1: Neutral, LABEL_2: Positive
                result = self.pipeline(text[:512])[0] # Truncate to 512 tokens
                label_map = {
                    "LABEL_0": "negative",
                    "LABEL_1": "neutral",
                    "LABEL_2": "positive"
                }
                
                return {
                    "label": label_map.get(result['label'], "neutral"),
                    "score": float(result['score']),
                    "model": "roberta"
                }
            except Exception as e:
                logger.error(f"Transformer inference error: {e}. Using VADER.")
                # Fallthrough to VADER

        # VADER Fallback
        scores = self.vader.polarity_scores(text)
        compound = scores['compound']
        
        if compound >= 0.05:
            label = "positive"
        elif compound <= -0.05:
            label = "negative"
        else:
            label = "neutral"
            
        return {
            "label": label,
            "score": compound,
            "model": "vader"
        }

sentiment_model = SentimentModel()
