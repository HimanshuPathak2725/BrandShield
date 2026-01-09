# Quick Start - API Server Only

Write-Host "🛡️  BrandShield AI - Starting API Server" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path ".env")) {
    Write-Host "❌ Error: .env file not found!" -ForegroundColor Red
    Write-Host "📝 Copy .env.example to .env and add your API keys" -ForegroundColor Yellow
    exit 1
}

Write-Host "🔥 Starting Flask API Server..." -ForegroundColor White
Write-Host "📡 API will be available at: http://localhost:5000" -ForegroundColor Cyan
Write-Host ""

python api_server.py
