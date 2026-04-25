import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function normalizeBase(raw: string | undefined): string {
  if (!raw || raw === "/") return "/";
  const p = raw.startsWith("/") ? raw : `/${raw}`;
  return p.endsWith("/") ? p : `${p}/`;
}

export default defineConfig(({ mode }) => {
  const envAll = loadEnv(mode, process.cwd(), "");
  const apiPort = (envAll.PORT ?? process.env.PORT ?? "3000").trim() || "3000";
  const envDefines = Object.fromEntries(
    Object.entries(loadEnv(mode, process.cwd(), "VITE_")).map(([key, value]) => [
      `import.meta.env.${key}`,
      JSON.stringify(value),
    ]),
  );

  return {
    base: normalizeBase(envAll.VITE_BASE_PATH),
    define: envDefines,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    plugins: [
      tailwindcss(),
      tsconfigPaths({ projects: ["./tsconfig.json"] }),
      react(),
      /** Repli : injecte l’URL API dans index.html (dist) — utile si seul l’ancien JS est en cache. */
      {
        name: "elyanis-inject-api-base",
        apply: "build",
        transformIndexHtml(html) {
          const e = loadEnv("production", process.cwd(), "VITE_");
          const base = (e.VITE_API_URL ?? "").trim().replace(/\/$/, "");
          if (!base) return html;
          const contentEsc = base.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
          const meta = `<meta name="elyanis-api-base" content="${contentEsc}" />`;
          const script = `<script>window.__ELYANIS_API_BASE__=${JSON.stringify(base)}<\/script>`;
          if (html.includes("<head>")) {
            return html.replace("<head>", `<head>\n    ${meta}\n    ${script}`);
          }
          return meta + script + html;
        },
      },
    ],
    server: {
      host: true,
      port: 8080,
      proxy: {
        "/api": {
          target: `http://127.0.0.1:${apiPort}`,
          changeOrigin: true,
        },
      },
    },
    build: {
      target: "es2022",
      cssMinify: true,
    },
  };
});
