import { useId, type ReactNode } from "react";
import {
  PremiumCheckCircleIcon,
  PremiumPathMatchIcon,
  PremiumTranscriptIcon,
  PremiumWarningIcon,
} from "@/components/icons/PremiumIcon";
import academicRoadmap from "@/assets/scholaport-journey/academic-roadmap.webp";
import sourceCurriculum from "@/assets/scholaport-journey/source-curriculum.webp";
import destinationFramework from "@/assets/scholaport-journey/destination-framework.webp";
import transcriptUpload from "@/assets/scholaport-journey/transcript-upload.webp";
import counselorPacket from "@/assets/scholaport-journey/counselor-packet.webp";
import counselorGuidance from "@/assets/scholaport-journey/counselor-guidance.webp";
import aiAdvisor from "@/assets/scholaport-journey/ai-advisor.webp";
import pathMatch from "@/assets/scholaport-journey/path-match.webp";
import twinConnect from "@/assets/scholaport-journey/twin-connect.webp";
import creditMapping from "@/assets/scholaport-journey/credit-mapping.webp";
import referenceLibrary from "@/assets/scholaport-journey/reference-library.webp";
import requirementGap from "@/assets/scholaport-journey/requirement-gap.webp";
import secureProfile from "@/assets/scholaport-journey/secure-profile.webp";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export type JourneyTone = "teal" | "navy" | "coral" | "mint" | "paper";
export type ClayAssetName =
  | "source-curriculum"
  | "destination-framework"
  | "transcript-upload"
  | "counselor-packet"
  | "credit-mapping"
  | "requirement-gap"
  | "academic-roadmap"
  | "secure-profile"
  | "reference-library"
  | "counselor-guidance"
  | "ai-advisor"
  | "path-match"
  | "twin-connect";

const assets: Record<
  ClayAssetName,
  { src: string; width: number; height: number; className: string }
> = {
  "source-curriculum": {
    src: sourceCurriculum,
    width: 1536,
    height: 1024,
    className: "aspect-[3/2]",
  },
  "destination-framework": {
    src: destinationFramework,
    width: 1254,
    height: 1254,
    className: "aspect-square",
  },
  "transcript-upload": {
    src: transcriptUpload,
    width: 1024,
    height: 1536,
    className: "aspect-[2/3]",
  },
  "counselor-packet": {
    src: counselorPacket,
    width: 1254,
    height: 1254,
    className: "aspect-square",
  },
  "credit-mapping": {
    src: creditMapping,
    width: 1536,
    height: 1024,
    className: "aspect-[3/2]",
  },
  "requirement-gap": {
    src: requirementGap,
    width: 1254,
    height: 1254,
    className: "aspect-square",
  },
  "academic-roadmap": {
    src: academicRoadmap,
    width: 1536,
    height: 1024,
    className: "aspect-[3/2]",
  },
  "secure-profile": {
    src: secureProfile,
    width: 1024,
    height: 1536,
    className: "aspect-[2/3]",
  },
  "reference-library": {
    src: referenceLibrary,
    width: 1536,
    height: 1024,
    className: "aspect-[3/2]",
  },
  "counselor-guidance": {
    src: counselorGuidance,
    width: 1254,
    height: 1254,
    className: "aspect-square",
  },
  "ai-advisor": {
    src: aiAdvisor,
    width: 1254,
    height: 1254,
    className: "aspect-square",
  },
  "path-match": {
    src: pathMatch,
    width: 1254,
    height: 1254,
    className: "aspect-square",
  },
  "twin-connect": {
    src: twinConnect,
    width: 1254,
    height: 1254,
    className: "aspect-square",
  },
};

export function ClayAsset({
  asset,
  className,
  eager = false,
}: {
  asset: ClayAssetName;
  className?: string;
  eager?: boolean;
}) {
  const item = assets[asset];
  return (
    <img
      src={item.src}
      width={item.width}
      height={item.height}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      alt=""
      aria-hidden="true"
      data-clay-asset={asset}
      className={cn("journey-clay block object-contain", item.className, className)}
    />
  );
}

export function JourneyStage({
  eyebrow,
  title,
  description,
  action,
  art,
  tone = "teal",
  children,
  className,
  layout = "split",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  art?: ReactNode;
  tone?: JourneyTone;
  children?: ReactNode;
  className?: string;
  layout?: "split" | "wide" | "compact";
}) {
  const { t } = useI18n();
  const localizedTitle = typeof title === "string" ? t(title) : title;
  const localizedDescription = typeof description === "string" ? t(description) : description;
  return (
    <section
      className={cn(
        "journey-stage",
        `journey-stage--${tone}`,
        `journey-stage--layout-${layout}`,
        className,
      )}
    >
      <div className="journey-stage__copy">
        {eyebrow && <p className="journey-eyebrow">{t(eyebrow)}</p>}
        <h2 className="journey-stage__title">{localizedTitle}</h2>
        {description && <div className="journey-stage__description">{localizedDescription}</div>}
        {children}
        {action && <div className="journey-stage__action">{action}</div>}
      </div>
      {art && <div className="journey-stage__art">{art}</div>}
    </section>
  );
}

export function ClayScene({
  asset,
  className,
  assetClassName,
  eager = false,
  orbit = false,
  mode = "wide",
  children,
}: {
  asset: ClayAssetName;
  className?: string;
  assetClassName?: string;
  eager?: boolean;
  orbit?: boolean;
  mode?: "wide" | "side" | "compact" | "mobile-top" | "inline" | "corner" | "hide-small";
  children?: ReactNode;
}) {
  return (
    <div className={cn("clay-scene", `clay-scene--${mode}`, className)}>
      {orbit && <AcademicOrbit className="clay-scene__orbit" />}
      <div className="clay-scene__asset">
        <ClayAsset asset={asset} eager={eager} className={assetClassName} />
      </div>
      <span className="clay-scene__platform" aria-hidden="true" />
      {children}
    </div>
  );
}

export function AcademicOrbit({ className, label }: { className?: string; label?: string }) {
  const id = useId().replaceAll(":", "");
  return (
    <svg
      viewBox="0 0 420 320"
      className={cn("academic-orbit", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id={`${id}-orbit`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#ffffff" stopOpacity=".72" />
          <stop offset="1" stopColor="#42d8d0" stopOpacity=".18" />
        </linearGradient>
      </defs>
      <ellipse
        cx="210"
        cy="160"
        rx="168"
        ry="105"
        fill="none"
        stroke={`url(#${id}-orbit)`}
        strokeWidth="2"
      />
      <ellipse
        cx="210"
        cy="160"
        rx="118"
        ry="74"
        fill="none"
        stroke="rgba(255,255,255,.42)"
        strokeDasharray="8 12"
        strokeWidth="2"
      />
    </svg>
  );
}

export function FlowRibbon({ className, label }: { className?: string; label?: string }) {
  const id = useId().replaceAll(":", "");
  return (
    <svg
      viewBox="0 0 720 170"
      preserveAspectRatio="none"
      className={cn("flow-ribbon", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id={`${id}-flow`} x1="0" x2="1">
          <stop stopColor="#01a995" />
          <stop offset=".52" stopColor="#42d8d0" />
          <stop offset="1" stopColor="#f86746" />
        </linearGradient>
      </defs>
      <path className="flow-ribbon__shadow" d="M12 112 C135 18 248 150 370 78 S576 26 708 98" />
      <path
        className="flow-ribbon__path"
        d="M12 112 C135 18 248 150 370 78 S576 26 708 98"
        stroke={`url(#${id}-flow)`}
      />
      <g className="flow-ribbon__tokens">
        <circle cx="24" cy="104" r="10" />
        <rect x="338" y="59" width="26" height="26" rx="9" />
        <circle cx="694" cy="91" r="12" />
      </g>
    </svg>
  );
}

export function RouteStrand({
  className,
  vertical = false,
  activeStop = 1,
  totalStops = 3,
  label,
}: {
  className?: string;
  vertical?: boolean;
  activeStop?: number;
  totalStops?: number;
  label?: string;
}) {
  const id = useId().replaceAll(":", "");
  const stops = Array.from({ length: Math.max(2, Math.min(totalStops, 5)) });
  return (
    <div
      className={cn(
        "journey-route-strand",
        vertical && "journey-route-strand--vertical",
        className,
      )}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <svg viewBox={vertical ? "0 0 120 420" : "0 0 620 150"} preserveAspectRatio="none">
        <defs>
          <filter id={`${id}-shadow`} x="-20%" y="-40%" width="140%" height="180%">
            <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#0a175a" floodOpacity=".14" />
          </filter>
          <linearGradient id={`${id}-gradient`} x1="0" x2="1">
            <stop offset="0" stopColor="#01a995" />
            <stop offset=".55" stopColor="#01c3ad" />
            <stop offset="1" stopColor="#42d8d0" />
          </linearGradient>
        </defs>
        <path
          d={
            vertical
              ? "M60 14 C22 88, 100 118, 58 192 S28 314, 65 406"
              : "M18 92 C125 20, 205 132, 310 72 S485 24, 602 86"
          }
          fill="none"
          stroke={`url(#${id}-gradient)`}
          strokeWidth="12"
          strokeLinecap="round"
          filter={`url(#${id}-shadow)`}
          className="journey-route-strand__path"
        />
        <path
          d={
            vertical
              ? "M60 14 C22 88, 100 118, 58 192 S28 314, 65 406"
              : "M18 92 C125 20, 205 132, 310 72 S485 24, 602 86"
          }
          fill="none"
          stroke="rgba(255,255,255,.5)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {stops.map((_, index) => {
          const ratio = index / (stops.length - 1);
          const x = vertical ? 60 + Math.sin(index * 2.1) * 12 : 18 + ratio * 584;
          const y = vertical ? 14 + ratio * 392 : 90 - Math.sin(ratio * Math.PI * 2.2) * 29;
          const current = index + 1 === activeStop;
          const done = index + 1 < activeStop;
          return (
            <g key={index} transform={`translate(${x} ${y})`}>
              <circle r={current ? 18 : 13} fill="white" opacity=".94" />
              <circle
                r={current ? 12 : 8}
                fill={current ? "#f86746" : done ? "#bfeBDD" : "#0a175a"}
                stroke={current ? "#0a175a" : "white"}
                strokeWidth={current ? 4 : 2}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export type MappingStatus = "confirmed" | "probable" | "review" | "unmapped";

export function MappingRoute({
  source,
  destination,
  status,
  detail,
}: {
  source: ReactNode;
  destination: ReactNode;
  status: MappingStatus;
  detail?: ReactNode;
}) {
  const labels: Record<MappingStatus, string> = {
    confirmed: "Confirmed preview",
    probable: "Probable mapping",
    review: "Counselor review required",
    unmapped: "Not mapped",
  };
  return (
    <article
      className={cn("mapping-route", `mapping-route--${status}`)}
      aria-label={`${labels[status]} from source course to destination fit`}
    >
      <div className="mapping-route__token mapping-route__token--source">{source}</div>
      <div className="mapping-route__path" aria-hidden="true">
        <span />
        <i />
      </div>
      <div className="mapping-route__token mapping-route__token--destination">{destination}</div>
      <div className="mapping-route__status">
        <strong>{labels[status]}</strong>
        {detail && <span>{detail}</span>}
      </div>
    </article>
  );
}

export function RequirementStructure({
  satisfied,
  partial,
  missing,
  label,
}: {
  satisfied: number;
  partial: number;
  missing: number;
  label: string;
}) {
  const total = Math.max(1, Math.min(12, satisfied + partial + missing));
  const pieces = Array.from({ length: total }, (_, index) =>
    index < satisfied ? "satisfied" : index < satisfied + partial ? "partial" : "missing",
  );
  return (
    <div className="requirement-structure" role="img" aria-label={label}>
      {pieces.map((status, index) => (
        <span key={index} className={`requirement-piece requirement-piece--${status}`}>
          {status === "satisfied" ? (
            <PremiumCheckCircleIcon />
          ) : status === "partial" ? (
            <PremiumWarningIcon />
          ) : null}
        </span>
      ))}
    </div>
  );
}

export function ClayCourseToken({
  children,
  tone = "teal",
}: {
  children: ReactNode;
  tone?: "teal" | "navy" | "coral" | "yellow" | "mint";
}) {
  return <span className={`clay-course-token clay-course-token--${tone}`}>{children}</span>;
}

export function DocumentStack({ processing = false }: { processing?: boolean }) {
  return (
    <span
      className={cn("document-stack", processing && "document-stack--processing")}
      aria-hidden="true"
    >
      <i />
      <i />
      <i />
      {processing && <b />}
    </span>
  );
}

export function CounselorSeal({ children = "Review" }: { children?: ReactNode }) {
  return (
    <span className="counselor-seal">
      <PremiumPathMatchIcon aria-hidden="true" />
      {children}
    </span>
  );
}

export function RouteCheckpoint({
  index,
  title,
  detail,
  active = false,
  complete = false,
  last = false,
}: {
  index: number;
  title: ReactNode;
  detail?: ReactNode;
  active?: boolean;
  complete?: boolean;
  last?: boolean;
}) {
  return (
    <div className={cn("route-checkpoint", active && "is-active", complete && "is-complete")}>
      <div className="route-checkpoint__rail" aria-hidden="true">
        <span>
          {complete ? <PremiumCheckCircleIcon /> : active ? <PremiumPathMatchIcon /> : index}
        </span>
        {!last && <i />}
      </div>
      <div className="route-checkpoint__content">
        <strong>{title}</strong>
        {detail && <span>{detail}</span>}
      </div>
    </div>
  );
}

export function JourneySkeleton({ className }: { className?: string }) {
  return <div className={cn("journey-skeleton", className)} aria-hidden="true" />;
}

export function EmptyJourneyState({
  title,
  description,
  action,
}: {
  title: ReactNode;
  description: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="empty-journey-state">
      <DocumentStack />
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}

export function JourneyNotice({
  children,
  tone = "navy",
}: {
  children: ReactNode;
  tone?: "navy" | "coral" | "yellow" | "mint";
}) {
  return <div className={`journey-notice journey-notice--${tone}`}>{children}</div>;
}

export function AcademicDocumentIcon() {
  return (
    <span className="academic-document-icon" aria-hidden="true">
      <PremiumTranscriptIcon />
    </span>
  );
}
