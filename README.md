# Scholaport Web MVP

Scholaport is a student-owned Academic Passport for international high-school transfer students. It helps students and families understand foreign transcripts, probable credit mapping, graduation gaps, academic planning, and counselor-ready preparation.

**Scholaport does not replace the school counselor.** It prepares the student for the counselor meeting with organized, transparent, source-aware information.

## Local setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Set these required browser-safe variables in `.env.local`:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Scholaport intentionally shows a configuration screen when either value is missing. It does not fall back to a demo student.

## Database setup

Apply all migrations, in filename order, to the target Supabase project. See `docs/MIGRATIONS_INDEX.md` for the full migration list and explanations.

The key migrations are:

1. `supabase/migrations/202606190001_scholaport_mvp.sql` — Original MVP schema
2. `supabase/migrations/202606190002_authenticated_foundation.sql` — Auth, ownership, storage
3. `supabase/migrations/202606200001_global_reference_foundation.sql` — Global reference data
4. `supabase/migrations/202606250001_transcript_ocr_translation_review.sql` — OCR + translation layer
5. `supabase/migrations/202606250002_credit_mapping_engine.sql` — Credit mapping engine
6. `supabase/migrations/202606250003_graduation_gap_analysis_engine.sql` — Gap analysis engine
7. `supabase/migrations/202606250004_academic_roadmap_engine.sql` — Roadmap engine
8. `supabase/migrations/202606250005_counselor_packet_engine.sql` — Counselor packet engine
9. `supabase/migrations/202606250006_mvp_onboarding_source_jurisdiction.sql` — Demo onboarding scope

## Reference-data research and import

- Google Sheets-compatible templates: `supabase/seed_templates/`
- Import-ready seed files: `supabase/seeds/`
- Importer: `scripts/import-reference-data.ts`
- Internal coverage view: `/reference-coverage` in development

Validate local seed files without writing to Supabase:

```bash
pnpm seed:reference:check
```

For an admin import, set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in an ignored `.env.seed.local`, then run `pnpm seed:reference`. The service-role key must never be exposed through a `VITE_` variable.

## Current MVP demo scope

**Source:** India only (selectable). Tamil Nadu and Andhra Pradesh are the verified source jurisdictions. CBSE and other Indian boards are hidden from onboarding but remain in the database for future expansion.

**Destination:** United States only (selectable). Georgia and Texas are the verified destination states with sourced graduation frameworks. Other U.S. states appear as planning-only choices with "coverage pending" labels.

Other countries (China, Mexico, Philippines, Pakistan, Canada, UK, Australia, Germany, UAE, etc.) are visible as "Coming Soon" in onboarding but are disabled for selection.

## Real flows implemented

- Supabase email/password registration, login, password reset, session restoration, and sign out
- Route protection and profile-aware onboarding redirects
- Student profile creation and editing with reference-data-backed selections
- Authenticated dashboard/passport reads
- Transcript file upload, private storage, and metadata persistence
- **Server-side OCR** (Google Document AI / Azure Document Intelligence) with language detection and translation
- **Transcript review and confirmation** — candidates are reviewed, edited, and confirmed before becoming usable courses
- **Probable credit mapping** — deterministic taxonomy + structured AI mapping with confidence scores and counselor-review flags
- **Graduation gap analysis** — compares confirmed mappings against destination framework requirements with risk badges
- **Academic roadmap** — generated from saved gap analysis with prioritized actionable items and timeline logic
- **Counselor-ready packet** — assembled from the full saved workflow with printable preview
- Persisted roadmap item completion and manual task creation
- Twin question submission and pending-moderation history
- Advisor conversation sessions and persistent messages
- Guide topics/articles from Supabase
- Internal reference-data coverage dashboard

## What remains future work

- Full RAG advisor over official education sources
- Production PDF generation service (browser print/save-as-PDF is available)
- Complete PathMatch matching algorithm and verified story library
- Twin Connect production moderation and mentor-response operations
- Mobile application
- Broader country/state/framework coverage beyond the demo slice
- Live background queues for OCR and asynchronous processing
- Production deployment and hosting at scale

## Verification

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

## Documentation

- `SCHOLAPORT_REFERENCE_FOUNDATION_PROGRESS_REPORT.md` — Master project report (pitch-ready)
- `docs/ARCHIVE_INDEX.md` — Archived research and historical docs
- `docs/MIGRATIONS_INDEX.md` — Database migration guide
- `docs/features/` — Implementation docs for each workflow engine
- `docs/prompts/` — Country-specific research and repair prompts
- `docs/archive/` — Historical audit reports and import logs

## Security notes

- No service-role key or AI provider key is exposed in frontend code (`VITE_` prefix)
- Row Level Security enforces ownership on every student-data table
- Transcript files are stored in a private Supabase Storage bucket under user-scoped paths
- All outputs remain cautious and counselor-review safe

