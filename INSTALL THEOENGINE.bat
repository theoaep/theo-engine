@echo off
setlocal EnableExtensions
title TheoEngine - File Copy Installer
color 0B
set "ROOT=%~dp0"
set "SOURCE=%ROOT%extension"
set "DEST=%APPDATA%\Adobe\CEP\extensions\com.theo.engine"

echo.
echo   ================================================================
echo                    T H E O   E N G I N E
echo                    FILE COPY INSTALLER
echo   ================================================================
echo.
echo   This installer only copies TheoEngine files to your CEP folder.
echo   It does not change the registry, download software, or require admin.
echo.
if not exist "%SOURCE%\index.html" goto :missing
if not exist "%SOURCE%\CSXS\manifest.xml" goto :missing

if not exist "%DEST%" mkdir "%DEST%"
robocopy "%SOURCE%" "%DEST%" /E /NFL /NDL /NJH /NJS /NP >nul
if errorlevel 8 goto :copyerror

echo.
echo   [OK] TheoEngine files copied successfully.
echo   Destination: %DEST%
echo.
echo   If After Effects does not show TheoEngine, enable CEP support
echo   manually according to docs\INSTALL.txt, then restart After Effects.
echo.
pause
exit /b 0

:missing
echo   [X] The extension folder is missing. Keep this file beside extension\.
pause
exit /b 1
:copyerror
echo   [X] Could not copy the extension. Close After Effects and retry.
pause
exit /b 1
