import { useQuery } from "@tanstack/react-query";
import * as catalogApi from "@/lib/api/services/catalogApi.service";

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: catalogApi.fetchServicesList,
    staleTime: 120_000,
    retry: 1,
  });
}
