# Automated Redeploy Script After Instance Restart
# Run this after starting your stopped AWS instances

Write-Host "=== AWS Instance Redeploy Script ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Getting new IP addresses from Terraform..." -ForegroundColor Yellow
terraform refresh | Out-Null

$controlIP = (terraform output -raw control_node_public_ip)
$webIP = (terraform output -raw web1_public_ip)

Write-Host "Control Node IP: $controlIP" -ForegroundColor Green
Write-Host "Web Server IP: $webIP" -ForegroundColor Green
Write-Host ""

Write-Host "Step 2: Updating Ansible hosts file..." -ForegroundColor Yellow
$hostsContent = @"
[webservers]
web1 ansible_host=$webIP ansible_user=ubuntu ansible_ssh_private_key_file=/home/ubuntu/Dev.pem
"@
$hostsContent | Out-File -FilePath "ansible/hosts" -Encoding utf8
Write-Host "Hosts file updated locally" -ForegroundColor Green
Write-Host ""

Write-Host "Step 3: Copying updated hosts file to Control Node..." -ForegroundColor Yellow
scp -i Dev.pem ansible/hosts ubuntu@${controlIP}:/home/ubuntu/ansible/hosts

if ($LASTEXITCODE -eq 0) {
    Write-Host "Hosts file uploaded successfully" -ForegroundColor Green
} else {
    Write-Host "Failed to upload hosts file" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "Step 4: Setting up SSH and deploying..." -ForegroundColor Yellow
ssh -i Dev.pem ubuntu@${controlIP} "ssh-keyscan -H $webIP >> ~/.ssh/known_hosts 2>/dev/null && cd /home/ubuntu/ansible && echo 'Testing connection...' && ansible -i hosts webservers -m ping && echo '' && echo 'Deploying application...' && ansible-playbook -i hosts deploy_hospital.yml"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== Deployment Complete! ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your Hospital Management System is live at:" -ForegroundColor Cyan
    Write-Host "http://$webIP" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Server Details:" -ForegroundColor Cyan
    Write-Host "  Control Node: $controlIP" -ForegroundColor White
    Write-Host "  Web Server: $webIP" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "Deployment failed. Check errors above." -ForegroundColor Red
}
