import { z } from "zod";
import type { BookedRange, Property, PropertyTag } from "@/lib/domain/types";

const optionalText = z
  .string()
  .optional()
  .transform((value) => value?.trim() || "");

const optionalPositiveNumber = z
  .union([z.coerce.number().nonnegative(), z.literal(""), z.undefined()])
  .transform((value) => (value === "" || value === undefined ? 0 : Number(value)));

export const propertyFormSchema = z.object({
  title: z.string().min(2, "Le titre est requis."),
  title_en: optionalText,
  title_ar: optionalText,
  description: optionalText,
  description_en: optionalText,
  description_ar: optionalText,
  type: z.enum(["sale", "rent"]),
  price: z.coerce.number().positive("Le prix est requis."),
  city: z.enum(["tlemcen", "ainTemouchent", "sidiBelAbbes"]),
  bedrooms: optionalPositiveNumber,
  bathrooms: optionalPositiveNumber,
  area: optionalPositiveNumber,
  images: z.array(z.string().min(1)).min(1, "Ajoutez au moins une photo."),
  amenitiesText: z.string().default(""),
  agent_id: z.string().optional(),
  featured: z.boolean().default(false),
  tag_exclusive: z.boolean().default(false),
  tag_new: z.boolean().default(false),
  tag_featured: z.boolean().default(false),
  bookedDatesJson: z.string().optional(),
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;

const emptyForm: PropertyFormValues = {
  title: "",
  title_en: "",
  title_ar: "",
  description: "",
  description_en: "",
  description_ar: "",
  type: "sale",
  price: 1,
  city: "tlemcen",
  bedrooms: 0,
  bathrooms: 0,
  area: 0,
  images: [],
  amenitiesText: "",
  agent_id: "",
  featured: false,
  tag_exclusive: false,
  tag_new: false,
  tag_featured: false,
  bookedDatesJson: "",
};

export function getEmptyPropertyForm(): PropertyFormValues {
  return { ...emptyForm };
}

function parseBookedDates(json: string | undefined): BookedRange[] | undefined {
  if (!json?.trim()) return undefined;
  try {
    const v = JSON.parse(json) as unknown;
    if (!Array.isArray(v)) return undefined;
    return v as BookedRange[];
  } catch {
    return undefined;
  }
}

function fallbackTitle(property: Property): string {
  return property.title_fr || property.title_en || property.title_ar || "";
}

function fallbackDescription(property: Property): string {
  return property.description_fr || property.description_en || property.description_ar || "";
}

export function formValuesToProperty(
  values: PropertyFormValues,
  id: string,
  preserve?: Pick<Property, "bookedDates">,
): Property {
  const images = values.images.filter(Boolean);
  const amenities = values.amenitiesText
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const tags: PropertyTag[] = [];
  if (values.tag_exclusive) tags.push("exclusive");
  if (values.tag_new) tags.push("new");
  if (values.tag_featured) tags.push("featured");

  const bookedFromForm =
    values.type === "rent" ? parseBookedDates(values.bookedDatesJson) : undefined;
  const bookedDates = bookedFromForm ?? preserve?.bookedDates;

  const normalizedTitle = values.title.trim();
  const normalizedDescription = values.description.trim();

  return {
    id,
    title_fr: normalizedTitle,
    title_en: values.title_en || normalizedTitle,
    title_ar: values.title_ar || normalizedTitle,
    description_fr: normalizedDescription,
    description_en: values.description_en || normalizedDescription,
    description_ar: values.description_ar || normalizedDescription,
    type: values.type,
    price: values.price,
    city: values.city,
    bedrooms: values.bedrooms,
    bathrooms: values.bathrooms,
    area: values.area,
    images,
    amenities,
    agent_id: values.agent_id || undefined,
    featured: values.featured,
    tags: tags.length > 0 ? tags : undefined,
    bookedDates,
  };
}

export function propertyToFormValues(p: Property): PropertyFormValues {
  return {
    title: fallbackTitle(p),
    title_en: p.title_en || "",
    title_ar: p.title_ar || "",
    description: fallbackDescription(p),
    description_en: p.description_en || "",
    description_ar: p.description_ar || "",
    type: p.type,
    price: p.price,
    city: p.city,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    area: p.area,
    images: [...p.images],
    amenitiesText: p.amenities.join(", "),
    agent_id: p.agent_id || "",
    featured: Boolean(p.featured),
    tag_exclusive: p.tags?.includes("exclusive") ?? false,
    tag_new: p.tags?.includes("new") ?? false,
    tag_featured: p.tags?.includes("featured") ?? false,
    bookedDatesJson: p.bookedDates?.length ? JSON.stringify(p.bookedDates, null, 2) : "",
  };
}
