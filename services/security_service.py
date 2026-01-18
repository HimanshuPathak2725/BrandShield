import os
import jwt
import datetime
from cryptography.fernet import Fernet
from typing import Dict, Any, Optional

# Security Constants
JWT_SECRET = os.getenv("JWT_SECRET", "brandshield-enterprise-secret-key-change-me")
JWT_ALGORITHM = "HS256"
TOKEN_EXPIRATION_HOURS = 24

# Fernet Key for Audit Log Encryption
# In production, load this from a secure vault or env
# Generate one via Fernet.generate_key()
_default_key = Fernet.generate_key()
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY", _default_key.decode())

class SecurityService:
    def __init__(self):
        self.fernet = Fernet(ENCRYPTION_KEY.encode() if isinstance(ENCRYPTION_KEY, str) else ENCRYPTION_KEY)

    # --- JWT Authentication ---
    def create_token(self, user_id: str, org_id: str, role: str = "analyst") -> str:
        payload = {
            "sub": user_id,
            "org": org_id,
            "role": role,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=TOKEN_EXPIRATION_HOURS),
            "iat": datetime.datetime.utcnow()
        }
        return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        try:
            # Remove 'Bearer ' prefix if present
            if token.startswith("Bearer "):
                token = token.split(" ")[1]
                
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            return payload
        except jwt.ExpiredSignatureError:
            print("Login failed: Token expired")
            return None
        except jwt.InvalidTokenError:
            print("Login failed: Invalid token")
            return None

    # --- Data Encryption (Audit Logs) ---
    def encrypt_data(self, data: str) -> str:
        """Encrypts sensitive string data (e.g. log details)."""
        if not data:
            return ""
        return self.fernet.encrypt(data.encode()).decode()

    def decrypt_data(self, token: str) -> str:
        """Decrypts encrypted data."""
        if not token:
            return ""
        try:
            return self.fernet.decrypt(token.encode()).decode()
        except Exception as e:
            print(f"Decryption failed: {e}")
            return "[ENCRYPTED DATA CORRUPTED]"

security_service = SecurityService()
