@echo off
setlocal EnableExtensions
title TheoEngine - Uninstaller
color 0C
set "DEST=%APPDATA%\Adobe\CEP\extensions\com.theo.engine"

echo.
echo   TheoEngine file-only uninstaller
echo.
echo   This removes only:
echo   %DEST%
echo.
echo   It does not remove browser cookies, localStorage, presets, or projects.
choice /M "Remove the TheoEngine extension files"
if errorlevel 2 exit /b 0
if not exist "%DEST%" (
  echo.
  echo   TheoEngine is not installed at that location.
  pause
  exit /b 0
)
rmdir /S /Q "%DEST%"
if errorlevel 1 (
  echo.
  echo   [X] Could not remove the folder. Close After Effects and retry.
  pause
  exit /b 1
)
echo.
echo   [OK] TheoEngine extension files removed.
echo   User data outside this folder was left untouched.
pause
exit /b 0
