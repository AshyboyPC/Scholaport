import type { CSSProperties } from "react";
import {
  poriAsset,
  poriBakedHeadAsset,
  poriBodyAsset,
  type PoriAssetDefinition,
  type PoriLayerTransform,
  type PoriPreferences,
} from "@/lib/pori";
import { cn } from "@/lib/utils";

export type PoriContext = "builder" | "advisor" | "passport" | "mobile" | "empty";

function pathFor(asset: PoriAssetDefinition, context: PoriContext) {
  if (context === "advisor") return asset.advisorAssetPath;
  if (context === "passport") return asset.passportAssetPath;
  if (context === "mobile") return asset.mobileAssetPath;
  return asset.desktopAssetPath;
}

function Layer({
  asset,
  context,
  transform,
  styleTransform,
}: {
  asset?: PoriAssetDefinition;
  context: PoriContext;
  transform?: PoriLayerTransform;
  styleTransform?: PoriLayerTransform;
}) {
  if (!asset) return null;
  const style = {
    "--pori-x": `${asset.anchor.x + (styleTransform?.x ?? 0) + (transform?.x ?? 0)}%`,
    "--pori-y": `${asset.anchor.y + (styleTransform?.y ?? 0) + (transform?.y ?? 0)}%`,
    "--pori-scale": asset.scale * (styleTransform?.scale ?? 1) * (transform?.scale ?? 1),
    "--pori-rotation": `${asset.rotation + (styleTransform?.rotation ?? 0) + (transform?.rotation ?? 0)}deg`,
    zIndex: asset.zIndex,
  } as CSSProperties;
  return (
    <img
      aria-hidden="true"
      draggable={false}
      src={pathFor(asset, context)}
      className="pori-avatar__layer"
      style={style}
    />
  );
}

const PLUSH_ATTACHMENT_FITS: Partial<
  Record<PoriAssetDefinition["attachment"], PoriLayerTransform>
> = {
  neck: { x: 0, y: -2, scale: 0.94, rotation: 0 },
  back: { x: 2, y: 0, scale: 0.92, rotation: 0 },
  hand: { x: -2, y: 0, scale: 0.92, rotation: 0 },
  side: { x: -2, y: 0, scale: 0.92, rotation: 0 },
};

export function PoriAvatar({
  preferences,
  context = "builder",
  className,
  label = "Customized Pori companion",
}: {
  preferences: PoriPreferences;
  context?: PoriContext;
  className?: string;
  label?: string;
}) {
  const base = preferences.headAccessory
    ? poriBakedHeadAsset(
        preferences.baseStyle,
        preferences.expression,
        preferences.headAccessory,
      )
    : poriBodyAsset(preferences.baseStyle, preferences.expression);
  const secondary = poriAsset("secondary", preferences.secondaryAccessory);
  const detail = poriAsset("detail", preferences.companionDetail);
  const compact = context === "mobile" || context === "passport";
  const styleFit = (asset: PoriAssetDefinition | undefined) =>
    preferences.baseStyle === "plush" && asset
      ? PLUSH_ATTACHMENT_FITS[asset.attachment]
      : undefined;

  return (
    <figure className={cn("pori-avatar", `pori-avatar--${context}`, className)} aria-label={label}>
      <span className="pori-avatar__shadow" aria-hidden="true" />
      <Layer
        asset={secondary?.zIndex === 8 ? secondary : undefined}
        context={context}
        transform={preferences.transforms.secondary}
        styleTransform={styleFit(secondary)}
      />
      <Layer asset={base} context={context} />
      {context !== "mobile" && (
        <Layer
          asset={secondary?.zIndex !== 8 ? secondary : undefined}
          context={context}
          transform={preferences.transforms.secondary}
          styleTransform={styleFit(secondary)}
        />
      )}
      {!compact && (
        <Layer
          asset={detail}
          context={context}
          transform={preferences.transforms.detail}
          styleTransform={styleFit(detail)}
        />
      )}
    </figure>
  );
}
