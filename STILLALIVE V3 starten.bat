@echo off
title STILLALIVE V3 - Reaper, Arkanist, Schattenjaeger
set "v3Launcher=%~dp0.worktrees\v3-step1\scripts\start-game.ps1"
if not exist "%v3Launcher%" (
    echo Die separate V3-Arbeitskopie wurde nicht gefunden.
    echo Erwartet: %v3Launcher%
    pause
    exit /b 1
)
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%v3Launcher%" %*
if errorlevel 1 (
    echo.
    echo V3 konnte nicht gestartet werden. Beachte die Meldung oben.
    pause
)
