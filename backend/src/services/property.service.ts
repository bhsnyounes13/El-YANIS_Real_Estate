import type { CityKey, Prisma, PropertyType } from "@prisma/client";
import { prisma } from "../prisma.js";
import { HttpError } from "../errors/http-error.js";
import { randomUUID } from "crypto";

export interface ListPropertyFilters {
  city?: CityKey;
  type?: PropertyType;
  featured?: boolean;
  q?: string;
}

// Development mode in-memory storage
const isDevMode = () => process.env.NODE_ENV !== "production";
const propertyStore = new Map<string, any>();

export async function listProperties(filters: ListPropertyFilters) {
  if (isDevMode()) {
    let results = Array.from(propertyStore.values());

    if (filters.city) results = results.filter((p) => p.city === filters.city);
    if (filters.type) results = results.filter((p) => p.type === filters.type);
    if (filters.featured !== undefined) results = results.filter((p) => p.featured === filters.featured);

    if (filters.q) {
      const q = filters.q.toLowerCase();
      results = results.filter(
        (p) =>
          p.titleEn?.toLowerCase().includes(q) ||
          p.titleFr?.toLowerCase().includes(q) ||
          p.titleAr?.toLowerCase().includes(q),
      );
    }

    return results.sort((a, b) => (b.featured ? 1 : -1) || b.updatedAt - a.updatedAt);
  }

  const where: Prisma.PropertyWhereInput = {};

  if (filters.city) where.city = filters.city as CityKey;
  if (filters.type) where.type = filters.type as PropertyType;
  if (filters.featured !== undefined) where.featured = filters.featured;

  const q = filters.q?.trim();
  if (q) {
    where.OR = [
      { titleEn: { contains: q, mode: "insensitive" } },
      { titleFr: { contains: q, mode: "insensitive" } },
      { titleAr: { contains: q, mode: "insensitive" } },
    ];
  }

  return prisma.property.findMany({
    where,
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
  });
}

export async function listFeaturedProperties(limit = 24) {
  if (isDevMode()) {
    return Array.from(propertyStore.values())
      .filter((p) => p.featured)
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, limit);
  }

  return prisma.property.findMany({
    where: { featured: true },
    orderBy: { updatedAt: "desc" },
    take: limit,
  });
}

export async function getPropertyById(id: string) {
  if (isDevMode()) {
    const p = propertyStore.get(id);
    if (!p) throw new HttpError(404, "Property not found", { code: "PROPERTY_NOT_FOUND" });
    return p;
  }

  const p = await prisma.property.findUnique({ where: { id } });
  if (!p) throw new HttpError(404, "Property not found", { code: "PROPERTY_NOT_FOUND" });
  return p;
}

export async function createProperty(data: {
  titleEn: string;
  titleFr: string;
  titleAr: string;
  descriptionEn: string;
  descriptionFr: string;
  descriptionAr: string;
  type: PropertyType;
  price: number;
  city: CityKey;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: Prisma.InputJsonValue;
  amenities: Prisma.InputJsonValue;
  bookedDates?: Prisma.InputJsonValue | null;
  featured: boolean;
  tags?: Prisma.InputJsonValue | null;
  agentId?: string;
}) {
  if (isDevMode()) {
    const id = randomUUID();
    const now = new Date();
    const property = {
      id,
      titleEn: data.titleEn,
      titleFr: data.titleFr,
      titleAr: data.titleAr,
      descriptionEn: data.descriptionEn,
      descriptionFr: data.descriptionFr,
      descriptionAr: data.descriptionAr,
      type: data.type,
      price: data.price,
      city: data.city,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      area: data.area,
      images: data.images,
      amenities: data.amenities,
      bookedDates: data.bookedDates ?? null,
      featured: data.featured,
      tags: data.tags ?? null,
      agentId: data.agentId || null,
      createdAt: now,
      updatedAt: now,
    };
    propertyStore.set(id, property);
    return property;
  }

  if (data.agentId) {
    const agent = await prisma.agent.findUnique({ where: { id: data.agentId } });
    if (!agent) throw new HttpError(400, "Invalid agent_id", { code: "INVALID_AGENT" });
  }

  return prisma.property.create({
    data: {
      titleEn: data.titleEn,
      titleFr: data.titleFr,
      titleAr: data.titleAr,
      descriptionEn: data.descriptionEn,
      descriptionFr: data.descriptionFr,
      descriptionAr: data.descriptionAr,
      type: data.type,
      price: data.price,
      city: data.city,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      area: data.area,
      images: data.images,
      amenities: data.amenities,
      bookedDates: data.bookedDates ?? undefined,
      featured: data.featured,
      tags: data.tags ?? undefined,
      agentId: data.agentId,
    },
  });
}

export async function updateProperty(
  id: string,
  patch: Partial<{
    titleEn: string;
    titleFr: string;
    titleAr: string;
    descriptionEn: string;
    descriptionFr: string;
    descriptionAr: string;
    type: PropertyType;
    price: number;
    city: CityKey;
    bedrooms: number;
    bathrooms: number;
    area: number;
    images: Prisma.InputJsonValue;
    amenities: Prisma.InputJsonValue;
    bookedDates: Prisma.InputJsonValue | null;
    featured: boolean;
    tags: Prisma.InputJsonValue | null;
    agentId: string;
  }>,
) {
  if (isDevMode()) {
    const existing = await getPropertyById(id);
    if (patch.agentId) {
      // In dev mode, we don't validate agent existence
    }
    const updated = { ...existing, ...patch, updatedAt: new Date() };
    propertyStore.set(id, updated);
    return updated;
  }

  await getPropertyById(id);

  if (patch.agentId) {
    const agent = await prisma.agent.findUnique({ where: { id: patch.agentId } });
    if (!agent) throw new HttpError(400, "Invalid agent_id", { code: "INVALID_AGENT" });
  }

  return prisma.property.update({
    where: { id },
    data: patch as Prisma.PropertyUncheckedUpdateInput,
  });
}

export async function deleteProperty(id: string): Promise<void> {
  if (isDevMode()) {
    await getPropertyById(id);
    propertyStore.delete(id);
    return;
  }

  await getPropertyById(id);
  await prisma.property.delete({ where: { id } });
}
