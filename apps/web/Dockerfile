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
RUN turbo prune @turbo-starter/web --docker

FROM base AS builder
COPY --from=pruner /app/out/json/ .
RUN npm ci
COPY --from=pruner /app/out/full/ .
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL
RUN npx turbo build --filter=@turbo-starter/web \
  && npm prune --omit=dev \
  && npm cache clean --force

FROM nginx:alpine AS runner
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/templates/default.conf.template
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]