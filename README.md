# 🏥 Hospital Management System with DevOps Automation

A complete end-to-end DevOps project featuring a Hospital Management web application deployed on AWS with automated infrastructure provisioning, configuration management, and real-time monitoring.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![AWS](https://img.shields.io/badge/AWS-EC2-orange.svg)
![Terraform](https://img.shields.io/badge/IaC-Terraform-purple.svg)
![Ansible](https://img.shields.io/badge/Config-Ansible-red.svg)
![Nagios](https://img.shields.io/badge/Monitoring-Nagios-blue.svg)

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Monitoring](#monitoring)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This project demonstrates a complete DevOps workflow by deploying a Hospital Management System on AWS infrastructure. It showcases Infrastructure as Code (IaC), configuration management, automated deployment, and comprehensive monitoring practices.

### What's Included

- **Web Application**: Full-featured Hospital Management System
- **Infrastructure**: AWS EC2 instances provisioned with Terraform
- **Configuration**: Automated setup using Ansible playbooks
- **Monitoring**: Real-time infrastructure monitoring with Nagios
- **Security**: Properly configured security groups and SSH access
- **Automation**: One-command deployment and restart scripts

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         AWS Cloud                           │
│                                                             │
│  ┌──────────────────────┐      ┌──────────────────────┐   │
│  │   Control Node       │      │    Web Server        │   │
│  │   (t2.small)         │      │    (t2.micro)        │   │
│  │                      │      │                      │   │
│  │  • Ansible           │─────▶│  • Nginx             │   │
│  │  • Nagios Core       │      │  • Hospital App      │   │
│  │  • Apache            │      │  • NRPE Agent        │   │
│  │                      │      │                      │   │
│  │  Port: 80 (Nagios)   │      │  Port: 80 (HTTP)     │   │
│  └──────────────────────┘      └──────────────────────┘   │
│           │                              │                 │
│           └──────────────────────────────┘                 │
│                  Security Group                            │
│         (SSH, HTTP, ICMP, NRPE)                           │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
                  Internet Gateway
                         │
                         ▼
                    End Users
```

### Infrastructure Components

1. **Control Node** (Ansible + Nagios)
   - Manages configuration of all servers
   - Monitors infrastructure health
   - Serves Nagios web dashboard

2. **Web Server** (Hospital App)
   - Hosts the Hospital Management System
   - Runs Nginx web server
   - NRPE agent for advanced monitoring

## 🛠️ Technologies Used

### Infrastructure & Cloud
- **AWS EC2** - Virtual servers
- **Terraform** - Infrastructure as Code
- **AWS Security Groups** - Network security

### Configuration Management
- **Ansible** - Automated configuration
- **YAML** - Playbook definitions

### Monitoring & Alerting
- **Nagios Core 4.4.6** - Infrastructure monitoring
- **NRPE** - Remote plugin execution
- **Apache** - Web server for Nagios

### Web Application
- **HTML5/CSS3** - Frontend
- **JavaScript** - Client-side logic
- **Nginx** - Web server

### Scripting & Automation
- **PowerShell** - Windows automation
- **Bash** - Linux scripting

## ✨ Features

### Hospital Management System
- 🏥 Patient appointment booking
- 👨‍⚕️ Doctor profiles and specializations
- 🏥 Hospital services information
- 📞 Contact and location details
- 📱 Responsive design

### DevOps Features
- ⚡ One-command infrastructure deployment
- 🔄 Automated configuration management
- 📊 Real-time monitoring dashboard
- 🔐 Secure SSH key-based authentication
- 🚀 Automated restart procedures
- 📈 Performance metrics collection
- 🔔 Service health checks

### Monitoring Capabilities
- HTTP availability monitoring
- Network connectivity (PING)
- SSH service monitoring
- Disk usage tracking
- CPU load monitoring
- Process monitoring (Nginx)
- Custom NRPE checks

## 📦 Prerequisites

### Required Software
- **Terraform** >= 1.5.0
- **AWS CLI** (optional)
- **SSH Client**
- **Git**

### AWS Requirements
- AWS Account
- IAM user with EC2 permissions
- AWS Access Key and Secret Key

### Local Environment
- Windows 10/11 or Linux/macOS
- PowerShell 5.1+ (Windows)
- 2GB free disk space

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/maheshsingh20/DevCorner.git
cd DevCorner
```

### 2. Configure AWS Credentials

Create `terraform.tfvars`:

```hcl
aws_access_key = "YOUR_AWS_ACCESS_KEY"
aws_secret_key = "YOUR_AWS_SECRET_KEY"
key_name       = "YOUR_KEY_NAME"
```

⚠️ **Important**: Never commit this file to Git!

### 3. Add Your SSH Key

Place your AWS SSH key pair in the project root:
```
Dev.pem
```

Set correct permissions:
```bash
# Linux/Mac
chmod 400 Dev.pem

# Windows
icacls Dev.pem /inheritance:r
icacls Dev.pem /grant:r "%username%:(R)"
```

### 4. Deploy Infrastructure

```bash
# Initialize Terraform
terraform init

# Review planned changes
terraform plan

# Deploy infrastructure
terraform apply
```

### 5. Deploy Application

```powershell
# Deploy Hospital App and Nagios
.\deploy.ps1
```

### 6. Setup Monitoring

```powershell
# Configure Nagios monitoring
.\setup_nagios.ps1
```

## 💻 Usage

### Accessing the Applications

**Hospital Management System**
```
http://<WEB_SERVER_PUBLIC_IP>
```

**Nagios Monitoring Dashboard**
```
http://<CONTROL_NODE_PUBLIC_IP>/nagios
Username: nagiosadmin
Password: admin123
```

### Daily Operations

**Starting Stopped Instances**
```powershell
# 1. Start instances in AWS Console
# 2. Wait 2-3 minutes
# 3. Run restart script
.\START_PROJECT.ps1
```

**Checking Service Status**
```bash
# SSH to Control Node
ssh -i Dev.pem ubuntu@<CONTROL_NODE_IP>

# Check Nagios
sudo systemctl status nagios

# Check Apache
sudo systemctl status apache2
```

**Redeploying Application**
```powershell
.\redeploy.ps1
```

### Getting Current IPs

```bash
terraform output
```

## 📊 Monitoring

### Nagios Dashboard Features

- **Tactical Overview** - Summary of all hosts and services
- **Service Status** - Real-time service health
- **Host Status** - Server availability
- **Performance Graphs** - Historical metrics
- **Alert History** - Past incidents

### Monitored Services

| Service | Description | Check Interval |
|---------|-------------|----------------|
| HTTP | Website availability | 5 minutes |
| PING | Network connectivity | 5 minutes |
| SSH | Remote access | 5 minutes |
| Disk Usage | Storage capacity | 5 minutes |
| CPU Load | System performance | 5 minutes |
| Nginx Process | Web server health | 5 minutes |

### Alert Thresholds

- **Disk Usage**: Warning 80%, Critical 90%
- **CPU Load**: Warning 15/10/5, Critical 30/25/20
- **HTTP**: Timeout 10 seconds
- **PING**: Warning 20% loss, Critical 60% loss

## 📁 Project Structure

```
DevCorner/
├── README.md                      # This file
├── LICENSE                        # Project license
├── .gitignore                     # Git ignore rules
│
├── maint.tf                       # Terraform main configuration
├── variables.tf                   # Terraform variables
├── terraform.tfvars               # AWS credentials (gitignored)
├── Dev.pem                        # SSH private key (gitignored)
│
├── hospital-app/                  # Web application
│   ├── index.html                 # Main HTML file
│   ├── style.css                  # Stylesheet
│   └── script.js                  # JavaScript logic
│
├── ansible/                       # Ansible playbooks
│   ├── hosts                      # Inventory file
│   ├── deploy_hospital.yml        # App deployment
│   ├── install_nagios.yml         # Nagios installation
│   ├── configure_monitoring.yml   # Monitoring setup
│   ├── install_nrpe_webserver.yml # NRPE installation
│   ├── setup_advanced_monitoring.yml
│   ├── fix_nrpe.yml              # NRPE configuration fix
│   ├── README.md                  # Ansible documentation
│   └── README_NAGIOS.md          # Nagios guide
│
├── deploy.ps1                     # Initial deployment script
├── redeploy.ps1                   # Redeploy after restart
├── setup_nagios.ps1              # Nagios setup script
├── START_PROJECT.ps1             # Complete restart script
├── access_nagios.ps1             # SSH tunnel script
│
└── docs/                          # Documentation
    ├── QUICK_START.md            # Quick reference
    ├── DAILY_RESTART_GUIDE.md    # Restart procedures
    ├── SETUP_COMPLETE.md         # Complete setup docs
    ├── RESTART_GUIDE.md          # Restart guide
    ├── NAGIOS_ACCESS.md          # Nagios access info
    ├── CURRENT_STATUS.txt        # Current status
    └── TOMORROW_CHECKLIST.txt    # Daily checklist
```

## 📸 Screenshots

### Hospital Management System
![Hospital App](screenshots/hospital-app.png)

### Nagios Dashboard
![Nagios Dashboard](screenshots/nagios-dashboard.png)

### Service Status
![Service Status](screenshots/service-status.png)

## 🔧 Troubleshooting

### Common Issues

**Issue: Can't SSH to instances**
```bash
# Check key permissions
icacls Dev.pem

# Should show only your username with Read permission
```

**Issue: Hospital app not loading**
```bash
# Check Nginx status
ssh -i Dev.pem ubuntu@<WEB_IP>
sudo systemctl status nginx
sudo systemctl restart nginx
```

**Issue: Nagios dashboard not accessible**
```bash
# Check Apache and Nagios
ssh -i Dev.pem ubuntu@<CONTROL_IP>
sudo systemctl status apache2 nagios
sudo systemctl restart apache2 nagios
```

**Issue: Monitoring checks failing**
```bash
# Test connectivity
ssh -i Dev.pem ubuntu@<CONTROL_IP>
ping <WEB_PRIVATE_IP>

# Test NRPE
/usr/lib/nagios/plugins/check_nrpe -H <WEB_PRIVATE_IP>
```

### Getting Help

1. Check the documentation in the `docs/` folder
2. Review Nagios logs: `/usr/local/nagios/var/nagios.log`
3. Check service logs: `journalctl -u nagios` or `journalctl -u nginx`
4. Open an issue on GitHub

## 🔐 Security Considerations

### Best Practices Implemented
- ✅ SSH key-based authentication
- ✅ Security groups with minimal required ports
- ✅ Private network communication between servers
- ✅ Credentials stored in gitignored files

### Recommendations for Production
- 🔒 Change default Nagios password
- 🔒 Rotate AWS credentials regularly
- 🔒 Restrict security group to specific IPs
- 🔒 Enable HTTPS with SSL certificates
- 🔒 Implement AWS IAM roles instead of access keys
- 🔒 Enable AWS CloudWatch for additional monitoring
- 🔒 Set up automated backups
- 🔒 Implement log aggregation

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Update documentation for new features
- Test changes thoroughly
- Add comments for complex logic

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Mahesh Singh**
- GitHub: [@maheshsingh20](https://github.com/maheshsingh20)
- Project: [DevCorner](https://github.com/maheshsingh20/DevCorner)

## 🙏 Acknowledgments

- AWS for cloud infrastructure
- HashiCorp for Terraform
- Red Hat for Ansible
- Nagios Core team for monitoring solution
- Open source community

## 📚 Additional Resources

- [Terraform Documentation](https://www.terraform.io/docs)
- [Ansible Documentation](https://docs.ansible.com/)
- [Nagios Documentation](https://www.nagios.org/documentation/)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)

## 🗺️ Roadmap

- [ ] Add SSL/HTTPS support
- [ ] Implement email notifications in Nagios
- [ ] Add database server (MySQL/PostgreSQL)
- [ ] Set up CI/CD pipeline
- [ ] Add automated backups
- [ ] Implement log aggregation (ELK stack)
- [ ] Add more monitoring checks
- [ ] Create Docker containerized version
- [ ] Add Kubernetes deployment option
- [ ] Implement auto-scaling

## 📊 Project Stats

- **Lines of Code**: ~5000+
- **Configuration Files**: 20+
- **Automation Scripts**: 6
- **Documentation Pages**: 10+
- **Monitored Services**: 6
- **AWS Resources**: 2 EC2 instances, 1 Security Group

---

**⭐ If you find this project helpful, please give it a star!**

**📧 Questions? Open an issue or reach out!**

---

*Last Updated: November 19, 2025*
