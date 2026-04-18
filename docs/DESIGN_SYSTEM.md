# EL-YANIS Design System

This document captures the design tokens, components, and UI guidelines used to build the premium EL-YANIS interface.

## 1. Visual Language
- Gradients: Purple/Blue Indigo glow accents inspired by Airbnb and Stripe aesthetics.
- Glassmorphism: Backdrop blur, semi-transparent surfaces.
- Shadows and depth: layered shadows for hierarchy.
- Typography: Inter family with strong hierarchy (heavy headlines, readable body copy).
- Borders: light gray borders for inputs and cards.

## 2. Color Tokens (Tailwind-friendly)
- Primary: blue-indigo spectrum (#2563EB → #1D4ED8)
- Backgrounds: light gray surfaces (#F9FAFB, #FFFFFF with translucency for glass)
- Text: foreground #1A1A1A; muted #6B7280
- Success: #22C55E; Error: #EF4444
- Gradients: used for CTA buttons and hero sections

Refer to docs/ARCHITECTURE.md for mapping to Tailwind classes.

## 3. Typography & Spacing
- Headings: 48px/700, 32px/700, 20-24px/700
- Body: 15-16px/400-600
- Spacing: 8px (xs) to 32px (xl)
- Chips and badges: pill shapes with rounded-full borders

## 4. Components Library (reusable)
- Button: variations (default, outline, glow/gradient, ghost). Glowing variant for premium CTAs.
- Card: glass/solid variants with hover lift.
- Input: floating labels, glass inputs, RTL support.
- Modal: resilient stacking, framer-motion animated.
- Toggle: animated Rent/Sell segmented control.
- Skeletons: shimmering placeholders for loading states.
- Toast: sticky toasts in corner with icon + message.
- Avatar/AgentCard, PropertyCard: reuse Card with image, badge, meta info.

## 5. Accessibility considerations
- All interactive elements are keyboard accessible.
- Icons include aria-hidden; provide aria-labels where necessary.
- Color contrast checked against WCAG AA for primary surfaces.

## 6. A11y Patterns for Premium UI
- Clear focus rings on interactive elements.
- Logical reading order for screen readers.
- Labels associated with inputs; aria-describedby for validation messages.

*** End Patch
