/**
 * PM2 — Hostinger VPS ou tout serveur Linux avec Node.
 * Après build : npm ci --omit=dev && npm run build:production && npx prisma generate --schema backend/prisma/schema.prisma
 * Puis : pm2 start ecosystem.config.cjs
 */
module.exports = {
  apps: [
    {
      name: "elyanis-api",
      cwd: __dirname,
      script: "backend/dist/index.js",
      interpreter: "node",
      instances: 1,
      autorestart: true,
      max_memory_restart: "400M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
