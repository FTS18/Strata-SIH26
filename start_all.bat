@echo off
TITLE STRATA Urban Intelligence Platform Launcher
echo =====================================================================
echo  STRATA - AI-Powered Mobile Urban Intelligence Platform
echo  Bharat Electronics Limited - SIH 2026
echo =====================================================================
echo.

REM Check for virtual environment
if not exist ".venv\Scripts\python.exe" (
    echo [ERROR] Virtual environment not found at .venv\
    echo Please run: uv venv .venv ^&^& uv pip install -r backend\requirements.txt
    pause
    exit /b 1
)

echo [1/2] Starting Backend API ^& Multi-Camera MJPEG Server...
start "STRATA Backend (FastAPI + MJPEG Port 8000/8080)" cmd /k ".venv\Scripts\python backend\src\main.py"

echo [2/2] Starting Next.js Frontend Dashboard (Port 3000)...
start "STRATA Frontend (Next.js Port 3000)" cmd /k "cd frontend && npm run dev"

echo.
echo =====================================================================
echo  Services started successfully!
echo  - Frontend Dashboard : http://localhost:3000
echo  - Backend REST / WS  : http://localhost:8000 (Docs: http://localhost:8000/docs)
echo  - MJPEG Live Feeds   : http://localhost:8080/stream?cam=cam1
echo =====================================================================
echo.
