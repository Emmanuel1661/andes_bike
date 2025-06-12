# Etapa 1: Construcción del frontend
FROM node:18-alpine AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos necesarios para instalar dependencias
COPY package*.json ./
COPY vite.config.js ./
COPY postcss.config.js ./
COPY tailwind.config.js ./

# Copiar el resto del proyecto
COPY . .

# Instalar dependencias
RUN npm install

# Generar build de producción
RUN npm run build

# Etapa 2: Servidor con NGINX para servir archivos estáticos
FROM nginx:alpine

# Copiar el resultado del build al directorio público de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Puerto expuesto por Nginx
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
