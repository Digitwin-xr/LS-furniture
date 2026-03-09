@echo off
set GIT="C:\Users\digit\AppData\Local\GitHubDesktop\app-3.5.5\resources\app\git\cmd\git.exe"
%GIT% add types/index.ts components/SmartGrid.tsx app/page.tsx scripts/generate_catalogue.js public/products.json public/catalogue.json
%GIT% commit -m "feat: updated catalogue with 144 models and fixed prices"
%GIT% push origin main
