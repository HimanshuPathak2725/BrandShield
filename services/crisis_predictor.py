import asyncio
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, Any, List
import aiosqlite
import json

# Try to import Prophet, fallback to simple velocity if missing
try:
    from prophet import Prophet
    PROPHET_AVAILABLE = True
except ImportError:
    PROPHET_AVAILABLE = False
    print("Warning: Prophet not found. Using linear extrapolation.")

DB_PATH = "brandshield.db"

from services.velocity_predictor import velocity_predictor

class CrisisPredictorService:
    async def init_db(self):
        async with aiosqlite.connect(DB_PATH) as db:
            await db.execute("""
                CREATE TABLE IF NOT EXISTS motion_history (
                    brand TEXT,
                    timestamp DATETIME,
                    volume INTEGER
                )
            """)
            await db.commit()

    async def log_volume(self, brand: str, volume: int):
        async with aiosqlite.connect(DB_PATH) as db:
            await db.execute(
                "INSERT INTO motion_history (brand, timestamp, volume) VALUES (?, ?, ?)",
                (brand, datetime.now(), volume)
            )
            await db.commit()

    async def get_history(self, brand: str, hours: int = 6) -> pd.DataFrame:
        start_time = datetime.now() - timedelta(hours=hours)
        async with aiosqlite.connect(DB_PATH) as db:
            async with db.execute(
                "SELECT timestamp, volume FROM motion_history WHERE brand = ? AND timestamp > ?",
                (brand, start_time)
            ) as cursor:
                rows = await cursor.fetchall()
        
        if not rows:
            return pd.DataFrame(columns=['ds', 'y'])
            
        return pd.DataFrame(rows, columns=['ds', 'y'])

    async def predict_crisis(self, brand: str, current_mentions_count: int) -> Dict[str, Any]:
        await self.log_volume(brand, current_mentions_count)
        df = await self.get_history(brand)
        
        # Format for Prophet/VelocityPredictor
        if not df.empty:
            df['ds'] = pd.to_datetime(df['ds'])
        
        # Use new VelocityPredictor
        forecast = velocity_predictor.predict(df, brand)
        
        return forecast.dict()

crisis_predictor = CrisisPredictorService()
