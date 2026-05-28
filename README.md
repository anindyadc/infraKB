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
