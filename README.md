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
   cp frontend/.env.example frontend/.env
   ```

2. **Configure Backend Mode**
   InfraKB supports two backend modes. Edit `frontend/.env` to switch:
   - **Self-Hosted (MySQL/Express):** `VITE_BACKEND_TYPE="express"` (Default)
   - **Cloud-Native (Supabase):** `VITE_BACKEND_TYPE="supabase"`

3. **Start Services**
   ```bash
   docker compose up -d
   ```

4. **Initialize Database**
   ```bash
   # For MySQL Mode:
   docker compose exec backend npx prisma db push
   docker compose exec backend npm run seed
   
   # For Supabase Mode:
   # Apply schema.sql to your Supabase project via SQL Editor.
   ```

5. **Access the App**
   Open [http://localhost:5173](http://localhost:5173) in your browser.

### 🔑 Default Credentials (MySQL Mode)
The seed script creates an initial administrator account:
- **Email:** `admin@infrakb.local`
- **Password:** `Admin123456`

## 🛠 Tech Stack

- **Backend Option A:** Node.js (Express), Prisma ORM, MySQL 8
- **Backend Option B:** Supabase (PostgreSQL, Auth, Storage)
- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS (with Typography plugin)
- **Editor:** CodeMirror 6 (with Markdown and syntax highlighting)
- **State Management:** Zustand, TanStack Query v5
- **Infrastructure:** Docker, Docker Compose, Nginx, GitHub Actions

## ✨ Key Features

- **Command Center Dashboard:** A premium, high-performance dashboard featuring real-time system metrics, node status, and intuitive navigation.
- **Dynamic Tagging System:** Categorize runbooks with flexible tags for advanced filtering and discovery.
- **Hierarchical Content Organization:**
  - **Category Management:** Full administrative control over knowledge hierarchies. Create, update, and sort nested categories with custom emoji icons.
  - **Uncategorized Catch-all:** Smart handling of orphaned documents when categories are deleted, ensuring no data is lost.
  - **Registry Structure:** Dedicated Admin tab for managing the entire knowledge tree.
- **Distraction-free Workspace:** Collapse both the category sidebar and document list to maximize your writing and reading area (Shortcuts: `[` and `]`).
- **Global Keyboard Shortcuts:** Efficient navigation via high-performance shortcuts (press `?` for full map).
- **User & Credential Management:** Full administrative control over operator accounts, roles (RBAC), and secure password resets.
- **External Public Sharing:** Generate secure, read-only public links for runbooks to collaborate with external stakeholders.
- **Markdown Import & Migration:**
  - **Single File:** Instantly create documents by uploading `.md` or `.txt` files.
  - **Bulk Import:** Migrate entire libraries at once by importing multiple files into specific categories within the Admin Panel.
- **Premium Markdown Experience:** Industry-standard rendering with Mac-style code blocks, JetBrains Mono typography, and one-click copy.
- **Mobile-Friendly & PWA:** Fully responsive UI installable as a standalone application.

## 📂 Project Structure

```
infrakb/
├── .github/workflows/ # GitHub Actions CI/CD
├── backend/          # Node.js API & Prisma
├── frontend/         # React SPA
├── docker-compose.yml # Dev environment
└── README.md         # This file
```

## 📄 Documentation

- [GitHub Hosting & CI/CD](./GitHub-Hosting.md) - Instructions for hosting and automated deployment via GitHub.
- [Deployment Guide](./Deployment.md) - General instructions for production setup.
- [Project Mandates](./GEMINI.md) - Architectural guidelines for contributors.
