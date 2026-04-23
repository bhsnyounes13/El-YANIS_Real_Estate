# EL-YANIS Changelog

## [Unreleased]

- Premium frontend v2.0 split landing page: Rent / Sell toggle with animated gradient background and glow indicators.
- Introduced BookingWidget with dual-month calendar, blocked-date integration, and live price breakdown (nightly rate, cleaning fee, service fee).
- Integrated Framer Motion transitions for hero toggle and page sections.
- Merged front-end routing to support landing, listings, property details, admin pages, and PWA flows.
- Added design system documentation and skeleton for UI tokens (colors, typography, spacing).
- Added placeholder API surface for getProperties, createBooking, createListing (to align with backend integration).

## [Next]

- Wire actual backend API calls using React Query to fetch and mutate data.
- Implement real admin dashboard with full RBAC and real data.
- Add end-to-end tests and UI accessibility checks.
