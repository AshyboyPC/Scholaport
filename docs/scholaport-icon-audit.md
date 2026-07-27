# ScholaPort icon and custom-mark audit

Date: 2026-07-20

## Audit summary

- Forty source files import `lucide-react`; Lucide remains the shared source for ordinary interface actions and status icons.
- Purpose-built SVG is limited to brand/diagram content: the Academic Passport route, ten personal marks, ten large decal packs, JourneyVisuals diagrams, the login provider mark, and existing progress visualizations.
- No third-party reference logo or Apple mark is embedded in the Passport assets or SVG.
- The new ScholaGlyph is an original four-petal geometry built for ScholaPort and used as a configurable mark and density field.

## Accessibility decisions

- Decorative route, film, decal, and unlabelled mark SVGs use `aria-hidden`.
- `PassportEmblem` accepts an explicit label when it needs image semantics; otherwise it is decorative beside visible text.
- Builder controls expose visible text plus `aria-pressed` for selection state.
- The Front / Journey details control uses a labelled group and pressed state.
- Browser audit found zero unnamed buttons and zero unlabeled inputs in the material lab.

## Consistency decisions

- UI actions such as reset, previous/next, safety, and curation continue to use Lucide.
- Custom SVG is not used to re-create icons already supplied by Lucide.
- Passport motif line caps, joins, weight, and rounded geometry use one family language across navigation marks, preview decals, and builder swatches.
- Symbols avoid diplomas, graduation caps, seals, crests, passports, airplanes, maps, and credential badges.

## Follow-up boundary

The login provider artwork and JourneyVisuals diagrams predate Passport V2 and remain intentionally outside the Passport motif system. No unrelated icon substitutions were needed for this pass.
