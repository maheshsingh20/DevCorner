# Hospital App Deployment with Ansible

## Prerequisites
1. Control Node with Ansible installed
2. SSH key (Dev.pem) copied to Control Node
3. Web server accessible via SSH

## Deployment Steps

### 1. Copy files to Control Node
```bash
# From your local machine, copy the entire project to Control Node
scp -i Dev.pem -r ansible hospital-app Dev.pem ubuntu@35.154.241.241:/home/ubuntu/
```

### 2. SSH into Control Node
```bash
ssh -i Dev.pem ubuntu@35.154.241.241
```

### 3. Install Ansible (if not already installed)
```bash
sudo apt update -y
sudo apt install ansible -y
ansible --version
```

### 4. Set correct permissions for SSH key
```bash
chmod 400 /home/ubuntu/Dev.pem
```

### 5. Test Ansible connectivity
```bash
cd /home/ubuntu/ansible
ansible -i hosts webservers -m ping
```

Expected output: `web1 | SUCCESS => { "ping": "pong" }`

### 6. Deploy the Hospital App
```bash
ansible-playbook -i hosts deploy_hospital.yml
```

### 7. Access the Application
Open your browser and visit:
```
http://65.0.199.117
```

## Troubleshooting

### If ping fails:
- Check security group allows SSH (port 22)
- Verify SSH key path in hosts file
- Ensure web server is running

### If deployment fails:
- Check Nginx status: `sudo systemctl status nginx`
- View Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- Verify file permissions

### If website doesn't load:
- Check security group allows HTTP (port 80)
- Verify Nginx is running: `sudo systemctl status nginx`
- Check firewall: `sudo ufw status`

## IP Addresses
- Control Node: 35.154.241.241
- Web Server: 65.0.199.117
