# AWS Deployment Guide - Trading Journal Monorepo

Complete guide for deploying the Trading Journal application to AWS with Nginx reverse proxy, systemd services, and GoDaddy/Route53 DNS configuration.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Server Setup](#server-setup)
3. [Install Dependencies](#install-dependencies)
4. [Clone and Setup Repository](#clone-and-setup-repository)
5. [Configure Backend](#configure-backend)
6. [Configure Frontend](#configure-frontend)
7. [Create Systemd Services](#create-systemd-services)
8. [Configure Nginx](#configure-nginx)
9. [Setup SSL with Let's Encrypt](#setup-ssl-with-lets-encrypt)
10. [DNS Configuration (GoDaddy + Route53)](#dns-configuration-godaddy--route53)
11. [Deployment Commands](#deployment-commands)
12. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### AWS Resources

- EC2 instance (Ubuntu 20.04/22.04 recommended)
- Security group with ports: 22 (SSH), 80 (HTTP), 443 (HTTPS), 3306 (MySQL - optional)
- Elastic IP (recommended for stable IP address)
- RDS MySQL instance (or MySQL on EC2)

### Domain Setup

- GoDaddy domain purchased
- AWS Route53 hosted zone configured

### Local Requirements

- SSH key pair for EC2 access
- Git repository (GitHub, GitLab, etc.)

---

## Server Setup

### 1. Connect to EC2 Instance

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip-address
```

### 2. Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### 3. Install Node.js (v18 or higher)

```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should be v18.x or higher
npm --version
```

### 4. Install MySQL (if not using RDS)

```bash
sudo apt install mysql-server -y
sudo mysql_secure_installation

# Create database
sudo mysql -u root -p
```

```sql
CREATE DATABASE trading_journal;
CREATE USER 'trading_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON trading_journal.* TO 'trading_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## Install Dependencies

### 1. Install Nginx

```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 2. Install PM2 (Alternative to systemd - optional)

```bash
sudo npm install -g pm2
```

### 3. Install Git

```bash
sudo apt install git -y
```

---

## Clone and Setup Repository

### 1. Create Application Directory

```bash
sudo mkdir -p /var/www
cd /var/www
```

### 2. Clone Repository

```bash
# Using HTTPS
sudo git clone https://github.com/your-username/trading-journal-monorepo.git app

# OR using SSH (recommended)
sudo git clone git@github.com:your-username/trading-journal-monorepo.git app

cd app
```

### 3. Set Ownership

```bash
sudo chown -R ubuntu:ubuntu /var/www/app
```

### 4. Install Dependencies

```bash
cd /var/www/app
npm install
```

---

## Configure Backend

### 1. Create Backend .env File

```bash
cd /var/www/app/packages/backend
nano .env
```

### 2. Backend Environment Variables

```env
# Server Configuration
PORT=8000
NODE_ENV=production

# Database Configuration
DB_NAME=trading_journal
DB_USER=trading_user
DB_PASSWORD=your_secure_password
DB_HOST=127.0.0.1
# For RDS, use: your-rds-endpoint.region.rds.amazonaws.com
DB_PORT=3306

# JWT Secrets (generate with: openssl rand -base64 32)
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here

# CORS Configuration
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
FRONTEND_URL_HTTP=http://yourdomain.com
FRONTEND_URL_HTTPS=https://yourdomain.com

# Google OAuth (for Gmail features)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
GMAIL_OAUTH_USER=your_email@gmail.com
```

### 3. Generate JWT Secrets

```bash
# Generate random secrets
openssl rand -base64 32
openssl rand -base64 32
```

---

## Configure Frontend

### 1. Create Frontend .env File

```bash
cd /var/www/app/packages/frontend
nano .env.production
```

### 2. Frontend Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_FRONTEND_URL=https://yourdomain.com

# Environment
NODE_ENV=production
```

### 3. Build Frontend

```bash
cd /var/www/app
npm run build --filter=frontend
```

---

## Create Systemd Services

### 1. Backend Service

```bash
sudo nano /etc/systemd/system/trading-backend.service
```

**Add the following:**

```ini
[Unit]
Description=Trading Journal Backend API
After=network.target mysql.service
Wants=mysql.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/var/www/app/packages/backend
Environment=NODE_ENV=production
ExecStart=/usr/bin/node app.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=trading-backend

# Security
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

### 2. Frontend Service

```bash
sudo nano /etc/systemd/system/trading-frontend.service
```

**Add the following:**

```ini
[Unit]
Description=Trading Journal Frontend (Next.js)
After=network.target trading-backend.service
Wants=trading-backend.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/var/www/app/packages/frontend
Environment=NODE_ENV=production
Environment=PORT=8080
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=trading-frontend

# Security
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

### 3. Enable and Start Services

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable services (auto-start on boot)
sudo systemctl enable trading-backend
sudo systemctl enable trading-frontend

# Start services
sudo systemctl start trading-backend
sudo systemctl start trading-frontend

# Check status
sudo systemctl status trading-backend
sudo systemctl status trading-frontend
```

### 4. View Logs

```bash
# Backend logs
sudo journalctl -u trading-backend -f

# Frontend logs
sudo journalctl -u trading-frontend -f

# Last 100 lines
sudo journalctl -u trading-backend -n 100
sudo journalctl -u trading-frontend -n 100
```

---

## Configure Nginx

### 1. Remove Default Config

```bash
sudo rm /etc/nginx/sites-enabled/default
```

### 2. Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/trading-journal
```

**Add the following configuration:**

```nginx
# API Backend Server
upstream backend_api {
    server 127.0.0.1:8000;
    keepalive 64;
}

# Frontend Server
upstream frontend_app {
    server 127.0.0.1:8080;
    keepalive 64;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com api.yourdomain.com;

    # Let's Encrypt validation
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Redirect all other traffic to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS - API Backend
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.yourdomain.com;

    # SSL Configuration (will be added by Certbot)
    # ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Logging
    access_log /var/log/nginx/api-access.log;
    error_log /var/log/nginx/api-error.log;

    # Proxy to Backend
    location / {
        proxy_pass http://backend_api;
        proxy_http_version 1.1;

        # Headers
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # Cache
        proxy_cache_bypass $http_upgrade;
    }

    # File upload size limit
    client_max_body_size 10M;
}

# HTTPS - Frontend
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration (will be added by Certbot)
    # ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Logging
    access_log /var/log/nginx/frontend-access.log;
    error_log /var/log/nginx/frontend-error.log;

    # Proxy to Frontend
    location / {
        proxy_pass http://frontend_app;
        proxy_http_version 1.1;

        # Headers
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # Cache
        proxy_cache_bypass $http_upgrade;
    }

    # Next.js static files
    location /_next/static {
        proxy_pass http://frontend_app;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # File upload size limit
    client_max_body_size 10M;
}
```

### 3. Enable Configuration

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/trading-journal /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## Setup SSL with Let's Encrypt

### 1. Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 2. Create Certbot Directory

```bash
sudo mkdir -p /var/www/certbot
```

### 3. Obtain SSL Certificates

```bash
# Get certificates for all domains
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Follow the prompts:
# - Enter email address
# - Agree to terms
# - Choose to redirect HTTP to HTTPS (recommended)
```

### 4. Test Auto-Renewal

```bash
sudo certbot renew --dry-run
```

### 5. Auto-Renewal is Setup

Certbot automatically creates a cron job or systemd timer for renewal.

---

## DNS Configuration (GoDaddy + Route53)

### Step 1: Create Route53 Hosted Zone

1. Go to AWS Route53 Console
2. Click **"Create Hosted Zone"**
3. Enter your domain name: `yourdomain.com`
4. Type: **Public Hosted Zone**
5. Click **"Create"**

### Step 2: Get Route53 Name Servers

After creating the hosted zone, AWS provides 4 name servers:

```
ns-1234.awsdns-12.org
ns-5678.awsdns-34.net
ns-9012.awsdns-56.com
ns-3456.awsdns-78.co.uk
```

### Step 3: Update GoDaddy Name Servers

1. Log in to **GoDaddy**
2. Go to **My Products** → **Domains**
3. Click on your domain
4. Scroll to **Nameservers**
5. Click **"Change"**
6. Select **"I'll use my own nameservers"**
7. Enter all 4 Route53 name servers
8. Click **"Save"**

**Note:** DNS propagation can take 24-48 hours

### Step 4: Create Route53 DNS Records

Go to your Route53 Hosted Zone and create the following records:

#### A Record - Main Domain

```
Record name: (leave empty or @)
Record type: A
Value: YOUR_EC2_ELASTIC_IP
TTL: 300
```

#### A Record - www Subdomain

```
Record name: www
Record type: A
Value: YOUR_EC2_ELASTIC_IP
TTL: 300
```

#### A Record - API Subdomain

```
Record name: api
Record type: A
Value: YOUR_EC2_ELASTIC_IP
TTL: 300
```

#### Optional: CNAME Record (Alternative for www)

```
Record name: www
Record type: CNAME
Value: yourdomain.com
TTL: 300
```

### Step 5: Verify DNS Propagation

```bash
# Check if DNS is propagated
nslookup yourdomain.com
nslookup www.yourdomain.com
nslookup api.yourdomain.com

# Or use online tools
# https://www.whatsmydns.net/
```

---

## Deployment Commands

### Initial Deployment

```bash
# 1. Connect to server
ssh -i your-key.pem ubuntu@your-ec2-ip

# 2. Navigate to app directory
cd /var/www/app

# 3. Pull latest changes
git pull origin main

# 4. Install dependencies
npm install

# 5. Build frontend
npm run build --filter=frontend

# 6. Restart services
sudo systemctl restart trading-backend
sudo systemctl restart trading-frontend

# 7. Check status
sudo systemctl status trading-backend
sudo systemctl status trading-frontend
```

### Update Deployment

```bash
# Quick update script
cd /var/www/app
git pull origin main
npm install
npm run build --filter=frontend
sudo systemctl restart trading-backend
sudo systemctl restart trading-frontend
```

### Create Deployment Script

```bash
nano /var/www/app/deploy.sh
```

**Add:**

```bash
#!/bin/bash
set -e

echo "🚀 Starting deployment..."

cd /var/www/app

echo "📦 Pulling latest changes..."
git pull origin main

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building frontend..."
npm run build --filter=frontend

echo "🔄 Restarting services..."
sudo systemctl restart trading-backend
sudo systemctl restart trading-frontend

echo "✅ Deployment complete!"

echo "📊 Service status:"
sudo systemctl status trading-backend --no-pager
sudo systemctl status trading-frontend --no-pager
```

**Make executable:**

```bash
chmod +x /var/www/app/deploy.sh
```

**Run deployment:**

```bash
/var/www/app/deploy.sh
```

---

## Troubleshooting

### Service Not Starting

```bash
# Check service status
sudo systemctl status trading-backend
sudo systemctl status trading-frontend

# View detailed logs
sudo journalctl -u trading-backend -n 50
sudo journalctl -u trading-frontend -n 50

# Check if ports are in use
sudo netstat -tulpn | grep 8000
sudo netstat -tulpn | grep 8080

# Kill process on port (if needed)
sudo kill -9 $(sudo lsof -t -i:8000)
sudo kill -9 $(sudo lsof -t -i:8080)
```

### Database Connection Issues

```bash
# Test database connection
mysql -u trading_user -p trading_journal

# Check MySQL status
sudo systemctl status mysql

# View MySQL logs
sudo tail -f /var/log/mysql/error.log
```

### Nginx Issues

```bash
# Test nginx configuration
sudo nginx -t

# View nginx error logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/api-error.log
sudo tail -f /var/log/nginx/frontend-error.log

# Restart nginx
sudo systemctl restart nginx
```

### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificates manually
sudo certbot renew

# View certbot logs
sudo tail -f /var/log/letsencrypt/letsencrypt.log
```

### DNS Not Resolving

```bash
# Check DNS resolution
nslookup yourdomain.com
dig yourdomain.com

# Check if name servers are correct
dig NS yourdomain.com
```

### Application Errors

```bash
# Backend logs
sudo journalctl -u trading-backend -f

# Frontend logs
sudo journalctl -u trading-frontend -f

# Nginx access logs
sudo tail -f /var/log/nginx/api-access.log
sudo tail -f /var/log/nginx/frontend-access.log

# Check disk space
df -h

# Check memory usage
free -h

# Check running processes
top
```

---

## Security Checklist

- [ ] EC2 security group configured with minimal required ports
- [ ] SSH key-based authentication (no password login)
- [ ] Firewall configured (ufw)
- [ ] SSL certificates installed and auto-renewing
- [ ] Environment variables properly set (not committed to git)
- [ ] Database password is strong and secure
- [ ] JWT secrets are randomly generated
- [ ] Regular backups configured
- [ ] Monitoring and alerts setup (CloudWatch)
- [ ] Log rotation configured

---

## Firewall Setup (UFW)

```bash
# Install UFW
sudo apt install ufw -y

# Default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

## Monitoring

### Setup CloudWatch Agent (Optional)

```bash
# Download CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb

# Install
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb

# Configure with wizard
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard
```

---

## Backup Strategy

### Database Backup

```bash
# Create backup script
nano /var/www/app/backup-db.sh
```

```bash
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/var/backups/mysql"
mkdir -p $BACKUP_DIR

mysqldump -u trading_user -p'your_password' trading_journal > $BACKUP_DIR/backup_$TIMESTAMP.sql

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

```bash
# Make executable
chmod +x /var/www/app/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
```

Add:

```
0 2 * * * /var/www/app/backup-db.sh
```

---

## Quick Reference

### Service Commands

```bash
# Start services
sudo systemctl start trading-backend
sudo systemctl start trading-frontend

# Stop services
sudo systemctl stop trading-backend
sudo systemctl stop trading-frontend

# Restart services
sudo systemctl restart trading-backend
sudo systemctl restart trading-frontend

# Check status
sudo systemctl status trading-backend
sudo systemctl status trading-frontend

# View logs
sudo journalctl -u trading-backend -f
sudo journalctl -u trading-frontend -f
```

### Nginx Commands

```bash
# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# Restart nginx
sudo systemctl restart nginx

# View logs
sudo tail -f /var/log/nginx/error.log
```

---

## Support

For issues or questions, refer to:

- [README.md](README.md) - Project documentation
- Application logs via `journalctl`
- Nginx logs in `/var/log/nginx/`

---

## Scaling Considerations

### Application Scalability Assessment

This section provides a comprehensive analysis of the application's readiness for horizontal and vertical scaling.

#### Horizontal Scaling with Load Balancer

##### ✅ What's Ready

1. **Stateless Authentication**

   - JWT tokens stored in HTTP-only cookies
   - Tokens are self-contained and don't rely on server memory
   - Any backend instance can validate tokens

2. **Database-Backed Refresh Tokens**

   - `RefreshToken` model stores tokens in MySQL
   - Shared state across all instances
   - Enables session validation from any server

3. **No In-Memory Sessions**

   - Application doesn't use `express-session` with memory store
   - Excellent for load balancing

4. **Standard REST API**
   - Stateless API design
   - Easy to replicate across multiple instances

##### ❌ Critical Blockers (Must Fix)

1. **File Uploads to Local Disk**

   ```javascript
   // Current: packages/backend/controllers/import.controller.js
   const storage = multer.diskStorage({
     destination: "./uploads/trades",
     // ...
   });
   ```

   **Problem:** Files saved to local filesystem on one server aren't accessible to other instances

   **Solutions:**

   **Option A: AWS S3 (Recommended)**

   ```bash
   npm install multer-s3 @aws-sdk/client-s3 --workspace=backend
   ```

   ```javascript
   // Modified import.controller.js
   const multerS3 = require("multer-s3");
   const { S3Client } = require("@aws-sdk/client-s3");

   const s3Client = new S3Client({
     region: process.env.AWS_REGION,
     credentials: {
       accessKeyId: process.env.AWS_ACCESS_KEY_ID,
       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
     },
   });

   const upload = multer({
     storage: multerS3({
       s3: s3Client,
       bucket: process.env.S3_BUCKET_NAME,
       metadata: (req, file, cb) => {
         cb(null, { fieldName: file.fieldname });
       },
       key: (req, file, cb) => {
         cb(null, `uploads/trades/${Date.now()}-${file.originalname}`);
       },
     }),
   });
   ```

   **Option B: AWS EFS (Shared File System)**

   ```bash
   # On each EC2 instance
   sudo mount -t nfs4 -o nfsvers=4.1 \
     fs-xxxxxx.efs.us-east-1.amazonaws.com:/ /var/www/app/uploads
   ```

2. **Cron Job Running on Every Instance**

   ```javascript
   // Current: packages/backend/cron/cleanupTokens.js
   cron.schedule("0 0 * * *", async () => {
     /* cleanup */
   });
   ```

   **Problem:** Runs simultaneously on all instances causing redundant work

   **Solutions:**

   **Option A: AWS Lambda + EventBridge (Recommended)**

   ```javascript
   // Create separate Lambda function for cron jobs
   // Remove cron from backend application

   // Lambda handler:
   const { Sequelize } = require("sequelize");
   const { Op } = require("sequelize");

   exports.handler = async (event) => {
     const sequelize = new Sequelize(/* RDS connection */);
     const RefreshToken = require("./models/token.model")(sequelize);

     const deleted = await RefreshToken.destroy({
       where: {
         expiresAt: { [Op.lt]: new Date() },
       },
     });

     console.log(`Cleaned ${deleted} expired tokens`);
     return { statusCode: 200, body: JSON.stringify({ deleted }) };
   };
   ```

   **Option B: Distributed Lock with Redis**

   ```bash
   npm install redis redlock --workspace=backend
   ```

   ```javascript
   // Modified cleanupTokens.js
   const Redis = require("redis");
   const Redlock = require("redlock");

   const redisClient = Redis.createClient({
     url: process.env.REDIS_URL,
   });
   const redlock = new Redlock([redisClient]);

   cron.schedule("0 0 * * *", async () => {
     try {
       const lock = await redlock.acquire(["cleanup-tokens"], 5000);
       try {
         // Perform cleanup
         const deleted = await RefreshToken.destroy({
           /* ... */
         });
         console.log(`Cleaned ${deleted} tokens`);
       } finally {
         await lock.release();
       }
     } catch (err) {
       // Another instance is running the cleanup
       console.log("Cleanup already running on another instance");
     }
   });
   ```

3. **Cookie Configuration**

   ```javascript
   // Current: packages/backend/config/cookie.js
   domain: isProduction ? ".trade2learn.site" : undefined;
   ```

   ✅ **Status:** Already correct! The dot prefix allows subdomains

   ⚠️ **Requirement:** Ensure load balancer uses matching domain (e.g., `api.trade2learn.site`)

#### Load Balancer Setup

##### AWS Application Load Balancer Configuration

```bash
# Create target group
aws elbv2 create-target-group \
  --name trading-backend-tg \
  --protocol HTTP \
  --port 8000 \
  --vpc-id vpc-xxxxx \
  --health-check-path /health \
  --health-check-interval-seconds 30 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3

# Create load balancer
aws elbv2 create-load-balancer \
  --name trading-backend-alb \
  --subnets subnet-xxxxx subnet-yyyyy \
  --security-groups sg-xxxxx

# Create listener
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:... \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=arn:aws:acm:... \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:...
```

##### Health Check Endpoint

Add to `packages/backend/app.js`:

```javascript
// Health check endpoint for load balancer
app.get("/health", (req, res) => {
  res
    .status(200)
    .json({ status: "healthy", timestamp: new Date().toISOString() });
});
```

##### Sticky Sessions (Temporary Solution)

While fixing file upload issues:

```bash
# Enable sticky sessions on target group
aws elbv2 modify-target-group-attributes \
  --target-group-arn arn:aws:elasticloadbalancing:... \
  --attributes Key=stickiness.enabled,Value=true \
               Key=stickiness.type,Value=lb_cookie \
               Key=stickiness.lb_cookie.duration_seconds,Value=86400
```

#### Database Scaling

##### Connection Pooling (Must Implement)

Modify `packages/backend/config/db.js`:

```javascript
const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT,
    logging: false,
    pool: {
      max: 10, // Maximum connections per instance
      min: 2, // Minimum idle connections
      acquire: 30000, // Max time (ms) to get connection before error
      idle: 10000, // Max idle time before releasing connection
    },
    retry: {
      max: 3, // Retry failed queries
    },
  }
);

module.exports = sequelize;
```

**Important:** With 3 backend instances and max pool of 10:

- Total max connections: 3 × 10 = 30 connections
- Ensure MySQL `max_connections` > 30 (recommend 100+)

##### Vertical Scaling (RDS)

✅ **Ready:** No code changes needed

```bash
# Modify RDS instance class
aws rds modify-db-instance \
  --db-instance-identifier trading-journal-db \
  --db-instance-class db.t3.medium \
  --apply-immediately
```

Recommended instance progression:

- Development: db.t3.micro (free tier)
- Small production: db.t3.small
- Medium production: db.t3.medium or db.r6g.large
- Large production: db.r6g.xlarge or higher

##### Read Replicas

✅ **90% Ready:** Minor code changes needed

```bash
# Create read replica
aws rds create-db-instance-read-replica \
  --db-instance-identifier trading-journal-db-replica-1 \
  --source-db-instance-identifier trading-journal-db \
  --db-instance-class db.t3.small
```

Code modifications needed:

```javascript
// packages/backend/config/db.js
const sequelizeWrite = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST_WRITE, // Primary instance
    dialect: "mysql",
    pool: { max: 10, min: 2 },
  }
);

const sequelizeRead = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST_READ, // Read replica
    dialect: "mysql",
    pool: { max: 15, min: 3 }, // More connections for read
    replication: {
      read: [
        { host: process.env.DB_HOST_READ_1 },
        { host: process.env.DB_HOST_READ_2 }, // Multiple replicas
      ],
      write: { host: process.env.DB_HOST_WRITE },
    },
  }
);

module.exports = { sequelizeWrite, sequelizeRead };
```

Usage in controllers:

```javascript
// For read operations
const users = await sequelizeRead.models.User.findAll();

// For write operations
const user = await sequelizeWrite.models.User.create({...});
```

##### Multi-AZ Deployment

✅ **Ready:** No code changes needed

```bash
# Enable Multi-AZ
aws rds modify-db-instance \
  --db-instance-identifier trading-journal-db \
  --multi-az \
  --apply-immediately
```

Benefits:

- Automatic failover to standby instance
- Enhanced availability during maintenance
- No application changes required

#### Redis Implementation (Optional but Recommended)

##### Use Cases

1. Session storage (if migrating from cookies)
2. Distributed locks for cron jobs
3. Cache frequently accessed data
4. Rate limiting
5. Real-time features

##### Setup

```bash
# Install dependencies
npm install redis --workspace=backend
```

```javascript
// packages/backend/config/redis.js
const redis = require("redis");

const redisClient = redis.createClient({
  url: process.env.REDIS_URL, // e.g., redis://elasticache-endpoint:6379
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 1000),
  },
});

redisClient.on("error", (err) => console.error("Redis error:", err));
redisClient.on("connect", () => console.log("Redis connected"));

module.exports = redisClient;
```

Example caching:

```javascript
const redisClient = require("../config/redis");

// Cache user data
exports.getUser = async (req, res) => {
  const userId = req.params.id;
  const cacheKey = `user:${userId}`;

  // Check cache first
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }

  // Fetch from database
  const user = await User.findByPk(userId);

  // Store in cache (expire in 5 minutes)
  await redisClient.setEx(cacheKey, 300, JSON.stringify(user));

  res.json(user);
};
```

#### Scaling Roadmap

##### Phase 1: Foundation (1-2 weeks)

- [ ] Add connection pooling to Sequelize
- [ ] Implement health check endpoint
- [ ] Add application logging (Winston or Pino)
- [ ] Set up monitoring (CloudWatch)
- [ ] Enable RDS Multi-AZ

##### Phase 2: Essential Fixes (2-3 weeks)

- [ ] Migrate file uploads to S3
  - Install `multer-s3` and `@aws-sdk/client-s3`
  - Update `import.controller.js`
  - Test upload/download functionality
- [ ] Centralize cron jobs
  - Create Lambda function for token cleanup
  - Set up EventBridge schedule
  - Remove cron from backend code
- [ ] Add Redis for caching (optional)

##### Phase 3: Load Balancing (1 week)

- [ ] Create AWS Application Load Balancer
- [ ] Configure target group with health checks
- [ ] Deploy 2-3 backend instances
- [ ] Update DNS to point to ALB
- [ ] Test horizontal scaling

##### Phase 4: Optimization (Ongoing)

- [ ] Add RDS Read Replicas
- [ ] Implement query caching
- [ ] Add CDN for static assets
- [ ] Set up auto-scaling groups
- [ ] Implement blue-green deployments

#### Cost Estimation

##### Current (Single Instance)

- EC2 t3.small: ~$15/month
- RDS db.t3.micro: ~$15/month (free tier available)
- Total: ~$30/month

##### Scaled (3 Instances + Load Balancer)

- EC2 t3.small × 3: ~$45/month
- Application Load Balancer: ~$25/month
- RDS db.t3.small: ~$30/month
- RDS Multi-AZ: +$30/month
- S3 storage (100GB): ~$2.30/month
- ElastiCache (Redis) t3.micro: ~$15/month
- Data transfer: ~$10/month
- Total: ~$157/month

##### Scaling Triggers

- Add instances when CPU > 70% for 10+ minutes
- Add read replicas when read queries > 1000/sec
- Upgrade RDS when connections approach max
- Add caching when database latency > 100ms

#### Performance Benchmarks

##### Current Expected Performance

- Single instance: ~500-1000 req/sec
- Database: ~2000 queries/sec (db.t3.small)

##### After Horizontal Scaling

- 3 instances: ~1500-3000 req/sec
- With caching: ~5000-10000 req/sec
- Read replicas: 2x-3x read performance

#### Monitoring and Alerts

##### CloudWatch Metrics to Track

```bash
# Backend metrics
- CPU utilization > 80%
- Memory utilization > 85%
- Request count
- Error rate > 1%
- Response time > 1000ms

# Database metrics
- Connection count approaching max
- CPU utilization > 80%
- Read/Write IOPS
- Replication lag (if using read replicas)
- Disk space < 20%

# Load Balancer metrics
- Unhealthy host count > 0
- Target response time
- HTTP 5xx errors
- Request count per target
```

##### Example CloudWatch Alarm

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name high-cpu-backend \
  --alarm-description "Alert when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --evaluation-periods 2 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:sns:us-east-1:xxxxx:alerts
```

---

**Last Updated:** 2025-01-10
