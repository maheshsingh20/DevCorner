# Script to Access Nagios Dashboard via SSH Tunnel

Write-Host "=== Nagios Dashboard Access ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Creating SSH tunnel to Control Node..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Once connected:" -ForegroundColor Green
Write-Host "  1. Open your browser" -ForegroundColor White
Write-Host "  2. Go to: http://localhost:8080/nagios" -ForegroundColor Yellow
Write-Host "  3. Login with:" -ForegroundColor White
Write-Host "     Username: nagiosadmin" -ForegroundColor Cyan
Write-Host "     Password: admin123" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to close the tunnel when done" -ForegroundColor Yellow
Write-Host ""
Write-Host "Starting tunnel..." -ForegroundColor Green
Write-Host ""

# Create SSH tunnel
ssh -i Dev.pem -L 8080:localhost:80 ubuntu@35.154.241.241
