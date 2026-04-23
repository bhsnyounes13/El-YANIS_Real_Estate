/**
 * Couche API réservée aux administrateurs authentifiés (JWT Bearer).
 */

import { ApiError, apiDeleteAuth, apiGetAuth, apiPatchAuth, apiPostAuth } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { mapPropertyFromApi } from "@/lib/api/mappers";
import type { PropertyApiDto } from "@/lib/api/types";
import type { Property } from "@/lib/domain/types";

/** Corps POST/PATCH attendu par le backend (camelCase booleans où applicable). */
export function propertyToApiWriteBody(p: Property): Record<string, unknown> {
  return {
    title_en: p.title_en,
    title_fr: p.title_fr,
    title_ar: p.title_ar,
    description_en: p.description_en,
    description_fr: p.description_fr,
    description_ar: p.description_ar,
    type: p.type,
    price: Math.round(Number(p.price)),
    city: p.city,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    area: p.area,
    images: p.images,
    amenities: p.amenities,
    bookedDates: p.bookedDates ?? undefined,
    featured: Boolean(p.featured),
    tags: p.tags ?? undefined,
    agent_id: p.agent_id,
  };
}

export async function adminListProperties(): Promise<Property[]> {
  const raw = await apiGetAuth<PropertyApiDto[]>(API_ENDPOINTS.properties);
  if (!Array.isArray(raw)) {
    throw new ApiError("Réponse invalide : liste de biens attendue", 500);
  }
  return raw.map(mapPropertyFromApi);
}

export async function adminCreateProperty(p: Property): Promise<Property> {
  const raw = await apiPostAuth<PropertyApiDto>(
    API_ENDPOINTS.properties,
    propertyToApiWriteBody(p),
  );
  return mapPropertyFromApi(raw);
}

export async function adminUpdateProperty(p: Property): Promise<Property> {
  const raw = await apiPatchAuth<PropertyApiDto>(
    API_ENDPOINTS.property(p.id),
    propertyToApiWriteBody(p),
  );
  return mapPropertyFromApi(raw);
}

export async function adminDeleteProperty(id: string): Promise<void> {
  await apiDeleteAuth(API_ENDPOINTS.property(id));
}

export interface AdminInquiryApiRow {
  kind: "contact" | "property";
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject?: string;
  property_id?: string;
  property_title_fr?: string;
  preferred_date?: string;
  created_at: string;
}

export async function adminListInquiries(): Promise<AdminInquiryApiRow[]> {
  const raw = await apiGetAuth<{ items?: AdminInquiryApiRow[] }>(API_ENDPOINTS.adminInquiries);
  const items = raw.items;
  if (!Array.isArray(items)) {
    throw new ApiError("Réponse invalide : demandes admin attendues", 500);
  }
  return items;
}

export async function adminDeleteInquiry(kind: "contact" | "property", id: string): Promise<void> {
  const path =
    kind === "contact"
      ? API_ENDPOINTS.adminContactSubmission(id)
      : API_ENDPOINTS.adminPropertyInquiry(id);
  await apiDeleteAuth(path);
}

export interface AdminUserDto {
  id: string;
  email: string;
  role: "admin" | "user";
  createdAt: string;
  updatedAt: string;
}

export async function adminListUsers(): Promise<AdminUserDto[]> {
  const raw = await apiGetAuth<{ users?: AdminUserDto[] }>(API_ENDPOINTS.adminUsers);
  const users = raw.users;
  if (!Array.isArray(users)) {
    throw new ApiError("Réponse invalide : utilisateurs attendus", 500);
  }
  return users;
}

export async function adminUpdateUserRole(
  id: string,
  role: "admin" | "user",
): Promise<AdminUserDto> {
  const raw = await apiPatchAuth<{ user?: AdminUserDto }>(API_ENDPOINTS.adminUser(id), { role });
  const user = raw.user;
  if (!user) {
    throw new ApiError("Réponse invalide : utilisateur attendu", 500);
  }
  return user;
}

export async function adminDeleteUser(id: string): Promise<void> {
  await apiDeleteAuth(API_ENDPOINTS.adminUser(id));
}

export interface AdminDashboardStats {
  users: number;
  admins: number;
  properties: number;
  contactSubmissions: number;
  propertyInquiries: number;
}

export async function adminFetchDashboard(): Promise<{ stats: AdminDashboardStats }> {
  return apiGetAuth<{ stats: AdminDashboardStats }>(API_ENDPOINTS.adminDashboard);
}
