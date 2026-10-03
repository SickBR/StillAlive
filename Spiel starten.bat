@echo off
title ECLIPSE SURVIVOR
cd /d "%~dp0"
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start-game.ps1"
if errorlevel 1 (
    echo.
    echo Das Spiel konnte nicht gestartet werden. Beachte die Meldung oben.
    pause
)
