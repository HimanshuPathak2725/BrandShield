import pandas as pd
from prophet import Prophet
import logging

logger = logging.getLogger(__name__)

class ForecastingService:
    def __init__(self):
        self.model = None

    def process_data(self, df: pd.DataFrame):
        """
        Process data into an hourly time-series with columns ds and y.
        """
        if df.empty:
            return pd.DataFrame(columns=['ds', 'y'])

        # Ensure published_date is datetime
        df['published_date'] = pd.to_datetime(df['published_date'])
        
        # Remove timezone info if present to avoid Prophet issues
        df['published_date'] = df['published_date'].dt.tz_localize(None)

        # Resample to hourly frequency and count mentions
        df_hourly = df.set_index('published_date').resample('H').size().reset_index(name='y')
        df_hourly = df_hourly.rename(columns={'published_date': 'ds'})
        
        return df_hourly

    def train_and_forecast(self, df: pd.DataFrame, periods: int = 48):
        """
        Fit a Meta Prophet model with daily_seasonality=True.
        """
        if df.empty or len(df) < 2:
            logger.warning("Not enough data to train Prophet model")
            return None, None

        self.model = Prophet(daily_seasonality=True)
        self.model.fit(df)

        future = self.model.make_future_dataframe(periods=periods, freq='H')
        forecast = self.model.predict(future)

        return self.model, forecast

    def check_alert(self, df_actual: pd.DataFrame, forecast: pd.DataFrame):
        """
        Trigger a RED ALERT if the latest actual value (y) exceeds the uncertainty interval's upper bound (yhat_upper).
        """
        if df_actual.empty or forecast is None:
            return False, {}

        # Merge actuals with forecast to compare
        # We only care about the latest actual data point
        latest_actual = df_actual.iloc[-1]
        latest_ds = latest_actual['ds']
        latest_y = latest_actual['y']

        # Find corresponding forecast row
        forecast_row = forecast[forecast['ds'] == latest_ds]
        
        if forecast_row.empty:
            # If exact match not found, try to find nearest or just use the latest forecast if appropriate
            # For strict comparison, we might need exact match. 
            # Let's assume we are checking the last known data point against the model's fit/forecast for that point.
            forecast_row = forecast.iloc[-1] # Fallback to latest forecast if time alignment is off, but ideally should match
        
        # Get yhat_upper
        # Note: forecast_row might be a DataFrame with one row, so we access values carefully
        yhat_upper = forecast_row['yhat_upper'].values[0] if not isinstance(forecast_row, pd.Series) else forecast_row['yhat_upper']
        yhat = forecast_row['yhat'].values[0] if not isinstance(forecast_row, pd.Series) else forecast_row['yhat']

        is_alert = latest_y > yhat_upper

        return is_alert, {
            "timestamp": latest_ds,
            "actual_y": float(latest_y),
            "yhat": float(yhat),
            "yhat_upper": float(yhat_upper),
            "alert_level": "RED" if is_alert else "GREEN"
        }
