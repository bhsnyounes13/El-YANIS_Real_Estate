import { useMutation } from "@tanstack/react-query";
import type { PropertyInquiryInput } from "@/lib/domain/types";
import { submitPropertyInquiry } from "@/lib/api/services/catalogApi.service";

export function usePropertyInquiry() {
  return useMutation({
    mutationFn: async (payload: PropertyInquiryInput): Promise<{ ok: boolean }> => {
      await submitPropertyInquiry(payload);
      return { ok: true };
    },
  });
}
