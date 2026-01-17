# BrandShield AI - Complete Application Startup Script
# This script starts both the backend API and frontend React app

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "BrandShield AI - Starting Complete Application" -ForegroundColor White
Write-Host "============================================================`n" -ForegroundColor Cyan

# Step 1: Check if ports are already in use
Write-Host "Step 1: Checking ports..." -ForegroundColor Yellow

$port5000 = Get-NetTCPConnection -LocalPort 5000 -State Listen -ErrorAction SilentlyContinue
$port3000 = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue

if ($port5000) {
    Write-Host "  Port 5000 is already in use (Backend may be running)" -ForegroundColor Yellow
} else {
    Write-Host "  Port 5000 is available" -ForegroundColor Green
}

if ($port3000) {
    Write-Host "  Port 3000 is already in use (Frontend may be running)" -ForegroundColor Yellow
} else {
    Write-Host "  Port 3000 is available" -ForegroundColor Green
}

Write-Host ""

# Step 2: Start Backend API
if (-not $port5000) {
    Write-Host "Step 2: Starting Backend API Server..." -ForegroundColor Yellow
    Write-Host "  Opening new terminal for Flask API..." -ForegroundColor Gray
    
    $backendPath = "$PSScriptRoot"
    $pythonPath = "C:\Users\DELL\AppData\Local\Programs\Python\Python310\python.exe"
    
    Start-Process powershell -ArgumentList '-NoExit', '-Command', `
        "Set-Location '$backendPath'; $pythonPath api_server_lite.py"
    
    Write-Host "  Waiting for backend to start..." -ForegroundColor Gray
    Start-Sleep -Seconds 5
} else {
    Write-Host "Step 2: Backend API already running, skipping..." -ForegroundColor Green
}

Write-Host ""

# Step 3: Start Frontend
if (-not $port3000) {
    Write-Host "Step 3: Starting React Frontend..." -ForegroundColor Yellow
    Write-Host "  Opening new terminal for React app..." -ForegroundColor Gray
    
    $frontendPath = "$PSScriptRoot\frontend"
    
    Start-Process powershell -ArgumentList '-NoExit', '-Command', `
        "Set-Location '$frontendPath'; npm start"
    
    Write-Host "  Waiting for frontend to start..." -ForegroundColor Gray
    Start-Sleep -Seconds 15
} else {
    Write-Host "Step 3: Frontend already running, skipping..." -ForegroundColor Green
}

Write-Host ""

# Step 4: Verify services are running
Write-Host "Step 4: Verifying services..." -ForegroundColor Yellow

Start-Sleep -Seconds 2

# Check Backend
try {
    $apiCheck = Invoke-WebRequest -Uri 'http://localhost:5000/api/health' -UseBasicParsing -TimeoutSec 3
    Write-Host "  [OK] Backend API: RUNNING on http://localhost:5000" -ForegroundColor Green
} catch {
    Write-Host "  [ERROR] Backend API: NOT RESPONDING" -ForegroundColor Red
}

# Check Frontend
$frontendCheck = Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Quiet -WarningAction SilentlyContinue
if ($frontendCheck) {
    Write-Host "  [OK] Frontend: RUNNING on http://localhost:3000" -ForegroundColor Green
} else {
    Write-Host "  [ERROR] Frontend: NOT RESPONDING" -ForegroundColor Red
}

Write-Host ""

# Step 5: Open Browser
Write-Host "Step 5: Opening application in browser..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
Start-Process 'http://localhost:3000'

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "APPLICATION READY!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "`nFrontend: http://localhost:3000" -ForegroundColor White
Write-Host "Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "`nPress Ctrl+C in the terminal windows to stop the services" -ForegroundColor Yellow
Write-Host "============================================================`n" -ForegroundColor Cyan
