# Code Evaluator Unified - Quick Start Test Script
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Code Evaluator Unified - Test Suite" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/5] Testing Backend Health..." -ForegroundColor Green
Start-Sleep -Seconds 1

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing
    $content = $response.Content | ConvertFrom-Json
    Write-Host "✓ Backend is running!" -ForegroundColor Green
    Write-Host "  Status: $($content.status)" -ForegroundColor Gray
    Write-Host "  Version: $($content.version)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ Backend is not running!" -ForegroundColor Red
    Write-Host "  Please start the backend with: cd backend && npm start" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "[2/5] Testing Frontend..." -ForegroundColor Green
Start-Sleep -Seconds 1

try {
    $null = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5
    Write-Host "✓ Frontend is running!" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "✗ Frontend is not running!" -ForegroundColor Red
    Write-Host "  Please start the frontend with: cd frontend && npm run dev" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Test Complete!" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "1. Make sure both servers are running" -ForegroundColor Gray
Write-Host "2. Add your GEMINI_API_KEY to backend/.env" -ForegroundColor Gray
Write-Host "3. Visit http://localhost:3000" -ForegroundColor Gray
Write-Host ""
