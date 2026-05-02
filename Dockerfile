# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --no-audit --no-fund --legacy-peer-deps 2>&1 | grep -v "warn deprecated" || true

# Copy source
COPY . .

# Build Next.js
RUN npm run build

# Runtime stage - minimal image
FROM node:22-alpine

WORKDIR /app

# Copy package.json for npm start
COPY package.json ./

# Install only production dependencies
RUN npm install --only=production --no-audit --no-fund --legacy-peer-deps 2>&1 | grep -v "warn deprecated" || true && \
    npm cache clean --force

# Copy built Next.js app from builder
COPY --from=builder /app/.next ./.next

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000 || exit 1

# Start production server
CMD ["npm", "start"]
