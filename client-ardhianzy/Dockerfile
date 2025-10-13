# client-ardhianzy/Dockerfile

# Tahap 1: Build aplikasi
FROM node:20-alpine AS build

# Terima build argument dari docker-compose.yaml
ARG VITE_API_BASE_URL
# Jadikan argument tersebut sebagai environment variable
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# 'npm run build' sekarang akan memiliki akses ke VITE_API_BASE_URL
RUN npm run build

# Tahap 2: Sajikan hasil build dengan 'serve'
FROM node:20-alpine
WORKDIR /app
RUN npm i -g serve
USER node
COPY --from=build /app/dist ./dist
EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
