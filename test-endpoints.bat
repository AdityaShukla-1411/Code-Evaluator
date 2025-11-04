@echo off
echo ============================================
echo Code Evaluator Unified - Test Suite
echo ============================================
echo.

echo [1/5] Testing Backend Health...
timeout /t 2 /nobreak >nul
curl -s http://localhost:5000/api/health
echo.
echo.

echo [2/5] Backend health check completed!
echo.

echo ============================================
echo Test Complete!
echo ============================================
echo.
echo If you see errors, make sure:
echo 1. Backend is running (npm start in backend folder)
echo 2. Frontend is running (npm run dev in frontend folder)
echo 3. .env file has valid GEMINI_API_KEY
echo.
pause
