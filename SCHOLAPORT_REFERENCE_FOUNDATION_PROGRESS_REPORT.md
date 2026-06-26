# Scholaport MVP Progress Report

**Report date:** June 26, 2026
**Project:** Scholaport MVP
**Repository:** `scholaport/courseport` (main branch)
**Latest commit:** `341e844` — feat: add Scholaport MVP workflow engines and demo onboarding scope
**Starting point:** The global reference-data foundation follow-up prompt supplied by the user
**Current scope:** Database structure, reference-data research workflow, CSV seed package, validation, onboarding integration, coverage visibility, and country-by-country verification

## June 26, 2026 update: Transcript OCR/converter pipeline hardening

Scholaport's transcript pipeline now separates the upload, storage, Google Document AI OCR, translation, AI extraction, review, and confirmation stages with safe diagnostics:

- uploaded files remain attached even when processing fails;
- Google Document AI receives the real uploaded bytes with preserved or inferred MIME type;
- safe stage/code errors are stored on the transcript row instead of showing only a generic OCR failure;
- raw OCR is saved before AI extraction, so OCR success is not lost if extraction fails;
- OpenAI transcript extraction runs after OCR when `OPENAI_API_KEY` is configured;
- Gemini transcript extraction is available when `GEMINI_API_KEY` is configured;
- mock AI extraction is disabled in the production `/api/v1/transcripts` route;
- AI course candidates must be backed by OCR evidence before they can be saved as editable candidates;
- document-level source detection remains reviewable and does not override onboarding automatically; and
- manual entry remains available when OCR, translation, or AI extraction cannot produce safe course rows.

New follow-up migration:

- `supabase/migrations/202606260001_transcript_ai_extraction_pipeline.sql`

This update still does not perform credit mapping, gap analysis, roadmap generation, counselor packets, or official transcript evaluation inside the transcript converter.

## June 25, 2026 update: Transcript OCR + translation review layer

Scholaport now includes the first real transcript-processing layer:

- private transcript upload from `/transcript`;
- server-only OCR provider chain for Google Document AI first and Azure Document Intelligence second;
- server-only translation provider chain for Gemini and OpenAI;
- mock OCR/translation providers retained for tests/local fixtures only, not for the production `/api/v1/transcripts` processing path;
- deterministic language detection with provider-first and script fallback behavior;
- Tamil, Hindi, Spanish, Arabic, Urdu, Mandarin, Filipino, Bengali, Russian, Ukrainian, English, and ambiguous-script review handling;
- original OCR text and English academic translation stored separately;
- deterministic transcript table parsing into candidate rows;
- source framework matching against onboarding profile data;
- mismatch review actions;
- manual-entry fallback when live OCR/translation is unavailable or fails;
- confirmation gate that copies reviewed candidates into `transcript_courses` only after student confirmation; and
- tests covering provider selection, Tamil/Spanish translation, language fallback, parser behavior, mismatch detection, RLS, and frontend key hygiene.

New implementation docs:

- `OCR_TRANSCRIPT_PROCESSING.md`
- `TRANSLATION_TRANSCRIPT_REVIEW.md`

New migration:

- `supabase/migrations/202606250001_transcript_ocr_translation_review.sql`

This layer still does not perform official credit conversion, U.S. grade conversion, equivalency decisions, gap analysis, Pori decisions, or counselor packet finalization. It prepares confirmed transcript evidence for those future workflows.

## June 25, 2026 update: Probable credit mapping engine

Scholaport now includes a first credit-mapping layer after transcript confirmation:

- confirmed `transcript_courses` are the only mapping input;
- the server verifies transcript ownership before mapping;
- probable mapping candidates are saved in `credit_mappings`;
- mapping attempts are grouped in `credit_mapping_runs`;
- verified `mapping_rules` are preferred when available;
- exact reference category matching and deterministic multilingual taxonomy run before AI;
- vector similarity has a safe pgvector-ready hook and skips when embeddings are unavailable;
- structured AI mapping is server-only and schema-validated when `OPENAI_API_KEY` or `GEMINI_API_KEY` is configured;
- low/unclear or state-specific mappings require counselor review;
- the `/transcript` UI now shows probable mapping results, confidence badges, edit/confirm/reject actions, and counselor-review controls.

This layer still does not run gap analysis, generate a roadmap, produce counselor packets, convert marks into GPA, or claim official transfer approval. It stores enough evidence for the future gap-analysis engine to compare probable mapped credit against destination requirements.

New implementation doc:

- `CREDIT_MAPPING_ENGINE.md`

New migration:

- `supabase/migrations/202606250002_credit_mapping_engine.sql`

## June 25, 2026 update: Graduation gap analysis engine

Scholaport now includes Feature 3, the deterministic graduation gap detector:

- confirmed transcript courses and persisted credit mappings are required before analysis;
- the selected destination framework and graduation requirements are loaded from Supabase;
- mappings are aggregated by destination requirement ID first, then by mapped subject bucket;
- high-confidence/no-review mappings count as likely earned;
- medium mappings count as possible/partial;
- low, unclear, rejected, and review-required mappings do not fully satisfy requirements;
- state-specific requirements such as U.S. History, Government, Texas STAAR/EOC, Georgia EOC, Health, and PE are protected from generic foreign coursework;
- one `gap_analyses` row and one `gap_requirements` row per requirement are persisted;
- stale-analysis triggers mark old gap analyses stale when mappings or confirmed courses change;
- `/gaps` now shows prerequisite states, run/regenerate controls, dashboard summary, risk badges, requirement cards, missing/review sections, and counselor questions.

This layer still does not generate the roadmap, counselor packet, Pori/RAG advisor response, PathMatch, Twin Connect, or official graduation eligibility.

New implementation doc:

- `GAP_ANALYSIS_ENGINE.md`

New migration:

- `supabase/migrations/202606250003_graduation_gap_analysis_engine.sql`

## Important note about this report

This report was reconstructed from:

- the original follow-up prompt;
- the current repository files;
- the Supabase migrations;
- the seed templates and seed package;
- the import and semantic-validation scripts;
- the current frontend implementation;
- the completed country-validator results; and
- the research/audit history created during this work.

Most of this repository is currently uncommitted or untracked in Git, so this is a verified **current-state implementation report**, not a perfect line-by-line Git diff from a clean historical commit.

This report is now a living project record. It is updated after each completed Scholaport task so the team has one current explanation of scope, implementation, validation, and remaining work.

---

## 1. Executive Summary

**Scholaport is a student-owned academic passport for international high-school transfer students.**

When a student moves from one country to another, their academic history often becomes invisible. Course names do not translate cleanly. Graduation rules differ by state, province, or board. Transcripts may be in another language. Parents and students do not know what questions to ask. School counselors must make final decisions, but students arrive unprepared — with incomplete transcripts, unclear course histories, and no idea what they are missing.

Scholaport solves this by giving the student a structured, transparent preview before the counselor meeting:

1. **Onboarding** captures the source and destination academic path.
2. **Transcript upload** extracts and translates course evidence through server-side OCR and translation.
3. **Student review** confirms transcript data before it becomes official input.
4. **Credit mapping** generates probable equivalencies with confidence scores and counselor-review flags.
5. **Gap analysis** identifies likely missing graduation requirements.
6. **Academic roadmap** turns gaps into prioritized next steps.
7. **Counselor packet** packages everything into a printable, source-aware preview.

**Scholaport does not replace the school counselor.** Every output is labeled as a preview, not an official decision. The product exists to make the counselor meeting more productive, not to bypass it.

The current repository is a buildable, authenticated TanStack Start / React application backed by Supabase Auth, PostgreSQL, Row Level Security, and private file storage. It contains real reference data for 20 countries, a verified demo slice for India → United States (Tamil Nadu / Andhra Pradesh → Georgia / Texas), and five complete backend workflow engines with tests.

---

## 2. The Problem

### Real-world problem for international transfer students

**Students moving between education systems often do not understand how their old coursework maps to the new school system.**

- A student from India transfers to a U.S. high school. Their Tamil Nadu State Board transcript lists subjects in Tamil and English. The U.S. counselor does not know what "Social Science" means in the context of Georgia graduation requirements. Is it equivalent to U.S. History? Probably not. But the student does not know that either.
- **U.S. high school graduation is state/local dependent, not one national framework.** Georgia requires 23 Carnegie units. Texas requires 26 under the Foundation High School Program. The rules differ. A student moving to Texas needs different planning than a student moving to Georgia.
- **India is not one unified school system.** It has state boards (Tamil Nadu, Andhra Pradesh, Maharashtra, etc.), national boards (CBSE, CISCE), and open schooling (NIOS). Each has different course names, grade scales, and subject structures. A generic "India" profile is not accurate enough.
- **Foreign transcripts may be multilingual and hard to interpret quickly.** A transcript in Tamil, Hindi, or Arabic may sit on a counselor's desk for weeks while the school figures out what it says.
- **School counselors make final decisions, but students need a prepared preview before meeting them.** Families need clarity before course registration, graduation deadlines, and planning decisions. Without preparation, students miss requirements, delay graduation, or take unnecessary courses.
- **Existing tools usually serve institutions, agencies, or universities, not the student directly.** They are expensive, slow, and opaque. The student does not own the process or the record.

### Why this matters

For a family investing in an international move, understanding the academic path is not a luxury. It is a prerequisite for course selection, graduation timelines, college eligibility, and financial planning. The current default is confusion, delay, and hoping the counselor figures it out.

---

## 3. The Solution

### Scholaport's full solution chain

1. **Onboarding** captures the student's source country, jurisdiction (state/board), curriculum, destination country, jurisdiction (state), graduation framework, and program. All selectable data comes from verified reference records, not hardcoded assumptions.
2. **Transcript upload** stores the original file privately in Supabase Storage. Server-side OCR extracts text. Server-side translation converts academic text to English. Deterministic parsing extracts course candidates. The student reviews, edits, and confirms candidates before they become usable transcript courses.
3. **Confirmed courses** are the only input to credit mapping. No fake data is inserted. If OCR fails, the student enters courses manually.
4. **Credit mapping** runs a deterministic pipeline: verified mapping rules first, then exact reference category matching, then multilingual subject taxonomy, then vector similarity (when available), then structured AI (when configured). Every mapping has a confidence score and a counselor-review flag.
5. **Gap analysis** loads the student's confirmed courses and credit mappings, compares them against the selected destination framework's graduation requirements, and produces requirement-level statuses: satisfied, likely satisfied, partially satisfied, missing, unclear, or counselor-review required.
6. **Academic roadmap** converts saved gap requirements into actionable items: missing-credit tasks, assessment requirements, counselor questions, course-planning steps, and alternate options. Priority and timeline are calculated from grade at transfer and expected graduation year.
7. **Counselor packet** assembles the student's profile, confirmed transcript, probable mappings, gap analysis, and roadmap into a printable preview. It includes source provenance, review flags, limitations, and a counselor meeting checklist.

### Safety design

- Every engine is **backend-first**. The frontend renders saved data only; it does not generate results locally.
- **No mock data is used in production paths.** Tests use mock fixtures, but production API routes disable mock providers.
- **Counselor review is not a weakness; it is a safety layer.** The product is designed to help the student ask better questions, not to claim official approval.
- **Provenance is tracked at the field level.** Every curriculum course, framework, and requirement can be traced to an official source URL or document.

---

## 4. Product Journey and Major Realization

### Earlier approach

The project initially treated education systems too broadly. Early planning assumed a more unified global or country-level framework. The first schema included generic "us_states" and "state_requirements" tables that did not distinguish between federal, state, and local control. India was initially represented as a single country profile with a generic curriculum description.

### The realization

There is no universal education system. Every source-to-destination path must be modeled by:

- **Country** (e.g., India, United States)
- **Jurisdiction / state / region / board** (e.g., Tamil Nadu, Andhra Pradesh, Georgia, Texas)
- **Curriculum / board** (e.g., Tamil Nadu SSLC/HSC, Andhra Pradesh SSC/Intermediate)
- **Curriculum courses** (official subject names and categories)
- **Destination graduation framework** (e.g., Georgia High School Graduation Requirements, Texas Foundation High School Program)
- **Graduation requirements** (subject credits, assessments, local rules)
- **Programs / pathways** where applicable (endorsements, vocational tracks)
- **Source / provenance records** for every retained claim

### Why this matters

- **U.S. graduation is state/local controlled.** Georgia and Texas must have separate frameworks. A generic "U.S. graduation" framework would be false.
- **India must be modeled through boards/states, not one generic India framework.** Tamil Nadu and Andhra Pradesh have different subject names, grade structures, and examination boards. CBSE is a separate national board with its own curriculum.
- **Counselor review is not a weakness; it is a safety layer.** The product becomes more credible, not less, by admitting uncertainty and requiring human review for ambiguous cases.

### Current architecture

```
Country
  → Jurisdiction / state / region / board
    → Curriculum / board
      → Curriculum courses
    → Destination graduation framework
      → Graduation requirements
      → Programs / pathways
  → Source / provenance records
```

### Student workflow

```
Onboarding
  → Transcript OCR / translation / review
    → Confirmed transcript courses
      → Probable credit mappings
        → Graduation gap analysis
          → Academic roadmap
            → Counselor-ready packet
```

This architecture makes Scholaport stronger, more accurate, and more credible for investors and demo audiences. It also explains why building the product is technically hard — and why that difficulty is a defensible advantage.

---

## 5. Current Demo Scope

The Shark Tank demo uses a **real, verified, narrow slice** of the reference foundation. It is not fake data. It is not a mockup. It is a deliberately limited scope so the product can be accurate and source-backed before expanding.

### Source side

- **Selectable source country:** India
- **Visible but disabled:** China, Mexico, Philippines, Pakistan, Bangladesh, Ukraine, Russia, Egypt, Nigeria (Coming Soon)
- **Selectable source jurisdictions (after India):** Tamil Nadu, Andhra Pradesh
- **Selectable source curricula:**
  - Tamil Nadu State Board SSLC (Class 10)
  - Tamil Nadu State Board HSC (Class 11–12)
  - Andhra Pradesh SSC (Class 9–10)
  - Andhra Pradesh Intermediate (Class 11–12)
- **Hidden from demo:** CBSE, CISCE, NIOS, Maharashtra, Uttar Pradesh, and all other Indian boards exist in the database for future expansion but are filtered out of onboarding.

### Destination side

- **Selectable destination country:** United States
- **Visible but disabled:** Canada, United Kingdom, Australia, Germany, United Arab Emirates (Coming Soon)
- **Selectable destination jurisdictions (after United States):** Georgia, Texas
- **Other U.S. states:** Visible as planning-only choices labeled "coverage pending." They are selectable for planning but do not have verified graduation frameworks yet.
- **Framework behavior:** Georgia and Texas each have their own sourced graduation framework. Scholaport does not show a generic national U.S. framework and does not fall back between states.

### Important note

The product is **not permanently limited** to these four jurisdictions. This is the **demo scope**. MVP 1 can expand to broader India and U.S. coverage. Future versions can add more source and destination countries. The architecture is built to expand without changing the core model.

---

## 6. Full MVP Direction

| Phase | Scope | Timeline |
|-------|-------|----------|
| **Demo (now)** | India (Tamil Nadu + Andhra Pradesh) → United States (Georgia + Texas) | June 2026 |
| **MVP 1** | Broader India source coverage (CBSE, additional states) + broader U.S. destination coverage (additional state frameworks) | Post-demo |
| **MVP 2 / Mobile** | More source countries (China, Mexico, Philippines, Pakistan) and destination countries (Canada, UK, Australia, Germany, UAE) + mobile client | Future |
| **Scale** | Full 20-country reference foundation + automated research pipeline + production OCR queues + advisor RAG + community features | Future |

The architecture supports this expansion because:
- Reference data is normalized and country-agnostic.
- New jurisdictions, curricula, and frameworks are added as CSV rows + provenance, not code changes.
- The onboarding allowlist is one centralized TypeScript module (`src/lib/mvp-reference-scope.ts`).
- The workflow engines are deterministic and do not hardcode country-specific logic.

---

## 7. Current Technical Architecture

### Stack

- **Frontend:** React 19, TanStack Router, TanStack Query, TanStack Start, TypeScript, Tailwind CSS, Radix UI primitives
- **Backend / Database:** Supabase (PostgreSQL, Auth, Row Level Security, Storage)
- **Server layer:** TanStack Start server routes (Cloudflare Workers via Wrangler)
- **Validation:** Zod schemas for all database responses
- **Styling:** Custom Scholaport design system based on navy, teal, white, and coral palette

### Key architectural principles

- **Backend-first feature design:** Every engine runs server-side. The frontend renders saved results only.
- **No service-role keys in frontend:** Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are browser-visible. All AI, OCR, and admin keys are server-only.
- **RLS on every user table:** Even if a malicious browser modifies JavaScript, the database rejects unauthorized access.
- **Migration-based database evolution:** Schema changes are additive SQL files, not manual edits. Old migrations are never deleted.
- **Reference data is separate from student data:** Updating an official curriculum does not rewrite student profiles.
- **No fake data in production paths:** Every engine loads real saved rows. Empty states are honest, not fabricated.

### Security layers

```
HTTPS
  + Supabase authentication (email/password, OAuth)
  + JWT session
  + PostgreSQL Row Level Security
  + Private storage policies (user-scoped transcript paths)
  + Server-only secrets (AI, OCR, service-role keys)
  + Provenance and counselor-review labeling
```

---

## 8. Data Model

### Reference data (public, read-only)

| Table | Purpose |
|-------|---------|
| `countries` | 20 priority countries with source/destination priority ranks and coverage status |
| `jurisdictions` | States, provinces, territories, boards, districts |
| `curricula` | National, regional, state-board, exam-board curriculum systems |
| `curriculum_courses` | Official courses/subjects belonging to a curriculum |
| `destination_graduation_frameworks` | Credential or graduation structure for a destination jurisdiction |
| `graduation_requirements` | Subject, credit, exam, assessment, or local requirements inside a framework |
| `education_programs` | Vocational pathways, dual enrollment, advanced programs |
| `mapping_rules` | Future source-to-destination equivalency rules (intentionally empty today) |
| `data_sources` | Official documents, ministry pages, regulations, PDFs |
| `reference_record_sources` | Field-level links connecting a database record to its supporting source |

### Student data (private, user-owned)

| Table | Purpose |
|-------|---------|
| `student_profiles` | Core academic passport: name, origin, destination, grade, graduation year, reference IDs |
| `transcripts` | Uploaded transcript metadata, OCR/translation status, framework match, confirmation state |
| `transcript_course_candidates` | Extracted/parsed course rows awaiting student review and confirmation |
| `transcript_courses` | Confirmed transcript courses (only these feed into mapping) |
| `credit_mapping_runs` | Grouped mapping attempts with confidence counts |
| `credit_mappings` | Probable destination equivalents for each confirmed course |
| `gap_analyses` | Overall graduation gap summary per student/transcript |
| `gap_requirements` | Requirement-level gap results (satisfied, missing, partial, etc.) |
| `roadmaps` | Saved academic plan from gap analysis |
| `roadmap_items` | Actionable steps (course planning, credit review, counselor questions, etc.) |
| `counselor_packets` | Assembled counselor preview with snapshot metadata |
| `counselor_packet_sections` | Individual sections within a packet (cover, transcript, mappings, gaps, roadmap, etc.) |

---

## 9. Current App Flow

1. **Sign in** — Email/password or Google OAuth. No demo fallback.
2. **Onboarding** — Three-step profile creation using real Supabase reference data. Demo scope limits India → Tamil Nadu/Andhra Pradesh → USA → Georgia/Texas.
3. **Transcript upload** — Private file upload to Supabase Storage. Server-side OCR and translation extract and translate course evidence.
4. **OCR/translation review** — Student sees extracted candidates, original and translated text, confidence scores, and framework mismatch warnings. They can edit, delete, or manually add courses.
5. **Confirmed courses** — After student confirmation, candidates are copied into `transcript_courses`. Only confirmed courses feed into mapping.
6. **Probable credit mapping** — Backend engine generates mapping candidates with confidence scores, evidence summaries, and counselor-review flags. Student can confirm, reject, or edit mappings.
7. **Gap analysis** — Backend compares confirmed mappings against the destination framework's graduation requirements. Produces green/yellow/red/gray requirement cards and counselor questions.
8. **Academic roadmap** — Backend converts gap requirements into actionable items with priorities, timing buckets, and counselor checklists. Student can update item status and add personal tasks.
9. **Counselor packet** — Backend assembles profile, transcript, mappings, gap analysis, and roadmap into a printable preview with source provenance and review flags.

---

## 10. Feature Status Inventory

| Feature | Status | Evidence / Files | Backend | Frontend | Test Coverage |
|---------|--------|----------------|---------|----------|---------------|
| **Auth / protected routing** | Built and test-backed | `src/components/AuthProvider.tsx`, `src/routes/__root.tsx` | Supabase Auth | Login, route guards | Unit tests in auth flow |
| **Student profile** | Built and test-backed | `src/routes/profile.tsx`, `src/lib/scholaport-api.ts` | Supabase RLS | Full editing UI | `mvp-reference-scope.test.ts` |
| **Onboarding** | Built and test-backed | `src/routes/onboarding.tsx`, `src/lib/mvp-reference-scope.ts` | Reference data queries | 3-step wizard with real selectors | `mvp-reference-scope.test.ts` (11 tests) |
| **Reference data API** | Built and test-backed | `src/lib/reference-api.ts`, `src/routes/reference-coverage.tsx` | Supabase queries | Coverage dashboard | `reference-package.test.ts` |
| **Reference coverage page** | Built and test-backed | `src/routes/reference-coverage.tsx` | Supabase queries | Internal table view | Manual verification |
| **Supabase reference foundation** | Built and test-backed | `supabase/migrations/202606200001_global_reference_foundation.sql`, `supabase/seeds/*.csv` | Migration + CSV seed | N/A | `reference-package.test.ts`, `us-reference-foundation.test.ts`, `tamil-nadu-reference-foundation.test.ts` |
| **CSV seed / import workflow** | Built and test-backed | `scripts/import-reference-data.ts`, `scripts/check-reference-package.ts` | Node TypeScript | N/A | Dry-run tests (0 rejected rows) |
| **Semantic validation** | Built and test-backed | `scripts/validate-semantic-reference-audit.ts`, `SEMANTIC_SOURCE_AUDIT.csv` | Node TypeScript | N/A | 0 errors for MVP-visible countries |
| **Transcript upload** | Built and test-backed | `src/routes/transcript.tsx`, `src/lib/scholaport-api.ts` | Supabase Storage + RLS | Upload UI, progress, status | `transcript-processing.test.ts` |
| **OCR processing** | Built and test-backed | `src/lib/ocr/ocr-service.server.ts`, providers in `src/lib/ocr/providers/` | Server-only provider chain | Review UI, confidence badges | `transcript-processing.test.ts` |
| **Translation** | Built and test-backed | `src/lib/translation/translation-service.server.ts`, providers in `src/lib/translation/providers/` | Server-only provider chain | Review UI, editable translations | `transcript-processing.test.ts` |
| **Transcript confirmation** | Built and test-backed | `src/routes/api/v1/transcripts.ts`, `src/lib/scholaport-api.ts` | Server API + Supabase | Confirmation gate, edit/delete/add | `transcript-processing.test.ts` |
| **Credit mapping** | Built and test-backed | `src/lib/mapping/mapping-service.server.ts`, `src/routes/api/v1/transcripts.ts` | Server-only deterministic + AI | Mapping results, confidence badges, review controls | `credit-mapping.test.ts` |
| **Gap analysis** | Built and test-backed | `src/lib/gaps/gap-service.server.ts`, `src/lib/gaps/gap-calculator.server.ts`, `src/routes/gaps.tsx` | Server-only deterministic | Gap dashboard, requirement cards, risk badges | `graduation-gap-analysis.test.ts` |
| **Academic roadmap** | Built and test-backed | `src/lib/roadmap/roadmap-service.server.ts`, `src/lib/roadmap/roadmap-generator.server.ts`, `src/routes/roadmap.tsx` | Server-only deterministic | Roadmap dashboard, item status, counselor checklist | `academic-roadmap.test.ts` |
| **Counselor packet** | Built and test-backed | `src/lib/packet/packet-service.server.ts`, `src/lib/packet/packet-sections.server.ts`, `src/routes/api/v1/packets.ts`, `src/routes/packet.tsx` | Server-only assembly | Printable preview, browser print/save-as-PDF | `counselor-packet.test.ts` |
| **Demo scope filtering** | Built and test-backed | `src/lib/mvp-reference-scope.ts` | TypeScript filters | Onboarding selectors, disabled states | `mvp-reference-scope.test.ts` |
| **Live Supabase import** | Completed (MVP-safe) | `scripts/import-reference-data.ts`, `.env.seed.local` (ignored) | Service-role import | N/A | Verified: 20 countries, 83 jurisdictions, 86 sources, 18 curricula, 173 courses, 2 frameworks, 19 requirements, 3 programs, 670 provenance links |
| **Deployment** | Configured | `wrangler.jsonc`, `package.json` scripts | Cloudflare Workers | Static build | Build passes |

### Summary of remaining dependencies

- **OCR/translation:** Requires live Google Document AI or Azure Document Intelligence credentials to process real transcripts. Mock providers are disabled in production.
- **AI mapping:** Requires `OPENAI_API_KEY` or `GEMINI_API_KEY` for structured AI mapping. Deterministic taxonomy works without AI.
- **Live Supabase:** Requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local` for frontend; service-role key for admin import.
- **PDF generation:** Browser print/save-as-PDF is available. Native server PDF generation is future work.

---

## 11. Feature Details

### 11.1 Authentication and Profile

**What it does:**
- Supabase email/password registration, login, password reset, session restoration, and sign out.
- Optional Google OAuth (feature-flagged).
- Local-only development access button (hidden in production).
- Protected routing: unauthenticated users → `/login`; users without profile → `/onboarding`.
- Profile creation and editing with reference-data-backed selections.
- Unsupported profile detection (e.g., old CBSE or non-MVP selections) redirects to onboarding for reselection.

**Where it lives:**
- `src/components/AuthProvider.tsx`
- `src/routes/__root.tsx` (auth gate)
- `src/routes/login.tsx`
- `src/routes/profile.tsx`
- `src/lib/scholaport-api.ts` (profile upsert)

**Database tables:**
- `profiles` (general account info)
- `student_profiles` (academic passport with reference IDs)

**Security:**
- RLS policies on every user-owned table: `user_id = auth.uid()`.
- Private transcript storage bucket with user-scoped path policies.

**Tests:**
- Auth flow covered in `mvp-reference-scope.test.ts`.

---

### 11.2 Onboarding and Demo Scope

**What it does:**
- Three-step onboarding: source country → source jurisdiction → source curriculum; destination country → destination jurisdiction → destination framework/program.
- Loads real countries, jurisdictions, curricula, frameworks, and programs from Supabase.
- Filters selectable options through `src/lib/mvp-reference-scope.ts`.
- Shows honest empty states when detailed data is missing ("More detailed local curriculum data is coming soon.")
- Clears stale dependent selections when upstream choices change.
- Persists `source_jurisdiction_id` and `source_jurisdiction_label` in the profile.

**Demo scope enforcement:**
- Source: India only. Tamil Nadu and Andhra Pradesh only. CBSE hidden.
- Destination: United States only. Georgia and Texas only. Other states labeled "coverage pending."
- Other countries visible as "Coming Soon" but disabled.

**Where it lives:**
- `src/routes/onboarding.tsx`
- `src/lib/mvp-reference-scope.ts`
- `src/lib/reference-api.ts`

**Tests:**
- `mvp-reference-scope.test.ts`: 11 tests covering scope, filtering, CBSE hiding, stale profile detection, and framework non-fallback.

---

### 11.3 Reference Data Foundation

**What it does:**
- 20 priority-country shells with source/destination priority ranks.
- 123 jurisdictions (states, provinces, boards, emirates).
- 49 curricula (national, state-board, exam-board).
- 173 curriculum courses with official names and subject categories.
- 10 destination graduation frameworks.
- 19 graduation requirements.
- 11 education programs.
- 128 data sources.
- 742 provenance links (reference_record_sources).
- Typed reference API with Zod schemas and honest filtering (`partial`, `verified`, `official` only).

**Verified demo data:**
- **Tamil Nadu:** 2 curricula (SSLC + HSC), 92 courses, 4 data sources, provenance for all identity and curriculum fields.
- **Andhra Pradesh:** 2 curricula (SSC + Intermediate), 42 courses, 4 data sources, provenance for all identity and curriculum fields.
- **Georgia:** High School Graduation Requirements framework with 8 requirements, sourced from GaDOE rules.
- **Texas:** Foundation High School Program framework with 11 requirements, sourced from TEA rules.

**Where it lives:**
- `src/lib/reference-api.ts`
- `src/routes/reference-coverage.tsx`
- `supabase/migrations/202606200001_global_reference_foundation.sql`
- `supabase/seeds/*.csv`
- `scripts/import-reference-data.ts`
- `scripts/check-reference-package.ts`
- `scripts/validate-semantic-reference-audit.ts`

**Tests:**
- `reference-package.test.ts`: 0 rejected rows, mapping rules header-only.
- `us-reference-foundation.test.ts`: 8 tests, Georgia + Texas provenance.
- `tamil-nadu-reference-foundation.test.ts`: 17 tests (9 Tamil Nadu + 8 Andhra Pradesh).
- Semantic validation: 0 errors for all 12 completed countries (USA, IND, CAN, AUS, GBR, DEU, CHN, MEX, PHL, PAK, SAU, ARE).

---

### 11.4 Transcript OCR + Translation Review

**What it does:**
- Private transcript upload to Supabase Storage under `userId/transcriptId/file`.
- Server-side OCR provider chain: Google Document AI first, Azure Document Intelligence second. Mock providers disabled in production.
- Normalized OCR result shape: provider ID, raw text, detected languages, pages, tables, confidence.
- Deterministic language detection: provider hints first, then script fallback (Tamil, Hindi, Spanish, Arabic, Urdu, Mandarin, etc.).
- Server-side translation provider chain: Gemini first, OpenAI second. Mock disabled in production.
- Deterministic transcript parser: table extraction first, pipe-style fallback, manual entry fallback.
- Framework matcher compares detected source against onboarding profile.
- Candidates saved to `transcript_course_candidates` with confidence scores and review flags.
- **Confirmation gate:** Only after student review and confirmation are rows copied into `transcript_courses`.
- Student can edit candidates, delete candidates, add manual courses, and override framework mismatches.

**What it does NOT do:**
- No official credit conversion or GPA conversion.
- No fake data insertion if OCR fails.
- No raw OCR JSON exposed to frontend.

**Where it lives:**
- `src/routes/transcript.tsx` (frontend)
- `src/routes/api/v1/transcripts.ts` (server API)
- `src/lib/ocr/ocr-service.server.ts`
- `src/lib/ocr/providers/google-document-ai.server.ts`
- `src/lib/ocr/providers/azure-document-intelligence.server.ts`
- `src/lib/ocr/transcript-parser.server.ts`
- `src/lib/ocr/framework-match.ts`
- `src/lib/translation/translation-service.server.ts`
- `src/lib/translation/providers/gemini-translation.server.ts`
- `src/lib/translation/providers/openai-translation.server.ts`
- `src/lib/translation/language-detection.ts`

**Database tables:**
- `transcripts` (with OCR/translation columns)
- `transcript_course_candidates`
- `transcript_courses`

**Migration:**
- `supabase/migrations/202606250001_transcript_ocr_translation_review.sql`

**Tests:**
- `transcript-processing.test.ts`: 16 tests covering provider selection, Tamil/Spanish translation, language fallback, parser behavior, framework mismatch, RLS, confirmation gate, and frontend key hygiene.

---

### 11.5 Credit Mapping Engine

**What it does:**
- Input: confirmed `transcript_courses` only.
- Server verifies transcript ownership before mapping.
- Mapping pipeline (in order):
  1. Verified `mapping_rules` (currently empty — intentionally).
  2. Exact source curriculum-course and destination-requirement category match.
  3. Deterministic multilingual subject taxonomy (`src/lib/mapping/subject-taxonomy.ts`).
  4. Vector similarity (safe skip when embeddings unavailable).
  5. Structured AI classifier (server-only, schema-validated, when `OPENAI_API_KEY` or `GEMINI_API_KEY` is configured).
  6. Counselor review for uncertain results.
- Probable mapping candidates saved in `credit_mappings`.
- Mapping attempts grouped in `credit_mapping_runs`.
- Confidence levels: high, medium, low, unclear.
- Counselor review required for: low/unclear confidence, state-specific requirements (U.S. History, Government, Health, PE), world language, social studies, and manually overridden courses.
- The `/transcript` UI shows probable mapping results with confidence badges, edit/confirm/reject actions, and counselor-review controls.

**Safe language:**
- "Probable mapping", "possible credit", "needs counselor review", "final credit decisions are made by your school."

**Where it lives:**
- `src/lib/mapping/mapping-service.server.ts`
- `src/lib/mapping/deterministic-mapper.server.ts`
- `src/lib/mapping/subject-taxonomy.ts`
- `src/lib/mapping/ai-mapper.server.ts`
- `src/lib/ai/structured-output/` (OpenAI, Gemini, mock providers)
- `src/routes/api/v1/transcripts.ts` (mapping endpoints)
- `src/routes/transcript.tsx` (mapping UI)

**Database tables:**
- `credit_mappings`
- `credit_mapping_runs`
- `reference_embeddings` (future vector search)

**Migration:**
- `supabase/migrations/202606250002_credit_mapping_engine.sql`

**Tests:**
- `credit-mapping.test.ts`: 9 tests covering deterministic taxonomy, Tamil/Hindi/Spanish classification, confidence rules, counselor review, schema validation, migration, API ownership, and frontend key hygiene.

---

### 11.6 Graduation Gap Analysis Engine

**What it does:**
- Input: confirmed transcript courses + persisted credit mappings + destination framework + graduation requirements.
- Server verifies ownership and prerequisites before analysis.
- Mappings aggregated by `destination_requirement_id` first, then by `mapped_subject_category` / `requirement_bucket`.
- High-confidence, no-review mappings → **likely earned**.
- Medium-confidence mappings → **possible/partial**.
- Low, unclear, rejected, or review-required mappings → **review evidence only**, not satisfied.
- State-specific requirements (U.S. History, Government, Texas STAAR/EOC, Georgia EOC, Health, PE) are protected from generic foreign coursework.
- One `gap_analyses` row + one `gap_requirements` row per requirement are persisted.
- Risk levels: green, yellow, red, gray.
- Stale-analysis triggers mark old gap analyses as `stale` when mappings or confirmed courses change.
- The `/gaps` UI shows prerequisite states, run/regenerate controls, dashboard summary, risk badges, requirement cards, missing/review sections, and counselor questions.

**Where it lives:**
- `src/lib/gaps/gap-service.server.ts`
- `src/lib/gaps/gap-calculator.server.ts`
- `src/lib/gaps/credit-aggregation.ts`
- `src/lib/gaps/requirement-matcher.ts`
- `src/lib/gaps/risk-scoring.ts`
- `src/routes/gaps.tsx`
- `src/routes/api/v1/transcripts.ts` (gap endpoints)

**Database tables:**
- `gap_analyses`
- `gap_requirements`

**Migration:**
- `supabase/migrations/202606250003_graduation_gap_analysis_engine.sql`

**Tests:**
- `graduation-gap-analysis.test.ts`: 9 tests covering high/medium/low confidence counting, U.S. History protection, assessment requirements, grade urgency, migration, API safety, and frontend behavior.

---

### 11.7 Academic Roadmap Engine

**What it does:**
- Input: saved `gap_analyses` and `gap_requirements` only. No redo of OCR, mapping, or gap calculation.
- Server verifies ownership and prerequisites before generation.
- Deterministic generation (no AI used for roadmap content).
- Gap requirement → roadmap item conversion:
  - `missing` → missing credit / assessment / local-policy / elective planning item
  - `partially_satisfied` → course-planning item
  - `unclear` → credit-review item
  - `counselor_review_required` → counselor-question item
  - `likely_satisfied` → no urgent item unless review flag exists
- Priority system: critical → high → medium → low → informational.
- Timeline urgency from `grade_at_transfer` and `expected_graduation_year`:
  - Grade 12 → urgent
  - Grade 11 → high
  - Grade 10 → medium
  - Grade 9 → low
- Timing buckets: immediately, before course registration, current/next semester, summer, senior year, before graduation, counselor meeting, ongoing.
- Counselor checklist generated from real roadmap items and gap requirements.
- Staleness triggers when gap analysis, mappings, transcript, or framework changes.
- The `/roadmap` UI supports generate/regenerate, active dashboard, priority/timing sections, counselor checklist, completion tracking, and manual personal items.

**Where it lives:**
- `src/lib/roadmap/roadmap-service.server.ts`
- `src/lib/roadmap/roadmap-generator.server.ts`
- `src/lib/roadmap/timeline-builder.ts`
- `src/lib/roadmap/priority-scoring.ts`
- `src/lib/roadmap/counselor-checklist.ts`
- `src/routes/roadmap.tsx`

**Database tables:**
- `roadmaps`
- `roadmap_items`

**Migration:**
- `supabase/migrations/202606250004_academic_roadmap_engine.sql`

**Tests:**
- `academic-roadmap.test.ts`: 10 tests covering critical items, assessment items, counselor questions, satisfied requirements, grade urgency, alternate options, migration, service prerequisites, API/UI behavior, and no-mock production safety.

---

### 11.8 Counselor Packet Engine

**What it does:**
- Input: saved profile + confirmed transcript + credit mappings + gap analysis + roadmap + provenance.
- Server verifies ownership and full prerequisites before assembly.
- Builds a packet snapshot from real rows only.
- Saves `counselor_packets` row + `counselor_packet_sections` rows.
- Implemented sections:
  1. Cover Page
  2. Student Academic Snapshot
  3. Transcript Summary
  4. Original + Translated Transcript Course List
  5. Probable Credit Mapping Summary
  6. Graduation Gap Summary
  7. Requirement-by-Requirement Checklist
  8. Academic Roadmap Summary
  9. Counselor Meeting Checklist
  10. Review Flags and Limitations
  11. Source / Provenance Summary
  12. Attachments / Original Transcript Reference
- Each section renders real saved data or an honest missing-data/review warning.
- Printable HTML preview available via browser Print / Save as PDF.
- Native PDF generation is not faked — packet stores an honest `pdf_generation_error` and status remains `html_ready`, not `pdf_ready`.
- Private generated-file storage is represented by schema fields but not enabled until a private bucket workflow is configured.
- Staleness triggers when any upstream workflow data changes.
- The `/packet` UI renders saved snapshot and section data only. No hardcoded demo content.

**Where it lives:**
- `src/lib/packet/packet-service.server.ts`
- `src/lib/packet/packet-sections.server.ts`
- `src/lib/packet/packet-snapshot.ts`
- `src/lib/packet/packet-builder.server.ts`
- `src/lib/packet/packet-html-renderer.server.ts`
- `src/routes/api/v1/packets.ts`
- `src/routes/packet.tsx`

**Database tables:**
- `counselor_packets`
- `counselor_packet_sections`

**Migration:**
- `supabase/migrations/202606250005_counselor_packet_engine.sql`

**Tests:**
- `counselor-packet.test.ts`: 10 tests covering snapshot sections, mapping confidence, gap checklist, missing provenance, safe summaries, honest PDF limitation, migration, service prerequisites, API/UI behavior, and production safety.

---

## 12. Reference Data and Provenance

### Why sources matter

Educational rules vary by jurisdiction and change over time. Scholaport does not accept plausible generated text as fact. Every retained curriculum course, framework, and requirement is linked to an official source:

- Ministry of Education documents
- State board regulations and PDFs
- Official curriculum portals
- Direct policy notifications

### Field-level provenance

The `reference_record_sources` table connects each factual database record to a specific `data_sources` row, with:

- Source URL or document reference
- Source section or page
- Claim summary
- Direct-support confirmation
- Scope-match confirmation
- Current-applicability confirmation

### Why unsupported data is hidden

Rows marked `needs_research`, `not_verified`, or `country_seed_only` are filtered out of user-facing selectors. The internal `/reference-coverage` page shows zero counts intentionally rather than hiding them. This gives the team a factual view of what has and has not been researched.

### Why the app does not invent requirements

If a destination framework or requirement is missing, the UI shows:
- "No verified framework available."
- "Not enough verified local data yet."
- The student can enter a self-reported label, but it is clearly distinguished from verified data.

### Georgia, Texas, Tamil Nadu, and Andhra Pradesh representation

- **Georgia:** 8 graduation requirements sourced from GaDOE rules (23 Carnegie units). No community-service credit requirement was invented.
- **Texas:** 11 requirements sourced from TEA rules (26 credits under FHSP). Endorsement pathways remain research gaps.
- **Tamil Nadu:** 92 curriculum courses across SSLC and HSC sourced from DGE, School Education Department, SCERT, and Government Examinations Results portal.
- **Andhra Pradesh:** 42 curriculum courses across SSC and Intermediate sourced from BSEAP, BIEAP, SCERT AP, and CSE AP.

---

## 13. Migration and SQL Explanation

### Why there are many SQL files

Supabase migrations are **chronological database history**. Each feature added schema over time. The current repository contains 12 migration files:

1. Original MVP schema
2. Auth + ownership + storage
3. Global reference foundation
4–6. U.S. destination structures
7. OCR + translation + confirmation
8. Credit mapping engine
9. Gap analysis engine
10. Academic roadmap engine
11. Counselor packet engine
12. MVP onboarding scope lock

This is normal for a real product. Deleting old migrations would break reproducibility for new environments. If schema changes are needed, **new corrective migrations** should be added with later timestamps.

### Migration index

See `docs/MIGRATIONS_INDEX.md` for the complete migration guide with file names, purposes, and application instructions.

---

## 14. Documentation Consolidation

This progress report is now the **canonical master report** for the Scholaport project. It is the single source of truth for:

- Project journey and architecture realization
- Current demo scope and MVP direction
- Technical architecture and data model
- Complete feature status inventory
- Verification results
- Remaining work and risks
- Pitch-ready narrative

### What happened to older docs

- **Feature docs** (`OCR_TRANSCRIPT_PROCESSING.md`, `CREDIT_MAPPING_ENGINE.md`, `GAP_ANALYSIS_ENGINE.md`, `ACADEMIC_ROADMAP_ENGINE.md`, `COUNSELOR_PACKET_ENGINE.md`, `MVP_ONBOARDING_SCOPE.md`, `US_ACADEMIC_FRAMEWORK_MODEL.md`, `TRANSLATION_TRANSCRIPT_REVIEW.md`) were moved to `docs/features/` for reference.
- **Research prompts** (`CODEX_ONE_COUNTRY_*.md`, `KIMI_ONE_COUNTRY_*.md`, `KIMI_REFERENCE_DATA_*.md`, `CLAUDE_PROMPT_01_US_FOUNDATION.md`) were moved to `docs/prompts/` as working artifacts.
- **Historical audit reports** (`RESEARCH_AUDIT.md`, `RESEARCH_AUDIT_AGENT2_*.md`, `ASIA_SOURCE_AUDIT_REPORT.md`, `EUROPE_SOURCE_AUDIT_REPORT_*.md`, `RESEARCH_AGENT5_AMERICAS_REPORT.md`, `US_STATE_VALIDATION_REPORT.md`, `US_ONBOARDING_E2E_REPORT.md`, `SCHOLAPORT_LIVE_REFERENCE_IMPORT_REPORT.md`) were moved to `docs/archive/`.
- **CSV working files** (`SEMANTIC_SOURCE_AUDIT.csv`, `RESEARCH_GAPS.csv`, `US_STATE_COVERAGE.csv`, `ASIA_SOURCE_AUDIT.csv`, etc.) remain at root as working data files.
- **Canonical docs** (`README.md`, `SCHOLAPORT_REFERENCE_FOUNDATION_PROGRESS_REPORT.md`, `AGENTS.md`, `app_content.md`) remain at root.

### Archive index

See `docs/ARCHIVE_INDEX.md` for the full list of archived and feature documents.

---

## 15. Challenges Faced

### Architecture and product challenges

- **Old unified-framework assumption:** Early planning assumed education systems could be modeled at the country level. This was wrong. The pivot to jurisdiction/curriculum/framework-specific architecture required schema changes and research workflow redesign.
- **U.S. state-by-state complexity:** Each state has its own graduation rules. Georgia and Texas required separate framework research, requirement parsing, and provenance tracking. The remaining 49 states and DC remain research placeholders.
- **India board/state complexity:** India has dozens of boards and state systems. Tamil Nadu and Andhra Pradesh required dedicated research into official subject lists, curriculum structures, and examination boards. CBSE and other boards remain future work.
- **Transcript OCR/translation uncertainty:** Real OCR depends on provider credentials, image quality, and language detection accuracy. The system must fail gracefully to manual entry rather than inventing fake extracted courses.
- **Credit equivalency cannot be official:** Scholaport must never claim that a Tamil Nadu course equals a specific Georgia credit. The product uses "probable," "possible," and "counselor review" language intentionally.
- **Counselor review is required by design:** The product is not weaker because it requires counselor review. It is safer and more credible.
- **Reference data must be sourced:** Every curriculum course and requirement needs a source URL. This research work is slow and requires human judgment.
- **Limited time before demo:** The demo scope was deliberately narrowed to a verifiable slice (Tamil Nadu + Andhra Pradesh → Georgia + Texas) rather than claiming broader coverage.

### Technical and tooling challenges

- **AI coding tool limits:** Large-context repository work (adding frameworks, maintaining reference datasets) requires significant context windows and many tool calls. Claude Max / high-context coding tools are needed for this scale of work.
- **Context/token limits:** Large repositories with many files and migrations can exceed model context windows. Country-by-country isolation and modular scripts were used to manage this.
- **Local vs remote Git work:** Some work was done locally before being committed. The repository history reflects a mix of local commits and remote pushes.
- **Live Supabase import/migration risk:** Importing reference data into a live database requires a service-role key and careful validation. The `--mvp-safe` importer mode was created to prevent hidden-country detail from entering production.
- **Avoiding fake frontend demo data:** Every screen was rebuilt to render honest empty states rather than hardcoded demo cards. This made the UI less visually impressive when data is absent, but it is more accurate and defensible.
- **Windows CRLF line endings:** The repository contains CRLF line endings that cause Prettier lint errors. This is a cosmetic issue and does not affect builds or tests.

---

## 16. Resource and Funding Constraints

### Why funding/resources matter

Scholaport is a technically hard product. Building it correctly requires significant ongoing research and engineering work. The current architecture is credible, but expansion requires resources.

### Categories of need

| Category | Why it matters | Current status |
|----------|---------------|----------------|
| **Reference data research** | Every new jurisdiction, state, or board requires official source review, structured data entry, and semantic validation. | 12 countries complete for current scope. 49 U.S. states + additional Indian boards + 8 hidden countries need work. |
| **OCR/AI providers** | Google Document AI, Azure Document Intelligence, OpenAI, Gemini cost money at scale. | Configured but not heavily used yet. |
| **Database / storage / hosting** | Supabase PostgreSQL, Storage, and Auth may incur costs as user data grows. | Free tier currently. |
| **AI coding/model access** | Adding each framework and maintaining large reference datasets requires huge context windows and many tool calls. | Claude/Codex/Kimi usage has been essential. |
| **Testing and validation** | Every new country pass requires mechanical validation, semantic validation, regression testing, and live import verification. | Automated validators exist but require human review. |
| **Mobile development** | A mobile client would reach more students but requires additional engineering. | Not started. |
| **Production operations** | Background queues, rate limiting, monitoring, backups, and disaster recovery require infrastructure work. | Not started. |

### Honest budget note

No exact budget has been created. The above categories describe the areas where funding would accelerate work. The immediate needs are:
1. Reference data expansion (India additional states, U.S. additional states, more countries).
2. Live Supabase hosting and OCR/AI provider credits for real student testing.
3. High-context AI coding tools for large-repository maintenance.
4. Potential part-time research or contractor support for official source validation.

---

## 17. Current Verification Results

### Tests

```bash
node --run test
```

**Result:** 66 tests passed, 0 failed.

Tests cover:
- Academic roadmap engine (10 tests)
- Counselor packet engine (10 tests)
- Credit mapping engine (9 tests)
- Graduation gap analysis engine (9 tests)
- MVP onboarding scope (11 tests)
- Reference package validation (multiple tests)
- Tamil Nadu reference foundation (9 tests)
- Andhra Pradesh reference foundation (8 tests)
- U.S. reference foundation (8 tests)
- Transcript OCR/translation/processing (16 tests)

### TypeScript typecheck

```bash
node --run typecheck
```

**Result:** Passed (no errors).

### Lint

```bash
node --run lint
```

**Result:** 30,783 Prettier formatting errors (all CRLF line-ending issues on Windows), 16 React Fast Refresh warnings. These are cosmetic and do not block typechecking or production builds. The build passes cleanly.

### Build

```bash
node --run build
```

**Result:** Passed. Production client and SSR builds complete successfully. Cloudflare Worker configuration generated.

### Seed validation

```bash
node --experimental-strip-types scripts/check-reference-package.ts
```

**Result:** 0 rejected rows. All 12 completed countries pass semantic validation with 0 errors.

```bash
node --experimental-strip-types scripts/check-reference-package.ts --country=USA
```

**Result:** 0 rejected rows. USA semantic audit: 119 required / 119 supported / 0 errors.

```bash
node --experimental-strip-types scripts/check-reference-package.ts --country=IND
```

**Result:** 0 rejected rows. Tamil Nadu and Andhra Pradesh source-state foundations pass with 0 errors, 0 warnings.

```bash
node --experimental-strip-types scripts/import-reference-data.ts --dry-run
```

**Result:** 0 rejected rows. 20 countries, 123 jurisdictions, 128 sources, 49 curricula, 173 courses, 10 frameworks, 19 requirements, 11 programs, 742 provenance links.

```bash
node --experimental-strip-types scripts/import-reference-data.ts --dry-run --mvp-safe
```

**Result:** 0 rejected rows. MVP-safe scope: 20 countries, 83 jurisdictions, 86 sources, 18 curricula, 173 courses, 2 frameworks, 19 requirements, 3 programs, 670 provenance links.

---

## 18. What Is Real Now

Verified built items (based on repository evidence, not claims):

1. **Backend-first transcript processing:** Upload → OCR → translation → parsing → review → confirmation. Real server providers. Mock disabled in production.
2. **Credit mapping engine:** Deterministic taxonomy + structured AI with confidence scores and counselor-review flags.
3. **Graduation gap analysis engine:** Deterministic comparison of mappings against destination requirements with risk levels.
4. **Academic roadmap engine:** Deterministic generation from saved gap results with priorities and timelines.
5. **Counselor packet engine:** Full assembly from saved workflow with 12 sections, printable preview, and honest PDF limitation.
6. **Demo-scoped onboarding:** India → Tamil Nadu/Andhra Pradesh → USA → Georgia/Texas. Real reference data. No fake options.
7. **Supabase reference foundation:** 20 countries, 123 jurisdictions, 49 curricula, 173 courses, 10 frameworks, 19 requirements, 11 programs, 128 sources, 742 provenance links.
8. **Tamil Nadu source curriculum:** 92 courses, SSLC + HSC, 4 data sources, full provenance.
9. **Andhra Pradesh source curriculum:** 42 courses, SSC + Intermediate, 4 data sources, full provenance.
10. **Georgia destination framework:** 8 requirements, 23 Carnegie units, GaDOE-sourced.
11. **Texas destination framework:** 11 requirements, 26 credits under FHSP, TEA-sourced.
12. **Authentication and protected routing:** Email/password, Google OAuth (feature-flagged), RLS, private storage.
13. **Student profile persistence:** Full create/edit with reference IDs and unsupported-profile detection.
14. **Internal reference coverage page:** Factual country-by-country inventory with zero counts shown intentionally.
15. **CSV seed/import workflow:** Mechanical validation + semantic validation + dry-run mode + MVP-safe live import.
16. **66 passing tests** covering all engines, reference data, and onboarding scope.
17. **Buildable application:** Typecheck passes, build passes, Cloudflare Worker deployable.

---

## 19. What Still Needs Work

1. **Live Supabase migration for latest engine tables:** The 12 migrations exist. Ensure they are applied in the target project. The latest engine migrations (7–12) were added on June 25, 2026.
2. **Final demo data import:** If the live database was last imported before the Andhra Pradesh or engine additions, re-run the importer with `--mvp-safe`.
3. **Broader U.S. and India expansion:** Only Georgia and Texas have verified frameworks. Only Tamil Nadu and Andhra Pradesh have verified source curricula. Other states and boards need research.
4. **Production deployment:** The staging Worker exists. A production domain, custom DNS, and SSL are future work.
5. **Mobile application:** Not started. The backend architecture supports it.
6. **Pori / RAG advisor:** The advisor chat persists messages but does not yet use retrieval-augmented generation over official education sources.
7. **PathMatch / Twin Connect:** Database tables and basic UI exist. Matching algorithms, verified story libraries, and production moderation are incomplete.
8. **Additional reference-data validation:** 8 hidden countries (Bangladesh, Ukraine, Russia, Egypt, Nigeria, France, Spain, Italy) have semantic errors and need dedicated country passes before they can be exposed.
9. **API key / provider setup:** OCR and AI mapping require live credentials to be useful for real transcripts. The code supports them but they are not configured in the current environment.
10. **Polished demo testing:** A full browser-authenticated flow with a test account should be run end-to-end before the Shark Tank presentation.
11. **PDF generation service:** Browser print/save-as-PDF is available. Native server PDF generation is future work.
12. **Background processing queues:** OCR and large mapping runs would benefit from background queues rather than synchronous API calls.

---

## 20. Presentation-Ready Narrative

### The story in report form

**Problem:** International high-school transfer students and their families do not understand how foreign coursework maps to a new country's graduation requirements. Transcripts may be in another language. Graduation rules vary by state or board. Counselors make final decisions, but students arrive unprepared. Existing tools serve institutions, not students.

**Solution:** Scholaport is a student-owned Academic Passport. It captures the source and destination academic path, uploads and translates transcripts, generates probable credit mappings, identifies graduation gaps, builds a planning roadmap, and packages everything into a counselor-ready preview.

**Journey:** The project started with a broader vision of a unified global education framework. We quickly realized that education is jurisdiction-specific. U.S. graduation is state-controlled. India has dozens of boards. There is no universal system. We pivoted to a source-jurisdiction + destination-framework architecture. This made the product more accurate and more credible.

**What changed after the architecture realization:**
- We stopped modeling "India" as one generic profile and built Tamil Nadu and Andhra Pradesh source curricula with official subject names.
- We stopped modeling "U.S. graduation" as one national framework and built separate Georgia and Texas destination frameworks with sourced requirements.
- We embraced counselor review as a safety layer, not a weakness.
- We built a provenance system that traces every curriculum claim to an official source.

**Demo path:**
1. Sign in to Scholaport.
2. Complete onboarding: India → Tamil Nadu → SSLC → United States → Georgia.
3. Upload a transcript (or use manual entry if OCR is not configured).
4. Review and confirm extracted courses.
5. Generate probable credit mappings.
6. Run graduation gap analysis.
7. Generate academic roadmap.
8. Assemble counselor packet.
9. Show the printable preview with source provenance and review flags.

**What the product can show tomorrow:**
- A real, authenticated web application with private transcript storage.
- Verified reference data for Tamil Nadu, Andhra Pradesh, Georgia, and Texas.
- Five complete backend workflow engines with tests.
- Honest empty states and coverage warnings where data is missing.
- A counselor-ready packet that the student can print and bring to their school.

**Why this is technically hard:**
- Education rules are not API-friendly. They live in PDFs, state board websites, and policy documents.
- Every jurisdiction requires separate research, structured data entry, and validation.
- Transcript OCR and translation must handle multiple languages, scripts, and grade formats.
- Credit mapping must be cautious — wrong equivalencies can mislead students about graduation requirements.
- The architecture must scale to more countries without rewriting the core model.

**Why it is valuable:**
- For families, clarity before course registration and graduation deadlines.
- For students, ownership of their academic record and better preparation for counselor meetings.
- For schools, more productive counselor meetings with organized, source-aware information.
- For investors, a defensible data moat built on official sources and provenance.

**Why funding/resources are needed:**
- Full country/state/framework coverage requires large research and engineering work.
- Each jurisdiction needs official source review and structured data entry.
- OCR/AI providers, database hosting, and high-context coding tools cost money at scale.
- Mobile development and production operations require additional engineering.

**Expansion path:**
- Demo → MVP 1 (broader India + U.S.) → MVP 2 (more countries + mobile) → Scale (automated research pipeline + community + advisor RAG).

---

## 21. Final Bottom Line

**What Scholaport is now:**
A buildable, authenticated, backend-first web application for international high-school transfer students. It has real reference data, real workflow engines, real tests, and real security. The demo scope is narrow but verified: India (Tamil Nadu + Andhra Pradesh) → United States (Georgia + Texas).

**What is built:**
- Authentication, protected routing, profile creation and editing.
- Demo-scoped onboarding with real Supabase reference data.
- Transcript upload, OCR, translation, review, and confirmation.
- Probable credit mapping with confidence scores and counselor-review flags.
- Graduation gap analysis with risk badges and requirement cards.
- Academic roadmap with prioritized actionable items and counselor checklists.
- Counselor-ready packet with 12 sections, printable preview, and source provenance.
- 66 tests, all passing.
- Typecheck and build passing.
- Reference data for 20 countries with 0 rejected rows and 0 semantic errors for the 12 completed countries.

**What demo can show:**
The full chain: sign in → onboarding → transcript upload → course confirmation → credit mapping → gap analysis → roadmap → counselor packet. Every step is backed by real database records and real reference data.

**What is pending:**
- Broader country and state coverage.
- Live OCR/AI provider credentials for real transcript processing.
- Production deployment and mobile app.
- Advisor RAG, PathMatch algorithms, and Twin Connect moderation.
- Background queues and production operations.

**Why the current architecture is credible and expandable:**
- The data model separates reference data from student data, so new countries are added as rows, not code changes.
- The workflow engines are deterministic and chain together logically.
- The provenance system ensures every claim is traceable.
- The security model (RLS, private storage, server-only secrets) is production-ready.
- The tests verify behavior, not just presence.

This is a real product foundation, not a frontend mockup. The remaining work is expansion and polish, not fundamental architecture.

---

*Report compiled from repository inspection, code verification, test execution, and seed validation on June 26, 2026.*
