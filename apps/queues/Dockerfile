# syntax=docker/dockerfile:1.7
ARG NODE_VERSION=22-alpine3.19
FROM node:${NODE_VERSION} AS base
WORKDIR /app
ENV CI=true \
    TURBO_TELEMETRY_DISABLED=1
RUN apk add --no-cache libc6-compat

FROM base AS pruner
RUN npm install -g turbo@2.9.5
COPY . .
RUN turbo prune @turbo-starter/app-queues --docker

FROM base AS builder
COPY --from=pruner /app/out/json/ .
RUN npm ci
COPY --from=pruner /app/out/full/ .
ARG DATABASE_URL=postgresql://build:build@localhost/build
ENV DATABASE_URL=$DATABASE_URL
RUN npx turbo build --filter=@turbo-starter/app-queues \
  && npm prune --omit=dev \
  && npm cache clean --force

FROM gcr.io/distroless/nodejs22-debian12:nonroot AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/queues/dist ./apps/queues/dist
COPY --from=builder /app/apps/queues/package.json ./apps/queues/package.json
COPY --from=builder /app/packages/database/dist ./packages/database/dist
COPY --from=builder /app/packages/database/package.json ./packages/database/package.json
COPY --from=builder /app/packages/queues/dist ./packages/queues/dist
COPY --from=builder /app/packages/queues/package.json ./packages/queues/package.json
COPY --from=builder /app/packages/services/dist ./packages/services/dist
COPY --from=builder /app/packages/services/package.json ./packages/services/package.json
COPY --from=builder /app/packages/better-auth/dist ./packages/better-auth/dist
COPY --from=builder /app/packages/better-auth/package.json ./packages/better-auth/package.json

CMD ["apps/queues/dist/index.js"]
