# AWS Instance Restart & Redeploy Guide

## Scenario: After stopping and restarting AWS instances

When you stop and restart EC2 instances, their **public IP addresses change**. You'll need to update configurations and redeploy.

---

## Step 1: Start Your Instances

### Option A: Using AWS Console
1. Go to AWS EC2 Console
2. Select both instances (Control-Node and Web-Server-1)
3. Click "Instance State" → "Start"
4. Wait for instances to be in "Running" state

### Option B: Using AWS CLI (if installed)
```bash
aws ec2 start-instances --instance-ids i-050101ce4c94117ed i-093bebc0c912aba50
```

---

## Step 2: Get New IP Addresses

### Using Terraform (Recommended)
```powershell
terraform refresh
terraform output
```

This will show:
```
control_node_public_ip = "NEW_CONTROL_IP"
web1_public_ip = "NEW_WEB_IP"
```

### Using AWS Console
1. Go to EC2 Dashboard
2. Note the new Public IPv4 addresses for both instances

---

## Step 3: Update Ansible Inventory

### Option A: Manually update the hosts file
```bash
# SSH into Control Node with NEW IP
ssh -i Dev.pem ubuntu@NEW_CONTROL_IP

# Edit the hosts file
nano /home/ubuntu/ansible/hosts
```

Update the web1 IP:
```ini
[webservers]
web1 ansible_host=NEW_WEB_IP ansible_user=ubuntu ansible_ssh_private_key_file=/home/ubuntu/Dev.pem
```

### Option B: Recreate and upload from local machine
```powershell
# Update ansible/hosts file locally with new IP
# Then copy to Control Node
scp -i Dev.pem ansible/hosts ubuntu@NEW_CONTROL_IP:/home/ubuntu/ansible/hosts
```

---

## Step 4: Update SSH Known Hosts

```bash
# SSH into Control Node
ssh -i Dev.pem ubuntu@NEW_CONTROL_IP

# Add new web server to known hosts
ssh-keyscan -H NEW_WEB_IP >> ~/.ssh/known_hosts
```

---

## Step 5: Test Ansible Connection

```bash
# On Control Node
cd /home/ubuntu/ansible
ansible -i hosts webservers -m ping
```

Expected output: `web1 | SUCCESS => { "ping": "pong" }`

---

## Step 6: Redeploy Hospital App

```bash
# On Control Node
cd /home/ubuntu/ansible
ansible-playbook -i hosts deploy_hospital.yml
```

---

## Step 7: Access Your Application

Open browser: `http://NEW_WEB_IP`

---

## Quick Command Reference

### From Your Local Machine (Windows)

```powershell
# 1. Get new IPs
terraform refresh
terraform output

# 2. SSH into Control Node (use new IP)
ssh -i Dev.pem ubuntu@NEW_CONTROL_IP

# 3. Update hosts file on Control Node
nano /home/ubuntu/ansible/hosts
# Change: ansible_host=NEW_WEB_IP

# 4. Add web server to known hosts
ssh-keyscan -H NEW_WEB_IP >> ~/.ssh/known_hosts

# 5. Test connection
cd /home/ubuntu/ansible
ansible -i hosts webservers -m ping

# 6. Deploy
ansible-playbook -i hosts deploy_hospital.yml

# 7. Access website
# Open: http://NEW_WEB_IP
```

---

## Complete Automated Script (After Getting New IPs)

Save this as `redeploy.ps1`:

```powershell
# Get new IPs from Terraform
terraform refresh
$controlIP = (terraform output -raw control_node_public_ip)
$webIP = (terraform output -raw web1_public_ip)

Write-Host "Control Node: $controlIP" -ForegroundColor Green
Write-Host "Web Server: $webIP" -ForegroundColor Green

# Update local hosts file
$hostsContent = @"
[webservers]
web1 ansible_host=$webIP ansible_user=ubuntu ansible_ssh_private_key_file=/home/ubuntu/Dev.pem
"@
$hostsContent | Out-File -FilePath "ansible/hosts" -Encoding utf8

# Copy updated hosts file to Control Node
scp -i Dev.pem ansible/hosts ubuntu@${controlIP}:/home/ubuntu/ansible/hosts

# Run deployment
ssh -i Dev.pem ubuntu@${controlIP} "ssh-keyscan -H $webIP >> ~/.ssh/known_hosts && cd /home/ubuntu/ansible && ansible -i hosts webservers -m ping && ansible-playbook -i hosts deploy_hospital.yml"

Write-Host ""
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "Access: http://$webIP" -ForegroundColor Yellow
```

Run with: `.\redeploy.ps1`

---

## Troubleshooting

### If Ansible ping fails:
```bash
# Check SSH manually
ssh -i /home/ubuntu/Dev.pem ubuntu@NEW_WEB_IP

# Verify key permissions
chmod 400 /home/ubuntu/Dev.pem
```

### If website doesn't load:
```bash
# Check Nginx status on web server
ssh -i Dev.pem ubuntu@NEW_WEB_IP
sudo systemctl status nginx

# Restart Nginx if needed
sudo systemctl restart nginx
```

### If you get "Host key verification failed":
```bash
# On Control Node
ssh-keygen -R NEW_WEB_IP
ssh-keyscan -H NEW_WEB_IP >> ~/.ssh/known_hosts
```

---

## Important Notes

1. **Public IPs change** every time you stop/start instances
2. **Private IPs** usually stay the same (but not guaranteed)
3. Always run `terraform refresh` to get current IPs
4. Update the Ansible hosts file with new web server IP
5. Clear old SSH host keys if you get verification errors

---

## To Avoid IP Changes (Optional)

Allocate Elastic IPs (costs apply when instance is stopped):

```bash
# Allocate Elastic IP
aws ec2 allocate-address --domain vpc

# Associate with instance
aws ec2 associate-address --instance-id INSTANCE_ID --allocation-id ALLOCATION_ID
```

Or update your Terraform to use Elastic IPs.
