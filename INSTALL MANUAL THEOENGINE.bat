@echo off
setlocal EnableExtensions
title TheoEngine - Choose Install Folder
color 0B
set "SOURCE=%~dp0extension"
set "DEFAULT=%APPDATA%\Adobe\CEP\extensions\com.theo.engine"

echo.
echo   TheoEngine manual file-copy installer
echo.
echo   Choose the destination folder for the extension.
echo   No registry settings, downloads, or admin access are used.
echo.
echo   Recommended destination:
echo   %DEFAULT%
echo.
set /p "DEST=Destination path (press Enter for recommended path): "
if not defined DEST set "DEST=%DEFAULT%"
if not exist "%SOURCE%\index.html" goto :missing
if not exist "%SOURCE%\CSXS\manifest.xml" goto :missing
if not exist "%DEST%" mkdir "%DEST%"
robocopy "%SOURCE%" "%DEST%" /E /NFL /NDL /NJH /NJS /NP >nul
if errorlevel 8 goto :copyerror

echo.
echo   [OK] TheoEngine copied to:
echo   %DEST%
echo.
echo   Restart After Effects after copying.
pause
exit /b 0
:missing
echo   [X] The extension folder is missing beside this installer.
pause
exit /b 1
:copyerror
echo   [X] Copy failed. Close After Effects and retry.
pause
exit /b 1
