export type CityKey = "tlemcen" | "ainTemouchent" | "sidiBelAbbes";

export type PropertyType = "sale" | "rent";

export type PropertyTag = "exclusive" | "new" | "featured";

export interface BookedRange {
  from: string;
  to: string;
}

export interface Property {
  id: string;
  title_en: string;
  title_fr: string;
  title_ar: string;
  description_en: string;
  description_fr: string;
  description_ar: string;
  type: PropertyType;
  price: number;
  city: CityKey;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  amenities: string[];
  agent_id?: string;
  bookedDates?: BookedRange[];
  featured?: boolean;
  tags?: PropertyTag[];
}

export type AgentStatus = "active" | "inactive";

export interface Agent {
  id: string;
  name: string;
  photo?: string;
  phone: string;
  email?: string;
  whatsapp?: string;
  position?: string;
  agency_name?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  status?: AgentStatus;
  bio_en?: string;
  bio_fr?: string;
  bio_ar?: string;
}

export interface ServiceItem {
  id: string;
  title_en: string;
  title_fr: string;
  title_ar: string;
  description_en: string;
  description_fr: string;
  description_ar: string;
  iconKey: string;
}

export interface ContactInquiryInput {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  /** Jeton Turnstile — validé côté serveur uniquement. */
  turnstileToken?: string;
}

export interface PropertyInquiryInput extends ContactInquiryInput {
  propertyId: string;
  preferredDate?: string;
}
