# Image finale : Nginx sert uniquement la SPA (dossier dist/).
# L’API Express doit tourner ailleurs (Render Web Service Node, VPS…) ; au build Docker,
# passez VITE_API_URL vers cette API (Build args / secrets Render).
#
# Build sur Debian (glibc) : évite la plupart des échecs `npm ci` liés à Alpine + bcrypt / outils natifs.
FROM node:22-bookworm-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
# postinstall → prisma generate (schéma requis avant npm ci)
COPY backend/prisma ./backend/prisma
RUN npm ci

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
