# EL-YANIS Architecture Overview

This document describes the front-end and back-end architecture for the EL-YANIS real estate platform v2.0+.

Goals

- Premium, Airbnb/Stripe-inspired UI with modern SaaS UX.
- Dual rental model: Rent (long_term) and Sell (property listings).
- Clean separation between frontend and backend, with clearly defined data contracts.

Scope

- Frontend: React 18 + TS + Vite + Tailwind CSS 3 + Framer Motion + React Query + Lucide Icons.
- Backend: Supabase (PostgreSQL) with Auth, Storage, and Edge Functions; design driven by the provided migrations.
- CI/CD considerations, testing approach, and deployment notes.

## 1. Code Structure Overview

- src
  - components: Reusable UI primitives (Button, Card, Input, Modal, etc.).
  - ui: Higher-level UI building blocks (Card, Button, Input, Skeleton, Toast, etc.).
  - layout: Global layouts (Navbar, Footer, Dashboard layout).
  - shared: Shared utilities, hooks, types, and API wrappers.
  - features: Feature-based modules (auth, bookings, properties).
  - auth: Auth pages (SignIn, SignUp, AuthCallback).
  - properties: Property related UI (listings, details, forms).
  - bookings: Booking workflows and components.
  - payments: Placeholder for payments integration.
  - pages: Page-level components (Home, Listings, PropertyDetails, Admin pages).
  - hooks: Custom hooks (e.g., usePWA).
  - lib: Core libraries (supabase client, utilities).
  - styles: Global styles and themes.
- docs: Documentation for the project (ARCHITECTURE.md, DESIGN_SYSTEM.md, etc.).
- supabase: Migration files, functions, and storage configuration.

## 2. Data Flow and Contracts

- Frontend calls into Supabase via a single client instance located at src/lib/supabase.ts.
- Core data operations described in docs/API.md (getProperties, createBooking, createListing).
- Data fetching uses React Query (where applicable) for caching, invalidation, and background updates.
- State management largely relies on React hooks and a single Zustand store for auth (src/stores/authStore.ts).

## 3. Deployment Notes

- Local development server: npm run dev (Vite, port 5173 or 5174 if 5173 is in use).
- Build: npm run build; outputs to dist/
- Production hosting choices depend on your infra (Vercel, Netlify, or a custom server).

## 4. Design Considerations

- The design emphasizes glassmorphism, soft gradients, and subtle animation to achieve a premium look.
- Framer Motion is used for transitions; ensure animations stay smooth on low-end devices.
- All color tokens map to Tailwind utility classes where possible.

## 5. Backend Interfaces (High-Level)

- Supabase migrations define: rental_category, price_period, bookings, availability, and authentication-related changes.
- Edge functions handle email sending for contact forms (send-contact-email).
- RLS policies are defined to secure data access per role (admin, agent, user).

### Key Points

- Always prefer contract-first design for new features.
- Centralize backend calls via src/lib/supabase.ts; avoid ad-hoc client creation.
- Add tests and mocks for API surface before production.
