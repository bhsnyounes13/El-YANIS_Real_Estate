import { z } from "zod";

/** Aligné sur `contactPublicSchema` / persistance backend (sans jeton Turnstile). */
export const contactPageFormSchema = z.object({
  name: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(320),
  phone: z.union([z.literal(""), z.string().trim().max(80)]),
  subject: z.union([z.literal(""), z.string().trim().min(2).max(300)]),
  message: z.string().trim().min(4).max(10000),
});

export type ContactPageFormValues = z.infer<typeof contactPageFormSchema>;

/** Aligné sur `propertyInquiryPublicSchema` (sans jeton). */
export const propertyInquiryPageSchema = z.object({
  name: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(320),
  phone: z.union([z.literal(""), z.string().trim().max(80)]),
  message: z.string().trim().min(4).max(10000),
});

export type PropertyInquiryPageValues = z.infer<typeof propertyInquiryPageSchema>;
