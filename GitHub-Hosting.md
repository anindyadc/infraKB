# GitHub Hosting & CI/CD Guide

InfraKB can be easily hosted and deployed using GitHub's built-in tools. This guide covers how to set up automated builds and use the GitHub Container Registry (GHCR).

## 🚀 Automated CI/CD with GitHub Actions

The project includes a GitHub Actions workflow located at `.github/workflows/docker-publish.yml`. This workflow automatically:

1.  **Triggers** on every push to the `master` or `main` branch.
2.  **Builds** both the Frontend and Backend production Docker images.
3.  **Publishes** the images to the **GitHub Container Registry (GHCR)**.

### Setup Instructions

1.  **Push your code to GitHub:**
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/infrakb.git
    git push -u origin master
    ```

2.  **Verify GHCR Permissions:**
    - Go to your GitHub Profile -> **Packages**.
    - You should see `infrakb-frontend` and `infrakb-backend` images once the first action finishes.
    - Ensure the package visibility is set appropriately (Private/Public).

## 🐳 Deploying from GitHub Container Registry

To deploy the images published by GitHub on your server, update your `docker-compose.prod.yml` to pull from GHCR:

```yaml
services:
  backend:
    image: ghcr.io/YOUR_USERNAME/infrakb-backend:latest
    # ... rest of config

  frontend:
    image: ghcr.io/YOUR_USERNAME/infrakb-frontend:latest
    # ... rest of config
```

### Pulling and Running

On your production server:

```bash
# Login to GHCR
echo ${{ secrets.YOUR_GITHUB_TOKEN }} | docker login ghcr.io -u YOUR_USERNAME --password-stdin

# Pull and Start
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

## 🛠 Repository Settings

To ensure the best experience on GitHub:
- **Dependabot:** Enable Dependabot in **Settings -> Code security and analysis** to stay updated on security vulnerabilities.

### 🌐 Deploying Frontend to GitHub Pages (Supabase Mode)

Thanks to the Dual-Backend Strategy, if you are using **Supabase**, you can host the React frontend entirely for free on GitHub Pages. The repository includes an automated workflow (`.github/workflows/deploy-gh-pages.yml`) for this purpose.

**Mandatory Repository Configuration:**
For the automated deployment to succeed and display correctly, you must configure two settings in your GitHub repository:

#### 1. Grant Workflow Permissions
By default, GitHub restricts workflows from pushing code. You must allow it to write to the `gh-pages` branch.
1. Go to your repository on GitHub -> **Settings**.
2. Scroll down the left sidebar to **Actions** -> **General**.
3. Under **Workflow permissions**, select **Read and write permissions**.
4. Click **Save**.

#### 2. Configure Pages Source
You must tell GitHub Pages to serve the compiled application, not your source code.
1. Go to **Settings** -> **Pages**.
2. Under **Build and deployment**, ensure **Source** is set to **Deploy from a branch**.
3. Under **Branch**, select the **`gh-pages`** branch (not `main`).
4. Ensure the folder is set to **`/(root)`**.
5. Click **Save**.

*Note: Ensure your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are added to your repository's **Secrets and variables -> Actions** so the workflow can bake them into the production build.*
