# syntax=docker/dockerfile:1
FROM node:20-bookworm-slim AS base
WORKDIR /app
ENV NODE_ENV=production

FROM base AS deps
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

FROM base AS runner
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY src ./src

# Create data directory and set permissions
RUN mkdir -p /app/data && chown -R node:node /app/data

USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s CMD node -e "fetch('http://localhost:3000/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
VOLUME ["/app/data"]
CMD ["node","src/index.js"]
