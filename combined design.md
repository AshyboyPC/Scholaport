# Fused Aesthetic — Comprehensive Style Reference
> Awesomic × Portal: infrastructure-grade zinc editorial meets twilight serif atmosphere. Two design systems, one cohesive vision.

**Theme:** Light — atmospheric hero transitions into structured editorial canvas.

---

This design language is a deliberate, high-craft synthesis of two distinct visual philosophies:

**Awesomic** operates in a restrained, neutral-first visual register: a zinc-gray scale carries nearly the entire interface, with one vivid orange badge accent and almost no other chromatic intrusion. The geometry is defined by generous corner rounding—36px cards, 14px buttons, 10000px pills—and hairline 1px borders replace drop shadows as the primary elevation tool. Typography is a single custom geometric sans (Cosmica) deployed at bold display weights for editorial headlines, paired with compact 14px body text that signals efficiency. The atmosphere is that of a confident, infrastructure-grade marketplace: quiet surfaces, precise density, and color deployed as functional punctuation rather than decoration.

**Portal** uses a twilight-editorial visual language: a dramatic sunset gradient hero (sky-blue fading through violet to warm coral) gives way to a clean, paper-white editorial canvas below. Display headlines are set in Perfectly Nineties—a confident retro serif that signals craft over typical startup sans. Body and UI copy stay in Inter at restrained sizes, with one vivid iOS-blue accent (#007aff) punctuating an otherwise achromatic system. Surfaces are flat and generously rounded: cards at 22–30px, buttons as full pills at 50px, and the floating nav as a soft white capsule. Elevation is whispered rather than dropped—the system prefers 1px outlines and pale #f7f7f7 glow rings over heavy shadows.

**The Synthesis:** The combined system opens with a dramatic atmospheric hero (Portal's soul) then transitions to a hyper-structured zinc-gray editorial grid (Awesomic's bones). The two serif/sans contrasts are preserved: a retro serif delivers emotion in display moments, a geometric sans handles every UI function. Elevation is achieved only through 1px hairline borders and 5px pale glow rings—no traditional drop shadows anywhere. The single vivid accent is used with extreme restraint as functional punctuation, never as decoration.

---

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#09090b` | `--color-obsidian` | Primary action buttons, hero headlines, dominant text — the deepest near-black that grounds every dark CTA and display heading against the light canvas. |
| Graphite | `#18181b` | `--color-graphite` | Body text, nav text, badge text — the working ink color across paragraphs, links, and labels. |
| Slate | `#27272a` | `--color-slate` | Secondary headings and elevated card surfaces — a mid-dark gray for cards that need visual weight. |
| Iron | `#3f3f46` | `--color-iron` | Muted text, button labels on light surfaces, badge text — the mid-gray used for secondary UI labels and outlined-button text. |
| Steel | `#52525b` | `--color-steel` | Icon strokes, supporting metadata — borders and icon outlines in darker contexts. |
| Fog | `#71717a` | `--color-fog` | Helper text, tertiary labels — muted copy and supporting metadata. |
| Ash | `#a1a1aa` | `--color-ash` | Placeholder text, disabled labels, light icon strokes — the lightest readable gray. |
| Mist | `#d4d4d8` | `--color-mist` | Subtle borders, secondary card fills, link pill backgrounds — structural divider color. |
| Cloud | `#ececee` | `--color-cloud` | Primary border color across the system — 1px hairline rules on cards, badges, and inputs. |
| Paper | `#f4f4f5` | `--color-paper` | Canvas background, card surfaces, badge fills — the warm-cool gray that carries the page surface. |
| Ash Mist | `#f7f7f7` | `--color-ash-mist` | Soft elevation glow rings around cards and images — the system's depth language. |
| Snow | `#ffffff` | `--color-snow` | Elevated surfaces (cards on canvas), input fields, button backgrounds for ghost/neutral actions, nav capsule. |
| Ink Black | `#000000` | `--color-ink-black` | Headings and primary borders in the editorial content layer — maximum-contrast structural color. |
| Graphite Dark | `#3e3e3e` | `--color-graphite-dark` | Body text on white editorial sections — softer than black for sustained reading. |
| Smoke | `#636363` | `--color-smoke` | Muted helper text, metadata labels, subtle borders in editorial sections. |
| Ember | `#ff5a00` | `--color-ember` | Accent badges (YC batch tags, highlight chips) — the sole chromatic badge. Reserved for startup credibility signals and category emphasis. Never used for body text, links, or large fills. |
| Signal Blue | `#007aff` | `--color-signal-blue` | Primary action buttons, active states, brand icon highlights, inline links — the iOS-native vivid blue that makes functional elements feel switched on. Used only in editorial/product sections. |
| Magenta Spark | `#fe45e2` | `--color-magenta-spark` | Rare decorative card accent — used as visual punctuation against the monochrome grid. |
| Dusk Sky | `#4a7ff2` | `--color-dusk-sky` | Top of the hero gradient — sky blue. |
| Dusk Violet | `#7b7ed8` | `--color-dusk-violet` | Mid gradient — violet haze. |
| Dusk Mauve | `#c98ab5` | `--color-dusk-mauve` | Lower gradient — warm mauve. |
| Dusk Coral | `#e8a87c` | `--color-dusk-coral` | Bottom of the hero gradient — warm coral sunset. |
| Dusk Gradient | `linear-gradient(180deg, #4a7ff2 0%, #7b7ed8 30%, #c98ab5 65%, #e8a87c 100%)` | `--gradient-dusk` | Full-bleed hero background — sky-blue descending through violet to warm coral sunset with landscape silhouettes at the base. |

### Quick Color Reference

**For editorial canvas (Awesomic layer):**
- Background: `#f4f4f5`
- Card surface: `#ffffff`
- Text primary: `#09090b`
- Text secondary: `#18181b`
- Text muted: `#52525b`
- Border: `#ececee`
- Accent badge: `#ff5a00`
- Primary CTA: `#09090b` (dark filled)

**For hero/atmospheric layer (Portal layer):**
- Background: `linear-gradient(180deg, #4a7ff2 0%, #7b7ed8 30%, #c98ab5 65%, #e8a87c 100%)`
- Canvas below hero: `#f7f7f7`
- Text headings: `#000000`
- Text body: `#3e3e3e`
- Text muted: `#636363`
- Card surface: `#ffffff`
- Glow ring: `#f7f7f7`
- Primary CTA on hero: `#ffffff` filled, `#000000` text (pill shape)
- Functional accent: `#007aff`

---

## Tokens — Typography

### Font 1: Perfectly Nineties Regular — Display and Heading
**Token:** `--font-perfectly-nineties`
**Substitute:** Playfair Display, DM Serif Display, Recoleta

The signature editorial voice of the system. A confident retro serif used exclusively for H1/H2 at 36–64px. The retro serif is the system's personality anchor—it deliberately contrasts with the geometric sans body text to feel like a magazine printed on good paper rather than a generic SaaS dashboard. It communicates craft, taste, and editorial curation.

- **Weights:** 400 only
- **Sizes:** 36px, 48px, 56px, 64px
- **Line height:** 1.00–1.12 (extremely tight for editorial impact)
- **Letter spacing:** Normal (never add tracking to the serif — it should breathe at its own pace)
- **OpenType features:** `"blwf", "cv03", "cv04", "cv09", "cv11"`

### Font 2: Cosmica — The Geometric UI Workhorse
**Token:** `--font-cosmica`
**Substitute:** DM Sans, Inter, SF Pro Text

The single-family type system for everything in the structured editorial grid layer. Deployed at bold display weights (56–64px / weight 600) for editorial headlines when the serif is not used, and at compact 14px body text for marketplace-grade UI density.

- **Weights:** 300, 400, 500, 600, 700
- **Sizes:** 10, 12, 13, 14, 15, 16, 18, 20, 32, 40, 56, 64
- **Line height:** 1.0–1.8
- **Letter spacing:** Normal (no tracking adjustments)
- **Role:** Single-family system for all non-display text — body, nav, buttons, labels, metadata.

### Font 3: Inter — Body, Nav, Links, Labels (Portal Layer)
**Token:** `--font-inter`
**Substitute:** SF Pro Text, -apple-system, Helvetica Neue

The workhorse UI font for the editorial content blocks and product UI sections that follow the Portal aesthetic. Tighter tracking gives a refined iOS-native feel that pairs perfectly with the retro serif headlines.

- **Weights:** 400, 500, 600
- **Sizes:** 10px, 12px, 14px, 16px, 18px
- **Line height:** 1.20–1.35
- **Letter spacing:** `-0.02em` across all sizes
- **OpenType features:** `"blwf", "cv03", "cv04", "cv09", "cv11"`

### Combined Type Scale

| Role | Size | Font | Weight | Line Height | Letter Spacing | Token |
|------|------|------|--------|-------------|----------------|-------|
| micro | 10px | Inter | 400 | 1.2 | -0.2px | `--text-micro` |
| caption | 12px | Cosmica/Inter | 400 | 1.64 | -0.24px | `--text-caption` |
| body-sm | 14px | Cosmica/Inter | 400 | 1.45 | -0.28px | `--text-body-sm` |
| body | 15–16px | Cosmica/Inter | 400–500 | 1.45–1.35 | -0.32px | `--text-body` |
| body-lg | 18px | Cosmica/Inter | 400 | 1.45 | — | `--text-body-lg` |
| subheading | 20px | Cosmica | 500–600 | 1.5 | — | `--text-subheading` |
| heading-sm (UI) | 18px | Inter | 500 | 1.35 | -0.36px | `--text-heading-sm` |
| heading-sm (display) | 32px | Cosmica | 600–700 | 1.5 | — | `--text-heading-sm-display` |
| heading | 36–40px | Perfectly Nineties | 400 | 1.0–1.28 | — | `--text-heading` |
| heading-lg | 48–56px | Perfectly Nineties | 400 | 1.0–1.28 | — | `--text-heading-lg` |
| display | 64px | Perfectly Nineties | 400 | 1.0–1.12 | — | `--text-display` |

---

## Tokens — Spacing & Shapes

**Base unit:** 4px (Awesomic) / 4px (Portal)
**Density:** Compact internal card density, extremely spacious section rhythm.

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 45 | 45px | `--spacing-45` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 68 | 68px | `--spacing-68` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value | Rule |
|---------|-------|------|
| Cards (editorial grid) | 36px | Every content container in the Awesomic layer. Non-negotiable. |
| Cards (Portal layer) | 22–30px | Product mockup frames, editorial content blocks. |
| Nav capsule | 22px | The floating nav pill in both layers. |
| Images | 30–40px | Photos used as section dividers. |
| Icons | 40px | Icon containers. |
| Badges (outlined) | 12px | Tag pills, category chips. |
| Inputs | 14px | Form fields. |
| Buttons (Awesomic inline) | 14px | CTA buttons in the zinc grid sections. |
| Buttons (Portal pills) | 50px | All interactive CTA elements outside the editorial grid — always fully rounded pills. |
| Pills (nav only) | 10000px | Navigation CTA actions. |

### Shadows & Elevation

| Name | Value | Usage |
|------|-------|-------|
| Card Glow Ring | `rgb(247, 247, 247) 0px 0px 0px 5px` | Wraps every card and mockup in the Portal editorial layer — the system's primary depth technique. |
| Button Inner Light | `rgba(255, 255, 255, 0.6) 0px 0.5px 0px 0.5px inset` | Inset highlight on filled buttons. |
| Blue Button Inner | `rgb(140, 194, 255) 0px 1px 0px 1px inset` | Used on Signal Blue filled pill buttons only. |
| Primary Dark Button | `inset 0 0.5px 0 0 rgba(255,255,255,0.5), inset 0 9px 14px -5px rgba(117,123,133,0.4), 0 0 0 1.5px rgb(44,46,52), 0 4px 6px 0 rgba(0,0,0,0.14)` | The obsidian filled CTA button in the Awesomic grid sections. |
| Card (Awesomic) | `none — uses 1px solid #ececee hairline border instead` | Cards in the zinc grid never have drop shadows. |
| md | `rgba(0, 0, 0, 0.04) 0px 4px 12px 0px` | Extremely subtle structural shadow for floating elements. |

---

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0a | Canvas (Awesomic) | `#f4f4f5` | Warm-cool gray page background for all structured editorial grid sections. |
| 0b | Canvas (Portal) | `#f7f7f7` | Soft neutral background for content sections below the hero in editorial flow. |
| 1 | Card | `#ffffff` | Elevated content surfaces sitting on the canvas in both systems. |
| 2 | Subtle Card | `#fafafa` | Slightly recessed surfaces within content areas. |
| 3 | Dark Surface | `#18181b` | Dark feature blocks and inverted sections in the Awesomic grid. |
| 4 | Deep Dark | `#27272a` | Darker feature cards and dark mode accents. |
| 5 | Nav Capsule | `#ffffff` | Floating navigation with 5px glow ring halo. |
| 6 | Hero Atmosphere | `linear-gradient(180deg, #4a7ff2 0%, #7b7ed8 30%, #c98ab5 65%, #e8a87c 100%)` | Full-bleed hero gradient — the only chromatic surface in the entire system. |

---

## Components

### Primary Action Button — Dark Filled (Awesomic Grid Layer)
**Role:** Main CTA in zinc-grid sections — 'Book demo', 'Get started', 'View plan'

Background `#09090b`, white text `#ffffff`, 1.5px solid `#2c2e34` border with subtle inset highlight shadow, 14px border-radius, 12px vertical / 16px horizontal padding, 14px Cosmica weight 400. The near-black fill with hairline border creates depth without a drop shadow.

**Shadow:** `inset 0 0.5px 0 0 rgba(255,255,255,0.5), inset 0 9px 14px -5px rgba(117,123,133,0.4), 0 0 0 1.5px rgb(44,46,52), 0 4px 6px 0 rgba(0,0,0,0.14)`

### Hero Pill Button — White Filled (Portal Hero Layer)
**Role:** Primary CTA on the gradient hero — the most visible interactive element on the atmospheric opening section.

50px border-radius, `#ffffff` background, `#000000` text in Inter/Cosmica 600 at 14–16px, padding 14px 24px. No border. The white-on-gradient contrast makes it the undeniable action target against the blue-to-coral backdrop.

### Ghost Pill Button — Outlined (Portal Layer)
**Role:** Secondary CTA — 'Learn more', cancel actions.

50px border-radius, transparent background, 1.5px `#000000` border, `#000000` text in Inter 500 at 14–16px, padding 12px 22px. Outlined only, never filled.

### Ghost Action Button — White on Dark (Awesomic Grid Layer)
**Role:** Secondary CTA on dark feature blocks.

Background `#ffffff`, dark text `#3f3f46`, 1px solid `#3f3f46` border, 36px pill radius, 20px all padding, 14px Cosmica. Used in nav and contrasting on dark sections.

### Neutral Pill Button — Light (Awesomic)
**Role:** Subtle action on light backgrounds — 'Our work', 'See more'.

Background `#fafafa`, text `#18181b`, 14px border-radius, 12px vertical / 16px horizontal padding, 14px Cosmica weight 400. No visible border — relies on subtle background contrast.

### Floating Nav Capsule
**Role:** Top-level site navigation — replaces a traditional full-width header bar in both layers.

22px border-radius, `#ffffff` background, 1px border with 5px `#f7f7f7` soft glow ring (`box-shadow: rgb(247, 247, 247) 0px 0px 0px 5px`). Contains brand mark left (gradient circle icon or wordmark), nav links center-right (Cosmica/Inter 500 14px `#000000`). Padding 8px 16px. Floats at the top of the viewport with 16–24px top margin. No bottom border, no full-width background fill.

### Category Card — Image Top (Awesomic)
**Role:** Service category showcase — 'Web & product', 'Motion design'.

Full-width image fills the top half flush to card edges, 36px border-radius, 28px bottom padding, 1px `#ececee` hairline border, no shadow. Title at 20px Cosmica weight 600 in `#09090b`. Tag pills sit inside the card at the bottom.

### Dark Feature Card (Awesomic)
**Role:** Pain-point listing with arrow bullets on inverted surfaces.

Background `#27272a` or `#18181b`, white text, 28–36px border-radius, 24px padding. Each list item at 20px Cosmica weight 500 with right-arrow accent. Creates a dark band that contrasts with the light page, breaking the gray monotony with purpose.

### Device Mockup Card (Portal Layer)
**Role:** Product showcase frame in the hero — contains the app interface preview.

Outer frame at 22–30px border-radius, `#ffffff` background, 5px `#f7f7f7` glow ring as elevation (`box-shadow: rgb(247, 247, 247) 0px 0px 0px 5px`). Inner screen area at 16px border-radius. The mockup overlaps into the landscape silhouette at the hero's bottom edge.

### Editorial Content Block (Portal Layer)
**Role:** Below-the-fold text sections on the white/light canvas.

Centered or left-aligned text column at 640–720px max reading width. H2 in Perfectly Nineties 400 at 36px, `#000000`, line-height 1.0. Body in Inter 400 at 16px, `#3e3e3e`, line-height 1.35, letter-spacing -0.32px. Paragraphs separated by 16–20px gap. Section gap 80–120px from adjacent blocks.

### Tag Pill Badge — Outlined (Awesomic)
**Role:** Category tags — 'Web', 'UX/UI design', 'Mobile app'.

Transparent background with 1px solid `#ececee` border, text `#18181b`, 12px border-radius, 4px vertical / 8px horizontal padding, 12–13px Cosmica weight 400. Hairline border treatment keeps tags quiet and unobtrusive.

### Filled Tag Badge — Dark (Awesomic)
**Role:** Skill/category labels that need more visual weight than outlined tags.

Background `#3f3f46`, text `#fafafa`, 12px border-radius, 4px/8px padding. Used where additional emphasis is needed.

### Orange Accent Badge (Awesomic — Use Sparingly)
**Role:** YC batch badges, credibility chips, highlight call-outs.

Background `#ff5a00`, white text, 12px border-radius, 4px/8px padding, 12px Cosmica weight 500. The system's single chromatic badge — reserved exclusively for startup credibility signals and key category emphasis. Never use for general UI or body copy.

### Status Badge — Pill (Portal Layer)
**Role:** Project status indicators in product UI sections.

50px border-radius full pill, Inter 500 12px text, padding 4px 10px. Subtle `#f7f7f7` background for neutral states, `#007aff`-tinted background for active/paid states. Used inside device mockups only.

### Email / Form Input Field
**Role:** Hero email capture, newsletter signup, search.

White background `#ffffff`, text `#333333`, 14px border-radius, 12px vertical / 16px horizontal padding, 1px transparent border. Pairs directly with a dark CTA button to its right. No visible ring on idle state — 1px `#007aff` ring on focus.

### Logo Strip — Social Proof
**Role:** Partner/client logos for social proof.

Grayscale logos rendered at 60–70% opacity, horizontally centered with even spacing. No background container. No color — fully desaturated.

### Stats Block
**Role:** Headline metrics — '20,000+ completed projects'.

Large number at 40–56px Cosmica weight 600 in `#09090b`. Adjacent descriptor at 14px weight 400 in `#52525b`, sitting to the right of the number on the same baseline. Three blocks in a horizontal row with even spacing.

### Breakthrough Image Section
**Role:** Full-bleed visual divider — landscape or organic texture photography.

Full-width photographic image (no overlay, no text), 48px or 64px corner radius on top corners. Functions as a visual breath between structured content sections. No illustrations, no abstract graphics, no 3D renders.

### Hero Gradient Background (Portal)
**Role:** Full-bleed atmospheric hero section. The only place color lives.

180deg linear gradient from `#4a7ff2` (sky-blue) at top through `#7b7ed8` (violet) to `#c98ab5` (mauve) and `#e8a87c` (warm coral) at the bottom, with dark landscape tree/horizon silhouettes along the bottom 15–20% of the viewport height. Product mockup overlaps into the silhouette.

### Soft Glow Ring (Portal Layer)
**Role:** Elevation substitute — surrounds cards, mockups, and floating images.

`box-shadow: 0px 0px 0px 5px #f7f7f7` — a pale outline that creates the sense of light emanating from the element rather than a traditional drop shadow. The system's primary depth language. Never use a heavier shadow than this.

### Brand Mark Icon
**Role:** Logo lockup in the nav capsule and footer.

Circular icon with blue-to-violet gradient (matching hero gradient mid-tones), containing a white arrow or mark glyph. Paired with product wordmark in Cosmica/Inter 600 18px, `#000000`. Icon-to-text gap 8px.

---

## Do's and Don'ts

### Do
- Use `#09090b` for all primary action buttons in zinc-grid sections — the dark filled CTA is the system's single most important interactive element in that layer.
- Set card border-radius to 36px (Awesomic layer) or 22–30px (Portal layer). Rely on 1px solid `#ececee` borders or 5px `#f7f7f7` glow rings for elevation — never drop shadows.
- Keep all editorial content canvas in `#f4f4f5` or `#f7f7f7`. Never go stark white for a full-page background — the warmth is essential.
- Reserve `#ff5a00` exclusively for YC-style accent badges and startup credential chips. Reserve `#007aff` for primary action states and functional accents in editorial product sections.
- Use 50–56px font sizes with Perfectly Nineties at 400 weight for all major section headings — this serif is what separates the design from generic SaaS.
- Apply 28px padding inside all cards (Awesomic) and 80–120px vertical rhythm between every major page section.
- Use 10000px border-radius for pill-shaped CTAs in the navigation, 50px for all portal-layer pill buttons, and 14px for inline Awesomic action buttons.
- Pair the serif headline with Inter/Cosmica body text at 14–16px — this contrast between macro editorial and micro precision is the system's core typographic move.
- Use 1px hairline borders (`#ececee` on light, `rgba(255,255,255,0.15)` on dark) as the primary structural divider everywhere.
- Round all images used as section dividers to 48–64px on the top corners.

### Don't
- Do not introduce new accent colors beyond the two designated accents (`#ff5a00` and `#007aff`). The system is 99% achromatic; adding blues, greens, or purples in additional roles would break the restrained register.
- Do not use drop shadows on cards — hairline borders and glow rings are the only permitted elevation techniques.
- Do not set display headlines below weight 600 in Cosmica (for the grid layer) — the bold weight is what makes it read as authoritative at display sizes.
- Do not use Perfectly Nineties below 36px — it is display-only, never body text, captions, or UI labels.
- Do not set body text above weight 600 — the system's restraint mechanism is in the weight range.
- Do not use `#ff5a00` or `#007aff` for body text, links, large fills, or decorative shapes — they are functional accent colors, not surface colors.
- Do not use border-radius below 12px on any visible container — the system's geometry is defined by generous rounding everywhere.
- Do not use pure black `#000000` in the Awesomic layer — `#09090b` is the deepest permitted ink. In the Portal layer, `#000000` is permitted only for headings and primary borders.
- Do not place `#000000` text directly on a chromatic or gradient background — text must only sit on white or near-white neutral surfaces.
- Do not use illustrations, isometric 3D art, or abstract geometric graphics — the system uses photography only.
- Do not break the pill rule for Portal-layer buttons — every single interactive element is a full pill at 50px radius, no exceptions.

---

## Imagery

Photography plays a structural and atmospheric role in this system, never decorative:

**Hero Atmosphere:** The hero gradient is the system's one purely atmospheric moment. Dark silhouetted tree/landscape horizons line the bottom 15–20% of the hero viewport. No text sits directly on the gradient except the headline and CTA pill.

**Section Dividers:** Full-bleed landscape or macro organic texture photography (green moss, stone, sky) with 48–64px top corner radii. These visual breathers are placed between major content sections. Images have no overlays, no duotone treatment, and no text.

**Category Cards:** Real product screenshots, app interfaces, or portfolio work filling the top half of 36px rounded card containers. Image is flush to card edges — no internal padding on the image area.

**Social Proof Strip:** All logos desaturated to grayscale at 60–70% opacity. No backgrounds, no labels.

**Product Mockups:** Product UI shown inside white device-frame containers with 22–30px radius and 5px glow rings. These are the only place where actual product screenshots appear in the hero layer.

No illustrations. No abstract graphics. No 3D renders. No stock imagery outside of photographic section dividers.

---

## Layout

**Max-width container:** 1200px, centered, with generous horizontal page margin.

**Section gaps:** 80–120px vertical padding between every major section. Never less than 80px.

**Card padding:** 28px inside all cards (Awesomic). 20px inside Portal-layer cards.

**Element gap:** 8–10px between inline elements.

### Hero Section
Full-bleed gradient (Dusk Gradient) from edge to edge. Floating nav capsule with 22px radius sits above with ~20px top margin. H1 is massive retro serif (36–64px) left-aligned or centered depending on composition. Primary CTA is a stark white pill. Product mockup overlaps the bottom edge into the landscape silhouette band. No competing text on the gradient.

### Below-the-Fold (Portal editorial flow)
Transitions to a `#f7f7f7` canvas immediately below the hero silhouette. Content is in a centered single column (640–720px reading width) with H2 in Perfectly Nineties and Inter body text. This is the editorial, human-voice section. Section gap 100–120px.

### Mid-Page (Awesomic grid layer)
The page transitions from the softer editorial flow into the structured marketplace grid. Canvas becomes `#f4f4f5`. Cards are pure white with 36px radius and 1px `#ececee` borders. Layout alternates between light card grids and dark inverted feature blocks (`#18181b` or `#27272a`), creating rhythm. Stats blocks appear here as horizontal rows.

### Dark Feature Bands
Full-width dark bands (`#18181b` or `#27272a`) break the light page with purpose. White display text at 32–40px Cosmica weight 700. Arrow-prefixed list items. These appear between grid sections to emphasize key value propositions.

### Footer
Footer sits on the deepest dark surface (`#09090b` or `#18181b`). A massive, oversized brand wordmark (Gumriot or display serif) sinks into the bottom of the footer with negative margin so the bottom 15% is intentionally clipped by the page edge. The wordmark may use `background-clip: text` with a texture image for premium treatment. Footer links are small Cosmica/Inter at muted opacity.

---

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0a | Editorial Canvas | `#f4f4f5` | Zinc-gray page background for all Awesomic structured sections. |
| 0b | Soft Canvas | `#f7f7f7` | Pale background for Portal editorial sections directly below the hero. |
| 1 | Card | `#ffffff` | Elevated content surfaces in both layers. |
| 2 | Subtle Card | `#fafafa` | Slightly recessed surfaces within content areas. |
| 3 | Dark Surface | `#18181b` | Dark feature blocks, inverted sections. |
| 4 | Deep Dark | `#27272a` | Darker feature cards and footer territory. |
| 5 | Nav Capsule | `#ffffff` | Floating navigation with 5px glow ring halo. |
| 6 | Hero Gradient | `linear-gradient(180deg, #4a7ff2 0%, #7b7ed8 30%, #c98ab5 65%, #e8a87c 100%)` | The only chromatic surface. Never replicate elsewhere. |

---

## Elevation (Full Reference)

- **Portal cards and mockups:** `0px 0px 0px 5px #f7f7f7`
- **Awesomic cards:** `1px solid #ececee` (border only — no shadow at all)
- **Dark CTA buttons (Awesomic):** `inset 0 0.5px 0 0 rgba(255,255,255,0.5), inset 0 9px 14px -5px rgba(117,123,133,0.4), 0 0 0 1.5px rgb(44,46,52), 0 4px 6px 0 rgba(0,0,0,0.14)`
- **Filled pill buttons (Portal):** `inset 0 1px 0 0 #ffffff, 0 0 0 1px rgba(0,0,0,0.15), 0 3px 2px 0 rgba(0,0,0,0.06)`
- **Link/Pill insets:** `inset 0 1px 0 0 rgb(228,228,231)`
- **Nav glow ring:** `rgb(247, 247, 247) 0px 0px 0px 5px`
- **Subtle card inner:** `rgb(228, 228, 231) 0px 1px 0px 0px inset`

---

## Geometry Philosophy

The system's spatial language is defined by a clear hierarchy of radii that never repeat across contexts:

- **10000px / 50px** — Full pill shapes. Reserved for nav action CTAs (10000px) and all Portal-layer pill buttons (50px). These create the softest, most welcoming interactive moments.
- **36px** — Major editorial cards and content containers in the Awesomic grid layer. Generous, inviting, spacious.
- **22–30px** — Product mockup frames, nav capsule, Portal-layer cards. Slightly tighter, more structured.
- **14px** — Inline action buttons in the Awesomic layer, inputs, and form fields. Precise and contained.
- **12px** — Tag pills, badges, and chips. Subtle, small, unobtrusive.
- **0px** — Never permitted on any visible UI surface.

The contrast between 14px (Awesomic buttons) and 50px (Portal pills) in the same visual system is intentional — it creates a subtle sense of two design worlds coexisting, which maps to the product's split between editorial information and functional product actions.

---

## Similar Brands

- **Linear** — Same monochromatic zinc-gray palette with hairline borders replacing shadows, compact 14px body text, and generous rounded cards. Also uses a single vivid accent with extreme restraint.
- **Vercel** — Dark filled CTAs on white canvas, large bold geometric display headlines, and near-zero chromatic palette with functional color only.
- **Stripe** — Editorial-grade typography with bold display weights at 48–64px, generous section spacing, and hairline border card treatments.
- **Pitch** — Editorial display-serif headlines paired with minimal sans-serif body, clean white surfaces, and restrained accent usage.
- **Framer** — Rounded geometry (28–36px cards), neutral-first palette with occasional vivid accent, and magazine-style editorial layout with dramatic hero visuals.
- **Arc Browser** — Distinctive gradient brand identity with soft, generous rounded shapes and a single functional accent color.

---

## CSS Custom Properties (Full Reference)

```css
:root {
  /* === COLORS === */

  /* Achromatic Zinc Scale (Awesomic Layer) */
  --color-obsidian: #09090b;
  --color-graphite: #18181b;
  --color-slate: #27272a;
  --color-iron: #3f3f46;
  --color-steel: #52525b;
  --color-fog: #71717a;
  --color-ash: #a1a1aa;
  --color-mist: #d4d4d8;
  --color-cloud: #ececee;
  --color-paper: #f4f4f5;
  --color-snow: #ffffff;

  /* Portal Neutrals */
  --color-ink-black: #000000;
  --color-graphite-dark: #3e3e3e;
  --color-smoke: #636363;
  --color-ash-mist: #f7f7f7;

  /* Accents */
  --color-ember: #ff5a00;           /* Awesomic: YC-style accent badge */
  --color-signal-blue: #007aff;     /* Portal: iOS-native functional accent */
  --color-magenta-spark: #fe45e2;   /* Rare decorative punctuation */

  /* Hero Gradient (Portal) */
  --color-dusk-sky: #4a7ff2;
  --color-dusk-violet: #7b7ed8;
  --color-dusk-mauve: #c98ab5;
  --color-dusk-coral: #e8a87c;
  --gradient-dusk: linear-gradient(180deg, #4a7ff2 0%, #7b7ed8 30%, #c98ab5 65%, #e8a87c 100%);

  /* === TYPOGRAPHY — FONT FAMILIES === */
  --font-display-serif: 'Perfectly Nineties Regular', 'Recoleta', 'Playfair Display', serif;
  --font-cosmica: 'Cosmica', 'DM Sans', ui-sans-serif, system-ui, sans-serif;
  --font-inter: 'Inter', 'SF Pro Text', -apple-system, sans-serif;

  /* === TYPOGRAPHY — SCALE === */
  --text-micro: 10px;      --leading-micro: 1.2;       --tracking-micro: -0.2px;
  --text-caption: 12px;    --leading-caption: 1.64;    --tracking-caption: -0.24px;
  --text-body-sm: 14px;    --leading-body-sm: 1.45;    --tracking-body-sm: -0.28px;
  --text-body: 15px;       --leading-body: 1.45;       --tracking-body: -0.32px;
  --text-body-lg: 18px;    --leading-body-lg: 1.45;
  --text-subheading: 20px; --leading-subheading: 1.5;
  --text-heading-sm: 32px; --leading-heading-sm: 1.5;
  --text-heading: 40px;    --leading-heading: 1.28;
  --text-heading-lg: 56px; --leading-heading-lg: 1.28;
  --text-display: 64px;    --leading-display: 1.12;

  /* === TYPOGRAPHY — WEIGHTS === */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* === SPACING === */
  --spacing-unit: 4px;
  --spacing-4: 4px;     --spacing-5: 5px;    --spacing-6: 6px;
  --spacing-8: 8px;     --spacing-10: 10px;  --spacing-12: 12px;
  --spacing-14: 14px;   --spacing-16: 16px;  --spacing-20: 20px;
  --spacing-24: 24px;   --spacing-28: 28px;  --spacing-32: 32px;
  --spacing-36: 36px;   --spacing-40: 40px;  --spacing-45: 45px;
  --spacing-48: 48px;   --spacing-60: 60px;  --spacing-64: 64px;
  --spacing-68: 68px;   --spacing-80: 80px;  --spacing-100: 100px;
  --spacing-120: 120px;

  /* === LAYOUT === */
  --page-max-width: 1200px;
  --section-gap-min: 80px;
  --section-gap-max: 120px;
  --card-padding: 28px;
  --element-gap: 8px;

  /* === BORDER RADIUS === */
  --radius-badge: 12px;
  --radius-input: 14px;
  --radius-button-inline: 14px;
  --radius-nav: 22px;
  --radius-card-portal: 26px;
  --radius-card-awesomic: 36px;
  --radius-icon: 40px;
  --radius-image: 40px;
  --radius-pill: 50px;
  --radius-nav-pill: 10000px;

  /* === SHADOWS & ELEVATION === */
  --shadow-glow-ring: rgb(247, 247, 247) 0px 0px 0px 5px;
  --shadow-card-border: 0 0 0 1px #ececee;
  --shadow-dark-button: inset 0 0.5px 0 0 rgba(255,255,255,0.5), inset 0 9px 14px -5px rgba(117,123,133,0.4), 0 0 0 1.5px rgb(44,46,52), 0 4px 6px 0 rgba(0,0,0,0.14);
  --shadow-filled-pill: inset 0 1px 0 0 #ffffff, 0 0 0 1px rgba(0,0,0,0.15), 0 3px 2px 0 rgba(0,0,0,0.06);
  --shadow-blue-inner: rgb(140, 194, 255) 0px 1px 0px 1px inset;
  --shadow-md: rgba(0, 0, 0, 0.04) 0px 4px 12px 0px;

  /* === SURFACES === */
  --surface-canvas-zinc: #f4f4f5;
  --surface-canvas-soft: #f7f7f7;
  --surface-card: #ffffff;
  --surface-card-subtle: #fafafa;
  --surface-dark: #18181b;
  --surface-deep-dark: #27272a;
  --surface-hero: var(--gradient-dusk);
}
```
