import { z } from "zod";
import type { BookedRange, Property, PropertyTag } from "@/lib/domain/types";

export const propertyFormSchema = z.object({
  title_en: z.string().min(2),
  title_fr: z.string().min(2),
  title_ar: z.string().min(2),
  description_en: z.string().min(10),
  description_fr: z.string().min(10),
  description_ar: z.string().min(10),
  type: z.enum(["sale", "rent"]),
  price: z.coerce.number().positive(),
  city: z.enum(["tlemcen", "ainTemouchent", "sidiBelAbbes"]),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().int().min(0),
  area: z.coerce.number().positive(),
  images: z.array(z.string().min(1)).min(1, "Ajoutez au moins une photo."),
  amenitiesText: z.string(),
  agent_id: z.string().min(1),
  featured: z.boolean(),
  tag_exclusive: z.boolean(),
  tag_new: z.boolean(),
  tag_featured: z.boolean(),
  bookedDatesJson: z.string().optional(),
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;

const emptyForm: PropertyFormValues = {
  title_en: "",
  title_fr: "",
  title_ar: "",
  description_en: "",
  description_fr: "",
  description_ar: "",
  type: "sale",
  price: 1,
  city: "tlemcen",
  bedrooms: 1,
  bathrooms: 1,
  area: 50,
  images: [] as string[],
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

  return {
    id,
    title_en: values.title_en,
    title_fr: values.title_fr,
    title_ar: values.title_ar,
    description_en: values.description_en,
    description_fr: values.description_fr,
    description_ar: values.description_ar,
    type: values.type,
    price: values.price,
    city: values.city,
    bedrooms: values.bedrooms,
    bathrooms: values.bathrooms,
    area: values.area,
    images: images.length > 0 ? images : [],
    amenities,
    agent_id: values.agent_id,
    featured: values.featured,
    tags: tags.length > 0 ? tags : undefined,
    bookedDates,
  };
}

export function propertyToFormValues(p: Property): PropertyFormValues {
  return {
    title_en: p.title_en,
    title_fr: p.title_fr,
    title_ar: p.title_ar,
    description_en: p.description_en,
    description_fr: p.description_fr,
    description_ar: p.description_ar,
    type: p.type,
    price: p.price,
    city: p.city,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    area: p.area,
    images: [...p.images],
    amenitiesText: p.amenities.join(", "),
    agent_id: p.agent_id,
    featured: Boolean(p.featured),
    tag_exclusive: p.tags?.includes("exclusive") ?? false,
    tag_new: p.tags?.includes("new") ?? false,
    tag_featured: p.tags?.includes("featured") ?? false,
    bookedDatesJson: p.bookedDates?.length ? JSON.stringify(p.bookedDates, null, 2) : "",
  };
}
