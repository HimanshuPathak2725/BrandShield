"""
BrandShield Lightweight API Server
Flask-based REST API without heavy ML dependencies
"""
from flask import Flask, request, jsonify, session
from flask_cors import CORS
import os
import time
import random
import json
from datetime import datetime, timedelta
from dotenv import load_dotenv
import uuid

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'brandshield-secret-key-change-in-production')
CORS(app, supports_credentials=True, origins=['http://localhost:3000'])

# In-memory user storage (replace with database in production)
USERS_FILE = 'users.json'

def load_users():
    """Load users from JSON file"""
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_users(users):
    """Save users to JSON file"""
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=2)

# Load existing users
users_db = load_users()

# Mock data generator
def generate_mock_analysis(brand_name, data_source):
    """Generate realistic mock analysis data"""
    time.sleep(2)  # Simulate processing time
    
    return {
        "session_id": f"session_{int(time.time())}",
        "brand": brand_name,
        "data_source": data_source,
        "timestamp": datetime.now().isoformat(),
        "status": "completed",
        "overall_sentiment": {
            "score": round(random.uniform(0.5, 0.9), 2),
            "vader_compound": round(random.uniform(0.3, 0.7), 2),
            "textblob_polarity": round(random.uniform(0.2, 0.6), 2),
            "label": "Positive",
            "distribution": {
                "positive": random.randint(60, 80),
                "neutral": random.randint(10, 25),
                "negative": random.randint(5, 15)
            }
        },
        "risk_metrics": {
            "reputation_risk_score": round(random.uniform(15, 35), 1),
            "viral_risk": random.choice(["Low", "Medium"]),
            "sentiment_velocity": round(random.uniform(-5, 10), 1),
            "alert_level": "Normal"
        },
        "emotion_analysis": {
            "dominant_emotion": random.choice(["excitement", "trust", "satisfaction"]),
            "emotion_distribution": {
                "excitement": round(random.uniform(20, 40), 1),
                "trust": round(random.uniform(15, 30), 1),
                "satisfaction": round(random.uniform(10, 25), 1),
                "concern": round(random.uniform(5, 15), 1),
                "frustration": round(random.uniform(2, 10), 1)
            },
            "viral_risk": "Low",
            "controversy_score": round(random.uniform(0.1, 0.3), 2)
        },
        "key_aspects": [
            {
                "aspect": "Product Quality",
                "sentiment": "positive",
                "score": round(random.uniform(0.6, 0.9), 2),
                "mentions": random.randint(150, 300)
            },
            {
                "aspect": "Customer Service",
                "sentiment": "positive",
                "score": round(random.uniform(0.5, 0.8), 2),
                "mentions": random.randint(100, 250)
            },
            {
                "aspect": "Innovation",
                "sentiment": "positive",
                "score": round(random.uniform(0.7, 0.95), 2),
                "mentions": random.randint(200, 400)
            },
            {
                "aspect": "Pricing",
                "sentiment": "mixed",
                "score": round(random.uniform(0.2, 0.5), 2),
                "mentions": random.randint(80, 180)
            }
        ],
        "top_opinions": [
            {
                "text": f"Great innovation from {brand_name}! The latest features are impressive.",
                "sentiment": "positive",
                "score": 0.85,
                "engagement": random.randint(500, 2000),
                "source": data_source
            },
            {
                "text": f"I've been a {brand_name} customer for years and the quality keeps improving.",
                "sentiment": "positive",
                "score": 0.78,
                "engagement": random.randint(300, 1500),
                "source": data_source
            },
            {
                "text": f"{brand_name}'s customer support team was very helpful with my issue.",
                "sentiment": "positive",
                "score": 0.72,
                "engagement": random.randint(200, 1000),
                "source": data_source
            },
            {
                "text": f"The pricing is a bit high, but {brand_name} delivers excellent value.",
                "sentiment": "mixed",
                "score": 0.45,
                "engagement": random.randint(150, 800),
                "source": data_source
            }
        ],
        "strategic_recommendations": [
            f"[+] Maintain strong focus on innovation - it's a key strength for {brand_name}",
            f"[!] Monitor pricing discussions - some customers express concerns about affordability",
            f"[>] Amplify positive customer service experiences in marketing campaigns",
            f"[#] Continue tracking sentiment velocity to detect early warning signs",
            f"[*] Consider highlighting product quality improvements in communications"
        ],
        "crisis_probability": round(random.uniform(5, 20), 1),
        "ai_insights": f"The overall sentiment for {brand_name} is strongly positive with a sentiment score of {round(random.uniform(75, 90), 1)}%. Key strengths include innovation and product quality. Monitor pricing-related discussions as a potential concern area. Current risk level is low with no immediate crisis indicators detected.",
        "source_breakdown": {
            data_source: {
                "volume": random.randint(500, 2000),
                "avg_sentiment": round(random.uniform(0.6, 0.8), 2)
            }
        }
    }

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'BrandShield AI API (Lite)',
        'version': '1.0.0-lite',
        'note': 'Running in lightweight mode with mock data',
        'total_users': len(users_db)
    })

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        name = data.get('name', '').strip()
        company = data.get('company', '').strip()
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        if email in users_db:
            return jsonify({'error': 'User already exists'}), 409
        
        # Create new user
        user_id = str(uuid.uuid4())
        users_db[email] = {
            'id': user_id,
            'email': email,
            'password': password,  # In production, hash this!
            'name': name,
            'company': company,
            'created_at': datetime.now().isoformat(),
            'last_login': datetime.now().isoformat()
        }
        
        # Save to file
        save_users(users_db)
        
        # Create session
        session['user_id'] = user_id
        session['email'] = email
        
        print(f"New user registered: {email} (Total users: {len(users_db)})")
        
        return jsonify({
            'success': True,
            'user': {
                'id': user_id,
                'email': email,
                'name': name,
                'company': company
            }
        }), 201
        
    except Exception as e:
        print(f"Registration error: {str(e)}")
        return jsonify({'error': 'Registration failed', 'message': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Check if user exists
        if email not in users_db:
            return jsonify({'error': 'Invalid email or password'}), 401
        
        user = users_db[email]
        
        # Verify password (in production, use proper hashing!)
        if user['password'] != password:
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Update last login
        users_db[email]['last_login'] = datetime.now().isoformat()
        save_users(users_db)
        
        # Create session
        session['user_id'] = user['id']
        session['email'] = email
        
        print(f"User logged in: {email}")
        
        return jsonify({
            'success': True,
            'user': {
                'id': user['id'],
                'email': user['email'],
                'name': user.get('name', ''),
                'company': user.get('company', '')
            }
        }), 200
        
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'error': 'Login failed', 'message': str(e)}), 500

@app.route('/api/dashboard', methods=['GET', 'OPTIONS'])
def get_dashboard_data():
    if request.method == 'OPTIONS':
        return '', 204
    
    # Mock data for dashboard
    return jsonify({
        "sentimentCounts": { "Positive": 72, "Neutral": 18, "Negative": 10 },
        "sentimentScore": 0.62,
        "velocityScore": 35,
        "topMentions": [
            {
                "source": "Twitter",
                "sentiment": "Positive",
                "date": datetime.now().isoformat(),
                "text": "The new product launch is exceeding all expectations! #BrandWin"
            },
            {
                "source": "Reddit", 
                "sentiment": "Neutral",
                "date": datetime.now().isoformat(),
                "text": "Does anyone know when the next update is coming out?"
            },
            {
                "source": "News",
                "sentiment": "Negative",
                "date": datetime.now().isoformat(),
                "text": "Competitor announces a rival product with lower pricing."
            }
        ]
    }), 200

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """Logout user"""
    session.clear()
    return jsonify({'success': True, 'message': 'Logged out successfully'}), 200

@app.route('/api/auth/me', methods=['GET'])
def get_current_user():
    """Get current logged-in user"""
    user_id = session.get('user_id')
    email = session.get('email')
    
    if not user_id or not email:
        return jsonify({'authenticated': False}), 401
    
    if email not in users_db:
        session.clear()
        return jsonify({'authenticated': False}), 401
    
    user = users_db[email]
    return jsonify({
        'authenticated': True,
        'user': {
            'id': user['id'],
            'email': user['email'],
            'name': user.get('name', ''),
            'company': user.get('company', '')
        }
    }), 200

@app.route('/api/auth/users', methods=['GET'])
def get_all_users():
    """Get all registered users (admin endpoint)"""
    users_list = []
    for email, user in users_db.items():
        users_list.append({
            'id': user['id'],
            'email': email,
            'name': user.get('name', ''),
            'company': user.get('company', ''),
            'created_at': user.get('created_at', ''),
            'last_login': user.get('last_login', '')
        })
    
    return jsonify({
        'total_users': len(users_list),
        'users': users_list
    }), 200

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
        
        print(f"\nAnalyzing {brand_name} from {data_source}...")
        
        # Generate mock analysis
        result = generate_mock_analysis(brand_name, data_source)
        
        print(f"Analysis complete for {brand_name}")
        
        return jsonify(result), 200
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({
            'error': 'Analysis failed',
            'message': str(e)
        }), 500

@app.route('/api/session/<session_id>', methods=['GET'])
def get_session(session_id):
    """Get analysis session results"""
    return jsonify({
        'session_id': session_id,
        'status': 'completed',
        'message': 'Session data would be retrieved from database'
    })

if __name__ == '__main__':
    print("\n" + "="*60)
    print("BrandShield AI - Lightweight API Server")
    print("="*60)
    print("Starting Flask server on http://localhost:5000")
    print("CORS enabled for React frontend")
    print("Running in MOCK DATA mode (no heavy ML dependencies)")
    print("="*60 + "\n")
    
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=False,
        use_reloader=False
    )
