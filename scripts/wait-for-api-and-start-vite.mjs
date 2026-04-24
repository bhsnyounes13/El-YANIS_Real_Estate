/**
 * Attend que l’API HTTP réponde sur /health, puis lance Vite.
 * Évite les rafales de proxy ECONNREFUSED quand le web démarre avant l’API.
 * `PORT` est lu depuis `.env` (même clé que le backend).
 */
import "dotenv/config";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const waitOn = require("wait-on");

const port = (process.env.PORT ?? "3000").trim() || "3000";
const resource = `http-get://127.0.0.1:${port}/health`;

try {
  await waitOn({
    resources: [resource],
    timeout: 120_000,
    interval: 400,
  });
} catch {
  console.error(`
API injoignable après 120 s (http://127.0.0.1:${port}/health).

• Copiez .env.example vers .env et renseignez DATABASE_URL, JWT_ACCESS_SECRET, FRONTEND_ORIGIN.
• Démarrez PostgreSQL, puis : npm run db:push
• Lisez les logs [api] : variables manquantes ou base injoignable = l’API s’arrête sans écouter le port.
`);
  process.exit(1);
}

const child = spawn("npm", ["run", "dev:web"], {
  stdio: "inherit",
  shell: true,
  cwd: process.cwd(),
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 1);
});
