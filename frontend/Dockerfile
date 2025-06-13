# Etapa 1: Build de la app
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY vite.config.js .
COPY tailwind.config.js .
COPY postcss.config.js .
COPY . .

RUN npm install
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html
