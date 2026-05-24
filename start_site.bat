@echo off
cd /d "%~dp0"
if not exist "website_texts.xlsx" python export_site_texts.py
set SITE_PORT=8765
start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 2; Start-Process 'http://127.0.0.1:8765/'"
python site_server.py
