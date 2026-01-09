# BrandShield AI - Full Stack Startup Script (Windows)

Write-Host "🛡️  BrandShield AI - Starting Full Stack Application" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ Error: .env file not found!" -ForegroundColor Red
    Write-Host "📝 Please copy .env.example to .env and configure your API keys" -ForegroundColor Yellow
    exit 1
}

# Check if Exa API key is configured
$envContent = Get-Content .env -Raw
if ($envContent -notmatch "EXA_API_KEY=.+") {
    Write-Host "⚠️  Warning: EXA_API_KEY not configured in .env" -ForegroundColor Yellow
    Write-Host "🔑 Get your free API key at: https://exa.ai/" -ForegroundColor Yellow
}

Write-Host "🔧 Checking Python dependencies..." -ForegroundColor White
$flaskInstalled = pip list | Select-String "flask"
if (-not $flaskInstalled) {
    Write-Host "📦 Installing Python dependencies..." -ForegroundColor White
    pip install -r requirements.txt
}

Write-Host "🔧 Checking Node.js dependencies..." -ForegroundColor White
if (-not (Test-Path "frontend/node_modules")) {
    Write-Host "📦 Installing Node.js dependencies..." -ForegroundColor White
    Set-Location frontend
    npm install
    Set-Location ..
}

Write-Host ""
Write-Host "✅ All dependencies ready!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Starting services..." -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Start Flask API in background
Write-Host "🔥 Starting Flask API on http://localhost:5000..." -ForegroundColor White
$flaskJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    python api_server.py
}

# Wait for Flask to start
Start-Sleep -Seconds 3

# Start React frontend
Write-Host "⚛️  Starting React frontend on http://localhost:3000..." -ForegroundColor White
$reactJob = Start-Job -ScriptBlock {
    Set-Location "$using:PWD\frontend"
    npm start
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Green
Write-Host "✅ BrandShield AI is running!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
Write-Host ""
Write-Host "📡 API Server: http://localhost:5000" -ForegroundColor Cyan
Write-Host "🌐 Frontend:   http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow
Write-Host ""

# Monitor jobs and handle Ctrl+C
try {
    while ($true) {
        Start-Sleep -Seconds 1
        
        # Check if jobs are still running
        if ($flaskJob.State -ne "Running") {
            Write-Host "❌ Flask API stopped unexpectedly" -ForegroundColor Red
            break
        }
        if ($reactJob.State -ne "Running") {
            Write-Host "❌ React frontend stopped unexpectedly" -ForegroundColor Red
            break
        }
    }
}
finally {
    Write-Host ""
    Write-Host "🛑 Stopping services..." -ForegroundColor Yellow
    Stop-Job $flaskJob, $reactJob
    Remove-Job $flaskJob, $reactJob
    Write-Host "✅ All services stopped" -ForegroundColor Green
}
