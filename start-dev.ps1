# PowerShell script to start both frontend and backend
Write-Host "🚀 Starting SwapSkills Development Servers..." -ForegroundColor Green

# Start backend server in a new PowerShell window
Write-Host "📡 Starting Backend Server (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\server'; npm run dev"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend server in a new PowerShell window  
Write-Host "🌐 Starting Frontend Server (Port 5173)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev -- --port 5173"

Write-Host "✅ Both servers are starting in separate windows!" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "🔧 Backend: http://localhost:5000" -ForegroundColor Yellow
Write-Host "🔍 Backend Health Check: http://localhost:5000/api/health" -ForegroundColor Magenta

# Keep this window open
Write-Host "`nPress any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
