import { useQuery } from "@tanstack/react-query";
import * as catalogApi from "@/lib/api/services/catalogApi.service";

export function useFeaturedProperties() {
  return useQuery({
    queryKey: ["properties", "featured"],
    queryFn: catalogApi.fetchFeaturedProperties,
    staleTime: 60_000,
    retry: 1,
  });
}
