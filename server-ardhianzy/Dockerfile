<<<<<<< HEAD
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci
RUN npx prisma generate

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
=======
# Tahap pertama: Build aplikasi
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# FIX #1: Salin folder prisma di sini untuk 'npm install'
COPY prisma ./prisma/
RUN npm install
>>>>>>> 4ba83b5412c326b0431a26dbb82c3d9280c8ce33
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
RUN apk add --no-cache openssl
ENV NODE_ENV=production
WORKDIR /home/node/app
<<<<<<< HEAD

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

USER node
EXPOSE 5000
ENTRYPOINT ["/bin/sh", "/entrypoint.sh"]
=======
COPY --chown=node:node package*.json ./
# FIX #2: Salin juga folder prisma di sini untuk 'npm install --omit=dev'
COPY --chown=node:node prisma ./prisma/
RUN npm install --omit=dev
COPY --from=builder --chown=node:node /app/dist ./dist
EXPOSE 5000
CMD [ "node", "dist/index.js" ]
>>>>>>> 4ba83b5412c326b0431a26dbb82c3d9280c8ce33
