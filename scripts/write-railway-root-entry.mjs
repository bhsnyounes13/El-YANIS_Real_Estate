/**
 * Génère `dist/index.js` à la racine du dépôt pour les déploiements qui exécutent
 * `node dist/index.js` au lieu de `node backend/dist/index.js` / `npm start`.
 *
 * Le build front (Vite) écrit déjà dans `dist/` (HTML, assets) ; ce fichier s’y ajoute
 * et réexporte l’API compilée. Préférez `npm start` (migrations + même bundle API).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "dist");
const outFile = join(outDir, "index.js");
mkdirSync(outDir, { recursive: true });
writeFileSync(
  outFile,
  `// Généré par scripts/write-railway-root-entry.mjs — ne pas éditer.
// L’API est dans ../backend/dist/index.js. Pour migrations au démarrage, utilisez npm start.
import "../backend/dist/index.js";
`,
  "utf8",
);
console.log("[write-railway-root-entry] Wrote " + outFile);
