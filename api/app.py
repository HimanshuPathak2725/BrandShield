"""
BrandShield API - Vercel Deployment Entrypoint
Exports the Flask app from api_server_lite for Vercel compatibility
"""

import sys
import os

# Add parent directory to path so we can import from it
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import the Flask app from api_server_lite
from api_server_lite import app

# Update CORS for Vercel deployment
from flask_cors import CORS

# Allow requests from the deployed Vercel domain and localhost
allowed_origins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
]

# Allow Vercel deployed domain
if os.getenv('VERCEL_URL'):
    allowed_origins.append(f'https://{os.getenv("VERCEL_URL")}')
    allowed_origins.append(f'https://*.vercel.app')

CORS(app, 
     resources={r"/api/*": {
         "origins": allowed_origins,
         "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         "allow_headers": ["Content-Type", "Authorization"],
         "supports_credentials": True
     }})

# Vercel expects to find the app instance like this
__all__ = ['app']

