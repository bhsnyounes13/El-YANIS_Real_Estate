# Codebase Source Of Truth

This repository has a **single** frontend application at the repository root:

- Application code: `src/`
- Vite entry: `index.html` → `src/main.tsx`

## What to run

Use root scripts to run the active app:

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run typecheck`
- `npm run test`

## Stabilization rule

- Treat the root `src/` tree as the production source of truth.
- Avoid reintroducing a second nested frontend directory.
