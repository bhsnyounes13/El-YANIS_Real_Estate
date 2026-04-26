import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminCreateAgent,
  adminDeleteAgent,
  adminListAgents,
  adminUpdateAgent,
  type AgentWriteInput,
} from "@/lib/api/services/adminApi.service";

export function useAdminAgents() {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["admin", "agents"],
    queryFn: () => adminListAgents(),
    retry: 1,
  });

  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: ["admin", "agents"] });
    void qc.invalidateQueries({ queryKey: ["agents"] });
    void qc.invalidateQueries({ queryKey: ["admin", "properties"] });
    void qc.invalidateQueries({ queryKey: ["properties"] });
  };

  const create = useMutation({
    mutationFn: (payload: AgentWriteInput) => adminCreateAgent(payload),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AgentWriteInput }) =>
      adminUpdateAgent(id, payload),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => adminDeleteAgent(id),
    onSuccess: invalidate,
  });

  return { query, create, update, remove };
}
