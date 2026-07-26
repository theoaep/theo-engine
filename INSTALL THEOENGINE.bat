@echo off
setlocal
title TheoEngine - installer
powershell.exe -NoProfile -File "%~dp0installer\install.ps1"
if errorlevel 1 (
  echo.
  echo If Windows blocked the script, see docs\INSTALL.txt for help.
  echo TheoEngine installer returned an error.
  pause
)
