# Deployment Guide — Turbo Starter on Dokploy

## Overview

This project deploys three independent services via Docker images pushed to a private registry, with Dokploy pulling and running each image.

| Service | Image | Port |
|---|---|---|
| `apps/backend` | `turbo-starter-backend` | 3000 |
| `apps/queues` | `turbo-starter-queues` | — (background worker) |
| `apps/web` | `turbo-starter-web` | 80 |

CI/CD is handled by GitHub Actions on every push to `main`. The workflow builds all three images in parallel, pushes them to your registry, then triggers a Dokploy webhook redeploy for each service.

---

## Prerequisites

- A running Dokploy instance
- A Docker registry (Docker Hub, GHCR, or private)
- GitHub repository with Actions enabled

---

## Step 1 — GitHub Secrets

Add the following secrets to your repo under **Settings → Secrets and variables → Actions**.

### Registry

| Secret | Value |
|---|---|
| `DOCKER_REGISTRY` | Registry host — e.g. `registry.hub.docker.com`, `ghcr.io`, or your private URL |
| `DOCKER_USERNAME` | Registry username |
| `DOCKER_PASSWORD` | Registry password or access token |

### Dokploy

| Secret | Value |
|---|---|
| `DOKPLOY_TOKEN` | API token from Dokploy — **Settings → API** |
| `DOKPLOY_BACKEND_WEBHOOK` | Webhook URL from the backend service in Dokploy |
| `DOKPLOY_QUEUES_WEBHOOK` | Webhook URL from the queues service in Dokploy |
| `DOKPLOY_WEB_WEBHOOK` | Webhook URL from the web service in Dokploy |

Webhook URLs are found per-service under **Deployments → Webhook** in the Dokploy dashboard.

---

## Step 2 — Dokploy Service Setup

Create three separate **Application** services in Dokploy, one per app.

### For each service

1. **Source** → select **Docker Image**
2. Set the image tag:
   - Backend: `<registry>/<username>/turbo-starter-backend:latest`
   - Queues: `<registry>/<username>/turbo-starter-queues:latest`
   - Web: `<registry>/<username>/turbo-starter-web:latest`
3. Add your registry credentials under the **Registry** section
4. Configure environment variables (see below)
5. Copy the **Deployment Webhook URL** and save it as the corresponding GitHub secret

### Backend environment variables

```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
REDIS_URL=redis://host:6379
BETTER_AUTH_API_KEY=your-secret-key
BASE_URL=https://api.yourdomain.com
FRONTEND_ENDPOINT=https://yourdomain.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=your-smtp-password
EMAIL_FROM=no-reply@example.com
```

### Queues environment variables

```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
REDIS_URL=redis://host:6379
```

### Web

The `VITE_API_URL` is baked in at build time (not a runtime env var). The default value in the Dockerfile is `/api`, which works if your backend is proxied under the same domain. If it's on a separate domain, pass it as a build arg in the workflow:

```yaml
# in .github/workflows/deploy.yml, under the web matrix job build-and-push step
build-args: |
  VITE_API_URL=https://api.yourdomain.com
```

---

## Step 3 — GitHub Actions Workflow

The workflow lives at `.github/workflows/deploy.yml` and runs automatically on every push to `main`.

### Flow

```
git push → main
    │
    ├─ Build & push: backend  ─┐
    ├─ Build & push: queues   ─┤ (parallel)
    └─ Build & push: web      ─┘
                               │
                        all succeed
                               │
              ┌────────────────┼────────────────┐
              │                │                │
     Redeploy backend   Redeploy queues   Redeploy web
     (Dokploy webhook)  (Dokploy webhook) (Dokploy webhook)
```

Images are tagged with both `:latest` and `:<git-sha>` so you can roll back to any specific commit by updating the image tag in Dokploy.

### Layer caching

The workflow uses GitHub Actions cache scoped per app (`scope: backend`, etc.), so unchanged layers are reused across runs, keeping builds fast.

---

## Rolling Back

To roll back a service to a previous version:

1. Find the commit SHA you want to revert to from GitHub Actions history
2. In Dokploy, edit the service's image tag from `:latest` to `:<sha>`
3. Trigger a manual redeploy

---

## Notes

- The **queues** service is a background worker with no exposed port — do not configure a domain or port mapping for it in Dokploy
- The **web** service is served by nginx on port 80 — point your domain at it in Dokploy's domain settings
- If a Dokploy webhook secret is not yet configured, the deploy step skips it gracefully without failing the workflow
