$env:PATH = "C:\Program Files\nodejs;" + $env:PATH
Set-Location $PSScriptRoot
Write-Host "Site baslatiliyor: http://localhost:3000" -ForegroundColor Green
npm run dev
