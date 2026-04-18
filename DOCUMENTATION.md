# EL-YANIS Real Estate Platform — Complete Documentation v2.1

---

# TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Design System & UI/UX](#2-design-system--uiux)
3. [Web UI — Desktop Experience](#3-web-ui--desktop-experience)
4. [PWA UI — Mobile App Experience](#4-pwa-ui--mobile-app-experience)
5. [Component Library](#5-component-library)
6. [Pages & Routes](#6-pages--routes)
7. [Database Architecture](#7-database-architecture)
8. [State Management](#8-state-management)
9. [PWA Configuration](#9-pwa-configuration)
10. [API Layer](#10-api-layer)
11. [Performance Optimization](#11-performance-optimization)
12. [Internationalization](#12-internationalization)
13. [Admin Dashboard](#13-admin-dashboard)
14. [Booking System](#14-booking-system)
15. [File Structure](#15-file-structure)
16. [Development Workflow](#16-development-workflow)
17. [Deployment Guide](#17-deployment-guide)
18. [Environment Variables](#18-environment-variables)
19. [External Integrations](#19-external-integrations)
20. [Troubleshooting](#20-troubleshooting)

---

# 1. PROJECT OVERVIEW

## 1.1 Summary

EL-YANIS Real Estate is a premium multilingual real estate platform designed for the Algerian market. It features a dual-interface architecture: a classic web experience for desktop browsers and a native-like mobile app experience when installed as a PWA.

## 1.2 Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Framework** | React | 18.3.1 |
| **Language** | TypeScript | 5.5.3 |
| **Build Tool** | Vite | 5.4.2 |
| **Routing** | React Router DOM | 7.9.4 |
| **Styling** | Tailwind CSS | 3.4.1 |
| **Database** | Supabase (PostgreSQL) | Latest |
| **Icons** | Lucide React | 0.344.0 |
| **Deployment** | Netlify | — |
| **Languages** | English, Arabic, French | — |

## 1.3 Key Features

- **Dual Interface Architecture**: Web (desktop) + PWA (mobile app)
- **Multilingual**: EN / AR (RTL) / FR with full translation coverage
- **Dark/Light Mode**: Persisted theme toggle
- **Property Management**: CRUD via admin dashboard
- **Short-term Rentals**: Airbnb-style booking with calendar widget
- **Long-term Rentals**: Agent contact + appointment booking
- **PWA**: Installable, offline-capable, push-notification ready
- **Image/Video Uploads**: Supabase Storage integration
- **Responsive**: Mobile-first design across all breakpoints

---

# 2. DESIGN SYSTEM & UI/UX

## 2.1 Color Palette

### Primary Colors
| Token | Hex | Usage |
|-------|-----|-------|
| Primary Blue | `#2563eb` | Buttons, links, active states, gradients |
| Primary Dark | `#1d4ed8` | Hover states, dark mode accents |
| Primary Light | `#3b82f6` | Secondary accents, gradients |

### Accent Colors
| Token | Hex | Usage |
|-------|-----|-------|
| Coral (PWA) | `#ff5a5f` | PWA primary actions, badges |
| Coral Hover | `#e8484d` | PWA button hover |
| Green | `#4caf50` | Success states, trust badges |
| Green Light | `#10b981` | Toast notifications |

### Neutral Colors (Light Mode)
| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#f8fafc` | Page background |
| Surface | `#ffffff` | Cards, modals, inputs |
| Text Primary | `#1e293b` | Headings, body text |
| Text Secondary | `#64748b` | Captions, labels |
| Text Tertiary | `#bdbdbd` | Placeholders |
| Border | `#e2e8f0` | Dividers, input borders |
| Border Light | `#f0f0f0` | Subtle dividers |

### Neutral Colors (Dark Mode)
| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#0f172a` | Page background |
| Surface | `#1e293b` | Cards, modals |
| Surface Elevated | `#242424` | Elevated surfaces |
| Text Primary | `#f1f5f9` | Headings, body text |
| Text Secondary | `#94a3b8` | Captions, labels |
| Border | `#334155` | Dividers, input borders |

### Admin Theme
| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#0f172a` (slate-900) | Admin pages |
| Surface | `#1e293b` (slate-800) | Admin cards |
| Text | `#f1f5f9` (slate-100) | Admin text |
| Accent | `#3b82f6` (blue-500) | Admin buttons |

## 2.2 Typography

### Font Family
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Hierarchy
| Level | Size | Weight | Usage |
|-------|------|--------|-------|
| H1 | 28px | 700 | Page titles, hero headings |
| H2 | 22-24px | 600-700 | Section titles |
| H3 | 18px | 600 | Subsection titles |
| Body | 15px | 400 | Paragraph text |
| Caption | 13px | 400 | Secondary text |
| Label | 12px | 500 | Form labels, badges |
| Small | 11-12px | 500 | Navigation labels |

### Letter Spacing
- Headings: `-0.3px` to `-0.5px` (tight)
- Labels: `0.5px` (uppercase tracking)
- Body: `0` (default)

## 2.3 Spacing System

| Token | Value | Usage |
|-------|-------|-------|
| xs | `4px` | Tight spacing, icon gaps |
| sm | `8px` | Small gaps, padding |
| md | `16px` | Standard spacing |
| lg | `24px` | Section padding |
| xl | `32px` | Large gaps |
| 2xl | `48px` | Hero sections |

## 2.4 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| sm | `8px` | Small elements, badges |
| md | `12px` | Inputs, buttons |
| lg | `16px` | Cards, modals |
| xl | `24px` | Large containers, CTA cards |
| full | `9999px` | Pill buttons, avatars |

## 2.5 Shadows

| Token | Value | Usage |
|-------|-------|-------|
| sm | `0 1px 2px rgba(0,0,0,0.04)` | Subtle cards |
| md | `0 4px 12px rgba(0,0,0,0.08)` | Standard cards |
| lg | `0 8px 24px rgba(0,0,0,0.12)` | Elevated cards, menus |
| xl | `0 16px 48px rgba(0,0,0,0.16)` | Modals, overlays |

## 2.6 Animations

### Keyframes
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

### Transitions
| Token | Duration | Usage |
|-------|----------|-------|
| fast | `150ms` | Hover states, focus rings |
| base | `250ms` | Card hover, button press |
| slow | `400ms` | Image zoom, page transitions |

### Custom Utility Classes
| Class | Effect |
|-------|--------|
| `.animate-fade-in` | Fade in 0.6s |
| `.animate-slide-up` | Slide up 0.6s |
| `.animate-scale-in` | Scale in 0.4s |
| `.animate-float` | Float animation 3s infinite |
| `.hover-lift` | Lift on hover (-translate-y-2 + shadow) |
| `.glow-on-hover` | Blue glow on hover |
| `.text-gradient` | Blue-to-cyan gradient text |
| `.glass-effect` | Glassmorphism (backdrop-blur + opacity) |

## 2.7 UI Principles

1. **Airy Layout**: Generous padding (16-24px), no clutter
2. **Image-First**: Property cards lead with large images
3. **Minimal Borders**: Subtle 1.5px borders in light gray
4. **Consistent Corners**: 12-16px radius on all interactive elements
5. **Micro-interactions**: Scale 0.98 on press, 1.02 on hover
6. **Progressive Disclosure**: Show essential info first, details on demand
7. **Touch-Friendly**: Minimum 44x44px tap targets
8. **Safe Areas**: `env(safe-area-inset-*)` for iOS notch support

---

# 3. WEB UI — DESKTOP EXPERIENCE

## 3.1 Layout Structure

```
┌─────────────────────────────────────────────┐
│                  NAVBAR (sticky)             │
├─────────────────────────────────────────────┤
│                                             │
│                  MAIN CONTENT               │
│                                             │
├─────────────────────────────────────────────┤
│                  FOOTER                     │
└─────────────────────────────────────────────┘
```

## 3.2 Navbar Component

### Structure
```
┌─────────────────────────────────────────────┐
│  LOGO  │  Nav Links  │  Lang  │  Theme  │ ☰ │
└─────────────────────────────────────────────┘
```

### Navigation Items
| Item | Link | Icon |
|------|------|------|
| Home | `/` | Home |
| Listings | `/listings` | Building2 |
| Agents | `/agents` | Users |
| About | `/about` | Info |
| Services | `/services` | Briefcase |
| Contact | `/contact` | Phone |

### Behavior
- **Desktop**: Horizontal nav links
- **Mobile**: Hamburger menu with slide-out panel
- **Sticky**: `sticky top-0 z-50` with glass effect backdrop
- **Language Dropdown**: EN / AR / FR selector
- **Theme Toggle**: Sun/Moon icon toggle

### Styling
- Background: `bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl`
- Height: `64px`
- Shadow: `shadow-sm` on scroll
- Active link: `text-blue-600 dark:text-blue-400`

## 3.3 Footer Component

### Structure (3 columns)
```
┌─────────────────────────────────────────────┐
│  Brand Info  │  Contact Details  │  Links   │
│  Logo + Desc │  Phone, Email, Map  │  Nav   │
│              │  WhatsApp, Hours    │ Social │
├─────────────────────────────────────────────┤
│  © 2025 EL-YANIS Real Estate. All rights   │
│  reserved.                                  │
└─────────────────────────────────────────────┘
```

### Contact Details
| Item | Value |
|------|-------|
| Phone | `0550835124` |
| Email | `elyanismo@gmail.com` |
| WhatsApp | `wa.me/213550835124` |
| Office | Remchi, Tlemcen, Algeria |
| Google Maps | `maps.app.goo.gl/rqZn1A8Vw3XSwFSe7` |

### Social Links
| Platform | URL |
|----------|-----|
| Facebook | `facebook.com/elyanis73` |
| Instagram | `instagram.com/_el_yanis/` |
| TikTok | `tiktok.com/@_elyanis` |

## 3.4 Home Page

### Hero Section
```
┌─────────────────────────────────────────────┐
│                                             │
│     "Find Your Dream Property in Algeria"   │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ [Search Input] [Type ▼] [City ▼]    │    │
│  │              [Search Button]         │    │
│  └─────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

- **Background**: Gradient overlay on hero image
- **Title**: 48px bold, centered
- **Search Bar**: Glass effect, rounded-xl, inline filters
- **Filters**: Property type (All/Sale/Rent), City dropdown

### Feature Cards (3 cards)
```
┌────────────┐ ┌────────────┐ ┌────────────┐
│    🏆      │ │    ⚡      │ │    💎      │
│  Premium   │ │   Expert   │ │   Trusted  │
│ Properties │ │   Agents   │ │   Service  │
└────────────┘ └────────────┘ └────────────┘
```

### Featured Properties Grid
- **Layout**: 3-column grid on desktop, 1-column on mobile
- **Cards**: 6 properties fetched from Supabase
- **CTA**: "View All Properties" button → `/listings`

## 3.5 Listings Page

### Layout
```
┌────────────────────┬────────────────────────┐
│   FILTER SIDEBAR   │    PROPERTY GRID       │
│                    │                        │
│  Search            │  ┌────┐ ┌────┐ ┌────┐  │
│  Type              │  │Card│ │Card│ │Card│  │
│  City              │  └────┘ └────┘ └────┘  │
│  Price Range       │  ┌────┐ ┌────┐ ┌────┐  │
│  Bedrooms          │  │Card│ │Card│ │Card│  │
│  Bathrooms         │  └────┘ └────┘ └────┘  │
│  [Apply] [Clear]   │                        │
└────────────────────┴────────────────────────┘
```

### Filter Options
| Filter | Type | Options |
|--------|------|---------|
| Search | Text input | Free text search |
| Type | Select | All, Sale, Rent |
| City | Select | All, Tlemcen, Ain Temouchent, Sidi Bel Abbès |
| Min Price | Number | DZD |
| Max Price | Number | DZD |
| Bedrooms | Select | All, 1+, 2+, 3+, 4+ |
| Bathrooms | Select | All, 1+, 2+, 3+ |

### Property Card (Web)
```
┌─────────────────────────────────┐
│                                 │
│         Property Image          │
│    [Sale/Rent Badge]            │
│                                 │
├─────────────────────────────────┤
│ Title                           │
│ 📍 City                         │
│ 🛏 3 beds  🚿 2 baths  📐 120m² │
│ 💰 5,000,000 DZD                │
└─────────────────────────────────┘
```

- **Image**: 100% width, 240px height, object-cover
- **Badges**: Sale (blue) / Rent (green), Status (gray)
- **Hover**: Lift effect (-translate-y-2 + shadow)
- **Click**: Navigate to `/property/:id`

## 3.6 Property Details Page

### Layout (2-column)
```
┌──────────────────────────┬──────────────────┐
│   PROPERTY INFO (2/3)    │  SIDEBAR (1/3)   │
│                          │                  │
│  Image Carousel          │  Agent Card      │
│  Video Section           │  Appointment     │
│  Title + Price           │  Booking         │
│  Meta (bed/bath/area)    │  Inquiry Form    │
│  Description             │                  │
│  Amenities               │                  │
└──────────────────────────┴──────────────────┘
```

### Image Carousel
- **Height**: 384px (96 tailwind units)
- **Navigation**: Left/Right arrows, keyboard (←/→), touch swipe
- **Counter**: "1 / 5" badge at bottom
- **Fallback**: Pexels placeholder on error

### Video Section
- **Layout**: 2-column grid for multiple videos
- **Player**: Native HTML5 video with controls
- **Preload**: Metadata only

### Short-term Rental: BookingWidget
When `type === 'rent'` AND `rental_category === 'short_term'`:
- Replaces Agent Card + Appointment Booking
- Shows Airbnb-style booking widget (see §14)

### Long-term Rental: Standard Sidebar
- Agent Card with photo, name, contact
- Appointment Booking component
- Inquiry form (name, email, phone, message)

## 3.7 Agents Page

- **Layout**: 3-column grid of AgentCard components
- **Data**: Fetched from Supabase with property count
- **Card**: Circular photo, name, bio, email/phone links

## 3.8 Contact Page

### Layout (2-column)
```
┌────────────────────┬────────────────────────┐
│   CONTACT INFO     │    CONTACT FORM        │
│                    │                        │
│  📞 Phone Card     │  Name [________]       │
│  📧 Email Card     │  Email [________]      │
│  📍 Map Card       │  Phone [________]      │
│  💬 WhatsApp Card  │  Message [________]    │
│  📱 Social Links   │  [Send Message]        │
│  🕐 Office Hours   │                        │
└────────────────────┴────────────────────────┘
```

### Info Cards
| Card | Content |
|------|---------|
| Phone | Clickable `tel:` link |
| Email | Clickable `mailto:` link |
| Map | Embedded Google Maps iframe |
| WhatsApp | Direct `wa.me` link |
| Social | Facebook, Instagram, TikTok icons |
| Hours | Mon-Fri 9:00-18:00, Sat 9:00-13:00 |

### Form Submission
1. INSERT into `inquiries` table
2. POST to Supabase Edge Function `send-contact-email`
3. Show success toast for 3 seconds

## 3.9 Services Page

### 3 Service Cards
| Service | Icon | Features |
|---------|------|----------|
| Property Estimation | 📊 | Market analysis, Comparable sales, Investment potential, Detailed report |
| Full Support | 🤝 | Legal assistance, Document preparation, Negotiation support, Admin support |
| Legal Advice | ⚖️ | Contract review, Property verification, Dispute resolution, Legal compliance |

### CTA Section
- **Headline**: "Ready to Get Started?"
- **Buttons**: WhatsApp (green) + Phone (blue)

### Why Choose Us Section
4 feature cards: Experience, Local Expertise, Personalized Service, Transparent Process

---

# 4. PWA UI — MOBILE APP EXPERIENCE

## 4.1 Layout Structure

```
┌──────────────────────┐
│  ☰  EL-YANIS  🌐    │  ← Sticky Header
├──────────────────────┤
│                      │
│                      │
│   SCROLLABLE CONTENT │
│                      │
│                      │
├──────────────────────┤
│ 🏠    🔍    👤    🔔 │  ← Bottom Navigation
│ Home Search Agents  Contact             │
└──────────────────────┘
```

## 4.2 Mobile Header

### Structure
```
┌──────────────────────────────────┐
│  ☰        EL-YANIS        EN    │
└──────────────────────────────────┘
```

- **Left**: Hamburger menu button (40x40px circular)
- **Center**: "EL-YANIS" logo (22px, 800 weight, 2px letter-spacing)
- **Right**: Language badge (EN/AR/FR, 12px, bold, rounded background)
- **Height**: 56px + safe-area-inset-top
- **Background**: White with bottom border
- **Sticky**: `position: sticky; top: 0; z-index: 100`

### Slide-out Menu
```
┌────────────────────┐
│  Menu          ✕   │
├────────────────────┤
│  🏠  Home          │
│  🏢  Properties    │
│  🏢  Services      │
│  👤  Agents        │
│  ℹ️  About          │
│  🔔  Contact       │
└────────────────────┘
```

- **Width**: min(320px, 85vw)
- **Animation**: Slide from right (transform: translateX)
- **Overlay**: Semi-transparent black backdrop
- **Items**: Icon + label, 16px padding, hover highlight

## 4.3 Bottom Navigation

### Structure
```
┌──────────────────────────────────┐
│  🏠       🔍       👤       🔔   │
│ Home    Search    Agents  Contact│
└──────────────────────────────────┘
```

| Tab | Icon | Path | Active Color |
|-----|------|------|-------------|
| Home | Home (outline) | `/` | Coral (#ff5a5f) |
| Search | Search (outline) | `/listings` | Coral |
| Agents | User (outline) | `/agents` | Coral |
| Contact | Bell (outline) | `/contact` | Coral |

### Styling
- **Background**: White with top border
- **Height**: 56px + safe-area-inset-bottom
- **Active State**: Icon stroke-width 2.5 (vs 1.5 inactive)
- **Tap Effect**: Scale 0.95
- **Labels**: 11px, 500 weight, below icon

## 4.4 PWA Home Page

### Hero Section
```
┌──────────────────────────────────┐
│                                  │
│        EL-YANIS                  │
│        Real Estate               │
│                                  │
└──────────────────────────────────┘
```

- **Padding**: 24px + safe-area-inset-top
- **Logo**: 28px, 800 weight, 2px letter-spacing
- **Tagline**: 13px, 500 weight, uppercase, 1px letter-spacing

### Search Bar
```
┌──────────────────────────────────┐
│  🔍  Search properties...       │
└──────────────────────────────────┘
```

- **Style**: Full-width pill button
- **Background**: `#fafafa` with border
- **Click**: Navigate to `/listings`

### Categories (Horizontal Scroll)
```
┌──────────────────────────────────┐
│  🏠     🔑     ✨     ⭐         │
│  Buy   Rent   New   Featured     │
└──────────────────────────────────┘
```

- **Layout**: Horizontal scroll, no scrollbar
- **Item**: 80px min-width, icon + label
- **Style**: White card with border, 16px padding
- **Tap**: Scale 0.95, border color changes to coral

### Popular Cities (Horizontal Scroll)
```
┌──────────────────────────────────┐
│  Popular Cities        See all → │
│                                  │
│  ┌────────┐ ┌────────┐ ┌───────┐│
│  │  Image │ │  Image │ │ Image ││
│  │📍City  │ │📍City  │ │📍City ││
│  └────────┘ └────────┘ └───────┘│
└──────────────────────────────────┘
```

- **Card Size**: 160x120px
- **Image**: Full cover with gradient overlay
- **Label**: City name with map pin icon
- **Tap**: Navigate to `/listings?city=...`

### Featured Properties (Vertical List)
```
┌──────────────────────────────────┐
│  Featured Properties   See all → │
│                                  │
│  ┌─────────────────────────────┐│
│  │     Property Image          ││
│  │  [Sale Badge]    ♡          ││
│  ├─────────────────────────────┤│
│  │  Title                      ││
│  │  Description (truncated)    ││
│  │  🛏 3  🚿 2  📐 120m²       ││
│  │  💰 5,000,000 DZD    City   ││
│  └─────────────────────────────┘│
└──────────────────────────────────┘
```

### CTA Card
```
┌──────────────────────────────────┐
│  Need help finding your          │
│  dream home?                     │
│  Our team is here to assist you  │
│                                  │
│  [  Contact Us  ]                │
└──────────────────────────────────┘
```

- **Background**: Dark gradient (#1a1a1a → #2d2d2d)
- **Text**: White
- **Button**: Full-width coral button

### Quick Links
```
┌──────────────────────────────────┐
│  🏢  Our Services                │
├──────────────────────────────────┤
│  👥  Our Agents                  │
├──────────────────────────────────┤
│  ℹ️  About Us                    │
├──────────────────────────────────┤
│  📞  Contact                     │
└──────────────────────────────────┘
```

## 4.5 PWA Listings Page

### Header
```
┌──────────────────────────────────┐
│  Properties                      │
│  12 properties found             │
└──────────────────────────────────┘
```

### Filter Bar (Horizontal Scroll)
```
┌──────────────────────────────────┐
│  ⚙️ Filters  [Buy]  [Rent] [▼]  │
└──────────────────────────────────┘
```

- **Filter Chips**: Pill buttons with border
- **Active**: Black background, white text
- **City Select**: Dropdown at end

### Expanded Filters Panel (Full-screen modal)
```
┌──────────────────────────────────┐
│  Filters          [Clear all]    │
├──────────────────────────────────┤
│  Bedrooms                        │
│  [Any] [1+] [2+] [3+] [4+]      │
├──────────────────────────────────┤
│  City                            │
│  [All] [Tlemcen] [Ain T...] [...]│
├──────────────────────────────────┤
│                                  │
│  [  Apply Filters  ]             │
└──────────────────────────────────┘
```

- **Animation**: Slide up from bottom
- **Options**: Pill buttons, multi-select
- **Apply**: Fixed bottom button

### Property Grid
- **Layout**: Single column, full-width cards
- **Spacing**: 16px gap between cards
- **Loading**: Skeleton cards with shimmer animation

## 4.6 PWA Property Card

### Default Variant
```
┌──────────────────────────────────┐
│                                  │
│       Property Image             │
│  [Sale]              ♡           │
│                                  │
├──────────────────────────────────┤
│  Title (bold, 16px)              │
│  Description (truncated, 13px)   │
│  ─────────────────────────────   │
│  🛏 3   🚿 2   📐 120m²          │
│  ─────────────────────────────   │
│  💰 5,000,000 DZD      Tlemcen   │
└──────────────────────────────────┘
```

### Compact Variant (for horizontal scroll)
```
┌──────────────────┐
│   Image          │
│  [Sale]          │
├──────────────────┤
│  Title           │
│  📍 City         │
│  💰 Price        │
└──────────────────┘
```

- **Width**: 260px fixed
- **Image Height**: 120px
- **No description** shown

### Card Interactions
- **Tap**: Scale 0.98, shadow increase
- **Like Button**: 36px circle, white bg, top-right
- **Hover**: Image zoom 1.05, heart fill coral

---

# 5. COMPONENT LIBRARY

## 5.1 PropertyCard (Web)

### Props
```typescript
interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
}
```

### Layout
```
┌─────────────────────────────────┐
│  ┌───────────────────────────┐  │
│  │       Image (240px)       │  │
│  │  [Sale/Rent] [Status]     │  │
│  └───────────────────────────┘  │
│  Title                          │
│  📍 City                        │
│  🛏 Beds  🚿 Baths  📐 Area     │
│  💰 Price                       │
└─────────────────────────────────┘
```

### Styling
- **Border Radius**: `rounded-xl` (12px)
- **Shadow**: `shadow-md`
- **Hover**: `hover:-translate-y-2 hover:shadow-2xl`
- **Image**: `h-60 object-cover`
- **Badges**: `rounded-full px-3 py-1 text-sm`

## 5.2 AgentCard

### Props
```typescript
interface AgentCardProps {
  agent: Agent;
  propertyCount?: number;
}
```

### Layout
```
┌─────────────────────────────────┐
│         (Photo)                 │
│         Name                    │
│       Bio (truncated)           │
│  📧 email  📞 phone             │
│  🏠 X properties                │
└─────────────────────────────────┘
```

### Styling
- **Photo**: `w-24 h-24 rounded-full object-cover`
- **Bio**: Language-aware (`bio_en`, `bio_ar`, `bio_fr`)
- **Links**: `mailto:` and `tel:` protocols
- **Property Badge**: Blue rounded-full

## 5.3 AppointmentBooking

### Props
```typescript
interface AppointmentBookingProps {
  propertyId: string;
  agentId: string;
  agentName: string;
}
```

### Flow
1. Select date (date input)
2. Select time slot (3x3 grid of buttons)
3. Fill client info (name, email, phone)
4. Submit → INSERT into `appointments`

### Time Slots
| Slot | Time |
|------|------|
| 1 | 09:00 |
| 2 | 10:00 |
| 3 | 11:00 |
| 4 | 12:00 |
| 5 | 13:00 |
| 6 | 14:00 |
| 7 | 15:00 |
| 8 | 16:00 |
| 9 | 17:00 |

### Availability Check
- Queries `appointments` table for existing bookings
- Filters out booked slots (status: pending/confirmed)
- Available slots shown as clickable buttons

## 5.4 ProtectedRoute

### Props
```typescript
interface ProtectedRouteProps {
  children: ReactNode;
}
```

### Behavior
- Checks `AuthContext.isAuthenticated`
- Shows loading spinner while checking
- Redirects to `/admin/login` if not authenticated
- Renders children if authenticated

## 5.5 InstallPrompt

### Props
```typescript
interface InstallPromptProps {
  language: 'en' | 'ar' | 'fr';
}
```

### Components
1. **Floating Install Button**: Bottom center, gradient bg
2. **iOS Modal**: Step-by-step instructions
3. **Toast Notification**: Success message
4. **Offline Indicator**: Red top bar

### Visibility Logic
- Hidden when `isPWAInstalled === true`
- Hidden when `isAppMode === true`
- Shows only in web mode on supported browsers

## 5.6 LazyImage

### Props
```typescript
interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  placeholder?: string;
}
```

### Behavior
- Preloads image before rendering
- Shows pulse animation while loading
- Falls back to placeholder on error
- Uses `loading="lazy"` attribute

## 5.7 BookingWidget (v2.1)

### Props
```typescript
interface BookingWidgetProps {
  propertyId: string;
  nightlyRate: number;
  cleaningFee?: number;
  serviceFeePercentage?: number;
  minimumNights?: number;
  maximumNights?: number;
  maxGuests?: number;
  instantBook?: boolean;
  onBookingSuccess?: (booking: Booking) => void;
  onBookingError?: (error: string) => void;
}
```

See §14 for full documentation.

---

# 6. PAGES & ROUTES

## 6.1 Route Table

| Path | Mode | Component | Layout | Protected |
|------|------|-----------|--------|-----------|
| `/` | Web | Home | WebLayout | No |
| `/` | PWA | PWAHome | PWALayout | No |
| `/listings` | Web | Listings | WebLayout | No |
| `/listings` | PWA | PWAListings | PWALayout | No |
| `/property/:id` | Web | PropertyDetails | WebLayout | No |
| `/property/:id` | PWA | PropertyDetails | PWALayout (no nav) | No |
| `/agents` | Both | Agents | Web/PWA Layout | No |
| `/about` | Both | About | Web/PWA Layout | No |
| `/contact` | Both | Contact | Web/PWA Layout | No |
| `/services` | Both | Services | Web/PWA Layout | No |
| `/admin/login` | Web | AdminLogin | None | No |
| `/admin/dashboard` | Web | AdminDashboard | None | **Yes** |
| `/admin/properties/new` | Web | PropertyForm | None | **Yes** |
| `/admin/properties/edit/:id` | Web | PropertyForm | None | **Yes** |
| `*` | Both | Navigate `/` | — | No |

## 6.2 Mode Detection

```typescript
const mode = isStandalone ? 'pwa' : 'web';
```

| Condition | Mode |
|-----------|------|
| `display-mode: standalone` | PWA |
| `navigator.standalone === true` (iOS) | PWA |
| `document.referrer` contains `android-app://` | PWA |
| All other cases | Web |

---

# 7. DATABASE ARCHITECTURE

## 7.1 Tables Overview

| Table | Columns | Purpose |
|-------|---------|---------|
| `agents` | 9 | Real estate agents |
| `properties` | 28 | Property listings |
| `inquiries` | 6 | Customer inquiries |
| `appointments` | 12 | Property viewing appointments |
| `admins` | 7 | Admin users |
| `bookings` | 16 | Short-term rental bookings |
| `availability` | 6 | Property availability calendar |

## 7.2 Properties Table (Complete Schema)

| Column | Type | Default | Constraints |
|--------|------|---------|-------------|
| id | uuid | gen_random_uuid() | PK |
| title_en | text | '' | NOT NULL |
| title_ar | text | '' | |
| title_fr | text | '' | |
| type | text | — | CHECK ('sale','rent') |
| price | numeric | — | |
| city | text | — | NOT NULL |
| area_m2 | numeric | — | |
| bedrooms | integer | 0 | |
| bathrooms | integer | 0 | |
| description_en | text | '' | |
| description_ar | text | '' | |
| description_fr | text | '' | |
| amenities | text[] | '{}' | |
| images | text[] | '{}' | |
| videos | text[] | '{}' | |
| status | text | 'available' | CHECK ('available','sold','rented') |
| agent_id | uuid | — | FK → agents |
| created_at | timestamptz | now() | |
| rental_category | rental_category | 'long_term' | ENUM |
| price_period | price_period | 'month' | ENUM |
| minimum_nights | integer | 1 | |
| maximum_nights | integer | 365 | |
| cleaning_fee | numeric | 0 | |
| security_deposit | numeric | 0 | |
| max_guests | integer | 4 | |
| instant_book | boolean | false | |

## 7.3 Bookings Table

| Column | Type | Default | Constraints |
|--------|------|---------|-------------|
| id | uuid | gen_random_uuid() | PK |
| property_id | uuid | — | FK → properties, CASCADE |
| guest_name | text | — | NOT NULL |
| guest_email | text | — | NOT NULL |
| guest_phone | text | — | NOT NULL |
| check_in_date | date | — | NOT NULL |
| check_out_date | date | — | NOT NULL, > check_in |
| number_of_nights | integer | — | NOT NULL |
| nightly_rate | numeric | — | NOT NULL |
| base_price | numeric | — | NOT NULL |
| cleaning_fee | numeric | 0 | |
| service_fee | numeric | 0 | |
| total_price | numeric | — | NOT NULL, > 0 |
| booking_status | booking_status | 'pending' | ENUM |
| created_at | timestamptz | now() | |
| updated_at | timestamptz | now() | |

## 7.4 Availability Table

| Column | Type | Default | Constraints |
|--------|------|---------|-------------|
| id | uuid | gen_random_uuid() | PK |
| property_id | uuid | — | FK → properties, CASCADE |
| date | date | — | NOT NULL |
| is_available | boolean | true | |
| price_override | numeric | — | |
| minimum_nights_override | integer | — | |
| created_at | timestamptz | now() | |

**Unique Constraint**: `(property_id, date)`

## 7.5 Indexes

| Table | Index | Columns |
|-------|-------|---------|
| properties | `idx_properties_city` | city |
| properties | `idx_properties_type` | type |
| properties | `idx_properties_status` | status |
| properties | `idx_properties_agent_id` | agent_id |
| bookings | `idx_bookings_property_id` | property_id |
| bookings | `idx_bookings_check_in` | check_in_date |
| bookings | `idx_bookings_check_out` | check_out_date |
| bookings | `idx_bookings_status` | booking_status |
| availability | `idx_availability_property_date` | property_id, date |

## 7.6 Triggers

| Trigger | Table | Function | Purpose |
|---------|-------|----------|---------|
| `appointments_updated_at` | appointments | `update_appointments_updated_at()` | Auto-update timestamp |
| `trg_prevent_overlapping_bookings` | bookings | `prevent_overlapping_bookings()` | Prevent double-booking |

## 7.7 Functions

| Function | Parameters | Returns | Purpose |
|----------|-----------|---------|---------|
| `calculate_booking_total()` | nightly_rate, nights, cleaning_fee, service_fee% | numeric | Calculate booking total |
| `prevent_overlapping_bookings()` | — | TRIGGER | Validate no date conflicts |
| `check_property_availability()` | property_id, check_in, check_out | TABLE(date, is_available) | Check date availability |

## 7.8 RLS Policies

| Table | Policy | Action | To | Condition |
|-------|--------|--------|----|-----------|
| properties | Anyone can view | SELECT | public | true |
| properties | Anyone can manage | ALL | public | true |
| agents | Anyone can view | SELECT | public | true |
| agents | Anyone can manage | ALL | public | true |
| inquiries | Anyone can submit | INSERT | public | true |
| inquiries | Auth can view/delete | SELECT/DELETE | authenticated | true |
| bookings | Anyone can view/create | SELECT/INSERT | public | true |
| bookings | Auth can update | UPDATE | authenticated | true |
| availability | Anyone can view | SELECT | public | true |
| availability | Auth can manage | ALL | authenticated | true |

## 7.9 Storage

| Bucket | Public | Purpose |
|--------|--------|---------|
| `property-images` | Yes | Property photos and videos |

### Upload Limits
- Images: 5MB max per file
- Videos: 500MB max per file
- Allowed formats: PNG, JPG, JPEG, MP4, MOV, WebM

---

# 8. STATE MANAGEMENT

## 8.1 Context Hierarchy

```
LanguageProvider (outermost)
  └── ThemeProvider
        └── AuthProvider
              └── BrowserRouter
                    └── Routes
```

## 8.2 LanguageContext

### State
```typescript
interface LanguageState {
  language: 'en' | 'ar' | 'fr';
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}
```

### Behavior
- **Persistence**: localStorage key `'language'`
- **Default**: `'en'`
- **Effects**: Sets `document.documentElement.lang` and `.dir` (rtl for Arabic)
- **Translation Keys**: ~175 per language

### Translation Structure
```
hero.title
hero.subtitle
hero.searchPlaceholder
search.filters
search.sale
search.rent
property.bedrooms
property.bathrooms
...
```

## 8.3 ThemeContext

### State
```typescript
interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
```

### Behavior
- **Persistence**: localStorage key `'theme'`
- **Default**: `'light'`
- **Effects**: Toggles `dark` class on `<html>`

## 8.4 AuthContext

### State
```typescript
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username, password) => Promise<{success, error?}>;
  logout: () => void;
}
```

### Session Storage
```typescript
{
  adminId: string;
  username: string;
  expiresAt: number; // Date.now() + 24h
}
```

### Login Flow
1. User submits username/password at `/admin/login`
2. Query `admins` table: `SELECT * WHERE username = ? AND is_active = true`
3. Compare `password_hash` (plaintext)
4. Update `last_login` timestamp
5. Store session in localStorage
6. Navigate to `/admin/dashboard`

## 8.5 Environment Detection (useEnvironment)

### State
```typescript
interface EnvironmentState {
  mode: 'web' | 'pwa';
  device: 'mobile' | 'tablet' | 'desktop';
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isStandalone: boolean;
  isPWAInstalled: boolean;
  isBrowserSupported: boolean;
  os: 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown';
}
```

### Detection Methods
| Method | Detection |
|--------|-----------|
| Standalone | `matchMedia('(display-mode: standalone)')` |
| iOS Standalone | `navigator.standalone === true` |
| Android App | `document.referrer` contains `android-app://` |
| Mobile UA | Regex: `Android|webOS|iPhone|iPad|iPod` |
| Tablet UA | Regex: `iPad|Android` without `Mobile` |
| OS | UA string matching |

---

# 9. PWA CONFIGURATION

## 9.1 manifest.json

```json
{
  "name": "EL-YANIS Real Estate",
  "short_name": "EL-YANIS",
  "description": "Your trusted partner in finding the perfect property across Algeria",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "scope": "/",
  "lang": "en",
  "icons": [
    { "src": "/yanis.jpg", "sizes": "192x192", "type": "image/jpeg", "purpose": "any maskable" },
    { "src": "/yanis.jpg", "sizes": "512x512", "type": "image/jpeg", "purpose": "any maskable" }
  ],
  "categories": ["business", "real estate", "lifestyle"]
}
```

## 9.2 Service Worker

### Cache Names
| Cache | Purpose |
|-------|---------|
| `elyanis-static-v1.0.0` | Static assets (JS, CSS, fonts) |
| `elyanis-dynamic-v1.0.0` | API responses, HTML pages |
| `elyanis-images-v1.0.0` | Images |

### Caching Strategies

| Resource Type | Strategy | Behavior |
|--------------|----------|----------|
| JS/CSS/Fonts | Cache First | Serve from cache, fallback to network |
| Images | Stale While Revalidate | Serve cached, update in background |
| API Calls | Network First | Try network, fallback to cache |
| HTML Pages | Network First | Try network, fallback to cache |

### Cache Cleanup
On activate event, deletes all caches not matching current version names.

### Offline Fallback
Returns `/offline.html` for navigation requests when offline.

### Push Notifications (Prepared)
- Listens for `push` events
- Shows notification with title, body, icon
- Handles notification click (open URL)

### Background Sync (Prepared)
- Listens for `sync` events
- Tag: `sync-inquiries` (for offline inquiry submission)

## 9.3 PWA Meta Tags (index.html)

```html
<meta name="theme-color" content="#2563eb" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="EL-YANIS" />
<meta name="application-name" content="EL-YANIS Real Estate" />
<link rel="manifest" href="/manifest.json" />
<link rel="apple-touch-icon" href="/yanis.jpg" />
```

---

# 10. API LAYER

## 10.1 Supabase Client

```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  || import.meta.env.VITE_Bolt_Database_URL
  || window._env?.VITE_SUPABASE_URL;

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  || import.meta.env.VITE_Bolt_Database_ANON_KEY
  || window._env?.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Fallback Chain
1. `import.meta.env.VITE_*` (build-time)
2. `import.meta.env.VITE_Bolt_Database_*` (Bolt platform)
3. `window._env.VITE_*` (runtime injection via `_env.js`)

## 10.2 Property API

| Method | Parameters | Query |
|--------|-----------|-------|
| `getAll(filters?)` | type?, city?, status? | `SELECT *, agent:agents(*)` with dynamic WHERE |
| `getById(id)` | id | `SELECT *, agent:agents(*) WHERE id = ?` |
| `create(property)` | Partial<Property> | `INSERT` |
| `update(id, property)` | id, Partial<Property> | `UPDATE WHERE id = ?` |
| `delete(id)` | id | `DELETE WHERE id = ?` |

## 10.3 Agent API

| Method | Parameters | Query |
|--------|-----------|-------|
| `getAll()` | — | `SELECT * ORDER BY name` |
| `getById(id)` | id | `SELECT * WHERE id = ?` |

## 10.4 Inquiry API

| Method | Parameters | Query |
|--------|-----------|-------|
| `create(inquiry)` | Omit<Inquiry, 'id'|'created_at'> | `INSERT` |
| `getAll()` | — | `SELECT * ORDER BY created_at DESC` |
| `delete(id)` | id | `DELETE WHERE id = ?` |

## 10.5 Appointment API

| Method | Parameters | Query |
|--------|-----------|-------|
| `create(appointment)` | Omit<Appointment, 'id'|'created_at'> | `INSERT` |
| `getAll()` | — | `SELECT * ORDER BY created_at DESC` |
| `updateStatus(id, status)` | id, BookingStatus | `UPDATE status WHERE id = ?` |
| `delete(id)` | id | `DELETE WHERE id = ?` |

## 10.6 Edge Functions

| Function | Endpoint | Called From | Payload |
|----------|----------|-------------|---------|
| `send-contact-email` | `/functions/v1/send-contact-email` | Contact.tsx, PropertyDetails.tsx | name, email, phone, message, propertyTitle, propertyId |

---

# 11. PERFORMANCE OPTIMIZATION

## 11.1 Code Splitting

### Manual Chunks (vite.config.ts)
| Chunk | Contents | Size (gzip) |
|-------|----------|-------------|
| `react-vendor` | react, react-dom, react-router-dom | 57 KB |
| `supabase` | @supabase/supabase-js | 34 KB |
| `ui` | lucide-react | 4 KB |
| `app` | Application code | 31-38 KB |

## 11.2 Image Optimization

- **Lazy Loading**: `loading="lazy"` on all images
- **Preconnect**: `<link rel="preconnect" href="https://*.supabase.co">`
- **Fallback**: Pexels placeholder on error
- **Object-fit**: `cover` for consistent aspect ratios

## 11.3 Build Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| `target` | `esnext` | Modern JS features |
| `minify` | `esbuild` | Fast minification |
| `optimizeDeps.exclude` | `['lucide-react']` | Prevent tree-shaking issues |

## 11.4 Service Worker Caching

| Strategy | Benefit |
|----------|---------|
| Cache First (static) | Instant load on repeat visits |
| Network First (API) | Always fresh data when online |
| Stale While Revalidate (images) | Fast load + background update |

## 11.5 Animation Performance

- **GPU Acceleration**: `transform` and `opacity` only
- **Duration**: 150-400ms (no long animations)
- **Easing**: `ease` and `ease-out` (natural feel)
- **60fps**: No layout thrashing, no forced reflows

---

# 12. INTERNATIONALIZATION

## 12.1 Supported Languages

| Code | Language | Direction |
|------|----------|-----------|
| `en` | English | LTR |
| `ar` | Arabic | RTL |
| `fr` | French | LTR |

## 12.2 Translation Coverage

| Section | Keys per Language |
|---------|-------------------|
| Hero | 4 |
| Features | 6 |
| Properties | 8 |
| Search/Filters | 10 |
| Contact | 12 |
| Services | 16 |
| About | 14 |
| Agents | 4 |
| Listings | 6 |
| Property Details | 10 |
| Admin | 8 |
| **Total** | **~175** |

## 12.3 RTL Support

### Implementation
- `document.documentElement.dir = 'rtl'` for Arabic
- Manual Tailwind overrides:
  - `space-x-*` → `space-x-reverse`
  - `ml-*` → `mr-*`
  - `text-left` → `text-right`

### RTL-Specific Adjustments
| Component | RTL Change |
|-----------|-----------|
| Navbar | Logo on right, menu on left |
| PropertyCard | Badges flipped |
| Forms | Labels right-aligned |
| Icons | Directional icons mirrored |

## 12.4 Usage Pattern

```typescript
const { language, setLanguage, t } = useLanguage();

// In JSX
<h1>{t('hero.title')}</h1>
<p>{t('property.bedrooms')}: {property.bedrooms}</p>

// Language switch
setLanguage('ar'); // or 'en' or 'fr'
```

---

# 13. ADMIN DASHBOARD

## 13.1 Layout

```
┌─────────────────────────────────────────────┐
│  Admin Dashboard         [Logout]           │
├─────────────────────────────────────────────┤
│  [Properties] [Agents] [Appointments] [Inq] │
├─────────────────────────────────────────────┤
│                                             │
│              TAB CONTENT                    │
│                                             │
└─────────────────────────────────────────────┘
```

- **Theme**: Dark slate (slate-900 bg, slate-800 cards)
- **Tabs**: 4 tabs with horizontal scroll on mobile

## 13.2 Properties Tab

### Table Columns
| Column | Data |
|--------|------|
| Title | property.title_en |
| Type | Sale/Rent (Arabic) |
| Price | Formatted DZD |
| City | City name |
| Agent | Agent name |
| Status | Badge (available/sold/rented) |
| Actions | Edit, Delete buttons |

### Actions
- **Add Property**: Button → `/admin/properties/new`
- **Edit**: Button → `/admin/properties/edit/:id`
- **Delete**: Confirmation alert → DELETE from Supabase

## 13.3 Agents Tab

### List View
- Agent name, email, phone
- Created date
- No CRUD (agents managed via Supabase directly)

## 13.4 Appointments Tab

### Table Columns
| Column | Data |
|--------|------|
| Property | property.title |
| Agent | agent.name |
| Client | client_name |
| Date | appointment_date |
| Time | appointment_time |
| Status | Badge with color |
| Actions | Status dropdown |

### Status Options
| Status | Color |
|--------|-------|
| Pending | Yellow |
| Confirmed | Green |
| Cancelled | Red |
| Completed | Blue |

## 13.5 Inquiries Tab

### List View
- Name, email, phone
- Message (truncated)
- Property title (if linked)
- Created date
- Delete button

## 13.6 PropertyForm

### Form Sections
1. **Basic Info**: Title, Type, Price, City
2. **Details**: Area, Bedrooms, Bathrooms, Status, Agent
3. **Rental Settings**: Category, Period, Nights, Fees, Guests, Instant Book
4. **Content**: Description, Amenities
5. **Media**: Image upload, Video upload

### Image Upload
- Multiple file selection
- Preview thumbnails
- Drag and drop support
- Upload to Supabase Storage
- Progress bar (current/total)

### Video Upload
- Max 500MB per file
- Preview thumbnails
- Same upload flow as images

---

# 14. BOOKING SYSTEM

## 14.1 BookingWidget Component

### Location
`src/pwa/components/BookingWidget.tsx`

### When It Appears
On PropertyDetails page when:
- `property.type === 'rent'`
- `property.rental_category === 'short_term'`

### Component Structure
```
┌──────────────────────────────────┐
│  5,000 DZD/night      3 nights   │
├──────────────────────────────────┤
│  📅  Check in – Check out       │
├──────────────────────────────────┤
│  👥  Guests                     │
│     [−]  1 guest  [+]           │
├──────────────────────────────────┤
│  [Continue to booking]           │
├──────────────────────────────────┤
│  5,000 DZD × 3 nights   15,000  │
│  Cleaning fee            2,000   │
│  Service fee (12%)       1,800   │
│  ─────────────────────────────   │
│  Total                  18,800   │
├──────────────────────────────────┤
│  [💳  Reserve]                   │
├──────────────────────────────────┤
│  🛡  Secure booking              │
│  🕐  Free cancellation up to 48h │
└──────────────────────────────────┘
```

### Calendar Modal
```
┌──────────────────────────────────┐
│  Select dates              ✕     │
├──────────────────────────────────┤
│       <  April 2026  >           │
├──────────────────────────────────┤
│  Su  Mo  Tu  We  Th  Fr  Sa      │
│              1   2   3   4   5   │
│   6   7   8   9  10  11  12      │
│  13  14  15  16  17  18  19      │
│  20  21  22  23  24  25  26      │
│  27  28  29  30                  │
├──────────────────────────────────┤
│  Apr 10 – Apr 15    5 nights ✓   │
└──────────────────────────────────┘
```

### Calendar States
| State | Visual |
|-------|--------|
| Past dates | Grayed out, disabled |
| Other month | Light gray, pointer-events none |
| In range | Pink background (#fff0f0) |
| Start/End | Coral background (#ff5a5f), white text |
| Hover | Light gray background |

### Guest Counter
- **Min**: 1
- **Max**: `maxGuests` prop (default 4)
- **Buttons**: Circular, 32px, disabled at limits

### Guest Details Form
```
┌──────────────────────────────────┐
│  Guest details        ← Back     │
├──────────────────────────────────┤
│  Full name                       │
│  [Your full name            ]    │
│                                  │
│  Email                           │
│  [your@email.com            ]    │
│                                  │
│  Phone                           │
│  [+213 xxx xxx xxx          ]    │
└──────────────────────────────────┘
```

### Price Calculation
```
basePrice = nightlyRate × numberOfNights
serviceFee = basePrice × (serviceFeePercentage / 100)
total = basePrice + cleaningFee + serviceFee
```

### Validation Rules
| Rule | Check |
|------|-------|
| Past dates | `date < today` → disabled |
| Min nights | `nights < minimumNights` → can't select |
| Max nights | `nights > maximumNights` → can't select |
| Checkout > Checkin | Enforced by date picker logic |
| Required fields | Name, email, phone required |

### Booking Status
| Status | When |
|--------|------|
| `pending` | Default (manual confirmation) |
| `confirmed` | `instantBook === true` |

### Trust Badges
- 🛡 Secure booking
- 🕐 Free cancellation up to 48h before check-in

### Styling
- **Card**: White, 20px radius, subtle shadow
- **Price**: 24px bold, `/night` in gray
- **Button**: Coral gradient, full-width, 16px padding
- **Hover**: Lift + shadow on button
- **Press**: Scale 0.98
- **Loading**: Spinner + "Processing..." text

---

# 15. FILE STRUCTURE

```
elyanis_real_estate_platform/
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── netlify.toml
├── index.html
│
├── public/
│   ├── manifest.json
│   ├── sw.js
│   ├── offline.html
│   ├── _env.js
│   ├── _redirects
│   ├── .htaccess
│   ├── yanis.jpg
│   └── icons/
│       └── icon.svg
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── vite-env.d.ts
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   ├── LanguageContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── PropertyCard.tsx
│   │   ├── AgentCard.tsx
│   │   ├── AppointmentBooking.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── PWA/
│   │       ├── InstallPrompt.tsx
│   │       ├── InstallPrompt.css
│   │       └── LazyImage.tsx
│   │
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Listings.tsx
│   │   ├── PropertyDetails.tsx
│   │   ├── Agents.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── Services.tsx
│   │   ├── AdminLogin.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── PropertyForm.tsx
│   │
│   ├── hooks/
│   │   ├── index.ts
│   │   └── usePWA.ts
│   │
│   ├── lib/
│   │   └── supabase.ts
│   │
│   ├── shared/
│   │   ├── index.ts
│   │   ├── types/
│   │   │   ├── index.ts
│   │   │   └── booking.ts
│   │   ├── hooks/
│   │   │   └── useEnvironment.ts
│   │   └── lib/
│   │       └── api.ts
│   │
│   ├── web/
│   │   ├── index.ts
│   │   ├── layout/
│   │   │   └── WebLayout.tsx
│   │   └── pages/
│   │       ├── index.tsx
│   │       └── WebHome.tsx
│   │
│   └── pwa/
│       ├── index.ts
│       ├── layout/
│       │   ├── PWALayout.tsx
│       │   └── PWALayout.css
│       ├── pages/
│       │   ├── index.ts
│       │   ├── PWAHome.tsx
│       │   ├── PWAHome.css
│       │   ├── PWAListings.tsx
│       │   └── PWAListings.css
│       ├── components/
│       │   ├── PropertyCard.tsx
│       │   ├── PropertyCard.css
│       │   ├── BookingWidget.tsx
│       │   └── BookingWidget.css
│       └── styles/
│           └── theme.css
│
└── supabase/
    └── migrations/
        ├── 20251017134257_create_real_estate_schema.sql
        ├── 20251017152300_add_multilingual_support.sql
        ├── 20251017162455_create_appointments_system.sql
        ├── 20251018085032_create_admin_system.sql
        ├── 20251018090108_fix_admin_login_policies.sql
        ├── 20251018090734_create_storage_for_property_images.sql
        ├── 20251018091143_fix_delete_permissions_for_admin.sql
        ├── 20251028175840_fix_security_issues.sql
        ├── 20251108093852_fix_storage_upload_policies.sql
        ├── 20251108094312_fix_insert_permissions_for_admin.sql
        ├── 20251108094319_fix_update_permissions_for_admin.sql
        ├── 20251108161739_fix_storage_upload_policies.sql
        ├── 20251114154320_make_property_fields_optional.sql
        ├── 20251120104002_add_video_support_to_properties.sql
        └── 20260403000000_add_dual_rental_model.sql
```

---

# 16. DEVELOPMENT WORKFLOW

## 16.1 Commands

```bash
npm run dev          # Start dev server (localhost:5173)
npm run build        # Production build → dist/
npm run preview      # Preview production build
npm run lint         # ESLint check
npm run typecheck    # TypeScript type checking
```

## 16.2 Dev Server

| Setting | Value |
|---------|-------|
| Port | 5173 |
| Host | 0.0.0.0 (network accessible) |
| HMR | Enabled |
| Network URLs | `http://192.168.1.4:5173/`, `http://172.20.160.1:5173/` |

## 16.3 Git Workflow

```bash
# Feature branch
git checkout -b feature/booking-system
git add .
git commit -m "feat: add booking widget for short-term rentals"
git push origin feature/booking-system
```

---

# 17. DEPLOYMENT GUIDE

## 17.1 Netlify (Recommended)

### Option A: Git Integration
1. Push code to GitHub
2. Connect repo at https://app.netlify.com/start
3. Build settings auto-detected:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables in dashboard

### Option B: Drag & Drop
```bash
npm run build
```
Drag `dist/` folder to https://app.netlify.com/drop

### Option C: CLI
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

## 17.2 Environment Variables (Netlify)

| Variable | Value |
|----------|-------|
| `VITE_SUPABASE_URL` | `https://YOUR_PROJECT.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...` |

## 17.3 SPA Routing

### netlify.toml
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### public/_redirects
```
/* /index.html 200
```

## 17.4 Vercel

```bash
npx vercel
```

Auto-detects Vite + React. No config needed.

## 17.5 HTTPS

All deployment targets enforce HTTPS automatically.

---

# 18. ENVIRONMENT VARIABLES

## 18.1 Required Variables

| Variable | Type | Purpose | Example |
|----------|------|---------|---------|
| `VITE_SUPABASE_URL` | string | Supabase project URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | string | Supabase public key | `eyJhbGci...` |

## 18.2 Optional Variables

| Variable | Type | Purpose |
|----------|------|---------|
| `VITE_Bolt_Database_URL` | string | Bolt platform fallback |
| `VITE_Bolt_Database_ANON_KEY` | string | Bolt platform fallback |

## 18.3 Runtime Injection

### public/_env.js
```javascript
window._env = {
  VITE_SUPABASE_URL: "https://xxx.supabase.co",
  VITE_SUPABASE_ANON_KEY: "eyJhbGci..."
};
```

This allows changing credentials without rebuilding.

---

# 19. EXTERNAL INTEGRATIONS

## 19.1 Supabase

| Service | Purpose |
|---------|---------|
| Database | PostgreSQL with RLS |
| Storage | Property images/videos |
| Edge Functions | Email notifications |

**Project URL**: `https://kuggacglpjjvhavqtviw.supabase.co`

## 19.2 Contact Channels

| Channel | Value |
|---------|-------|
| Phone | `0550835124` |
| Email | `elyanismo@gmail.com` |
| WhatsApp | `wa.me/213550835124` |

## 19.3 Social Media

| Platform | URL |
|----------|-----|
| Facebook | `facebook.com/elyanis73` |
| Instagram | `instagram.com/_el_yanis/` |
| TikTok | `tiktok.com/@_elyanis` |

## 19.4 Office Location

- **Address**: Remchi, Tlemcen, Algeria
- **Google Maps**: `maps.app.goo.gl/rqZn1A8Vw3XSwFSe7`

## 19.5 Image Fallbacks

| Source | Usage |
|--------|-------|
| Pexels | Property/agent/city placeholder images |
| Supabase Storage | Uploaded property images/videos |

---

# 20. TROUBLESHOOTING

## 20.1 Common Issues

### "Cannot find column 'description'"
**Cause**: Database uses multilingual columns (`description_en`, `description_ar`, `description_fr`).

**Fix**: Run SQL migration:
```sql
ALTER TABLE properties 
  ADD COLUMN IF NOT EXISTS description_en text DEFAULT '',
  ADD COLUMN IF NOT EXISTS description_ar text DEFAULT '',
  ADD COLUMN IF NOT EXISTS description_fr text DEFAULT '';
```

### "Row-level security policy violation"
**Cause**: RLS policies blocking writes.

**Fix**:
```sql
DROP POLICY IF EXISTS "Properties visible to public for SELECT" ON properties;
CREATE POLICY "Anyone can manage properties"
  ON properties FOR ALL TO public USING (true) WITH CHECK (true);
```

### "Missing Supabase environment variables"
**Cause**: Environment variables not set.

**Fix**: Update `public/_env.js` with correct Supabase credentials.

### PWA install button not appearing
**Cause**: Browser doesn't support `beforeinstallprompt` or engagement threshold not met.

**Fix**: The button now shows on all mobile browsers regardless of native install support.

### Dev server not accessible
**Fix**:
```bash
taskkill /F /IM node.exe
npm run dev
```

## 20.2 Browser Compatibility

| Browser | PWA Install | Offline | Push Notifications |
|---------|-------------|---------|-------------------|
| Chrome Android | ✅ | ✅ | ✅ |
| Chrome Desktop | ✅ | ✅ | ✅ |
| Edge | ✅ | ✅ | ✅ |
| Safari iOS | ❌ (manual) | ✅ | ❌ |
| Firefox | ❌ | ✅ | ❌ |
| Samsung Internet | ✅ | ✅ | ✅ |

## 20.3 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| LCP | < 2.5s | ~1.8s |
| CLS | < 0.1 | ~0.05 |
| FID | < 100ms | ~50ms |
| Bundle Size | < 500KB | ~350KB (gzip) |

---

# APPENDIX

## A. Build Output

```
dist/
├── index.html                    2.15 kB (0.79 kB gzip)
├── assets/
│   ├── index-*.css              75.04 kB (12.62 kB gzip)
│   ├── ui-*.js                  21.27 kB (4.26 kB gzip)
│   ├── supabase-*.js           124.09 kB (34.13 kB gzip)
│   ├── index-*.js              162.92 kB (37.92 kB gzip)
│   └── react-vendor-*.js       174.83 kB (57.52 kB gzip)
├── manifest.json
├── sw.js
├── offline.html
├── _env.js
├── _redirects
├── .htaccess
└── yanis.jpg
```

## B. Dependencies

### Production
| Package | Version | Purpose |
|---------|---------|---------|
| react | 18.3.1 | UI framework |
| react-dom | 18.3.1 | DOM rendering |
| react-router-dom | 7.9.4 | Client-side routing |
| @supabase/supabase-js | Latest | Database client |
| lucide-react | 0.344.0 | Icon library |

### Development
| Package | Version | Purpose |
|---------|---------|---------|
| vite | 5.4.2 | Build tool |
| typescript | 5.5.3 | Type checking |
| tailwindcss | 3.4.1 | Utility CSS |
| @vitejs/plugin-react | Latest | React support |
| eslint | Latest | Linting |
| autoprefixer | Latest | CSS vendor prefixes |

## C. Version History

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | Oct 2024 | Initial release |
| v1.1 | Oct 2024 | Multilingual support (EN/AR/FR) |
| v1.2 | Oct 2024 | Admin dashboard |
| v1.3 | Nov 2024 | Video support, storage fixes |
| v1.4 | Nov 2024 | Security fixes, RLS policies |
| v2.0 | Nov 2024 | PWA support, dual-interface architecture |
| v2.1 | Apr 2026 | Dual-rental model, BookingWidget, premium UI redesign |

---

*Documentation generated for EL-YANIS Real Estate Platform v2.1*
*Last updated: April 3, 2026*
