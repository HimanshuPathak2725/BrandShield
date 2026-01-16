from typing import List, Dict, Any
from src.state import SocialPost

class InfluencerDetectorService:
    def detect_influencers(self, posts: List[SocialPost]) -> List[Dict[str, Any]]:
        # Group by author
        authors = {}
        for post in posts:
            author = post['author'] # Access post as dictionary
            if author not in authors:
                authors[author] = {"count": 0, "engagement": 0, "platform": post['platform']}
            
            authors[author]["count"] += 1
            authors[author]["engagement"] += post['engagement']

        # Calculate impact score
        ranked = []
        for author, stats in authors.items():
            impact = stats["engagement"] * stats["count"]
            ranked.append({
                "author": author,
                "platform": stats["platform"],
                "impact_score": impact,
                "post_count": stats["count"]
            })
            
        # Sort desc
        ranked.sort(key=lambda x: x["impact_score"], reverse=True)
        return ranked[:10]

influencer_detector = InfluencerDetectorService()
