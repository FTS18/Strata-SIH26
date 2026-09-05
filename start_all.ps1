<#
.SYNOPSIS
    STRATA Unified Launch Script for Windows PowerShell
.DESCRIPTION
    Starts the STRATA FastAPI backend with live multi-camera MJPEG streaming (ports 8000 & 8080)
    and the Next.js frontend dashboard (port 3000).
#>

Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host " STRATA - AI-Powered Mobile Urban Intelligence Platform" -ForegroundColor White
Write-Host " Bharat Electronics Limited - SIH 2026" -ForegroundColor DarkCyan
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

# Validate Python Virtual Environment
$VenvPy = Join-Path $Root ".venv\Scripts\python.exe"
if (-not (Test-Path $VenvPy)) {
    Write-Host "[ERROR] Virtual environment not found at $VenvPy" -ForegroundColor Red
    Write-Host "Run: uv venv .venv; uv pip install -r backend\requirements.txt" -ForegroundColor Yellow
    exit 1
}

Write-Host "[1/2] Launching Backend API & Multi-Camera MJPEG Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& '$VenvPy' backend\src\main.py"

Write-Host "[2/2] Launching Next.js Frontend Dashboard..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location frontend; npm run dev"

Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host " STRATA Services Initialized!" -ForegroundColor White
Write-Host " - Frontend Dashboard : http://localhost:3000" -ForegroundColor Yellow
Write-Host " - Backend REST & WS  : http://localhost:8000" -ForegroundColor Yellow
Write-Host " - Interactive Docs   : http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host " - MJPEG Multi-Camera : http://localhost:8080/stream?cam=cam1" -ForegroundColor Yellow
Write-Host "=====================================================================" -ForegroundColor Cyan
