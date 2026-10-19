# Organic Coffee & Botany — Style Reference

Playful but organic aesthetic on a deep roasted canvas

**Theme:** dark / warm

Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.

This interface treats the page like a cozy, modern organic catalog: a deep roasted brown canvas, chunky rounded display type, and saturated terracotta that reads as 'action' or 'highlight' the moment it appears. Body copy stays calm in soft parchment tones so the Terracotta and Botanical Green can do all the emotional work — terracotta for primary actions and display headings, green for interactive links, success states, and secondary actions. Components are pill-shaped or chunky-rounded with thick 2px borders, giving every button the feel of a premium, tactile sticker pressed onto the dark canvas.

## Tokens — Colors

| Name | Value | Token | Role |
| :--- | :--- | :--- | :--- |
| Dark Roast | `#2C1E16` | `--color-dark-roast` | Page canvas, main background, negative space |
| Mocha Brown | `#3E2723` | `--color-mocha-brown` | Elevated surfaces, cards, footer background band |
| Clay Terracotta | `#C55A3F` | `--color-clay-terracotta` | Primary CTA fill, main display headings, active states |
| Brick Terracotta | `#A2412A` | `--color-brick-terracotta` | Darker terracotta for borders, hover states, or subtle deep accents |
| Botanical Green | `#4A7C59` | `--color-botanical-green` | Secondary CTAs, text accent for links, success tags |
| Fresh Sage | `#689F77` | `--color-fresh-sage` | Soft green wash for highlights, active navigation labels |
| Parchment White | `#F1E8D9` | `--color-parchment-white` | Hero headings, primary body copy, button text on Terracotta |
| Latte Gray | `#BCAAA4` | `--color-latte-gray` | Muted body paragraphs, secondary descriptive text — recedes softly |
| Cocoa Gray | `#795548` | `--color-cocoa-gray` | Disabled or low-emphasis nav labels, subtle UI borders |

## Tokens — Typography

### display-face
Display headlines for section titles — a custom rounded display face that gives the brand its friendly voice. Substitute with 'Recoleta', 'Fraunces', or 'Nunito Black' at matching weight. `letter-spacing: -0.0200em` · `--font-display`

- Weights: 700, 800
- Sizes: 48px, 64px
- Line height: 1.20
- Letter spacing: -0.0200em
- Role: Display headlines for section titles.

### body-sans
Body paragraphs and nav links at 17px/500 — a geometric sans that stays readable while letting weight 700 carry emphasis. Substitute with 'Inter', 'Quicksand', or 'Nunito Sans' · `--font-body-sans`

- Weights: 500, 700
- Sizes: 13px, 14px, 15px, 17px, 19px, 32px
- Line height: 1.15 to 1.47
- Letter spacing: normal (0.0530em on uppercase nav)
- Role: Body paragraphs, nav links, and subheadings.

## Components

### Primary CTA Button
- **Role:** Filled terracotta button for 'Get started' and top-of-page conversion
- **Specs:** Fill `#C55A3F`, text `#F1E8D9` (Parchment), body-sans 700 at 15px uppercase with 0.0530em tracking, 12px border-radius, 16px horizontal padding. Sits directly on the Dark Roast canvas.

### Outlined Secondary Button
- **Role:** Secondary CTA below primary on hero
- **Specs:** Transparent fill, text in `#4A7C59` (Botanical Green), body-sans 700 at 14px, 12px border-radius, 16px horizontal padding, 2px solid border in `#4A7C59` or `#795548`.

### Nav Pill
- **Role:** Selector in top header
- **Specs:** Transparent fill, text in `#BCAAA4` at 15px uppercase with 0.0530em tracking, 12px border-radius, 10px vertical and 16px horizontal padding, 2px solid border in `#795548`.

### Section Headline
- **Role:** Display heading for marketing sections
- **Specs:** display-face 700 at 48-64px, line-height 1.2, letter-spacing -0.0200em, color `#C55A3F` (Clay Terracotta).

### Hero Headline
- **Role:** Opening page headline above CTA
- **Specs:** body-sans 700 at 32px, color `#F1E8D9` (Parchment White). Stays beautifully soft and legible so the Terracotta CTA below it carries the color weight.

### Body Paragraph
- **Role:** Marketing body text in sections
- **Specs:** body-sans 500 at 17px, line-height 1.18, color `#F1E8D9` (Parchment White) for main text, or `#BCAAA4` (Latte Gray) for secondary text. Recedes elegantly into the dark background.

### Footer / Section Background
- **Role:** Full-width band at bottom or alternating sections
- **Specs:** `#3E2723` (Mocha Brown) fill, `#F1E8D9` and `#689F77` text labels, generous 48px vertical padding.

## Do's and Don'ts

### Do
- Use `#C55A3F` (Clay Terracotta) for primary actions and major section headings to draw the eye warmly.
- Maintain the chunky, friendly feel with 12px border-radius on all interactive elements.
- Use `#F1E8D9` (Parchment White) for main body copy and hero text. Es el tono perfecto para leer cómodamente sobre `#2C1E16` (Dark Roast) sin el brillo molesto del blanco puro.
- Use `#4A7C59` (Botanical Green) exclusively for interactive links, soft success states, and secondary outlined CTAs.

### Don't
- Don't use pure black (`#000000`) or pure white (`#FFFFFF`). They are too harsh for this organic theme. Always use Dark Roast and Parchment White.
- Don't put dark text on the Dark Roast background. Paragraphs must stay in Parchment White or Latte Gray.
- Don't lose the thick borders. Even in dark mode, a 2px border in `#795548` (Cocoa Gray) gives elements that physical, tactile feel.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors - Base */
  --color-dark-roast: #2C1E16;
  --color-mocha-brown: #3E2723;
  
  /* Colors - Accents */
  --color-clay-terracotta: #C55A3F;
  --color-brick-terracotta: #A2412A;
  --color-botanical-green: #4A7C59;
  --color-fresh-sage: #689F77;
  
  /* Colors - Typography & UI */
  --color-parchment-white: #F1E8D9;
  --color-latte-gray: #BCAAA4;
  --color-cocoa-gray: #795548;

  /* Typography — Font Families */
  --font-display: 'Fraunces', 'Recoleta', 'Cinzel', serif;
  --font-body-sans: 'Quicksand', 'Manrope', 'Inter', sans-serif;

  /* Spacing & Shapes */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --radius-xl: 12px;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-dark-roast: #2C1E16;
  --color-mocha-brown: #3E2723;
  --color-clay-terracotta: #C55A3F;
  --color-brick-terracotta: #A2412A;
  --color-botanical-green: #4A7C59;
  --color-fresh-sage: #689F77;
  --color-parchment-white: #F1E8D9;
  --color-latte-gray: #BCAAA4;
  --color-cocoa-gray: #795548;

  /* Typography */
  --font-display: 'Fraunces', 'Recoleta', 'Cinzel', serif;
  --font-body-sans: 'Quicksand', 'Manrope', 'Inter', sans-serif;

  /* Border Radius */
  --radius-xl: 12px;
}
```
