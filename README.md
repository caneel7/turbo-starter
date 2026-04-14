# Turbo Starter

A full-stack monorepo built with Turborepo, featuring a Hono REST API backend and a React 19 SPA frontend.

## Live

| App | URL |
|-----|-----|
| Web | http://devcaneel-devfrontend-fphhlu-03dc2b-178-104-53-87.traefik.me/ |
| Backend | http://devcaneel-turbostarterbackend-r2mizd-b336d2-178-104-53-87.traefik.me/ |

## Stack

- **Backend** — [Hono](https://hono.dev/) (Node.js), OpenAPI, `better-auth`, BullMQ, Prisma + PostgreSQL
- **Web** — React 19, Vite, TanStack Router, Redux Toolkit, Tailwind CSS v4, `better-auth`
- **Infra** — Turborepo, Docker, Redis

## Structure

```
apps/
  backend/        Hono HTTP API (port 3000), routes under /api/v1/
  web/            React SPA (Vite)
packages/
  database/       Prisma client singleton, schema, migrations
  queues/         BullMQ queues (userQueue) backed by ioredis
  services/       Shared business logic, auth, error classes
  typescript-config/  Shared tsconfig base
```

## Getting Started

**Prerequisites:** Node.js, PostgreSQL, Redis

```sh
# Install dependencies
npm install

# Set up environment variables
cp apps/backend/.env.example apps/backend/.env
# Fill in: DATABASE_URL, REDIS_URL, BETTER_AUTH_API_KEY, BASE_URL,
#          FRONTEND_ENDPOINT, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM

# Run database migrations
cd packages/database && npm run db:migrate && cd ../..

# Start all apps in dev mode
turbo dev
```

## Commands

```sh
turbo dev                                    # dev all apps
turbo dev --filter=@turbo-starter/backend   # dev backend only
turbo dev --filter=web                       # dev web only
turbo build                                  # build everything
turbo check-types                            # type check
turbo lint                                   # lint
npm run format                               # format

# Database (from packages/database)
npm run db:generate   # regenerate Prisma client after schema changes
npm run db:migrate    # create and apply migrations
npm run db:push       # push schema without migration (prototyping)
npm run db:studio     # open Prisma Studio
```

## Adding a New API Route

1. Create `apps/backend/src/routes/<name>.route.ts` using `HonoOpenAPIApp` and `createRoute`
2. Register it in `apps/backend/src/routes/index.ts` via `app.route(...)`
3. Add business logic in `packages/services/src/modules/<name>/`

## Docker

Each app has its own `Dockerfile`. The backend uses `turbo prune` for a minimal build context, compiles with `tsc`, and runs on `distroless/nodejs22`.
