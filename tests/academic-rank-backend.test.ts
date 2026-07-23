import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const migration = readFileSync(
  "supabase/migrations/202607220002_academic_rank_progress.sql",
  "utf8",
);
const rankApi = readFileSync("src/lib/academic-rank-api.ts", "utf8");
const rankHook = readFileSync("src/hooks/use-academic-rank.ts", "utf8");
const passportApi = readFileSync("src/lib/academic-passport-api.ts", "utf8");
const passportHook = readFileSync("src/hooks/use-academic-passport.ts", "utf8");
const feedback = readFileSync("src/lib/app-feedback.ts", "utf8");

test("Supabase stores flexible card and Pori documents with revision tracking", () => {
  assert.match(migration, /create table if not exists public\.academic_passports/);
  assert.match(migration, /create or replace function public\.set_updated_at/);
  assert.match(migration, /students own academic passport/);
  assert.match(migration, /pori_preferences jsonb not null/);
  assert.match(migration, /card_preferences jsonb not null/);
  assert.match(migration, /revision bigint not null/);
  assert.match(migration, /sync_academic_passport_documents/);
  assert.match(passportApi, /pori_preferences: pori/);
  assert.match(passportApi, /card_preferences: cardPreferences/);
  assert.match(passportHook, /pendingSyncRef/);
  assert.match(passportHook, /queueRemoteSync/);
  assert.match(passportHook, /table: "academic_passports"/);
  assert.match(passportHook, /postgres_changes/);
  assert.match(passportHook, /crypto\.randomUUID\(\)/);
  assert.match(passportApi, /isOptionalPassportSchemaError/);
  assert.match(passportApi, /legacyWrite/);
});

test("rank progress is backend-derived, protected, monotonic, and event-backed", () => {
  assert.match(migration, /create table if not exists public\.academic_rank_progress/);
  assert.match(migration, /create table if not exists public\.academic_rank_events/);
  assert.match(migration, /for select\s+using \(user_id = auth\.uid\(\)\)/);
  assert.doesNotMatch(migration, /academic_rank_progress for (insert|update|all)/);
  assert.match(migration, /greatest\(calculated_level_value, previous_level_value, 1\)/);
  assert.match(migration, /on conflict \(user_id, rank_level\) do nothing/);
});

test("every rank-bearing academic table refreshes backend progress", () => {
  for (const table of [
    "student_profiles",
    "academic_passports",
    "transcripts",
    "transcript_courses",
    "credit_mappings",
    "gap_analyses",
    "gap_requirements",
    "roadmaps",
    "roadmap_items",
    "counselor_packets",
  ]) {
    assert.match(migration, new RegExp(`'${table}'`));
  }
  assert.match(migration, /refresh_academic_rank_from_row/);
  assert.match(migration, /refresh_my_academic_rank/);
});

test("the client reads rank state and subscribes to realtime backend changes", () => {
  assert.match(rankApi, /from\("academic_rank_progress"\)/);
  assert.match(rankApi, /rpc\("refresh_my_academic_rank"\)/);
  assert.match(rankHook, /postgres_changes/);
  assert.match(rankHook, /academic_rank_progress/);
  assert.match(rankHook, /crypto\.randomUUID\(\)/);
  assert.match(rankApi, /isOptionalRankSchemaError/);
});

test("app feedback centralizes strategic sound-aware success and error cues", () => {
  assert.match(feedback, /playAppCue\(cue\)/);
  assert.match(feedback, /playAppCue\("warning"\)/);
  assert.match(feedback, /toast\.success/);
  assert.match(feedback, /toast\.error/);
});
