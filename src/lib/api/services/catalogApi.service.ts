/**
 * Couche service : tous les appels HTTP métier (catalogue public + formulaires).
 */

import { ApiError, apiGet, apiPost } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { mapAgentFromApi, mapPropertyFromApi, mapServiceFromApi } from "@/lib/api/mappers";
import type { AgentApiDto, PropertyApiDto, ServiceApiDto } from "@/lib/api/types";
import type {
  Agent,
  ContactInquiryInput,
  Property,
  PropertyInquiryInput,
  ServiceItem,
} from "@/lib/domain/types";

function ensureArray<T>(raw: unknown, label: string): T[] {
  if (!Array.isArray(raw)) {
    throw new ApiError(`Invalid ${label} response: expected array`, 500);
  }
  return raw as T[];
}

export async function fetchPropertiesList(): Promise<Property[]> {
  const raw = ensureArray<PropertyApiDto>(
    await apiGet<PropertyApiDto[]>(API_ENDPOINTS.properties),
    "properties",
  );
  return raw.map(mapPropertyFromApi);
}

export async function fetchFeaturedProperties(): Promise<Property[]> {
  const raw = ensureArray<PropertyApiDto>(
    await apiGet<PropertyApiDto[]>(API_ENDPOINTS.propertiesFeatured),
    "featured properties",
  );
  return raw.map(mapPropertyFromApi);
}

export async function fetchPropertyById(id: string): Promise<Property | null> {
  try {
    const raw = await apiGet<PropertyApiDto>(API_ENDPOINTS.property(id));
    if (!raw || typeof raw !== "object" || raw.id == null || raw.id === "") {
      return null;
    }
    return mapPropertyFromApi(raw);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

export async function fetchAgentsList(): Promise<Agent[]> {
  const raw = ensureArray<AgentApiDto>(await apiGet<AgentApiDto[]>(API_ENDPOINTS.agents), "agents");
  return raw.map(mapAgentFromApi);
}

export async function fetchServicesList(): Promise<ServiceItem[]> {
  const raw = ensureArray<ServiceApiDto>(
    await apiGet<ServiceApiDto[]>(API_ENDPOINTS.services),
    "services",
  );
  return raw.map(mapServiceFromApi);
}

export async function submitContactForm(payload: ContactInquiryInput): Promise<void> {
  await apiPost(API_ENDPOINTS.contact, payload);
}

export async function submitPropertyInquiry(payload: PropertyInquiryInput): Promise<void> {
  await apiPost(API_ENDPOINTS.inquiries, payload);
}
