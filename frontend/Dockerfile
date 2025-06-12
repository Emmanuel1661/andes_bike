# Etapa 1: Construcción del frontend
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY postcss.config.js ./
COPY tailwind.config.js ./

# Instalar dependencias
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Generar build de producción
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
