import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, Any
from services.new_db_models import VelocityForecast

# Try importing Prophet, else fallback
try:
    from prophet import Prophet
    PROPHET_AVAILABLE = True
except ImportError:
    PROPHET_AVAILABLE = False
    print("⚠️ Prophet not available. Falling back to simple velocity prediction.")

class VelocityPredictorService:
    def predict(self, history_df: pd.DataFrame, brand: str) -> VelocityForecast:
        """
        Expects history_df with columns ['ds', 'y'] (timestamp, mention_count)
        """
        current_vol = history_df['y'].iloc[-1] if not history_df.empty else 0
        
        if len(history_df) < 5 or not PROPHET_AVAILABLE:
            # Simple linear extrapolation fallback
            predicted_peak = int(current_vol * 1.2) # Mock trend
            trend_prob = 0.5
        else:
            try:
                m = Prophet(yearly_seasonality=False, weekly_seasonality=False, daily_seasonality=False)
                m.fit(history_df)
                future = m.make_future_dataframe(periods=60, freq='T') # Next 60 mins
                forecast = m.predict(future)
                
                # Get max in future window
                future_window = forecast[forecast['ds'] > datetime.now()]
                predicted_peak = int(future_window['yhat'].max())
                
                # Trend prob: % of future points > current
                trend_up_points = len(future_window[future_window['yhat'] > current_vol])
                trend_prob = trend_up_points / len(future_window) if len(future_window) > 0 else 0.0
                
            except Exception as e:
                print(f"Prophet forecast failed: {e}")
                predicted_peak = int(current_vol * 1.1)
                trend_prob = 0.4

        return VelocityForecast(
            brand=brand,
            current_velocity=int(current_vol),
            predicted_peak=int(predicted_peak),
            trend_probability=float(trend_prob),
            forecast_window_minutes=60
        )

velocity_predictor = VelocityPredictorService()
