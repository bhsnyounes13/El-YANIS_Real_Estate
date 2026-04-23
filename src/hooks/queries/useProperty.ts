import { useQuery } from "@tanstack/react-query";
import * as catalogApi from "@/lib/api/services/catalogApi.service";

export function useProperty(id: string | undefined) {
  return useQuery({
    queryKey: ["property", id],
    queryFn: () => catalogApi.fetchPropertyById(id!),
    enabled: Boolean(id),
    staleTime: 60_000,
    retry: 1,
  });
}
