FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat

FROM base AS builder
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune @turbo-starter/app-queues --docker

FROM base AS installer
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm ci
COPY --from=builder /app/out/full/ .
RUN npx turbo build --filter=@turbo-starter/app-queues

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nodejs
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/package.json ./package.json
COPY --from=installer /app/packages/database/package.json ./packages/database/package.json
COPY --from=installer /app/packages/database/dist ./packages/database/dist
COPY --from=installer /app/packages/queues/package.json ./packages/queues/package.json
COPY --from=installer /app/packages/queues/dist ./packages/queues/dist
COPY --from=installer /app/packages/services/package.json ./packages/services/package.json
COPY --from=installer /app/packages/services/dist ./packages/services/dist
COPY --from=installer /app/apps/queues/dist ./apps/queues/dist
RUN chown -R nodejs:nodejs /app
USER nodejs
CMD ["node", "apps/queues/dist/index.js"]
