@echo off
title Dila Lazer - Site Baslatiliyor
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"

echo.
echo  ================================
echo   DILA LAZER - Site Baslatiliyor
echo  ================================
echo.

echo [1/3] Eski sunucu kapatiliyor...
taskkill /F /IM node.exe >nul 2>&1

echo [2/3] Onbellek temizleniyor...
if exist .next rmdir /s /q .next

echo [3/3] Sunucu baslatiliyor...
echo.
echo  Adres: http://localhost:3000
echo  Kapatmak icin bu pencerede Ctrl+C basin.
echo.

npm run dev

echo.
pause
