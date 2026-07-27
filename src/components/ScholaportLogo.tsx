import logo from "@/assets/scholaport-logo.png";
import { cn } from "@/lib/utils";

export function ScholaportLogo({
  className,
  showWordmark = false,
  inverse = false,
  animatedLoader = false,
}: {
  className?: string;
  showWordmark?: boolean;
  inverse?: boolean;
  animatedLoader?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {animatedLoader && (
        <style>{`
          @keyframes logo-fill-sweep {
            0% { clip-path: inset(0 100% 0 0); }
            50% { clip-path: inset(0 0% 0 0); }
            100% { clip-path: inset(0 0% 0 0); }
          }
          .animate-logo-fill {
            animation: logo-fill-sweep 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }
        `}</style>
      )}
      <span className="relative aspect-square h-full shrink-0 overflow-hidden rounded-[24%] bg-white">
        <img
          src={logo}
          alt={animatedLoader ? "" : "Scholaport"}
          className={cn(
            "absolute inset-0 h-full w-full scale-[1.62] object-cover",
            animatedLoader && "grayscale opacity-30"
          )}
        />
        {animatedLoader && (
          <img
            src={logo}
            alt="Scholaport Loading"
            className="animate-logo-fill absolute inset-0 h-full w-full scale-[1.62] object-cover"
          />
        )}
      </span>
      {showWordmark && (
        <span
          className={cn(
            "font-display text-xl font-bold tracking-[-0.04em]",
            inverse ? "text-white" : "text-[#0A175A]",
          )}
        >
          Scholaport
        </span>
      )}
    </span>
  );
}
