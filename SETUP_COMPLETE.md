# 🎉 Complete DevOps Setup - Hospital Management System

## ✅ What's Deployed

### Infrastructure (AWS)
- **Control Node** (t2.small) - Ansible + Nagios monitoring
- **Web Server** (t2.micro) - Nginx + Hospital App
- **Security Group** - SSH, HTTP, ICMP, NRPE access configured

### Applications
1. **Hospital Management System** - Full-featured healthcare web app
2. **Nagios Core 4.4.6** - Complete monitoring solution
3. **Ansible** - Configuration management
4. **NRPE** - Advanced monitoring agent

---

## 🌐 Access URLs

### Hospital Application
**URL:** http://65.0.199.117
- Patient appointment booking
- Doctor listings
- Services information
- Contact details

### Nagios Monitoring Dashboard
**URL:** http://35.154.241.241/nagios
- **Username:** nagiosadmin
- **Password:** admin123

---

## 📊 Monitoring Status

### Monitored Host
- **web-server-1** (172.31.8.162 / 65.0.199.117)

### Active Service Checks (6 total)
✅ **HTTP** - Hospital website availability
✅ **PING** - Network connectivity
✅ **SSH** - Remote access availability
✅ **Disk Usage** - Storage monitoring (via NRPE)
✅ **CPU Load** - System performance (via NRPE)
✅ **Nginx Process** - Web server health (via NRPE)

---

## 🔧 Server Details

### Control Node
- **Public IP:** 35.154.241.241
- **Private IP:** 172.31.43.41
- **Services:** Nagios, Apache, Ansible
- **Instance Type:** t2.small

### Web Server
- **Public IP:** 65.0.199.117
- **Private IP:** 172.31.8.162
- **Services:** Nginx, NRPE
- **Instance Type:** t2.micro

---

## 🔐 Security Configuration

### Security Group Rules (devops-security)
- **SSH (22)** - 0.0.0.0/0
- **HTTP (80)** - 0.0.0.0/0
- **ICMP (Ping)** - 0.0.0.0/0
- **NRPE (5666)** - 0.0.0.0/0

### SSH Access
```bash
# Control Node
ssh -i Dev.pem ubuntu@35.154.241.241

# Web Server
ssh -i Dev.pem ubuntu@65.0.199.117
```

---

## 📁 Project Structure

```
F:\devpro\
├── maint.tf                    # Terraform infrastructure
├── variables.tf                # Terraform variables
├── terraform.tfvars            # Credentials (gitignored)
├── Dev.pem                     # SSH private key
├── hospital-app/               # Web application
│   ├── index.html
│   ├── style.css
│   └── script.js
├── ansible/                    # Ansible playbooks
│   ├── hosts                   # Inventory file
│   ├── deploy_hospital.yml     # App deployment
│   ├── install_nagios.yml      # Nagios installation
│   ├── configure_monitoring.yml
│   ├── install_nrpe_webserver.yml
│   ├── setup_advanced_monitoring.yml
│   └── fix_nrpe.yml
├── deploy.ps1                  # App deployment script
├── redeploy.ps1                # Restart deployment script
├── setup_nagios.ps1            # Nagios setup script
├── access_nagios.ps1           # SSH tunnel script
└── RESTART_GUIDE.md            # Restart instructions
```

---

## 🚀 Quick Commands

### Deploy Hospital App
```powershell
.\deploy.ps1
```

### After Instance Restart
```powershell
.\redeploy.ps1
```

### Check Nagios Status
```bash
ssh -i Dev.pem ubuntu@35.154.241.241
sudo systemctl status nagios
```

### Check Web Server
```bash
ssh -i Dev.pem ubuntu@65.0.199.117
sudo systemctl status nginx
```

### Manual Monitoring Tests
```bash
# From Control Node
ssh -i Dev.pem ubuntu@35.154.241.241

# Test HTTP
/usr/local/nagios/libexec/check_http -H 172.31.8.162

# Test NRPE
/usr/lib/nagios/plugins/check_nrpe -H 172.31.8.162

# Test specific checks
/usr/lib/nagios/plugins/check_nrpe -H 172.31.8.162 -c check_disk
/usr/lib/nagios/plugins/check_nrpe -H 172.31.8.162 -c check_nginx
/usr/lib/nagios/plugins/check_nrpe -H 172.31.8.162 -c check_load
```

---

## 🔄 Restart Procedures

### If AWS Instances are Stopped

1. **Start instances** in AWS Console
2. **Get new IPs:**
   ```powershell
   terraform refresh
   terraform output
   ```
3. **Redeploy:**
   ```powershell
   .\redeploy.ps1
   ```

### If Services Need Restart

**Nagios:**
```bash
ssh -i Dev.pem ubuntu@35.154.241.241
sudo systemctl restart nagios
```

**Hospital App:**
```bash
ssh -i Dev.pem ubuntu@65.0.199.117
sudo systemctl restart nginx
```

**NRPE:**
```bash
ssh -i Dev.pem ubuntu@65.0.199.117
sudo systemctl restart nagios-nrpe-server
```

---

## 📝 Important Files & Locations

### On Control Node
- Nagios config: `/usr/local/nagios/etc/nagios.cfg`
- Web server monitoring: `/usr/local/nagios/etc/objects/webserver.cfg`
- Nagios logs: `/usr/local/nagios/var/nagios.log`
- Apache config: `/etc/apache2/sites-enabled/nagios.conf`
- Ansible inventory: `/home/ubuntu/ansible/hosts`

### On Web Server
- Hospital app: `/var/www/html/`
- Nginx config: `/etc/nginx/sites-enabled/default`
- NRPE config: `/etc/nagios/nrpe.cfg`

---

## 🛠️ Troubleshooting

### Nagios Dashboard Not Loading
```bash
# Check Apache
sudo systemctl status apache2
sudo systemctl restart apache2

# Check Nagios
sudo systemctl status nagios
sudo /usr/local/nagios/bin/nagios -v /usr/local/nagios/etc/nagios.cfg
```

### Hospital App Not Loading
```bash
# Check Nginx
sudo systemctl status nginx
sudo systemctl restart nginx

# Check files
ls -la /var/www/html/
```

### Monitoring Checks Failing
```bash
# Test connectivity
ping 172.31.8.162

# Test NRPE
/usr/lib/nagios/plugins/check_nrpe -H 172.31.8.162

# Check NRPE on web server
ssh -i Dev.pem ubuntu@65.0.199.117
sudo systemctl status nagios-nrpe-server
```

### Can't SSH to Instances
```bash
# Check key permissions
icacls Dev.pem

# Should show only your username with Read permission
```

---

## 🔒 Security Recommendations

1. **Change Nagios password:**
   ```bash
   ssh -i Dev.pem ubuntu@35.154.241.241
   sudo htpasswd /usr/local/nagios/etc/htpasswd.users nagiosadmin
   ```

2. **Rotate AWS credentials** (they were exposed in code)

3. **Restrict security group** to your IP only:
   - Edit security group in AWS Console
   - Change 0.0.0.0/0 to YOUR_IP/32

4. **Enable HTTPS** for Nagios (optional)

5. **Set up email notifications** in Nagios

---

## 📊 Monitoring Thresholds

### Current Settings
- **Disk Usage:** Warning 80%, Critical 90%
- **CPU Load:** Warning 15/10/5, Critical 30/25/20
- **HTTP Response:** Timeout 10 seconds
- **Ping:** Warning 20% loss, Critical 60% loss

### To Modify
Edit `/usr/local/nagios/etc/objects/webserver.cfg` and restart Nagios

---

## ✨ Features Implemented

✅ Infrastructure as Code (Terraform)
✅ Configuration Management (Ansible)
✅ Web Application Deployment
✅ Monitoring & Alerting (Nagios)
✅ Advanced Metrics (NRPE)
✅ Security Groups Configured
✅ Automated Deployment Scripts
✅ Documentation Complete

---

## 📞 Support Commands

### View Logs
```bash
# Nagios logs
sudo tail -f /usr/local/nagios/var/nagios.log

# Apache logs
sudo tail -f /var/log/apache2/error.log

# Nginx logs
sudo tail -f /var/log/nginx/error.log

# NRPE logs
sudo tail -f /var/log/syslog | grep nrpe
```

### Check Service Status
```bash
# All services on Control Node
sudo systemctl status nagios apache2

# All services on Web Server
sudo systemctl status nginx nagios-nrpe-server
```

---

## 🎯 Next Steps (Optional)

1. Set up email notifications in Nagios
2. Add more web servers to monitor
3. Configure SSL/HTTPS
4. Set up log aggregation
5. Add database monitoring
6. Configure backup automation
7. Set up CI/CD pipeline
8. Add more health checks

---

## 📚 Documentation Files

- **RESTART_GUIDE.md** - Instance restart procedures
- **NAGIOS_ACCESS.md** - Nagios access details
- **ansible/README_NAGIOS.md** - Nagios configuration guide
- **ansible/README.md** - Ansible deployment guide
- **SETUP_COMPLETE.md** - This file

---

## ✅ Verification Checklist

- [x] Terraform infrastructure deployed
- [x] Security groups configured
- [x] SSH access working
- [x] Hospital app accessible
- [x] Nagios installed and running
- [x] Apache serving Nagios dashboard
- [x] NRPE installed on web server
- [x] All 6 service checks configured
- [x] Monitoring working (HTTP, PING, SSH, Disk, CPU, Nginx)
- [x] Private IP communication working
- [x] ICMP enabled in security group
- [x] Documentation complete

---

**Setup completed successfully! 🎉**

All services are running and monitoring is active.
