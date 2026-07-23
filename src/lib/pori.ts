import {
  PoriBaseStyleSchema,
  PoriExpressionSchema,
  PoriHeadAccessorySchema,
  type PoriAssetCategory,
  type PoriBaseStyle,
  type PoriCompanionDetail,
  type PoriExpression,
  type PoriHeadAccessory,
  type PoriSecondaryAccessory,
} from "@/lib/pori-preferences";
export * from "@/lib/pori-preferences";
import academicPassport from "@/assets/pori/details/academic-passport.png";
import cloudWaypoint from "@/assets/pori/details/cloud-waypoint.png";
import courseToken from "@/assets/pori/details/course-token.png";
import mappingRing from "@/assets/pori/details/mapping-ring.png";
import routeMarker from "@/assets/pori/details/route-marker.png";
import transcriptPage from "@/assets/pori/details/transcript-page.png";
import calmExpression from "@/assets/pori/expressions/calm.png";
import curiousExpression from "@/assets/pori/expressions/curious.png";
import encouragingExpression from "@/assets/pori/expressions/encouraging.png";
import excitedExpression from "@/assets/pori/expressions/excited.png";
import focusedExpression from "@/assets/pori/expressions/focused.png";
import classicCalm from "@/assets/pori/full/classic/calm.png";
import classicCurious from "@/assets/pori/full/classic/curious.png";
import classicEncouraging from "@/assets/pori/full/classic/encouraging.png";
import classicExcited from "@/assets/pori/full/classic/excited.png";
import classicFocused from "@/assets/pori/full/classic/focused.png";
import classicFriendly from "@/assets/pori/full/classic/friendly.png";
import plushCalm from "@/assets/pori/full/plush/calm.png";
import plushCurious from "@/assets/pori/full/plush/curious.png";
import plushEncouraging from "@/assets/pori/full/plush/encouraging.png";
import plushExcited from "@/assets/pori/full/plush/excited.png";
import plushFocused from "@/assets/pori/full/plush/focused.png";
import plushFriendly from "@/assets/pori/full/plush/friendly.png";
import academicHeadband from "@/assets/pori/head/academic-headband.png";
import cloudCap from "@/assets/pori/head/cloud-cap.png";
import explorerHat from "@/assets/pori/head/explorer-hat.png";
import headphones from "@/assets/pori/head/headphones.png";
import routeBeanie from "@/assets/pori/head/route-beanie.png";
import studyVisor from "@/assets/pori/head/study-visor.png";
import academicTablet from "@/assets/pori/secondary/academic-tablet.png";
import counselorFolder from "@/assets/pori/secondary/counselor-folder.png";
import documentSatchel from "@/assets/pori/secondary/document-satchel.png";
import miniBackpack from "@/assets/pori/secondary/mini-backpack.png";
import routeScarf from "@/assets/pori/secondary/route-scarf.png";
import smallNotebook from "@/assets/pori/secondary/small-notebook.png";

type PoriAssetId =
  | PoriBaseStyle
  | `${PoriBaseStyle}:${PoriExpression}`
  | `${PoriBaseStyle}:${PoriExpression}:${PoriHeadAccessory}`
  | Exclude<PoriExpression, "friendly">
  | PoriHeadAccessory
  | PoriSecondaryAccessory
  | PoriCompanionDetail;

export type PoriAssetDefinition = {
  id: PoriAssetId;
  name: string;
  category: PoriAssetCategory;
  compatibleBaseStyles: readonly PoriBaseStyle[];
  compatibleExpressions: readonly PoriExpression[];
  compatibleAccessories: readonly string[];
  desktopAssetPath: string;
  mobileAssetPath: string;
  passportAssetPath: string;
  advisorAssetPath: string;
  thumbnailPath: string;
  intrinsicWidth: number;
  intrinsicHeight: number;
  anchor: { x: number; y: number };
  scale: number;
  rotation: number;
  attachment: "body" | "face" | "crown" | "neck" | "back" | "hand" | "side";
  adjustment: {
    x: readonly [number, number];
    y: readonly [number, number];
    scale: readonly [number, number];
    rotation: readonly [number, number];
  };
  zIndex: number;
  approved: boolean;
  sourceGenerationPrompt: string;
  rejectedCandidates: readonly string[];
  rejectionReasons: readonly string[];
};

const allBases = PoriBaseStyleSchema.options;
const allExpressions = PoriExpressionSchema.options;

function asset(
  definition: Pick<
    PoriAssetDefinition,
    | "id"
    | "name"
    | "category"
    | "desktopAssetPath"
    | "intrinsicWidth"
    | "intrinsicHeight"
    | "anchor"
    | "scale"
    | "zIndex"
    | "sourceGenerationPrompt"
  > &
    Partial<PoriAssetDefinition>,
): PoriAssetDefinition {
  return {
    compatibleBaseStyles: allBases,
    compatibleExpressions: allExpressions,
    compatibleAccessories: [],
    mobileAssetPath: definition.desktopAssetPath,
    passportAssetPath: definition.desktopAssetPath,
    advisorAssetPath: definition.desktopAssetPath,
    thumbnailPath: definition.desktopAssetPath,
    approved: true,
    rotation: 0,
    attachment: "side",
    adjustment: {
      x: [-8, 8],
      y: [-8, 8],
      scale: [0.82, 1.18],
      rotation: [-8, 8],
    },
    rejectedCandidates: [],
    rejectionReasons: [],
    ...definition,
  };
}

export const PORI_BASE_ASSETS: readonly PoriAssetDefinition[] = [
  ["classic", "Classic Pori", classicFriendly, "Official polished 3D clay Pori."],
  ["plush", "Plush Pori", plushFriendly, "Soft stitched 3D Pori with a tactile plush finish."],
].map(([id, name, path, prompt]) =>
  asset({
    id: id as PoriBaseStyle,
    name,
    category: "base",
    desktopAssetPath: path,
    intrinsicWidth: 781,
    intrinsicHeight: 900,
    anchor: { x: 50, y: 50 },
    scale: 1,
    attachment: "body",
    zIndex: 10,
    sourceGenerationPrompt: prompt,
  }),
);

const PORI_BODY_PATHS = {
  classic: {
    friendly: classicFriendly,
    curious: classicCurious,
    focused: classicFocused,
    encouraging: classicEncouraging,
    excited: classicExcited,
    calm: classicCalm,
  },
  plush: {
    friendly: plushFriendly,
    curious: plushCurious,
    focused: plushFocused,
    encouraging: plushEncouraging,
    excited: plushExcited,
    calm: plushCalm,
  },
} satisfies Record<PoriBaseStyle, Record<PoriExpression, string>>;

export const PORI_BODY_ASSETS: readonly PoriAssetDefinition[] = allBases.flatMap((baseStyle) =>
  allExpressions.map((expression) =>
    asset({
      id: `${baseStyle}:${expression}`,
      name: `${baseStyle === "classic" ? "Classic" : "Plush"} Pori, ${expression}`,
      category: "base",
      desktopAssetPath: PORI_BODY_PATHS[baseStyle][expression],
      intrinsicWidth: 781,
      intrinsicHeight: 900,
      anchor: { x: 50, y: 50 },
      scale: 1,
      attachment: "body",
      zIndex: 10,
      sourceGenerationPrompt: `Complete full-body ${baseStyle} Pori with a ${expression} expression, normalized to the canonical Pori frame.`,
    }),
  ),
);

export function poriBodyAsset(baseStyle: PoriBaseStyle, expression: PoriExpression) {
  return PORI_BODY_ASSETS.find((entry) => entry.id === `${baseStyle}:${expression}`);
}

export const PORI_EXPRESSION_ASSETS: readonly PoriAssetDefinition[] = [
  ["curious", "Curious", curiousExpression],
  ["focused", "Focused", focusedExpression],
  ["encouraging", "Encouraging", encouragingExpression],
  ["excited", "Excited", excitedExpression],
  ["calm", "Calm", calmExpression],
].map(([id, name, path]) =>
  asset({
    id: id as Exclude<PoriExpression, "friendly">,
    name: name as string,
    category: "expression",
    desktopAssetPath: path as string,
    intrinsicWidth: 640,
    intrinsicHeight: 640,
    anchor: { x: 50, y: 50 },
    scale: 1,
    attachment: "face",
    zIndex: 20,
    sourceGenerationPrompt: `${name as string} expression picker preview for Pori. The applied result uses a complete full-body render.`,
  }),
);

export const PORI_HEAD_ASSETS: readonly PoriAssetDefinition[] = [
  ["cloud-cap", "Cloud Cap", cloudCap, 50, 4, 0.36],
  ["academic-headband", "Academic Headband", academicHeadband, 50, 15, 0.38],
  ["route-beanie", "Route Beanie", routeBeanie, 50, 3, 0.4],
  ["explorer-hat", "Teal Explorer Hat", explorerHat, 50, 4, 0.44],
  ["headphones", "Small Headphones", headphones, 50, 14, 0.37],
  ["study-visor", "Study Visor", studyVisor, 50, 16, 0.36],
].map(([id, name, path, x, y, scale]) =>
  asset({
    id: id as PoriHeadAccessory,
    name: name as string,
    category: "head",
    desktopAssetPath: path as string,
    intrinsicWidth: 640,
    intrinsicHeight: 640,
    anchor: { x: x as number, y: y as number },
    scale: scale as number,
    attachment: "crown",
    adjustment: {
      x: [-6, 6],
      y: [-6, 6],
      scale: [0.82, 1.14],
      rotation: [-8, 8],
    },
    zIndex: 30,
    sourceGenerationPrompt: `${name as string}, isolated soft-clay Pori head accessory.`,
  }),
);

const bakedHeadPaths = import.meta.glob("/src/assets/pori/baked/head/**/*.png", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

function bakedHeadPath(
  baseStyle: PoriBaseStyle,
  expression: PoriExpression,
  headAccessory: PoriHeadAccessory,
) {
  const key = `/src/assets/pori/baked/head/${baseStyle}/${expression}/${headAccessory}.png`;
  const path = bakedHeadPaths[key];
  if (!path) throw new Error(`Missing baked Pori asset: ${key}`);
  return path;
}

export const PORI_BAKED_HEAD_ASSETS: readonly PoriAssetDefinition[] = allBases.flatMap(
  (baseStyle) =>
    allExpressions.flatMap((expression) =>
      PoriHeadAccessorySchema.options.map((headAccessory) =>
        asset({
          id: `${baseStyle}:${expression}:${headAccessory}`,
          name: `${baseStyle} Pori, ${expression}, ${headAccessory}`,
          category: "base",
          desktopAssetPath: bakedHeadPath(baseStyle, expression, headAccessory),
          intrinsicWidth: 781,
          intrinsicHeight: 900,
          anchor: { x: 50, y: 50 },
          scale: 1,
          attachment: "body",
          zIndex: 10,
          sourceGenerationPrompt: `Complete generated ${baseStyle} Pori with a ${expression} expression genuinely wearing the ${headAccessory}.`,
        }),
      ),
    ),
);

export function poriBakedHeadAsset(
  baseStyle: PoriBaseStyle,
  expression: PoriExpression,
  headAccessory: PoriHeadAccessory,
) {
  return PORI_BAKED_HEAD_ASSETS.find(
    (entry) => entry.id === `${baseStyle}:${expression}:${headAccessory}`,
  );
}

export const PORI_SECONDARY_ASSETS: readonly PoriAssetDefinition[] = [
  ["mini-backpack", "Mini Backpack", miniBackpack, 31, 57, 0.23, 8, "back"],
  ["document-satchel", "Document Satchel", documentSatchel, 68, 60, 0.27, 35, "hand"],
  ["route-scarf", "Route Scarf", routeScarf, 50, 43, 0.32, 35, "neck"],
  ["academic-tablet", "Academic Tablet", academicTablet, 67, 59, 0.24, 35, "hand"],
  ["small-notebook", "Small Notebook", smallNotebook, 67, 59, 0.2, 35, "hand"],
  ["counselor-folder", "Counselor Folder", counselorFolder, 67, 60, 0.2, 35, "hand"],
].map(([id, name, path, x, y, scale, zIndex, attachment]) =>
  asset({
    id: id as PoriSecondaryAccessory,
    name: name as string,
    category: "secondary",
    desktopAssetPath: path as string,
    intrinsicWidth: 640,
    intrinsicHeight: 640,
    anchor: { x: x as number, y: y as number },
    scale: scale as number,
    zIndex: zIndex as number,
    attachment: attachment as PoriAssetDefinition["attachment"],
    adjustment: {
      x: [-7, 7],
      y: [-7, 7],
      scale: [0.78, 1.18],
      rotation: [-10, 10],
    },
    sourceGenerationPrompt: `${name as string}, isolated soft-clay Pori secondary accessory.`,
  }),
);

export const PORI_DETAIL_ASSETS: readonly PoriAssetDefinition[] = [
  ["academic-passport", "Academic Passport", academicPassport],
  ["course-token", "Course Token", courseToken],
  ["route-marker", "Route Marker", routeMarker],
  ["transcript-page", "Transcript Page", transcriptPage],
  ["mapping-ring", "Mapping Ring", mappingRing],
  ["cloud-waypoint", "Cloud Waypoint", cloudWaypoint],
].map(([id, name, path]) =>
  asset({
    id: id as PoriCompanionDetail,
    name,
    category: "detail",
    desktopAssetPath: path,
    intrinsicWidth: 640,
    intrinsicHeight: 640,
    anchor: { x: 78, y: 77 },
    scale: 0.15,
    attachment: "side",
    adjustment: {
      x: [-8, 5],
      y: [-7, 8],
      scale: [0.8, 1.2],
      rotation: [-10, 10],
    },
    zIndex: 40,
    sourceGenerationPrompt: `${name}, isolated soft-clay academic journey detail.`,
  }),
);

export const PORI_ASSET_REGISTRY = [
  ...PORI_BASE_ASSETS,
  ...PORI_BAKED_HEAD_ASSETS,
  ...PORI_EXPRESSION_ASSETS,
  ...PORI_HEAD_ASSETS,
  ...PORI_SECONDARY_ASSETS,
  ...PORI_DETAIL_ASSETS,
] as const;

export function poriAsset(category: PoriAssetCategory, id: string | null | undefined) {
  return id
    ? PORI_ASSET_REGISTRY.find((entry) => entry.category === category && entry.id === id)
    : undefined;
}
