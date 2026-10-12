FROM node:22-alpine AS build
WORKDIR /app
ARG API_URL=http://back:3000

ENV API_URL=$API_URL

COPY package*.json ./
RUN npm ci

COPY . .

# Acá va la magia: le cambiamos la línea de la URL en el código fuente
# ANTES de compilar, así el bundle sale con la URL correcta.
RUN sed -i "s|^export const API_URL = .*|export const API_URL = '${API_URL}';|" \
        src/app/config/api.ts \
 && grep API_URL src/app/config/api.ts \
 && npm run build


 #------ ETAPA 2
 FROM nginx:alpine

# El build de Angular deja los archivos estáticos en dist/front/browser.
COPY --from=build /app/dist/front/browser /usr/share/nginx/html

# Reemplazamos la config de nginx por la nuestra (que está en el contexto).
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 
CMD ["nginx", "-g", "daemon off;"]