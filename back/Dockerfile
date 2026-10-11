# ---------- ETAPA 1: construir (esta imagen no se usa, solo compila) ----------
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


# ---------- ETAPA 2: la imagen que realmente se sube a Docker Hub ----------
FROM node:22-alpine

WORKDIR /app

RUN chown -R node:node /app
# Node corre como root en su propia imagen; le bajamos los privilegios.
USER node


COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev && npm cache clean --force


# El código ya compilado viaja de la etapa 1 a la 2. El fuente nunca entra.
COPY --from=build --chown=node:node /app/dist ./dist

CMD ["node", "dist/main"]