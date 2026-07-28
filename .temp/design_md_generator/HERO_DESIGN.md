---
name: Midnight Kinetic
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#89ceff'
  on-secondary: '#00344d'
  secondary-container: '#00a2e6'
  on-secondary-container: '#00344e'
  tertiary: '#ffb783'
  on-tertiary: '#4f2500'
  tertiary-container: '#d97721'
  on-tertiary-container: '#452000'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#c9e6ff'
  secondary-fixed-dim: '#89ceff'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#004c6e'
  tertiary-fixed: '#ffdcc5'
  tertiary-fixed-dim: '#ffb783'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#703700'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 64px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  section-gap: 80px
---

## Brand & Style

This design system is engineered for a high-end AI marketplace, targeting developers and enterprise innovators who value precision and bleeding-edge technology. The aesthetic is a fusion of **Modern Minimalism** and **Refined Glassmorphism**, creating an environment that feels both expansive and focused.

The emotional response should be one of "Technical Sophistication"—where the complexity of artificial intelligence is housed within a calm, dark, and highly organized interface. Key visual drivers include:
- **Atmospheric Depth:** Using layered transparencies to suggest a multi-dimensional digital space.
- **Luminous Accents:** Small, high-energy focal points that guide the eye toward primary actions.
- **Structural Clarity:** Sharp borders and intentional whitespace that prevent the dark theme from feeling heavy or cluttered.

## Colors

The palette is anchored in **Deep Midnight Blacks** and **Charcoal Grays** to provide a canvas where content is the protagonist. 

- **Core:** The background uses `#0A0A0A` to maintain true black depth on OLED screens, while UI surfaces use `#171717` to create subtle separation.
- **Accents:** **Electric Indigo** (#6366F1) is the primary interactive color, used for CTA buttons and active states. A secondary **Sky Blue** (#0EA5E9) is reserved for informational highlights or secondary AI categories.
- **Gradients:** Use a subtle linear gradient (Indigo to Sky Blue) for high-impact elements like featured AI model cards or progress bars.
- **State Colors:** Success (Emerald), Warning (Amber), and Error (Rose) should be used at 80% saturation to maintain the premium, slightly desaturated "Pro" feel.

## Typography

This design system utilizes a trio of typefaces to establish a clear information hierarchy:
1. **Plus Jakarta Sans** for headlines to provide a modern, slightly geometric personality. 
2. **Inter** for body text to ensure maximum legibility and a neutral, systematic feel.
3. **Geist** (Monospaced) for metadata, labels, and technical AI specs to emphasize the developer-centric nature of the marketplace.

Large headings should utilize tight letter spacing and heavy weights to command attention, while small labels should be tracked out (increased letter spacing) and presented in uppercase for a "technical blueprint" aesthetic.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** model with a hard 8px baseline rhythm. 

- **Desktop:** 12-column grid with a 1280px max-width container. Margins are generous (48px) to allow the "Glass" effects room to breathe.
- **Mobile:** 4-column grid with 16px margins.
- **Rhythm:** Use increments of 8px for all internal component spacing. Larger "Section Gaps" (80px+) are encouraged between different AI categories to maintain a premium, airy feel.
- **Alignment:** Content should be strictly aligned to the grid, but decorative background "blobs" (glowing gradients) can exist off-grid to break symmetry and add dynamism.

## Elevation & Depth

This design system avoids traditional heavy shadows in favor of **Tonal Layering** and **Luminous Borders**.

1. **Level 0 (Base):** `#0A0A0A` – The canvas.
2. **Level 1 (Card/Container):** `#171717` – Elevated surface with a 1px solid border at `#262626`.
3. **Level 2 (Hover/Active):** Glassmorphic effect. Surface opacity at 60%, with a `20px` backdrop-blur. The border color shifts to a subtle Indigo glow (`rgba(99, 102, 241, 0.3)`).
4. **Lighting:** Use a very subtle "top-down" light source. Apply a subtle linear-gradient stroke (White at 10% opacity to Transparent) on the top edge of primary buttons to simulate a physical edge catch-light.

## Shapes

The shape language is **Soft (Level 1)**. While the product is modern and "sharp," total 0px corners feel too aggressive for a marketplace. 

- **Standard Elements:** 4px (0.25rem) radius for checkboxes and input fields.
- **Cards/Buttons:** 8px (0.5rem) radius for primary UI containers and CTA buttons.
- **Visual Interest:** Large imagery or featured hero sections may use 12px (0.75rem) to provide a slightly softer frame for technical content.

## Components

- **Buttons:** Primary buttons use a solid Electric Indigo background. Secondary buttons use a "Ghost" style: 1px Charcoal border that illuminates to Indigo on hover. Labels are bold Inter.
- **Inputs:** Darker than the surface (`#0D0D0D`) with a 1px border. On focus, the border glows Indigo with a 4px outer blur.
- **Chips/Tags:** Used for AI categories (e.g., "LLM", "Vision"). Use the Geist Mono font, small caps, with a subtle `#262626` background and no border.
- **Cards:** The core component of the marketplace. Cards should have a "Glass" header area and a solid Charcoal body. Use a 1px border throughout.
- **Status Indicators:** Use small, pulsing "Glow" dots to indicate live API status or active AI models, utilizing the Primary or Success colors.