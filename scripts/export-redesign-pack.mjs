/**
 * Génère EXPORT_CLAUDE_REDESIGN.md — un seul fichier à joindre à Claude pour un redesign.
 * Usage: node scripts/export-redesign-pack.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const sections = [
  { path: "package.json", label: "package.json" },
  { path: "components.json", label: "components.json (shadcn)" },
  { path: "index.html", label: "index.html" },
  { path: "src/main.tsx", label: "src/main.tsx" },
  { path: "src/App.tsx", label: "src/App.tsx" },
  { path: "src/styles.css", label: "src/styles.css (design system Tailwind v4)" },
  { path: "src/index.css", label: "src/index.css (couches + composants premium)" },
  { path: "src/layouts/WebLayout.tsx", label: "src/layouts/WebLayout.tsx" },
  { path: "src/theme/ThemeContext.tsx", label: "src/theme/ThemeContext.tsx" },
  { path: "src/components/Navbar.tsx", label: "src/components/Navbar.tsx" },
  { path: "src/components/Footer.tsx", label: "src/components/Footer.tsx" },
  { path: "src/pages/Index.tsx", label: "src/pages/Index.tsx" },
  { path: "src/pages/Listings.tsx", label: "src/pages/Listings.tsx" },
  { path: "src/pages/PropertyDetail.tsx", label: "src/pages/PropertyDetail.tsx" },
  { path: "src/pages/Services.tsx", label: "src/pages/Services.tsx" },
  { path: "src/pages/Agents.tsx", label: "src/pages/Agents.tsx" },
  { path: "src/pages/About.tsx", label: "src/pages/About.tsx" },
  { path: "src/pages/Contact.tsx", label: "src/pages/Contact.tsx" },
  { path: "src/pages/NotFound.tsx", label: "src/pages/NotFound.tsx" },
];

function fence(lang, body) {
  return "```" + lang + "\n" + body.replace(/\r\n/g, "\n").trimEnd() + "\n```\n\n";
}

let md = `# EL-YANIS — Pack export pour redesign (Claude / assistant)

Ce fichier est **auto-généré** par \`node scripts/export-redesign-pack.mjs\`. Regénérez-le après des changements importants dans le code.

## Comment l’utiliser

1. Joignez ce fichier (ou collez son contenu) dans votre conversation Claude.
2. Précisez votre objectif (ex. « refonte visuelle », « nouvelle palette », « mobile-first »).
3. Les composants UI shadcn vivent sous \`src/components/ui/\` — non inclus ici pour limiter la taille ; mentionnez-les si vous modifiez les primitives.

---

## Contexte projet

| Élément | Détail |
|--------|--------|
| Stack | React 19, Vite 7, TypeScript, Tailwind CSS v4 (\`@tailwindcss/vite\`), React Router 7 |
| UI | shadcn/ui (style « new-york »), Radix, Lucide, \`class-variance-authority\`, \`tailwind-merge\` |
| Données | API REST (\`/api/...\`) ; fixtures tests \`src/test/fixtures/demoCatalog.ts\` |
| i18n | \`src/i18n/\` — FR / EN / AR (RTL) |
| Thème | Classe \`.dark\` sur \`<html>\`, variables dans \`styles.css\` + \`index.css\` |

### Routes (\`src/App.tsx\`)

| Chemin | Page |
|--------|------|
| \`/\` | Accueil |
| \`/listings\` | Annonces + filtres (query params) |
| \`/property/:id\` | Détail bien |
| \`/services\` | Services |
| \`/agents\` | Agents |
| \`/about\` | À propos |
| \`/contact\` | Contact |
| \`*\` | 404 |

### Identité visuelle actuelle (résumé)

- **Polices** : Playfair Display (titres), Manrope / Inter (corps) — voir \`index.css\` et Google Fonts.
- **Accents** : or (\`--gold\`), marine (\`--navy\`), bleu primaire, glassmorphism (\`.glass-effect\`), cartes « premium » (\`.premium-card\`).

---

`;

for (const s of sections) {
  const abs = path.join(root, s.path);
  if (!fs.existsSync(abs)) {
    md += `## ${s.label}\n\n_(fichier manquant : ${s.path})_\n\n`;
    continue;
  }
  const ext = path.extname(s.path);
  const lang =
    ext === ".tsx"
      ? "tsx"
      : ext === ".css"
        ? "css"
        : ext === ".json"
          ? "json"
          : ext === ".html"
            ? "html"
            : "";
  const body = fs.readFileSync(abs, "utf8");
  md += `## ${s.label}\n\n` + fence(lang, body);
}

md += `---

## Fichiers non inclus (à mentionner si besoin)

- \`src/components/ui/*\` — primitives shadcn (Button, Input, Card, …)
- \`src/components/PropertyCard.tsx\`, autres composants métier
- \`src/i18n/*\` — chaînes et contexte langue
- \`src/test/fixtures/demoCatalog.ts\` (données de test Vitest uniquement)
- \`vite.config.ts\`, \`tsconfig.json\`

---

*Fin du pack — ${new Date().toISOString().slice(0, 10)}*
`;

const outPath = path.join(root, "EXPORT_CLAUDE_REDESIGN.md");
fs.writeFileSync(outPath, md, "utf8");
console.log("Écrit:", outPath, `(${(Buffer.byteLength(md, "utf8") / 1024).toFixed(1)} Ko)`);
