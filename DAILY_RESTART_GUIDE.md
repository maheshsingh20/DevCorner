# Daily Restart Guide - Complete Project

## When You Stop AWS Instances and Need to Restart

### Quick Start (Automated) ⚡

1. **Start your AWS instances** in AWS Console
2. **Wait 2-3 minutes** for instances to fully boot
3. **Run the restart script:**
   ```powershell
   .\START_PROJECT.ps1
   ```

That's it! The script will automatically:
- Get new IP addresses
- Update all configurations
- Restart Nagios monitoring
- Verify everything is working

---

## Manual Steps (If Script Fails)

### Step 1: Start AWS Instances

**Option A: AWS Console**
1. Go to AWS EC2 Console
2. Select both instances:
   - Control-Node
   - Web-Server-1
3. Click "Instance State" → "Start"
4. Wait until both show "Running" status

**Option B: AWS CLI**
```bash
aws ec2 start-instances --instance-ids i-050101ce4c94117ed i-093bebc0c912aba50
```

---

### Step 2: Get New IP Addresses

```powershell
# Refresh Terraform state
terraform refresh

# Display new IPs
terraform output
```

You'll see:
```
control_node_public_ip = "NEW_CONTROL_IP"
web1_public_ip = "NEW_WEB_IP"
```

**Write these down!**

---

### Step 3: Get Private IP Addresses

```powershell
terraform show | Select-String -Pattern "private_ip"
```

You'll see something like:
```
private_ip = "172.31.X.X"  # Control Node
private_ip = "172.31.Y.Y"  # Web Server
```

---

### Step 4: Update Ansible Inventory

**Option A: Automated**
```powershell
# Replace with your actual private IP
$webPrivateIP = "172.31.Y.Y"

$hostsContent = @"
[webservers]
web1 ansible_host=$webPrivateIP ansible_user=ubuntu ansible_ssh_private_key_file=/home/ubuntu/Dev.pem
"@

$hostsContent | Out-File -FilePath "ansible/hosts" -Encoding utf8
```

**Option B: Manual**
Edit `ansible/hosts`:
```ini
[webservers]
web1 ansible_host=NEW_WEB_PRIVATE_IP ansible_user=ubuntu ansible_ssh_private_key_file=/home/ubuntu/Dev.pem
```

---

### Step 5: Copy Updated Files to Control Node

```powershell
scp -i Dev.pem ansible/hosts ubuntu@NEW_CONTROL_IP:/home/ubuntu/ansible/hosts
```

---

### Step 6: Update Nagios Configuration

SSH into Control Node:
```powershell
ssh -i Dev.pem ubuntu@NEW_CONTROL_IP
```

Then run these commands:
```bash
# Save new web server private IP
echo 'NEW_WEB_PRIVATE_IP' > /home/ubuntu/web_server_ip.txt

# Update Nagios monitoring config
sudo sed -i 's/address.*/address                 NEW_WEB_PRIVATE_IP/' /usr/local/nagios/etc/objects/webserver.cfg

# Add web server to known hosts
ssh-keyscan -H NEW_WEB_PRIVATE_IP >> ~/.ssh/known_hosts

# Update NRPE on web server (replace CONTROL_PRIVATE_IP)
cd /home/ubuntu/ansible
ansible -i hosts webservers -m shell -a 'sudo sed -i "s/allowed_hosts=.*/allowed_hosts=127.0.0.1,::1,CONTROL_PRIVATE_IP/" /etc/nagios/nrpe.cfg && sudo systemctl restart nagios-nrpe-server'

# Verify Nagios config
sudo /usr/local/nagios/bin/nagios -v /usr/local/nagios/etc/nagios.cfg

# Restart Nagios
sudo systemctl restart nagios

# Exit Control Node
exit
```

---

### Step 7: Verify Everything Works

**Check Hospital App:**
```
http://NEW_WEB_IP
```

**Check Nagios Dashboard:**
```
http://NEW_CONTROL_IP/nagios
Username: nagiosadmin
Password: admin123
```

**Wait 5-10 minutes** for all monitoring checks to complete.

---

## Quick Reference Commands

### Get Current IPs
```powershell
terraform output
```

### SSH to Control Node
```powershell
ssh -i Dev.pem ubuntu@CONTROL_IP
```

### SSH to Web Server
```powershell
ssh -i Dev.pem ubuntu@WEB_IP
```

### Check Service Status

**On Control Node:**
```bash
sudo systemctl status nagios
sudo systemctl status apache2
```

**On Web Server:**
```bash
sudo systemctl status nginx
sudo systemctl status nagios-nrpe-server
```

### Restart Services

**Nagios:**
```bash
ssh -i Dev.pem ubuntu@CONTROL_IP
sudo systemctl restart nagios
```

**Hospital App:**
```bash
ssh -i Dev.pem ubuntu@WEB_IP
sudo systemctl restart nginx
```

---

## Troubleshooting

### Script Fails to Connect
**Problem:** Can't SSH to instances

**Solution:**
1. Wait 2-3 more minutes (instances still booting)
2. Check security group allows SSH from your IP
3. Verify key permissions: `icacls Dev.pem`

### Hospital App Not Loading
**Problem:** Website doesn't respond

**Solution:**
```bash
ssh -i Dev.pem ubuntu@WEB_IP
sudo systemctl status nginx
sudo systemctl restart nginx
```

### Nagios Shows Services as DOWN
**Problem:** Monitoring checks failing

**Solution:**
1. Wait 10 minutes for checks to stabilize
2. Verify private IPs are correct in config
3. Check NRPE is running:
   ```bash
   ssh -i Dev.pem ubuntu@WEB_IP
   sudo systemctl status nagios-nrpe-server
   ```

### Can't Access Nagios Dashboard
**Problem:** http://CONTROL_IP/nagios not loading

**Solution:**
```bash
ssh -i Dev.pem ubuntu@CONTROL_IP
sudo systemctl status apache2
sudo systemctl restart apache2
sudo systemctl status nagios
```

---

## Important Notes

### IP Addresses Change Every Time
- **Public IPs** change every time you stop/start instances
- **Private IPs** usually stay the same but can change
- Always run `terraform refresh` after starting instances

### What Needs Updating
When IPs change, you must update:
1. ✅ Ansible inventory (`ansible/hosts`)
2. ✅ Nagios monitoring config (`/usr/local/nagios/etc/objects/webserver.cfg`)
3. ✅ NRPE allowed hosts (`/etc/nagios/nrpe.cfg` on web server)
4. ✅ SSH known hosts

### Services That Auto-Start
These services start automatically when instances boot:
- ✅ Nginx (web server)
- ✅ Apache (Nagios web interface)
- ✅ Nagios (monitoring)
- ✅ NRPE (monitoring agent)

---

## Avoid IP Changes (Optional)

To keep the same IPs even after stop/start, use **Elastic IPs** (costs apply when instance is stopped).

### Allocate Elastic IPs via Terraform

Add to `maint.tf`:
```hcl
# Elastic IP for Control Node
resource "aws_eip" "control_node_eip" {
  instance = aws_instance.control_node.id
  domain   = "vpc"
}

# Elastic IP for Web Server
resource "aws_eip" "web_server_eip" {
  instance = aws_instance.web1.id
  domain   = "vpc"
}

# Update outputs
output "control_node_public_ip" {
  value = aws_eip.control_node_eip.public_ip
}

output "web1_public_ip" {
  value = aws_eip.web_server_eip.public_ip
}
```

Then run:
```powershell
terraform apply
```

**Note:** Elastic IPs cost money when instances are stopped!

---

## Daily Workflow

### End of Day (Stopping Instances)
```powershell
# No special steps needed
# Just stop instances in AWS Console
```

### Start of Day (Starting Instances)
```powershell
# 1. Start instances in AWS Console
# 2. Wait 2-3 minutes
# 3. Run restart script
.\START_PROJECT.ps1
```

---

## Files You Need

Make sure these files exist in your project:
- ✅ `Dev.pem` - SSH key
- ✅ `maint.tf` - Terraform config
- ✅ `variables.tf` - Terraform variables
- ✅ `terraform.tfvars` - AWS credentials
- ✅ `ansible/hosts` - Ansible inventory
- ✅ `START_PROJECT.ps1` - Restart script

---

## Summary Checklist

After restarting instances:

- [ ] Instances are running in AWS Console
- [ ] Got new public IPs (`terraform output`)
- [ ] Got new private IPs (`terraform show`)
- [ ] Updated Ansible inventory
- [ ] Updated Nagios config
- [ ] Updated NRPE config
- [ ] Restarted Nagios
- [ ] Hospital app accessible
- [ ] Nagios dashboard accessible
- [ ] Monitoring checks working (wait 10 min)

---

## Quick Test Commands

```powershell
# Test Hospital App
curl.exe -I http://WEB_IP

# Test Nagios
curl.exe -I http://CONTROL_IP/nagios

# Test from Control Node
ssh -i Dev.pem ubuntu@CONTROL_IP "/usr/local/nagios/libexec/check_http -H WEB_PRIVATE_IP"
```

---

**Remember:** Always use the automated script `START_PROJECT.ps1` for easiest restart!
