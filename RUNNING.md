# 🚀 BrandShield AI - Quick Start Guide

## Current Status: ✅ APPLICATION RUNNING

Your BrandShield AI application is currently **LIVE** and ready to use!

### Access Points:
- **Frontend UI**: http://localhost:3000
- **Backend API**: http://localhost:5000

---

## 🎯 How to Use the Application

1. **Open your browser** to http://localhost:3000
2. **Enter a brand name** (e.g., "Tesla", "Apple", "Nike")
3. **Select a data source** (Twitter, Reddit, News, etc.)
4. **Click "Start AI Analysis"**
5. **View comprehensive results** including:
   - Overall sentiment score
   - Risk metrics
   - Emotion analysis
   - Key aspects
   - Top opinions
   - Strategic recommendations
   - AI insights

---

## 🔄 Restarting the Application

### Option 1: Quick Start (Recommended)
```powershell
.\start_app.ps1
```
This script will:
- Check if services are already running
- Start backend API (port 5000)
- Start frontend React app (port 3000)
- Verify both services
- Open browser automatically

### Option 2: Manual Start

**Backend API:**
```powershell
cd c:\Users\DELL\brandshield\BrandShield
C:\Users\DELL\AppData\Local\Programs\Python\Python310\python.exe api_server_lite.py
```

**Frontend React App:**
```powershell
cd c:\Users\DELL\brandshield\BrandShield\frontend
npm start
```

---

## 🔍 Check Application Status

Run this anytime to check if services are running:
```powershell
.\status.ps1
```

---

## 🛑 Stopping the Application

Simply press **Ctrl+C** in each terminal window where the services are running.

Or kill processes by port:
```powershell
# Stop backend (port 5000)
Get-NetTCPConnection -LocalPort 5000 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }

# Stop frontend (port 3000)
Get-NetTCPConnection -LocalPort 3000 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

---

## 📝 Important Notes

### Current Configuration:
- **Backend Mode**: Lightweight (using mock data)
- **Reason**: Heavy ML libraries (scipy, torch) cause slow startup on Windows
- **Impact**: Analysis results are realistic mock data for demonstration
- **Benefit**: Instant startup, no API keys required for testing

### To Use Real AI Analysis:
1. Ensure all dependencies are installed
2. Configure API keys in `.env` file:
   - `EXA_API_KEY` - for web search
   - `GEMINI_API_KEY` - for AI analysis
3. Use `python api_server.py` instead of `api_server_lite.py`

---

## 🐛 Troubleshooting

### Backend won't start?
- Check Python version: `python --version` (should be 3.10+)
- Reinstall dependencies: `pip install flask flask-cors`

### Frontend won't start?
- Check Node.js: `node --version` (should be v14+)
- Reinstall packages: `cd frontend && npm install`

### Port already in use?
- Check what's running: `.\status.ps1`
- Kill existing processes (see "Stopping the Application" above)

### "Failed to fetch" error?
- Verify backend is running: http://localhost:5000/api/health
- Check browser console for errors
- Ensure no firewall blocking ports 3000 or 5000

---

## 📊 API Endpoints

### Health Check
```
GET http://localhost:5000/api/health
```

### Start Analysis
```
POST http://localhost:5000/api/analyze
Content-Type: application/json

{
  "brand": "Tesla",
  "data_source": "Twitter"
}
```

---

## 📁 Project Structure

```
BrandShield/
├── api_server_lite.py      # Lightweight backend (currently running)
├── api_server.py            # Full backend with ML
├── start_app.ps1            # Complete startup script
├── status.ps1               # Status check script
├── frontend/                # React application
│   ├── src/
│   │   ├── components/     # UI components
│   │   └── pages/          # Page components
│   └── package.json
└── src/                    # Python backend code
    ├── agents.py
    ├── graph.py
    └── state.py
```

---

## ✨ Features

- **Real-time Sentiment Analysis**
- **Crisis Prediction**
- **Multi-source Data Analysis**
- **Risk Metrics Dashboard**
- **Emotion Analysis**
- **Strategic Recommendations**
- **AI-powered Insights**

---

**Need help?** Check the terminal outputs for detailed error messages.

**Enjoy using BrandShield AI!** 🛡️
