import { z } from "zod";

export const PoriBaseStyleSchema = z.enum(["classic", "plush"]);
export const PoriExpressionSchema = z.enum([
  "friendly",
  "curious",
  "focused",
  "encouraging",
  "excited",
  "calm",
]);
export const PoriHeadAccessorySchema = z.enum([
  "cloud-cap",
  "academic-headband",
  "route-beanie",
  "explorer-hat",
  "headphones",
  "study-visor",
]);
export const PoriSecondaryAccessorySchema = z.enum([
  "mini-backpack",
  "document-satchel",
  "route-scarf",
  "academic-tablet",
  "small-notebook",
  "counselor-folder",
]);
export const PoriCompanionDetailSchema = z.enum([
  "academic-passport",
  "course-token",
  "route-marker",
  "transcript-page",
  "mapping-ring",
  "cloud-waypoint",
]);
export const PoriBuilderStepSchema = z.enum([
  "base",
  "expression",
  "head",
  "secondary",
  "detail",
  "review",
]);

export type PoriBaseStyle = z.infer<typeof PoriBaseStyleSchema>;
export type PoriExpression = z.infer<typeof PoriExpressionSchema>;
export type PoriHeadAccessory = z.infer<typeof PoriHeadAccessorySchema>;
export type PoriSecondaryAccessory = z.infer<typeof PoriSecondaryAccessorySchema>;
export type PoriCompanionDetail = z.infer<typeof PoriCompanionDetailSchema>;
export type PoriBuilderStep = z.infer<typeof PoriBuilderStepSchema>;
export type PoriAssetCategory = "base" | "expression" | "head" | "secondary" | "detail";

export const PoriLayerTransformSchema = z
  .object({
    x: z.number().min(-12).max(12),
    y: z.number().min(-12).max(12),
    scale: z.number().min(0.72).max(1.28),
    rotation: z.number().min(-12).max(12),
  })
  .strict();

export type PoriLayerTransform = z.infer<typeof PoriLayerTransformSchema>;

export const DEFAULT_PORI_LAYER_TRANSFORM: PoriLayerTransform = {
  x: 0,
  y: 0,
  scale: 1,
  rotation: 0,
};

export const DEFAULT_PORI_LAYER_TRANSFORMS = {
  head: { ...DEFAULT_PORI_LAYER_TRANSFORM },
  secondary: { ...DEFAULT_PORI_LAYER_TRANSFORM },
  detail: { ...DEFAULT_PORI_LAYER_TRANSFORM },
};

export const PoriPreferencesSchema = z
  .object({
    version: z.literal(1),
    baseStyle: PoriBaseStyleSchema,
    expression: PoriExpressionSchema,
    headAccessory: PoriHeadAccessorySchema.nullable(),
    secondaryAccessory: PoriSecondaryAccessorySchema.nullable(),
    companionDetail: PoriCompanionDetailSchema.nullable(),
    completedSteps: z.array(PoriBuilderStepSchema),
    firstIncompleteStep: PoriBuilderStepSchema,
    status: z.enum(["not-started", "in-progress", "complete"]),
    transforms: z
      .object({
        head: PoriLayerTransformSchema,
        secondary: PoriLayerTransformSchema,
        detail: PoriLayerTransformSchema,
      })
      .strict()
      .default(DEFAULT_PORI_LAYER_TRANSFORMS),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type PoriPreferences = z.infer<typeof PoriPreferencesSchema>;
export const PORI_BUILDER_STEPS: readonly PoriBuilderStep[] = [
  "base",
  "expression",
  "head",
  "secondary",
  "detail",
  "review",
];
export const DEFAULT_PORI_PREFERENCES: PoriPreferences = {
  version: 1,
  baseStyle: "classic",
  expression: "friendly",
  headAccessory: null,
  secondaryAccessory: null,
  companionDetail: null,
  completedSteps: [],
  firstIncompleteStep: "base",
  status: "not-started",
  transforms: structuredClone(DEFAULT_PORI_LAYER_TRANSFORMS),
  updatedAt: new Date(0).toISOString(),
};

const handAreaAccessories = new Set<PoriSecondaryAccessory>([
  "academic-tablet",
  "small-notebook",
  "counselor-folder",
]);
export function getPoriCompatibilityIssue(
  preferences: PoriPreferences,
  category: "secondary" | "detail",
  id: string | null,
) {
  if (!id) return null;
  if (
    category === "detail" &&
    preferences.secondaryAccessory &&
    handAreaAccessories.has(preferences.secondaryAccessory)
  )
    return "This accessory already uses Pori's hand area. Choose None here or change the accessory.";
  if (
    category === "secondary" &&
    handAreaAccessories.has(id as PoriSecondaryAccessory) &&
    preferences.companionDetail
  )
    return "Remove the companion detail first because both options use Pori's hand area.";
  return null;
}

export function firstIncompletePoriStep(completedSteps: readonly PoriBuilderStep[]) {
  return PORI_BUILDER_STEPS.find((step) => !completedSteps.includes(step)) ?? "review";
}
export function normalizePoriPreferences(value: unknown): PoriPreferences {
  const parsed = PoriPreferencesSchema.safeParse(value);
  if (parsed.success) return parsed.data;
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return structuredClone(DEFAULT_PORI_PREFERENCES);
  }
  const previous = value as Record<string, unknown>;
  const migrated = PoriPreferencesSchema.safeParse({
    ...previous,
    baseStyle: previous.baseStyle === "cloud" ? "plush" : "classic",
  });
  return migrated.success ? migrated.data : structuredClone(DEFAULT_PORI_PREFERENCES);
}
export function completePoriStep(
  preferences: PoriPreferences,
  step: PoriBuilderStep,
): PoriPreferences {
  const completedSteps = Array.from(new Set([...preferences.completedSteps, step]));
  const complete = PORI_BUILDER_STEPS.every((item) => completedSteps.includes(item));
  return {
    ...preferences,
    completedSteps,
    firstIncompleteStep: firstIncompletePoriStep(completedSteps),
    status: complete ? "complete" : "in-progress",
    updatedAt: new Date().toISOString(),
  };
}

export function rollbackPoriPreferences(
  preferences: PoriPreferences,
  targetStep: PoriBuilderStep,
): PoriPreferences {
  const targetIndex = PORI_BUILDER_STEPS.indexOf(targetStep);
  if (targetIndex < 0 || targetStep === "review") return preferences;

  const next: PoriPreferences = {
    ...preferences,
    completedSteps: PORI_BUILDER_STEPS.slice(0, targetIndex),
    firstIncompleteStep: targetStep,
    status: targetIndex === 0 ? "not-started" : "in-progress",
    transforms: structuredClone(preferences.transforms),
    updatedAt: new Date().toISOString(),
  };

  if (targetIndex <= 0) next.baseStyle = DEFAULT_PORI_PREFERENCES.baseStyle;
  if (targetIndex <= 1) next.expression = DEFAULT_PORI_PREFERENCES.expression;
  if (targetIndex <= 2) {
    next.headAccessory = null;
    next.transforms.head = { ...DEFAULT_PORI_LAYER_TRANSFORM };
  }
  if (targetIndex <= 3) {
    next.secondaryAccessory = null;
    next.transforms.secondary = { ...DEFAULT_PORI_LAYER_TRANSFORM };
  }
  if (targetIndex <= 4) {
    next.companionDetail = null;
    next.transforms.detail = { ...DEFAULT_PORI_LAYER_TRANSFORM };
  }

  return next;
}

export function isPoriComplete(preferences: PoriPreferences) {
  return preferences.status === "complete" && preferences.completedSteps.includes("review");
}
