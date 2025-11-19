variable "aws_region" {
  description = "AWS region"
  default     = "ap-south-1"
}

variable "aws_access_key" {
  description = "AWS Access Key"
  type        = string
  sensitive   = true
}

variable "aws_secret_key" {
  description = "AWS Secret Key"
  type        = string
  sensitive   = true
}

variable "ami_id" {
  description = "Ubuntu 22.04 AMI ID"
  default     = "ami-087d1c9a513324697" # (for ap-south-1)
}

variable "key_name" {
  description = "SSH key pair name"
  type        = string
  default     = "Terraform"
}