import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import {
  ACADEMIC_PASSPORT_STORAGE_PREFIX,
  DEFAULT_ACADEMIC_PASSPORT_PREFERENCES,
  LEGACY_ACADEMIC_PASSPORT_STORAGE_PREFIX,
  AcademicPassportBaseColorSchema,
  AcademicPassportPreferencesSchema,
  academicPassportStorageKey,
  isAcademicPassportComplete,
  loadAcademicPassportPreferences,
  normalizeAcademicPassportPreferences,
  resetAcademicPassportPreferences,
  sanitizeAcademicPassportMark,
  sanitizeAcademicPassportText,
  saveAcademicPassportPreferences,
  type AcademicPassportPreferences,
} from "../src/lib/academic-passport.ts";
import {
  DEFAULT_PORI_LAYER_TRANSFORM,
  DEFAULT_PORI_PREFERENCES,
  PoriBaseStyleSchema,
  rollbackPoriPreferences,
} from "../src/lib/pori-preferences.ts";

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  };
}

const completePreferences: AcademicPassportPreferences = {
  ...DEFAULT_ACADEMIC_PASSPORT_PREFERENCES,
  baseColor: "archive-navy",
  accent: "teal",
  shape: "soft-square",
  cutout: "corner-cut",
  mark: "book",
  title: "My Academic Passage",
  motto: "One plan. Every next step.",
  completionState: "saved",
  lastCompletedStep: 4,
  updatedAt: "2026-07-21T18:00:00.000Z",
  savedAt: "2026-07-21T18:00:00.000Z",
};

test("Academic Passport V7 starts with one customizable template and Pori identity", () => {
  assert.deepEqual(
    normalizeAcademicPassportPreferences(undefined),
    DEFAULT_ACADEMIC_PASSPORT_PREFERENCES,
  );
  assert.equal(DEFAULT_ACADEMIC_PASSPORT_PREFERENCES.version, 7);
  assert.equal(DEFAULT_ACADEMIC_PASSPORT_PREFERENCES.template, "academic-passport");
  assert.equal(DEFAULT_ACADEMIC_PASSPORT_PREFERENCES.lastCompletedStep, 0);
  assert.equal(DEFAULT_ACADEMIC_PASSPORT_PREFERENCES.identity.mode, "pori");
  assert.equal(DEFAULT_ACADEMIC_PASSPORT_PREFERENCES.pori.baseStyle, "classic");
  assert.equal(isAcademicPassportComplete(DEFAULT_ACADEMIC_PASSPORT_PREFERENCES), false);
  assert.equal(
    AcademicPassportPreferencesSchema.safeParse(DEFAULT_ACADEMIC_PASSPORT_PREFERENCES).success,
    true,
  );
  assert.deepEqual(AcademicPassportBaseColorSchema.options, [
    "passage-teal",
    "archive-navy",
    "signal-coral",
    "verification-mint",
    "horizon-cyan",
    "sunlit-cream",
  ]);
});

test("completion requires saving the single template and a valid personal mark", () => {
  assert.equal(isAcademicPassportComplete(completePreferences), true);
  assert.equal(
    isAcademicPassportComplete({ ...completePreferences, mark: "custom", customMark: "" }),
    false,
  );
  assert.equal(
    isAcademicPassportComplete({ ...completePreferences, completionState: "in-progress" }),
    false,
  );
});

test("legacy asset-backed preferences migrate into the clean template", () => {
  const migrated = normalizeAcademicPassportPreferences({
    version: 5,
    format: "pass-card",
    color: "signal-coral",
    assetId: "pass-vertical-coral-checkpoint",
    title: "My old route",
    motto: "Keep going",
    completionState: "saved",
    savedAt: "2026-07-21T18:00:00.000Z",
  });
  assert.equal(migrated.version, 7);
  assert.equal(migrated.template, "academic-passport");
  assert.equal(migrated.baseColor, "signal-coral");
  assert.equal(migrated.title, "My old route");
  assert.equal(migrated.completionState, "saved");
  assert.equal(migrated.lastCompletedStep, 4);
});

test("V7 preferences persist per user and reset removes legacy versions", () => {
  const storage = memoryStorage();
  saveAcademicPassportPreferences("student-a", completePreferences, storage);
  assert.deepEqual(loadAcademicPassportPreferences("student-a", storage), completePreferences);
  assert.match(
    academicPassportStorageKey("student-a"),
    new RegExp(ACADEMIC_PASSPORT_STORAGE_PREFIX),
  );
  storage.setItem(`${LEGACY_ACADEMIC_PASSPORT_STORAGE_PREFIX}:student-a`, "{}");
  resetAcademicPassportPreferences("student-a", storage);
  assert.equal(storage.getItem(`${ACADEMIC_PASSPORT_STORAGE_PREFIX}:student-a`), null);
  assert.equal(storage.getItem(`${LEGACY_ACADEMIC_PASSPORT_STORAGE_PREFIX}:student-a`), null);
});

test("personal text and custom marks strip unsafe control markup", () => {
  assert.equal(
    sanitizeAcademicPassportText("  <Hello>\u202e   world  ", 20, "Fallback"),
    "Hello world",
  );
  assert.equal(sanitizeAcademicPassportMark(" <MR> "), "MR");
});

test("onboarding requires a saved Passport and uses the simple customizer", () => {
  const onboarding = readFileSync("src/routes/onboarding.tsx", "utf8");
  assert.match(onboarding, /AcademicPassportBuilder/);
  assert.match(onboarding, /isAcademicPassportComplete/);
  assert.match(onboarding, /Choose your Passport identity, color, shape, and personal mark/);
  assert.doesNotMatch(onboarding, /FlowRibbon|skew-x/);
});

test("the builder exposes one template without asset or frame selection", () => {
  const component = readFileSync("src/components/passport/AcademicPassport.tsx", "utf8");
  assert.match(component, /One template, made personal/);
  assert.match(component, /Card color/);
  assert.match(component, /Accent color/);
  assert.match(component, /Shape/);
  assert.match(component, /Cutout/);
  assert.match(component, /Custom emoji or initials/);
  assert.doesNotMatch(
    component,
    /ProductionPicture|AssetThumbnail|pattern pack|Choose a Passport format/,
  );
});

test("Passport photos use a real modal crop result instead of position sliders", () => {
  const editor = readFileSync("src/components/passport/PassportIdentityEditor.tsx", "utf8");
  assert.match(editor, /react-easy-crop/);
  assert.match(editor, /<Dialog open=/);
  assert.match(editor, /cropShape="round"/);
  assert.match(editor, /onCropComplete=/);
  assert.match(editor, /drawImage\(image, crop\.x, crop\.y, crop\.width, crop\.height/);
  assert.match(editor, /uploadAcademicPassportPhoto\(userId, blob\)/);
  assert.doesNotMatch(editor, /Horizontal position|Vertical position/);
});

test("language and text-size preferences apply at the document root", () => {
  const preferences = readFileSync("src/hooks/use-interface-preferences.ts", "utf8");
  const settings = readFileSync("src/routes/settings.tsx", "utf8");
  const root = readFileSync("src/routes/__root.tsx", "utf8");
  const styles = readFileSync("src/styles.css", "utf8");
  assert.match(preferences, /language: "en" \| "ta" \| "te" \| "hi"/);
  assert.match(preferences, /--interface-text-size/);
  assert.match(preferences, /root\.lang = preferences\.language/);
  assert.match(settings, /min="0\.9"/);
  assert.match(settings, /max="1\.3"/);
  assert.match(settings, /onInput=/);
  assert.match(root, /noto-sans-tamil/);
  assert.match(root, /noto-sans-telugu/);
  assert.match(root, /noto-sans-devanagari/);
  assert.match(styles, /font-size: var\(--interface-text-size, 100%\)/);
});

test("obsolete generated Passport packs and material lab are removed", () => {
  for (const path of [
    "src/assets/passport-production-v4",
    "src/assets/passport-formats",
    "src/assets/passport-holographic",
    "src/lib/passport-production-assets.ts",
    "src/passport-holographic.css",
    "passport-lab.html",
  ]) {
    assert.equal(existsSync(path), false, path);
  }
});

test("decorative diagonal stage treatments are absent from product screens", () => {
  const journey = readFileSync("src/components/journey/JourneyVisuals.tsx", "utf8");
  const routes = ["src/routes/__root.tsx", "src/routes/index.tsx", "src/routes/login.tsx"]
    .map((path) => readFileSync(path, "utf8"))
    .join("\n");
  assert.doesNotMatch(journey, /journey-stage__contours/);
  assert.doesNotMatch(routes, /skew-x/);
});

test("Passport customization remains editable Supabase state protected by RLS", () => {
  const migration = readFileSync("supabase/migrations/202607210001_academic_passports.sql", "utf8");
  const api = readFileSync("src/lib/academic-passport-api.ts", "utf8");
  const hook = readFileSync("src/hooks/use-academic-passport.ts", "utf8");
  assert.match(migration, /enable row level security/);
  assert.match(migration, /user_id = auth\.uid\(\)/);
  assert.match(api, /asset_id: safe\.template/);
  assert.match(api, /upsert/);
  assert.match(hook, /saveAcademicPassportToSupabase/);
  assert.match(migration, /passport-media/);
  assert.match(migration, /public = false/);
});

test("Pori customization has a staged builder, typed registry, and responsive contexts", () => {
  const preferences = readFileSync("src/lib/pori-preferences.ts", "utf8");
  const registry = readFileSync("src/lib/pori.ts", "utf8");
  const builder = readFileSync("src/components/pori/PoriBuilder.tsx", "utf8");
  const avatar = readFileSync("src/components/pori/PoriAvatar.tsx", "utf8");
  assert.match(preferences, /PoriPreferencesSchema/);
  assert.match(preferences, /base.*expression.*head.*secondary.*detail.*review/s);
  assert.match(registry, /desktopAssetPath/);
  assert.match(registry, /PORI_BODY_ASSETS/);
  assert.match(registry, /PORI_BAKED_HEAD_ASSETS/);
  assert.match(registry, /import\.meta\.glob\("\/src\/assets\/pori\/baked\/head/);
  assert.match(registry, /poriBodyAsset/);
  assert.match(registry, /rejectedCandidates/);
  assert.match(builder, /firstIncompleteStep/);
  assert.match(builder, /getPoriCompatibilityIssue/);
  assert.match(builder, /Fine-tune the fit/);
  assert.match(builder, /Left \/ right/);
  assert.match(builder, /Up \/ down/);
  assert.match(builder, /Reset fit/);
  assert.match(builder, /setStepIndex\(Math\.min\(stepIndex \+ 1/);
  assert.doesNotMatch(builder, /setStepIndex\(\(value\) => Math\.min\(value \+ 1/);
  assert.match(avatar, /advisor.*passport.*mobile/s);
  assert.match(avatar, /preferences\.transforms/);
  assert.match(avatar, /poriBodyAsset\(preferences\.baseStyle, preferences\.expression\)/);
  assert.match(avatar, /poriBakedHeadAsset/);
  assert.doesNotMatch(avatar, /poriAsset\("expression"/);
  assert.doesNotMatch(avatar, /poriAsset\("head"/);
  assert.deepEqual(PoriBaseStyleSchema.options, ["classic", "plush"]);
});

test("all 72 head-accessory selections resolve to fixed full-body Pori frames", () => {
  const styles = ["classic", "plush"];
  const expressions = ["friendly", "curious", "focused", "encouraging", "excited", "calm"];
  const accessories = [
    "cloud-cap",
    "academic-headband",
    "route-beanie",
    "explorer-hat",
    "headphones",
    "study-visor",
  ];
  let count = 0;
  for (const style of styles) {
    for (const expression of expressions) {
      const directory = `src/assets/pori/baked/head/${style}/${expression}`;
      assert.deepEqual(
        readdirSync(directory).sort(),
        accessories.map((accessory) => `${accessory}.png`).sort(),
      );
      for (const accessory of accessories) {
        const image = readFileSync(`${directory}/${accessory}.png`);
        assert.equal(image.subarray(1, 4).toString(), "PNG");
        assert.equal(image.readUInt32BE(16), 781);
        assert.equal(image.readUInt32BE(20), 900);
        count += 1;
      }
    }
  }
  assert.equal(count, 72);
});

test("every full-body Pori expression uses the same canonical image frame", () => {
  for (const style of PoriBaseStyleSchema.options) {
    for (const expression of ["friendly", "curious", "focused", "encouraging", "excited", "calm"]) {
      const image = readFileSync(`src/assets/pori/full/${style}/${expression}.png`);
      assert.equal(image.subarray(1, 4).toString(), "PNG");
      assert.equal(image.readUInt32BE(16), 781, `${style}/${expression} width`);
      assert.equal(image.readUInt32BE(20), 900, `${style}/${expression} height`);
    }
  }
});

test("legacy Pori preferences receive safe transform defaults", () => {
  const normalized = normalizeAcademicPassportPreferences({
    ...DEFAULT_ACADEMIC_PASSPORT_PREFERENCES,
    pori: {
      version: 1,
      baseStyle: "classic",
      expression: "friendly",
      headAccessory: "explorer-hat",
      secondaryAccessory: "small-notebook",
      companionDetail: null,
      completedSteps: ["base", "expression", "head", "secondary"],
      firstIncompleteStep: "detail",
      status: "in-progress",
      updatedAt: "2026-07-22T18:00:00.000Z",
    },
  });
  assert.deepEqual(normalized.pori.transforms.head, { x: 0, y: 0, scale: 1, rotation: 0 });
  assert.deepEqual(normalized.pori.transforms.secondary, {
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
  });
});

test("legacy four-style Pori records migrate without losing customization", () => {
  const migrated = normalizeAcademicPassportPreferences({
    ...DEFAULT_ACADEMIC_PASSPORT_PREFERENCES,
    pori: {
      ...DEFAULT_ACADEMIC_PASSPORT_PREFERENCES.pori,
      baseStyle: "cloud",
      expression: "excited",
      headAccessory: "route-beanie",
    },
  });
  assert.equal(migrated.pori.baseStyle, "plush");
  assert.equal(migrated.pori.expression, "excited");
  assert.equal(migrated.pori.headAccessory, "route-beanie");
});

test("moving backward through Pori setup clears that step and every later choice", () => {
  const customized = {
    ...DEFAULT_PORI_PREFERENCES,
    baseStyle: "plush" as const,
    expression: "curious" as const,
    headAccessory: "explorer-hat" as const,
    secondaryAccessory: "mini-backpack" as const,
    companionDetail: "route-marker" as const,
    completedSteps: ["base", "expression", "head", "secondary", "detail"] as const,
    firstIncompleteStep: "review" as const,
    status: "in-progress" as const,
    transforms: {
      head: { x: 2, y: -3, scale: 1.1, rotation: 2 },
      secondary: { x: 1, y: 2, scale: 0.95, rotation: -2 },
      detail: { x: -1, y: 1, scale: 1.05, rotation: 1 },
    },
  };

  const expression = rollbackPoriPreferences(customized, "expression");
  assert.equal(expression.baseStyle, "plush");
  assert.equal(expression.expression, "friendly");
  assert.equal(expression.headAccessory, null);
  assert.equal(expression.secondaryAccessory, null);
  assert.equal(expression.companionDetail, null);
  assert.deepEqual(expression.completedSteps, ["base"]);
  assert.equal(expression.firstIncompleteStep, "expression");
  assert.deepEqual(expression.transforms.head, DEFAULT_PORI_LAYER_TRANSFORM);

  const base = rollbackPoriPreferences(customized, "base");
  assert.equal(base.baseStyle, "classic");
  assert.equal(base.status, "not-started");
  assert.deepEqual(base.completedSteps, []);
});

test("Pori builder locks future steps and routes backward navigation through rollback", () => {
  const builder = readFileSync("src/components/pori/PoriBuilder.tsx", "utf8");
  assert.match(builder, /const available = index <= stepIndex/);
  assert.match(builder, /rollbackPoriPreferences\(preferences, targetStep\)/);
  assert.match(builder, /goBackTo\(stepIndex - 1\)/);
});
