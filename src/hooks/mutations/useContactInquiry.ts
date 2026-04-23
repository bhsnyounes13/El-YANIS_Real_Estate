import { useMutation } from "@tanstack/react-query";
import type { ContactInquiryInput } from "@/lib/domain/types";
import { submitContactForm } from "@/lib/api/services/catalogApi.service";

export function useContactInquiry() {
  return useMutation({
    mutationFn: async (payload: ContactInquiryInput): Promise<{ ok: boolean }> => {
      await submitContactForm(payload);
      return { ok: true };
    },
  });
}
