# Scholaport — Comprehensive Style Reference
> academic infrastructure meets premium consumer software — deep navy authority, warm paper surfaces, emerald teal precision, glassmorphic elevation, and hyper-legible geometric typography.

**Theme:** Light (with dark navy hero section)

---

Scholaport operates in two distinct visual registers that exist on the same page: a **deep navy authority layer** (the hero and dark feature blocks) and a **warm paper editorial layer** (all content sections). These two surface worlds are visually connected by a consistent typographic system (Manrope), a single brand accent (Emerald Teal `#01a995` / `#01c3ad`), and a shared geometry philosophy (rounded corners everywhere, pill shapes for all actions).

Elevation in Scholaport is achieved through **glassmorphism**: frosted backgrounds with saturated blur, hairline semi-transparent white borders, and inset top-edge highlights. Traditional drop shadows are used only as secondary reinforcement, never as the primary depth signal. The interface should feel like frosted glass layered over a deep navy ocean — structured, trustworthy, and calm.

The brand communicates academic seriousness without coldness. It respects the student's intelligence. It does not perform excitement. Every design decision reflects confidence in the product's utility rather than a need to sell.

---

## Tokens — Colors

### Primary Brand Palette

| Name | Value | Token | Role |
|------|-------|-------|------|
| Navy 950 | `#07113f` | `--journey-navy-950` | Footer background, deepest dark surfaces, the brand's absolute floor. |
| Navy 900 | `#0a175a` | `--journey-navy-900` | Hero background, primary filled buttons (dark), main headings in content sections, the brand's structural anchor. |
| Navy 700 | `#263574` | `--journey-navy-700` | Secondary dark headings, elevated navy surfaces. |
| Teal 600 | `#01a995` | `--journey-teal-600` | Primary brand accent — logo color, section label accent, icon fills, checkmark icons, slider accent, focus rings, active step indicators. |
| Teal 500 | `#01c3ad` | `--journey-teal-500` | Interactive primary — `--primary` in the Tailwind theme. Used for primary buttons, interactive states, focus rings. A touch lighter and more vivid than teal-600. |
| Cyan 400 | `#42d8d0` | `--journey-cyan-400` | Used in gradients and hover states where teal needs to lighten. |
| Coral 500 | `#f86746` | `--journey-coral-500` | Accent / Destructive / Warning — used for kicker dots, route markers (end), warning states, and destructive actions. Also `--accent` and `--destructive` in the theme. |
| Coral 100 | `#ffe1d8` | `--journey-coral-100` | Soft coral backgrounds — used on icon container for the third step card. |
| Mint 300 | `#bfebdd` | `--journey-mint-300` | Very soft mint tint — used sparingly for gentle teal-family backgrounds. |
| Yellow 400 | `#f4c85a` | `--journey-yellow-400` | Route node accent — the middle marker on journey maps. Warm gold punctuation. Also `#f6d66f` in the preview map variant. |
| Mint Glow | `#9ff2e6` | (inline) | High-contrast teal text on deep navy backgrounds — kickers and route highlights in the hero. |

### Neutral / Surface Palette

| Name | Value | Token | Role |
|------|-------|-------|------|
| Paper | `#fffdf8` | `--journey-paper` | The warm off-white used for all elevated card surfaces, step cards, and beta note cards. Slightly warm (yellow-tinted) compared to pure white. |
| Canvas | `#f3f6f4` | `--journey-canvas` | The app background (`--background`). A cool, very faintly green-tinted neutral. The ambient color of the product interior. |
| Marketing Canvas | `#f5f6f4` | (inline) | Marketing page background — closely related to the app canvas, but used consistently for all marketing sections outside the hero. |
| Line | `#dde4e5` | `--journey-line` | Structural dividers — horizontal rules between sections, card borders inside the product UI. |
| Border Default | `#cdd3de` | `--border` / `--input` | Standard input borders and card hairlines inside the app. |
| Surface Layer | `#e8efed` | `--surface` | Slightly elevated surface above the canvas — used for secondary containers inside the app. |
| Secondary/Muted | `#e8ebf0` | `--secondary` / `--muted` | Muted backgrounds and secondary containers inside the app. |
| White | `#ffffff` | `--card` / `--popover` | Cards, popovers, modals, inputs — elevated white surfaces. |

### Text Color Palette

| Role | Value | Token | Usage |
|------|-------|-------|-------|
| Foreground (primary) | `#0a175a` | `--foreground` | App heading and label text — deep navy, highly legible. |
| Ink 600 | `#59647a` | `--journey-ink-600` | Body copy in the product — softer than the navy foreground, used for paragraph text. |
| Muted Foreground | `#5a6380` | `--muted-foreground` | Placeholder text, metadata labels. |
| Slate Blue | `#344061` | (inline) | Nav links in the marketing page. |
| Steel Blue | `#526079` | (inline) | Body text in marketing intro sections. |
| Muted Steel | `#596780` | (inline) | Product preview copy. |
| Warm Muted | `#69758d` | (inline) | Step card body text. |
| Ghost | `#75809a` | (inline) | Stage card label text, preview topline. |
| Disabled / Faint | `#9da6b4` | (inline) | Step numbering and ultra-muted metadata. |
| Primary Foreground | `#060f3d` | `--primary-foreground` | Text on top of teal primary buttons. |
| White (on dark) | `#ffffff` | (inline) | Text on navy backgrounds, dark buttons. |
| Alpha White 75% | `rgb(255 255 255 / 75%)` | (inline) | Marketing lede text on the navy hero. |
| Alpha White 72% | `rgb(255 255 255 / 72%)` | (inline) | Beta section body text on dark navy. |
| Alpha White 62% | `rgb(255 255 255 / 62%)` | (inline) | Footer brand description. |
| Alpha White 82% | `rgb(255 255 255 / 82%)` | (inline) | Footer links. |
| Alpha White 48% | `rgb(255 255 255 / 48%)` | (inline) | Footer legal note. |
| Alpha White 46% | `rgb(255 255 255 / 46%)` | (inline) | Hero disclaimer note. |

### Semantic / State Colors

| Role | Light Value | Dark Value | Token |
|------|-------------|------------|-------|
| Primary | `#01c3ad` | `oklch(0.72 0.13 185)` | `--primary` |
| Primary Foreground | `#060f3d` | `oklch(0.18 0.025 250)` | `--primary-foreground` |
| Destructive | `#f86746` | `oklch(0.65 0.2 28)` | `--destructive` |
| Destructive Foreground | `#ffffff` | `oklch(0.97 0.01 80)` | `--destructive-foreground` |
| Success | `#01c3ad` | `oklch(0.72 0.14 160)` | `--success` |
| Success Foreground | `#060f3d` | `oklch(0.18 0.025 250)` | `--success-foreground` |
| Warning | `#f86746` | `oklch(0.78 0.16 75)` | `--warning` |
| Warning Foreground | `#ffffff` | `oklch(0.18 0.025 250)` | `--warning-foreground` |
| Ring / Focus | `#01c3ad` | `oklch(0.72 0.13 185)` | `--ring` |
| Chat User Bubble | `#0a175a` | `oklch(0.72 0.13 185)` | `--chat-user` |
| Chat User Foreground | `#ffffff` | `oklch(0.18 0.025 250)` | `--chat-user-foreground` |

---

## Tokens — Typography

### Font System

Scholaport uses a **dual-font strategy** with a critical fallback system for multilingual support.

**Primary Font:** `Manrope`
- Token: `--font-sans`, `--font-display`
- Stack: `"Manrope", ui-sans-serif, system-ui, sans-serif`
- Role: The single font for the entire product interface — all UI text, headings, body copy, buttons, labels, and navigation. Manrope is a highly legible, geometric variable-weight sans-serif that signals clarity and modernity.

**Fallback Fonts (Language-Specific):**
- Tamil (`[data-language="ta"]`): `"Noto Sans Tamil", "Manrope", sans-serif`
- Telugu (`[data-language="te"]`): `"Noto Sans Telugu", "Manrope", sans-serif`
- Hindi (`[data-language="hi"]`): `"Noto Sans Devanagari", "Manrope", sans-serif`
- Rule: When a script font is active, `letter-spacing: 0 !important` is applied globally — script fonts do not use Western letter-spacing rules.

**Wordmark Font:** `Gumriot`
- Stack: `'Gumriot', var(--font-display)`
- Source: `Gumriot-Smooth.ttf` (custom local asset)
- Role: Used **only** for the oversized footer wordmark. Gumriot is a hand-crafted display typeface that brings a retro, stylized contrast to Manrope's geometric precision. Provides personality and craft at the bottom of the page where it can function as a pure typographic texture element.

### Type Scale — Marketing Layer

| Role | CSS Value | Weight | Line Height | Letter Spacing | Notes |
|------|-----------|--------|-------------|----------------|-------|
| Kicker / Section Label | `0.67rem` (~10.7px) | 900 | uppercase | `0.1em` | Small caps utility; used for "Private beta", section labels |
| Body Sm / Disclaimer | `0.68rem` (~10.9px) | 650 | 1.5 | — | Hero bottom disclaimer note |
| Nav Link / Tag | `0.76–0.78rem` (~12–12.5px) | 750–800 | — | — | Navigation links, footer links |
| Step Number | `0.64rem` (~10.2px) | 900 | — | `0.1em` | Step card numbering labels |
| Body Small | `0.76rem` (~12.2px) | 620–750 | 1.65 | — | Step card body, footnotes |
| Preview Label | `0.56–0.62rem` (~9–9.9px) | 800 | — | — | Inside-card micro labels |
| Body / Lede | `1rem` (~16px) | 560 | 1.65 | — | Marketing lede text on the hero |
| Body Lg | `1.04rem` (~16.6px) | 570 | 1.75 | — | Intro section paragraphs |
| Product Copy | `0.92rem` (~14.7px) | 600 | 1.65 | — | Feature section body |
| Section H3 | `1.3rem` (~20.8px) | 800 | 1.08 | `-0.04em` | Step card headlines |
| Section H2 | `clamp(2.25rem, 4vw, 4rem)` | 800 | 1.02 | `-0.055em` | Content section headings (intro, product, steps, beta) |
| Hero H1 | `clamp(3.1rem, 5.8vw, 5.4rem)` | 800 | 0.98 | `-0.06em` | The hero headline — the most dramatic type moment on the page |
| Footer Wordmark | `clamp(3.75rem, 14vw, 12.5rem)` (desktop) / `clamp(3.8rem, 15.2vw, 6.6rem)` (mobile) | normal | 1 | `0.02em` | Oversized Gumriot footer wordmark |

### Type Scale — App Layer

| Role | Context | Weight | Notes |
|------|---------|--------|-------|
| Micro / Metadata | `0.58–0.68rem` | 800–900 | Country codes, tags, tiny labels |
| Body Copy | `0.72–0.9rem` | 600–700 | Most in-app paragraph text |
| UI Labels | `1rem` | 800 | In-app setting scales, labels |
| App Heading Sm | `1.15rem` | 800 | Table headings, card titles |
| App Heading | `clamp(1.65rem, 3vw, 2.5rem)` | 900 | Pori builder h1, major app headings |

---

## Tokens — Spacing & Shapes

**Base unit:** 4px
**Density:** Compact internally, generous section rhythm.

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 27–28 | 27px–28px | card internal padding |
| 30 | 30px | step icon top margin |
| 36 | 36px | border-radius on major frames |
| 40 | 40px | hero layout gap |
| 48 | 48px | steps heading gap |
| 54 | 54px | steps list top margin, product body gap |
| 64 | 64px | general XL spacing |
| 70–80 | 70–80px | footer grid bottom padding, marketing section gaps |
| 90–100 | 90–112px | hero bottom padding, beta section bottom padding |
| 126–128 | 126–128px | intro and steps vertical padding |
| 136–156 | 136–156px | product section padding, hero top padding |

### Border Radius — Full System

| Element | Value | Context |
|---------|-------|---------|
| Country code badge | 9px | App reference table chip |
| Login language select | 12px | Form field select |
| Badge / Tag pill | 14px | Step icon container |
| App card (--radius-lg) | `1.125rem` (18px) | Base radius in the Tailwind theme (`--radius`) |
| Pori option card | 18px | Pori customiser option cards |
| Pori step bar | 18px | Pori builder step navigator |
| Marketing stage card | 22px | Glassmorphic hero cards (mobile: 17px) |
| Marketing product preview | 28px | Product UI preview card inside the product frame |
| Marketing steps list | 28px | Three-column step card grid border |
| Marketing product frame | 36px | Main product showcase container |
| Beta layout container | 36px | Dark navy + teal split container |
| Marketing step icon | 14px | Step card icon container |
| Stamp badge | 999px | Pill-shaped beta stamp element |
| All action buttons | 999px | Every CTA and nav action — always a full pill |
| Preview "ready" badge | 999px | Status chip inside product preview |

### Shadows — Full Reference

| Name | Value | Usage |
|------|-------|-------|
| Journey Shadow Surface | `0 18px 50px rgba(10, 23, 90, 0.08)` | `--journey-shadow-surface` — standard floating card elevation in the app |
| Journey Shadow Float | `0 18px 55px rgba(10, 23, 90, 0.16)` | `--journey-shadow-float` — elevated elements like modals, dropdowns |
| Shadow Card | `0 2px 8px rgba(10, 23, 90, 0.08)` | `--shadow-card` — subtle card depth in compact contexts |
| Shadow Soft | `0 1px 3px rgba(10, 23, 90, 0.08)` | `--shadow-soft` — the lightest depth hint |
| Nav Shadow | `0 10px 32px rgb(7 17 63 / 10%)` | Marketing floating nav shadow |
| Stage Card Shadow | `0 16px 30px rgb(3 9 35 / 16%)` | Glassmorphic hero stage cards |
| Product Frame Shadow | `0 22px 40px rgb(10 23 90 / 11%)` | Product preview card shadow |
| Pori Option Shadow | `0 10px 26px rgb(10 23 90 / 6%)` | Pori customiser option tiles |
| Dark Button Inset | `inset 0 1px 0 rgb(255 255 255 / 20%)` | Top highlight on dark filled CTAs |
| Light Button Shadow | `0 9px 20px rgb(0 0 0 / 15%), inset 0 1px 0 #fff` | White CTA button depth |
| Reference Table Shadow | `0 18px 46px rgb(10 23 90 / 9%)` | Large in-app table containers |
| Beta Note Shadow | `0 16px 30px rgb(0 0 0 / 13%)` | Glassmorphic note cards in beta section |
| Teal Selection Ring | `0 0 0 2px rgb(1 169 149 / 15%)` | Pori option selected-state focus ring |

---

## Elevation — Glassmorphism System

Scholaport's primary depth signal is **glassmorphism**: semi-transparent white backgrounds with backdrop-filter blur and a hairline semi-transparent white top border. This creates a layered, frosted-glass effect that feels distinctly premium and modern without relying on traditional drop shadows.

### Glass Variants

**Standard Glass Card (Marketing Hero Stage Cards):**
```css
background: rgb(255 253 248 / 86%);
border: 1px solid rgb(255 255 255 / 46%);
border-radius: 22px;
box-shadow: 0 16px 30px rgb(3 9 35 / 16%), inset 0 1px 0 #fff;
backdrop-filter: blur(12px);
```

**Light Glass Card (Nav):**
```css
background: rgb(255 255 255 / 76%);
border: 1px solid rgb(255 255 255 / 42%);
border-radius: 23px;
box-shadow: 0 10px 32px rgb(7 17 63 / 10%), inset 0 1px 0 rgb(255 255 255 / 72%);
backdrop-filter: blur(18px) saturate(1.1);
```

**Strong Glass Card (Product Preview):**
```css
background: rgb(255 255 255 / 91%);
border: 1px solid rgb(255 255 255 / 84%);
border-radius: 28px;
box-shadow: 0 0 0 5px rgb(255 255 255 / 35%), 0 22px 40px rgb(10 23 90 / 11%);
```

**Pori Builder Glass:**
```css
background: rgb(255 255 255 / 58%);
border: 1px solid rgb(255 255 255 / 72%);
border-radius: 18px;
box-shadow: 0 12px 32px rgb(10 23 90 / 7%), inset 0 1px 0 rgb(255 255 255 / 76%);
backdrop-filter: blur(14px) saturate(1.12);
```

**Pori Option Tile:**
```css
background: rgb(255 255 255 / 68%);
border: 1px solid rgb(255 255 255 / 78%);
border-radius: 18px;
box-shadow: 0 10px 26px rgb(10 23 90 / 6%), inset 0 1px 0 rgb(255 255 255 / 78%);
backdrop-filter: blur(10px) saturate(1.08);
```

---

## Components

### Floating Nav Bar
The marketing nav is a floating capsule, never a full-width sticky header. It uses the Light Glass Card treatment (see Glassmorphism above). Structured as a 3-column grid: brand left, links center, action right.

- **Container:** 23px border-radius, 64px min-height, `8px 9px 8px 16px` padding
- **Nav Links:** `0.78rem`, weight 750, color `#344061`, gap 24px, hover opacity 62%
- **CTA Button:** Full pill (`9999px`), `#0a175a` background, white text, `0.78rem` weight 800, `0 15px` padding, inset top highlight
- **Breakpoint ≤680px:** Links collapse (`display: none`), border-radius reduces to 19px, CTA shrinks to `0.69rem` / 40px min-height

### Hero Section
The most dramatic moment of the page. Deep navy `#0a175a` full-width background, minimum 760px height.

- **Layout:** 2-column grid `minmax(0, 0.9fr) minmax(480px, 1.1fr)`, 40px gap
- **Background ring:** Decorative orbital ring `780px × 780px`, `border: 1px solid rgb(255 255 255 / 15%)`, `border-radius: 50%`, positioned `right: -220px; bottom: -360px`
- **Kicker:** `0.67rem`, weight 900, `letter-spacing: 0.1em`, uppercase, color `#9ff2e6`. Preceded by an 8px `#f86746` dot with `box-shadow: 0 0 0 4px rgb(248 103 70 / 18%)`
- **H1:** `clamp(3.1rem, 5.8vw, 5.4rem)`, Manrope weight 800, `line-height: 0.98`, `letter-spacing: -0.06em`, max-width 10ch
- **Lede:** `1rem`, weight 560, `line-height: 1.65`, color `rgb(255 255 255 / 75%)`, max-width 50ch
- **Disclaimer Note:** `0.68rem`, weight 650, `line-height: 1.5`, color `rgb(255 255 255 / 46%)`, margin-top 38px

### Route Ring (Hero Art Orbit)
The elliptical orbit graphic inside the hero art area. A key visual identity element of Scholaport.

```css
border: 2px solid rgb(126 237 222 / 72%);
border-radius: 48% 52% 47% 53%;
transform: rotate(-13deg);
/* Inner dashed ring: */
border: 1px dashed rgb(255 255 255 / 25%);
```
Three marker dots on the orbit (17px circles, 4px white border):
- Start: `#f86746` (coral)
- Middle: `#f6d66f` (gold)
- End: `#9ff2e6` (mint)

### Stage Cards (Hero)
Floating glassmorphic cards that hover over the navy hero art. They preview the product concept ("Starting point" / "Next system").

```css
background: rgb(255 253 248 / 86%);
border: 1px solid rgb(255 255 255 / 46%);
border-radius: 22px;
box-shadow: 0 16px 30px rgb(3 9 35 / 16%), inset 0 1px 0 #fff;
backdrop-filter: blur(12px);
color: #0a175a;
min-width: 160px;
padding: 15px;
```

Card label: `0.58rem`, weight 900, `letter-spacing: 0.09em`, uppercase, color `#75809a`
Card title: `0.82rem`, standard weight
Card subtitle: `0.63rem`, weight 700, color `#68738e`

Center card (`--center`): Contains brand lockup + summary data. Width `min(285px, 52%)`.

### Primary CTA Buttons (Light & Dark)

**Light ("Start your workspace"):**
```css
color: #09143f;
background: #fffdf8;
box-shadow: 0 9px 20px rgb(0 0 0 / 15%), inset 0 1px 0 #fff;
border-radius: 999px;
min-height: 44px;
font-size: 0.78rem;
font-weight: 800;
```

**Dark ("Open Scholaport"):**
```css
color: #fff;
background: #0a175a;
box-shadow: inset 0 1px 0 rgb(255 255 255 / 20%);
border-radius: 999px;
```

**Hover state (both):** `transform: translateY(-2px)` with `transition: transform 180ms ease`
**Reduced motion:** `transition: none`

### Intro Section
Off-white section `#fffdf8`, `126px 0` padding. 2-column grid `0.9fr 0.7fr`, 100px gap.

- Section label: `0.67rem`, weight 900, `letter-spacing: 0.1em`, uppercase, color `#019a8a`
- H2: Manrope `clamp(2.25rem, 4vw, 4rem)`, weight 800, `line-height: 1.02`, `letter-spacing: -0.055em`, color `#0a175a`
- Body: `1.04rem`, weight 570, `line-height: 1.75`, color `#526079`
- Checklist items: `0.82rem`, weight 800, color `#1b2a52`, with teal `#01a995` check icon (18px)

### Product Frame Section
Off-white background `#fffdf8`, `padding: 0 0 136px`.

Main frame:
```css
border: 1px solid #dce4e7;
border-radius: 36px;
background: #effaf8;
/* Decorative circle behind content: */
border: 1px solid rgb(1 169 149 / 16%);
border-radius: 50%;
width: 620px; height: 620px;
```

Eyebrow bar: `1px solid rgb(10 23 90 / 9%)` border-bottom, `0.68rem`, weight 850, color `#4e5d77`.

Product preview glass card:
```css
background: rgb(255 255 255 / 91%);
border: 1px solid rgb(255 255 255 / 84%);
border-radius: 28px;
box-shadow: 0 0 0 5px rgb(255 255 255 / 35%), 0 22px 40px rgb(10 23 90 / 11%);
padding: 20px;
min-height: 332px;
```

Preview map orbit:
```css
border: 2px solid #01c3ad;
border-radius: 49% 51% 52% 48%;
transform: rotate(-6deg);
height: 170px;
```

Preview markers: 34px circles, 4px white border, `box-shadow: 0 4px 10px rgb(10 23 90 / 19%)`
- Start: `#0a175a` background (navy)
- Middle: `#f6d66f` background (gold), `#0a175a` text
- End: `#f86746` background (coral)

"Ready" status pill:
```css
padding: 5px 8px;
border-radius: 999px;
color: #087161;
background: #dcf7f1;
font-size: 0.59rem;
font-weight: 680;
```

### Three-Step Card Grid
Canvas background `#f5f6f4`, `128px 0` padding.

Grid container:
```css
display: grid;
grid-template-columns: repeat(3, minmax(0, 1fr));
gap: 1px;
border: 1px solid #dce1e5;
border-radius: 28px;
background: #dce1e5;
overflow: hidden;
```

Each step card:
```css
background: #fffdf8;
min-height: 290px;
padding: 27px;
```

Step number: `0.64rem`, weight 900, `letter-spacing: 0.1em`, color `#9da6b4`

Step icon container: 44px × 44px, 14px border-radius
- Step 1: `background: #dff6f1` (mint teal tint)
- Step 2: `background: #e6ecff` (soft blue tint)
- Step 3: `background: #ffe5de` (soft coral tint)

Step H3: `1.3rem`, Manrope weight 800, `line-height: 1.08`, `letter-spacing: -0.04em`, color `#0a175a`
Step body: `0.76rem`, weight 620, `line-height: 1.65`, color `#69758d`

### Beta Section
Canvas background `#f5f6f4`, `padding: 0 0 112px`.

Split container:
```css
display: grid;
grid-template-columns: minmax(0, 0.9fr) minmax(410px, 0.8fr);
min-height: 450px;
border-radius: 36px;
overflow: hidden;
color: #fff;
background: #0a175a;
```

Left copy panel: `clamp(32px, 5vw, 68px)` padding
Right art panel: `background: #01a995`, `border-left: 1px solid rgb(255 255 255 / 16%)`

Stamp badge (decorative):
```css
padding: 8px 12px;
border: 1px solid rgb(10 23 90 / 36%);
border-radius: 999px;
background: rgb(255 253 248 / 70%);
color: #0a175a;
font-size: 0.68rem;
font-weight: 950;
letter-spacing: 0.12em;
transform: rotate(8deg);
```

Beta note card (floating glassmorphic card in art panel):
```css
border: 1px solid rgb(255 255 255 / 60%);
border-radius: 18px;
background: rgb(255 253 248 / 83%);
box-shadow: 0 16px 30px rgb(0 0 0 / 13%);
padding: 16px;
font-size: 0.63rem;
line-height: 1.5;
color: #0a175a;
```

### Footer
Deep navy `#07113f` background. 78px top padding (mobile: 53px). Fully `overflow: hidden`.

Grid: `grid-template-columns: 1.1fr 0.7fr 0.8fr`, 38px gap, 70px bottom padding.
- Brand col: Logo + description text (`0.78rem`, weight 560, `line-height: 1.7`, color `rgb(255 255 255 / 62%)`)
- Links col: `0.76rem`, weight 750, color `rgb(255 255 255 / 82%)`, 12px gap
- Notes col: `0.67rem`, weight 650, `line-height: 1.55`, color `rgb(255 255 255 / 48%)`, 8px gap

**Footer Wordmark:**
```css
font-family: 'Gumriot', var(--font-display);
font-size: clamp(3.75rem, 14vw, 12.5rem);
font-weight: normal;
letter-spacing: 0.02em;
line-height: 1;
padding-top: 0.05em;
margin-bottom: -0.28em;  /* Intentionally clips bottom 15% of letters */
text-align: center;
white-space: nowrap;
opacity: 0.95;
/* Texture treatment: */
background-image: url('./assets/images/footer-texture.png');
background-size: cover;
background-position: center;
-webkit-background-clip: text;
background-clip: text;
color: transparent;
/* Mobile override: */
font-size: clamp(3.8rem, 15.2vw, 6.6rem);
```

The wordmark intentionally sinks `0.28em` below the footer container, clipping the bottom 15% of the letters. This is an aesthetic choice — the letterforms fade into the footer's bottom edge rather than sitting cleanly above it.

### Pori Companion System

The "Pori" avatar customizer is the most visually distinct part of the Scholaport app interior. It uses the strongest glassmorphism in the system.

**Step Navigator Bar:**
```css
background: rgb(255 255 255 / 58%);
border: 1px solid rgb(255 255 255 / 72%);
border-radius: 18px;
backdrop-filter: blur(14px) saturate(1.12);
box-shadow: 0 12px 32px rgb(10 23 90 / 7%), inset 0 1px 0 rgb(255 255 255 / 76%);
```

**Option Tiles:**
```css
background: rgb(255 255 255 / 68%);
border: 1px solid rgb(255 255 255 / 78%);
border-radius: 18px;
backdrop-filter: blur(10px) saturate(1.08);
box-shadow: 0 10px 26px rgb(10 23 90 / 6%), inset 0 1px 0 rgb(255 255 255 / 78%);
```
Hover: `border-color: #7ed9ce`
Selected: `border-color: #01a995; box-shadow: 0 0 0 2px rgb(1 169 149 / 15%)`

### Passport Component
Special premium element in the product. Uses CSS custom properties for tilt and lighting effects.

```css
--passport-accent: var(--journey-coral-500);
--passport-tilt-x: 0deg;
--passport-tilt-y: 0deg;
--passport-light-x: 76%;
--passport-light-y: 18%;
/* Default background: */
--passport-background: #0a175a;
--passport-ink: #ffffff;
```

---

## Layout

### Marketing Page

**Page shell:** `width: min(1180px, calc(100% - 40px))`, `margin-inline: auto`
**Mobile shell:** `width: min(100% - 28px, 1180px)`

**Section padding rhythm:**
| Section | Desktop | Mobile |
|---------|---------|--------|
| Hero | `156px 0 90px` | `122px 0 55px` |
| Intro | `126px 0` | `80px 0` |
| Product | `0 0 136px` | `padding-bottom: 80px` |
| Steps | `128px 0` | `80px 0` |
| Beta | `0 0 112px` | `padding-bottom: 74px` |
| Footer | `78px 0 0` | `53px 0 0` |

**Breakpoints:**
- `≤940px`: Two-column hero/product/beta layouts collapse to single column
- `≤680px`: Full mobile treatment — reduced paddings, nav links hidden, single-column footer

### App Interior
- Background: `#f3f6f4` (`--journey-canvas`)
- Cards: `#ffffff` with `--journey-shadow-surface`
- Global text scaling: `font-size: var(--interface-text-size, 100%)` on `.journey-app`
- Pori builder workspace: 2-column `minmax(280px, 0.8fr) minmax(0, 1.2fr)`, sticky preview panel

---

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Marketing Canvas | `#f5f6f4` | Marketing page background — slightly warm neutral |
| 1 | App Canvas | `#f3f6f4` | Product app background — slightly cool neutral |
| 2 | Paper White | `#fffdf8` | Elevated warm-white cards, step cards, beta notes |
| 3 | Snow | `#ffffff` | App cards, inputs, modals |
| 4 | Surface Layer | `#e8efed` | Secondary elevated containers inside the app |
| 5 | Teal Art Block | `#01a995` | Beta section art panel — structural brand color use |
| 6 | Navy Deep | `#0a175a` | Hero, dark CTAs, chat bubbles, passport |
| 7 | Navy Darkest | `#07113f` | Footer — the brand's absolute floor |
| 8 | Glass | `rgb(255 253 248 / 86%)` | Stage cards, note cards — main glassmorphism surface |

---

## Do's and Don'ts

### Do
- Use `#0a175a` for all deep-surface backgrounds (hero, dark buttons, passport) — this is the brand's structural color.
- Use `#01a995` / `#01c3ad` as the accent for all interactive states: focus rings, checkmarks, active selectors, icon fills, slider accents. Never dilute with a second accent.
- Achieve elevation through glassmorphism: semi-transparent backgrounds + backdrop blur + inset top-edge white border. Traditional shadows are secondary support only.
- Always use full pill (`999px` or `9999px`) border-radius on every interactive button and CTA. No exceptions.
- Use Manrope at weight 800–900 for headings and weight 560–650 for body. The wide weight range is the typographic character of the brand.
- Keep the kicker/section-label treatment consistent: `0.67rem`, weight 900, `letter-spacing: 0.1em`, uppercase, teal color.
- Use `#fffdf8` (Warm Paper) for all elevated card surfaces — never pure white `#ffffff` on the marketing layer.
- Use negative `margin-bottom` on the footer wordmark to intentionally clip it. This is by design, not a bug.
- Apply `letter-spacing: 0 !important` when a script font (Tamil, Telugu, Devanagari) is active.

### Don't
- Do not introduce a second chromatic accent color. The brand has one accent family: teal (`#01a995` / `#01c3ad`). Coral (`#f86746`) is a semantic color (destructive/warning) and a small decorative punctuation element, not a secondary brand accent.
- Do not use standard flat drop shadows as the primary elevation signal. Use glassmorphism.
- Do not use border-radius below 9px on any visible container. The brand minimum is 9px (country code chip); the preferred minimum for cards is 18px.
- Do not animate the logo sweep or entrance animations in a way that causes a Flash of Unstyled Content (FOUC). The body starts hidden and the CSS reveals it once fully loaded.
- Do not use the Gumriot font for anything other than the oversized footer wordmark. It is display-only at maximum scale.
- Do not use pure black (`#000000`) as a text color in either layer. The deepest text is `#0a175a`.
- Do not round Gumriot's letter-spacing downward. It requires `+0.02em` to breathe properly at large sizes.
- Do not shrink the footer wordmark below its clamp minimum. On mobile, use `clamp(3.8rem, 15.2vw, 6.6rem)`.

---

## CSS Custom Properties — Full Reference

```css
/* ===========================
   JOURNEY APP THEME (Light)
   =========================== */
:root {
  /* Base radius for the Tailwind radius scale */
  --radius: 1.125rem; /* 18px */

  /* Brand color primitives */
  --journey-navy-950: #07113f;
  --journey-navy-900: #0a175a;
  --journey-navy-700: #263574;
  --journey-teal-600: #01a995;
  --journey-teal-500: #01c3ad;
  --journey-cyan-400: #42d8d0;
  --journey-coral-500: #f86746;
  --journey-coral-100: #ffe1d8;
  --journey-mint-300: #bfebdd;
  --journey-yellow-400: #f4c85a;
  --journey-paper: #fffdf8;
  --journey-canvas: #f3f6f4;
  --journey-ink-600: #59647a;
  --journey-line: #dde4e5;

  /* Semantic shadow tokens */
  --journey-shadow-surface: 0 18px 50px rgba(10, 23, 90, 0.08);
  --journey-shadow-float:   0 18px 55px rgba(10, 23, 90, 0.16);

  /* Tailwind semantic layer */
  --background:              var(--journey-canvas);
  --surface:                 #e8efed;
  --foreground:              #0a175a;
  --card:                    #ffffff;
  --card-foreground:         var(--foreground);
  --popover:                 #ffffff;
  --popover-foreground:      var(--foreground);
  --primary:                 #01c3ad;
  --primary-foreground:      #060f3d;
  --secondary:               #e8ebf0;
  --secondary-foreground:    var(--foreground);
  --muted:                   #e8ebf0;
  --muted-foreground:        #5a6380;
  --accent:                  #f86746;
  --accent-foreground:       #ffffff;
  --destructive:             #f86746;
  --destructive-foreground:  #ffffff;
  --success:                 #01c3ad;
  --success-foreground:      #060f3d;
  --warning:                 #f86746;
  --warning-foreground:      #ffffff;
  --border:                  #cdd3de;
  --input:                   #cdd3de;
  --ring:                    #01c3ad;
  --chat-user:               #0a175a;
  --chat-user-foreground:    #ffffff;

  /* Computed shadow tokens */
  --shadow-card: 0 2px 8px rgba(10, 23, 90, 0.08);
  --shadow-soft: 0 1px 3px rgba(10, 23, 90, 0.08);
}

/* Typography */
@theme inline {
  --font-sans:    "Manrope", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Manrope", ui-sans-serif, system-ui, sans-serif;
}

/* Language overrides */
:root[data-language="ta"] { --font-sans: "Noto Sans Tamil", "Manrope", sans-serif; }
:root[data-language="te"] { --font-sans: "Noto Sans Telugu", "Manrope", sans-serif; }
:root[data-language="hi"] { --font-sans: "Noto Sans Devanagari", "Manrope", sans-serif; }
:root[data-language="ta"] *,
:root[data-language="te"] *,
:root[data-language="hi"] * { letter-spacing: 0 !important; }

/* Custom font */
@font-face {
  font-family: 'Gumriot';
  src: url('./assets/fonts/Gumriot-Smooth.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

/* ===========================
   DARK MODE THEME
   =========================== */
.dark {
  --background:           oklch(0.18 0.025 250);
  --surface:              oklch(0.22 0.03 250);
  --foreground:           oklch(0.97 0.01 80);
  --card:                 oklch(0.22 0.03 250);
  --card-foreground:      var(--foreground);
  --popover:              oklch(0.22 0.03 250);
  --popover-foreground:   var(--foreground);
  --primary:              oklch(0.72 0.13 185);
  --primary-foreground:   oklch(0.18 0.025 250);
  --secondary:            oklch(0.28 0.03 250);
  --secondary-foreground: var(--foreground);
  --muted:                oklch(0.28 0.03 250);
  --muted-foreground:     oklch(0.72 0.02 250);
  --accent:               oklch(0.78 0.16 75);
  --accent-foreground:    oklch(0.18 0.025 250);
  --destructive:          oklch(0.65 0.2 28);
  --destructive-foreground: oklch(0.97 0.01 80);
  --success:              oklch(0.72 0.14 160);
  --success-foreground:   oklch(0.18 0.025 250);
  --warning:              oklch(0.78 0.16 75);
  --warning-foreground:   oklch(0.18 0.025 250);
  --border:               oklch(1 0 0 / 12%);
  --input:                oklch(1 0 0 / 16%);
  --ring:                 oklch(0.72 0.13 185);
  --chat-user:            oklch(0.72 0.13 185);
  --chat-user-foreground: oklch(0.18 0.025 250);
}
```

---

## Similar References & Inspiration

- **Linear** — Same achromatic canvas with precise, sharp UI typography and a single teal/green functional accent.
- **Vercel** — Extreme confidence in white space, dark authority surfaces, and letting typography carry the weight.
- **Stripe** — Trustworthy, structured, and "serious" without being cold. Premium at every detail.
- **Craft CMS** — Warm paper tones paired with a clean geometric sans, giving technical software a humanistic quality.
- **Notion** — An interface that respects the user's intelligence by not performing excitement — just clarity.
