# EL-YANIS Real Estate Platform v2.1 — Full UI/UX + Backend Architecture Spec

> This document contains everything another AI needs to rebuild the entire application from scratch.

---

## TABLE OF CONTENTS

1. [Tech Stack](#1-tech-stack)
2. [Design System](#2-design-system)
3. [Database Schema (Supabase/PostgreSQL)](#3-database-schema)
4. [Authentication Flow](#4-authentication-flow)
5. [Row Level Security (RLS) Policies](#5-row-level-security-policies)
6. [API / Data Access Patterns](#6-api--data-access-patterns)
7. [Page-by-Page UI/UX Specifications](#7-page-by-page-uiux-specifications)
8. [Component Specifications](#8-component-specifications)
9. [State Management](#9-state-management)
10. [Routing Structure](#10-routing-structure)
11. [Supabase Edge Functions](#11-supabase-edge-functions)
12. [Storage Configuration](#12-storage-configuration)
13. [Internationalization (i18n)](#13-internationalization)
14. [Responsive Breakpoints](#14-responsive-breakpoints)
15. [Animations & Transitions](#15-animations--transitions)

---

## 1. TECH STACK

```
Frontend:
  - React 18 (functional components + hooks only)
  - TypeScript (strict mode)
  - Vite 5 (bundler + dev server)
  - Tailwind CSS 3 (styling)
  - React Router DOM v7 (routing)
  - Zustand 5 (state management — auth only)
  - Lucide React (icon library)

Backend:
  - Supabase (PostgreSQL + Auth + Storage + Edge Functions)
  - Resend API (email delivery via Edge Function)

PWA:
  - Service Worker (via Vite PWA plugin or manual)
  - Web App Manifest
  - Environment detection hook (web vs pwa, mobile vs desktop)
```

---

## 2. DESIGN SYSTEM

### 2.1 Colors

```css
/* Primary Brand — EL-YANIS Blue */
--blue-50:  #EFF6FF
--blue-100: #DBEAFE
--blue-500: #3B82F6
--blue-600: #2563EB    /* Primary button, links, accents */
--blue-700: #1D4ED8
--blue-800: #1E40AF
--blue-900: #1E3A8A

/* Gradients */
--gradient-primary: linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)
--gradient-hero:    linear-gradient(135deg, #2563EB 0%, #1D4ED8 50%, #0891B2 100%)

/* Neutrals */
--gray-50:  #F9FAFB   /* Page background */
--gray-100: #F3F4F6
--gray-200: #E5E7EB   /* Borders, dividers */
--gray-300: #D1D5DB
--gray-400: #9CA3AF   /* Placeholder text */
--gray-500: #6B7280
--gray-600: #4B5563
--gray-700: #374151
--gray-800: #1F2937
--gray-900: #111827

/* Text */
--text-primary:   #1A1A1A
--text-secondary: #717171
--text-disabled:  #D4D4D4
--text-white:     #FFFFFF

/* Semantic */
--success:        #22C55E
--success-light:  #F0FDF4
--error:          #EF4444
--error-light:    #FEF2F2
--error-border:   #FECACA
--warning:        #F59E0B
--warning-light:  #FFFBEB

/* Dark Mode */
--dark-bg:        #111827
--dark-surface:   #1F2937
--dark-card:      #1F2937
--dark-border:    #374151
--dark-input:     #374151
--dark-text:      #F9FAFB
--dark-text-muted:#9CA3AF
```

### 2.2 Typography

```
Font Family: Inter, system-ui, -apple-system, sans-serif

Scale:
  hero-title:       48px / 700 / line-height 1.1
  section-title:    32px / 700 / line-height 1.2
  card-title:       20px / 700 / line-height 1.3
  price-display:    24px / 700 / line-height 1.2
  total-price:      18px / 700 / line-height 1.3
  body-lg:          16px / 400 / line-height 1.6
  body-md:          15px / 500 / line-height 1.5
  body-sm:          14px / 400 / line-height 1.5
  label:            13px / 600 / line-height 1.4
  caption:          12px / 500 / line-height 1.4
  micro:            11px / 600 / letter-spacing 0.05em / uppercase
  nav-link:         14px / 500

Font Weights Used:
  400 (regular)
  500 (medium)
  600 (semibold)
  700 (bold)
```

### 2.3 Spacing Scale

```
xs:   4px
sm:   8px
md:   12px
base: 16px
lg:   20px
xl:   24px
2xl:  32px
3xl:  48px
4xl:  64px
```

### 2.4 Border Radius

```
sm:   8px    (inputs, small elements)
md:   12px   (buttons, date pickers, form groups)
lg:   16px   (property cards, calendar panels)
xl:   20px   (widget cards, modals)
full: 50%    (avatars, circular buttons)
```

### 2.5 Shadows

```
card:     0 4px 24px rgba(0,0,0,0.08)
button:   0 8px 20px rgba(37,99,235,0.3)
modal:    0 20px 60px rgba(0,0,0,0.15)
search:   0 8px 24px rgba(0,0,0,0.15)
hover:    0 4px 12px rgba(0,0,0,0.1)
```

### 2.6 Component Sizes

```
Input height:       48px (standard), 52px (date picker)
Button height:      48px
Icon size:          16px (inline), 20px (buttons), 24px (standalone)
Avatar size:        40px (small), 64px (medium), 96px (large)
Card max-width:     380px (property card)
Container max:      1280px (max-w-7xl)
Sidebar width:      320px (filters)
```

---

## 3. DATABASE SCHEMA

### 3.1 Full PostgreSQL Schema

```sql
-- ============================================
-- ENUM TYPES
-- ============================================
CREATE TYPE rental_category AS ENUM ('long_term', 'short_term');
CREATE TYPE price_period AS ENUM ('night', 'month');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled');
CREATE TYPE user_role AS ENUM ('user', 'agent', 'admin');
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE property_status AS ENUM ('available', 'sold', 'rented');
CREATE TYPE property_type AS ENUM ('sale', 'rent');

-- ============================================
-- TABLE: agents
-- ============================================
CREATE TABLE agents (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  email         text NOT NULL UNIQUE,
  phone         text,
  photo         text,
  bio_en        text,
  bio_ar        text,
  bio_fr        text,
  created_at    timestamptz DEFAULT now()
);

-- ============================================
-- TABLE: properties
-- ============================================
CREATE TABLE properties (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en              text,
  title_ar              text,
  title_fr              text,
  type                  property_type NOT NULL,
  price                 numeric,
  city                  text NOT NULL,
  area_m2               numeric,
  bedrooms              integer,
  bathrooms             integer,
  description_en        text,
  description_ar        text,
  description_fr        text,
  amenities             text[] DEFAULT '{}',
  images                text[] DEFAULT '{}',
  videos                text[] DEFAULT '{}',
  status                property_status DEFAULT 'available',
  agent_id              uuid REFERENCES agents(id) ON DELETE SET NULL,

  -- Short-term rental fields
  rental_category       rental_category DEFAULT 'long_term',
  price_period          price_period DEFAULT 'month',
  minimum_nights        integer DEFAULT 1,
  maximum_nights        integer DEFAULT 365,
  cleaning_fee          numeric DEFAULT 0,
  security_deposit      numeric DEFAULT 0,
  max_guests            integer DEFAULT 4,
  instant_book          boolean DEFAULT false,

  created_at            timestamptz DEFAULT now()
);

-- ============================================
-- TABLE: inquiries
-- ============================================
CREATE TABLE inquiries (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  email         text NOT NULL,
  phone         text NOT NULL,
  message       text NOT NULL,
  property_id   uuid REFERENCES properties(id) ON DELETE SET NULL,
  created_at    timestamptz DEFAULT now()
);

-- ============================================
-- TABLE: appointments
-- ============================================
CREATE TABLE appointments (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id       uuid REFERENCES properties(id) ON DELETE CASCADE,
  agent_id          uuid REFERENCES agents(id) ON DELETE CASCADE,
  client_name       text NOT NULL,
  client_email      text NOT NULL,
  client_phone      text NOT NULL,
  appointment_date  date NOT NULL,
  appointment_time  text NOT NULL,
  status            appointment_status DEFAULT 'pending',
  notes             text,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now(),

  UNIQUE(agent_id, appointment_date, appointment_time)
);

-- ============================================
-- TABLE: bookings (SHORT-TERM RENTAL)
-- ============================================
CREATE TABLE bookings (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id       uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  guest_name        text NOT NULL,
  guest_email       text NOT NULL,
  guest_phone       text NOT NULL,
  check_in_date     date NOT NULL,
  check_out_date    date NOT NULL,
  number_of_nights  integer NOT NULL,
  nightly_rate      numeric NOT NULL,
  base_price        numeric NOT NULL,
  cleaning_fee      numeric DEFAULT 0,
  service_fee       numeric DEFAULT 0,
  total_price       numeric NOT NULL,
  booking_status    booking_status DEFAULT 'pending',
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now(),

  CONSTRAINT valid_dates CHECK (check_out_date > check_in_date),
  CONSTRAINT positive_prices CHECK (total_price > 0)
);

CREATE INDEX idx_bookings_property_id ON bookings(property_id);
CREATE INDEX idx_bookings_check_in ON bookings(check_in_date);
CREATE INDEX idx_bookings_check_out ON bookings(check_out_date);
CREATE INDEX idx_bookings_status ON bookings(booking_status);

-- ============================================
-- TABLE: availability (DATE BLOCKING)
-- ============================================
CREATE TABLE availability (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id             uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  date                    date NOT NULL,
  is_available            boolean DEFAULT true,
  price_override          numeric,
  minimum_nights_override integer,
  created_at              timestamptz DEFAULT now(),

  UNIQUE(property_id, date)
);

CREATE INDEX idx_availability_property_date ON availability(property_id, date);

-- ============================================
-- TABLE: admins (LEGACY — deprecated, kept for migration)
-- ============================================
CREATE TABLE admins (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username      text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  email         text,
  full_name     text,
  is_active     boolean DEFAULT true,
  created_at    timestamptz DEFAULT now(),
  last_login    timestamptz
);

-- ============================================
-- TABLE: profiles (Supabase Auth extension)
-- ============================================
CREATE TABLE profiles (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role          user_role DEFAULT 'user',
  full_name     text,
  phone         text,
  avatar_url    text,
  is_active     boolean DEFAULT true,
  last_login_at timestamptz,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);
```

### 3.2 Database Functions & Triggers

```sql
-- Auto-update updated_at on bookings
CREATE OR REPLACE FUNCTION update_bookings_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_bookings_updated_at();

-- Auto-update updated_at on appointments
CREATE OR REPLACE FUNCTION update_appointments_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_appointments_updated_at();

-- Prevent double-booking
CREATE OR REPLACE FUNCTION prevent_overlapping_bookings()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  overlap_count integer;
BEGIN
  -- Check for overlapping confirmed/pending bookings
  SELECT COUNT(*) INTO overlap_count
  FROM bookings
  WHERE property_id = NEW.property_id
    AND booking_status != 'cancelled'
    AND check_in_date < NEW.check_out_date
    AND check_out_date > NEW.check_in_date;

  IF overlap_count > 0 THEN
    RAISE EXCEPTION 'Property is not available for the selected dates. Overlapping booking detected.';
  END IF;

  -- Check for admin-blocked dates
  SELECT COUNT(*) INTO overlap_count
  FROM availability
  WHERE property_id = NEW.property_id
    AND is_available = false
    AND date >= NEW.check_in_date
    AND date < NEW.check_out_date;

  IF overlap_count > 0 THEN
    RAISE EXCEPTION 'Property is not available. Some dates are blocked.';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_prevent_overlapping_bookings
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION prevent_overlapping_bookings();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  INSERT INTO public.profiles (user_id, role, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'role', 'user'), NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update last_login_at
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  UPDATE public.profiles SET last_login_at = now() WHERE user_id = NEW.id;
  RETURN NEW;
END;
$$;

-- Calculate booking total (utility)
CREATE OR REPLACE FUNCTION calculate_booking_total(
  p_nightly_rate numeric,
  p_nights integer,
  p_cleaning_fee numeric DEFAULT 0,
  p_service_fee_percentage numeric DEFAULT 12
) RETURNS numeric LANGUAGE plpgsql AS $$
DECLARE
  base_price numeric;
  service_fee numeric;
  total numeric;
BEGIN
  base_price := p_nightly_rate * p_nights;
  service_fee := base_price * (p_service_fee_percentage / 100);
  total := base_price + p_cleaning_fee + service_fee;
  RETURN total;
END;
$$;
```

---

## 4. AUTHENTICATION FLOW

### 4.1 Architecture

```
Supabase Auth (JWT-based)
  ├── Email/Password
  ├── OAuth (Google, GitHub, etc.)
  ├── Magic Link
  └── Password Reset

Profile System:
  auth.users (managed by Supabase)
      ↓ (trigger: handle_new_user)
  profiles table (role, full_name, phone, avatar_url)
      ↓
  Zustand authStore (client state)
```

### 4.2 Auth Store (Zustand)

```typescript
interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  role: 'user' | 'agent' | 'admin' | null;
  isLoading: boolean;
  isInitialized: boolean;

  initialize(): Promise<void>;
  signIn(email: string, password: string): Promise<AuthResult>;
  signUp(data: SignUpData): Promise<AuthResult>;
  signOut(): Promise<void>;
  refreshProfile(): Promise<void>;
}
```

### 4.3 Auth Flow Sequence

```
1. App mounts → authStore.initialize()
2. Get session from Supabase: supabase.auth.getSession()
3. If session exists:
   a. Set user + session in store
   b. Fetch profile: supabase.from('profiles').eq('user_id', userId).single()
   c. Set profile + role in store
4. Subscribe to auth changes: supabase.auth.onAuthStateChange()
   a. On SIGNED_IN → refreshProfile()
   b. On SIGNED_OUT → clear all state
5. ProtectedRoute checks:
   a. If !user → redirect to /auth/signin
   b. If role !== requiredRole → redirect to /
6. Sign out:
   a. supabase.auth.signOut()
   b. Clear store state
   c. Redirect to /
```

### 4.4 Role-Based Access

```
Public (no auth):
  - View properties (status = 'available')
  - View agents
  - Submit inquiries
  - Create bookings
  - View availability
  - Create appointments

Authenticated (any role):
  - Update own bookings
  - Full CRUD on availability
  - View own profile

Admin (role = 'admin'):
  - Full CRUD on properties
  - Full CRUD on agents
  - View + delete inquiries
  - Update + delete appointments
  - View + update + delete all profiles
  - Access /admin/dashboard
```

---

## 5. ROW LEVEL SECURITY (RLS) POLICIES

```sql
-- PROPERTIES
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view available properties"
  ON properties FOR SELECT TO public
  USING (status = 'available' OR auth.uid() IN (
    SELECT user_id FROM profiles WHERE role = 'admin'
  ));
CREATE POLICY "Admins full access properties"
  ON properties FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- AGENTS
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view agents"
  ON agents FOR SELECT TO public USING (true);
CREATE POLICY "Admins full access agents"
  ON agents FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- INQUIRIES
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit inquiries"
  ON inquiries FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Admins can view inquiries"
  ON inquiries FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete inquiries"
  ON inquiries FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- APPOINTMENTS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create appointments"
  ON appointments FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can view appointments"
  ON appointments FOR SELECT TO public USING (true);
CREATE POLICY "Admins can update appointments"
  ON appointments FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete appointments"
  ON appointments FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- BOOKINGS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view bookings"
  ON bookings FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Authenticated can update bookings"
  ON bookings FOR UPDATE TO authenticated USING (true);

-- AVAILABILITY
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view availability"
  ON availability FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated can manage availability"
  ON availability FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- PROFILES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete profiles"
  ON profiles FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));
```

---

## 6. API / DATA ACCESS PATTERNS

### 6.1 Supabase Client Setup

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  || import.meta.env.VITE_Bolt_Database_URL
  || window._env?.VITE_SUPABASE_URL;

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  || import.meta.env.VITE_Bolt_Database_ANON_KEY
  || window._env?.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});
```

### 6.2 Query Patterns (used throughout the app)

```typescript
// FETCH ALL PROPERTIES (with filters)
const { data, error } = await supabase
  .from('properties')
  .select('*, agent:agents(*)')
  .eq('status', 'available')
  .eq('type', filters.type)          // optional
  .eq('city', filters.city)          // optional
  .gte('price', filters.minPrice)    // optional
  .lte('price', filters.maxPrice)    // optional
  .or(`title.ilike.%${search}%,city.ilike.%${search}%`)
  .order('created_at', { ascending: false });

// FETCH SINGLE PROPERTY
const { data, error } = await supabase
  .from('properties')
  .select('*')
  .eq('id', propertyId)
  .maybeSingle();

// FETCH AGENT
const { data, error } = await supabase
  .from('agents')
  .select('*')
  .eq('id', agentId)
  .maybeSingle();

// CREATE BOOKING
const { data, error } = await supabase
  .from('bookings')
  .insert({
    property_id,
    guest_name,
    guest_email,
    guest_phone,
    check_in_date,
    check_out_date,
    number_of_nights,
    nightly_rate,
    base_price,
    cleaning_fee,
    service_fee,
    total_price,
    booking_status: instantBook ? 'confirmed' : 'pending',
  })
  .select()
  .single();

// FETCH BLOCKED DATES
const { data: bookings } = await supabase
  .from('bookings')
  .select('check_in_date, check_out_date')
  .eq('property_id', propertyId)
  .neq('booking_status', 'cancelled')
  .gte('check_in_date', startDate)
  .lte('check_out_date', endDate);

const { data: availability } = await supabase
  .from('availability')
  .select('date, is_available')
  .eq('property_id', propertyId)
  .eq('is_available', false)
  .gte('date', startDate)
  .lte('date', endDate);

// CREATE INQUIRY
const { error } = await supabase
  .from('inquiries')
  .insert({ name, email, phone, message, property_id });

// CREATE APPOINTMENT
const { error } = await supabase
  .from('appointments')
  .insert({
    property_id, agent_id, client_name, client_email,
    client_phone, appointment_date, appointment_time,
    status: 'pending', notes,
  });

// UPLOAD IMAGE TO STORAGE
const { data, error } = await supabase.storage
  .from('property-images')
  .upload(`${Date.now()}-${fileName}`, file, {
    cacheControl: '3600',
    upsert: false,
  });

const { data: { publicUrl } } = supabase.storage
  .from('property-images')
  .getPublicUrl(data.path);

// INSERT PROPERTY
const { error } = await supabase
  .from('properties')
  .insert([{ title_en, type, price, city, images, videos, ... }]);

// UPDATE PROPERTY
const { error } = await supabase
  .from('properties')
  .update({ title_en, type, price, ... })
  .eq('id', propertyId);

// DELETE PROPERTY
const { error } = await supabase
  .from('properties')
  .delete()
  .eq('id', propertyId);
```

### 6.3 Edge Function Call Pattern

```typescript
const response = await fetch(
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name, email, phone, message,
      propertyTitle, propertyId,
    }),
  }
);
```

---

## 7. PAGE-BY-PAGE UI/UX SPECIFICATIONS

### 7.1 Home Page (`/`)

```
Layout:
  - Full-width hero section (480px height)
  - 3-column features row
  - 3-column property cards grid
  - "View All" button centered below

Hero Section:
  Background: gradient(135deg, #2563EB → #1D4ED8 → #0891B2)
  Overlay: subtle SVG grid pattern at 10% opacity
  Title: "Find Your Dream Property in Algeria" — 48px/700/white/centered
  Subtitle: 18px/white/80% opacity/centered/max-width 3xl

  Search Box (centered, floating card):
    Container: 800px wide, white/95% opacity, rounded-2xl, shadow-2xl
    Row 1:
      - Search input (flex-2): placeholder "Search by keyword or city...", 48px height
      - Type dropdown (flex-1): "All Types" | "For Sale" | "For Rent"
      - City dropdown (flex-1): "All Cities" | "Tlemcen" | "Ain Temouchent" | "Sidi Bel Abbès"
    Row 2:
      - Full-width button: "Search Properties" with Search icon, gradient bg, 48px height

Features Row (3 columns, centered icons):
  Each feature:
    Icon: 64px circle, bg blue-100, icon blue-600
    Title: 20px/700
    Description: 14px/gray-600
  Features:
    1. Building2 icon → "Premium Properties"
    2. Users icon → "Expert Agents"
    3. Award icon → "Trusted Service"

Property Cards Grid:
  3 columns on desktop, 2 on tablet, 1 on mobile
  Cards: 380px max, white bg, rounded-xl, shadow-md
  Image: 100% width, 200px height, object-cover
  Badge: top-left, "For Sale" (blue) or "For Rent" (green), rounded-full
  Title: 18px/700
  City: 14px/gray-500 with MapPin icon
  Price: 20px/700/blue-600
  Details: "4 beds · 3 baths · 250 m²" — 13px/gray-500
```

### 7.2 Listings Page (`/listings`)

```
Layout:
  - Page header with title + count
  - Two-column layout: sidebar (320px) + main content
  - Sidebar sticky on desktop

Header:
  Title: "Property Listings" — 32px/700
  Subtitle: "{count} Discover your perfect property" — 14px/gray-500
  Mobile: "Filters" button (blue bg) toggles sidebar

Sidebar Filters:
  Container: white bg, rounded-xl, shadow-md, padding 24px, sticky top-24
  Fields:
    1. Search input: "Keyword or city..."
    2. Type dropdown: All | Sale | Rent
    3. City dropdown: All | Tlemcen | Ain Temouchent | Sidi Bel Abbès
    4. Price Range: two inputs (Min / Max) side by side
    5. Bedrooms dropdown: Any | 1+ | 2+ | 3+ | 4+
    6. Bathrooms dropdown: Any | 1+ | 2+ | 3+
  "Clear" button: blue text with X icon

Main Content:
  Loading: centered spinner
  Empty: centered "No properties found" message
  Grid: 2 columns on desktop, 1 on mobile
  PropertyCard components (same as home page)
```

### 7.3 Property Details Page (`/property/:id`)

```
Layout:
  - Two-column: main content (2/3) + sidebar (1/3)
  - Sidebar is sticky top-24 on desktop

Back Button:
  "← Back to listings" — blue text, hover underline

Main Content (left column):
  Image Gallery:
    - 384px height, relative container
    - Current image: object-cover, full width/height
    - Prev/Next buttons: absolute, white bg/80%, rounded-full, chevron icons
    - Image counter: "3 / 8" — absolute bottom-center, black/50% bg
    - Touch swipe support on mobile
    - Keyboard arrow navigation

  Video Section (if videos exist):
    - Grid 2 columns
    - Video player: 256px height, object-contain, controls

  Property Info:
    - Badge: "For Sale" or "For Rent" — blue/green bg, rounded-full
    - Status badge: "sold" / "rented" — gray bg (if not available)
    - Title: 30px/700
    - City: 18px/gray-500 with MapPin icon
    - Price: 30px/700/blue-600 with Tag icon, OR "Price on request"
    - Divider line
    - Stats row: Bed icon + "4 Bedrooms" | Bath icon + "3 Bathrooms" | Maximize icon + "250 m²"
    - Description: 16px/gray-700, whitespace-pre-line
    - Amenities: 2-column grid, Check icon (green) + amenity name

Sidebar (right column, sticky):
  IF short-term rental:
    → BookingWidget component (see section 8.2)
  ELSE:
    → AgentCard component
    → AppointmentBooking component
  → Contact form (always shown)
    - Title: "Send Us a Message" — 20px/700
    - Fields: Name, Email, Phone, Message (textarea 4 rows)
    - Submit button: blue bg, Mail icon, "Send Message"
    - Success state: green banner with Check icon
```

### 7.4 Admin Dashboard (`/admin/dashboard`)

```
Layout:
  - Dark theme (slate-800/900)
  - Header with title + logout
  - Tab navigation: Properties | Inquiries | Appointments
  - Stats cards row
  - Data tables per tab

Header:
  Title: "لوحة التحكم" (Dashboard) — white/24px/bold
  Logout button: red text, LogOut icon

Stats Cards (4 columns):
  Each card: slate-800 bg, rounded-lg, padding 24px
  Icon: 40px circle, colored bg
  Number: 32px/700/white
  Label: 14px/slate-400
  Cards:
    1. Properties (blue icon)
    2. Inquiries (yellow icon)
    3. Appointments (green icon)
    4. Agents (purple icon)

Properties Tab:
  "Add Property" button: blue bg, Plus icon
  Table:
    Columns: Image (thumbnail), Title, Type, Price, City, Status, Actions
    Status badges: Available (green), Sold (yellow), Rented (blue)
    Actions: Edit (blue pencil), Delete (red trash)
    Delete confirmation: modal with warning text

Inquiries Tab:
  Table:
    Columns: Name, Email, Phone, Property, Message, Date, Actions
    Actions: Delete (red trash)

Appointments Tab:
  Table:
    Columns: Client, Property, Agent, Date, Time, Status, Actions
    Status badges: Pending (yellow), Confirmed (green), Cancelled (red), Completed (blue)
    Actions: Update status dropdown, Delete
```

### 7.5 Auth Pages (`/auth/signin`, `/auth/signup`)

```
Layout:
  - Full-screen gradient bg (slate-900 → slate-800 → slate-900)
  - Centered card: 420px max, white bg, rounded-2xl, shadow-xl

Sign In Card:
  Logo: "EL-YANIS" — 24px/700/blue-600
  Title: "Welcome back" — 24px/700
  Subtitle: "Sign in to your account" — 14px/gray-500
  Fields:
    - Email input with Mail icon prefix
    - Password input with Lock icon prefix + show/hide toggle
  "Sign In" button: full-width, blue gradient, 48px height
  "Forgot password?" link: blue text, centered
  Divider: "or continue with" — gray text with lines
  OAuth buttons: Google, GitHub — white bg, border, icon + text
  "Don't have an account? Sign up" link

Sign Up Card:
  Same layout as Sign In
  Fields: Full Name, Email, Password, Confirm Password
  Password strength indicator (optional)
  "Create account" button
  "Already have an account? Sign in" link
```

### 7.6 Contact Page (`/contact`)

```
Layout:
  - Hero banner (blue gradient, 320px height)
  - Two-column: contact info (left) + form (right)

Hero:
  Title: "Get in Touch" — 40px/700/white/centered
  Subtitle: 18px/blue-100/centered

Contact Info (left column):
  Contact cards (icon + text):
    1. Phone icon → "0550835124" (clickable tel: link)
    2. Mail icon → "elyanismo@gmail.com" (clickable mailto: link)
    3. MapPin icon → "Remchi, Tlemcen, Algeria" (Google Maps link)
    4. MessageCircle icon → "+213 550 835 124" (WhatsApp link)
  Office Hours card: blue-50 bg, rounded-xl
    - Sunday-Thursday: 9:00 AM - 6:00 PM
    - Saturday: 9:00 AM - 6:00 PM
    - Friday: Closed
  Social Media card: gradient blue bg
    - Facebook, Instagram, TikTok buttons with icons

Contact Form (right column):
  Card: white bg, rounded-xl, shadow-lg, padding 32px
  Title: "Send Us a Message" — 24px/700
  Fields: Name*, Email*, Phone*, Message* (textarea 6 rows)
  Submit button: blue bg, Mail icon, "Send Message"
  Success banner: green bg, Check icon, "Thank you for your message!"
```

### 7.7 Services Page (`/services`)

```
Layout:
  - Hero banner
  - 3 service cards (Estimation, Full Support, Legal Advice)
  - CTA section
  - "Why Choose Us" section

Service Cards:
  Each card: white bg, rounded-xl, shadow-md, padding 32px
  Icon: 48px circle, blue bg, white icon
  Title: 20px/700
  Description: 14px/gray-600
  Feature list: Check icon (green) + text, 4 items each

CTA Section:
  Blue gradient bg, rounded-2xl, padding 48px, centered
  Title: "Ready to Get Started?" — 28px/700/white
  Buttons: "Chat on WhatsApp" (green), "Call Us Now" (white outline)

Why Choose Us:
  3 columns:
    1. Proven Expertise (icon + title + description)
    2. Fast Service
    3. Premium Quality
```

### 7.8 About Page (`/about`)

```
Layout:
  - Hero banner
  - Mission section
  - Story section (2 paragraphs)
  - Values (3 columns: Transparency, Customer First, Excellence)
  - Why Choose Us section

Values Cards:
  Each: white bg, rounded-xl, shadow-md, padding 24px, centered
  Icon: 48px circle, blue bg
  Title: 18px/700
  Description: 14px/gray-600
```

### 7.9 Agents Page (`/agents`)

```
Layout:
  - Hero banner
  - Grid of AgentCard components

AgentCard:
  Container: white bg, rounded-xl, shadow-md, overflow-hidden
  Photo: 100% width, 280px height, object-cover
  Info section (padding 24px):
    Name: 20px/700
    Email: 14px/gray-500 with Mail icon
    Phone: 14px/gray-500 with Phone icon
    Stats row: "X Years Experience" | "Y Properties Sold"
    Bio: 14px/gray-600, 3 lines max with ellipsis
    "Contact Agent" button: blue outline, full-width
```

### 7.10 Property Form (`/admin/properties/new`, `/admin/properties/edit/:id`)

```
Layout:
  - Dark theme (slate-900 bg)
  - Centered form card: max-w-4xl, slate-800 bg, rounded-lg

Form Fields (2-column grid):
  Row 1: Title* (text, RTL), Type* (sale/rent dropdown)
  Row 2: Price (number, optional), City* (text, RTL)
  Row 3: Area m² (number, optional), Bedrooms (number, optional)
  Row 4: Bathrooms (number, optional), Status* (available/sold/rented)
  Row 5: Agent (dropdown), — empty —

Rental Settings Section (border-top divider):
  Row 1: Rental Category (long_term/short_term), Price Period (month/night)
  Row 2: Min Nights, Max Nights
  Row 3: Cleaning Fee, Security Deposit
  Row 4: Max Guests, Instant Book (checkbox)

Description: textarea 4 rows, RTL
Amenities: text input (comma-separated), RTL

Image Upload:
  Drop zone: dashed border, Upload icon, "Click to select images"
  Existing images grid: 3 columns, thumbnail + delete overlay
  New images preview grid: 3 columns, thumbnail + delete overlay

Video Upload:
  Same as image upload but accepts video/*
  Max 500MB per file
  Video thumbnails with play icon

Upload Progress:
  Progress bar: blue fill, "Uploading... (2 of 5) 40%"

Action Buttons:
  Cancel: slate-700 bg, X icon
  Save: blue bg, Save icon, disabled during upload
```

---

## 8. COMPONENT SPECIFICATIONS

### 8.1 Navbar

```
Desktop:
  - Fixed top, white bg, shadow-sm, 64px height
  - Left: "EL-YANIS Real Estate" logo (20px/700/blue-600)
  - Center: Nav links (Home, Listings, Services, Agents, About, Contact)
    - Active link: blue-600 text, bold
    - Inactive: gray-600 text
  - Right: Theme toggle (sun/moon icon), Language toggle (EN/AR/FR), Sign In button

Mobile:
  - Hamburger menu icon
  - Slide-out drawer with nav links stacked vertically
  - Bottom: theme toggle, language toggle, sign in

Dark mode:
  - bg-gray-900, text-white, border-gray-800
```

### 8.2 BookingWidget (Short-Term Rental)

```
Container:
  - White bg, rounded-2xl, shadow-xl, border gray-200, padding 24px
  - Sticky top-24 on desktop (lg:sticky lg:top-24 lg:self-start)

Price Header:
  - "12,500 DA" — 24px/700/gray-900
  - "/night" — 14px/400/gray-500
  - Nights badge: "3 nights" — blue-600 text, blue-50 bg, rounded-full

Date Selection Button:
  - Full-width, 52px height, gray-50 bg, border gray-200, rounded-xl
  - Calendar icon (blue), "Check in – Check out" placeholder
  - When selected: "Dec 15 – Dec 18" — 15px/500

Calendar Modal (overlay):
  - Fixed overlay, black/50% bg
  - Modal: 680px max, white bg, rounded-2xl, shadow-2xl
  - Header: "Select dates" title + X close button
  - Nav: prev/next month buttons, current month name
  - Dual-month grid (2 columns on desktop, 1 on mobile)
  - Day cells: 32px circles, hover:bg-blue-50
  - Selected start/end: blue bg, white text
  - Range: blue-50 bg, blue text
  - Blocked: red-50 bg, strikethrough, red dot below
  - Past: gray-300 text, strikethrough, not-allowed
  - Footer: selected dates + "X nights available" (green)
  - Legend: Available | Selected | Unavailable

Guests Selector:
  - Label: "GUESTS" — 13px/600/gray-500/uppercase
  - Control: gray-50 bg, border, rounded-xl
  - "2 guests" text center, −/+ circular buttons

Continue Button:
  - Full-width, white bg, black border, "Continue to booking"

Guest Form:
  - Gray-50 bg, rounded-xl, padding 16px
  - "Guest details" header + "← Back" button
  - Inputs: Full name, Email, Phone

Price Breakdown:
  - "12,500 DA × 3 nights" ........ 37,500 DA
  - "Cleaning fee" ................. 2,000 DA
  - "Service fee (12%)" ............ 4,500 DA
  - Divider line
  - "Total" (18px/700) ............. 44,000 DA (18px/700)

Reserve Button:
  - Full-width, 48px height, gradient blue, rounded-xl
  - CreditCard icon + "Reserve" text
  - Instant Book: CheckCircle2 icon
  - Loading: Loader2 spinner + "Processing..."
  - Hover: translateY(-1px), blue shadow
  - Disabled: 50% opacity, not-allowed

Trust Badges:
  - Shield icon (green) + "Secure booking"
  - Clock icon (green) + "Free cancellation up to 48h"

Error State:
  - Red-50 bg, red border, rounded-xl
  - AlertCircle icon (red) + error message
```

### 8.3 PropertyCard

```
Container:
  - White bg, rounded-xl, shadow-md, overflow-hidden, cursor-pointer
  - Hover: shadow-lg, translateY(-4px), transition 300ms

Image:
  - 100% width, 200px height, object-cover
  - Fallback: placeholder image on error

Badge:
  - Absolute top-left, 16px from edges
  - "For Sale": blue-100 bg, blue-600 text
  - "For Rent": green-100 bg, green-600 text
  - Rounded-full, 12px padding, 12px/600

Info (padding 20px):
  - Title: 18px/700/gray-900, truncate 1 line
  - City: 14px/gray-500, MapPin icon
  - Price: 20px/700/blue-600
  - Details: 13px/gray-500, "4 beds · 3 baths · 250 m²"
```

### 8.4 AgentCard

```
Container:
  - White bg, rounded-xl, shadow-md, overflow-hidden

Photo:
  - 100% width, 280px height, object-cover

Info (padding 24px):
  - Name: 20px/700/gray-900
  - Email: 14px/gray-500, Mail icon
  - Phone: 14px/gray-500, Phone icon
  - Stats: "X Years Experience" | "Y Properties Sold" — 13px/gray-500
  - Bio: 14px/gray-600, line-clamp-3
  - Button: "Contact Agent" — blue outline, full-width, 40px height
```

### 8.5 AppointmentBooking

```
Container:
  - White bg, rounded-xl, shadow-lg, border gray-100, padding 24px
  - Subtle scale-in animation

Header:
  - "Book a Viewing" — gradient blue text, 24px/bold
  - "Meeting with agent {name}" — 14px/gray-500

Success Banner:
  - Green gradient bg, border green-200, rounded-lg
  - CheckCircle icon (green) + "Booking Successful!" + subtitle

Error Banner:
  - Red gradient bg, border red-200, rounded-lg
  - AlertCircle icon (red) + error message

Form Fields:
  1. Full Name* (User icon prefix)
  2. Email* (Mail icon prefix)
  3. Phone* (Phone icon prefix)
  4. Appointment Date* (Calendar icon, date input, min=today)
  5. Time Slots (grid 3 columns):
     - Available: white bg, border, hover:border-blue-400, hover:shadow
     - Selected: blue gradient bg, white text, scale-105
     - Booked: gray-100 bg, gray-400 text, strikethrough, not-allowed
  6. Notes (textarea, 3 rows, MessageSquare icon)

Submit Button:
  - Full-width, blue gradient, "Book Now"
  - Loading: "Booking..."
```

### 8.6 Footer

```
Layout:
  - Dark bg (gray-900), padding 48px top/bottom
  - 4 columns on desktop, stacked on mobile

Column 1 — Brand:
  - "EL-YANIS Real Estate" — 20px/700/white
  - Description: 14px/gray-400, max-width 320px
  - Social icons: Facebook, Instagram, TikTok (gray-400, hover:white)

Column 2 — Quick Links:
  - "Quick Links" — 16px/600/white
  - Links: Properties for Sale, Properties for Rent, Our Agents, About Us
  - Each: 14px/gray-400, hover:blue-400

Column 3 — Contact:
  - "Contact" — 16px/600/white
  - Phone, Email, Office address (same as contact page)

Column 4 — Newsletter:
  - "Stay Updated" — 16px/600/white
  - Email input + Subscribe button
  - Description: 14px/gray-400

Bottom Bar:
  - Border-top gray-800
  - "© 2025 EL-YANIS Real Estate. All rights reserved." — 14px/gray-500/centered
```

### 8.7 ProtectedRoute

```typescript
// Redirect logic:
// - If !user → redirect to /auth/signin
// - If role && role !== requiredRole → redirect to /
// - Otherwise → render children (Outlet)
```

### 8.8 PWA Components

```
InstallPrompt:
  - Bottom banner on mobile
  - "Install EL-YANIS" button
  - Dismissible with X button

LazyImage:
  - Placeholder skeleton while loading
  - Fade-in transition on load

PWALayout:
  - Bottom navigation bar (mobile)
  - Icons: Home, Search, Bookings, Profile
  - Active: blue icon, inactive: gray icon

BookingWidget (PWA version):
  - Same as web BookingWidget
  - Additional: responsive calendar (single month on mobile)
```

---

## 9. STATE MANAGEMENT

### 9.1 Zustand Auth Store

```typescript
// src/stores/authStore.ts
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  role: 'user' | 'agent' | 'admin' | null;
  isLoading: boolean;
  isInitialized: boolean;

  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (data: SignUpData) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  profile: null,
  role: null,
  isLoading: false,
  isInitialized: false,

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      set({ user: session.user, session });
      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      set({ profile, role: profile?.role || null });
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null, session: session ?? null });
      if (session) {
        // Refresh profile
        supabase.from('profiles').select('*')
          .eq('user_id', session.user.id).single()
          .then(({ data }) => set({ profile: data, role: data?.role || null }));
      } else {
        set({ profile: null, role: null });
      }
    });

    set({ isInitialized: true });
  },

  signIn: async (email, password) => {
    set({ isLoading: true });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    set({ isLoading: false });
    if (error) return { success: false, error: error.message };
    return { success: true, user: data.user };
  },

  signUp: async (data) => {
    set({ isLoading: true });
    const { data: result, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { full_name: data.fullName, role: data.role || 'user' } },
    });
    set({ isLoading: false });
    if (error) return { success: false, error: error.message };
    return { success: true, user: result.user };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, profile: null, role: null });
  },

  refreshProfile: async () => {
    // Re-fetch profile from DB
  },
}));
```

### 9.2 React Contexts (non-auth state)

```
LanguageContext:
  - language: 'en' | 'ar' | 'fr'
  - setLanguage(lang)
  - t(key) → translated string
  - Persists to localStorage
  - Sets document.documentElement.dir for RTL (Arabic)

ThemeContext:
  - theme: 'light' | 'dark'
  - toggleTheme()
  - Persists to localStorage
  - Toggles 'dark' class on document.documentElement
```

### 9.3 Local Component State (no global store)

```
All other state is local to components:
  - Properties list: useState in Home/Listings
  - Filters: useState in Listings
  - Form data: useState in each form component
  - Loading states: useState per component
  - Pagination: none (all records fetched)
```

---

## 10. ROUTING STRUCTURE

```
App.tsx:
  <BrowserRouter>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </BrowserRouter>

App component:
  <LanguageProvider>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<WebLayout />}>
        <Route index element={<Home />} />
        <Route path="listings" element={<Listings />} />
        <Route path="property/:id" element={<PropertyDetails />} />
        <Route path="agents" element={<Agents />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="services" element={<Services />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/auth/signin" element={<SignIn />} />
      <Route path="/auth/signup" element={<SignUp />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Admin Routes (Protected) */}
      <Route element={<ProtectedRoute requiredRole="admin" />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/properties/new" element={<PropertyForm />} />
        <Route path="/admin/properties/edit/:id" element={<PropertyForm />} />
      </Route>

      {/* PWA Routes */}
      <Route path="/pwa" element={<PWALayout />}>
        <Route index element={<PWAHome />} />
        <Route path="listings" element={<PWAListings />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </LanguageProvider>
```

---

## 11. SUPABASE EDGE FUNCTIONS

### 11.1 send-contact-email

```typescript
// supabase/functions/send-contact-email/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Resend } from 'npm:resend@2.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

serve(async (req) => {
  if (req.method !== 'OPTIONS') {
    try {
      const { name, email, phone, message, propertyTitle, propertyId } = await req.json();

      const emailHtml = `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${message}</p>
        ${propertyTitle ? `<p><strong>Property:</strong> ${propertyTitle}</p>` : ''}
        ${propertyId ? `<p><strong>Property ID:</strong> ${propertyId}</p>` : ''}
      `;

      const { data, error } = await resend.emails.send({
        from: 'EL-YANIS <onboarding@resend.dev>',
        to: ['elyanismo@gmail.com'],
        subject: propertyTitle
          ? `New inquiry for: ${propertyTitle}`
          : 'New contact message from EL-YANIS website',
        html: emailHtml,
        replyTo: email,
      });

      if (error) return new Response(JSON.stringify({ error }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // CORS preflight
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    },
  });
});
```

### 11.2 Environment Variables

```env
# Required
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Edge Function secrets (set in Supabase dashboard)
RESEND_API_KEY=re_your-resend-key
```

---

## 12. STORAGE CONFIGURATION

```
Bucket: property-images
  - Public: true
  - File size limit: 5MB for images, 500MB for videos
  - Allowed MIME types: image/*, video/*
  - Path structure: {random-string}-{timestamp}.{ext}

RLS Policies:
  - Public can SELECT (view)
  - Authenticated can INSERT, UPDATE, DELETE
  - Public can upload (for simplicity in current setup)
```

---

## 13. INTERNATIONALIZATION

```
Supported Languages: en, ar, fr
Storage: localStorage ('language' key)
RTL: Arabic (ar) sets document.dir = 'rtl'

Translation Structure:
  - Inline object in LanguageContext.tsx
  - Key format: 'section.element' (dot notation)
  - Keys needed:
    nav.home, nav.listings, nav.services, nav.agents, nav.about, nav.contact
    hero.title, hero.subtitle
    search.placeholder, search.allTypes, search.sale, search.rent, search.allCities, search.button
    features.premium.title, features.premium.desc
    features.experts.title, features.experts.desc
    features.trusted.title, features.trusted.desc
    featured.title, featured.subtitle, featured.viewAll
    property.bedrooms, property.bathrooms, property.area, property.price
    property.priceOnRequest, property.sale, property.rent, property.viewDetails
    property.description, property.amenities, property.contactAgent
    contact.title, contact.subtitle, contact.info.title, contact.info.desc
    contact.phone, contact.email, contact.office, contact.whatsapp
    contact.hours, contact.hours.weekdays, contact.hours.saturday, contact.hours.friday
    contact.social.title, contact.social.desc
    contact.form.title, contact.form.name, contact.form.email, contact.form.phone
    contact.form.message, contact.form.sending, contact.form.sent, contact.form.send
    contact.form.success
    footer.quickLinks, footer.propertiesSale, footer.propertiesRent
    footer.ourAgents, footer.aboutUs, footer.followUs, footer.copyright
    services.title, services.subtitle
    services.estimation.title, services.estimation.desc
    services.accompagnement.title, services.accompagnement.desc
    services.conseil.title, services.conseil.desc
    services.contactUs, services.cta.title, services.cta.desc
    services.cta.whatsapp, services.cta.call
    services.why.title, services.why.desc
    services.why.expertise, services.why.expertiseDesc
    services.why.fast, services.why.fastDesc
    services.why.quality, services.why.qualityDesc
    about.title, about.subtitle, about.mission.title, about.mission.desc
    about.story.title, about.story.paragraph1, about.story.paragraph2
    about.values.transparency.title, about.values.transparency.desc
    about.values.customerFirst.title, about.values.customerFirst.desc
    about.values.excellence.title, about.values.excellence.desc
    about.why.title, about.why.experience, about.why.listings
    about.why.team, about.why.support
    about.why.personalized, about.why.personalizedDesc
    about.why.endToEnd, about.why.endToEndDesc
    city.tlemcen, city.aintemouchent, city.sidibelabbes
    listings.title, listings.subtitle, listings.noResults, listings.loading
    agents.title, agents.subtitle, agents.experience
    agents.properties, agents.contactAgent
```

---

## 14. RESPONSIVE BREAKPOINTS

```
Mobile:    < 768px  (sm)
Tablet:    768px - 1024px (md)
Desktop:   1024px - 1280px (lg)
Large:     > 1280px (xl)

Key responsive behaviors:
  - Navbar: horizontal links → hamburger menu
  - Property cards: 3 cols → 2 cols → 1 col
  - Listings: sidebar + grid → stacked (sidebar toggles)
  - Property details: 2-col → 1 col stacked
  - Calendar modal: dual-month → single-month
  - Admin tables: horizontal scroll
  - Footer: 4 cols → 2 cols → 1 col
  - Features: 3 cols → 1 col
  - Contact: 2 cols → 1 col
```

---

## 15. ANIMATIONS & TRANSITIONS

```css
/* Defined in index.css */

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Utility classes */
.animate-fade-in   { animation: fadeIn 0.5s ease-out; }
.animate-slide-up  { animation: slideUp 0.5s ease-out; }
.animate-scale-in  { animation: scaleIn 0.3s ease-out; }
.animate-slide-down { animation: slideDown 0.3s ease-out; }

/* Transition classes */
.transition-all    { transition: all 0.3s ease; }
.transition-colors { transition: color 0.2s, background-color 0.2s, border-color 0.2s; }
.transition-transform { transition: transform 0.3s ease; }

/* Hover effects */
hover:scale-105       /* Cards, buttons */
hover:translateY(-4px) /* Property cards */
hover:shadow-lg       /* Cards */
hover:shadow-xl       /* Buttons */
hover:scale-110       /* Icons, social links */
```

---

## 16. FRONTEND-BACKEND INTEGRATION MAP

```
PAGE                  →  TABLE(S)              →  OPERATIONS
─────────────────────────────────────────────────────────────────
Home                  →  properties, agents     →  SELECT (limit 6, join agent)
Listings              →  properties, agents     →  SELECT (with filters, join agent)
PropertyDetails       →  properties, agents     →  SELECT (single + join)
PropertyDetails       →  inquiries              →  INSERT (contact form)
PropertyDetails       →  bookings               →  INSERT (short-term rental)
PropertyDetails       →  availability           →  SELECT (blocked dates)
PropertyDetails       →  appointments           →  INSERT (viewing booking)
Agents                →  agents                 →  SELECT (all)
Contact               →  inquiries              →  INSERT
Contact               →  Edge Function          →  POST (send email)
AdminDashboard        →  properties             →  SELECT, UPDATE, DELETE
AdminDashboard        →  inquiries              →  SELECT, DELETE
AdminDashboard        →  appointments           →  SELECT, UPDATE, DELETE
AdminDashboard        →  agents                 →  SELECT
PropertyForm (new)    →  properties             →  INSERT
PropertyForm (edit)   →  properties             →  SELECT, UPDATE
PropertyForm          →  agents                 →  SELECT (dropdown)
PropertyForm          →  Storage (property-images) → UPLOAD
SignIn/SignUp         →  Supabase Auth          →  signInWithPassword / signUp
SignIn/SignUp         →  profiles               →  SELECT (after auth)
AuthCallback          →  Supabase Auth          →  getSession
ProtectedRoute        →  profiles (via store)   →  role check
```

---

## 17. FILE STRUCTURE (Complete)

```
src/
  App.tsx                          # Root routes + providers
  main.tsx                         # Entry point
  index.css                        # Global styles + animations
  vite-env.d.ts                    # Vite type declarations

  lib/
    supabase.ts                    # Supabase client + core types

  stores/
    authStore.ts                   # Zustand auth store

  contexts/
    LanguageContext.tsx            # i18n (en/ar/fr)
    ThemeContext.tsx               # Dark/light theme

  types/
    auth.ts                        # Auth-related types

  shared/
    index.ts                       # Barrel exports
    types/
      index.ts                     # Shared types (Agent, Property, etc.)
      booking.ts                   # Booking types
    hooks/
      useEnvironment.ts            # Web vs PWA detection
    lib/
      api.ts                       # API service layer (defined but unused)

  features/
    auth/
      pages/
        SignIn.tsx                 # Sign-in page
        SignUp.tsx                 # Sign-up page
        AuthCallback.tsx           # OAuth callback handler

  components/
    Navbar.tsx                     # Site navigation
    Footer.tsx                     # Site footer
    PropertyCard.tsx               # Property listing card
    AgentCard.tsx                  # Agent card
    AppointmentBooking.tsx         # Viewing appointment form
    ProtectedRoute.tsx             # Auth route guard

  pages/
    Home.tsx                       # Homepage
    Listings.tsx                   # Property listings with filters
    PropertyDetails.tsx            # Property detail page
    Agents.tsx                     # Agents listing
    About.tsx                      # About page
    Contact.tsx                    # Contact page + form
    Services.tsx                   # Services page
    AdminLogin.tsx                 # Admin login
    AdminDashboard.tsx             # Admin dashboard
    PropertyForm.tsx               # Property create/edit form

  hooks/
    index.ts                       # Barrel exports
    usePWA.ts                      # PWA hook

  pwa/
    index.ts                       # Barrel exports
    pages/
      PWAHome.tsx                  # PWA home
      PWAListings.tsx              # PWA listings
    layout/
      PWALayout.tsx                # PWA layout (bottom nav)
      PWALayout.css
    components/
      PropertyCard.tsx             # PWA property card
      PropertyCard.css
      BookingWidget.tsx            # Short-term rental booking widget
      BookingWidget.css
    styles/
      theme.css

  web/
    index.ts                       # Barrel exports
    pages/
      WebHome.tsx                  # Web home
    layout/
      WebLayout.tsx                # Web layout (navbar + footer)

supabase/
  migrations/
    [14 migration files — see section 3]
  functions/
    send-contact-email/
      index.ts                     # Email Edge Function
```

---

## 18. KNOWN ISSUES & TECHNICAL DEBT

```
1. Two Supabase client instances (src/lib/supabase.ts + src/shared/lib/api.ts)
   → The api.ts instance has no auth config and is unused.
   → FIX: Delete api.ts or unify to single client.

2. Dead API service layer (src/shared/lib/api.ts)
   → Defines propertyApi, agentApi, etc. but no component imports them.
   → FIX: Delete or wire up components to use it.

3. Legacy admins table with plaintext passwords
   → Superseded by Supabase Auth + profiles table.
   → FIX: Drop table after confirming no active legacy logins.

4. No data caching (React Query / SWR)
   → Every component fetches fresh on mount.
   → FIX: Add @tanstack/react-query for caching + deduplication.

5. No pagination
   → All queries fetch all records.
   → FIX: Add .range() or cursor-based pagination.

6. PropertyForm only saves English fields
   → title_ar, title_fr, description_ar, description_fr never populated.
   → FIX: Add multilingual form fields.

7. AdminDashboard uses legacy AuthContext for logout
   → Should use authStore.signOut() instead.

8. No error boundaries
   → Errors only logged to console.
   → FIX: Add React Error Boundary wrapper.

9. No form validation library
   → Manual validation in components.
   → FIX: Add react-hook-form + zod.

10. Hardcoded email in Edge Function
    → Sends to elyanismo@gmail.com only.
    → FIX: Make configurable via environment variable.
```

---

## 19. QUICK START COMMANDS

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Type check
npm run typecheck

# Lint
npm run lint

# Production build
npm run build

# Preview production build
npm run preview

# Apply Supabase migrations
npx supabase db push

# Deploy Edge Function
npx supabase functions deploy send-contact-email
```

---

*End of specification. This document contains everything needed to rebuild the EL-YANIS Real Estate Platform v2.1 from scratch.*
