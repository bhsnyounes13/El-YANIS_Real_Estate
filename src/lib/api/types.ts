export type {
  Property,
  Agent,
  ServiceItem,
  ContactInquiryInput,
  PropertyInquiryInput,
  CityKey,
  PropertyType,
  PropertyTag,
} from "@/lib/domain/types";

/** Raw API payload — tolerant to snake_case from backend */
export interface PropertyApiDto {
  id: string;
  title_en?: string;
  title_fr?: string;
  title_ar?: string;
  description_en?: string;
  description_fr?: string;
  description_ar?: string;
  type?: "sale" | "rent";
  price?: number;
  city?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  images?: string[];
  amenities?: string[];
  agent_id?: string;
  agentId?: string;
  booked_dates?: { from: string; to: string }[];
  bookedDates?: { from: string; to: string }[];
  featured?: boolean;
  tags?: ("exclusive" | "new" | "featured")[];
}

export interface AgentApiDto {
  id: string;
  name?: string;
  photo?: string;
  phone?: string;
  email?: string;
  bio_en?: string;
  bio_fr?: string;
  bio_ar?: string;
}

export interface ServiceApiDto {
  id: string;
  title_en?: string;
  title_fr?: string;
  title_ar?: string;
  description_en?: string;
  description_fr?: string;
  description_ar?: string;
  icon_key?: string;
  iconKey?: string;
}

export interface InquiryResponseDto {
  id?: string;
  ok?: boolean;
}
