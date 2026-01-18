from datetime import datetime
from bson import ObjectId
from typing import List, Optional
from pydantic import BaseModel, Field, EmailStr
from services.mongo_db import get_db
import pymongo

# --- Pydantic Schemas (Validation) ---

class CompanyProfileSchema(BaseModel):
    brand_name: str = Field(..., alias="brandName")
    website: Optional[str] = None
    industry: str
    competitors: List[str] = []
    keywords: List[str] = []
    sensitivity: float = 0.7 # 0.0 to 1.0
    
    # Real-Time Data Cache
    last_analysis: Optional[dict] = Field(default_factory=lambda: {
        "timestamp": None,
        "sentimentScore": 0,
        "velocityScore": 0,
        "activeAlerts": [],
        "topMentions": []
    }, alias="lastAnalysis")

class UserSchema(BaseModel):
    name: str
    email: EmailStr
    password: str # Hashed
    role: str = "Admin" # Admin, Analyst, Viewer
    company_id: Optional[str] = Field(None, alias="companyId")
    created_at: datetime = Field(default_factory=datetime.utcnow)

# --- Model Classes (DB Operations) ---

class CompanyProfile:
    collection_name = "company_profiles"

    @staticmethod
    def create(data: dict):
        db = get_db()
        # Validate with Schema
        # Convert camelCase input if necessary or use alias
        schema = CompanyProfileSchema(**data)
        doc = schema.model_dump(by_alias=True)
        result = db[CompanyProfile.collection_name].insert_one(doc)
        return str(result.inserted_id)

    @staticmethod
    def find_by_id(oid: str):
        db = get_db()
        if not ObjectId.is_valid(oid):
            return None
        return db[CompanyProfile.collection_name].find_one({"_id": ObjectId(oid)})

    @staticmethod
    def update(oid: str, update_data: dict):
        db = get_db()
        db[CompanyProfile.collection_name].update_one(
            {"_id": ObjectId(oid)},
            {"$set": update_data}
        )

class User:
    collection_name = "users"

    @staticmethod
    def create(data: dict):
        db = get_db()
        schema = UserSchema(**data)
        doc = schema.model_dump(by_alias=True)
        # Check uniqueness
        if db[User.collection_name].find_one({"email": doc["email"]}):
            raise ValueError("Email already exists")
        
        result = db[User.collection_name].insert_one(doc)
        return str(result.inserted_id)

    @staticmethod
    def find_by_email(email: str):
        db = get_db()
        return db[User.collection_name].find_one({"email": email})

    @staticmethod
    def find_by_id(oid: str):
        db = get_db()
        if not ObjectId.is_valid(oid):
            return None
        return db[User.collection_name].find_one({"_id": ObjectId(oid)})

    @staticmethod
    def update(oid: str, update_data: dict):
        db = get_db()
        if not ObjectId.is_valid(oid):
            return
        db[User.collection_name].update_one(
            {"_id": ObjectId(oid)},
            {"$set": update_data}
        )
