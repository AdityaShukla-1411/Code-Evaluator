# Code Evaluator Unified - Startup Script
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Code Evaluator Unified" -ForegroundColor Yellow
Write-Host "Starting Application..." -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if API key is configured
$envFile = ".\backend\.env"
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile -Raw
    if ($envContent -match "GEMINI_API_KEY=your_gemini_api_key_here" -or $envContent -match "GEMINI_API_KEY=your_actual_gemini_api_key_here") {
        Write-Host "⚠️  WARNING: Gemini API Key not configured!" -ForegroundColor Yellow
        Write-Host "   Please edit backend\.env and add your API key" -ForegroundColor Yellow
        Write-Host "   Get your free key from: https://ai.google.dev/" -ForegroundColor Gray
        Write-Host ""
        $continue = Read-Host "Continue anyway? (y/n)"
        if ($continue -ne "y") {
            exit
        }
    }
}

Write-Host "[Step 1/2] Starting Backend Server..." -ForegroundColor Green
Write-Host ""

# Start backend in new window
$backendPath = Join-Path $PSScriptRoot "backend"
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; npm start"

Write-Host "   ✓ Backend starting on http://localhost:5000" -ForegroundColor Gray
Write-Host ""
Start-Sleep -Seconds 3

Write-Host "[Step 2/2] Starting Frontend Server..." -ForegroundColor Green
Write-Host ""

# Start frontend in new window
$frontendPath = Join-Path $PSScriptRoot "frontend"
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev"

Write-Host "   ✓ Frontend starting on http://localhost:3000" -ForegroundColor Gray
Write-Host ""
Start-Sleep -Seconds 5

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Application Started!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  " -NoNewline
Write-Host "http://localhost:5000" -ForegroundColor Blue
Write-Host "Frontend: " -NoNewline
Write-Host "http://localhost:3000" -ForegroundColor Blue
Write-Host ""
Write-Host "Opening browser..." -ForegroundColor Gray

Start-Sleep -Seconds 2
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "✨ Ready to use!" -ForegroundColor Green
Write-Host ""
Write-Host "To stop the servers, close the terminal windows." -ForegroundColor Gray
Write-Host ""
