# BrandShield Application Status Check
Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "BrandShield AI - System Status" -ForegroundColor White
Write-Host "============================================================`n" -ForegroundColor Cyan

# Check Backend API
Write-Host "Checking Backend API (Port 5000)..." -ForegroundColor Yellow
try {
    $apiHealth = Invoke-WebRequest -Uri 'http://localhost:5000/api/health' -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
    Write-Host "[OK] Backend API is RUNNING" -ForegroundColor Green
    $healthData = $apiHealth.Content | ConvertFrom-Json
    Write-Host "     Service: $($healthData.service)" -ForegroundColor Gray
    Write-Host "     Version: $($healthData.version)" -ForegroundColor Gray
} catch {
    Write-Host "[ERROR] Backend API is NOT RUNNING" -ForegroundColor Red
    Write-Host "        Please start with: python api_server_lite.py" -ForegroundColor Yellow
}

Write-Host ""

# Check Frontend
Write-Host "Checking Frontend (Port 3000)..." -ForegroundColor Yellow
$frontendCheck = Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Quiet -WarningAction SilentlyContinue
if($frontendCheck) {
    Write-Host "[OK] Frontend is RUNNING" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Frontend is NOT RUNNING" -ForegroundColor Red
    Write-Host "        Please start with: npm start (in frontend directory)" -ForegroundColor Yellow
}

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "Access the application at: http://localhost:3000" -ForegroundColor White
Write-Host "============================================================`n" -ForegroundColor Cyan
