import os
from exa_py import Exa
import pandas as pd
from datetime import datetime, timedelta

class IngestionService:
    def __init__(self):
        self.exa = Exa(os.getenv("EXA_API_KEY"))

    def fetch_data(self, query: str = "Boeing safety issues, technical failures, and whistleblower complaints", num_results: int = 100):
        try:
            # Calculate date range for the last few days to ensure we have recent data
            # In a real scenario, we might want to fetch a broader range or handle pagination
            # For this demo, we fetch the latest results.
            
            search_response = self.exa.search_and_contents(
                query,
                num_results=num_results,
                use_autoprompt=True,
                text=True,
                highlights=True
            )
            
            results = []
            for result in search_response.results:
                results.append({
                    "text": result.text,
                    "published_date": result.published_date,
                    "url": result.url,
                    "title": result.title
                })
            
            df = pd.DataFrame(results)
            
            if not df.empty and 'published_date' in df.columns:
                df['published_date'] = pd.to_datetime(df['published_date'])
            
            return df
            
        except Exception as e:
            print(f"Error fetching data from Exa: {e}")
            return pd.DataFrame()

    def load_local_data(self, filepath: str):
        try:
            df = pd.read_csv(filepath)
            if 'published_date' in df.columns:
                df['published_date'] = pd.to_datetime(df['published_date'])
            return df
        except Exception as e:
            print(f"Error loading local data: {e}")
            return pd.DataFrame()
