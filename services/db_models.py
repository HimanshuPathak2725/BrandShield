from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class Organization(BaseModel):
    id: str  # e.g., "org_123"
    name: str

class User(BaseModel):
    id: str
    org_id: str
    email: str
    password_hash: str
    role: str = "analyst"

class BrandConfig(BaseModel):
    id: str
    org_id: str
    brand_keywords: List[str]
    alert_thresholds: dict # {"risk_score": 0.8, "velocity": 50}

class CrisisEvent(BaseModel):
    id: str
    brand: str
    timestamp: datetime
    risk_score: float
    velocity: float
    description: str

class AlertLog(BaseModel):
    id: str
    org_id: str
    timestamp: datetime
    message: str
    channel: str # email, slack
