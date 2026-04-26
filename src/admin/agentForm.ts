import { z } from "zod";
import type { Agent, AgentStatus } from "@/lib/domain/types";
import type { AgentWriteInput } from "@/lib/api/services/adminApi.service";

const optionalText = z
  .string()
  .optional()
  .transform((value) => value?.trim() || "");

const optionalUrl = z
  .string()
  .optional()
  .transform((value) => value?.trim() || "")
  .refine(
    (value) => {
      if (!value) return true;
      try {
        const parsed = new URL(value);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "URL invalide." },
  );

export const agentFormSchema = z.object({
  name: z.string().min(2, "Le nom complet est requis."),
  phone: z.string().min(5, "Le numéro de téléphone est requis."),
  email: z
    .string()
    .optional()
    .transform((value) => value?.trim() || "")
    .refine((value) => !value || z.string().email().safeParse(value).success, {
      message: "Email invalide.",
    }),
  whatsapp: optionalText,
  photo: optionalUrl,
  position: optionalText,
  agency_name: optionalText,
  facebook: optionalUrl,
  instagram: optionalUrl,
  linkedin: optionalUrl,
  bio_fr: optionalText,
  bio_en: optionalText,
  bio_ar: optionalText,
  status: z.enum(["active", "inactive"]).default("active"),
});

export type AgentFormValues = z.infer<typeof agentFormSchema>;

const emptyForm: AgentFormValues = {
  name: "",
  phone: "",
  email: "",
  whatsapp: "",
  photo: "",
  position: "",
  agency_name: "",
  facebook: "",
  instagram: "",
  linkedin: "",
  bio_fr: "",
  bio_en: "",
  bio_ar: "",
  status: "active",
};

export function getEmptyAgentForm(): AgentFormValues {
  return { ...emptyForm };
}

export function agentToFormValues(agent: Agent): AgentFormValues {
  return {
    name: agent.name || "",
    phone: agent.phone || "",
    email: agent.email || "",
    whatsapp: agent.whatsapp || "",
    photo: agent.photo || "",
    position: agent.position || "",
    agency_name: agent.agency_name || "",
    facebook: agent.facebook || "",
    instagram: agent.instagram || "",
    linkedin: agent.linkedin || "",
    bio_fr: agent.bio_fr || "",
    bio_en: agent.bio_en || "",
    bio_ar: agent.bio_ar || "",
    status: (agent.status || "active") as AgentStatus,
  };
}

export function formValuesToAgentWrite(values: AgentFormValues): AgentWriteInput {
  return {
    name: values.name.trim(),
    phone: values.phone.trim(),
    email: values.email || undefined,
    whatsapp: values.whatsapp || undefined,
    photo: values.photo || undefined,
    position: values.position || undefined,
    agency_name: values.agency_name || undefined,
    facebook: values.facebook || undefined,
    instagram: values.instagram || undefined,
    linkedin: values.linkedin || undefined,
    bio_fr: values.bio_fr || undefined,
    bio_en: values.bio_en || undefined,
    bio_ar: values.bio_ar || undefined,
    status: values.status,
  };
}
