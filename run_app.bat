@echo off
title VIETLOTT AI QUANT LAUNCHER
color 0b

echo ========================================================
echo       VIETLOTT AI QUANT & PREDICTION ENGINE
echo ========================================================
echo.
echo [*] Dang khoi dong Backend FastAPI tai cong 8000...
start "Vietlott Backend Server" cmd /k "cd /d %~dp0backend && venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo [*] Dang khoi dong Frontend Dashboard tai cong 5173...
start "Vietlott Frontend Dashboard" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================================
echo [OK] He thong da khoi dong thanh cong!
echo [+] Backend API:   http://127.0.0.1:8000/docs
echo [+] Web Dashboard: http://localhost:5173
echo ========================================================
echo.
echo Dang mo trinh duyet...
timeout /t 3 >nul
start http://localhost:5173
