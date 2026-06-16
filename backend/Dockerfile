# --- Stage 1: Build Phase ---
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

# Generate Prisma Client engines
COPY prisma ./prisma/
RUN npx prisma generate

# Copy the rest of your application code
COPY . .

# Run native compilation step to populate /dist cleanly
RUN npm run build

# --- Stage 2: Production Runner Phase ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
# Install only required production dependencies
RUN npm install --only=production

# Copy the compiled dist folder
COPY --from=builder /app/dist ./dist

# 💡 CRITICAL: Copy the raw source and root assets (like pipeline_registry.json, pipelineInfo, etc.)
# This ensures tsx can resolve extensionless files and cross-directory references perfectly.
COPY --from=builder /app/src ./src
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
# Capture configurations and stray files sitting in your backend root folder
COPY --from=builder /app/*.ts /app/*.json ./

EXPOSE 5000

# 💡 THE FIX: Run using npx tsx directly on your source entry point. 
# It handles extension resolution natively and supports dynamic requires in standard node packages.
CMD ["npx", "tsx", "src/server.ts"]