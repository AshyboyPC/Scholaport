# Fused Aesthetic — Style Reference
> A synthesis of Awesomic and Portal: twilight serif editorial meets infrastructure-grade zinc grids.

**Theme:** light with atmospheric hero

This design language fuses two distinct philosophies: the restrained, zinc-gray architectural grid of a premium marketplace (Awesomic) and the emotional, magazine-like twilight aesthetic of a native iOS product (Portal). 

The experience opens with a dramatic, full-bleed gradient sunset hero (sky-blue to warm coral), creating a cinematic emotional hook. Below the fold, the interface transitions into a highly structured, paper-white and zinc-gray canvas. Typography is the centerpiece: massive retro-serif display headlines deliver an indie magazine feel, while a hyper-legible geometric sans handles the dense UI layer. Elevation violently rejects generic drop shadows in favor of crisp 1px hairline borders paired with ethereal 5px pale glow rings. The geometry relies on maximum contrast: strict pill shapes (50px) for all buttons against expansive, generously rounded (36px) content cards.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Obsidian | `#09090b` | `--color-ink-obsidian` | Headings, primary action buttons, dominant text — maximum contrast. |
| Graphite | `#18181b` | `--color-graphite` | Body text, nav text, badge text — the working ink color across paragraphs. |
| Fog | `#636363` | `--color-fog` | Muted helper text, secondary metadata, supporting labels. |
| Canvas Ash | `#f4f4f5` | `--color-canvas-ash` | The warm-cool gray page background for all sections below the hero. |
| Snow Surface| `#ffffff` | `--color-snow-surface`| Elevated card surfaces, inputs, and device mockups. |
| Ethereal Glow| `#f7f7f7` | `--color-ethereal-glow`| Used exclusively for the 5px soft elevation rings around cards and mockups. |
| Cloud Border | `#ececee` | `--color-cloud-border` | 1px hairline rules on cards, badges, and structural dividers. |
| Vivid Accent | `#ff5a00` or `#007aff` | `--color-vivid-accent` | The *only* chromatic accent in the UI. Used for active states, tiny visual punctuation, and primary CTA accents. |
| Dusk Gradient| `linear-gradient(...)`| `--color-dusk-gradient`| A sky-blue to warm coral sunset gradient reserved solely for the hero atmosphere. |

## Tokens — Typography

### Perfectly Nineties (or Recoleta) — Display Serif
- **Weights:** 400
- **Sizes:** 36px, 48px, 64px
- **Line height:** 1.0 – 1.1
- **Role:** The signature editorial voice. Used exclusively for H1/H2. This retro serif contrasts with the UI sans to feel like a magazine rather than a dashboard.

### Cosmica (or Inter) — The UI Workhorse Sans
- **Weights:** 400, 500, 600
- **Sizes:** 12px, 14px, 16px, 20px
- **Line height:** 1.30 – 1.45 (tight tracking)
- **Role:** Body, nav, links, labels, and button text. Dense, highly legible, and infrastructure-grade.

## Tokens — Spacing & Shapes

**Density:** Spacious between sections, compact inside cards.

### Border Radius
| Element | Value |
|---------|-------|
| Cards / Frames | 36px |
| Nav Capsule | 22px |
| Badges & Inputs | 12px – 14px |
| Buttons (Pills) | 50px (fully rounded) |

### Shadows & Elevation
- **Card Depth:** `0px 0px 0px 5px #f7f7f7, inset 0 0 0 1px #ececee` (A 1px structural hairline border surrounded by a 5px ethereal glow ring. No traditional drop shadows allowed).
- **Dark Buttons:** `inset 0 0.5px 0 0 rgba(255,255,255,0.5), 0 0 0 1.5px rgb(44,46,52), 0 4px 6px 0 rgba(0,0,0,0.14)`

## Layout & Components

### 1. The Atmospheric Hero
A full-bleed linear gradient (Dusk Gradient) stretching edge-to-edge. H1 is massive retro serif (Perfectly Nineties). The primary CTA is a stark white pill button (50px radius). Product mockups (white device frames with 5px glow rings) overlap the bottom edge of the gradient into the canvas below.

### 2. Floating Nav Capsule
Instead of a full-width header, use a floating capsule. White background, 22px radius, 1px border with a 5px glow ring. Brand on the left, sans-serif links on the right.

### 3. Zinc-Grid Content Cards
Content below the fold sits on the Ash (`#f4f4f5`) canvas. Cards are pure white (`#ffffff`) with 36px border radii and 1px hairline borders (`#ececee`). The internal layout of cards is dense and architectural (Awesomic), but the typography inside uses the strict serif/sans pairing.

### 4. Accent Badges & Tags
Use small pill-shaped tags (12px radius, 1px hairline border) for metadata. Use the Vivid Accent color (`#ff5a00` or `#007aff`) *only* as a solid background for incredibly important chips (like "YC Backed" or "New Feature"). 

### 5. Breakthrough Imagery
Break the structured zinc grids with full-bleed, cinematic photography (landscapes, organic textures) as visual dividers between major content sections. No illustrations, no isometric 3D art.
