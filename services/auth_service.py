import jwt
import datetime
import os
import bcrypt
from typing import Optional, Dict
from services.models import User
from services.security_service import security_service

class AuthService:
    def register(self, name, email, password) -> Dict:
        # Check if user exists
        if User.find_by_email(email):
             return {"error": "User already exists"}

        # Hash password
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

        # Create User
        try:
            user_id = User.create({
                "name": name,
                "email": email,
                "password": hashed,
                "company_id": None # No company yet, will set in onboarding
            })
            
            # Generate Token
            token = security_service.create_token(user_id, "pending_onboarding")
            
            return {
                "token": token,
                "user": {"id": user_id, "name": name, "email": email, "companyId": None}
            }
        except Exception as e:
            return {"error": str(e)}

    def login(self, email, password) -> Dict:
        user_doc = User.find_by_email(email)
        if not user_doc:
            return {"error": "Invalid credentials"}
        
        # Verify Password
        stored_hash = user_doc["password"].encode('utf-8')
        if bcrypt.checkpw(password.encode('utf-8'), stored_hash):
            user_id = str(user_doc["_id"])
            company_id = str(user_doc["company_id"]) if user_doc.get("company_id") else None
            org_id = company_id if company_id else "pending_onboarding"
            
            token = security_service.create_token(user_id, org_id)
            
            return {
                "token": token,
                "user": {
                    "id": user_id,
                    "name": user_doc["name"],
                    "email": user_doc["email"],
                    "companyId": company_id
                }
            }
        
        return {"error": "Invalid credentials"}

auth_service = AuthService()


auth_service = AuthService()
