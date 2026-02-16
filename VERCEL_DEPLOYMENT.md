# Vercel Deployment Guide for BrandShield

## Overview
BrandShield is a fullstack application with:
- **Frontend**: React app (in `/frontend` directory)
- **Backend**: Flask API server (using `api_server_lite.py`)

## Files for Vercel Deployment

### New/Modified Files:
- **`api/app.py`** - Flask app entrypoint for Vercel
- **`vercel.json`** - Vercel configuration
- **`.vercelignore`** - Files to ignore during deployment
- **`requirements-api.txt`** - Lightweight Python dependencies (alternative to full requirements.txt)
- **`build.sh`** - Build script for the React frontend

## Deployment Steps

### 1. Prerequisites
- Vercel account (sign up at https://vercel.com)
- GitHub repository with BrandShield code pushed

### 2. Deploy via GitHub Integration (Recommended)

1. Go to https://vercel.com/new
2. Select "Import Git Repository"
3. Choose the GitHub repository containing BrandShield
4. Accept default settings (Vercel will auto-detect the structure)
5. Click "Deploy"

Vercel will automatically:
- Build the React frontend from `/frontend`
- Set up the Flask API from `/api/app.py`
- Configure environment variables
- Deploy to Vercel's global edge network

### 3. Environment Variables

Add the following environment variables in Vercel dashboard:
1. Go to Project Settings > Environment Variables
2. Add each variable:
   - `EXA_API_KEY` - Your Exa API key
   - `HUGGINGFACEHUB_API_TOKEN` - Your HuggingFace token
   - `GEMINI_API_KEY` - Your Google Gemini API key
   - `TAVILY_API_KEY` - Your Tavily API key (if using)
   - `SECRET_KEY` - A secure random key for sessions

### 4. Post-Deployment

After deployment:

1. **Update Frontend API URL**:
   - Check `frontend/.env` or environment variables
   - Set `REACT_APP_API_URL` to your Vercel deployment URL (e.g., `https://youapp.vercel.app`)

2. **Test the API**:
   - Visit `https://your-app.vercel.app/api/auth/register` (should return a response)

3. **Test the Frontend**:
   - Visit `https://your-app.vercel.app` and verify all pages load

## Architecture

```
┌─────────────────────────────────────┐
│   Vercel Edge Network               │
├─────────────────────────────────────┤
│   Frontend (React)                  │
│   Route: https://example.vercel.app │
├─────────────────────────────────────┤
│   Backend (Flask/Python)            │
│   Route: /api/* → api/app.py        │
└─────────────────────────────────────┘
```

## Troubleshooting

### "No flask entrypoint found" Error
- Ensure `api/app.py` exists with the Flask `app` exported
- Check that `api/__init__.py` is not blocking imports (should not exist)

### CORS Issues
- Check `Environment Variables` in Vercel dashboard
- Ensure `REACT_APP_API_URL` is set correctly
- API/app.py has CORS configured for Vercel URLs

### Python Dependencies Not Found
- Vercel uses `requirements.txt` by default
- Ensure Flask, flask-cors, and other dependencies are listed

### Frontend Routes Not Working
- Vercel rewrites handle SPA routing via `vercel.json`
- All non-API routes redirect to `/index.html` for React Router to handle

## Performance Tips

1. **Reduce Dependencies**: Use `requirements-api.txt` for lighter deployments
2. **Environment Variables**: Don't hardcode secrets
3. **Build Output**: Frontend builds to `/frontend/dist` (specified in vercel.json)

## Rolling Back

If deployment fails:
1. Go to your Vercel project dashboard
2. Click "Deployments"
3. Select a previous successful deployment
4. Click "Redeploy"

## Support

For issues:
- Check Vercel documentation: https://vercel.com/docs
- View deployment logs in Vercel dashboard
- Check GitHub Actions for any pre-deployment scripts

---

**Happy deploying! 🚀**
