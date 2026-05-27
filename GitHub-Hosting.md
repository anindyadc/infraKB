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
- **GitHub Pages:** Note that InfraKB requires a backend (Express + MySQL), so it cannot be hosted purely on GitHub Pages. Use a VPS or Docker hosting provider.
