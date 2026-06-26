# Scholaport Documentation Archive Index

This index tracks archived research and historical documents that are preserved for context but are no longer the canonical source of truth.

## Archived Reports (`docs/archive/`)

| File | Description | Status |
|------|-------------|--------|
| `RESEARCH_AUDIT.md` | Historical research summary; some counts are older than current seed files. | Archive — use current validator output as authoritative. |
| `RESEARCH_AUDIT_AGENT2_PHL_UKR_RUS_AUS.md` | Agent 2 research audit for Philippines, Ukraine, Russia, Australia. | Archive |
| `ASIA_SOURCE_AUDIT_REPORT.md` | Asia source audit report including Tamil Nadu and Andhra Pradesh work. | Archive |
| `EUROPE_SOURCE_AUDIT_REPORT_2026-06-22.md` | Europe source audit from June 2026. | Archive |
| `RESEARCH_AGENT5_AMERICAS_REPORT.md` | Agent 5 Americas research report. | Archive |
| `US_STATE_VALIDATION_REPORT.md` | U.S. state validation report. | Archive |
| `US_ONBOARDING_E2E_REPORT.md` | U.S. onboarding end-to-end report. | Archive |
| `SCHOLAPORT_LIVE_REFERENCE_IMPORT_REPORT.md` | Live Supabase import report from June 24, 2026. | Archive |

## Feature Docs (`docs/features/`)

Current implementation docs for the built workflow engines:

| File | Description |
|------|-------------|
| `OCR_TRANSCRIPT_PROCESSING.md` | Transcript upload, OCR provider chain, translation, parsing, review, confirmation. |
| `TRANSLATION_TRANSCRIPT_REVIEW.md` | Translation layer, language detection, academic translation prompts. |
| `CREDIT_MAPPING_ENGINE.md` | Probable credit mapping from confirmed transcript courses to destination requirements. |
| `GAP_ANALYSIS_ENGINE.md` | Graduation gap analysis comparing mapped credit against destination framework requirements. |
| `ACADEMIC_ROADMAP_ENGINE.md` | Academic roadmap generation from saved gap analysis results. |
| `COUNSELOR_PACKET_ENGINE.md` | Counselor-ready packet assembly from the full saved workflow. |
| `MVP_ONBOARDING_SCOPE.md` | Current demo-scoped onboarding behavior and data rules. |
| `US_ACADEMIC_FRAMEWORK_MODEL.md` | U.S. academic framework model notes. |

## Research Prompts (`docs/prompts/`)

Repeatable country-specific research and repair prompts used during the multi-agent data-gathering phase. These are working artifacts, not canonical product docs.

| File | Description |
|------|-------------|
| `CODEX_ONE_COUNTRY_*.md` | Codex-generated country repair prompts (China, Mexico, Pakistan, Philippines, Saudi Arabia, UAE). |
| `KIMI_ONE_COUNTRY_*.md` | Kimi-generated country research prompts (Australia, Canada, Germany, India, UK, USA Georgia). |
| `KIMI_REFERENCE_DATA_*.md` | Reference data research, repair, and semantic repair prompts. |
| `CLAUDE_PROMPT_01_US_FOUNDATION.md` | Claude US foundation prompt. |

## Canonical Documents (Root)

| File | Purpose |
|------|---------|
| `README.md` | Quick-start, setup, and repository overview. |
| `SCHOLAPORT_REFERENCE_FOUNDATION_PROGRESS_REPORT.md` | **The single master progress report** — canonical source of truth for project status, architecture, demo scope, and pitch narrative. |
| `AGENTS.md` | Repository guidance for coding agents. |
| `app_content.md` | Extracted inventory of application text. |
