@echo off
rem Blog admin launcher: start admin server on port 5175 then open browser
cd /d "%~dp0"
start /min "pdy-blog-admin" cmd /c "npm run admin"
timeout /t 6 /nobreak >nul
start http://localhost:5175
exit
