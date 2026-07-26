@echo off
setlocal EnableExtensions
title TheoEngine - Setup Assistant
color 0B
mode con: cols=68 lines=22 >nul 2>&1

cls
echo.
echo   ================================================================
echo.
echo                 T H E O   E N G I N E
echo                 AFTER EFFECTS TOOLKIT
echo.
echo   ================================================================
echo.
echo        Launching the TheoEngine setup assistant...
echo        Follow the prompts to install the CEP panel.
echo.
echo   ----------------------------------------------------------------
echo.

powershell.exe -NoLogo -NoProfile -File "%~dp0installer\install.ps1"
set "EXITCODE=%ERRORLEVEL%"

if not "%EXITCODE%"=="0" (
  echo.
  echo   [X] TheoEngine installer returned an error.
  echo       If Windows blocked the script, see docs\INSTALL.txt.
  echo.
  pause
) else (
  echo.
  echo   TheoEngine setup assistant finished.
  echo.
)

exit /b %EXITCODE%
