# Hospital App Deployment Script
Write-Host "=== Hospital App Deployment ===" -ForegroundColor Cyan
Write-Host ""

$controlNodeIP = "35.154.241.241"
$webServerIP = "65.0.199.117"

Write-Host "Control Node IP: $controlNodeIP" -ForegroundColor Green
Write-Host "Web Server IP: $webServerIP" -ForegroundColor Green
Write-Host ""

Write-Host "Step 1: Copying files to Control Node..." -ForegroundColor Yellow
scp -i Dev.pem -r ansible hospital-app Dev.pem ubuntu@${controlNodeIP}:/home/ubuntu/

if ($LASTEXITCODE -eq 0) {
    Write-Host "Files copied successfully!" -ForegroundColor Green
} else {
    Write-Host "Failed to copy files" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2: Deploying with Ansible..." -ForegroundColor Yellow

ssh -i Dev.pem ubuntu@${controlNodeIP} "chmod 400 /home/ubuntu/Dev.pem && cd /home/ubuntu/ansible && ansible -i hosts webservers -m ping && ansible-playbook -i hosts deploy_hospital.yml"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== Deployment Complete! ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "Access your Hospital Management System at:" -ForegroundColor Cyan
    Write-Host "http://$webServerIP" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "Deployment failed. Check errors above." -ForegroundColor Red
}
