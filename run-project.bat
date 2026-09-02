@echo off
title SmartCourt AI Project Launcher
echo ===================================================================
echo ⚖️  Launching SmartCourt AI Platform (VS Code Environment)
echo ===================================================================
echo.

echo [1/2] Installing backend dependencies and starting Server (Port 5000)...
start "SmartCourt Backend API" cmd /k "cd server && npm install && npm start"

echo [2/2] Installing client dependencies and starting React Frontend (Port 3000)...
start "SmartCourt React Client" cmd /k "cd client && npm install && npm run dev"

echo.
echo ===================================================================
echo ✅ Both Backend (http://localhost:5000) and Frontend (http://localhost:3000)
echo    have been launched in separate terminal windows!
echo ===================================================================
pause
