# Complete Nagios Setup Script
Write-Host "=== Nagios Monitoring Setup ===" -ForegroundColor Cyan
Write-Host ""

# Get IPs
terraform refresh | Out-Null
$controlIP = (terraform output -raw control_node_public_ip)
$webIP = (terraform output -raw web1_public_ip)

Write-Host "Control Node: $controlIP" -ForegroundColor Green
Write-Host "Web Server: $webIP" -ForegroundColor Green
Write-Host ""

Write-Host "Step 1: Copying Nagios playbooks to Control Node..." -ForegroundColor Yellow
scp -i Dev.pem ansible/install_nagios.yml ansible/configure_monitoring.yml ansible/install_nrpe_webserver.yml ansible/setup_advanced_monitoring.yml ubuntu@${controlIP}:/home/ubuntu/ansible/

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to copy files" -ForegroundColor Red
    exit 1
}
Write-Host "Files copied successfully" -ForegroundColor Green
Write-Host ""

Write-Host "Step 2: Installing Nagios on Control Node (this may take 10-15 minutes)..." -ForegroundColor Yellow
ssh -i Dev.pem ubuntu@${controlIP} "cd /home/ubuntu/ansible && ansible-playbook install_nagios.yml"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Nagios installation failed" -ForegroundColor Red
    exit 1
}
Write-Host "Nagios installed successfully" -ForegroundColor Green
Write-Host ""

Write-Host "Step 3: Saving web server IP for monitoring..." -ForegroundColor Yellow
ssh -i Dev.pem ubuntu@${controlIP} "echo '$webIP' > /home/ubuntu/web_server_ip.txt"
Write-Host ""

Write-Host "Step 4: Configuring basic monitoring..." -ForegroundColor Yellow
ssh -i Dev.pem ubuntu@${controlIP} "cd /home/ubuntu/ansible && ansible-playbook configure_monitoring.yml"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Basic monitoring configuration failed" -ForegroundColor Red
    exit 1
}
Write-Host "Basic monitoring configured" -ForegroundColor Green
Write-Host ""

Write-Host "Step 5: Installing NRPE on Web Server..." -ForegroundColor Yellow
ssh -i Dev.pem ubuntu@${controlIP} "cd /home/ubuntu/ansible && ansible-playbook -i hosts install_nrpe_webserver.yml"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Warning: NRPE installation failed, continuing with basic monitoring" -ForegroundColor Yellow
} else {
    Write-Host "NRPE installed on web server" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Step 6: Setting up advanced monitoring..." -ForegroundColor Yellow
    ssh -i Dev.pem ubuntu@${controlIP} "cd /home/ubuntu/ansible && ansible-playbook setup_advanced_monitoring.yml"
    Write-Host "Advanced monitoring configured" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Nagios Setup Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Access Nagios Dashboard:" -ForegroundColor Cyan
Write-Host "URL: http://$controlIP/nagios" -ForegroundColor Yellow
Write-Host "Username: nagiosadmin" -ForegroundColor White
Write-Host "Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "Monitoring:" -ForegroundColor Cyan
Write-Host "  - Web Server: $webIP" -ForegroundColor White
Write-Host "  - Services: HTTP, PING, SSH, Disk, CPU, Nginx" -ForegroundColor White
Write-Host ""
Write-Host "Hospital App: http://$webIP" -ForegroundColor Cyan
