# 🛡️ BrandShield AI - Crisis Prediction System

**AI-Powered Brand Sentiment Analysis & PR Crisis Predictor**

This project combines a **React frontend** (from Simran branch) with an **AI-powered backend** (from ayush branch) to deliver real-time brand crisis prediction using advanced multi-agent AI systems.

---

## 🌟 AI Features

### Multi-Agent AI Pipeline
- **🗺️ Planning Agent**: Generates sophisticated research strategies
- **🔍 Search Agent**: Fetches real-time web mentions using Exa API
- **⚖️ Evaluator Agent**: Filters time-sensitive content (past 48 hours only)
- **🧠 Advanced RAG Agent**: 
  - REAL semantic understanding (not keyword matching)
  - FAISS vector database with HuggingFace embeddings
  - Finds hidden patterns (e.g., "screen went black" = "technical failure")
- **📊 Strategy Agent**: Generates CEO-level strategic reports
- **🔄 LangGraph Orchestration**: Intelligent workflow coordination

### AI Capabilities
- ✅ **Real-time Sentiment Analysis** using VADER + TextBlob
- ✅ **Crisis Risk Scoring** (0-100 scale)
- ✅ **Emotion Analysis** (joy, anger, fear, sadness, surprise)
- ✅ **Semantic Search** for hidden crisis indicators
- ✅ **Automated Response Drafting** for social media
- ✅ **Breaking News Detection** (< 6 hours old)

---

## 📁 Project Structure

```
BrandShield/
├── frontend/                  # React frontend (Simran branch)
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnalysisForm/  # AI analysis input form
│   │   │   ├── AIInsight/     # AI-generated insights display
│   │   │   ├── SentimentScore/# Real-time sentiment visualization
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── DashboardPage.js  # AI analysis dashboard
│   │   │   └── ResultsPage.js    # AI results display
│   │   └── App.js
│   └── package.json
│
├── src/                       # AI backend (ayush branch)
│   ├── agents.py              # AI agent implementations
│   ├── advanced_agents.py     # Emotion & RAG helpers
│   ├── graph.py               # LangGraph workflow
│   ├── state.py               # State management
│   └── llm_utils.py          # LLM utilities
│
├── api_server.py              # Flask REST API
├── app.py                     # Streamlit dashboard (alternative UI)
├── requirements.txt           # Python dependencies
├── .env.example              # Environment template
└── README.md                 # This file
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Python 3.9+**
- **Node.js 16+** and npm
- API Keys:
  - **Exa API** (required): https://exa.ai/
  - **Google Gemini API** (recommended): https://aistudio.google.com/app/apikey
  - **HuggingFace Token** (optional): https://huggingface.co/settings/tokens

### Step 1: Backend Setup

```bash
# Install Python dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and add your API keys:
# EXA_API_KEY=your_key_here
# GEMINI_API_KEY=your_key_here (optional but recommended)
```

### Step 2: Frontend Setup

```bash
cd frontend
npm install

# Create .env file for frontend
echo "REACT_APP_API_URL=http://localhost:5000" > .env
```

---

## 🎯 Running the Application

### Option 1: Full Stack (React + AI Backend)

**Terminal 1 - Start Flask API Server:**
```bash
python api_server.py
```
Server will run on: `http://localhost:5000`

**Terminal 2 - Start React Frontend:**
```bash
cd frontend
npm start
```
Frontend will open on: `http://localhost:3000`

### Option 2: Streamlit Dashboard Only (Original ayush UI)

```bash
streamlit run app.py
```
Dashboard will open on: `http://localhost:8501`

---

## 💻 Usage

### React Frontend (Recommended)
1. Open `http://localhost:3000`
2. Enter a brand name (e.g., "Tesla", "Apple", "Nike")
3. Select data source (default: All Sources)
4. Click "Start AI Analysis"
5. Wait for multi-agent AI pipeline to complete (~30-60 seconds)
6. View results:
   - Sentiment distribution (Positive/Neutral/Negative %)
   - Risk score (0-100)
   - AI-detected issues and patterns
   - Emotion analysis
   - Strategic recommendations

### API Endpoints

**Health Check:**
```bash
GET http://localhost:5000/api/health
```

**Start Analysis:**
```bash
POST http://localhost:5000/api/analyze
Content-Type: application/json

{
  "brand": "Tesla",
  "data_source": "Reddit Discussions"
}
```

**Get Configuration:**
```bash
GET http://localhost:5000/api/config
```

---

## 🔧 Configuration

### API Keys (.env file)

```env
# Required for web search
EXA_API_KEY=your_exa_api_key_here

# Recommended for best AI quality
GEMINI_API_KEY=your_gemini_api_key_here

# Optional fallback
HUGGINGFACEHUB_API_TOKEN=your_hf_token_here
```

### Frontend Configuration

Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000
```

---

## 🧠 How It Works

### Phase 1: Research & Analysis
1. **Planning Agent** creates multi-angle research strategy
2. **Search Agent** fetches recent mentions from Exa API
3. **Evaluator Agent** filters for time-relevance (< 48 hours)
4. **RAG Agent** performs semantic analysis:
   - Splits text into chunks
   - Creates vector embeddings
   - Stores in FAISS database
   - Semantic search for crisis patterns
5. **Sentiment Analysis** runs on all mentions
6. **Emotion Analysis** detects dominant emotions
7. **Risk Scoring** calculates 0-100 crisis probability

### Phase 2: Strategy Generation
1. **Strategy Agent** synthesizes all findings
2. Generates CEO-level strategic report
3. Provides actionable recommendations
4. Drafts social media responses (if needed)

---

## 🎨 Frontend Features (AI-Only)

All non-AI features have been removed. The frontend now exclusively displays:

✅ **AI Analysis Form** - Brand input with AI backend integration  
✅ **AI Sentiment Score** - Real-time sentiment visualization  
✅ **AI Insights Panel** - Automated crisis summaries  
✅ **AI Agent Pipeline Status** - Multi-agent orchestration display  
✅ **AI Capabilities Showcase** - RAG, Multi-Agent, Crisis Prediction  

❌ Removed: Home page, marketing features, demo cards, trends, etc.

---

## 🔬 Technologies Used

### Backend (AI)
- **LangGraph** - Multi-agent orchestration
- **LangChain** - AI framework
- **Google Gemini** - Primary LLM (fast, high-quality)
- **HuggingFace** - Embeddings & fallback LLM
- **FAISS** - Vector database for semantic search
- **Exa API** - Real-time web search
- **VADER + TextBlob** - Sentiment analysis
- **Flask** - REST API server

### Frontend
- **React** - UI framework
- **Modern CSS** - Google-inspired styling
- **LocalStorage** - Session management

---

## 🚨 Troubleshooting

### "Exa API key not configured"
- Add `EXA_API_KEY` to your `.env` file
- Get free API key at https://exa.ai/

### "Analysis failed"
- Check Python backend is running (`python api_server.py`)
- Verify `.env` file has correct API keys
- Check console for detailed error messages

### Frontend not connecting to backend
- Ensure `REACT_APP_API_URL=http://localhost:5000` in `frontend/.env`
- Restart React dev server after changing .env
- Check CORS is enabled in Flask (already configured)

### Slow analysis
- First run downloads ML models (~200MB) - this is normal
- Subsequent runs will be faster
- Gemini API is faster than HuggingFace fallback

---

## 📊 Example Output

```json
{
  "session_id": "session_1",
  "brand": "Tesla",
  "sentiment_stats": {
    "positive": 45.2,
    "neutral": 32.1,
    "negative": 22.7
  },
  "risk_metrics": {
    "score": 68,
    "level": "MEDIUM",
    "velocity": 15
  },
  "emotion_analysis": {
    "dominant_emotion": "anticipation",
    "scores": {...}
  },
  "rag_findings": [
    {
      "category": "Technical Issues",
      "severity": "high",
      "description": "Battery overheating reports increasing..."
    }
  ]
}
```

---

## 🎓 Built For

**Google Development Student Hackathon**  
Demonstrating advanced AI agent orchestration for real-world PR crisis management.

---

## 📄 License

See [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Simran branch** - Frontend UI/UX design
- **Ayush branch** - AI backend architecture
- **Google Gemini** - Fast, high-quality LLM
- **LangGraph** - Multi-agent orchestration framework
- **Exa AI** - Real-time web search API

---

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Verify all API keys are configured
3. Check terminal logs for detailed errors
4. Ensure all dependencies are installed

---

**🛡️ BrandShield AI - Predicting crises before they happen.**
