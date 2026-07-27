import { z } from "zod";
import {
  DEFAULT_PORI_PREFERENCES,
  PoriPreferencesSchema,
  normalizePoriPreferences,
} from "./pori-preferences.ts";

export const ACADEMIC_PASSPORT_DISCLAIMER =
  "Your Academic Passport is a personal planning view created from your ScholaPort selections. It is not an official academic record, travel document, admission ticket, or school-issued credential.";

export const AcademicPassportTemplateSchema = z.literal("academic-passport");
export const AcademicPassportBaseColorSchema = z.enum([
  "passage-teal",
  "archive-navy",
  "signal-coral",
  "verification-mint",
  "horizon-cyan",
  "sunlit-cream",
]);
export const AcademicPassportAccentSchema = z.enum(["navy", "teal", "coral", "ivory"]);
export const AcademicPassportShapeSchema = z.enum(["rounded", "soft-square", "ticket"]);
export const AcademicPassportCutoutSchema = z.enum(["none", "side-notch", "corner-cut"]);
export const AcademicPassportMarkSchema = z.enum([
  "monogram",
  "graduation",
  "book",
  "route",
  "custom",
]);
export const AcademicPassportCompletionSchema = z.enum([
  "not-started",
  "in-progress",
  "requires-attention",
  "saved",
]);

export const AcademicPassportIdentitySchema = z
  .object({
    mode: z.enum(["pori", "photo"]),
    photoPath: z.string().max(300).nullable(),
    photoCrop: z
      .object({
        zoom: z.number().min(1).max(3),
        x: z.number().min(0).max(100),
        y: z.number().min(0).max(100),
      })
      .strict(),
  })
  .strict();

export const AcademicPassportPreferencesSchema = z
  .object({
    version: z.literal(7),
    template: AcademicPassportTemplateSchema,
    baseColor: AcademicPassportBaseColorSchema,
    accent: AcademicPassportAccentSchema,
    shape: AcademicPassportShapeSchema,
    cutout: AcademicPassportCutoutSchema,
    mark: AcademicPassportMarkSchema,
    customMark: z.string().max(12),
    title: z.string().max(46),
    motto: z.string().max(90),
    view: z.enum(["front", "details"]),
    completionState: AcademicPassportCompletionSchema,
    lastCompletedStep: z.number().int().min(0).max(4),
    identity: AcademicPassportIdentitySchema,
    pori: PoriPreferencesSchema,
    updatedAt: z.string().datetime().nullable(),
    savedAt: z.string().datetime().nullable(),
  })
  .strict();

export type AcademicPassportPreferences = z.infer<typeof AcademicPassportPreferencesSchema>;
export type AcademicPassportBaseColor = z.infer<typeof AcademicPassportBaseColorSchema>;
export type AcademicPassportAccent = z.infer<typeof AcademicPassportAccentSchema>;
export type AcademicPassportShape = z.infer<typeof AcademicPassportShapeSchema>;
export type AcademicPassportCutout = z.infer<typeof AcademicPassportCutoutSchema>;
export type AcademicPassportMark = z.infer<typeof AcademicPassportMarkSchema>;
export type AcademicPassportCompletion = z.infer<typeof AcademicPassportCompletionSchema>;

export const DEFAULT_ACADEMIC_PASSPORT_PREFERENCES: AcademicPassportPreferences = {
  version: 7,
  template: "academic-passport",
  baseColor: "passage-teal",
  accent: "navy",
  shape: "rounded",
  cutout: "none",
  mark: "monogram",
  customMark: "",
  title: "Academic Passport",
  motto: "One plan. Every next step.",
  view: "front",
  completionState: "not-started",
  lastCompletedStep: 0,
  identity: {
    mode: "pori",
    photoPath: null,
    photoCrop: { zoom: 1, x: 50, y: 50 },
  },
  pori: structuredClone(DEFAULT_PORI_PREFERENCES),
  updatedAt: null,
  savedAt: null,
};

export const ACADEMIC_PASSPORT_STORAGE_PREFIX = "scholaport:academic-passport:v7";
export const LEGACY_ACADEMIC_PASSPORT_STORAGE_PREFIX = "scholaport:academic-passport:v6";
export const EARLY_ACADEMIC_PASSPORT_STORAGE_PREFIX = "scholaport:academic-passport:v5";
export const ACADEMIC_PASSPORT_EVENT = "scholaport:academic-passport-updated";

const OLDER_STORAGE_PREFIXES = [
  "scholaport:academic-passport:v4",
  "scholaport:academic-passport:v3",
  "scholaport:academic-passport:v2",
  "scholaport:academic-passport:v1",
] as const;

export type PassportStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function academicPassportStorageKey(userId: string) {
  return `${ACADEMIC_PASSPORT_STORAGE_PREFIX}:${userId}`;
}

export function sanitizeAcademicPassportText(value: unknown, maxLength: number, fallback = "") {
  if (typeof value !== "string") return fallback;
  const cleaned = value
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f-\u009f\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, " ")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return Array.from(cleaned).slice(0, maxLength).join("") || fallback;
}

export function sanitizeAcademicPassportMark(value: unknown) {
  return sanitizeAcademicPassportText(value, 4).slice(0, 12);
}

function readEnum<T extends string>(value: unknown, values: readonly T[], fallback: T): T {
  return typeof value === "string" && values.includes(value as T) ? (value as T) : fallback;
}

function migrateLegacyPreferences(value: Record<string, unknown>): AcademicPassportPreferences {
  const legacyColor = typeof value.baseColor === "string" ? value.baseColor : value.color;
  const baseColor = readEnum(
    legacyColor === "midnight-ivory" ||
      legacyColor === "midnight-teal" ||
      legacyColor === "midnight-cream-cyan" ||
      legacyColor === "graphite-cyan" ||
      legacyColor === "graphite-ivory-cyan" ||
      legacyColor === "terminal-cyan"
      ? "archive-navy"
      : legacyColor === "signal-coral"
        ? "signal-coral"
        : legacyColor,
    AcademicPassportBaseColorSchema.options,
    "passage-teal",
  );
  const wasSaved = value.completionState === "saved";
  return {
    ...structuredClone(DEFAULT_ACADEMIC_PASSPORT_PREFERENCES),
    baseColor,
    title: sanitizeAcademicPassportText(value.title, 46, "Academic Passport"),
    motto: sanitizeAcademicPassportText(value.motto, 90, "One plan. Every next step."),
    view: value.view === "details" ? "details" : "front",
    completionState: wasSaved ? "saved" : "requires-attention",
    lastCompletedStep: wasSaved ? 4 : 0,
    updatedAt:
      typeof value.updatedAt === "string"
        ? value.updatedAt
        : typeof value.savedAt === "string"
          ? value.savedAt
          : null,
    savedAt: wasSaved && typeof value.savedAt === "string" ? value.savedAt : null,
  };
}

/** Parses the single-template V7 preferences and safely migrates all earlier records. */
export function normalizeAcademicPassportPreferences(value: unknown): AcademicPassportPreferences {
  const candidate =
    value && typeof value === "object" && !Array.isArray(value) && "pori" in value
      ? { ...value, pori: normalizePoriPreferences(value.pori) }
      : value;
  const parsed = AcademicPassportPreferencesSchema.safeParse(candidate);
  if (parsed.success) {
    return {
      ...parsed.data,
      customMark: sanitizeAcademicPassportMark(parsed.data.customMark),
      title: sanitizeAcademicPassportText(parsed.data.title, 46, "Academic Passport"),
      motto: sanitizeAcademicPassportText(parsed.data.motto, 90, "One plan. Every next step."),
    };
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return structuredClone(DEFAULT_ACADEMIC_PASSPORT_PREFERENCES);
  }
  return migrateLegacyPreferences(value as Record<string, unknown>);
}

export function isAcademicPassportComplete(value: AcademicPassportPreferences) {
  return (
    value.template === "academic-passport" &&
    value.completionState === "saved" &&
    value.lastCompletedStep === 4 &&
    (value.mark !== "custom" || Boolean(value.customMark))
  );
}

export function loadAcademicPassportPreferences(
  userId: string | null | undefined,
  storage?: PassportStorage,
): AcademicPassportPreferences {
  if (!userId || !storage) return structuredClone(DEFAULT_ACADEMIC_PASSPORT_PREFERENCES);
  try {
    const current = storage.getItem(academicPassportStorageKey(userId));
    if (current) return normalizeAcademicPassportPreferences(JSON.parse(current) as unknown);

    for (const prefix of [
      LEGACY_ACADEMIC_PASSPORT_STORAGE_PREFIX,
      EARLY_ACADEMIC_PASSPORT_STORAGE_PREFIX,
      ...OLDER_STORAGE_PREFIXES,
    ]) {
      const legacy = storage.getItem(`${prefix}:${userId}`);
      if (!legacy) continue;
      const migrated = normalizeAcademicPassportPreferences(JSON.parse(legacy) as unknown);
      storage.setItem(academicPassportStorageKey(userId), JSON.stringify(migrated));
      return migrated;
    }
    return structuredClone(DEFAULT_ACADEMIC_PASSPORT_PREFERENCES);
  } catch {
    return structuredClone(DEFAULT_ACADEMIC_PASSPORT_PREFERENCES);
  }
}

export function saveAcademicPassportPreferences(
  userId: string,
  preferences: AcademicPassportPreferences,
  storage: PassportStorage,
) {
  const safe = AcademicPassportPreferencesSchema.parse(
    normalizeAcademicPassportPreferences(preferences),
  );
  storage.setItem(academicPassportStorageKey(userId), JSON.stringify(safe));
  return safe;
}

export function resetAcademicPassportPreferences(userId: string, storage: PassportStorage) {
  for (const prefix of [
    ACADEMIC_PASSPORT_STORAGE_PREFIX,
    LEGACY_ACADEMIC_PASSPORT_STORAGE_PREFIX,
    EARLY_ACADEMIC_PASSPORT_STORAGE_PREFIX,
    ...OLDER_STORAGE_PREFIXES,
  ]) {
    storage.removeItem(`${prefix}:${userId}`);
  }
  return structuredClone(DEFAULT_ACADEMIC_PASSPORT_PREFERENCES);
}
