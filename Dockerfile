# Image finale : Nginx sert uniquement la SPA (dist/). L’API = autre service.
# Au build Docker : définir VITE_API_URL (et Turnstile si besoin) côté Render.
#
# `npm ci --ignore-scripts` : évite postinstall `prisma generate` (inutile pour Vite, schéma absent à cette étape).
# Puis script d’installation d’esbuild (binaire requis pour `vite build`).
FROM node:22-bookworm-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts \
 && node node_modules/esbuild/install.js

COPY . .

ARG VITE_API_URL
ARG VITE_BASE_PATH
ARG VITE_TURNSTILE_SITE_KEY
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_BASE_PATH=$VITE_BASE_PATH
ENV VITE_TURNSTILE_SITE_KEY=$VITE_TURNSTILE_SITE_KEY

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/nginx-security-headers.conf /etc/nginx/snippets/elyanis-security-headers.conf
COPY docker/nginx-default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
