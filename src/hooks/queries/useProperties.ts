import { useQuery } from "@tanstack/react-query";
import * as catalogApi from "@/lib/api/services/catalogApi.service";

export function useProperties() {
  return useQuery({
    queryKey: ["properties"],
    queryFn: catalogApi.fetchPropertiesList,
    staleTime: 60_000,
    retry: 1,
  });
}
