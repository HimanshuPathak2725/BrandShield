# BrandShield - Quick Start Script
# Run this to start the application

Write-Host "🛡️ BrandShield - Starting Application..." -ForegroundColor Cyan
Write-Host ""

# Check if virtual environment is activated
if ($env:VIRTUAL_ENV) {
    Write-Host "✅ Virtual environment activated" -ForegroundColor Green
} else {
    Write-Host "⚠️ Activating virtual environment..." -ForegroundColor Yellow
    & ".\venv\Scripts\Activate.ps1"
}

# Check for .env file
if (Test-Path ".env") {
    Write-Host "✅ .env file found" -ForegroundColor Green
} else {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "Please create .env file with your API keys" -ForegroundColor Yellow
    Write-Host "Example: EXA_API_KEY=your_key_here" -ForegroundColor Yellow
    exit
}

# Check for Exa API key
$envContent = Get-Content ".env" -Raw
if ($envContent -match "EXA_API_KEY=.+") {
    Write-Host "✅ Exa API key configured" -ForegroundColor Green
} else {
    Write-Host "⚠️ Exa API key not found in .env" -ForegroundColor Yellow
    Write-Host "Get a free key at: https://exa.ai/" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🚀 Starting Streamlit app..." -ForegroundColor Cyan
Write-Host "📍 URL: http://localhost:8501" -ForegroundColor Green
Write-Host ""

# Start Streamlit
streamlit run app.py
