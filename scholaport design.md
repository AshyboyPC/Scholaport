# Scholaport — Style Reference
> educational infrastructure meets premium consumer aesthetic — deep navy, organic glassmorphic layers, and hyper-legible precision.

**Theme:** light

Scholaport uses an expansive, trusting visual register: a deep navy (`#0a175a`) hero anchors the experience, giving way to warm, paper-toned off-white canvases (`#f5f6f4`, `#fffdf8`). The geometry relies on maximum rounding—full pill shapes (9999px) for all primary actions and generous 36px radii for main content frames. Elevation is achieved through premium glassmorphism (frosted backgrounds with saturated blur) and subtle inset border highlights rather than heavy drop shadows. Typography pairs the highly legible, geometric sans-serif **Manrope** for the UI with the massive, retro-flavored **Gumriot** for striking, oversized display wordmarks. The result is an interface that feels academic yet entirely modern, trustworthy, and human.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Deep Navy | `#0a175a` | `--color-deep-navy` | Hero backgrounds, primary dark buttons, heavy text headings — the foundational grounding color. |
| Ink Blue | `#09143f` | `--color-ink-blue` | Text on light buttons, deepest shadow tones. |
| Slate Blue | `#344061` | `--color-slate-blue` | Nav links, secondary dark text. |
| Muted Steel | `#526079` | `--color-muted-steel` | Body text, paragraph copy — easy to read on warm paper backgrounds. |
| Paper Off-White | `#f5f6f4` | `--color-paper` | Marketing page canvas background. |
| Warm Paper | `#fffdf8` | `--color-warm-paper` | Marketing intro sections, light button backgrounds. |
| Snow | `#ffffff` | `--color-snow` | Elevated surfaces, cards, and input fields. |
| Emerald Teal | `#01a995` | `--color-emerald-teal` | Primary brand accent — used for the logo, text highlights, and icons. |
| Mint Glow | `#9ff2e6` | `--color-mint-glow` | High-contrast accent on dark navy backgrounds (kickers, route highlights). |
| Coral Punch | `#f86746` | `--color-coral-punch` | Tiny visual punctuation — used sparingly for kicker dots and route nodes. |

## Tokens — Typography

### Manrope — The Workhorse UI Font
- **Weights:** 400, 500, 650, 750, 800, 900
- **Line height:** 1.02–1.75
- **Role:** Handles 99% of the interface. Geometric, highly legible, used for all body copy, UI elements, buttons, and standard headers.

### Gumriot — The Display Wordmark Font
- **Weights:** Normal
- **Role:** Used exclusively for massive, oversized typographic moments (like the clipped-texture footer wordmark). Provides a stylized, retro-human contrast to Manrope.

### Type Scale (Marketing)

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Kicker | ~11px (0.67rem) | 900 | uppercase (tracking 0.1em) |
| Body Sm | ~11px (0.68rem) | 650 | 1.5 |
| Nav/Link | ~13px (0.78rem) | 750-800 | normal |
| Body | ~16px (1rem) | 560 | 1.65 |
| Body Lg | ~17px (1.04rem)| 570 | 1.75 |
| H2 Section | clamp(2.25rem, 4vw, 4rem) | 800 | 1.02 (tracking -0.055em) |
| H1 Hero | clamp(3.1rem, 5.8vw, 5.4rem) | 800 | 0.98 (tracking -0.06em) |
| Wordmark | clamp(3.75rem, 14vw, 12.5rem)| normal | 1 (tracking 0.02em) |

## Tokens — Spacing & Shapes

**Density:** Comfortable, spacious sections.

### Border Radius
| Element | Value |
|---------|-------|
| Cards (small) | 22px |
| Nav Bar | 23px |
| Main Frames | 36px |
| Buttons/Pills | 9999px |

### Elevation & Glassmorphism
- **Nav & Glass Cards:** `background: rgb(255 255 255 / 76%); backdrop-filter: blur(18px) saturate(1.1);`
- **Subtle Inset Highlights:** `box-shadow: inset 0 1px 0 rgb(255 255 255 / X%)` (Used on dark buttons to give a crisp top edge).
- **Soft Shadows:** `box-shadow: 0 10px 32px rgb(7 17 63 / 10%)` (Used for floating navs and cards).

## Components

### Hero Section
Deep navy `#0a175a` background. H1 is massive Manrope (up to 5.4rem) with tight line-height (0.98) and negative tracking. Background includes large, subtle orbital/route rings (`border: 1px solid rgb(255 255 255 / 15%)` at 50% border-radius).

### Floating Nav
Floating capsule at the top of the page. Blurred glass background (`rgba(255,255,255,0.76)` + blur), 23px border-radius, soft drop shadow, 1px semi-transparent white border. Contains brand mark left, links center, and pill CTA right.

### Pill Action Buttons
Always fully rounded (`9999px`). 
- **Dark version:** Navy background, white text, top inner white highlight.
- **Light version:** `#fffdf8` background, ink text, soft drop shadow, top inner white highlight.

### Stage Cards (Hero Art)
Floating glassmorphic cards over the navy hero. `rgb(255 253 248 / 86%)` background, 12px backdrop blur, 22px radius, and a crisp white inset top border. Used to display UI snippets or conceptual "starting point / destination" labels.

### Kickers
Small uppercase text (0.67rem, weight 900, 0.1em tracking). Sometimes preceded by a tiny 8px circular dot in Coral (`#f86746`) with a semi-transparent glow ring `box-shadow: 0 0 0 4px rgb(248 103 70 / 18%)`.

### Oversized Footer Wordmark
The word "Scholaport" set in Gumriot at massive scale (up to 12.5rem), tucked at the bottom of the page with negative margin-bottom (`-0.28em`) so the bottom 15-20% is clipped off. The text uses a texture image via `background-clip: text; color: transparent;` for a premium finish.

## Layout
- **Page shell:** 1180px max-width (`width: min(1180px, calc(100% - 40px))`).
- **Section rhythm:** Extremely generous padding (e.g., `126px 0`, `156px 0`).
- **Asymmetry:** Hero art uses slight rotations (`-13deg`, `-5deg`, `5deg`) on elements to feel organic and fluid, contrasting with the strict typography.
