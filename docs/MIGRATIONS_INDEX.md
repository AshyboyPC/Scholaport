# Scholaport Database Migrations Index

Migrations are chronological, additive SQL files that evolve the Supabase schema. They should be applied in filename order. **Do not delete old migrations.** If schema changes are needed, add new corrective migrations instead.

## Migration Execution Order

| # | File | Purpose | Status |
|---|------|---------|--------|
| 1 | `202606190001_scholaport_mvp.sql` | Original MVP relational schema: profiles, student profiles, transcripts, transcript courses, credit mappings, US state requirements, gap analyses, roadmaps, PathMatch, Twin Connect, guide, advisor chat, counselor packets. Creates RLS policies, private transcript bucket, and seeds Georgia legacy rows. | Applied |
| 2 | `202606190002_authenticated_foundation.sql` | Authenticated frontend adaptation: onboarding fields, transcript file metadata, explicit `user_id` ownership, `gap_requirements`, `roadmap_items`, `pathmatch_matches`, Twin Connect extensions, `twin_responses`, guide topics/articles, tighter RLS, `updated_at` triggers, private storage policies. | Applied |
| 3 | `202606200001_global_reference_foundation.sql` | Global reference-data schema: 10 reference tables (countries, jurisdictions, curricula, curriculum_courses, destination_graduation_frameworks, graduation_requirements, education_programs, mapping_rules, data_sources, reference_record_sources). Adds public-read RLS, indexes, triggers, and seeds 20 priority-country shells. | Applied |
| 4 | `202606240001_us_destination_academic_foundation.sql` | U.S. destination academic foundation: adds federal district jurisdiction, transfer framework applicability, and U.S.-specific reference structures. | Applied |
| 5 | `202606240002_us_federal_district_jurisdiction.sql` | U.S. federal district jurisdiction adjustments. | Applied |
| 6 | `202606240003_us_transfer_framework_applicability.sql` | U.S. transfer framework applicability rules. | Applied |
| 7 | `202606250001_transcript_ocr_translation_review.sql` | **Transcript OCR + translation + confirmation layer.** Adds OCR/translation columns to `transcripts`, candidate review table (`transcript_course_candidates`), confirmation workflow, framework match detection, and source-selection fields. | Applied |
| 8 | `202606250002_credit_mapping_engine.sql` | **Credit mapping engine.** Extends `credit_mappings` with candidate/review fields, adds `credit_mapping_runs` for grouping attempts, adds `reference_embeddings` for future vector search, and establishes confidence/status/method constraints. | Applied |
| 9 | `202606250003_graduation_gap_analysis_engine.sql` | **Graduation gap analysis engine.** Non-destructive extension of gap tables: adds destination framework links, credit aggregation, risk levels, requirement statuses, assessment gap handling, counselor questions, stale-analysis triggers, and display-order indexes. | Applied |
| 10 | `202606250004_academic_roadmap_engine.sql` | **Academic roadmap engine.** Extends `roadmaps` and `roadmap_items` with transcript/framework links, status/type/risk/urgency fields, item counts, summaries, counselor questions, warnings, stale handling, and deterministic action-type constraints. | Applied |
| 11 | `202606250005_counselor_packet_engine.sql` | **Counselor packet engine.** Extends `counselor_packets` with mapping/gap/roadmap links, snapshot JSON, sections metadata, file generation fields, stale triggers. Adds `counselor_packet_sections` with owner-scoped RLS. | Applied |
| 12 | `202606250006_mvp_onboarding_source_jurisdiction.sql` | **MVP onboarding scope.** Adds source jurisdiction and curriculum selection triggers, stale-selection clearing, and profile-level jurisdiction label fields to support demo-scoped filtering. | Applied |

## Why There Are Many SQL Files

Each migration represents a real schema evolution step:

- **Migration 1–3** built the foundational student-data and reference-data layers.
- **Migration 4–6** added U.S.-specific destination structures.
- **Migration 7–11** added the five core workflow engines (OCR/translation, credit mapping, gap analysis, roadmap, counselor packet) in the order they depend on each other.
- **Migration 12** locked the demo onboarding scope.

This is normal for a real product. Deleting old migrations would break reproducibility for new environments. New schema changes should always be added as new migration files with later timestamps.

## Applying Migrations

Apply all migrations in filename order to the target Supabase project:

1. Open the Supabase SQL Editor.
2. Run each migration file in order.
3. Verify table creation with `\dt` or the Table Editor.
4. Run `scripts/verify-live-onboarding-data.ts` after import to confirm reference data is readable.

## Live Database Caveat

The migrations exist in the repository and have been run against the live Supabase project during setup. However, the **latest researched CSV package** may contain more rows than the live database if the CSV has been updated since the last import. Always run the importer dry-run before live import to validate the package.
