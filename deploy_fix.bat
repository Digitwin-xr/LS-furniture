@echo off
set GIT="C:\Users\digit\AppData\Local\GitHubDesktop\app-3.5.5\resources\app\git\cmd\git.exe"
%GIT% add -A
%GIT% commit -m "fix: render FullscreenViewer portal in JSX return + mobile fullscreen improvements"
%GIT% push origin main
echo Done!
pause
