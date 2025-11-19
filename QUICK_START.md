# Quick Start - Tomorrow Morning ☀️

## When You Start Your AWS Instances Tomorrow

### 🚀 Super Simple (3 Steps)

1. **Start instances in AWS Console**
   - Go to EC2 → Instances
   - Select both instances
   - Click "Start"
   - Wait 2-3 minutes

2. **Run this command:**
   ```powershell
   .\START_PROJECT.ps1
   ```

3. **Access your apps:**
   - Hospital App: Check script output for URL
   - Nagios: Check script output for URL

**Done! ✅**

---

## What the Script Does Automatically

✅ Gets new IP addresses from AWS
✅ Updates Ansible configuration
✅ Updates Nagios monitoring
✅ Restarts all services
✅ Verifies everything works

---

## Access URLs (After Script Runs)

The script will show you:
- **Hospital App URL**
- **Nagios Dashboard URL** (username: nagiosadmin, password: admin123)

---

## If Script Fails

See **DAILY_RESTART_GUIDE.md** for manual steps.

---

## Important Files

Keep these files safe:
- `Dev.pem` - Your SSH key
- `terraform.tfvars` - AWS credentials
- `START_PROJECT.ps1` - Restart script

---

## That's It!

Just run `.\START_PROJECT.ps1` every time you restart your instances.
