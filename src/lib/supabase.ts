import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.VITE_Bolt_Database_URL ||
  (window as any)._env?.VITE_SUPABASE_URL;

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_Bolt_Database_ANON_KEY ||
  (window as any)._env?.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo: string;
  bio_en: string;
  bio_ar: string;
  bio_fr: string;
  created_at: string;
}

export interface Property {
  id: string;
  title_en: string;
  title_ar: string;
  title_fr: string;
  type: 'sale' | 'rent';
  price: number;
  city: string;
  area_m2: number;
  bedrooms: number;
  bathrooms: number;
  description_en: string;
  description_ar: string;
  description_fr: string;
  amenities: string[];
  images: string[];
  videos: string[];
  status: 'available' | 'sold' | 'rented';
  agent_id: string;
  created_at: string;
  agent?: Agent;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  property_id?: string;
  created_at: string;
}
