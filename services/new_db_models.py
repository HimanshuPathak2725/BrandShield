from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime
import uuid

class BrandProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    org_id: str
    brand_name: str
    industry: str
    risk_sensitivity: int = Field(..., ge=1, le=10) # 1-10
    custom_keywords: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.now)

class IncidentLog(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    brand_id: str
    timestamp: datetime = Field(default_factory=datetime.now)
    crisis_level: str # low, medium, high, critical
    summary: str
    response_used: Optional[str] = None
    similarity_score: Optional[float] = None

class ActionResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    incident_id: str
    draft_responses: List[Dict[str, str]] # [{style: 'empathetic', text: '...'}]
    selected_response: Optional[Dict[str, str]] = None
    status: str = "draft" # draft, approved, sent
    sent_at: Optional[datetime] = None
    channel: Optional[str] = None

class SourceScore(BaseModel):
    domain: str
    trust_score: float # 0.0 - 1.0
    category: str # news, social, blog, unverified

class VelocityForecast(BaseModel):
    brand: str
    current_velocity: int
    predicted_peak: int
    trend_probability: float # 0.0 - 1.0
    forecast_window_minutes: int = 60
