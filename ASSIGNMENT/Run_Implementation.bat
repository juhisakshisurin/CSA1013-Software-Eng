@echo off
TITLE Smart Court Case Management Platform Launcher
COLOR 0A
cls
echo =========================================================================
echo       SMART COURT CASE MANAGEMENT AND JUDICIAL ANALYTICS PLATFORM
echo                           ASSIGNMENT LAUNCHER
echo =========================================================================
echo.
echo [1/3] Checking Node.js environment...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Node.js was not found on your system PATH.
    echo     Opening standalone interactive single-file browser app instead...
    start "" "%~dp0Launch_Implementation.html"
    pause
    exit /b
)

echo [✓] Node.js is installed.
echo.
echo [2/3] Starting Backend Server...
cd /d "%~dp0backend"
if not exist "node_modules\" (
    echo [i] Installing backend dependencies...
    call npm install
)
start "Court Platform Backend" cmd /k "npm start"

echo.
echo [3/3] Starting Frontend Server...
cd /d "%~dp0frontend"
if not exist "node_modules\" (
    echo [i] Installing frontend dependencies...
    call npm install
)
start "Court Platform Frontend" cmd /k "npm run dev"

echo.
echo =========================================================================
echo Launching application in browser...
echo http://localhost:5173
echo =========================================================================
timeout /t 3 >nul
start http://localhost:5173
start "" "%~dp0Launch_Implementation.html"

echo.
echo Done! Keep the server command prompt windows open while using the app.
pause
