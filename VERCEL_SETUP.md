# BrandShield - Vercel Deployment Setup Guide

## ✅ Project is Ready for Vercel Deployment

This project has been configured for seamless deployment on Vercel. All necessary configuration files are in place.

## 📋 Prerequisites

1. **GitHub Account** - Project must be pushed to GitHub
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **API Keys** - You'll need the following API keys as environment variables:
   - `EXA_API_KEY` - Exa API key
   - `HUGGINGFACEHUB_API_TOKEN` - HuggingFace token
   - `GEMINI_API_KEY` - Google Gemini API key
   - `TAVILY_API_KEY` - Tavily API key (optional)
   - `SECRET_KEY` - A secure random string for Flask sessions

## 🚀 Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Connect to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your GitHub repository

2. **Configure Project**
   - Vercel will auto-detect the configuration from `vercel.json`
   - Framework: Vite (auto-detected)
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/dist`

3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add each required API key (see Prerequisites above)
   - Example:
     ```
     EXA_API_KEY=your_exa_api_key_here
     GEMINI_API_KEY=your_gemini_key_here
     SECRET_KEY=your_secure_random_string
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables
vercel env add EXA_API_KEY
vercel env add GEMINI_API_KEY
vercel env add SECRET_KEY
# ... add all other required variables

# Deploy to production
vercel --prod
```

## 📁 Configuration Files

All necessary configuration files are already in place:

- **`vercel.json`** - Vercel deployment configuration
  - Defines build command and output directory
  - Configures routing (API routes → `/api/app.py`, frontend → `/index.html`)

- **`api/app.py`** - Flask API entrypoint for Vercel
  - Imports from `api_server_lite.py`
  - Configures CORS for Vercel domains
  - Exports the Flask `app` instance

- **`requirements.txt`** - Python dependencies (lightweight)
  - Contains only essential packages for API deployment
  - Optimized for Vercel's size limits

- **`.vercelignore`** - Files excluded from deployment
  - Ignores dev files, node_modules, build artifacts

- **`frontend/vite.config.js`** - Vite build configuration
  - Configured with React and Tailwind plugins
  - API proxy setup for local development

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         Vercel Edge Network             │
├─────────────────────────────────────────┤
│  Frontend (React + Vite)                │
│  • Built from /frontend                 │
│  • Served from /frontend/dist           │
│  • Routes: /* → index.html              │
├─────────────────────────────────────────┤
│  Backend (Flask + Python)               │
│  • Entry: /api/app.py                   │
│  • Routes: /api/* → Flask handlers      │
│  • Dependencies: requirements.txt       │
└─────────────────────────────────────────┘
```

## 🔧 How It Works

1. **Build Phase**:
   - Vercel runs: `cd frontend && npm install && npm run build`
   - Frontend is built to `frontend/dist`
   - Python dependencies installed from `requirements.txt`

2. **Runtime**:
   - Static files served from `frontend/dist`
   - API requests (`/api/*`) routed to Python serverless functions
   - Flask app runs as Vercel serverless functions

3. **Routing**:
   - `/api/*` → Flask API (`api/app.py`)
   - `/*` → React SPA (`frontend/dist/index.html`)

## ✅ What's Already Configured

- ✅ React plugin in Vite config
- ✅ Modern Vercel routing with `rewrites`
- ✅ API entrypoint (`api/app.py`)
- ✅ CORS configuration for Vercel domains
- ✅ Lightweight Python dependencies
- ✅ Build command and output directory
- ✅ .gitignore for build artifacts

## 🔍 Testing Locally

Before deploying, you can test the build:

```bash
# Test frontend build
cd frontend
npm install
npm run build
# Check that frontend/dist is created

# Test API locally
pip install -r requirements.txt
python api_server_lite.py
# API should run on http://localhost:5000
```

## 📝 Post-Deployment

After successful deployment:

1. **Test the API**: Visit `https://your-app.vercel.app/api/` (should return a response)
2. **Test the Frontend**: Visit `https://your-app.vercel.app` (should load the app)
3. **Check Logs**: View deployment logs in Vercel Dashboard
4. **Update API URL**: If needed, ensure frontend requests use relative paths (`/api/...`)

## 🐛 Troubleshooting

### Build Fails
- Check build logs in Vercel Dashboard
- Ensure all dependencies are in `requirements.txt` and `package.json`
- Verify build command succeeds locally

### API Not Working
- Check environment variables are set in Vercel
- View function logs in Vercel Dashboard
- Ensure `api/app.py` exports `app` correctly

### CORS Issues
- Check `api/app.py` CORS configuration
- Ensure Vercel URL is in allowed origins
- Check browser console for CORS errors

### 404 on Routes
- Ensure `vercel.json` rewrites are correct
- Check that frontend uses React Router properly
- Verify API routes start with `/api/`

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Python Runtime](https://vercel.com/docs/functions/serverless-functions/runtimes/python)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)

## 🎉 Summary

Your BrandShield project is **fully configured** for Vercel deployment. Simply:

1. Push code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

No code changes needed - just environment configuration.
