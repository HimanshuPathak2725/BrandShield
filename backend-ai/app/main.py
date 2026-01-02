from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel
from app.services.ingestion import IngestionService
from app.services.forecasting import ForecastingService
from app.services.agents import AgentService
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="BrandShield AI Engine")

# Initialize Services
ingestion_service = IngestionService()
forecasting_service = ForecastingService()
agent_service = AgentService()

class AnalysisRequest(BaseModel):
    query: str = "Boeing safety issues, technical failures, and whistleblower complaints"

@app.get("/")
def read_root():
    return {"status": "BrandShield AI Engine is running"}

@app.post("/analyze")
async def run_analysis(request: AnalysisRequest, background_tasks: BackgroundTasks):
    try:
        # 1. Ingest Data
        logger.info(f"Fetching data for query: {request.query}")
        df = ingestion_service.fetch_data(query=request.query)
        
        if df.empty:
            # Fallback to local data for demo if API fails or returns empty
            local_path = os.path.join("data", "boeing_crisis_velocity.csv")
            if os.path.exists(local_path):
                logger.info("Using local fallback data")
                df = ingestion_service.load_local_data(local_path)
            else:
                raise HTTPException(status_code=404, detail="No data found")

        # 2. Process & Forecast
        df_hourly = forecasting_service.process_data(df)
        model, forecast = forecasting_service.train_and_forecast(df_hourly)
        
        if forecast is None:
             raise HTTPException(status_code=500, detail="Forecasting failed")

        # 3. Check Alert
        is_alert, alert_details = forecasting_service.check_alert(df_hourly, forecast)
        
        # Prepare Graph Data (Last 24h actuals + Next 24h forecast)
        # Merge actuals and forecast
        graph_data = []
        
        # Last 24h actuals
        recent_actuals = df_hourly.tail(24).copy()
        for _, row in recent_actuals.iterrows():
            graph_data.append({
                "time": row['ds'].strftime("%H:%M"),
                "timestamp": row['ds'].isoformat(),
                "y": int(row['y']),
                "yhat": None,
                "yhat_upper": None
            })
            
        # Next 24h forecast (or overlapping if needed)
        # We want to show the threshold for the recent actuals too if possible, 
        # but for simplicity let's just append the future forecast
        future_forecast = forecast[forecast['ds'] > df_hourly['ds'].max()].head(24)
        for _, row in future_forecast.iterrows():
             graph_data.append({
                "time": row['ds'].strftime("%H:%M"),
                "timestamp": row['ds'].isoformat(),
                "y": None,
                "yhat": float(row['yhat']),
                "yhat_upper": float(row['yhat_upper'])
            })

        result = {
            "forecast": alert_details,
            "graph_data": graph_data,
            "agents_run": False,
            "strategy": None
        }

        # 4. If Red Alert, Run Agents
        if is_alert:
            logger.info("RED ALERT detected. Running AI Agents...")
            # Extract texts for agents
            texts = df['text'].tolist() if 'text' in df.columns else []
            
            if texts:
                agent_result = agent_service.run_workflow(texts)
                result["agents_run"] = True
                result["strategy"] = agent_result["strategy_plan"]
                result["clusters"] = agent_result["clusters"]
                result["sentiment"] = agent_result["sentiment_analysis"]
            
        return result

    except Exception as e:
        logger.error(f"Analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
