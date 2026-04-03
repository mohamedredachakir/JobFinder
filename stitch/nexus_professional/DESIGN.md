# The Design System: High-End Editorial Specification

## 1. Overview & Creative North Star: "The Career Architect"
The design system moves away from the generic "dashboard" aesthetic typical of job boards. Our North Star is **The Career Architect**—a philosophy that treats the job search not as a transactional database search, but as an intentional, editorial experience. 

We break the "template" look by utilizing wide margins, intentional asymmetry, and a departure from traditional borders. The UI should feel like a premium digital magazine: authoritative, breathing with white space, and structured through light and depth rather than lines.

---

## 2. Colors & Surface Philosophy
We utilize a sophisticated palette that prioritizes tonal depth over structural rigidity.

### Palette Highlights
*   **Primary (`#004ac6`):** Our "Command Blue." Use for high-intent actions.
*   **Surface (`#f7f9fb`):** The canvas. A cool, crisp white-adjacent blue that reduces eye strain.
*   **Tertiary (`#006242`):** Our "Success Green." Reserved for growth indicators and hired statuses.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section content. Boundaries must be defined solely through:
1.  **Background Shifts:** Place a `surface-container-low` card against a `surface` background.
2.  **Tonal Transitions:** Using the spacing scale to let white space act as the divider.

### The "Glass & Gradient" Rule
To elevate the experience, floating elements (modals, dropdowns) should utilize **Glassmorphism**:
*   **Fill:** `surface_container_lowest` at 85% opacity.
*   **Effect:** `backdrop-filter: blur(12px)`.
*   **CTAs:** Use a subtle linear gradient from `primary` to `primary_container` (135deg) to add a "liquid" dimension to buttons.

---

## 3. Typography: Editorial Authority
We use **Inter** for its mathematical precision and neutral warmth. The hierarchy is designed to make job titles feel like headlines and descriptions feel like prose.

| Level | Token | Size | Weight | Tracking |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | `display-lg` | 3.5rem | 700 | -0.02em |
| **Headline (H1)** | `headline-lg` | 2.0rem | 600 | -0.01em |
| **Headline (H2)** | `headline-md` | 1.75rem | 600 | -0.01em |
| **Headline (H3)** | `headline-sm` | 1.5rem | 500 | 0 |
| **Title** | `title-lg` | 1.375rem | 500 | 0 |
| **Body (Default)** | `body-lg` | 1.0rem | 400 | 0 |
| **Label** | `label-md` | 0.75rem | 600 | 0.05em (All Caps) |

*Director's Note:* Use `display-lg` sparingly for hero statements only. All labels should use `0.05em` letter-spacing to ensure legibility at small scales.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are often "dirty." This system uses **Ambient Light** principles.

*   **The Layering Principle:** Depth is achieved by "stacking" surface tiers. 
    *   *Base:* `surface`
    *   *Section:* `surface-container-low`
    *   *Card:* `surface-container-lowest` (pure white)
*   **Ambient Shadows:** For high-elevation elements (elevated FABs, active cards), use:
    *   `box-shadow: 0 12px 32px -4px rgba(25, 28, 30, 0.06);`
*   **The Ghost Border Fallback:** If a container sits on an identical color background, use `outline_variant` at **15% opacity**. Never use 100% opacity for borders.

---

## 5. Components: The Signature Collection

### Buttons (The Kinetic Signature)
All transitions are **200ms cubic-bezier(0.4, 0, 0.2, 1)**.
*   **Primary:** Gradient fill (`primary` to `primary-container`). Corner radius: `md` (0.75rem).
*   **Secondary:** No background. `outline` at 20% opacity. On hover, background shifts to `surface-container-high`.
*   **Tertiary:** Text-only, bold `label-md` with an underline that expands from center on hover.

### Job Cards & List Items
*   **Strict Rule:** Forbid divider lines. 
*   **Structure:** Use `8px` (`sm` spacing) for internal grouping and `32px` (`xl` spacing) to separate distinct card entities.
*   **Interaction:** On hover, a card should not move upward; instead, its shadow should subtly deepen, and the background should shift from `surface-container-low` to `surface-container-lowest`.

### Input Fields
*   **Style:** Underlined or "Soft Box."
*   **Active State:** The label floats and the underline expands to 2px using `primary`. The background of the input should subtly tint to `primary_fixed` at 5% opacity.

### Featured Component: The "Match Gauge" (Contextual)
A specialized chip for JobFinder. It uses a circular `tertiary` (Success) track to show "Match Score." It should utilize the **Glassmorphism** rule when overlaying job images.

---

## 6. Spacing Scale
Our spacing is built on a 4px baseline, but we prefer "Breathing Room" over density.

*   **4px / 8px:** Atomic spacing (Icon to text).
*   **16px / 24px:** Component internal padding.
*   **32px / 48px:** Sectional layout gaps.

---

## 7. Do’s and Don'ts

### Do:
*   **Do** use asymmetrical layouts for Hero sections (e.g., text left-aligned, image slightly overlapping the container boundary).
*   **Do** use `on_surface_variant` for secondary text to create a clear visual hierarchy against `on_surface`.
*   **Do** ensure all interactive elements have a 200ms transition.

### Don't:
*   **Don't** use black (`#000000`). Use `on_surface` (`#191c1e`) for a more natural, premium contrast.
*   **Don't** use standard "Material Blue." Stick to our specific `primary` (`#004ac6`) which has more depth.
*   **Don't** use dividers between list items. Let the vertical rhythm of typography and white space define the break.