@echo off
chcp 65001 >nul
title Quiz Truc Tiep / Live Quiz
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo  [!] Chua cai Node.js / Node.js is not installed.
  echo      Tai tai / Download from: https://nodejs.org  ^(chon ban LTS^)
  echo.
  pause
  exit /b
)

if not exist node_modules (
  echo.
  echo  Dang cai dat lan dau, vui long doi 1-2 phut...
  echo  First-time setup, please wait 1-2 minutes...
  echo.
  call npm install
)

echo.
echo  Dang khoi dong may chu... / Starting server...
start "" http://localhost:3000
node server.js
pause
