# InfraKB Deployment Guide

This guide provides instructions for deploying InfraKB in a production environment.

## 🐳 Production Deployment with Docker

The easiest way to deploy InfraKB is using the provided `docker-compose.prod.yml` which includes an Nginx reverse proxy.

### 1. Configure Environment Variables
Create a `.env` file in the root directory with production-ready secrets:

```bash
# Database
DB_ROOT_PASSWORD=your-secure-root-password
DB_PASSWORD=your-secure-user-password

# Auth Secrets (Generate long random strings)
JWT_ACCESS_SECRET=your-32-char-min-access-secret
JWT_REFRESH_SECRET=your-32-char-min-refresh-secret

# Timeouts
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Server
NODE_ENV=production
```

### 2. Launch Services
Run the following command to build and start the production stack:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### 3. Initialize Database
Once the database container is healthy, run the migrations and seed data:

```bash
# Apply migrations
docker compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy

# Seed initial admin and categories
docker compose -f docker-compose.prod.yml exec backend npm run seed
```

*Note: The initial administrator will be created with `admin@infrakb.local` / `Admin123456`.*


## 🏗 Infrastructure Overview

The production stack consists of:
- **Nginx**: Listens on port 80 (and 443 if configured). Routes traffic to the React static files or the Express API (`/api`).
- **Backend (Express)**: Optimized build running in a Node.js container.
- **Frontend (React)**: Pre-built static assets served by Nginx.
- **MySQL**: Persistent database volume for user data, documents, and logs.
- **Uploads Volume**: Persistent storage for images and file attachments.

## 🔒 Security Best Practices

1. **Enable HTTPS**: Update `frontend/nginx.conf` and `docker-compose.prod.yml` to include SSL certificates (e.g., via Certbot/Let's Encrypt).
2. **Firewall**: Ensure port 3306 (MySQL) is not exposed to the public internet. Only ports 80 and 443 should be open.
3. **Secrets Management**: Use a secret manager or CI/CD secrets for your environment variables instead of hardcoding them in `.env` files on your server.
4. **Backup**: Regularly back up the `mysql_prod_data` and `uploads_prod_data` Docker volumes.

## 🔄 Updating to a New Version

To update InfraKB, pull the latest changes and rebuild:

```bash
git pull
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
```
