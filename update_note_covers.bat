@echo off
cd /d "%~dp0"
chcp 65001 >nul
set PYTHONIOENCODING=utf-8

rem Fetch note.com magazine cover images into public\images\note-mag\.
rem Covers already downloaded are skipped. If you changed a magazine's cover on note,
rem delete its file in public\images\note-mag\ before running this.

echo Fetching note magazine covers...
python scripts\fetch_note_magazine_covers.py
if errorlevel 1 (
    echo Fetch failed.
    pause
    exit /b 1
)

echo Done.
pause
