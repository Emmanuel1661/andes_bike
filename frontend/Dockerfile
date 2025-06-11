# Etapa 1: Construcción
FROM node:18-alpine AS build
WORKDIR /app

COPY ./package*.json ./
COPY ./vite.config.* ./
COPY ./src ./src
COPY ./public ./public

RUN npm install
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
