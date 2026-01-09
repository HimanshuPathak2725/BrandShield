#!/bin/bash
# BrandShield AI - Full Stack Startup Script

echo "🛡️  BrandShield AI - Starting Full Stack Application"
echo "=================================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "📝 Please copy .env.example to .env and configure your API keys"
    exit 1
fi

# Check if Exa API key is configured
if ! grep -q "EXA_API_KEY=.*[a-zA-Z0-9]" .env; then
    echo "⚠️  Warning: EXA_API_KEY not configured in .env"
    echo "🔑 Get your free API key at: https://exa.ai/"
fi

echo "🔧 Checking Python dependencies..."
pip list | grep -q "flask" || {
    echo "📦 Installing Python dependencies..."
    pip install -r requirements.txt
}

echo "🔧 Checking Node.js dependencies..."
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    cd frontend && npm install && cd ..
fi

echo ""
echo "✅ All dependencies ready!"
echo ""
echo "🚀 Starting services..."
echo "=================================================="
echo ""

# Start Flask API in background
echo "🔥 Starting Flask API on http://localhost:5000..."
python api_server.py &
FLASK_PID=$!

# Wait for Flask to start
sleep 3

# Start React frontend
echo "⚛️  Starting React frontend on http://localhost:3000..."
cd frontend && npm start &
REACT_PID=$!

echo ""
echo "=================================================="
echo "✅ BrandShield AI is running!"
echo "=================================================="
echo ""
echo "📡 API Server: http://localhost:5000"
echo "🌐 Frontend:   http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for Ctrl+C
trap "echo ''; echo '🛑 Stopping services...'; kill $FLASK_PID $REACT_PID; exit" INT
wait
