terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.5.0"
}

# -----------------------------------------
# Provider with Manual Credentials
# -----------------------------------------
provider "aws" {
  region     = var.aws_region
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}

# -----------------------------------------
# Security Group (Allow SSH, HTTP, Nagios)
# -----------------------------------------
resource "aws_security_group" "devops_sg" {
  name        = "devops-security"
  description = "Allow SSH, HTTP, and Nagios Web"

  ingress {
    description = "SSH access"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP for Web + Nagios"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "ICMP Ping"
    from_port   = -1
    to_port     = -1
    protocol    = "icmp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "NRPE for Nagios"
    from_port   = 5666
    to_port     = 5666
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# -----------------------------------------
# CONTROL NODE (Ansible + Nagios)
# -----------------------------------------
resource "aws_instance" "control_node" {
  ami                    = var.ami_id
  instance_type          = "t2.small"
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.devops_sg.id]

  tags = {
    Name = "Control-Node"
    Role = "Ansible-Nagios"
  }
}

# -----------------------------------------
# WEB SERVER (Nginx)
# -----------------------------------------
resource "aws_instance" "web1" {
  ami                    = var.ami_id
  instance_type          = "t2.micro"
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.devops_sg.id]

  tags = {
    Name = "Web-Server-1"
    Role = "Web"
  }
}

# -----------------------------------------
# OUTPUT (Public IPs)
# -----------------------------------------
output "control_node_public_ip" {
  value = aws_instance.control_node.public_ip
}

output "web1_public_ip" {
  value = aws_instance.web1.public_ip
}