"""
BrandShield API Server
Flask-based REST API for AI Crisis Prediction
"""
from flask import Flask, request, jsonify, session
from flask_cors import CORS
import os
import sys
import json
import uuid
from datetime import datetime
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash

# Add src to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.graph import create_phase1_graph, create_phase2_graph
from src.state import AgentState

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'brandshield-secret-key-dev')
# Allow CORS for all domains on all routes, supports credentials
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# File to store users
USERS_FILE = 'users.json'

def load_users():
    if os.path.exists(USERS_FILE):
        try:
            with open(USERS_FILE, 'r') as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_users(users):
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=2)

# In-memory storage for analysis sessions (replace with DB in production)
analysis_sessions = {}

@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        company = data.get('company', '')

        if not email or not password or not name:
            return jsonify({'error': 'Missing required fields'}), 400

        users = load_users()
        
        if email in users:
            return jsonify({'error': 'User already exists'}), 400

        user_id = str(uuid.uuid4())
        new_user = {
            'id': user_id,
            'email': email,
            'password': generate_password_hash(password),
            'name': name,
            'company': company,
            'created_at': datetime.now().isoformat(),
            'last_login': None
        }

        users[email] = new_user
        save_users(users)

        # Return user info (excluding password)
        user_response = {k: v for k, v in new_user.items() if k != 'password'}
        return jsonify({'message': 'Registration successful', 'user': user_response}), 201

    except Exception as e:
        print(f"Registration error: {e}")
        return jsonify({'error': 'Registration failed'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Missing email or password'}), 400

        users = load_users()
        
        if email not in users:
            return jsonify({'error': 'Invalid credentials'}), 401
            
        user = users[email]
        
        if not check_password_hash(user.get('password'), password):
            return jsonify({'error': 'Invalid credentials'}), 401

        # Update last login
        user['last_login'] = datetime.now().isoformat()
        save_users(users)
        
        user_response = {k: v for k, v in user.items() if k != 'password'}
        session['user'] = user_response
        return jsonify({'message': 'Login successful', 'user': user_response}), 200

    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'error': 'Login failed'}), 500

@app.route('/api/auth/me', methods=['GET'])
def check_auth():
    """Check authentication status"""
    user = session.get('user')
    if user:
        return jsonify({'authenticated': True, 'user': user}), 200
    return jsonify({'authenticated': False}), 401

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """Logout user"""
    session.pop('user', None)
    return jsonify({'message': 'Logged out'}), 200

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'BrandShield AI API',
        'version': '1.0.0'
    })

@app.route('/api/analyze', methods=['POST'])
def start_analysis():
    """
    Start a new brand analysis
    Expected payload: { "brand": "Tesla", "data_source": "Reddit Discussions" }
    """
    try:
        data = request.get_json()
        brand_name = data.get('brand', '').strip()
        data_source = data.get('data_source', 'All Sources')
        
        if not brand_name:
            return jsonify({'error': 'Brand name is required'}), 400
        
        # Check for Exa API key
        if not os.getenv("EXA_API_KEY"):
            return jsonify({
                'error': 'API not configured',
                'message': 'Exa API key not found. Please configure your .env file.'
            }), 503
        
        # Initialize state
        initial_state = {
            "topic": brand_name,
            "raw_content": [],
            "filtered_content": [],
            "sentiment_stats": {},
            "emotion_analysis": {},
            "social_media_replies": [],
            "risk_metrics": {},
            "rag_findings_structured": [],
            "research_plan": []
        }
        
        # Run Phase 1 (Research & Analysis)
        print(f"Starting Phase 1 analysis for: {brand_name}")
        app1 = create_phase1_graph()
        phase1_result = app1.invoke(initial_state)
        
        # Generate session ID
        session_id = f"session_{len(analysis_sessions) + 1}"
        analysis_sessions[session_id] = {
            'brand': brand_name,
            'data_source': data_source,
            'state': phase1_result,
            'phase': 'phase1_complete'
        }
        
        # Return Phase 1 results
        return jsonify({
            'session_id': session_id,
            'brand': brand_name,
            'phase': 'phase1_complete',
            'sentiment_stats': phase1_result.get('sentiment_stats', {}),
            'emotion_analysis': phase1_result.get('emotion_analysis', {}),
            'risk_metrics': phase1_result.get('risk_metrics', {}),
            'social_media_replies': phase1_result.get('social_media_replies', []),
            'rag_findings': phase1_result.get('rag_findings_structured', []),
            'research_plan': phase1_result.get('research_plan', [])
        })
        
    except Exception as e:
        print(f"Error in analysis: {str(e)}")
        return jsonify({
            'error': 'Analysis failed',
            'message': str(e)
        }), 500

@app.route('/api/analyze/<session_id>/finalize', methods=['POST'])
def finalize_analysis(session_id):
    """
    Finalize analysis with approved replies
    Expected payload: { "approved_replies": [...] }
    """
    try:
        if session_id not in analysis_sessions:
            return jsonify({'error': 'Session not found'}), 404
        
        session = analysis_sessions[session_id]
        data = request.get_json()
        approved_replies = data.get('approved_replies', [])
        
        # Update state with approved replies
        current_state = session['state']
        current_state['social_media_replies'] = approved_replies
        
        # Run Phase 2 (Strategy & Report)
        print(f"Starting Phase 2 for session: {session_id}")
        app2 = create_phase2_graph()
        phase2_result = app2.invoke(current_state)
        
        # Update session
        session['state'] = phase2_result
        session['phase'] = 'complete'
        
        # Return final report
        final_report = phase2_result.get('final_report') or phase2_result.get('draft_report') or "Report generation failed"
        
        return jsonify({
            'session_id': session_id,
            'phase': 'complete',
            'final_report': final_report,
            'sentiment_stats': phase2_result.get('sentiment_stats', {}),
            'risk_metrics': phase2_result.get('risk_metrics', {})
        })
        
    except Exception as e:
        print(f"Error in finalization: {str(e)}")
        return jsonify({
            'error': 'Finalization failed',
            'message': str(e)
        }), 500

@app.route('/api/session/<session_id>', methods=['GET'])
def get_session(session_id):
    """Get session details"""
    if session_id not in analysis_sessions:
        return jsonify({'error': 'Session not found'}), 404
    
    session = analysis_sessions[session_id]
    state = session['state']
    
    return jsonify({
        'session_id': session_id,
        'brand': session['brand'],
        'phase': session['phase'],
        'sentiment_stats': state.get('sentiment_stats', {}),
        'emotion_analysis': state.get('emotion_analysis', {}),
        'risk_metrics': state.get('risk_metrics', {}),
        'final_report': state.get('final_report', '')
    })

@app.route('/api/config', methods=['GET'])
def get_config():
    """Get API configuration status"""
    return jsonify({
        'exa_configured': bool(os.getenv('EXA_API_KEY')),
        'gemini_configured': bool(os.getenv('GEMINI_API_KEY')),
        'huggingface_configured': bool(os.getenv('HUGGINGFACEHUB_API_TOKEN'))
    })

if __name__ == '__main__':
    print("🚀 Starting BrandShield AI API Server...")
    print("📡 API will be available at: http://localhost:5000")
    print("🔑 Make sure your .env file is configured with API keys")
    app.run(debug=True, host='0.0.0.0', port=5000, use_reloader=False)
