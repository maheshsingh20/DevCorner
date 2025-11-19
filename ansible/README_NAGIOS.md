# Nagios Monitoring Setup Guide

## Overview
This setup installs Nagios Core on the Control Node to monitor the Web Server running the Hospital Management System.

## What Gets Monitored

### Basic Monitoring (Network-based)
- **HTTP** - Hospital website availability
- **PING** - Server reachability
- **SSH** - SSH service availability

### Advanced Monitoring (NRPE-based)
- **Disk Usage** - Storage space monitoring
- **CPU Load** - System load monitoring
- **Nginx Process** - Web server process monitoring

## Quick Setup

### Automated Setup (Recommended)
```powershell
.\setup_nagios.ps1
```

This will:
1. Install Nagios on Control Node
2. Configure monitoring for Web Server
3. Install NRPE for advanced monitoring
4. Set up all service checks

### Manual Setup

#### 1. Copy playbooks to Control Node
```bash
scp -i Dev.pem ansible/*.yml ubuntu@CONTROL_IP:/home/ubuntu/ansible/
```

#### 2. SSH into Control Node
```bash
ssh -i Dev.pem ubuntu@CONTROL_IP
```

#### 3. Install Nagios (takes 10-15 minutes)
```bash
cd /home/ubuntu/ansible
ansible-playbook install_nagios.yml
```

#### 4. Configure basic monitoring
```bash
# Save web server IP
echo "WEB_SERVER_IP" > /home/ubuntu/web_server_ip.txt

# Configure monitoring
ansible-playbook configure_monitoring.yml
```

#### 5. Install NRPE on Web Server (optional but recommended)
```bash
ansible-playbook -i hosts install_nrpe_webserver.yml
```

#### 6. Setup advanced monitoring
```bash
ansible-playbook setup_advanced_monitoring.yml
```

## Access Nagios

**URL:** http://CONTROL_NODE_IP/nagios

**Default Credentials:**
- Username: `nagiosadmin`
- Password: `admin123`

**⚠️ Change the password after first login:**
```bash
sudo htpasswd /usr/local/nagios/etc/htpasswd.users nagiosadmin
```

## Nagios Dashboard Navigation

1. **Tactical Overview** - Summary of all hosts and services
2. **Hosts** - View all monitored hosts
3. **Services** - View all monitored services
4. **Problems** - Quick view of issues
5. **Map** - Visual network map

## Service Check Details

### HTTP Check
- Checks if hospital website is accessible
- Alert if website is down
- Check interval: 5 minutes

### PING Check
- Verifies server is reachable
- Packet loss threshold: 20% warning, 60% critical
- Round-trip time threshold: 100ms warning, 500ms critical

### SSH Check
- Ensures SSH service is running
- Important for remote management

### Disk Usage (NRPE)
- Warning at 80% usage
- Critical at 90% usage

### CPU Load (NRPE)
- Monitors system load average
- Alerts on high CPU usage

### Nginx Process (NRPE)
- Ensures Nginx is running
- Critical if process not found

## Troubleshooting

### Nagios not accessible
```bash
# Check Apache status
sudo systemctl status apache2

# Restart Apache
sudo systemctl restart apache2

# Check Nagios status
sudo systemctl status nagios
```

### Service checks failing
```bash
# Verify Nagios configuration
sudo /usr/local/nagios/bin/nagios -v /usr/local/nagios/etc/nagios.cfg

# Check Nagios logs
sudo tail -f /usr/local/nagios/var/nagios.log
```

### NRPE checks not working
```bash
# On Control Node - test NRPE connection
/usr/lib/nagios/plugins/check_nrpe -H WEB_SERVER_IP

# On Web Server - check NRPE status
sudo systemctl status nagios-nrpe-server

# Check NRPE logs
sudo tail -f /var/log/syslog | grep nrpe
```

### Web Server checks showing as DOWN
```bash
# Verify web server is accessible from Control Node
ssh -i Dev.pem ubuntu@CONTROL_IP
ping WEB_SERVER_IP
curl http://WEB_SERVER_IP
```

## Adding More Hosts

To monitor additional servers, create a new config file:

```bash
sudo nano /usr/local/nagios/etc/objects/newserver.cfg
```

Add host and service definitions, then:

```bash
# Add to nagios.cfg
sudo nano /usr/local/nagios/etc/nagios.cfg
# Add line: cfg_file=/usr/local/nagios/etc/objects/newserver.cfg

# Verify and restart
sudo /usr/local/nagios/bin/nagios -v /usr/local/nagios/etc/nagios.cfg
sudo systemctl restart nagios
```

## Customizing Checks

### Change check intervals
Edit `/usr/local/nagios/etc/objects/webserver.cfg`:

```bash
define service {
    use                     generic-service
    host_name               web-server-1
    service_description     HTTP
    check_command           check_http
    check_interval          10    # Check every 10 minutes
    retry_interval          2     # Retry every 2 minutes if failed
}
```

### Add email notifications
Edit `/usr/local/nagios/etc/objects/contacts.cfg`:

```bash
define contact {
    contact_name            admin
    alias                   Nagios Admin
    email                   your-email@example.com
    service_notification_commands   notify-service-by-email
    host_notification_commands      notify-host-by-email
}
```

## Important Files

- **Main Config:** `/usr/local/nagios/etc/nagios.cfg`
- **Web Server Config:** `/usr/local/nagios/etc/objects/webserver.cfg`
- **Commands:** `/usr/local/nagios/etc/objects/commands.cfg`
- **Contacts:** `/usr/local/nagios/etc/objects/contacts.cfg`
- **Logs:** `/usr/local/nagios/var/nagios.log`
- **Web Password:** `/usr/local/nagios/etc/htpasswd.users`

## Security Recommendations

1. **Change default password immediately**
2. **Restrict Nagios web access** - Update Apache config to allow only specific IPs
3. **Use HTTPS** - Configure SSL for Nagios web interface
4. **Secure NRPE** - Use SSL and restrict allowed hosts

## Restart After Changes

```bash
# Verify configuration
sudo /usr/local/nagios/bin/nagios -v /usr/local/nagios/etc/nagios.cfg

# Restart Nagios
sudo systemctl restart nagios

# Restart Apache (if web config changed)
sudo systemctl restart apache2
```

## Monitoring Status

Check all services are being monitored:
```bash
# List all configured hosts
sudo /usr/local/nagios/bin/nagios -s /usr/local/nagios/etc/nagios.cfg | grep "Total Hosts"

# List all configured services
sudo /usr/local/nagios/bin/nagios -s /usr/local/nagios/etc/nagios.cfg | grep "Total Services"
```

## Performance Tips

- Adjust check intervals based on needs
- Use NRPE for resource-intensive checks
- Enable caching for frequently checked services
- Monitor Nagios itself for performance issues
