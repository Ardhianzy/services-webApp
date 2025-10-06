# services-webApp/client-ardhianzy/Dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Kalau butuh ENV utk API base (mis. VITE_API_BASE=/api), set di .env.production
RUN npm run build

FROM node:20-alpine
WORKDIR /app
RUN npm i -g serve
USER node
COPY --from=build /app/dist ./dist
EXPOSE 5713
CMD ["serve", "-s", "dist", "-l", "5713"]
