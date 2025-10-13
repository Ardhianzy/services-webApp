# Install dependencies stage
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci
RUN npx prisma generate

# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production runner stage
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl
ENV NODE_ENV=production
WORKDIR /home/node/app

# Copy package.json and prisma files first
COPY package*.json ./
COPY --from=builder /app/prisma ./prisma

# Install production dependencies (this will run postinstall and prisma generate)
RUN npm ci --omit=dev

# Copy built application and node_modules from previous stages
COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma

COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

USER node
EXPOSE 5000
ENTRYPOINT ["/entrypoint.sh"]
