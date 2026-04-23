import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminDeleteInquiry,
  adminListInquiries,
  type AdminInquiryApiRow,
} from "@/lib/api/services/adminApi.service";

export interface AdminInquiryRow {
  id: string;
  kind: "contact" | "property";
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  propertyId?: string;
  propertyTitle?: string;
  preferredDate?: string;
  createdAt: string;
}

function mapRow(r: AdminInquiryApiRow): AdminInquiryRow {
  return {
    id: r.id,
    kind: r.kind,
    name: r.name,
    email: r.email,
    phone: r.phone,
    subject: r.subject,
    message: r.message,
    propertyId: r.property_id,
    propertyTitle: r.property_title_fr,
    preferredDate: r.preferred_date,
    createdAt: r.created_at,
  };
}

export function useAdminInquiries() {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["admin", "inquiries"],
    queryFn: async () => {
      const rows = await adminListInquiries();
      return rows.map(mapRow);
    },
    retry: 1,
  });

  const remove = useMutation({
    mutationFn: ({ kind, id }: { kind: "contact" | "property"; id: string }) =>
      adminDeleteInquiry(kind, id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "inquiries"] });
    },
  });

  return { query, remove };
}
