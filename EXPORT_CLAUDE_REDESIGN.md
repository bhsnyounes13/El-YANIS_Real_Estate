# EL-YANIS — Pack export pour redesign (Claude / assistant)

Ce fichier est **auto-généré** par `node scripts/export-redesign-pack.mjs`. Regénérez-le après des changements importants dans le code.

## Comment l’utiliser

1. Joignez ce fichier (ou collez son contenu) dans votre conversation Claude.
2. Précisez votre objectif (ex. « refonte visuelle », « nouvelle palette », « mobile-first »).
3. Les composants UI shadcn vivent sous `src/components/ui/` — non inclus ici pour limiter la taille ; mentionnez-les si vous modifiez les primitives.

---

## Contexte projet

| Élément | Détail                                                                                      |
| ------- | ------------------------------------------------------------------------------------------- |
| Stack   | React 19, Vite 7, TypeScript, Tailwind CSS v4 (`@tailwindcss/vite`), React Router 7         |
| UI      | shadcn/ui (style « new-york »), Radix, Lucide, `class-variance-authority`, `tailwind-merge` |
| Données | Mock `src/data/mockData` (propriétés)                                                       |
| i18n    | `src/i18n/` — FR / EN / AR (RTL)                                                            |
| Thème   | Classe `.dark` sur `<html>`, variables dans `styles.css` + `index.css`                      |

### Routes (`src/App.tsx`)

| Chemin          | Page                              |
| --------------- | --------------------------------- |
| `/`             | Accueil                           |
| `/listings`     | Annonces + filtres (query params) |
| `/property/:id` | Détail bien                       |
| `/services`     | Services                          |
| `/agents`       | Agents                            |
| `/about`        | À propos                          |
| `/contact`      | Contact                           |
| `*`             | 404                               |

### Identité visuelle actuelle (résumé)

- **Polices** : Playfair Display (titres), Manrope / Inter (corps) — voir `index.css` et Google Fonts.
- **Accents** : or (`--gold`), marine (`--navy`), bleu primaire, glassmorphism (`.glass-effect`), cartes « premium » (`.premium-card`).

---

## package.json

```json
{
  "name": "elyanis-real-estate",
  "private": true,
  "sideEffects": false,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "preview": "vite preview",
    "lint": "eslint .",
    "format": "prettier --write .",
    "test": "vitest run"
  },
  "dependencies": {
    "@hookform/resolvers": "^5.2.2",
    "@radix-ui/react-accordion": "^1.2.12",
    "@radix-ui/react-alert-dialog": "^1.1.15",
    "@radix-ui/react-aspect-ratio": "^1.1.8",
    "@radix-ui/react-avatar": "^1.1.11",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-collapsible": "^1.1.12",
    "@radix-ui/react-context-menu": "^2.2.16",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-hover-card": "^1.1.15",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-menubar": "^1.1.16",
    "@radix-ui/react-navigation-menu": "^1.2.14",
    "@radix-ui/react-popover": "^1.1.15",
    "@radix-ui/react-progress": "^1.1.8",
    "@radix-ui/react-radio-group": "^1.3.8",
    "@radix-ui/react-scroll-area": "^1.2.10",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-separator": "^1.1.8",
    "@radix-ui/react-slider": "^1.3.6",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-switch": "^1.2.6",
    "@radix-ui/react-tabs": "^1.1.13",
    "@radix-ui/react-toast": "^1.2.15",
    "@radix-ui/react-toggle": "^1.1.10",
    "@radix-ui/react-toggle-group": "^1.1.11",
    "@radix-ui/react-tooltip": "^1.2.8",
    "@tailwindcss/vite": "^4.2.1",
    "@tanstack/react-query": "^5.83.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^4.1.0",
    "embla-carousel-react": "^8.6.0",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.575.0",
    "react": "^19.2.0",
    "react-day-picker": "^9.14.0",
    "react-dom": "^19.2.0",
    "react-hook-form": "^7.71.2",
    "react-resizable-panels": "^4.6.5",
    "react-router-dom": "^7.6.0",
    "recharts": "^2.15.4",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.5.0",
    "tailwindcss": "^4.2.1",
    "tw-animate-css": "^1.3.4",
    "vaul": "^1.1.2",
    "vite-tsconfig-paths": "^6.0.2",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@eslint/js": "^9.32.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@types/node": "^22.16.5",
    "@types/react": "^19.2.0",
    "@types/react-dom": "^19.2.0",
    "@vitejs/plugin-react": "^5.0.4",
    "eslint": "^9.32.0",
    "eslint-config-prettier": "^10.1.1",
    "eslint-plugin-prettier": "^5.2.6",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "globals": "^15.15.0",
    "jsdom": "^26.0.0",
    "prettier": "^3.7.3",
    "typescript": "^5.8.3",
    "typescript-eslint": "^8.56.1",
    "vite": "^7.3.1",
    "vitest": "^3.2.4"
  }
}
```

## components.json (shadcn)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "css": "src/styles.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registries": {}
}
```

## index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>EL-YANIS Real Estate | Premium Properties in Algeria</title>
    <meta
      name="description"
      content="Find premium real estate properties in Tlemcen, Ain Temouchent & Sidi Bel Abbès. EL-YANIS - Your trusted partner for luxury properties in western Algeria."
    />
    <meta name="author" content="EL-YANIS Real Estate" />
    <meta property="og:title" content="EL-YANIS Real Estate | Premium Properties in Algeria" />
    <meta
      property="og:description"
      content="Find premium real estate properties in Tlemcen, Ain Temouchent & Sidi Bel Abbès."
    />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="/placeholder.svg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@elyainis" />
    <meta name="twitter:image" content="/placeholder.svg" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## src/main.tsx

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

## src/App.tsx

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { ThemeProvider } from "@/theme/ThemeContext";
import WebLayout from "@/layouts/WebLayout";
import Index from "./pages/Index";
import Listings from "./pages/Listings";
import PropertyDetail from "./pages/PropertyDetail";
import Services from "./pages/Services";
import Agents from "./pages/Agents";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<WebLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/listings" element={<Listings />} />
                <Route path="/property/:id" element={<PropertyDetail />} />
                <Route path="/services" element={<Services />} />
                <Route path="/agents" element={<Agents />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
```

## src/styles.css (design system Tailwind v4)

```css
@import "tailwindcss" source(none);
@source "../src";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

/*
 * Design system definition.
 *
 * The @theme inline block maps CSS custom properties to Tailwind utility
 * classes (e.g. --color-primary -> bg-primary, text-primary).
 *
 * The :root and .dark blocks define the actual color values using oklch.
 * All colors MUST use oklch format.
 *
 * To add a new semantic color:
 * 1. Add the variable to :root (light value) and .dark (dark value)
 * 2. Register it in @theme inline as --color-<name>: var(--<name>)
 */

@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --radius-3xl: calc(var(--radius) + 12px);
  --radius-4xl: calc(var(--radius) + 16px);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-ring-offset-background: var(--background);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  --font-heading: "Playfair Display", "Manrope", ui-serif, Georgia, serif;
  --font-display: "Manrope", "Inter", ui-sans-serif, system-ui, sans-serif;
  --color-gold: hsl(var(--gold) / <alpha-value>);
  --color-gold-light: hsl(var(--gold-light) / <alpha-value>);
  --color-navy: hsl(var(--navy) / <alpha-value>);
  --color-navy-light: hsl(var(--navy-light) / <alpha-value>);
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.129 0.042 264.695);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.129 0.042 264.695);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.129 0.042 264.695);
  --primary: oklch(0.208 0.042 265.755);
  --primary-foreground: oklch(0.984 0.003 247.858);
  --secondary: oklch(0.968 0.007 247.896);
  --secondary-foreground: oklch(0.208 0.042 265.755);
  --muted: oklch(0.968 0.007 247.896);
  --muted-foreground: oklch(0.554 0.046 257.417);
  --accent: oklch(0.968 0.007 247.896);
  --accent-foreground: oklch(0.208 0.042 265.755);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.984 0.003 247.858);
  --border: oklch(0.929 0.013 255.508);
  --input: oklch(0.929 0.013 255.508);
  --ring: oklch(0.704 0.04 256.788);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.984 0.003 247.858);
  --sidebar-foreground: oklch(0.129 0.042 264.695);
  --sidebar-primary: oklch(0.208 0.042 265.755);
  --sidebar-primary-foreground: oklch(0.984 0.003 247.858);
  --sidebar-accent: oklch(0.968 0.007 247.896);
  --sidebar-accent-foreground: oklch(0.208 0.042 265.755);
  --sidebar-border: oklch(0.929 0.013 255.508);
  --sidebar-ring: oklch(0.704 0.04 256.788);
  --gold: 38 92% 60%;
  --gold-light: 38 92% 75%;
  --navy: 222 47% 8%;
  --navy-light: 222 30% 20%;
}

.dark {
  --background: oklch(0.129 0.042 264.695);
  --foreground: oklch(0.984 0.003 247.858);
  --card: oklch(0.208 0.042 265.755);
  --card-foreground: oklch(0.984 0.003 247.858);
  --popover: oklch(0.208 0.042 265.755);
  --popover-foreground: oklch(0.984 0.003 247.858);
  --primary: oklch(0.929 0.013 255.508);
  --primary-foreground: oklch(0.208 0.042 265.755);
  --secondary: oklch(0.279 0.041 260.031);
  --secondary-foreground: oklch(0.984 0.003 247.858);
  --muted: oklch(0.279 0.041 260.031);
  --muted-foreground: oklch(0.704 0.04 256.788);
  --accent: oklch(0.279 0.041 260.031);
  --accent-foreground: oklch(0.984 0.003 247.858);
  --destructive: oklch(0.704 0.191 22.216);
  --destructive-foreground: oklch(0.984 0.003 247.858);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.551 0.027 264.364);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.208 0.042 265.755);
  --sidebar-foreground: oklch(0.984 0.003 247.858);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.984 0.003 247.858);
  --sidebar-accent: oklch(0.279 0.041 260.031);
  --sidebar-accent-foreground: oklch(0.984 0.003 247.858);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.551 0.027 264.364);
  --gold: 38 92% 55%;
  --gold-light: 38 80% 40%;
  --navy: 220 20% 95%;
  --navy-light: 220 15% 80%;
}

@layer base {
  * {
    border-color: var(--color-border);
  }

  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
  }
}
```

## src/index.css (couches + composants premium)

```css
@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap");

@reference "./styles.css";

@layer base {
  :root {
    --background: 220 20% 97%;
    --foreground: 222 47% 8%;

    --card: 0 0% 100%;
    --card-foreground: 222 47% 8%;

    --popover: 0 0% 100%;
    --popover-foreground: 222 47% 8%;

    --primary: 217 91% 60%;
    --primary-foreground: 0 0% 100%;

    --secondary: 220 25% 94%;
    --secondary-foreground: 222 47% 8%;

    --muted: 220 20% 95%;
    --muted-foreground: 220 10% 46%;

    --accent: 38 92% 60%;
    --accent-foreground: 38 92% 15%;

    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;

    --border: 220 20% 92%;
    --input: 220 20% 90%;
    --ring: 217 91% 60%;

    --radius: 1rem;

    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-primary: 217 91% 60%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 210 40% 96%;
    --sidebar-accent-foreground: 220 30% 10%;
    --sidebar-border: 220 13% 91%;
    --sidebar-ring: 217 91% 60%;

    /* Premium tokens */
    --gold: 38 92% 60%;
    --gold-light: 38 92% 75%;
    --navy: 222 47% 8%;
    --navy-light: 222 30% 20%;
  }

  .dark {
    --background: 222 47% 5%;
    --foreground: 220 20% 95%;

    --card: 222 40% 8%;
    --card-foreground: 220 20% 95%;

    --popover: 222 40% 8%;
    --popover-foreground: 220 20% 95%;

    --primary: 217 91% 60%;
    --primary-foreground: 0 0% 100%;

    --secondary: 222 30% 14%;
    --secondary-foreground: 220 20% 95%;

    --muted: 222 30% 14%;
    --muted-foreground: 220 15% 60%;

    --accent: 38 92% 55%;
    --accent-foreground: 0 0% 100%;

    --destructive: 0 63% 31%;
    --destructive-foreground: 210 40% 98%;

    --border: 222 30% 14%;
    --input: 222 30% 16%;
    --ring: 217 91% 60%;

    --sidebar-background: 222 47% 6%;
    --sidebar-foreground: 210 40% 98%;
    --sidebar-primary: 217 91% 60%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 217 33% 17%;
    --sidebar-accent-foreground: 210 40% 98%;
    --sidebar-border: 217 33% 17%;
    --sidebar-ring: 217 91% 60%;

    --gold: 38 92% 55%;
    --gold-light: 38 80% 40%;
    --navy: 220 20% 95%;
    --navy-light: 220 15% 80%;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground font-sans antialiased;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: "Playfair Display", "Manrope", serif;
    letter-spacing: -0.025em;
  }

  [dir="rtl"] h1,
  [dir="rtl"] h2,
  [dir="rtl"] h3,
  [dir="rtl"] h4,
  [dir="rtl"] h5,
  [dir="rtl"] h6 {
    font-family: "Manrope", sans-serif;
  }
}

@layer components {
  /* Premium gradient text */
  .text-gradient {
    @apply bg-clip-text text-transparent;
    background-image: linear-gradient(135deg, hsl(var(--primary)), hsl(217 91% 45%));
  }

  .text-gradient-gold {
    @apply bg-clip-text text-transparent;
    background-image: linear-gradient(135deg, hsl(var(--gold)), hsl(28 85% 50%));
  }

  /* Glassmorphism */
  .glass-effect {
    background: hsla(var(--card) / 0.65);
    backdrop-filter: blur(20px) saturate(1.8);
    -webkit-backdrop-filter: blur(20px) saturate(1.8);
    border: 1px solid hsla(var(--border) / 0.5);
  }

  .glass-effect-strong {
    background: hsla(var(--card) / 0.85);
    backdrop-filter: blur(32px) saturate(2);
    -webkit-backdrop-filter: blur(32px) saturate(2);
    border: 1px solid hsla(var(--border) / 0.6);
  }

  /* Hover effects */
  .hover-lift {
    @apply transition-all duration-500 ease-out;
  }
  .hover-lift:hover {
    transform: translateY(-6px);
    box-shadow:
      0 20px 60px -10px hsla(var(--primary) / 0.15),
      0 8px 20px -4px hsla(0 0% 0% / 0.08);
  }

  .hover-glow {
    @apply transition-all duration-500;
  }
  .hover-glow:hover {
    box-shadow:
      0 0 30px 0 hsla(var(--primary) / 0.2),
      0 0 60px 0 hsla(var(--primary) / 0.1);
  }

  /* Premium gradient CTA */
  .gradient-cta {
    background: linear-gradient(135deg, hsl(var(--primary)), hsl(217 91% 45%));
    @apply text-primary-foreground shadow-lg;
    box-shadow: 0 4px 20px -2px hsla(var(--primary) / 0.4);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .gradient-cta:hover {
    background: linear-gradient(135deg, hsl(217 91% 45%), hsl(var(--primary)));
    box-shadow: 0 8px 30px -2px hsla(var(--primary) / 0.5);
    transform: translateY(-1px);
  }

  .gradient-cta-gold {
    background: linear-gradient(135deg, hsl(var(--gold)), hsl(28 85% 50%));
    @apply shadow-lg;
    color: hsl(var(--navy));
    font-weight: 600;
    box-shadow: 0 4px 20px -2px hsla(var(--gold) / 0.4);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .gradient-cta-gold:hover {
    box-shadow: 0 8px 30px -2px hsla(var(--gold) / 0.5);
    transform: translateY(-1px);
  }

  /* Premium card */
  .premium-card {
    @apply rounded-2xl bg-card overflow-hidden;
    border: 1px solid hsla(var(--border) / 0.5);
    box-shadow:
      0 1px 3px hsla(0 0% 0% / 0.04),
      0 4px 12px hsla(0 0% 0% / 0.03);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .premium-card:hover {
    border-color: hsla(var(--primary) / 0.2);
    box-shadow:
      0 20px 60px -10px hsla(var(--primary) / 0.12),
      0 8px 24px -4px hsla(0 0% 0% / 0.06);
    transform: translateY(-4px);
  }

  /* Shimmer loading */
  .shimmer {
    background: linear-gradient(
      90deg,
      hsla(var(--muted) / 0.5) 0%,
      hsla(var(--muted) / 0.8) 50%,
      hsla(var(--muted) / 0.5) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  /* Decorative line */
  .gold-line {
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, hsl(var(--gold)), hsl(var(--gold-light)));
    border-radius: 2px;
  }

  /* Section divider */
  .section-divider {
    @apply relative;
  }
  .section-divider::before {
    content: "";
    @apply absolute left-1/2 -translate-x-1/2 w-24 h-px;
    background: linear-gradient(90deg, transparent, hsl(var(--gold)), transparent);
    top: 0;
  }

  /* Floating badge */
  .premium-badge {
    @apply inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase;
    background: linear-gradient(135deg, hsl(var(--primary)), hsl(217 91% 45%));
    color: hsl(var(--primary-foreground));
    box-shadow: 0 2px 10px hsla(var(--primary) / 0.3);
  }

  .rent-badge {
    @apply inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase;
    background: linear-gradient(135deg, hsl(var(--gold)), hsl(28 85% 50%));
    color: hsl(var(--navy));
    box-shadow: 0 2px 10px hsla(var(--gold) / 0.3);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
```

## src/layouts/WebLayout.tsx

```tsx
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const WebLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default WebLayout;
```

## src/theme/ThemeContext.tsx

```tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("el-yanis-theme");
    return (saved as Theme) || "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("el-yanis-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};
```

## src/components/Navbar.tsx

```tsx
import { useState } from "react";
import logo from "@/assets/logo.jpg";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { key: "nav.home", path: "/" },
  { key: "nav.listings", path: "/listings" },
  { key: "nav.services", path: "/services" },
  { key: "nav.agents", path: "/agents" },
  { key: "nav.about", path: "/about" },
  { key: "nav.contact", path: "/contact" },
];

const Navbar = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-effect-strong shadow-sm">
      <div className="container flex min-h-16 items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="EL-YANIS" className="h-9 w-9 rounded-lg object-cover" />
          <span className="font-heading text-xl font-bold text-foreground tracking-tight">
            EL-YANIS
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "relative rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-300",
                location.pathname === link.path
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t(link.key)}
              {location.pathname === link.path && (
                <span className="absolute bottom-0.5 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-primary" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="animate-fade-in border-t bg-card p-4 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-300",
                  location.pathname === link.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {t(link.key)}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
```

## src/components/Footer.tsx

```tsx
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import logo from "@/assets/logo.jpg";

const Footer = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="relative overflow-hidden border-t bg-card">
      {/* Subtle gradient accent at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="container py-16">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <img src={logo} alt="EL-YANIS" className="h-9 w-9 rounded-lg object-cover" />
              <span className="font-heading text-xl font-bold text-card-foreground">
                {t("footer.brand")}
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
              {t("footer.desc")}
            </p>
            <div className="mt-5 gold-line" />
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gold font-display">
              {t("footer.links")}
            </h4>
            <nav className="mt-4 flex flex-col gap-2.5">
              {[
                { key: "nav.home", path: "/" },
                { key: "nav.listings", path: "/listings" },
                { key: "nav.about", path: "/about" },
                { key: "nav.contact", path: "/contact" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t(link.key)}
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gold font-display">
              {t("footer.contactTitle")}
            </h4>
            <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
              <a
                href="tel:+213555123456"
                className="flex items-center gap-2.5 transition-colors hover:text-foreground"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                </div>
                +213 555 123 456
              </a>
              <a
                href="mailto:contact@elyainis.com"
                className="flex items-center gap-2.5 transition-colors hover:text-foreground"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                </div>
                contact@elyainis.com
              </a>
              <span className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                </div>
                Tlemcen, {language === "ar" ? "الجزائر" : language === "fr" ? "Algérie" : "Algeria"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-3 border-t border-border/50 pt-8 md:flex-row md:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} EL-YANIS. {t("footer.rights")}
          </p>
          <p className="text-xs text-muted-foreground/50">
            {language === "fr"
              ? "Conçu avec excellence"
              : language === "ar"
                ? "صُمم بتميز"
                : "Crafted with excellence"}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

## src/pages/Index.tsx

```tsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { properties } from "@/data/mockData";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Building2,
  Users,
  ShieldCheck,
  ArrowRight,
  Star,
  TrendingUp,
  MapPin,
} from "lucide-react";

const Index = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("");
  const [city, setCity] = useState("");

  const featured = properties.slice(0, 6);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (keyword) params.set("q", keyword);
    if (type) params.set("type", type);
    if (city) params.set("city", city);
    navigate(`/listings?${params.toString()}`);
  };

  const features = [
    { icon: Building2, titleKey: "features.premium.title", descKey: "features.premium.desc" },
    { icon: Users, titleKey: "features.agents.title", descKey: "features.agents.desc" },
    { icon: ShieldCheck, titleKey: "features.trusted.title", descKey: "features.trusted.desc" },
  ];

  const stats = [
    {
      value: "500+",
      label: language === "fr" ? "Propriétés" : language === "ar" ? "عقار" : "Properties",
      icon: Building2,
    },
    {
      value: "200+",
      label:
        language === "fr"
          ? "Clients Satisfaits"
          : language === "ar"
            ? "عميل راضٍ"
            : "Happy Clients",
      icon: Star,
    },
    {
      value: "15+",
      label:
        language === "fr"
          ? "Années d'Expérience"
          : language === "ar"
            ? "سنة خبرة"
            : "Years Experience",
      icon: TrendingUp,
    },
    {
      value: "3",
      label: language === "fr" ? "Villes" : language === "ar" ? "مدن" : "Cities",
      icon: MapPin,
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Layered gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-foreground via-navy-light to-foreground dark:from-background dark:via-navy-light/20 dark:to-background" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        {/* Ambient glow orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-[120px] animate-pulse-soft" />
        <div
          className="absolute bottom-10 right-1/4 w-72 h-72 rounded-full bg-gold/15 blur-[100px] animate-pulse-soft"
          style={{ animationDelay: "1.5s" }}
        />

        <div className="container relative z-10 py-28 md:py-40">
          {/* Eyebrow */}
          <div className="flex justify-center mb-6 animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold">
              <Star className="h-3 w-3 fill-current" />
              {language === "fr"
                ? "Immobilier Premium"
                : language === "ar"
                  ? "عقارات فاخرة"
                  : "Premium Real Estate"}
            </span>
          </div>

          <h1
            className="mx-auto max-w-4xl text-center font-heading text-4xl font-bold tracking-tight text-primary-foreground md:text-6xl lg:text-7xl animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            {t("hero.title")}
          </h1>

          <p
            className="mx-auto mt-6 max-w-2xl text-center text-lg text-primary-foreground/70 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            {t("hero.subtitle")}
          </p>

          {/* Gold accent line */}
          <div
            className="flex justify-center mt-8 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="gold-line" />
          </div>

          {/* Premium Search Bar */}
          <div
            className="mx-auto mt-10 max-w-3xl animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="glass-effect-strong rounded-2xl p-2 shadow-2xl">
              <div className="flex flex-col gap-2 md:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("hero.search")}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="h-12 border-none bg-transparent pl-11 text-base shadow-none focus-visible:ring-0"
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="h-12 rounded-xl bg-muted/50 px-4 text-sm text-foreground outline-none transition-colors hover:bg-muted"
                  >
                    <option value="">{t("type.all")}</option>
                    <option value="sale">{t("type.sale")}</option>
                    <option value="rent">{t("type.rent")}</option>
                  </select>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="h-12 rounded-xl bg-muted/50 px-4 text-sm text-foreground outline-none transition-colors hover:bg-muted"
                  >
                    <option value="">{t("city.all")}</option>
                    <option value="tlemcen">{t("city.tlemcen")}</option>
                    <option value="ainTemouchent">{t("city.ainTemouchent")}</option>
                    <option value="sidiBelAbbes">{t("city.sidiBelAbbes")}</option>
                  </select>
                  <Button
                    onClick={handleSearch}
                    className="h-12 rounded-xl gradient-cta px-6 text-base"
                  >
                    <Search className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">{t("hero.searchBtn")}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div
            className="mx-auto mt-16 max-w-3xl animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div
                    className="text-3xl font-bold text-primary-foreground font-display md:text-4xl animate-count-up"
                    style={{ animationDelay: `${0.7 + i * 0.1}s` }}
                  >
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-widest text-primary-foreground/50 font-display">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20 md:py-28">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold font-display">
            {language === "fr"
              ? "Pourquoi Nous Choisir"
              : language === "ar"
                ? "لماذا تختارنا"
                : "Why Choose Us"}
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-4xl">
            {language === "fr"
              ? "L'Excellence Immobilière"
              : language === "ar"
                ? "التميز العقاري"
                : "Real Estate Excellence"}
          </h2>
          <div className="mx-auto mt-4 gold-line" />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f, i) => (
            <div key={i} className="premium-card p-8 text-center group">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-all duration-500 group-hover:bg-primary/20 group-hover:scale-110">
                <f.icon className="h-8 w-8 text-primary transition-transform duration-500 group-hover:scale-110" />
              </div>
              <h3 className="mt-6 font-heading text-xl font-semibold text-card-foreground">
                {t(f.titleKey)}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t(f.descKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="relative overflow-hidden pb-24 md:pb-32">
        {/* Subtle background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />

        <div className="container relative z-10">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-gold font-display">
                {language === "fr"
                  ? "Collection Exclusive"
                  : language === "ar"
                    ? "مجموعة حصرية"
                    : "Exclusive Collection"}
              </span>
              <h2 className="mt-2 font-heading text-3xl font-bold text-foreground md:text-4xl">
                {t("home.featured")}
              </h2>
            </div>
            <Button
              asChild
              variant="outline"
              className="group rounded-full border-primary/20 hover:border-primary/40"
            >
              <Link to="/listings" className="flex items-center gap-2">
                {t("home.viewAll")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <div className="mx-auto mt-4 gold-line md:mx-0" />

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <div
                key={p.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <PropertyCard property={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-foreground via-navy-light to-foreground dark:from-card dark:via-navy-light/30 dark:to-card" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="container relative z-10 py-20 text-center">
          <h2 className="font-heading text-3xl font-bold text-primary-foreground md:text-4xl">
            {language === "fr"
              ? "Prêt à Trouver Votre Maison de Rêve ?"
              : language === "ar"
                ? "هل أنت مستعد للعثور على منزل أحلامك؟"
                : "Ready to Find Your Dream Home?"}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/70">
            {language === "fr"
              ? "Contactez nos experts dès aujourd'hui"
              : language === "ar"
                ? "تواصل مع خبرائنا اليوم"
                : "Get in touch with our experts today"}
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="gradient-cta-gold rounded-full px-8 text-base">
              <Link to="/contact">{t("nav.contact")}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 px-8 text-base"
            >
              <Link to="/listings">{t("nav.listings")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
```

## src/pages/Listings.tsx

```tsx
import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { properties } from "@/data/mockData";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, X, Building2 } from "lucide-react";

const Listings = () => {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const [keyword, setKeyword] = useState(searchParams.get("q") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (type && p.type !== type) return false;
      if (city && p.city !== city) return false;
      if (minPrice && p.price < Number(minPrice)) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;
      if (bedrooms && p.bedrooms < Number(bedrooms)) return false;
      if (bathrooms && p.bathrooms < Number(bathrooms)) return false;
      if (keyword) {
        const q = keyword.toLowerCase();
        const searchable =
          `${p.title_en} ${p.title_fr} ${p.title_ar} ${p.description_en}`.toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      return true;
    });
  }, [keyword, type, city, minPrice, maxPrice, bedrooms, bathrooms]);

  const clearFilters = () => {
    setKeyword("");
    setType("");
    setCity("");
    setMinPrice("");
    setMaxPrice("");
    setBedrooms("");
    setBathrooms("");
  };

  const selectClass =
    "h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30";

  const FilterPanel = () => (
    <div className="space-y-5">
      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("hero.search")}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="h-11 rounded-xl pl-10"
        />
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-display">
          {t("type.all")}
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={selectClass + " mt-1.5"}
        >
          <option value="">{t("type.all")}</option>
          <option value="sale">{t("type.sale")}</option>
          <option value="rent">{t("type.rent")}</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-display">
          {t("city.all")}
        </label>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={selectClass + " mt-1.5"}
        >
          <option value="">{t("city.all")}</option>
          <option value="tlemcen">{t("city.tlemcen")}</option>
          <option value="ainTemouchent">{t("city.ainTemouchent")}</option>
          <option value="sidiBelAbbes">{t("city.sidiBelAbbes")}</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-display">
          {t("listings.price")}
        </label>
        <div className="mt-1.5 flex gap-2">
          <Input
            placeholder={t("listings.priceMin")}
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="h-11 rounded-xl"
          />
          <Input
            placeholder={t("listings.priceMax")}
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="h-11 rounded-xl"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-display">
          {t("listings.bedrooms")}
        </label>
        <select
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          className={selectClass + " mt-1.5"}
        >
          <option value="">{t("listings.any")}</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-display">
          {t("listings.bathrooms")}
        </label>
        <select
          value={bathrooms}
          onChange={(e) => setBathrooms(e.target.value)}
          className={selectClass + " mt-1.5"}
        >
          <option value="">{t("listings.any")}</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
        </select>
      </div>

      <Button variant="outline" className="w-full rounded-xl h-11" onClick={clearFilters}>
        {t("listings.clear")}
      </Button>
    </div>
  );

  return (
    <div className="container py-10">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold font-display">
            {language === "fr" ? "Explorer" : language === "ar" ? "اكتشف" : "Explore"}
          </span>
          <h1 className="mt-1 font-heading text-3xl font-bold text-foreground md:text-4xl">
            {t("listings.title")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {filtered.length}{" "}
            {language === "fr"
              ? "propriétés trouvées"
              : language === "ar"
                ? "عقار"
                : "properties found"}
          </p>
        </div>
        <Button
          variant="outline"
          className="md:hidden rounded-xl"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          {t("listings.showFilters")}
        </Button>
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden w-72 shrink-0 md:block">
          <div className="sticky top-24 premium-card p-6">
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold font-display mb-5">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              {t("listings.filters")}
            </h3>
            <FilterPanel />
          </div>
        </aside>

        {/* Mobile filter overlay */}
        {showFilters && (
          <div className="fixed inset-0 z-50 bg-background p-6 md:hidden overflow-y-auto animate-slide-in-right">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl font-bold">{t("listings.filters")}</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <FilterPanel />
            <Button
              className="mt-6 w-full gradient-cta h-12 rounded-xl"
              onClick={() => setShowFilters(false)}
            >
              {t("hero.searchBtn")}
            </Button>
          </div>
        )}

        {/* Property grid */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-24 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium text-foreground">{t("listings.noResults")}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {language === "fr"
                  ? "Essayez d'ajuster vos filtres"
                  : language === "ar"
                    ? "حاول تعديل عوامل التصفية"
                    : "Try adjusting your filters"}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filtered.map((p, i) => (
                <div
                  key={p.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <PropertyCard property={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listings;
```

## src/pages/PropertyDetail.tsx

```tsx
import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { properties, agents } from "@/data/mockData";
import LazyImage from "@/components/LazyImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  Check,
  Phone,
  Mail,
  Send,
  CalendarDays,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PropertyDetail = () => {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [currentImage, setCurrentImage] = useState(0);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const property = properties.find((p) => p.id === id);

  // Compute booked date ranges for the calendar (must be before early return)
  const bookedRanges = useMemo(() => {
    if (!property?.bookedDates) return [];
    return property.bookedDates.map((r) => ({
      from: new Date(r.from),
      to: new Date(r.to),
    }));
  }, [property?.bookedDates]);

  const isDateBooked = (date: Date) => {
    return bookedRanges.some((range) => {
      const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const from = new Date(range.from.getFullYear(), range.from.getMonth(), range.from.getDate());
      const to = new Date(range.to.getFullYear(), range.to.getMonth(), range.to.getDate());
      return d >= from && d <= to;
    });
  };

  const isSelectedBooked = selectedDate ? isDateBooked(selectedDate) : false;

  if (!property) {
    return (
      <div className="container py-24 text-center">
        <p className="text-xl text-muted-foreground">{t("detail.notFound")}</p>
        <Button asChild variant="outline" className="mt-6 rounded-full">
          <Link to="/listings">{t("detail.back")}</Link>
        </Button>
      </div>
    );
  }

  const agent = agents.find((a) => a.id === property.agent_id);
  const title = property[`title_${language}` as keyof typeof property] as string;
  const description = property[`description_${language}` as keyof typeof property] as string;
  const agentBio = agent ? (agent[`bio_${language}` as keyof typeof agent] as string) : "";

  const formatPrice = (price: number) =>
    new Intl.NumberFormat(
      language === "ar" ? "ar-DZ" : language === "fr" ? "fr-DZ" : "en-US",
    ).format(price);

  const prevImage = () => setCurrentImage((i) => (i === 0 ? property.images.length - 1 : i - 1));
  const nextImage = () => setCurrentImage((i) => (i === property.images.length - 1 ? 0 : i + 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message sent!", description: "The agent will contact you shortly." });
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="container py-10">
      <Link
        to="/listings"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
      >
        <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />{" "}
        {t("detail.back")}
      </Link>

      <div className="flex flex-col gap-10 lg:flex-row">
        {/* Main content */}
        <div className="flex-1">
          {/* Carousel */}
          <div className="relative overflow-hidden rounded-2xl">
            <LazyImage
              src={property.images[currentImage]}
              alt={title}
              className="aspect-[16/10] w-full"
            />
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full glass-effect-strong hover:scale-105 transition-transform"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full glass-effect-strong hover:scale-105 transition-transform"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {property.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === currentImage
                          ? "w-6 bg-primary-foreground"
                          : "w-2 bg-primary-foreground/40 hover:bg-primary-foreground/60"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Info */}
          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className={property.type === "sale" ? "premium-badge" : "rent-badge"}>
                {t(`type.${property.type}`)}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-gold" /> {t(`city.${property.city}`)}
              </span>
            </div>

            <h1 className="mt-4 font-heading text-3xl font-bold text-foreground md:text-4xl">
              {title}
            </h1>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-gradient">
                {formatPrice(property.price)} {t("property.dzd")}
              </span>
              {property.type === "rent" && (
                <span className="text-base text-muted-foreground">
                  /{language === "fr" ? "mois" : language === "ar" ? "شهر" : "mo"}
                </span>
              )}
            </div>

            {/* Stats cards */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { icon: BedDouble, value: property.bedrooms, label: t("property.beds") },
                { icon: Bath, value: property.bathrooms, label: t("property.baths") },
                { icon: Maximize, value: `${property.area}`, label: t("property.area") },
              ].map((stat, i) => (
                <div key={i} className="premium-card p-4 text-center">
                  <stat.icon className="mx-auto h-5 w-5 text-primary" />
                  <div className="mt-2 text-lg font-bold text-card-foreground font-display">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <h2 className="font-heading text-2xl font-semibold text-foreground">
                {t("detail.description")}
              </h2>
              <div className="mt-2 gold-line" />
              <p className="mt-4 text-muted-foreground leading-relaxed text-[15px]">
                {description}
              </p>
            </div>

            <div className="mt-10">
              <h2 className="font-heading text-2xl font-semibold text-foreground">
                {t("detail.amenities")}
              </h2>
              <div className="mt-2 gold-line" />
              <div className="mt-4 grid grid-cols-2 gap-3">
                {property.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2.5 rounded-xl bg-muted/50 px-4 py-3 text-sm"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-foreground">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* Availability Calendar — only for rent */}
            {property.type === "rent" && (
              <div className="premium-card p-6">
                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold font-display">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {language === "fr"
                    ? "Vérifier la Disponibilité"
                    : language === "ar"
                      ? "تحقق من التوفر"
                      : "Check Availability"}
                </h3>
                <div className="mt-4 flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    modifiers={{
                      booked: (date) => isDateBooked(date),
                    }}
                    modifiersClassNames={{
                      booked: "!bg-destructive/15 !text-destructive line-through",
                    }}
                    className={cn("p-3 pointer-events-auto rounded-xl border-0")}
                  />
                </div>

                {/* Legend */}
                <div className="mt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-sm bg-primary/20 border border-primary/30" />
                    {language === "fr" ? "Disponible" : language === "ar" ? "متاح" : "Available"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-sm bg-destructive/15 border border-destructive/30" />
                    {language === "fr" ? "Réservé" : language === "ar" ? "محجوز" : "Booked"}
                  </span>
                </div>

                {/* Selected date status */}
                {selectedDate && (
                  <div
                    className={cn(
                      "mt-4 rounded-xl px-4 py-3 text-center text-sm font-medium",
                      isSelectedBooked
                        ? "bg-destructive/10 text-destructive"
                        : "bg-primary/10 text-primary",
                    )}
                  >
                    {isSelectedBooked
                      ? language === "fr"
                        ? "❌ Cette date est réservée"
                        : language === "ar"
                          ? "❌ هذا التاريخ محجوز"
                          : "❌ This date is booked"
                      : language === "fr"
                        ? "✅ Cette date est disponible !"
                        : language === "ar"
                          ? "✅ هذا التاريخ متاح!"
                          : "✅ This date is available!"}
                  </div>
                )}
              </div>
            )}

            {/* Agent card */}
            {agent && (
              <div className="premium-card p-6">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gold font-display">
                  {t("detail.contactAgent")}
                </h3>
                <div className="mt-4 flex items-center gap-3">
                  <img
                    src={agent.photo}
                    alt={agent.name}
                    className="h-14 w-14 rounded-2xl object-cover ring-2 ring-primary/10"
                  />
                  <div>
                    <p className="font-display font-semibold text-card-foreground">{agent.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{agentBio}</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-col gap-2">
                  <a
                    href={`tel:${agent.phone}`}
                    className="flex items-center gap-2.5 rounded-xl bg-muted/50 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    <Phone className="h-4 w-4 text-primary" /> {agent.phone}
                  </a>
                  <a
                    href={`mailto:${agent.email}`}
                    className="flex items-center gap-2.5 rounded-xl bg-muted/50 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    <Mail className="h-4 w-4 text-primary" /> {agent.email}
                  </a>
                </div>
              </div>
            )}

            {/* Inquiry form */}
            <div className="premium-card p-6">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gold font-display">
                {t("detail.inquiry")}
              </h3>
              <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                <Input
                  placeholder={t("detail.name")}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-11 rounded-xl"
                />
                <Input
                  type="email"
                  placeholder={t("detail.email")}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-11 rounded-xl"
                />
                <Input
                  type="tel"
                  placeholder={t("detail.phone")}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-11 rounded-xl"
                />
                <Textarea
                  placeholder={t("detail.message")}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  required
                  className="rounded-xl resize-none"
                />
                <Button type="submit" className="w-full gradient-cta h-11 rounded-xl gap-2">
                  <Send className="h-4 w-4" />
                  {t("detail.send")}
                </Button>
              </form>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PropertyDetail;
```

## src/pages/Services.tsx

```tsx
import { useLanguage } from "@/i18n/LanguageContext";
import { Building2, TrendingUp, Handshake, FileText, Scale, Paintbrush } from "lucide-react";

const services = [
  {
    icon: Building2,
    title: { en: "Property Sales", fr: "Vente Immobilière", ar: "بيع العقارات" },
    desc: {
      en: "We help you sell your property at the best market value with professional marketing, photography, and negotiation support.",
      fr: "Nous vous aidons à vendre votre propriété au meilleur prix du marché avec un marketing professionnel, des photos et un soutien à la négociation.",
      ar: "نساعدك في بيع عقارك بأفضل قيمة سوقية مع التسويق الاحترافي والتصوير ودعم التفاوض.",
    },
  },
  {
    icon: TrendingUp,
    title: { en: "Property Investment", fr: "Investissement Immobilier", ar: "الاستثمار العقاري" },
    desc: {
      en: "Expert guidance on real estate investment opportunities across western Algeria with detailed market analysis and ROI projections.",
      fr: "Conseils d'experts sur les opportunités d'investissement immobilier dans l'ouest algérien avec des analyses de marché détaillées.",
      ar: "إرشادات خبيرة حول فرص الاستثمار العقاري في غرب الجزائر مع تحليل مفصل للسوق.",
    },
  },
  {
    icon: Handshake,
    title: { en: "Property Rental", fr: "Location Immobilière", ar: "تأجير العقارات" },
    desc: {
      en: "Find the perfect rental property or list your property for rent with our comprehensive tenant screening and management services.",
      fr: "Trouvez la propriété locative idéale ou mettez votre bien en location avec nos services complets de sélection et de gestion des locataires.",
      ar: "اعثر على العقار المثالي للإيجار أو اعرض عقارك للإيجار مع خدمات فحص وإدارة المستأجرين الشاملة.",
    },
  },
  {
    icon: FileText,
    title: { en: "Legal Assistance", fr: "Assistance Juridique", ar: "المساعدة القانونية" },
    desc: {
      en: "Navigate the legal complexities of real estate transactions with our experienced legal team handling contracts, permits, and documentation.",
      fr: "Naviguez dans les complexités juridiques des transactions immobilières avec notre équipe juridique expérimentée.",
      ar: "تعامل مع التعقيدات القانونية للمعاملات العقارية مع فريقنا القانوني ذو الخبرة.",
    },
  },
  {
    icon: Scale,
    title: { en: "Property Valuation", fr: "Évaluation Immobilière", ar: "تقييم العقارات" },
    desc: {
      en: "Accurate property valuation services using advanced market data analysis and professional assessment methodologies.",
      fr: "Services d'évaluation immobilière précis utilisant l'analyse avancée des données du marché et des méthodologies d'évaluation professionnelles.",
      ar: "خدمات تقييم عقاري دقيقة باستخدام تحليل بيانات السوق المتقدم ومنهجيات التقييم المهنية.",
    },
  },
  {
    icon: Paintbrush,
    title: { en: "Interior Design", fr: "Design d'Intérieur", ar: "التصميم الداخلي" },
    desc: {
      en: "Transform your property with our interior design consultation services, creating spaces that reflect your style and maximize value.",
      fr: "Transformez votre propriété avec nos services de consultation en design d'intérieur, créant des espaces qui reflètent votre style.",
      ar: "حوّل عقارك مع خدمات استشارات التصميم الداخلي، لإنشاء مساحات تعكس أسلوبك وتزيد القيمة.",
    },
  },
];

const Services = () => {
  const { language } = useLanguage();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground via-navy-light to-foreground dark:from-background dark:via-navy-light/20 dark:to-background" />
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-[120px] animate-pulse-soft" />
        <div className="container relative z-10 py-24 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold font-display">
            {language === "fr"
              ? "Ce Que Nous Offrons"
              : language === "ar"
                ? "ما نقدمه"
                : "What We Offer"}
          </span>
          <h1 className="mt-3 font-heading text-4xl font-bold text-primary-foreground md:text-5xl">
            {language === "fr" ? "Nos Services" : language === "ar" ? "خدماتنا" : "Our Services"}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/70">
            {language === "fr"
              ? "Des solutions immobilières complètes adaptées à vos besoins"
              : language === "ar"
                ? "حلول عقارية شاملة مصممة لتلبية احتياجاتك"
                : "Comprehensive real estate solutions tailored to your needs"}
          </p>
          <div className="mx-auto mt-6 gold-line" />
        </div>
      </section>

      {/* Services Grid */}
      <section className="container py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <div
              key={i}
              className="premium-card p-8 group animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition-all duration-500 group-hover:bg-primary/20 group-hover:scale-110">
                <service.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mt-5 font-heading text-xl font-semibold text-card-foreground">
                {service.title[language]}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {service.desc[language]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-20">
        <div className="premium-card p-10 text-center md:p-16">
          <h2 className="font-heading text-3xl font-bold text-card-foreground">
            {language === "fr"
              ? "Besoin d'un Service Personnalisé ?"
              : language === "ar"
                ? "هل تحتاج خدمة مخصصة؟"
                : "Need a Customized Service?"}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            {language === "fr"
              ? "Contactez-nous pour discuter de vos besoins spécifiques"
              : language === "ar"
                ? "تواصل معنا لمناقشة احتياجاتك الخاصة"
                : "Get in touch to discuss your specific requirements"}
          </p>
          <div className="mx-auto mt-4 gold-line" />
          <a
            href="/contact"
            className="mt-8 inline-block rounded-full gradient-cta px-8 py-3 text-sm font-semibold"
          >
            {language === "fr" ? "Contactez-nous" : language === "ar" ? "اتصل بنا" : "Contact Us"}
          </a>
        </div>
      </section>
    </div>
  );
};

export default Services;
```

## src/pages/Agents.tsx

```tsx
import { useLanguage } from "@/i18n/LanguageContext";
import { agents } from "@/data/mockData";
import { Phone, Mail, Star } from "lucide-react";

const Agents = () => {
  const { language } = useLanguage();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground via-navy-light to-foreground dark:from-background dark:via-navy-light/20 dark:to-background" />
        <div className="absolute bottom-10 right-1/4 w-72 h-72 rounded-full bg-gold/15 blur-[100px] animate-pulse-soft" />
        <div className="container relative z-10 py-24 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold font-display">
            {language === "fr" ? "Notre Équipe" : language === "ar" ? "فريقنا" : "Our Team"}
          </span>
          <h1 className="mt-3 font-heading text-4xl font-bold text-primary-foreground md:text-5xl">
            {language === "fr"
              ? "Nos Agents Experts"
              : language === "ar"
                ? "وكلاؤنا الخبراء"
                : "Our Expert Agents"}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/70">
            {language === "fr"
              ? "Des professionnels dévoués à votre réussite immobilière"
              : language === "ar"
                ? "محترفون مكرسون لنجاحك العقاري"
                : "Dedicated professionals committed to your real estate success"}
          </p>
          <div className="mx-auto mt-6 gold-line" />
        </div>
      </section>

      {/* Agents Grid */}
      <section className="container py-20">
        <div className="grid gap-8 md:grid-cols-2 max-w-3xl mx-auto">
          {agents.map((agent, i) => {
            const bio = agent[`bio_${language}` as keyof typeof agent] as string;
            return (
              <div
                key={agent.id}
                className="premium-card p-8 text-center group animate-fade-in-up"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <img
                  src={agent.photo}
                  alt={agent.name}
                  className="mx-auto h-28 w-28 rounded-2xl object-cover ring-4 ring-primary/10 transition-all duration-500 group-hover:ring-primary/25 group-hover:scale-105"
                />
                <h3 className="mt-5 font-heading text-xl font-semibold text-card-foreground">
                  {agent.name}
                </h3>
                <div className="mx-auto mt-2 gold-line" />
                <div className="mt-3 flex items-center justify-center gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-gold text-gold" />
                  ))}
                </div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{bio}</p>
                <div className="mt-5 flex flex-col gap-2">
                  <a
                    href={`tel:${agent.phone}`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-muted/50 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    <Phone className="h-4 w-4 text-primary" /> {agent.phone}
                  </a>
                  <a
                    href={`mailto:${agent.email}`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-muted/50 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    <Mail className="h-4 w-4 text-primary" /> {agent.email}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Join CTA */}
      <section className="container pb-20">
        <div className="premium-card p-10 text-center md:p-16">
          <h2 className="font-heading text-3xl font-bold text-card-foreground">
            {language === "fr"
              ? "Rejoignez Notre Équipe"
              : language === "ar"
                ? "انضم إلى فريقنا"
                : "Join Our Team"}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            {language === "fr"
              ? "Nous recherchons des agents passionnés par l'immobilier"
              : language === "ar"
                ? "نبحث عن وكلاء شغوفين بالعقارات"
                : "We're looking for passionate real estate professionals"}
          </p>
          <div className="mx-auto mt-4 gold-line" />
          <a
            href="/contact"
            className="mt-8 inline-block rounded-full gradient-cta px-8 py-3 text-sm font-semibold"
          >
            {language === "fr" ? "Postuler" : language === "ar" ? "قدّم طلبك" : "Apply Now"}
          </a>
        </div>
      </section>
    </div>
  );
};

export default Agents;
```

## src/pages/About.tsx

```tsx
import { useLanguage } from "@/i18n/LanguageContext";
import { Target, Eye, Award, Users, Building2, TrendingUp } from "lucide-react";
import logo from "@/assets/logo.jpg";

const About = () => {
  const { language } = useLanguage();

  const values = [
    {
      icon: Award,
      title: { en: "Excellence", fr: "Excellence", ar: "التميز" },
      desc: {
        en: "We strive for the highest standards in every transaction and client interaction.",
        fr: "Nous visons les plus hauts standards dans chaque transaction et interaction client.",
        ar: "نسعى لأعلى المعايير في كل معاملة وتفاعل مع العملاء.",
      },
    },
    {
      icon: Users,
      title: { en: "Trust", fr: "Confiance", ar: "الثقة" },
      desc: {
        en: "Building lasting relationships through transparency, honesty, and integrity.",
        fr: "Construire des relations durables grâce à la transparence, l'honnêteté et l'intégrité.",
        ar: "بناء علاقات دائمة من خلال الشفافية والصدق والنزاهة.",
      },
    },
    {
      icon: TrendingUp,
      title: { en: "Innovation", fr: "Innovation", ar: "الابتكار" },
      desc: {
        en: "Leveraging modern tools and strategies to deliver the best results for our clients.",
        fr: "Utiliser des outils et stratégies modernes pour offrir les meilleurs résultats.",
        ar: "استخدام الأدوات والاستراتيجيات الحديثة لتقديم أفضل النتائج لعملائنا.",
      },
    },
  ];

  const stats = [
    { value: "500+", label: { en: "Properties Sold", fr: "Propriétés Vendues", ar: "عقار مباع" } },
    { value: "15+", label: { en: "Years Experience", fr: "Années d'Expérience", ar: "سنة خبرة" } },
    { value: "200+", label: { en: "Happy Clients", fr: "Clients Satisfaits", ar: "عميل سعيد" } },
    {
      value: "98%",
      label: { en: "Satisfaction Rate", fr: "Taux de Satisfaction", ar: "نسبة الرضا" },
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground via-navy-light to-foreground dark:from-background dark:via-navy-light/20 dark:to-background" />
        <div className="absolute top-20 right-1/3 w-96 h-96 rounded-full bg-primary/20 blur-[120px] animate-pulse-soft" />
        <div className="container relative z-10 py-24 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold font-display">
            {language === "fr" ? "Notre Histoire" : language === "ar" ? "قصتنا" : "Our Story"}
          </span>
          <h1 className="mt-3 font-heading text-4xl font-bold text-primary-foreground md:text-5xl">
            {language === "fr"
              ? "À Propos d'EL-YANIS"
              : language === "ar"
                ? "حول العنيس"
                : "About EL-YANIS"}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/70">
            {language === "fr"
              ? "Votre partenaire de confiance pour l'immobilier premium en Algérie occidentale"
              : language === "ar"
                ? "شريكك الموثوق للعقارات الفاخرة في غرب الجزائر"
                : "Your trusted partner for premium real estate in western Algeria"}
          </p>
          <div className="mx-auto mt-6 gold-line" />
        </div>
      </section>

      {/* Story Section */}
      <section className="container py-20">
        <div className="grid gap-12 items-center md:grid-cols-2">
          <div className="animate-fade-in-up">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold font-display">
              {language === "fr" ? "Qui Sommes-Nous" : language === "ar" ? "من نحن" : "Who We Are"}
            </span>
            <h2 className="mt-3 font-heading text-3xl font-bold text-foreground">
              {language === "fr"
                ? "Bâtir des Rêves Depuis 2009"
                : language === "ar"
                  ? "نبني الأحلام منذ 2009"
                  : "Building Dreams Since 2009"}
            </h2>
            <div className="mt-3 gold-line" />
            <p className="mt-6 text-muted-foreground leading-relaxed">
              {language === "fr"
                ? "Fondée à Tlemcen, EL-YANIS Real Estate s'est imposée comme le leader de l'immobilier haut de gamme dans l'ouest algérien. Notre équipe d'experts passionnés accompagne chaque client avec dévouement, de la première visite jusqu'à la remise des clés."
                : language === "ar"
                  ? "تأسست العنيس للعقارات في تلمسان، وأصبحت الشركة الرائدة في مجال العقارات الفاخرة في غرب الجزائر. يرافق فريقنا من الخبراء المتحمسين كل عميل بتفانٍ، من الزيارة الأولى حتى تسليم المفاتيح."
                  : "Founded in Tlemcen, EL-YANIS Real Estate has established itself as the leading premium real estate agency in western Algeria. Our team of passionate experts accompanies each client with dedication, from the first visit to the key handover."}
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {language === "fr"
                ? "Avec une présence forte à Tlemcen, Ain Temouchent et Sidi Bel Abbès, nous offrons une couverture complète du marché immobilier de la région."
                : language === "ar"
                  ? "مع وجود قوي في تلمسان وعين تموشنت وسيدي بلعباس، نقدم تغطية شاملة لسوق العقارات في المنطقة."
                  : "With a strong presence in Tlemcen, Ain Temouchent, and Sidi Bel Abbès, we offer comprehensive coverage of the region's real estate market."}
            </p>
          </div>
          <div
            className="flex justify-center animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="relative">
              <div className="premium-card p-8 flex items-center justify-center">
                <img src={logo} alt="EL-YANIS" className="w-48 h-48 object-contain" />
              </div>
              <div className="absolute -bottom-4 -right-4 rounded-2xl gradient-cta px-5 py-3 text-center">
                <div className="text-2xl font-bold font-display">15+</div>
                <div className="text-xs uppercase tracking-wider opacity-80">
                  {language === "fr" ? "Ans" : language === "ar" ? "سنة" : "Years"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container pb-20">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="premium-card p-8 animate-fade-in-up">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-5 font-heading text-2xl font-semibold text-card-foreground">
              {language === "fr" ? "Notre Mission" : language === "ar" ? "مهمتنا" : "Our Mission"}
            </h3>
            <div className="mt-2 gold-line" />
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {language === "fr"
                ? "Offrir une expérience immobilière d'exception en combinant expertise locale, service personnalisé et technologies innovantes pour répondre aux aspirations de nos clients."
                : language === "ar"
                  ? "تقديم تجربة عقارية استثنائية من خلال الجمع بين الخبرة المحلية والخدمة الشخصية والتقنيات المبتكرة لتلبية تطلعات عملائنا."
                  : "To deliver an exceptional real estate experience by combining local expertise, personalized service, and innovative technologies to meet our clients' aspirations."}
            </p>
          </div>
          <div className="premium-card p-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10">
              <Eye className="h-6 w-6 text-gold" />
            </div>
            <h3 className="mt-5 font-heading text-2xl font-semibold text-card-foreground">
              {language === "fr" ? "Notre Vision" : language === "ar" ? "رؤيتنا" : "Our Vision"}
            </h3>
            <div className="mt-2 gold-line" />
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {language === "fr"
                ? "Devenir la référence incontournable de l'immobilier premium en Algérie, reconnue pour notre intégrité, notre innovation et notre engagement envers l'excellence."
                : language === "ar"
                  ? "أن نصبح المرجع الأول في مجال العقارات الفاخرة في الجزائر، والمعروف بنزاهتنا وابتكارنا والتزامنا بالتميز."
                  : "To become the definitive reference for premium real estate in Algeria, recognized for our integrity, innovation, and commitment to excellence."}
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
        <div className="container relative z-10">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold font-display">
              {language === "fr" ? "Nos Valeurs" : language === "ar" ? "قيمنا" : "Our Values"}
            </span>
            <h2 className="mt-3 font-heading text-3xl font-bold text-foreground">
              {language === "fr"
                ? "Ce Qui Nous Guide"
                : language === "ar"
                  ? "ما يوجهنا"
                  : "What Guides Us"}
            </h2>
            <div className="mx-auto mt-4 gold-line" />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((v, i) => (
              <div
                key={i}
                className="premium-card p-8 text-center group animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition-all duration-500 group-hover:bg-primary/20 group-hover:scale-110">
                  <v.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mt-5 font-heading text-xl font-semibold text-card-foreground">
                  {v.title[language]}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {v.desc[language]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container pb-20">
        <div className="premium-card p-10 md:p-14">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="text-center animate-count-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-3xl font-bold font-display text-gradient md:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground font-display">
                  {stat.label[language]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
```

## src/pages/Contact.tsx

```tsx
import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from "lucide-react";

const Contact = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title:
        language === "fr"
          ? "Message envoyé !"
          : language === "ar"
            ? "تم إرسال الرسالة!"
            : "Message sent!",
      description:
        language === "fr"
          ? "Nous vous répondrons dans les plus brefs délais."
          : language === "ar"
            ? "سنرد عليك في أقرب وقت ممكن."
            : "We'll get back to you as soon as possible.",
    });
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: { en: "Phone", fr: "Téléphone", ar: "الهاتف" },
      value: "+213 555 123 456",
      link: "tel:+213555123456",
    },
    {
      icon: Mail,
      title: { en: "Email", fr: "Email", ar: "البريد الإلكتروني" },
      value: "contact@elyainis.com",
      link: "mailto:contact@elyainis.com",
    },
    {
      icon: MapPin,
      title: { en: "Address", fr: "Adresse", ar: "العنوان" },
      value:
        language === "fr"
          ? "Centre-ville, Tlemcen, Algérie"
          : language === "ar"
            ? "وسط المدينة، تلمسان، الجزائر"
            : "City Center, Tlemcen, Algeria",
      link: "https://maps.google.com/?q=Tlemcen,Algeria",
    },
    {
      icon: Clock,
      title: { en: "Working Hours", fr: "Horaires", ar: "ساعات العمل" },
      value:
        language === "fr"
          ? "Dim - Jeu: 9h - 18h"
          : language === "ar"
            ? "الأحد - الخميس: 9 - 18"
            : "Sun - Thu: 9AM - 6PM",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground via-navy-light to-foreground dark:from-background dark:via-navy-light/20 dark:to-background" />
        <div className="absolute bottom-10 left-1/4 w-72 h-72 rounded-full bg-gold/15 blur-[100px] animate-pulse-soft" />
        <div className="container relative z-10 py-24 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold font-display">
            {language === "fr" ? "Parlons-en" : language === "ar" ? "لنتحدث" : "Get In Touch"}
          </span>
          <h1 className="mt-3 font-heading text-4xl font-bold text-primary-foreground md:text-5xl">
            {language === "fr" ? "Contactez-nous" : language === "ar" ? "اتصل بنا" : "Contact Us"}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/70">
            {language === "fr"
              ? "Nous sommes là pour répondre à toutes vos questions immobilières"
              : language === "ar"
                ? "نحن هنا للإجابة على جميع أسئلتك العقارية"
                : "We're here to answer all your real estate questions"}
          </p>
          <div className="mx-auto mt-6 gold-line" />
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="container py-20">
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-14">
          {contactInfo.map((info, i) => (
            <a
              key={i}
              href={info.link}
              target={info.link?.startsWith("http") ? "_blank" : undefined}
              rel={info.link?.startsWith("http") ? "noopener noreferrer" : undefined}
              className="premium-card p-6 text-center group hover:border-primary/20 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 transition-all duration-500 group-hover:bg-primary/20">
                <info.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground font-display">
                {info.title[language]}
              </h3>
              <p className="mt-1 text-sm font-medium text-card-foreground">{info.value}</p>
            </a>
          ))}
        </div>

        {/* Form + Map */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Contact Form */}
          <div className="premium-card p-8">
            <div className="flex items-center gap-2 mb-6">
              <MessageCircle className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-2xl font-semibold text-card-foreground">
                {language === "fr"
                  ? "Envoyez-nous un Message"
                  : language === "ar"
                    ? "أرسل لنا رسالة"
                    : "Send Us a Message"}
              </h2>
            </div>
            <div className="gold-line mb-6" />

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  placeholder={
                    language === "fr" ? "Votre Nom" : language === "ar" ? "اسمك" : "Your Name"
                  }
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="h-11 rounded-xl"
                />
                <Input
                  type="email"
                  placeholder={
                    language === "fr"
                      ? "Votre Email"
                      : language === "ar"
                        ? "بريدك الإلكتروني"
                        : "Your Email"
                  }
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  type="tel"
                  placeholder={
                    language === "fr"
                      ? "Votre Téléphone"
                      : language === "ar"
                        ? "هاتفك"
                        : "Your Phone"
                  }
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="h-11 rounded-xl"
                />
                <Input
                  placeholder={
                    language === "fr" ? "Sujet" : language === "ar" ? "الموضوع" : "Subject"
                  }
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                  className="h-11 rounded-xl"
                />
              </div>
              <Textarea
                placeholder={
                  language === "fr"
                    ? "Votre Message"
                    : language === "ar"
                      ? "رسالتك"
                      : "Your Message"
                }
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={5}
                required
                className="rounded-xl resize-none"
              />
              <Button type="submit" className="w-full gradient-cta h-12 rounded-xl gap-2 text-base">
                <Send className="h-4 w-4" />
                {language === "fr"
                  ? "Envoyer le Message"
                  : language === "ar"
                    ? "إرسال الرسالة"
                    : "Send Message"}
              </Button>
            </form>
          </div>

          {/* Map */}
          <div className="premium-card overflow-hidden">
            <iframe
              title="EL-YANIS Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d104571.35905671856!2d-1.3650387!3d34.8826946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd78c94ab5d38c87%3A0x1c5e8b7a2c3d4e5f!2sTlemcen!5e0!3m2!1sfr!2sdz!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 400 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="container pb-20">
        <div className="premium-card p-10 text-center md:p-14">
          <h2 className="font-heading text-3xl font-bold text-card-foreground">
            {language === "fr"
              ? "Préférez WhatsApp ?"
              : language === "ar"
                ? "هل تفضل واتساب؟"
                : "Prefer WhatsApp?"}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            {language === "fr"
              ? "Envoyez-nous un message directement sur WhatsApp pour une réponse rapide"
              : language === "ar"
                ? "أرسل لنا رسالة مباشرة على واتساب للحصول على رد سريع"
                : "Send us a message directly on WhatsApp for a quick response"}
          </p>
          <div className="mx-auto mt-4 gold-line" />
          <a
            href="https://wa.me/213555123456"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full gradient-cta-gold px-8 py-3 text-sm font-semibold"
          >
            <MessageCircle className="h-4 w-4" />
            {language === "fr"
              ? "Discuter sur WhatsApp"
              : language === "ar"
                ? "تحدث عبر واتساب"
                : "Chat on WhatsApp"}
          </a>
        </div>
      </section>
    </div>
  );
};

export default Contact;
```

## src/pages/NotFound.tsx

```tsx
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
```

---

## Fichiers non inclus (à mentionner si besoin)

- `src/components/ui/*` — primitives shadcn (Button, Input, Card, …)
- `src/components/PropertyCard.tsx`, autres composants métier
- `src/i18n/*` — chaînes et contexte langue
- `src/data/mockData.ts`
- `vite.config.ts`, `tsconfig.json`

---

_Fin du pack — 2026-04-20_
