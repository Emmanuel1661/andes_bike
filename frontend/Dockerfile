# Etapa 1: Construcción
FROM node:18-alpine AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar dependencias primero
COPY package*.json ./
COPY vite.config.* ./
COPY postcss.config.js ./
COPY tailwind.config.js ./

# Instalar dependencias
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Compilar el frontend con Vite
RUN npm run build

# Etapa 2: Servir los archivos con Nginx
FROM nginx:alpine
RUN ls -la /app/dist
COPY --from=build /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
