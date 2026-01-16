from typing import Dict
from urllib.parse import urlparse
from services.new_db_models import SourceScore

class SourceScoringService:
    def __init__(self):
        self.DOMAIN_TRUST = {
            "reuters.com": 0.95,
            "bloomberg.com": 0.95,
            "bbc.com": 0.9,
            "cnn.com": 0.85,
            "nytimes.com": 0.9,
            "wsj.com": 0.92,
            "reddit.com": 0.6,
            "twitter.com": 0.5,
            "x.com": 0.5,
            "facebook.com": 0.4,
            "tiktok.com": 0.3,
            "medium.com": 0.7,
            "linkedin.com": 0.8
        }
    
    def score_url(self, url: str) -> SourceScore:
        try:
            domain = urlparse(url).netloc.lower()
            if domain.startswith("www."):
                domain = domain[4:]
            
            # Find closest match or root domain
            score = 0.4 # Default unknown
            category = "unverified"
            
            for trusted_domain, trust_score in self.DOMAIN_TRUST.items():
                if trusted_domain in domain:
                    score = trust_score
                    if score >= 0.9:
                        category = "verified_news"
                    elif score >= 0.7:
                        category = "trusted_blog"
                    elif "reddit" in domain or "twitter" in domain or "facebook" in domain:
                         category = "social_media"
                    else:
                        category = "general"
                    break
            
            return SourceScore(
                domain=domain,
                trust_score=score,
                category=category
            )
            
        except Exception:
            return SourceScore(domain="unknown", trust_score=0.4, category="unverified")

source_scorer = SourceScoringService()
