# 🚀 Quick Start Guide - BrandShield AI

## ⚡ Fastest Way to Run

### Windows (One Command)
```powershell
.\start.ps1
```

This will:
- Check all dependencies
- Install missing packages
- Start Flask API server (port 5000)
- Start React frontend (port 3000)
- Open browser automatically

---

## 🔑 Before First Run

### 1. Get API Keys (Required)

**Exa API (Required):**
- Visit: https://exa.ai/
- Sign up for free account
- Copy your API key

**Google Gemini (Recommended):**
- Visit: https://aistudio.google.com/app/apikey
- Create API key (free tier available)

### 2. Configure Environment

```powershell
# Copy template
cp .env.example .env

# Edit .env and add your keys:
# EXA_API_KEY=your_exa_key_here
# GEMINI_API_KEY=your_gemini_key_here
```

### 3. Install Dependencies

```powershell
# Python backend
pip install -r requirements.txt

# React frontend
cd frontend
npm install
cd ..
```

---

## 🎯 Access the Application

After running `.\start.ps1`:

- **🌐 Frontend UI:** http://localhost:3000
- **📡 API Server:** http://localhost:5000
- **📊 API Health:** http://localhost:5000/api/health

---

## 💡 How to Use

1. **Open** http://localhost:3000
2. **Enter** brand name (e.g., "Tesla", "Apple", "Nike")
3. **Select** data source (optional, defaults to all)
4. **Click** "Start AI Analysis"
5. **Wait** ~30-60 seconds for AI agents to complete
6. **View** results:
   - Sentiment score (0-100)
   - Risk level (Low/Medium/High)
   - AI-detected issues
   - Dominant emotions
   - Strategic insights

---

## 🛠️ Manual Start (Alternative)

If `start.ps1` doesn't work:

**Terminal 1 - Backend:**
```powershell
python api_server.py
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm start
```

---

## 🐛 Troubleshooting

### "Exa API key not configured"
→ Add `EXA_API_KEY=your_key` to `.env` file

### "Module not found" errors
→ Run: `pip install -r requirements.txt`

### Frontend not loading
→ Run: `cd frontend && npm install`

### API not connecting
→ Ensure Flask is running on port 5000
→ Check `frontend/.env` has `REACT_APP_API_URL=http://localhost:5000`

### Slow first run
→ Normal! Downloading ML models (~200MB)
→ Subsequent runs will be faster

---

## 📚 Documentation

- **Full Setup:** `INTEGRATION_README.md`
- **What Changed:** `INTEGRATION_SUMMARY.md`
- **Original Ayush README:** (check ayush branch for Streamlit docs)

---

## 🎓 AI Features

This system uses:
- **LangGraph** - Multi-agent orchestration
- **Google Gemini** - Advanced LLM
- **FAISS** - Vector database
- **Exa API** - Real-time web search
- **HuggingFace** - Embeddings
- **VADER + TextBlob** - Sentiment analysis

### AI Agents:
1. 🗺️ **Planning** - Research strategy
2. 🔍 **Search** - Web scraping
3. ⚖️ **Evaluator** - Content filtering
4. 🧠 **RAG** - Semantic analysis
5. 📊 **Strategy** - Report generation

---

## ✅ Success Checklist

- [ ] `.env` file created with API keys
- [ ] Python dependencies installed
- [ ] Node.js dependencies installed
- [ ] Flask API running (port 5000)
- [ ] React frontend running (port 3000)
- [ ] Browser opened to http://localhost:3000
- [ ] Test analysis completed successfully

---

## 🎉 You're Ready!

Everything is configured. Just run:
```powershell
.\start.ps1
```

And start analyzing brands with AI! 🛡️
