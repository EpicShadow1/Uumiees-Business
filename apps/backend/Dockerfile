# syntax=docker/dockerfile:1
FROM node:18-alpine AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /workspace

# Copy workspace manifests needed for dependency resolution
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY apps/mobile/package.json ./apps/mobile/package.json
COPY packages ./packages

# Install workspace dependencies using pnpm (repo standard)
RUN pnpm install --frozen-lockfile

# Copy the full source tree and build the backend package
COPY . .
RUN pnpm --filter @uumiees/backend build

FROM node:18-alpine AS runner

ENV NODE_ENV=production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /workspace

# Copy the workspace and installed node_modules from the builder
COPY --from=builder /workspace ./

WORKDIR /workspace/apps/backend

# Create logs directory
RUN mkdir -p logs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "dist/index.js"]