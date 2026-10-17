---
name: Top Deck Archival Collector
colors:
  surface: '#fff9ee'
  surface-dim: '#e2d9c4'
  surface-bright: '#fff9ee'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fcf3dd'
  surface-container: '#f6edd7'
  surface-container-high: '#f0e8d2'
  surface-container-highest: '#ebe2cc'
  on-surface: '#1f1b0e'
  on-surface-variant: '#50443d'
  inverse-surface: '#353022'
  inverse-on-surface: '#f9f0da'
  outline: '#82746b'
  outline-variant: '#d4c3b9'
  surface-tint: '#7c5638'
  primary: '#311701'
  on-primary: '#ffffff'
  primary-container: '#4a2b11'
  on-primary-container: '#bf916f'
  inverse-primary: '#efbc98'
  secondary: '#904d00'
  on-secondary: '#ffffff'
  secondary-container: '#fe9836'
  on-secondary-container: '#693600'
  tertiary: '#341500'
  on-tertiary: '#ffffff'
  tertiary-container: '#532600'
  on-tertiary-container: '#d8874e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdcc4'
  primary-fixed-dim: '#efbc98'
  on-primary-fixed: '#2f1501'
  on-primary-fixed-variant: '#623f23'
  secondary-fixed: '#ffdcc2'
  secondary-fixed-dim: '#ffb77c'
  on-secondary-fixed: '#2e1500'
  on-secondary-fixed-variant: '#6d3900'
  tertiary-fixed: '#ffdcc7'
  tertiary-fixed-dim: '#ffb787'
  on-tertiary-fixed: '#311300'
  on-tertiary-fixed-variant: '#723600'
  background: '#fff9ee'
  on-background: '#1f1b0e'
  surface-variant: '#ebe2cc'
typography:
  display:
    fontFamily: EB Garamond
    fontSize: 3.5rem
    fontWeight: '600'
    lineHeight: '1.1'
  headline-lg:
    fontFamily: EB Garamond
    fontSize: 2.5rem
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 1.875rem
    fontWeight: '600'
    lineHeight: '1.25'
  headline-md:
    fontFamily: EB Garamond
    fontSize: 2rem
    fontWeight: '500'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: EB Garamond
    fontSize: 1.5rem
    fontWeight: '500'
    lineHeight: '1.35'
  title:
    fontFamily: Manrope
    fontSize: 1.125rem
    fontWeight: '700'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Manrope
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Manrope
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: '1.45'
  label-lg:
    fontFamily: Manrope
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: '1.2'
  label-md:
    fontFamily: Manrope
    fontSize: 0.75rem
    fontWeight: '700'
    lineHeight: '1.2'
  label-sm:
    fontFamily: Manrope
    fontSize: 0.6875rem
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes an archival, high-end collector environment tailored for Magic: The Gathering competitive players, collectors, and 3D digital binder exploration. It balances tactile vintage warmth—reminiscent of bespoke leather folios, antique wood playtables, and archival parchment—with luminous modern UI precision.

The style unites subtle physical metaphors with crisp typography:
- **Atmosphere:** Luminous parchment warmth (`#F7EED8`), grounded by deep heirloom chocolate wood (`#4A2B11`) and gilded amber accents (`#E68523`).
- **Design Philosophy:** Tactile archival elegance meets clean catalog utility. Digital surfaces avoid clinical white backdrops, substituting them with warm parchment tiers that prevent eye fatigue during long browsing sessions and make trading card artwork pop with high contrast.
- **Emotional Resonance:** Prestige, authenticity, collector reverence, and competitive focus.

## Colors

The palette directly honors the vintage brand emblem, translating natural parchment, warm amber gilding, and dark chocolate wood into semantic roles:

- **Primary (`#4A2B11`):** Deep chocolate brown / aged oak. Serves as high-contrast body typography, structural dividers, dark binder leather trims, and foundational interactive states.
- **Secondary (`#E68523`):** Warm amber orange / burnished gold. Deployed for primary actions, mythic/rare highlights, card foil reflections, and active 3D viewing controls.
- **Tertiary (`#8C4A15`):** Warm mahogany. Utilized for secondary badges, hover states on amber actions, and vintage rule outlines.
- **Neutral Canvas (`#F7EED8`):** Archival warm parchment. Provides the core canvas background, layered with lighter parchment ivory (`#FDFBF7`) for elevated card sleeves and container wells (`#EFE0C2`, `#F3E5C8`) for structural framing.

## Typography

The typography couples the intellectual romance of `EB Garamond` with the clean, modern engineering of `Manrope`:

- **EB Garamond (Editorial Serif):** Used for large titles, collection names, card set headers, and showcase quotes. It honors historical printing traditions and fantasy worldbuilding.
- **Manrope (Geometric Modern Grotesque):** Used for all data-dense UI, card condition grading (NM, LP, MP), pricing grids, mana symbols, rules text, and binder toolbars. It ensures instant legibility at fractional sizes on mobile viewports.
- **Rhythm & Optical Balance:** Display headings use tightened line heights and generous letter spacing, while small uppercase labels use tracking (`letter-spacing: 0.06em`) for precise card meta tags.

## Layout & Spacing

The layout is built around a structured 12-column responsive grid engineered for card collectors:

- **Desktop (1024px+):** 12 columns, 2rem margins, 1.25rem gutters. Facilitates 3x3 binder pocket spreads (standard 9-pocket MTG binder view) with contextual side drawers for pricing and metadata.
- **Tablet (768px - 1023px):** 8 columns, 1.5rem margins, 1rem gutters. Translates binder pages into 2x2 or continuous 4-across gallery views.
- **Mobile (< 768px):** 4 columns, 1rem margins, 0.75rem gutters. Employs horizontal thumb-swipe carousels for binder spreads and 2-column stacked card search results.
- **Collector Rhythm:** Space tokens (`space-xs` through `space-xl`) govern pocket margins and padding, ensuring card borders stay optically balanced within digital binder sleeves.

## Elevation & Depth

Visual hierarchy uses warm tonal parchment stratification accented by diffused, amber-chocolate ambient drop shadows:

- **Level 0 (Base Canvas):** `#F7EED8` (Warm Parchment). Unshadowed, tactile foundational field.
- **Level 1 (Pockets & Binder Pages):** `#F3E5C8` bounded by hairline strokes (`rgba(74, 43, 17, 0.12)`). Embedded inset shadow (`inset 0 1px 3px rgba(74, 43, 17, 0.08)`) simulating recessed card sleeves.
- **Level 2 (Cards & Floating Tiles):** Crisp `#FDFBF7` parchment surface with a soft, warm ambient shadow (`0 4px 12px -2px rgba(74, 43, 17, 0.10), 0 2px 6px -1px rgba(74, 43, 17, 0.06)`).
- **Level 3 (Interactive Modals & 3D Viewer Overlays):** Ambient elevated drop shadow (`0 16px 32px -4px rgba(74, 43, 17, 0.18)`), framed by a 1px solid mahogany border (`#8C4A15` at 20% opacity).
- **3D Binder Depth:** 3D viewport canvas uses subtle radial illumination centered behind the binder spine, fading outward to a darker warm tone (`#E5D4B2`) to emphasize the volumetric 3D folio.

## Shapes

The design system adopts **Soft (Level 1)** roundedness to echo the refined, die-cut corners of physical MTG cards and archival display folios:

- **Base Components (Inputs, Buttons, Badges):** `0.25rem` (4px) corner radius. Delivers clean, structured geometry that honors papercraft edges without sharp digital harshness.
- **Cards & Sleeves:** `0.5rem` (8px, `rounded-lg`) matching the exact physical die-cut curvature of Magic: The Gathering trading cards.
- **Modals & Binder Covers:** `0.75rem` (12px, `rounded-xl`) reflecting thick archival binder corners with leather-stitched profiles.

## Components

### Buttons
- **Primary:** Background in `#E68523` (amber orange), text in white, with a subtle bottom bevel border (`#8C4A15`). On hover, shifts to `#8C4A15` with an elevated warm glow.
- **Secondary:** Surface `#F3E5C8` bordered with `#4A2B11` (1.5px), typography in `#4A2B11`. Hover fills with `#EFE0C2`.
- **Ghost / Utility:** Transparent fill, `#4A2B11` text, hover receives a faint amber tint (`rgba(230, 133, 35, 0.1)`).

### Cards & 3D Binder Pockets
- **Card Sleeves:** Recessed `#F3E5C8` containers with 1px border (`rgba(74, 43, 17, 0.14)`).
- **Active / Foil Cards:** Overlaid with a subtle holographic spectral sheen effect on hover, accompanied by a 2px amber accent outline (`#E68523`) indicating selection.

### Chips & Badges
- **Condition Tags (NM, EX, VG):** Pill shape with 0.25rem radius. `#4A2B11` dark wood background with `#F7EED8` typography, or translucent parchment fill with bold status-colored borders (Mint: Forest Moss, Played: Aged Ochre).
- **Set & Rarity Badges:** Gilded amber accents with high-contrast chocolate brown text.

### Form Inputs & Search
- **Text Inputs:** `#FDFBF7` fill, 1px `#8C4A15` border (30% opacity), inset shadow. Focus triggers a 2px `#E68523` focus ring with no harsh browser outline.
- **Checkboxes & Radios:** Soft-cornered squares, checked state filled with `#4A2B11` and an amber-accented mark.

### 3D Binder Controls
- Floating parchment HUD dock (`#FDFBF7` with 90% opacity and 12px backdrop-blur) pinned to the bottom viewport. Contains page-flip tabs, zoom controls, and foil toggle switch styled in dark chocolate brass.