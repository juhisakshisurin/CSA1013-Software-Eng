@echo off
TITLE Smart Court Case Management Platform Launcher
COLOR 0A
cls
echo =========================================================================
echo       SMART COURT CASE MANAGEMENT AND JUDICIAL ANALYTICS PLATFORM
echo                           ASSIGNMENT LAUNCHER
echo =========================================================================
echo.
if exist "%~dp0Launch_Court_Platform.exe" (
    echo [✓] Launching Court Platform Web Server Executable...
    echo [✓] Displaying active port and opening Chrome browser automatically...
    echo.
    "%~dp0Launch_Court_Platform.exe"
    exit /b
)

echo [1/3] Checking Node.js environment...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Node.js was not found on system PATH.
    echo [i] Opening standalone Court Platform HTML application in Chrome...
    start chrome "%~dp0Launch_Implementation.html" || start "" "%~dp0Launch_Implementation.html"
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
echo  [✓] Web Application Active!
echo  🚀 Access URLs:
echo     👉 http://localhost:3000
echo     👉 http://localhost:5173
echo     👉 http://localhost:5000
echo =========================================================================
ping 127.0.0.1 -n 3 >nul
start chrome "http://localhost:3000" || start chrome "http://localhost:5173" || start "" "%~dp0Launch_Implementation.html"

echo.
echo Done! Keep the server command prompt windows open while using the app.
