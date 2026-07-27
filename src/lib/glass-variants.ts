/**
 * Adapted from GlassCN's dependency-free `glass-variants` registry item.
 *
 * The registry's animated liquid and high-blur variants are intentionally not
 * retained. ScholaPort only needs small, bounded control surfaces with a solid
 * fallback, so the visual implementation lives in the shared stylesheet.
 */
export type ScholaGlassVariant = "navigation" | "control" | "overlay";

export type ScholaGlassVariantProp = {
  glassVariant?: ScholaGlassVariant;
};

export const glassVariantStyles: Record<ScholaGlassVariant, string> = {
  navigation: "schola-glass schola-glass--navigation",
  control: "schola-glass schola-glass--control",
  overlay: "schola-glass schola-glass--overlay",
};
