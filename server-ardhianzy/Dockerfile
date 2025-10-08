# Tahap pertama: Build aplikasi
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# FIX #1: Salin folder prisma di sini untuk 'npm install'
COPY prisma ./prisma/
RUN npm install
COPY . .
RUN npm run build

# Tahap kedua: Membuat image produksi yang ringan
FROM node:20-alpine
USER node
WORKDIR /home/node/app
COPY --chown=node:node package*.json ./
# FIX #2: Salin juga folder prisma di sini untuk 'npm install --omit=dev'
COPY --chown=node:node prisma ./prisma/
RUN npm install --omit=dev
COPY --from=builder --chown=node:node /app/dist ./dist
EXPOSE 5000
CMD [ "node", "dist/index.js" ]
