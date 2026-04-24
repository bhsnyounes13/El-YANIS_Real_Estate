/**
 * Après `vite build`, préfixe `dist/_redirects` avec un proxy Netlify vers l’API
 * si `NETLIFY_API_PROXY_TARGET` ou `VITE_API_URL` est défini (sans slash final).
 * Ainsi les requêtes relatives `/api/...` atteignent Express sans 404 sur le CDN.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distRedirects = path.join(root, "dist", "_redirects");

const raw =
  process.env.NETLIFY_API_PROXY_TARGET?.trim() ||
  process.env.VITE_API_URL?.trim() ||
  "";
const origin = raw.replace(/\/$/, "");

if (!origin) {
  process.exit(0);
}

if (!fs.existsSync(distRedirects)) {
  console.warn("write-netlify-dist-redirects: dist/_redirects absent, skip");
  process.exit(0);
}

const apiRule = `/api/*  ${origin}/api/:splat  200!\n`;
let body = fs.readFileSync(distRedirects, "utf8");
const lines = body.split(/\n/);
const filtered = lines.filter((line) => {
  const t = line.trim();
  return t && !t.startsWith("/api/*");
});
const out = apiRule + filtered.join("\n").replace(/\n+$/, "") + "\n";
fs.writeFileSync(distRedirects, out, "utf8");
