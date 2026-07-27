import { z } from "zod";
import {
  AcademicPassportPreferencesSchema,
  normalizeAcademicPassportPreferences,
  type AcademicPassportPreferences,
} from "@/lib/academic-passport";
import { supabase } from "@/lib/supabase";

type SupabaseApiError = {
  code?: string;
  message?: string;
};

const OPTIONAL_SCHEMA_ERROR_CODES = new Set(["42P01", "42703", "PGRST204", "PGRST205"]);

function isOptionalPassportSchemaError(error: SupabaseApiError | null) {
  if (!error) return false;
  return (
    OPTIONAL_SCHEMA_ERROR_CODES.has(error.code ?? "") ||
    /academic_passports|pori_preferences|card_preferences|revision/i.test(error.message ?? "")
  );
}

const AcademicPassportRowSchema = z.object({
  preferences: z.unknown(),
  updated_at: z.string(),
  revision: z.coerce.number().int().nonnegative().default(0),
});

export type RemoteAcademicPassport = {
  preferences: AcademicPassportPreferences;
  updatedAt: string;
  revision: number;
};

export async function getAcademicPassportFromSupabase(
  userId: string,
): Promise<RemoteAcademicPassport | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("academic_passports")
    .select("preferences,updated_at,revision")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    if (isOptionalPassportSchemaError(error)) return null;
    throw error;
  }
  if (!data) return null;
  const row = AcademicPassportRowSchema.parse(data);
  const preferences = normalizeAcademicPassportPreferences(row.preferences);
  return {
    preferences: AcademicPassportPreferencesSchema.parse({
      ...preferences,
      updatedAt: preferences.updatedAt ?? row.updated_at,
    }),
    updatedAt: row.updated_at,
    revision: row.revision,
  };
}

export async function saveAcademicPassportToSupabase(
  userId: string,
  preferences: AcademicPassportPreferences,
) {
  const safe = AcademicPassportPreferencesSchema.parse(
    normalizeAcademicPassportPreferences(preferences),
  );
  if (!supabase) return safe;
  const { pori, ...cardPreferences } = safe;
  const baseRecord = {
    user_id: userId,
    preferences: safe,
    asset_id: safe.template,
    completion_state: safe.completionState,
    last_completed_step: safe.lastCompletedStep,
    completed_at: safe.completionState === "saved" ? safe.savedAt : null,
  };
  const currentWrite = await supabase.from("academic_passports").upsert(
    {
      ...baseRecord,
      pori_preferences: pori,
      card_preferences: cardPreferences,
    },
    { onConflict: "user_id" },
  );
  if (currentWrite.error && isOptionalPassportSchemaError(currentWrite.error)) {
    const legacyWrite = await supabase
      .from("academic_passports")
      .upsert(baseRecord, { onConflict: "user_id" });
    if (legacyWrite.error && !isOptionalPassportSchemaError(legacyWrite.error)) {
      throw legacyWrite.error;
    }
  } else if (currentWrite.error) {
    throw currentWrite.error;
  }
  return safe;
}

export async function resetAcademicPassportInSupabase(userId: string) {
  if (!supabase) return;
  const { error } = await supabase.from("academic_passports").delete().eq("user_id", userId);
  if (error && !isOptionalPassportSchemaError(error)) throw error;
}

export async function uploadAcademicPassportPhoto(userId: string, file: Blob) {
  if (!supabase) throw new Error("Photo storage is unavailable in this environment.");
  const path = `${userId}/passport-avatar.webp`;
  const { error } = await supabase.storage.from("passport-media").upload(path, file, {
    contentType: "image/webp",
    cacheControl: "3600",
    upsert: true,
  });
  if (error) throw error;
  return path;
}

export async function getAcademicPassportPhotoUrl(path: string | null | undefined) {
  if (!supabase || !path) return null;
  const { data, error } = await supabase.storage
    .from("passport-media")
    .createSignedUrl(path, 60 * 60);
  if (error) throw error;
  return data.signedUrl;
}

export async function removeAcademicPassportPhoto(path: string | null | undefined) {
  if (!supabase || !path) return;
  const { error } = await supabase.storage.from("passport-media").remove([path]);
  if (error) throw error;
}
