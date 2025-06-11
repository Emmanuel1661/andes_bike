# Etapa 1: Build del proyecto Vite/React
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Servir los archivos con NGINX
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Quita configuración por defecto y agrega la tuya
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
