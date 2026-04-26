import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminCreateProperty,
  adminDeleteProperty,
  adminListProperties,
  adminUpdateProperty,
} from "@/lib/api/services/adminApi.service";
import type { Property } from "@/lib/domain/types";

function invalidatePropertyQueries(qc: ReturnType<typeof useQueryClient>) {
  void qc.invalidateQueries({ queryKey: ["properties"] });
  void qc.invalidateQueries({ queryKey: ["properties", "featured"] });
  void qc.invalidateQueries({ queryKey: ["admin", "properties"] });
  void qc.invalidateQueries({ queryKey: ["admin", "inquiries"] });
  void qc.invalidateQueries({
    predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "property",
  });
}

function isPropertyLike(v: unknown): v is Property {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.title_en === "string" &&
    typeof o.title_fr === "string" &&
    Array.isArray(o.images)
  );
}

export function useAdminPropertyCatalog() {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["admin", "properties"],
    queryFn: () => adminListProperties(),
    retry: 1,
  });

  const create = useMutation({
    mutationFn: (property: Property) => adminCreateProperty(property),
    onSuccess: () => invalidatePropertyQueries(qc),
  });

  const update = useMutation({
    mutationFn: (property: Property) => adminUpdateProperty(property),
    onSuccess: () => invalidatePropertyQueries(qc),
  });

  const remove = useMutation({
    mutationFn: (id: string) => adminDeleteProperty(id),
    onSuccess: () => invalidatePropertyQueries(qc),
  });

  const importJson = useMutation({
    mutationFn: async (json: string) => {
      let parsed: unknown;
      try {
        parsed = JSON.parse(json) as unknown;
      } catch {
        throw new Error("JSON invalide.");
      }
      if (!Array.isArray(parsed)) throw new Error("Le fichier doit contenir un tableau de biens.");
      let imported = 0;
      let failed = 0;
      for (const item of parsed) {
        if (!isPropertyLike(item)) {
          failed++;
          continue;
        }
        try {
          await adminCreateProperty(item);
          imported++;
        } catch {
          failed++;
        }
      }
      if (imported === 0) {
        throw new Error(
          failed > 0
            ? "Aucun bien créé (vérifiez les données ou les doublons côté serveur)."
            : "Aucune entrée valide.",
        );
      }
    },
    onSuccess: () => invalidatePropertyQueries(qc),
  });

  const exportCatalogJson = () => JSON.stringify(query.data ?? [], null, 2);

  return {
    query,
    create,
    update,
    remove,
    importJson,
    exportCatalogJson,
  };
}
