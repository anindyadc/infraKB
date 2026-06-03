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

## ☁️ Cloud-Native Deployment (Supabase + GitHub Pages)

InfraKB can be hosted entirely on GitHub Pages by using Supabase as the backend.

### 1. Supabase Setup
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the **SQL Editor** and run the contents of `supabase/schema.sql`.
3. Note your **Project URL** and **Anon Key** from Project Settings > API.

### 2. Configure GitHub Secrets
In your GitHub repository, go to **Settings > Secrets and variables > Actions** and add:
- `VITE_SUPABASE_URL`: Your Supabase Project URL.
- `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key.

### 3. Deploy
Push your changes to the `main` branch. The included GitHub Action (`.github/workflows/deploy-gh-pages.yml`) will automatically build and deploy the application.

For detailed repository configuration (Permissions, Pages Source) and common troubleshooting steps, please refer to the **[GitHub Hosting & CI/CD Guide](./GitHub-Hosting.md)**.

---

## 📦 Migrating from Local MySQL to Supabase Cloud

Because MySQL and PostgreSQL (Supabase) use different SQL dialects and ID structures, doing a direct database dump is error-prone. The safest, "InfraKB-native" method is to export your documents as Markdown files and use the Bulk Import tool.

### 1. Extract Local Data
Run the included export script inside your local backend container. This will dump your database into organized Markdown folders:
```bash
docker compose exec backend npx ts-node export-data.ts
```
*The script will create a folder called `backend/exported_runbooks/` with your documents organized by category.*

### 2. Recreate Admin & Categories in Cloud
1. Open your live Cloud instance (e.g., GitHub Pages).
2. Register a new administrator account (or add your first user in the Supabase Auth Dashboard).
3. Go to the **System Admin -> Registry Structure** tab.
4. Manually recreate the core Categories you need.

### 3. Bulk Import to Supabase
1. On the Registry Structure tab, hover over a category you just created.
2. Click the **Bulk Import Mode** (File Upload icon).
3. Select all the Markdown files from the matching folder inside `backend/exported_runbooks/`.
4. The system will instantly parse the files and deploy them directly into your Supabase database.



