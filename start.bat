@echo off
echo ================================
echo Code Evaluator Unified
echo Starting Application...
echo ================================
echo.

echo [Step 1] Starting Backend Server...
echo.
start "Backend Server" cmd /k "cd backend && npm start"
timeout /t 3 /nobreak >nul

echo [Step 2] Starting Frontend Server...
echo.
start "Frontend Server" cmd /k "cd frontend && npm run dev"
timeout /t 5 /nobreak >nul

echo.
echo ================================
echo Application Started!
echo ================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Opening browser...
timeout /t 2 /nobreak >nul
start http://localhost:3000
echo.
echo Press any key to stop servers...
pause >nul

echo.
echo Stopping servers...
taskkill /F /FI "WINDOWTITLE eq Backend Server*" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq Frontend Server*" >nul 2>&1
echo Done!
