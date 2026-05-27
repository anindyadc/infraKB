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
- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS (with Typography plugin)
- **Editor:** CodeMirror 6 (with Markdown and syntax highlighting)
- **State Management:** Zustand, TanStack Query v5
- **Infrastructure:** Docker, Docker Compose, Nginx

## ✨ Key Features

- **Command Center Dashboard:** A premium, high-performance dashboard featuring real-time system metrics, node status, and intuitive navigation.
- **Distraction-free Workspace:** Collapse both the category sidebar and document list to maximize your writing and reading area (Shortcuts: `[` and `]`).
- **User & Credential Management:** Full administrative control over operator accounts, roles (RBAC), and secure password resets.
- **External Public Sharing:** Generate secure, read-only public links for runbooks to collaborate with external stakeholders without requiring an account.
- **Premium Markdown Experience:** Industry-standard rendering with Mac-style code blocks, JetBrains Mono typography, robust "One-Click Copy", and high-performance syntax highlighting.
- **Advanced Typography:** Optimized letter-spacing and font-weights for long-form technical reading and high-contrast accessibility.
- **Improved Navigation:** Real-time category filtering and intuitive document organization.
- **Premium Login Experience:** A "decorated" command-center style login page featuring glassmorphism, deep shadows, and advanced animations.
- **Theme Switcher:** Polished **Day (Light)** and **Night (Dark)** modes with system preference detection and persistent sessions (up to 7 days).
- **Fast Search:** High-performance full-text search across document titles and content.
- **Markdown Editor:** Professional-grade editor with line wrapping, syntax highlighting, and toolbar.
- **Version Control:** Automatic snapshots created before every document update.
- **Attachments:** Secure file and image uploads integrated into the editing flow.
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
