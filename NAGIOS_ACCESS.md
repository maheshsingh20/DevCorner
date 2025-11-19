# Nagios Access Guide

## Current Status

✅ Nagios Core 4.4.6 is installed and running on Control Node
✅ Apache web server is running
✅ Monitoring configured for Web Server (65.0.199.117)
✅ NRPE installed for advanced monitoring
✅ Services being monitored: HTTP, PING, SSH, Disk, CPU, Nginx

## Issue

❌ Port 80 is not accessible from outside on the Control Node
❌ Security group needs to be updated to allow HTTP traffic to Control Node

## Solution

You need to allow HTTP (port 80) traffic to the Control Node in your AWS Security Group.

### Option 1: Using AWS Console (Easiest)

1. Go to AWS EC2 Console
2. Click on "Security Groups" in the left menu
3. Find security group "devops-security" (sg-0f56cf621407cf740)
4. Click "Edit inbound rules"
5. Verify there's a rule for:
   - Type: HTTP
   - Protocol: TCP
   - Port: 80
   - Source: 0.0.0.0/0 (or your IP for better security)
6. Click "Save rules"

### Option 2: Update Terraform (Recommended for Infrastructure as Code)

The security group already has HTTP rule, but let me verify it's working.

## Access Nagios

Once port 80 is accessible:

**URL:** http://35.154.241.241/nagios

**Credentials:**
- Username: `nagiosadmin`
- Password: `admin123`

## Alternative: Access via SSH Tunnel (Works Now!)

Since port 80 isn't publicly accessible, you can use SSH tunneling:

### Windows PowerShell:
```powershell
ssh -i Dev.pem -L 8080:localhost:80 ubuntu@35.154.241.241
```

Then open in your browser:
```
http://localhost:8080/nagios
```

Username: `nagiosadmin`
Password: `admin123`

### Keep the SSH session open while using Nagios

## What's Being Monitored

### Host
- **web-server-1** (65.0.199.117) - Hospital App Web Server

### Services
1. **HTTP** - Hospital website availability (http://65.0.199.117)
2. **PING** - Server reachability
3. **SSH** - SSH service status
4. **Disk Usage** - Storage monitoring (via NRPE)
5. **CPU Load** - System load monitoring (via NRPE)
6. **Nginx Process** - Web server process monitoring (via NRPE)

## Nagios Dashboard Sections

- **Tactical Overview** - Quick summary of all monitoring
- **Hosts** - View all monitored servers
- **Services** - View all monitored services
- **Problems** - Quick view of any issues
- **Reports** - Historical data and trends

## Troubleshooting

### If services show as "PENDING"
Wait 5-10 minutes for initial checks to complete.

### If services show as "CRITICAL" or "WARNING"
1. Click on the service name
2. Check the "Status Information" for details
3. Verify the web server is actually running

### To manually check a service
1. Go to Services
2. Find the service
3. Click the service name
4. Click "Re-schedule the next check" in the Commands section

## Security Recommendations

1. **Change the default password:**
```bash
ssh -i Dev.pem ubuntu@35.154.241.241
sudo htpasswd /usr/local/nagios/etc/htpasswd.users nagiosadmin
```

2. **Restrict access by IP** (edit /etc/apache2/sites-enabled/nagios.conf):
```apache
Require ip YOUR_IP_ADDRESS
```

3. **Enable HTTPS** for secure access

## Files and Locations

- **Nagios Config:** `/usr/local/nagios/etc/nagios.cfg`
- **Web Server Monitoring:** `/usr/local/nagios/etc/objects/webserver.cfg`
- **Nagios Logs:** `/usr/local/nagios/var/nagios.log`
- **Apache Config:** `/etc/apache2/sites-enabled/nagios.conf`
- **Password File:** `/usr/local/nagios/etc/htpasswd.users`

## Useful Commands

```bash
# Check Nagios status
sudo systemctl status nagios

# Check Apache status
sudo systemctl status apache2

# Verify Nagios configuration
sudo /usr/local/nagios/bin/nagios -v /usr/local/nagios/etc/nagios.cfg

# Restart Nagios
sudo systemctl restart nagios

# Restart Apache
sudo systemctl restart apache2

# View Nagios logs
sudo tail -f /usr/local/nagios/var/nagios.log

# Test NRPE connection to web server
/usr/lib/nagios/plugins/check_nrpe -H 65.0.199.117
```

## Next Steps

1. Open port 80 on Control Node security group
2. Access Nagios dashboard
3. Verify all services are being monitored
4. Change default password
5. Set up email notifications (optional)
6. Configure alert thresholds as needed
