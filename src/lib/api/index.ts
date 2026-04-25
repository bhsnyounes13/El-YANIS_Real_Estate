/**
 * Point d’entrée du client API : base `VITE_API_URL`, requêtes authentifiées, erreurs.
 * Préférer `import { ... } from "@/lib/api"` plutôt que d’importer chaque module à la main.
 */
export * from "./client";
export { API_ENDPOINTS } from "./endpoints";
