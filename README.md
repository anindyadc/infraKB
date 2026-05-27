# InfraKB — DevOps Knowledge Base

InfraKB is a self-hosted, private knowledge base designed specifically for DevOps and infrastructure teams. It provides a secure, fast, and markdown-native environment for storing runbooks, how-tos, setup guides, and incident response playbooks.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 20+ (for local development without Docker)

### Development Setup
1. **Clone and Setup**
   ```bash
   git clone <repo-url>
   cd infrakb
   cp .env.example .env
   ```

2. **Start Services**
   ```bash
   docker compose up -d
   ```

3. **Initialize Database**
   ```bash
   # Sync schema and generate client
   docker compose exec backend npx prisma db push
   
   # Populate initial admin and categories
   docker compose exec backend npm run seed
   ```

4. **Access the App**
   Open [http://localhost:5173](http://localhost:5173) in your browser.

### 🔑 Default Credentials
The seed script creates an initial administrator account:
- **Email:** `admin@infrakb.local`
- **Password:** `Admin123456`

## 🛠 Tech Stack

- **Backend:** Node.js (Express), Prisma ORM, MySQL 8
- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS
- **Editor:** CodeMirror 6 (with Markdown and syntax highlighting)
- **State Management:** Zustand, TanStack Query v5
- **Infrastructure:** Docker, Docker Compose, Nginx

## ✨ Key Features

- **Theme Switcher:** Polished **Day (Light)** and **Night (Dark)** modes with system preference detection.
- **Fast Search:** High-performance full-text search across document titles and content.
- **Markdown Editor:** Professional-grade editor with line wrapping, syntax highlighting, and toolbar.
- **Rich Rendering:** Support for code blocks, callouts, and YouTube embeds.
- **Version Control:** Automatic snapshots created before every document update.
- **Attachments:** Secure file and image uploads integrated into the editing flow.
- **Admin Dashboard:** Overview of system statistics and user management.
- **Security:** JWT-based authentication with role-based access control (RBAC).

## 📂 Project Structure

```
infrakb/
├── backend/          # Node.js API & Prisma
├── frontend/         # React SPA
├── docker-compose.yml # Dev environment
└── README.md         # This file
```

## 📄 Documentation

- [Deployment Guide](./Deployment.md) - Instructions for production setup.
- [Project Mandates](./GEMINI.md) - Architectural guidelines for contributors.
