import type { Agent, Property, ServiceItem } from "@/lib/domain/types";
import type { AgentApiDto, PropertyApiDto, ServiceApiDto } from "@/lib/api/types";

const CITIES = new Set(["tlemcen", "ainTemouchent", "sidiBelAbbes"]);

function asCity(raw: string | undefined): Property["city"] {
  if (raw && CITIES.has(raw)) return raw as Property["city"];
  return "tlemcen";
}

export function mapPropertyFromApi(dto: PropertyApiDto): Property {
  const booked =
    dto.bookedDates ?? dto.booked_dates?.map((r) => ({ from: r.from, to: r.to })) ?? undefined;

  return {
    id: String(dto.id),
    title_en: dto.title_en ?? "",
    title_fr: dto.title_fr ?? "",
    title_ar: dto.title_ar ?? "",
    description_en: dto.description_en ?? "",
    description_fr: dto.description_fr ?? "",
    description_ar: dto.description_ar ?? "",
    type: dto.type === "rent" ? "rent" : "sale",
    price: Number(dto.price ?? 0),
    city: asCity(dto.city),
    bedrooms: Number(dto.bedrooms ?? 0),
    bathrooms: Number(dto.bathrooms ?? 0),
    area: Number(dto.area ?? 0),
    images: Array.isArray(dto.images) ? dto.images : [],
    amenities: Array.isArray(dto.amenities) ? dto.amenities : [],
    agent_id: String(dto.agent_id ?? dto.agentId ?? ""),
    bookedDates: booked,
    featured: Boolean(dto.featured),
    tags: dto.tags,
  };
}

export function mapAgentFromApi(dto: AgentApiDto): Agent {
  return {
    id: String(dto.id),
    name: dto.name ?? "",
    photo: dto.photo ?? "",
    phone: dto.phone ?? "",
    email: dto.email ?? "",
    bio_en: dto.bio_en ?? "",
    bio_fr: dto.bio_fr ?? "",
    bio_ar: dto.bio_ar ?? "",
  };
}

export function mapServiceFromApi(dto: ServiceApiDto): ServiceItem {
  return {
    id: String(dto.id),
    title_en: dto.title_en ?? "",
    title_fr: dto.title_fr ?? "",
    title_ar: dto.title_ar ?? "",
    description_en: dto.description_en ?? "",
    description_fr: dto.description_fr ?? "",
    description_ar: dto.description_ar ?? "",
    iconKey: dto.iconKey ?? dto.icon_key ?? "building",
  };
}
