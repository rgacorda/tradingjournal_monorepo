# Trading Journal Deployment Guide

## Overview

Deploy the **Trading Journal** monorepo to Ubuntu using a **`~/production`** layout (same *folder pattern* you may use for other projects: app code in a subfolder, shared `docker-compose.yml`, nginx configs in `conf.d/`).

**This guide is only for Trading Journal** — not bundled with any other application.

| Path | Purpose |
| ---- | ------- |
| `~/production/trading-journal/` | Git clone of this repository |
| `~/production/docker-compose.yml` | MySQL, backend, frontend, nginx |
| `~/production/nginx/conf.d/trading-journal.conf` | Reverse proxy |
| `~/production/trading-journal-mysql-data/` | MySQL data volume |
| `~/production/certbot/` | SSL certificates (after Part 7) |

**Stack:**

- **Backend API** (Express) — port `8000` (internal)
- **Frontend** (Next.js) — port `3004` (internal)
- **MySQL 8** — internal only
- **Nginx** — ports `80` / `443` (public)

**URLs:**

- `https://api.yourdomain.com` — Backend API
- `https://yourdomain.com` / `https://www.yourdomain.com` — Frontend

Repo templates: `production/docker-compose.yml`, `production/nginx/conf.d/trading-journal.conf`.

---

## Quick Start

Follow these parts in order:

1. **Part 1:** Server Preparation (Steps 1.1 - 1.6)
2. **Part 2:** Application Setup (Steps 2.1 - 2.3)
3. **Part 3:** Application Dockerfiles (Steps 3.1 - 3.4)
4. **Part 4:** Docker Compose Setup (Step 4.1)
5. **Part 5:** Nginx Configuration (Step 5.1)
6. **Part 6:** Deploy All Services (Steps 6.1 - 6.3)
7. **Part 7:** SSL/HTTPS Setup (Steps 7.1 - 7.5)
8. **Part 8:** Maintenance & Operations
9. **Part 9:** Another site already on this server (optional)

> **DNS:** Complete **Step 1.6** before **Part 7** (SSL).

> **Server already hosts another app in `~/production`?** See **[Part 9](#part-9-another-site-already-on-this-server-optional)**.

---

## Part 1: Server Preparation

### Step 1.1: Prerequisites

- Ubuntu 20.04/22.04 LTS
- 2GB+ RAM (4GB+ recommended)
- 20GB+ free disk
- Domain on GoDaddy: `yourdomain.com`, `www`, `api`
- SSH access with sudo

---

### Step 1.2: Connect and Update Server

```bash
ssh username@YOUR_SERVER_IP
sudo apt update && sudo apt upgrade -y
sudo apt install curl git unzip build-essential -y
```

---

### Step 1.3: Configure Firewall

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

---

### Step 1.4: Install Docker and Docker Compose

```bash
sudo apt install docker.io docker-compose-plugin -y
# OR: curl -fsSL https://get.docker.com | sudo sh
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER
newgrp docker
```

```bash
docker --version
docker compose version
```

---

### Step 1.5: Create Project Directory Structure

```bash
mkdir -p ~/production/trading-journal
mkdir -p ~/production/nginx/conf.d
mkdir -p ~/production/certbot/conf
mkdir -p ~/production/certbot/www
mkdir -p ~/production/trading-journal-mysql-data
mkdir -p ~/production/backups/trading-journal
cd ~/production
```

---

### Step 1.6: Configure GoDaddy DNS

Add **A** records → your server IP:

| Type | Name | Value |
| ---- | ---- | ----- |
| A | `@` | `YOUR_SERVER_IP` |
| A | `www` | `YOUR_SERVER_IP` |
| A | `api` | `YOUR_SERVER_IP` |

Verify before Part 7:

```bash
dig +short yourdomain.com
dig +short api.yourdomain.com
```

---

## Part 2: Application Setup

### Step 2.1: Clone Repository

```bash
cd ~/production/trading-journal
git clone YOUR_REPOSITORY_URL .
```

SSH example:

```bash
git clone git@github.com:yourusername/trading-journal-monorepo.git .
```

---

### Step 2.2: Create Environment Files

```bash
cd ~/production/trading-journal
cp .env.docker.example .env.docker
cp .env.backend.example .env.backend
```

**`~/production/trading-journal/.env.docker`**

```env
MYSQL_ROOT_PASSWORD=CHANGE_THIS_STRONG_PASSWORD
MYSQL_DATABASE=trading_journal
MYSQL_USER=trading_user
MYSQL_PASSWORD=CHANGE_THIS_STRONG_PASSWORD
```

**`~/production/trading-journal/.env.backend`**

```env
PORT=8000
NODE_ENV=production

DB_NAME=trading_journal
DB_USER=trading_user
DB_PASSWORD=CHANGE_THIS_STRONG_PASSWORD

JWT_SECRET=CHANGE_THIS_LONG_RANDOM_SECRET
JWT_REFRESH_SECRET=CHANGE_THIS_LONG_RANDOM_SECRET

CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
FRONTEND_URL_HTTP=http://yourdomain.com
FRONTEND_URL_HTTPS=https://yourdomain.com

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
GMAIL_OAUTH_USER=
```

**`~/production/.env`** (compose project directory — frontend build arg):

```bash
nano ~/production/.env
```

```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/
```

Match `DB_USER` / `DB_PASSWORD` in `.env.docker` and `.env.backend`.

---

### Step 2.3: Generate JWT Secrets

```bash
openssl rand -base64 32
openssl rand -base64 32
```

Add to `.env.backend`.

---

## Part 3: Application Dockerfiles

Included in the repo under `packages/backend/Dockerfile` and `packages/frontend/Dockerfile`.

### Step 3.1: Architecture Overview

| Service | Container | Internal port |
| ------- | --------- | ------------- |
| MySQL | `trading-journal-mysql` | 3306 |
| Backend | `trading-journal-backend` | 8000 |
| Frontend | `trading-journal-frontend` | 3004 |
| Nginx | `trading-journal-nginx` | 80 / 443 |

All services use Docker network **`production-network`**. Nginx proxies to backend/frontend by service name.

---

### Step 3.2: Backend Dockerfile

`packages/backend/Dockerfile` — Node 20 Alpine, port **8000**, `node app.js`.

---

### Step 3.3: Frontend Dockerfile

`packages/frontend/Dockerfile` — multi-stage Next.js **standalone**, build arg `NEXT_PUBLIC_API_BASE_URL`, port **3004**.

---

### Step 3.4: Supporting Files

| File | Purpose |
| ---- | ------- |
| `production/docker-compose.yml` | Full production stack → copy to `~/production/` |
| `production/nginx/conf.d/trading-journal.conf` | Nginx site config |
| `production/backup-db.sh` | MySQL backup script |
| `.dockerignore` | Docker build context |

---

## Part 4: Docker Compose Setup

### Step 4.1: Install `docker-compose.yml`

Copy the production compose file from the repo:

```bash
cp ~/production/trading-journal/production/docker-compose.yml ~/production/docker-compose.yml
nano ~/production/docker-compose.yml
```

Or clone first, then:

```bash
# After clone in Step 2.1:
cp ~/production/trading-journal/production/docker-compose.yml ~/production/docker-compose.yml
```

The file defines:

- `trading-mysql` — data in `./trading-journal-mysql-data`
- `trading-journal-backend` — build `./trading-journal`
- `trading-journal-frontend` — build with `NEXT_PUBLIC_API_BASE_URL` from `~/production/.env`
- `nginx` — mounts `./nginx/conf.d`, `./certbot/conf`, `./certbot/www`

**Checkpoint:** `~/production/docker-compose.yml` exists and paths match your folders.

---

## Part 5: Nginx Configuration

### Step 5.1: Configure Nginx Reverse Proxy

```bash
cp ~/production/trading-journal/production/nginx/conf.d/trading-journal.conf \
   ~/production/nginx/conf.d/trading-journal.conf

nano ~/production/nginx/conf.d/trading-journal.conf
```

Replace `yourdomain.com` with your domain.

Upstreams (Docker internal DNS):

- `trading-journal-backend:8000`
- `trading-journal-frontend:3004`

After editing, start nginx with the stack in Part 6, or reload if already running:

```bash
cd ~/production
docker compose exec nginx nginx -t
docker compose exec nginx nginx -s reload
```

---

## Part 6: Deploy All Services

### Step 6.1: Build and Start All Services

```bash
cd ~/production
docker compose build
docker compose up -d
docker compose ps
```

All services should show **running**.

---

### Step 6.2: Verify Database and Apps

```bash
docker compose exec trading-mysql mysql -u trading_user -p trading_journal -e "SELECT 1;"

docker compose logs --tail=30 trading-journal-backend
docker compose logs --tail=30 trading-journal-frontend
docker compose logs --tail=20 nginx
```

---

### Step 6.3: Verify via Browser / curl

```bash
curl -sI http://api.yourdomain.com | head -1
curl -sI http://yourdomain.com | head -1
```

- `http://api.yourdomain.com`
- `http://yourdomain.com`

---

## Part 7: SSL/HTTPS Setup

Complete **Step 1.6** (DNS) first.

### Step 7.1: Install Certbot

```bash
sudo apt install certbot -y
```

---

### Step 7.2: Obtain Certificates

```bash
cd ~/production
docker compose stop nginx
```

```bash
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

```bash
sudo cp -r /etc/letsencrypt/* ~/production/certbot/conf/
```

---

### Step 7.3: Update `trading-journal.conf` for HTTPS

Add HTTPS `server` blocks and HTTP → HTTPS redirects for `api`, `yourdomain.com`, and `www`.

Example (API):

```nginx
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    client_max_body_size 10M;

    location / {
        proxy_pass http://trading_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

Repeat for frontend hostnames → `trading_frontend`.

---

### Step 7.4: Start Nginx

```bash
cd ~/production
docker compose start nginx
docker compose exec nginx nginx -t
docker compose exec nginx nginx -s reload
```

---

### Step 7.5: Auto-Renewal

```bash
cp ~/production/trading-journal/production/renew-certs-trading-journal.sh ~/production/renew-certs.sh
chmod +x ~/production/renew-certs.sh
crontab -e
```

```
0 0 1 * * /home/yourusername/production/renew-certs.sh >> /home/yourusername/production/certbot-renewal.log 2>&1
```

---

## Part 8: Maintenance & Operations

### Update application

```bash
cd ~/production/trading-journal
git pull origin main
cd ~/production
docker compose up -d --build trading-journal-backend trading-journal-frontend
```

If `NEXT_PUBLIC_API_BASE_URL` changed, update `~/production/.env` then:

```bash
docker compose up -d --build trading-journal-frontend
```

### Database backup

```bash
cp ~/production/trading-journal/production/backup-db.sh ~/production/backup-trading-journal-db.sh
chmod +x ~/production/backup-trading-journal-db.sh
crontab -e
# 0 2 * * * /home/yourusername/production/backup-trading-journal-db.sh
```

### Common commands

```bash
cd ~/production
docker compose ps
docker compose logs -f trading-journal-backend
docker compose restart trading-journal-backend
docker compose exec nginx nginx -s reload
```

### Troubleshooting

```bash
docker compose logs trading-journal-backend
docker compose logs trading-mysql
docker compose exec nginx nginx -t
```

### Security checklist

- [ ] UFW: 22, 80, 443 only
- [ ] MySQL has no public `ports:` mapping
- [ ] Strong JWT and DB passwords
- [ ] Env files not in git
- [ ] SSL on all hostnames
- [ ] Daily backups scheduled

---

## Part 9: Another Site Already on This Server (Optional)

Use this only if **`~/production` already runs a different project** (another `docker-compose.yml`, other `conf.d/*.conf` files). Trading Journal should be added **without** breaking the existing site.

### Safe vs dangerous

| Safe | Dangerous |
| ---- | --------- |
| New `trading-journal.conf` in `nginx/conf.d/` | Editing the other site's `.conf` |
| Add new services to compose | `docker compose down` (stops everything) |
| `docker compose up -d trading-journal-backend` | `docker builder prune -af` on shared server |
| `nginx -s reload` after `nginx -t` | Reusing another app's database volume |

### Steps (summary)

1. Backup: `cp ~/production/docker-compose.yml ~/production/docker-compose.yml.bak.$(date +%Y%m%d)`
2. Clone this repo to `~/production/trading-journal` (Part 2)
3. **Merge** services from `production/docker-compose.yml` into your existing compose — keep the other app's services unchanged; add `trading-mysql`, `trading-journal-backend`, `trading-journal-frontend`; ensure all services share one Docker network or are reachable from nginx
4. Add `trading-journal.conf` only (Part 5)
5. `docker compose up -d trading-mysql trading-journal-backend trading-journal-frontend`
6. `docker compose exec nginx nginx -t && docker compose exec nginx nginx -s reload`
7. DNS + SSL for **this** domain (Step 1.6 + Part 7)
8. Verify **both** sites still respond

### Rollback (this app only)

```bash
cd ~/production
docker compose stop trading-journal-frontend trading-journal-backend trading-mysql
docker compose rm -f trading-journal-frontend trading-journal-backend trading-mysql
rm ~/production/nginx/conf.d/trading-journal.conf
docker compose exec nginx nginx -t && docker compose exec nginx nginx -s reload
```

---

## Local Development (optional)

Repo root `docker-compose.yml` is for **local dev** only (`app-network`, localhost ports).

```bash
cp .env.docker.example .env.docker
cp .env.backend.example .env.backend
cp .env.compose.example .env
docker compose up -d --build
```

Production uses `~/production/` as described above.

---

## Support

- [README.md](README.md)
- `docker compose logs` in `~/production`

---

## Appendix: Scaling Considerations

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
     const sequelize = new Sequelize(/* DB connection from env vars */);
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

Production runs MySQL in Docker on the same EC2 instance. For higher traffic or HA, migrate to Amazon RDS or a managed MySQL service and point `DB_HOST` at the remote endpoint.

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
- For Docker MySQL, raise limits in `docker-compose.yml` if needed:

```yaml
command: >
  --default-authentication-plugin=mysql_native_password
  --character-set-server=utf8mb4
  --collation-server=utf8mb4_unicode_ci
  --max-connections=150
```

##### Vertical Scaling (Docker MySQL on EC2)

For a single-server Docker setup, scale the EC2 instance (more CPU/RAM/disk) and ensure the Docker volume has enough space:

```bash
# Check Docker volume disk usage
docker system df -v
df -h /var/lib/docker
```

##### Vertical Scaling (RDS — optional migration)

When outgrowing Docker MySQL, migrate to RDS with no application code changes beyond `DB_HOST`:

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

##### Read Replicas (RDS only)

When using RDS (not Docker MySQL), read replicas are supported with minor code changes:

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
- [ ] Enable RDS Multi-AZ (if migrated off Docker MySQL)

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

- [ ] Add RDS Read Replicas (if using RDS)
- [ ] Implement query caching
- [ ] Add CDN for static assets
- [ ] Set up auto-scaling groups
- [ ] Implement blue-green deployments

#### Cost Estimation

##### Current (Single Instance)

- EC2 t3.small: ~$15/month
- EC2 t3.small + Docker MySQL: ~$15–20/month
- RDS db.t3.micro (optional): ~$15/month (free tier available)
- Total: ~$30/month

##### Scaled (3 Instances + Load Balancer)

- EC2 t3.small × 3: ~$45/month
- Application Load Balancer: ~$25/month
- EC2 t3.medium + Docker MySQL: ~$30–40/month
- RDS db.t3.small (optional): ~$30/month
- RDS Multi-AZ: +$30/month
- S3 storage (100GB): ~$2.30/month
- ElastiCache (Redis) t3.micro: ~$15/month
- Data transfer: ~$10/month
- Total: ~$157/month

##### Scaling Triggers

- Add instances when CPU > 70% for 10+ minutes
- Add read replicas when read queries > 1000/sec
- Upgrade EC2 or migrate to RDS when connections approach max
- Add caching when database latency > 100ms

#### Performance Benchmarks

##### Current Expected Performance

- Single instance: ~500-1000 req/sec
- Database: ~2000 queries/sec (Docker MySQL on t3.small)

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

**Last Updated:** 2026-06-02


---

**Last Updated:** 2026-06-02


---

**Last Updated:** 2026-06-02
