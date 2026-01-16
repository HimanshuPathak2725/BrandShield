import jwt
import datetime
import os
import hashlib
from typing import Optional, Dict

SECRET_KEY = os.getenv("JWT_SECRET", "supersecretkey")

# Mock User DB (Normally SQLite)
USERS_DB = {
    "admin@brandshield.ai": {
        "password_hash": hashlib.sha256("password123".encode()).hexdigest(),
        "org_id": "org_default",
        "role": "admin"
    }
}

class AuthService:
    def login(self, email, password) -> Optional[str]:
        user = USERS_DB.get(email)
        if not user:
            return None
        
        phash = hashlib.sha256(password.encode()).hexdigest()
        if phash == user["password_hash"]:
            payload = {
                "email": email,
                "org_id": user["org_id"],
                "role": user["role"],
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }
            return jwt.encode(payload, SECRET_KEY, algorithm="HS256")
        return None

    def verify_token(self, token) -> Optional[Dict]:
        try:
            return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        except:
            return None

auth_service = AuthService()
