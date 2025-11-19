# Complete Project Restart Script
# Run this after starting your stopped AWS instances

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Hospital App + Nagios Restart Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Get new IP addresses
Write-Host "[1/6] Getting new IP addresses from AWS..." -ForegroundColor Yellow
terraform refresh | Out-Null

$controlIP = (terraform output -raw control_node_public_ip)
$webIP = (terraform output -raw web1_public_ip)

if (-not $controlIP -or -not $webIP) {
    Write-Host "ERROR: Could not get IP addresses. Make sure instances are running." -ForegroundColor Red
    exit 1
}

Write-Host "  Control Node: $controlIP" -ForegroundColor Green
Write-Host "  Web Server: $webIP" -ForegroundColor Green
Write-Host ""

# Step 2: Get private IPs
Write-Host "[2/6] Getting private IP addresses..." -ForegroundColor Yellow
$controlPrivateIP = (terraform show -json | ConvertFrom-Json).values.root_module.resources | Where-Object {$_.address -eq "aws_instance.control_node"} | Select-Object -ExpandProperty values | Select-Object -ExpandProperty private_ip
$webPrivateIP = (terraform show -json | ConvertFrom-Json).values.root_module.resources | Where-Object {$_.address -eq "aws_instance.web1"} | Select-Object -ExpandProperty values | Select-Object -ExpandProperty private_ip

Write-Host "  Control Private: $controlPrivateIP" -ForegroundColor Green
Write-Host "  Web Private: $webPrivateIP" -ForegroundColor Green
Write-Host ""

# Step 3: Update Ansible inventory
Write-Host "[3/6] Updating Ansible inventory..." -ForegroundColor Yellow
$hostsContent = @"
[webservers]
web1 ansible_host=$webPrivateIP ansible_user=ubuntu ansible_ssh_private_key_file=/home/ubuntu/Dev.pem
"@
$hostsContent | Out-File -FilePath "ansible/hosts" -Encoding utf8
Write-Host "  Inventory updated with new IPs" -ForegroundColor Green
Write-Host ""

# Step 4: Copy files to Control Node
Write-Host "[4/6] Copying files to Control Node..." -ForegroundColor Yellow
scp -i Dev.pem ansible/hosts ubuntu@${controlIP}:/home/ubuntu/ansible/hosts 2>$null

if ($LASTEXITCODE -ne 0) {
    Write-Host "  Failed to copy files. Retrying in 5 seconds..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    scp -i Dev.pem ansible/hosts ubuntu@${controlIP}:/home/ubuntu/ansible/hosts
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "  Files copied successfully" -ForegroundColor Green
} else {
    Write-Host "  ERROR: Failed to copy files" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 5: Update Nagios configuration
Write-Host "[5/6] Updating Nagios monitoring configuration..." -ForegroundColor Yellow

$nagiosCommands = @"
# Update web server IP in Nagios
echo '$webPrivateIP' > /home/ubuntu/web_server_ip.txt

# Update Nagios config
sudo sed -i 's/address.*/address                 $webPrivateIP/' /usr/local/nagios/etc/objects/webserver.cfg

# Update NRPE allowed hosts
ssh-keyscan -H $webPrivateIP >> ~/.ssh/known_hosts 2>/dev/null

# Update NRPE on web server
cd /home/ubuntu/ansible
ansible -i hosts webservers -m shell -a 'sudo sed -i \"s/allowed_hosts=.*/allowed_hosts=127.0.0.1,::1,$controlPrivateIP/\" /etc/nagios/nrpe.cfg && sudo systemctl restart nagios-nrpe-server' 2>/dev/null

# Verify and restart Nagios
sudo /usr/local/nagios/bin/nagios -v /usr/local/nagios/etc/nagios.cfg > /dev/null 2>&1
sudo systemctl restart nagios

echo 'Nagios updated successfully'
"@

ssh -i Dev.pem ubuntu@${controlIP} $nagiosCommands

if ($LASTEXITCODE -eq 0) {
    Write-Host "  Nagios configuration updated" -ForegroundColor Green
} else {
    Write-Host "  WARNING: Nagios update had issues, but continuing..." -ForegroundColor Yellow
}
Write-Host ""

# Step 6: Verify services
Write-Host "[6/6] Verifying services..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Check Hospital App
try {
    $response = Invoke-WebRequest -Uri "http://$webIP" -Method Head -TimeoutSec 5 -ErrorAction Stop
    Write-Host "  ✓ Hospital App is running" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Hospital App not responding yet" -ForegroundColor Yellow
}

# Check Nagios
try {
    $response = Invoke-WebRequest -Uri "http://$controlIP/nagios" -Method Head -TimeoutSec 5 -ErrorAction Stop
    Write-Host "  ✓ Nagios Dashboard is accessible" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Nagios not responding yet" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Project Restart Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Access Your Applications:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Hospital Management System:" -ForegroundColor White
Write-Host "  http://$webIP" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Nagios Monitoring Dashboard:" -ForegroundColor White
Write-Host "  http://$controlIP/nagios" -ForegroundColor Yellow
Write-Host "  Username: nagiosadmin" -ForegroundColor White
Write-Host "  Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "Server IPs:" -ForegroundColor Cyan
Write-Host "  Control Node: $controlIP (Private: $controlPrivateIP)" -ForegroundColor White
Write-Host "  Web Server: $webIP (Private: $webPrivateIP)" -ForegroundColor White
Write-Host ""
Write-Host "Note: Monitoring checks may take 5-10 minutes to stabilize" -ForegroundColor Yellow
Write-Host ""
