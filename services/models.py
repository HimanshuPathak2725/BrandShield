import uuid
import json
import datetime
from datetime import datetime as dt
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from services.sqlite_db import get_db

# --- Pydantic Schemas (Validation) ---
class CompanyProfileSchema(BaseModel):
    brand_name: str = Field(..., alias="brandName")
    website: Optional[str] = None
    industry: str
    competitors: List[str] = []
    keywords: List[str] = []
    sensitivity: float = 0.7
    
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
    password: str 
    role: str = "Admin"
    company_id: Optional[str] = Field(None, alias="companyId")
    created_at: dt = Field(default_factory=dt.utcnow)

# --- Model Classes (SQLite Implementation) ---

class User:
    @staticmethod
    def create(data: dict):
        conn = get_db()
        c = conn.cursor()
        
        user_id = str(uuid.uuid4())
        
        # Validate w/ schema if needed, but for raw speed/compat:
        c.execute('''
            INSERT INTO users (id, name, email, password, role, company_id, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            user_id,
            data.get('name'),
            data.get('email'),
            data.get('password'),
            data.get('role', 'Admin'),
            data.get('company_id'),
            datetime.utcnow().isoformat()
        ))
        conn.commit()
        conn.close()
        return user_id

    @staticmethod
    def find_by_email(email: str):
        conn = get_db()
        conn.row_factory = lambda c, r: dict(zip([col[0] for col in c.description], r))
        c = conn.cursor()
        c.execute('SELECT * FROM users WHERE email = ?', (email,))
        user = c.fetchone()
        conn.close()
        
        if user:
            # Normalize ID for PyMongo compatibility in existing code
            user['_id'] = user['id'] 
        return user

    @staticmethod
    def find_by_id(user_id: str):
        conn = get_db()
        conn.row_factory = lambda c, r: dict(zip([col[0] for col in c.description], r))
        c = conn.cursor()
        c.execute('SELECT * FROM users WHERE id = ?', (user_id,))
        user = c.fetchone()
        conn.close()
        if user:
            user['_id'] = user['id']
        return user

    @staticmethod
    def update(user_id: str, data: dict):
        conn = get_db()
        c = conn.cursor()
        
        # Build dynamic query
        fields = []
        values = []
        for k, v in data.items():
            fields.append(f"{k} = ?")
            values.append(v)
        
        values.append(user_id)
        
        query = f"UPDATE users SET {', '.join(fields)} WHERE id = ?"
        c.execute(query, tuple(values))
        conn.commit()
        conn.close()
        return True

    @staticmethod
    def get_all():
        conn = get_db()
        conn.row_factory = lambda c, r: dict(zip([col[0] for col in c.description], r))
        c = conn.cursor()
        c.execute('SELECT id, name, email, role, company_id, created_at FROM users')
        users = c.fetchall()
        conn.close()
        # Clean ID
        for u in users:
            u['_id'] = u['id']
        return users

class CompanyProfile:
    @staticmethod
    def create(data: dict):
        conn = get_db()
        c = conn.cursor()
        company_id = str(uuid.uuid4())
        
        c.execute('''
            INSERT INTO companies (id, brand_name, website, industry, competitors, keywords, sensitivity, last_analysis)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            company_id,
            data.get('brandName'),
            data.get('website'),
            data.get('industry'),
            json.dumps(data.get('competitors', [])),
            json.dumps(data.get('keywords', [])),
            data.get('sensitivity', 0.7),
            json.dumps(data.get('lastAnalysis', {}))
        ))
        conn.commit()
        conn.close()
        return company_id

    @staticmethod
    def find_by_id(company_id: str):
        conn = get_db()
        conn.row_factory = lambda c, r: dict(zip([col[0] for col in c.description], r))
        c = conn.cursor()
        c.execute('SELECT * FROM companies WHERE id = ?', (company_id,))
        res = c.fetchone()
        conn.close()
        
        if res:
            # Parse JSON fields back to objects
            res['competitors'] = json.loads(res['competitors']) if res['competitors'] else []
            res['keywords'] = json.loads(res['keywords']) if res['keywords'] else []
            res['last_analysis'] = json.loads(res['last_analysis']) if res['last_analysis'] else {}
            res['_id'] = res['id']
        return res

    @staticmethod
    def update(company_id: str, data: dict):
        # Handle embedded fields for SQL
        def json_serial(obj):
            """JSON serializer for objects not serializable by default json code"""
            if isinstance(obj, (dt, datetime.date)):
                return obj.isoformat()
            raise TypeError ("Type %s not serializable" % type(obj))

        sql_data = data.copy()
        if 'competitors' in sql_data:
             sql_data['competitors'] = json.dumps(sql_data['competitors'], default=json_serial)
        if 'keywords' in sql_data:
             sql_data['keywords'] = json.dumps(sql_data['keywords'], default=json_serial)
        if 'lastAnalysis' in sql_data:
             sql_data['lastAnalysis'] = json.dumps(sql_data['lastAnalysis'], default=json_serial)
             # Rename for DB column
             sql_data['last_analysis'] = sql_data.pop('lastAnalysis')

        conn = get_db()
        c = conn.cursor()
        
        # Build dynamic query
        fields = []
        values = []
        for k, v in sql_data.items():
            # Check if column exists or skip? For now assume valid keys from CompanyProfileSchema logic
            # Mapping camelCase to snake_case if necessary?
            # Existing mongo logic passed partial dicts.
            # Simple direct mapping:
            if k == 'brandName': k = 'brand_name' # Example mapping?
            
            fields.append(f"{k} = ?")
            values.append(v)
        
        values.append(company_id)
        
        query = f"UPDATE companies SET {', '.join(fields)} WHERE id = ?"
        try:
            c.execute(query, tuple(values))
            conn.commit()
        except Exception as e:
            print(f"Update error: {e}")
        finally:
            conn.close()
        return True
