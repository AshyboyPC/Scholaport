import { z } from "zod";
import type { AcademicRankInput } from "@/lib/academic-ranks";
import { supabase } from "@/lib/supabase";

type SupabaseApiError = {
  code?: string;
  message?: string;
};

const OPTIONAL_RANK_ERROR_CODES = new Set([
  "42P01",
  "42703",
  "42883",
  "PGRST202",
  "PGRST204",
  "PGRST205",
]);

function isOptionalRankSchemaError(error: SupabaseApiError | null) {
  if (!error) return false;
  return (
    OPTIONAL_RANK_ERROR_CODES.has(error.code ?? "") ||
    /academic_rank_progress|refresh_my_academic_rank/i.test(error.message ?? "")
  );
}

export const AcademicRankIdSchema = z.enum([
  "wayfinder",
  "passport-holder",
  "record-keeper",
  "credit-mapper",
  "gap-navigator",
  "route-builder",
  "passage-ready",
]);

export const AcademicRankMetricsSchema = z.object({
  profileReady: z.boolean(),
  passportComplete: z.boolean(),
  poriComplete: z.boolean(),
  transcriptConfirmed: z.boolean(),
  courseCount: z.number().int().nonnegative(),
  reviewedCourseCount: z.number().int().nonnegative(),
  mappedCourseCount: z.number().int().nonnegative(),
  resolvedMappingCount: z.number().int().nonnegative(),
  mappedCredits: z.number().nonnegative(),
  gapAnalysisReady: z.boolean(),
  gapRequirementCount: z.number().int().nonnegative(),
  plannedGapRequirementCount: z.number().int().nonnegative(),
  roadmapReady: z.boolean(),
  completedRoadmapItems: z.number().int().nonnegative(),
  completedHighPriorityRoadmapItems: z.number().int().nonnegative(),
  totalRoadmapItems: z.number().int().nonnegative(),
  packetReady: z.boolean(),
});

export const AcademicRankRecordSchema = z.object({
  user_id: z.string().uuid(),
  current_rank_id: AcademicRankIdSchema,
  current_level: z.number().int().min(1).max(7),
  calculated_level: z.number().int().min(1).max(7),
  next_rank_id: AcademicRankIdSchema.nullable(),
  earned_rank_ids: z.array(AcademicRankIdSchema),
  metrics: z.record(z.string(), z.unknown()),
  requirements: z.record(z.string(), z.unknown()),
  last_promoted_at: z.string().nullable(),
  calculated_at: z.string(),
  updated_at: z.string(),
});

export type AcademicRankRecord = z.infer<typeof AcademicRankRecordSchema>;

export function parseAcademicRankMetrics(
  metrics: Record<string, unknown> | null | undefined,
): AcademicRankInput | null {
  const parsed = AcademicRankMetricsSchema.safeParse(metrics);
  return parsed.success ? parsed.data : null;
}

async function selectAcademicRank(userId: string) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("academic_rank_progress")
    .select(
      "user_id,current_rank_id,current_level,calculated_level,next_rank_id,earned_rank_ids,metrics,requirements,last_promoted_at,calculated_at,updated_at",
    )
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    if (isOptionalRankSchemaError(error)) return null;
    throw error;
  }
  return data ? AcademicRankRecordSchema.parse(data) : null;
}

export async function getAcademicRankFromSupabase(
  userId: string,
): Promise<AcademicRankRecord | null> {
  const current = await selectAcademicRank(userId);
  return current ?? refreshAcademicRankInSupabase(userId);
}

export async function refreshAcademicRankInSupabase(
  userId: string,
): Promise<AcademicRankRecord | null> {
  if (!supabase) return null;
  const { error } = await supabase.rpc("refresh_my_academic_rank");
  if (error) {
    if (isOptionalRankSchemaError(error)) return null;
    throw error;
  }
  return selectAcademicRank(userId);
}
