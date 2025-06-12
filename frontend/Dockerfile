# Etapa 1: Construcción del frontend
FROM node:18-alpine AS build

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY vite.config.js ./
COPY postcss.config.js ./
COPY tailwind.config.js ./

# Copiar todo el frontend (incluye src, public, etc.)
COPY . .

# Instalar dependencias
RUN npm install

# Generar build de producción
RUN npm run build

# Etapa 2: Servidor con Nginx para servir archivos estáticos
FROM nginx:alpine

# Copiar resultado del build al servidor Nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
