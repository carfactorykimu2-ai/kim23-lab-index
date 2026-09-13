@echo off
cd /d "%~dp0"

echo Building site...
call npm run build
if errorlevel 1 (
    echo Build failed.
    pause
    exit /b 1
)

start "kim23-lab-index preview" cmd /c "npm run preview"

echo Waiting for preview server to start...
timeout /t 3 /nobreak >nul

start "" "http://localhost:4321/kim23-lab-index/"
