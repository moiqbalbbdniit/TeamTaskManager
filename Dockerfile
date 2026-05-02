# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (with retries for flaky npm)
RUN npm install --no-audit --no-fund --legacy-peer-deps || npm install --no-audit --no-fund --legacy-peer-deps

# Copy source
COPY . .

# Build Next.js
RUN npm run build

# Runtime stage - minimal image
FROM node:22-alpine

WORKDIR /app

# Copy package files from builder
COPY --from=builder /app/package*.json ./

# Install only production dependencies (lightweight)
RUN npm install --only=production --no-audit --no-fund --legacy-peer-deps || npm install --only=production --no-audit --no-fund --legacy-peer-deps

# Copy built app from builder (minimal size)
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Expose port
EXPOSE 3000

# Health check for Railway
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Start the app (Railway will use PORT env var automatically)
CMD ["npm", "start"]
