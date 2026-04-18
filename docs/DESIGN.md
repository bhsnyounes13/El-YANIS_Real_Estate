```markdown
# Design System Strategy: The Luminous Estate

## 1. Overview & Creative North Star
This design system is built upon the philosophy of **"The Luminous Estate."** In the world of high-end real estate, luxury is defined by light, space, and the quality of materials. We translate this to the digital screen not through heavy ornamentation, but through extreme clarity, breathing room, and layered depth.

The "Creative North Star" is to treat every screen like an architectural blueprint for a glass pavilion. We move beyond "template" UI by embracing **intentional asymmetry**—offsetting high-contrast typography against expansive negative space—and using **tonal layering** instead of structural lines to guide the eye. The goal is a feeling of weightlessness and effortless sophistication.

---

### 2. Colors & Surface Philosophy
The palette is a dialogue between deep, authoritative indigos and ethereal, airy neutrals.

*   **Primary Logic:** We use `primary` (#0037b0) and `primary_container` (#1d4ed8) to represent trust and structural integrity.
*   **The "No-Line" Rule:** To maintain a premium editorial feel, **prohibit 1px solid borders for sectioning.** Boundaries must be defined solely through background color shifts. A section should transition from `surface` (#f8f9fa) to `surface_container_low` (#f3f4f5) to create a visual break.
*   **Surface Hierarchy & Nesting:** Treat the UI as physical layers of glass and fine paper. 
    *   **Base:** `surface` (#f8f9fa).
    *   **Interactive Cards:** `surface_container_lowest` (#ffffff).
    *   **Nested Content:** Use `surface_container` (#edeeef) for interior sections within a card to create "inset" depth.
*   **The Glass & Gradient Rule:**
    *   **Glassmorphism:** For floating navbars or hero overlays, use `surface_container_lowest` with 70% opacity and a `backdrop-blur: 24px`.
    *   **Signature Textures:** Main CTAs must use a linear gradient: `primary` to `primary_container` at a 135-degree angle. This adds "soul" and prevents the flat, generic look of standard SaaS.

---

### 3. Typography: Editorial Authority
We utilize a dual-font approach to balance architectural strength with modern readability.

*   **Display & Headlines (Manrope):** Chosen for its geometric precision. 
    *   `display-lg` (3.5rem) and `headline-lg` (2rem) should always be **Bold (700 weight)**. 
    *   Use generous letter-spacing (-0.02em) for large headlines to create a "tight," high-end fashion feel.
*   **Body & Labels (Inter):** The workhorse of modern digital experiences. 
    *   `body-lg` (1rem) is the standard for property descriptions.
    *   `label-md` (0.75rem) should be used for metadata (e.g., "Sq Ft," "Price per Month"), often in All-Caps with +0.05em tracking for a "curated" aesthetic.
*   **Hierarchy:** Use `on_surface_variant` (#434655) for secondary information to create a sophisticated gray-scale contrast that leads the eye toward the `on_surface` (#191c1d) headlines.

---

### 4. Elevation & Depth
Depth is the differentiator between "standard" and "premium."

*   **The Layering Principle:** Avoid shadows for basic separation. Place a `surface_container_lowest` card on a `surface_container_low` background. The subtle shift in hex value creates a soft, natural lift.
*   **Ambient Shadows:** For floating elements (Modals, Hovered Cards), use ultra-diffused shadows.
    *   *Shadow Blueprint:* `0px 20px 40px rgba(0, 55, 176, 0.06)`. Note the blue tint in the shadow—this mimics natural ambient light rather than a "dirty" black shadow.
*   **The "Ghost Border" Fallback:** If accessibility requires a border, use `outline_variant` at **15% opacity**. It should be a suggestion of a line, not a boundary.
*   **Interaction:** On hover, cards should utilize a "Hover-Lift" effect: `translateY(-8px)` combined with an increase in shadow spread.

---

### 5. Components

#### Buttons
*   **Primary:** Rounded `md` (1.5rem/24px). Background: Blue Gradient. Text: `on_primary` (#ffffff).
*   **Secondary:** Glassmorphic style. `surface_container_lowest` with 20% opacity + backdrop blur.
*   **Glow State:** On hover, the primary button should emit a soft "glow" via a `box-shadow` that matches the `primary` color at 30% opacity.

#### Cards (The Property Card)
*   **Structure:** No borders. `2xl` (24px) corner radius.
*   **Image:** Aspect ratio 4:5 for an editorial, portrait feel.
*   **Content:** No dividers. Use 24px (1.5rem) of padding. Use `title-md` for the property name and `label-md` (All-Caps) for the location.

#### Input Fields
*   **Visuals:** `surface_container_low` background, no border.
*   **Focus State:** A 2px "Ghost Border" using `surface_tint` (#2151da) at 40% opacity.
*   **Radius:** Rounded `sm` (0.5rem) for a slightly more functional, precise feel compared to cards.

#### Chips & Status
*   **Selection:** Use `primary_fixed` (#dce1ff) with `on_primary_fixed` (#001551) text.
*   **Shape:** Pill-style (rounded-full).

---

### 6. Do's and Don'ts

*   **DO:** Use white space as a functional element. If a section feels crowded, double the padding rather than adding a divider.
*   **DO:** Use the `tertiary` (#7f2500) tones sparingly for "Limited Edition" or "Exclusive" property tags to create warmth.
*   **DON'T:** Use pure black (#000000) for text. Always use `on_surface` (#191c1d) to maintain a soft, premium contrast.
*   **DON'T:** Use standard 1px lines. If you feel the need to separate content, ask if a 40px gap or a subtle background tone shift can do the job instead.
*   **DO:** Align icons (Lucide-style) with the center of the text they accompany, ensuring they use the `outline` (#747686) color for a muted, sophisticated look.

---
**Director's Final Note:** This system is about the *invisible* details. Ensure that the 24px corner radius is consistent across all major containers. The "luxury" comes from the rhythm of the spacing and the lack of visual "noise." Keep it breathing. Keep it luminous.```