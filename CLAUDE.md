# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
# Install dependencies (from root)
npm install

# Run all apps/packages in dev mode
turbo dev

# Run a specific app/package
turbo dev --filter=@turbo-starter/backend
turbo dev --filter=web

# Build everything (respects dependency order)
turbo build

# Build a specific package
turbo build --filter=@turbo-starter/backend

# Type check
turbo check-types

# Lint
turbo lint

# Format
npm run format

# Database operations (run from packages/database)
npm run db:generate    # regenerate Prisma client after schema changes
npm run db:migrate     # create and apply migrations (dev)
npm run db:push        # push schema without migration (prototyping)
npm run db:studio      # open Prisma Studio
```

## Architecture

This is a Turborepo monorepo with two apps and four shared packages. The build graph enforces this dependency order: `database` → `queues` → `services` → `backend`.

### Apps

- **`apps/backend`** — Hono HTTP API (Node.js), runs on port 3000. Uses `tsc` + `tsc-alias` for builds, `tsx watch` for dev. Routes are registered under `/api/v1/`.
- **`apps/web`** — React 19 SPA (Vite). Uses TanStack Router (file-based routing in `src/routes/`), Redux Toolkit for state, Tailwind CSS v4, and `better-auth` for auth.

### Packages

- **`@turbo-starter/database`** — Prisma client singleton (`db`) using the `@prisma/adapter-pg` driver. Exports `db` and all Prisma types. Schema lives in `packages/database/prisma/`. The `prisma.config.ts` in `src/` defines datasource and migration path.
- **`@turbo-starter/queues`** — BullMQ queues backed by ioredis. Exports `userQueue` (typed with `UserJobPayload` discriminated union covering `onboarding-email` and `login-otp` jobs) and the shared `redis` connection.
- **`@turbo-starter/services`** — Business logic and shared Hono utilities. Exports:
  - `HonoOpenAPIApp` — extends `OpenAPIHono` with centralized error handling (catches `AppError`, `ZodError`, fallback 500)
  - `auth` — `better-auth` instance (Prisma adapter, email+password, `@better-auth/infra` dash plugin). Auth is mounted as a catch-all on `/api/v1/auth`.
  - `UserService` — Prisma-based user lookup
  - `EmailService` — Nodemailer transactional email
  - Error classes: `AppError`, `UnauthorizedException`, `ForbiddenException`, `ResourceNotFoundException`, `ConflictException`, `InternalServerErrorException`
- **`@turbo-starter/typescript-config`** — Shared `tsconfig.json` base used by all packages.

### Adding a new API route

1. Create a route file in `apps/backend/src/routes/<name>.route.ts` using `HonoOpenAPIApp` and `createRoute` (OpenAPI-typed).
2. Register it in `apps/backend/src/routes/index.ts` via `app.route(...)`.
3. Add any business logic as a service class in `packages/services/src/modules/<name>/`.

### Environment variables

Backend requires: `DATABASE_URL`, `REDIS_URL`, `BETTER_AUTH_API_KEY`, `BASE_URL`, `FRONTEND_ENDPOINT`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`.

### Docker

Each app has its own `Dockerfile`. The backend image uses `turbo prune` to produce a minimal build context, compiles with `tsc`, then runs from `gcr.io/distroless/nodejs22-debian12:nonroot`.
