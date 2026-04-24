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
    plugins: [tailwindcss(), tsconfigPaths({ projects: ["./tsconfig.json"] }), react()],
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
