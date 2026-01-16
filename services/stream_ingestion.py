import asyncio
import os
import random
from datetime import datetime, timedelta
from typing import List, Dict, Any
import requests
import xml.etree.ElementTree as ET
import praw
from googleapiclient.discovery import build
from services.db_models import BrandConfig
from src.state import SocialPost
from services.sentiment_model import sentiment_model

# Fallback/Mock Data Generator
def generate_mock_post(platform: str, brand: str) -> Dict[str, Any]:
    templates = [
        f"I can't believe what {brand} did today! #outrage",
        f"Anyone else having issues with {brand} products?",
        f"{brand} is normally good, but this latest update is terrible.",
        f"Just saw the news about {brand}. Not looking good.",
        f"Love {brand}! Best service ever.", # Some positive
    ]
    return {
        "platform": platform,
        "title": f"Post about {brand} on {platform}", # Added title
        "text": random.choice(templates),
        "author": f"user_{random.randint(1000, 9999)}",
        "timestamp": datetime.now(),
        "url": f"https://{platform}.com/post/{random.randint(10000, 99999)}",
        "engagement": random.randint(0, 1000)
    }

class StreamIngestionService:
    def __init__(self):
        self.reddit = None
        self.youtube = None
        self._setup_apis()

    def _setup_apis(self):
        # Reddit
        if os.getenv("REDDIT_CLIENT_ID"):
            self.reddit = praw.Reddit(
                client_id=os.getenv("REDDIT_CLIENT_ID"),
                client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
                user_agent="BrandShield_Crisis_Monitor/1.0"
            )
        
        # YouTube
        if os.getenv("YOUTUBE_API_KEY"):
            self.youtube = build("youtube", "v3", developerKey=os.getenv("YOUTUBE_API_KEY"))

    async def fetch_reddit(self, query: str) -> List[Dict[str, Any]]:
        posts = []
        if not self.reddit:
            return [generate_mock_post("reddit", query) for _ in range(5)]
            
        try:
            # Run blocking praw call in executor
            loop = asyncio.get_event_loop()
            subreddit = await loop.run_in_executor(None, lambda: list(self.reddit.subreddit("all").search(query, sort="new", limit=10)))
            
            for post in subreddit:
                posts.append({
                    "platform": "reddit",
                    "text": post.title + " " + post.selftext[:200],
                    "author": post.author.name if post.author else "deleted",
                    "timestamp": datetime.fromtimestamp(post.created_utc),
                    "url": post.url,
                    "engagement": post.score + post.num_comments
                })
        except Exception as e:
            print(f"Reddit API Error: {e}")
            posts = [generate_mock_post("reddit", query)]
            
        return posts

    async def fetch_youtube(self, query: str) -> List[Dict[str, Any]]:
        posts = []
        if not self.youtube:
            return [generate_mock_post("youtube", query) for _ in range(3)]

        try:
            loop = asyncio.get_event_loop()
            request = self.youtube.search().list(q=query, part="snippet", type="video", maxResults=5, order="date")
            response = await loop.run_in_executor(None, request.execute)

            for item in response.get("items", []):
                posts.append({
                    "platform": "youtube",
                    "text": item["snippet"]["title"] + " " + item["snippet"]["description"],
                    "author": item["snippet"]["channelTitle"],
                    "timestamp": datetime.fromisoformat(item["snippet"]["publishedAt"].replace("Z", "+00:00")),
                    "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}",
                    "engagement": 0 # search endpoint doesn't return stats, needs secondary call (skipping for speed)
                })
        except Exception as e:
            print(f"YouTube API Error: {e}")
            posts = [generate_mock_post("youtube", query)]
            
        return posts

    async def fetch_news_rss(self, query: str) -> List[Dict[str, Any]]:
        # Google News RSS
        rss_url = f"https://news.google.com/rss/search?q={query}&hl=en-US&gl=US&ceid=US:en"
        posts = []
        try:
            loop = asyncio.get_event_loop()
            
            def fetch_and_parse():
                resp = requests.get(rss_url, timeout=10)
                root = ET.fromstring(resp.content)
                items = root.findall(".//item")
                parsed = []
                for item in items[:5]:
                    title = item.find("title").text if item.find("title") is not None else "No Title"
                    link = item.find("link").text if item.find("link") is not None else ""
                    source = item.find("source").text if item.find("source") is not None else "Unknown"
                    
                    parsed.append({
                        "platform": "news",
                        "title": title, # Explicit title field
                        "text": title,  # Use title as text for news
                        "author": source,
                        "timestamp": datetime.now(),
                        "url": link,
                        "engagement": 0
                    })
                return parsed

            posts = await loop.run_in_executor(None, fetch_and_parse)
        except Exception as e:
            print(f"RSS Error: {e}")
            posts = [generate_mock_post("news", query)]
            
        return posts

    async def get_live_feed(self, keywords: List[str]) -> List[Dict[str, Any]]:
        tasks = []
        for query in keywords:
            # tasks.append(self.fetch_reddit(query)) # Commented out due to API issues
            # tasks.append(self.fetch_youtube(query)) # Commented out due to API issues
            tasks.append(self.fetch_news_rss(query))
        
        results = await asyncio.gather(*tasks)
        flat_results = [item for sublist in results for item in sublist]
        
        # Enrich with Sentiment Analysis (Transformer/VADER)
        for post in flat_results:
            analysis = sentiment_model.analyze(post.get("text", ""))
            post["sentiment"] = analysis
            # Map sentiment label to legacy 'sentiment_score' for older components if needed
            # simple mapping: positive=1.0, neutral=0.0, negative=-1.0 or use the compound score
            post["sentiment_score"] = analysis.get("score", 0.0) 

        # Sort by timestamp desc
        flat_results.sort(key=lambda x: x['timestamp'], reverse=True)
        return flat_results

ingestion_service = StreamIngestionService()
