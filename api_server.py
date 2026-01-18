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
from functools import wraps
from flask_apscheduler import APScheduler
from services.security_service import security_service

# Load environment variables
load_dotenv()

# Add src to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.graph import create_phase1_graph, create_phase2_graph
from src.state import AgentState
from services.action_center import action_center
from services.velocity_predictor import velocity_predictor

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'brandshield-secret-key-dev')

# Initialize Scheduler
scheduler = APScheduler()
scheduler.init_app(app)
scheduler.start()

# --- SECURITY MIDDLEWARE ---
def token_required(f):
    @wraps(f)
    async def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(" ")[1]
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        payload = security_service.verify_token(token)
        if not payload:
            return jsonify({'message': 'Token is invalid or expired!'}), 401
            
        return await f(*args, **kwargs)
    return decorated

# Configure CORS with explicit settings
CORS(app, 
     resources={r"/*": {
         "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
         "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         "allow_headers": ["Content-Type", "Authorization"],
         "supports_credentials": True,
         "expose_headers": ["Content-Type"]
     }})

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

# --- AUTH ENDPOINTS ---
@app.route('/api/auth/login', methods=['POST'])
async def login():
    data = request.get_json()
    # Check for email OR username
    username_or_email = data.get('email') or data.get('username')
    password = data.get('password')
    
    if not data or not username_or_email or not password:
        print(f"Login failed: Missing credentials. Data: {data}")
        return jsonify({'message': 'Could not verify', 'www-authenticate': 'Basic realm="Login required!"'}), 401
    
    users = load_users()
    user = users.get(username_or_email)
    
    if not user:
        print(f"Login failed: User {username_or_email} not found")
        return jsonify({'message': 'User not found'}), 401

    if check_password_hash(user['password'], password):
        # Pass required org_id and prefer user ID over email
        token = security_service.create_token(
            user_id=user.get('id', username_or_email),
            org_id=user.get('company', 'default-org')
        )
        
        # Support Hybrid Auth: Token + Session
        # Session for Web Frontend, Token for API Clients
        user_response = {k: v for k, v in user.items() if k != 'password'}
        session['user'] = user_response
        print(f"Login success: {username_or_email}")
        return jsonify({'token': token, 'user': user_response})
        
    print(f"Login failed: Invalid password for {username_or_email}")
    return jsonify({'message': 'Invalid password'}), 401

# --- BACKGROUND JOBS ---
@scheduler.task('interval', id='scheduled_cleanup', hours=24)
def scheduled_cleanup():
    print("🧹 Running Scheduled Cleanup (Logs/Cache)...")
    # Placeholder for actual cleanup logic

@app.route('/api/action-center/approve', methods=['POST'])
# @token_required # Uncomment to enforce security on this route
async def approve_response():
    data = request.get_json()
    response_id = data.get('response_id')
    selected_idx = data.get('selected_index', 0)
    
    if not response_id:
        return jsonify({'error': 'Missing response_id'}), 400
        
    result = await action_center.approve_response(response_id, selected_idx)
    if not result:
        return jsonify({'error': 'Response not found'}), 404
        
    return jsonify({'status': 'approved', 'response': result.dict()})

@app.route('/api/action-center/send', methods=['POST'])
async def send_response():
    data = request.get_json()
    response_id = data.get('response_id')
    channel = data.get('channel', 'simulation')
    
    if not response_id:
        return jsonify({'error': 'Missing response_id'}), 400

    success = await action_center.send_response(response_id, channel)
    return jsonify({'status': 'sent' if success else 'failed'})

@app.route('/api/action-center/latest', methods=['GET'])
async def get_latest_action():
    action = await action_center.get_latest_action()
    if not action:
         # Mock fallback if no action exists yet for demo
         return jsonify({
             "id": "mock_action_1",
             "status": "draft",
             "draft_responses": [
                 {"style": "Empathetic", "text": "We are deeply sorry for the inconvenience and are working hard to resolve it."},
                 {"style": "Professional", "text": "We acknowledge the issue and have deployed a fix."},
                 {"style": "Transparent", "text": "Our systems encountered a bug. Here is what happened..."}
             ]
         })
    return jsonify(action)

# In-memory storage for analysis sessions (replace with DB in production)
analysis_sessions = {}
analysis_history = []  # Store all analyses with timestamps

@app.route('/api/auth/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
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
        
        # Auto-login after registration
        session['user'] = user_response
        
        return jsonify({'message': 'Registration successful', 'user': user_response}), 201

    except Exception as e:
        print(f"Registration error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Registration failed: {str(e)}'}), 500



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
        'version': '1.0.0',
        'cors': 'enabled'
    })

@app.route('/api/test', methods=['GET', 'POST'])
def test_endpoint():
    """Test endpoint for debugging"""
    return jsonify({
        'message': 'API is working',
        'method': request.method,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/analyze', methods=['POST'])
async def start_analysis():
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
        phase1_result = await app1.ainvoke(initial_state)
        
        # Generate session ID
        session_id = f"session_{len(analysis_sessions) + 1}"
        analysis_sessions[session_id] = {
            'brand': brand_name,
            'data_source': data_source,
            'state': phase1_result,
            'phase': 'phase1_complete',
            'timestamp': datetime.now().isoformat()
        }
        
        # Add to history for trend tracking
        analysis_history.append({
            'session_id': session_id,
            'brand': brand_name,
            'timestamp': datetime.now().isoformat(),
            'sentiment_stats': phase1_result.get('sentiment_stats', {}),
            'emotion_analysis': phase1_result.get('emotion_analysis', {}),
            'risk_metrics': phase1_result.get('risk_metrics', {})
        })
        
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
async def finalize_analysis(session_id):
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
        phase2_result = await app2.ainvoke(current_state)
        
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

@app.route('/api/insights', methods=['GET'])
def get_insights():
    """Get insights from recent analysis sessions"""
    try:
        # Get time range parameter (default to 7 days)
        days = int(request.args.get('days', 7))
        
        # Get recent sessions from history
        from datetime import timedelta
        cutoff_date = datetime.now() - timedelta(days=days)
        
        recent_analyses = [
            item for item in analysis_history 
            if datetime.fromisoformat(item['timestamp']) >= cutoff_date
        ]
        
        # If no real data, generate sample data for the last 4 days
        if not recent_analyses:
            # Generate sample data
            sample_data = []
            for i in range(4):
                date = datetime.now() - timedelta(days=i)
                sample_data.append({
                    'date': date.isoformat(),
                    'sentiment': {
                        'positive': 70 + (i * 2),
                        'neutral': 20 - i,
                        'negative': 10 - i
                    },
                    'aspects': [
                        {'name': 'Product Design', 'mentions': 642 - (i * 50), 'trend': 'up'},
                        {'name': 'Price & Value', 'mentions': 412 - (i * 30), 'trend': 'neutral'},
                        {'name': 'Performance', 'mentions': 891 - (i * 70), 'trend': 'up'},
                        {'name': 'User Experience', 'mentions': 225 - (i * 20), 'trend': 'down'}
                    ],
                    'total_mentions': 2170 - (i * 170)
                })
            
            return jsonify({
                'timeRange': f'{days}d',
                'dataPoints': sample_data,
                'totalSessions': 0,
                'momentum': {
                    'positive': 12.4,
                    'negative': -2.1,
                    'stability': 88
                }
            })
        
        # Process real session data
        timeline_data = []
        total_positive = 0
        total_neutral = 0
        total_negative = 0
        
        for analysis in recent_analyses:
            sentiment_stats = analysis.get('sentiment_stats', {})
            
            timeline_data.append({
                'brand': analysis.get('brand'),
                'session_id': analysis.get('session_id'),
                'timestamp': analysis.get('timestamp'),
                'sentiment': sentiment_stats,
                'emotion': analysis.get('emotion_analysis', {}),
                'risk': analysis.get('risk_metrics', {})
            })
            
            # Aggregate sentiment
            if sentiment_stats:
                total_positive += sentiment_stats.get('positive_ratio', 0)
                total_neutral += sentiment_stats.get('neutral_ratio', 0)
                total_negative += sentiment_stats.get('negative_ratio', 0)
        
        avg_count = len(recent_analyses) if recent_analyses else 1
        
        return jsonify({
            'timeRange': f'{days}d',
            'totalSessions': len(recent_analyses),
            'timeline': timeline_data,
            'averageSentiment': {
                'positive': round((total_positive / avg_count) * 100, 2),
                'neutral': round((total_neutral / avg_count) * 100, 2),
                'negative': round((total_negative / avg_count) * 100, 2)
            },
            'momentum': {
                'positive': round((total_positive / avg_count) * 100 - 60, 2),
                'negative': round((total_negative / avg_count) * 100 - 10, 2),
                'stability': 88
            }
        })
        
    except Exception as e:
        print(f"Error getting insights: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/trends', methods=['GET'])
def get_trends():
    """Get trend analysis from recent sessions"""
    try:
        days = int(request.args.get('days', 30))
        
        # Get all sessions
        sessions_data = []
        for session_id, session_data in analysis_sessions.items():
            state = session_data.get('state', {})
            sessions_data.append({
                'brand': session_data.get('brand'),
                'sentiment': state.get('sentiment_stats', {}),
                'replies': state.get('social_media_replies', []),
                'findings': state.get('rag_findings_structured', [])
            })
        
        # If no real data, generate sample data
        if not sessions_data:
            return jsonify({
                'timeRange': f'{days}days',
                'totalComments': 14242,
                'aspects': [
                    {
                        'name': 'Design',
                        'sentiment': {'positive': 82, 'neutral': 12, 'negative': 6},
                        'themes': {
                            'positive': [
                                {'text': 'Sleek side profile', 'count': 244},
                                {'text': 'Minimalist interior', 'count': 189},
                                {'text': 'Headlight signature', 'count': 112},
                                {'text': 'Wheel design', 'count': 94}
                            ],
                            'negative': [
                                {'text': 'Front grill size', 'count': 112},
                                {'text': 'Plastic dash trim', 'count': 76},
                                {'text': 'Rear visibility', 'count': 43}
                            ]
                        }
                    },
                    {
                        'name': 'Price',
                        'sentiment': {'positive': 45, 'neutral': 30, 'negative': 25},
                        'themes': {
                            'positive': [
                                {'text': 'Good value for features', 'count': 156}
                            ],
                            'negative': [
                                {'text': 'Too expensive', 'count': 198},
                                {'text': 'Long wait times', 'count': 87}
                            ]
                        }
                    },
                    {
                        'name': 'Performance',
                        'sentiment': {'positive': 74, 'neutral': 16, 'negative': 10},
                        'themes': {
                            'positive': [
                                {'text': 'Quick acceleration', 'count': 221},
                                {'text': 'Smooth handling', 'count': 167}
                            ],
                            'negative': [
                                {'text': 'Range concerns', 'count': 89}
                            ]
                        }
                    },
                    {
                        'name': 'UX & Comfort',
                        'sentiment': {'positive': 61, 'neutral': 20, 'negative': 19},
                        'themes': {
                            'positive': [
                                {'text': 'Comfortable seats', 'count': 198},
                                {'text': 'Good lumbar support', 'count': 134}
                            ],
                            'negative': [
                                {'text': 'Infotainment lag', 'count': 112},
                                {'text': 'Complex controls', 'count': 76}
                            ]
                        }
                    }
                ],
                'recentComments': [
                    {
                        'text': 'The side profile of the new model is absolutely stunning. They finally got the proportions right.',
                        'aspect': 'Design',
                        'sentiment': 'positive',
                        'timestamp': '2 min ago'
                    },
                    {
                        'text': 'Why is the front grill so massive? It ruins the otherwise elegant aesthetic.',
                        'aspect': 'Design',
                        'sentiment': 'negative',
                        'timestamp': '14 min ago'
                    },
                    {
                        'text': 'Acceleration is punchy, but the infotainment system lags when switching between apps.',
                        'aspect': 'UX',
                        'sentiment': 'neutral',
                        'timestamp': '45 min ago'
                    }
                ]
            })
        
        # Process real data
        all_replies = []
        aspect_sentiment = {}
        
        for session in sessions_data:
            replies = session.get('replies', [])
            all_replies.extend(replies)
            
            sentiment = session.get('sentiment', {})
            brand = session.get('brand', 'Unknown')
            
            if brand not in aspect_sentiment:
                aspect_sentiment[brand] = sentiment
        
        return jsonify({
            'timeRange': f'{days}days',
            'totalSessions': len(sessions_data),
            'totalComments': len(all_replies),
            'aspects': aspect_sentiment,
            'recentComments': all_replies[:10] if all_replies else []
        })
        
    except Exception as e:
        print(f"Error getting trends: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Initialize DBs
    from services.action_center import action_center
    import asyncio
    
    # Run DB init
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    
    loop.run_until_complete(action_center.init_db())
    
    print("🚀 Starting BrandShield AI API Server...")
    print("📡 API will be available at: http://localhost:5000")
    print("🔑 Make sure your .env file is configured with API keys")
    app.run(debug=True, host='0.0.0.0', port=5000, use_reloader=False)