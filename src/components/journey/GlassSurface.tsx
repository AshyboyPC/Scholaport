import type { ElementType, ReactNode } from "react";
import { glassVariantStyles, type ScholaGlassVariant } from "@/lib/glass-variants";
import { cn } from "@/lib/utils";

type GlassSurfaceProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  variant?: ScholaGlassVariant;
};

export function GlassSurface<T extends ElementType = "div">({
  as,
  children,
  className,
  variant = "control",
  ...props
}: GlassSurfaceProps<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof GlassSurfaceProps<T>>) {
  const Component = as ?? "div";
  return (
    <Component className={cn(glassVariantStyles[variant], className)} {...props}>
      {children}
    </Component>
  );
}
