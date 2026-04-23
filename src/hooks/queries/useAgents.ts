import { useQuery } from "@tanstack/react-query";
import * as catalogApi from "@/lib/api/services/catalogApi.service";

export function useAgents() {
  return useQuery({
    queryKey: ["agents"],
    queryFn: catalogApi.fetchAgentsList,
    staleTime: 120_000,
    retry: 1,
  });
}
