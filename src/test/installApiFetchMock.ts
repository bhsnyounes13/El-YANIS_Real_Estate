import { vi } from "vitest";
import type { Property } from "@/lib/domain/types";
import {
  demoAgents as agents,
  demoProperties as properties,
  demoServicesCatalog,
} from "@/test/fixtures/demoCatalog";

function toPropertyDto(p: Property) {
  return {
    id: p.id,
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
    images: p.images,
    amenities: p.amenities,
    agent_id: p.agent_id,
    booked_dates: p.bookedDates,
    featured: p.featured,
    tags: p.tags,
  };
}

/**
 * Simule l’API Express (mêmes formes que le backend) pour les tests Vitest.
 * Ne s’applique qu’aux URL contenant `/api/`.
 */
export function installApiFetchMock() {
  vi.stubGlobal("fetch", (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url =
      typeof input === "string" ? input : input instanceof Request ? input.url : String(input);
    const method = init?.method ?? "GET";

    if (
      method === "POST" &&
      (url.includes("/api/contact") ||
        url.includes("/api/inquiries") ||
        url.includes("/api/auth/login") ||
        url.includes("/api/auth/register"))
    ) {
      return Promise.resolve(
        new Response(JSON.stringify({ ok: true }), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        }),
      );
    }

    if (!url.includes("/api/")) {
      return Promise.reject(new Error(`Unmocked fetch: ${url}`));
    }

    if (url.includes("/api/properties/featured")) {
      const list = properties.filter((p) => p.featured);
      return Promise.resolve(
        new Response(JSON.stringify(list.map(toPropertyDto)), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );
    }

    const oneProperty = url.match(/\/api\/properties\/([^/?#]+)$/);
    if (oneProperty && !url.includes("featured")) {
      const id = decodeURIComponent(oneProperty[1]!);
      const p = properties.find((x) => x.id === id);
      if (!p) {
        return Promise.resolve(
          new Response(JSON.stringify({ error: "Property not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }
      return Promise.resolve(
        new Response(JSON.stringify(toPropertyDto(p)), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );
    }

    if (url.includes("/api/properties")) {
      return Promise.resolve(
        new Response(JSON.stringify(properties.map(toPropertyDto)), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );
    }

    if (url.includes("/api/agents")) {
      return Promise.resolve(
        new Response(
          JSON.stringify(
            agents.map((a) => ({
              id: a.id,
              name: a.name,
              photo: a.photo,
              phone: a.phone,
              email: a.email,
              bio_en: a.bio_en,
              bio_fr: a.bio_fr,
              bio_ar: a.bio_ar,
            })),
          ),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      );
    }

    if (url.includes("/api/admin/inquiries")) {
      return Promise.resolve(
        new Response(JSON.stringify({ items: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );
    }

    if (url.includes("/api/services")) {
      return Promise.resolve(
        new Response(
          JSON.stringify(
            demoServicesCatalog.map((s) => ({
              id: s.id,
              title_en: s.title_en,
              title_fr: s.title_fr,
              title_ar: s.title_ar,
              description_en: s.description_en,
              description_fr: s.description_fr,
              description_ar: s.description_ar,
              icon_key: s.iconKey,
              iconKey: s.iconKey,
            })),
          ),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      );
    }

    return Promise.resolve(new Response(JSON.stringify({ error: "unmocked" }), { status: 404 }));
  });
}
