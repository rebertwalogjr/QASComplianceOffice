# Base stage
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /qas-compliance

# Dependencies stage
FROM base AS deps
COPY package.json package-lock.json* ./

RUN npm config set fetch-retry-maxtimeout 600000 && \
    npm config set fetch-retries 5 && \
    npm ci
# RUN npm ci

# Builder stage
FROM base AS builder
COPY --from=deps /qas-compliance/node_modules ./node_modules
COPY . .

# IMPORTANT: Migrate prisma schema
# CMD npx prisma migrate deploy && node server.js

# IMPORTANT: Generate Prisma Client for the cointainer's OS
RUN npx prisma generate --schema=./prisma/schema.prisma

# Build the app
RUN npm run build

# Runner stage: (Production/UAT)
FROM node:20-alpine AS runner

WORKDIR /qas-compliance

ENV NODE_ENV=uat

# This prevents Next.js from collecting telemetry data
ENV NEXT_TELEMETRY_DISABLED=1

# Copy only what we need to run the app
# COPY --from=builder /qas-compliance/package.json ./
# COPY --from=builder /qas-compliance/node_modules ./node_modules
# COPY --from=builder /qas-compliance/.next ./.next
COPY --from=builder /qas-compliance/public ./public
COPY --from=builder /qas-compliance/.next/standalone ./
COPY --from=builder /qas-compliance/.next/static ./.next/static
COPY --from=builder /qas-compliance/prisma ./prisma

EXPOSE 3000

# CMD ["npm", "start"]
CMD ["node", "server.js"]