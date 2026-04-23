import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminDeleteUser,
  adminListUsers,
  adminUpdateUserRole,
} from "@/lib/api/services/adminApi.service";

export type { AdminUserDto } from "@/lib/api/services/adminApi.service";

export function useAdminUsers() {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["admin", "users"],
    queryFn: adminListUsers,
    retry: 1,
  });

  const updateRole = useMutation({
    mutationFn: ({ id, role }: { id: string; role: "admin" | "user" }) =>
      adminUpdateUserRole(id, role),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => adminDeleteUser(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });

  return { query, updateRole, remove };
}
