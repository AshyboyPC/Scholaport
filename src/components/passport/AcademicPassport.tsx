import { RotateCcw } from "lucide-react";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import {
  PremiumBookIcon,
  PremiumCheckCircleIcon,
  PremiumGraduationIcon,
  PremiumRoadmapIcon,
} from "@/components/icons/PremiumIcon";
import {
  ACADEMIC_PASSPORT_DISCLAIMER,
  isAcademicPassportComplete,
  sanitizeAcademicPassportMark,
  sanitizeAcademicPassportText,
  type AcademicPassportAccent,
  type AcademicPassportBaseColor,
  type AcademicPassportCutout,
  type AcademicPassportMark,
  type AcademicPassportPreferences,
  type AcademicPassportShape,
} from "@/lib/academic-passport";
import { cn } from "@/lib/utils";
import { notifyError, notifySuccess } from "@/lib/app-feedback";
import { PoriAvatar } from "@/components/pori/PoriAvatar";
import { PassportIdentityEditor } from "@/components/passport/PassportIdentityEditor";
import { getAcademicPassportPhotoUrl } from "@/lib/academic-passport-api";
import { useI18n } from "@/lib/i18n";

export type AcademicPassportIdentity = {
  name: string;
  source: string;
  sourceDetail?: string | null;
  destination: string;
  destinationDetail?: string | null;
  grade?: number | string | null;
  classYear?: number | string | null;
  status?: string;
};

const baseColors: ReadonlyArray<{
  id: AcademicPassportBaseColor;
  name: string;
  swatch: string;
}> = [
  { id: "passage-teal", name: "Passage teal", swatch: "#58d2c6" },
  { id: "archive-navy", name: "Archive navy", swatch: "#0a175a" },
  { id: "signal-coral", name: "Signal coral", swatch: "#ffb5a3" },
  { id: "verification-mint", name: "Verification mint", swatch: "#c8efe3" },
  { id: "horizon-cyan", name: "Horizon cyan", swatch: "#a8e9ed" },
  { id: "sunlit-cream", name: "Sunlit cream", swatch: "#fff1bd" },
];

const accents: ReadonlyArray<{
  id: AcademicPassportAccent;
  name: string;
  swatch: string;
}> = [
  { id: "navy", name: "Navy", swatch: "#07113f" },
  { id: "teal", name: "Teal", swatch: "#01a995" },
  { id: "coral", name: "Coral", swatch: "#f86746" },
  { id: "ivory", name: "Ivory", swatch: "#fffdf8" },
];

const shapes: ReadonlyArray<{
  id: AcademicPassportShape;
  name: string;
}> = [
  { id: "rounded", name: "Rounded" },
  { id: "soft-square", name: "Soft square" },
  { id: "ticket", name: "Ticket" },
];

const cutouts: ReadonlyArray<{
  id: AcademicPassportCutout;
  name: string;
}> = [
  { id: "none", name: "None" },
  { id: "side-notch", name: "Side notch" },
  { id: "corner-cut", name: "Corner cut" },
];

const marks: ReadonlyArray<{
  id: AcademicPassportMark;
  name: string;
}> = [
  { id: "monogram", name: "Monogram" },
  { id: "graduation", name: "Graduation" },
  { id: "book", name: "Book" },
  { id: "route", name: "Route" },
  { id: "custom", name: "My own" },
];

export function PassportEmblem({ className }: { emblem?: unknown; className?: string }) {
  return (
    <span className={cn("passport-production-emblem", className)} aria-hidden="true">
      SP
    </span>
  );
}

function PersonalMark({ preferences }: { preferences: AcademicPassportPreferences }) {
  if (preferences.mark === "custom") {
    return (
      <span className="academic-passport__custom-mark" aria-label="Personal mark">
        {preferences.customMark || "SP"}
      </span>
    );
  }
  if (preferences.mark === "graduation") return <PremiumGraduationIcon aria-hidden="true" />;
  if (preferences.mark === "book") return <PremiumBookIcon aria-hidden="true" />;
  if (preferences.mark === "route") return <PremiumRoadmapIcon aria-hidden="true" />;
  return <span aria-hidden="true">SP</span>;
}

function MarkPreview({ mark }: { mark: AcademicPassportMark }) {
  if (mark === "graduation") return <PremiumGraduationIcon aria-hidden="true" />;
  if (mark === "book") return <PremiumBookIcon aria-hidden="true" />;
  if (mark === "route") return <PremiumRoadmapIcon aria-hidden="true" />;
  if (mark === "custom")
    return <span className="passport-mark-option__cursor" aria-hidden="true" />;
  return <span aria-hidden="true">SP</span>;
}

function RouteArrow() {
  return (
    <svg viewBox="0 0 120 24" aria-hidden="true">
      <path d="M3 12h108" />
      <path d="m103 4 8 8-8 8" />
    </svg>
  );
}

export function AcademicPassportPreview({
  preferences,
  identity,
  className,
  variant = "full",
  interactive = true,
}: {
  preferences: AcademicPassportPreferences;
  identity: AcademicPassportIdentity;
  className?: string;
  variant?: "full" | "compact";
  interactive?: boolean;
}) {
  const { t } = useI18n();
  const [view, setView] = useState<"front" | "details">(preferences.view);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    setView(preferences.view);
  }, [preferences.view]);

  useEffect(() => {
    if (preferences.identity.mode !== "photo" || !preferences.identity.photoPath)
      return setPhotoUrl(null);
    let active = true;
    void getAcademicPassportPhotoUrl(preferences.identity.photoPath)
      .then((url) => active && setPhotoUrl(url))
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [preferences.identity.mode, preferences.identity.photoPath]);

  const source = [identity.source, identity.sourceDetail].filter(Boolean).join(" · ");
  const destination = [identity.destination, identity.destinationDetail]
    .filter(Boolean)
    .join(" · ");
  const accessibleRoute = `${identity.name}. ${identity.source} to ${identity.destination}. ${identity.status ?? "Planning view"}.`;

  return (
    <figure
      className={cn("academic-passport-wrap", `academic-passport-wrap--${variant}`, className)}
      data-passport-theme={preferences.baseColor}
      data-passport-accent={preferences.accent}
      data-passport-shape={preferences.shape}
      data-passport-cutout={preferences.cutout}
    >
      {interactive && (
        <div className="academic-passport__view-switch" role="group" aria-label="Passport view">
          <button type="button" aria-pressed={view === "front"} onClick={() => setView("front")}>
            {t("Front")}
          </button>
          <button
            type="button"
            aria-pressed={view === "details"}
            onClick={() => setView("details")}
          >
            {t("Details")}
          </button>
        </div>
      )}

      <article
        className={cn("academic-passport", view === "details" && "academic-passport--details")}
      >
        <div className="academic-passport__content">
          <header className="academic-passport__header">
            <div className="academic-passport__brand">
              <span className="academic-passport__brand-mark">SP</span>
              <div>
                <small>ScholaPort</small>
                <strong>{preferences.title}</strong>
              </div>
            </div>
            <span className="academic-passport__personal-mark">
              <PersonalMark preferences={preferences} />
            </span>
          </header>

          {view === "front" ? (
            <>
              <div className="academic-passport__identity">
                <div className="academic-passport__identity-visual">
                  {preferences.identity.mode === "photo" && photoUrl ? (
                    <img
                      src={photoUrl}
                      alt=""
                      style={{
                        objectPosition: `${preferences.identity.photoCrop.x}% ${preferences.identity.photoCrop.y}%`,
                      }}
                    />
                  ) : (
                    <PoriAvatar preferences={preferences.pori} context="passport" />
                  )}
                </div>
                <div>
                  <small>{t("Student")}</small>
                  <h3>{identity.name}</h3>
                  <p>{preferences.motto}</p>
                </div>
              </div>
              <div className="academic-passport__route">
                <div>
                  <span>{t("From")}</span>
                  <strong>{identity.source}</strong>
                  {identity.sourceDetail && <small>{identity.sourceDetail}</small>}
                </div>
                <RouteArrow />
                <div>
                  <span>{t("To")}</span>
                  <strong>{identity.destination}</strong>
                  {identity.destinationDetail && <small>{identity.destinationDetail}</small>}
                </div>
              </div>
              <footer className="academic-passport__footer">
                <span>
                  {identity.grade ? `${t("Grade")} ${identity.grade}` : t("Academic planning")}
                </span>
                <span>
                  {identity.classYear ? `Class of ${identity.classYear}` : identity.status}
                </span>
              </footer>
            </>
          ) : (
            <>
              <div className="academic-passport__detail-grid">
                <PassportFact label={t("Student")} value={identity.name} />
                <PassportFact label="Status" value={identity.status ?? "Planning view"} />
                <PassportFact label="Source curriculum" value={source} />
                <PassportFact label="Destination framework" value={destination} />
              </div>
              <footer className="academic-passport__details-footer">
                <p>{preferences.motto}</p>
                <small>{ACADEMIC_PASSPORT_DISCLAIMER}</small>
              </footer>
            </>
          )}
        </div>
      </article>
      <figcaption className="sr-only">{accessibleRoute}</figcaption>
    </figure>
  );
}

function PassportFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function OptionButton({
  selected,
  title,
  children,
  onSelect,
  className,
}: {
  selected: boolean;
  title: string;
  children: ReactNode;
  onSelect: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={cn("passport-customizer__option", className)}
      aria-pressed={selected}
      onClick={onSelect}
    >
      {children}
      <span>{title}</span>
      {selected && (
        <PremiumCheckCircleIcon className="passport-customizer__check" aria-hidden="true" />
      )}
    </button>
  );
}

export function AcademicPassportBuilder({
  preferences,
  identity,
  onChange,
  onReset,
  onSave,
  compact = false,
  userId,
}: {
  preferences: AcademicPassportPreferences;
  identity: AcademicPassportIdentity;
  onChange: (preferences: AcademicPassportPreferences) => void | Promise<unknown>;
  onReset?: () => void | Promise<unknown>;
  onSave?: (preferences: AcademicPassportPreferences) => void | Promise<void>;
  compact?: boolean;
  userId?: string;
}) {
  const [saveIssue, setSaveIssue] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const saved = isAcademicPassportComplete(preferences);

  const update = (patch: Partial<AcademicPassportPreferences>) => {
    setSaveIssue(null);
    const result = onChange({
      ...preferences,
      ...patch,
      completionState: "in-progress",
      lastCompletedStep: 2,
      savedAt: null,
    });
    if (result instanceof Promise) {
      void result.catch((cause) => {
        setSaveIssue(cause instanceof Error ? cause.message : "Unable to sync your Passport.");
      });
    }
  };

  const save = async () => {
    if (preferences.identity.mode === "photo" && !preferences.identity.photoPath) {
      setSaveIssue("Choose and save a photo, or use your Pori before saving the Passport.");
      return;
    }
    if (preferences.mark === "custom" && !preferences.customMark) {
      setSaveIssue("Add a custom emoji or initials, or choose one of the included marks.");
      return;
    }
    setSaving(true);
    setSaveIssue(null);
    const now = new Date().toISOString();
    const next: AcademicPassportPreferences = {
      ...preferences,
      completionState: "saved",
      lastCompletedStep: 4,
      updatedAt: now,
      savedAt: now,
    };
    try {
      await onChange(next);
      await onSave?.(next);
      if (!onSave) notifySuccess("Academic Passport saved.");
    } catch (cause) {
      setSaveIssue(cause instanceof Error ? cause.message : "Unable to save your Passport.");
      notifyError(cause instanceof Error ? cause.message : "Unable to save your Passport.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={cn("passport-customizer", compact && "passport-customizer--compact")}>
      <div className="passport-customizer__preview">
        <div className="passport-customizer__preview-heading">
          <div>
            <p>Academic Passport</p>
            <h2>One template, made personal.</h2>
          </div>
          {saved && (
            <span>
              <PremiumCheckCircleIcon aria-hidden="true" /> Saved
            </span>
          )}
        </div>
        <AcademicPassportPreview preferences={preferences} identity={identity} />
        <p className="passport-customizer__preview-note">
          Your choices change presentation only. Academic records and results stay the same.
        </p>
      </div>

      <div className="passport-customizer__controls">
        <div className="passport-customizer__heading">
          <div>
            <h2>Customize your Passport</h2>
            <p>Keep it simple or add one personal detail.</p>
          </div>
        </div>

        <PassportIdentityEditor userId={userId} preferences={preferences} onChange={update} />

        <fieldset className="passport-customizer__group">
          <legend>Card color</legend>
          <div className="passport-customizer__swatches">
            {baseColors.map((color) => (
              <OptionButton
                key={color.id}
                selected={preferences.baseColor === color.id}
                title={color.name}
                className="passport-customizer__option--swatch"
                onSelect={() => update({ baseColor: color.id })}
              >
                <i style={{ "--option-swatch": color.swatch } as CSSProperties} />
              </OptionButton>
            ))}
          </div>
        </fieldset>

        <fieldset className="passport-customizer__group">
          <legend>Accent color</legend>
          <div className="passport-customizer__swatches passport-customizer__swatches--compact">
            {accents.map((accent) => (
              <OptionButton
                key={accent.id}
                selected={preferences.accent === accent.id}
                title={accent.name}
                className="passport-customizer__option--swatch"
                onSelect={() => update({ accent: accent.id })}
              >
                <i style={{ "--option-swatch": accent.swatch } as CSSProperties} />
              </OptionButton>
            ))}
          </div>
        </fieldset>

        <div className="passport-customizer__split">
          <fieldset className="passport-customizer__group">
            <legend>Shape</legend>
            <div className="passport-customizer__button-grid">
              {shapes.map((shape) => (
                <OptionButton
                  key={shape.id}
                  selected={preferences.shape === shape.id}
                  title={shape.name}
                  onSelect={() => update({ shape: shape.id })}
                >
                  <i className="passport-shape-sample" data-shape={shape.id} />
                </OptionButton>
              ))}
            </div>
          </fieldset>

          <fieldset className="passport-customizer__group">
            <legend>Cutout</legend>
            <div className="passport-customizer__button-grid">
              {cutouts.map((cutout) => (
                <OptionButton
                  key={cutout.id}
                  selected={preferences.cutout === cutout.id}
                  title={cutout.name}
                  onSelect={() => update({ cutout: cutout.id })}
                >
                  <i className="passport-cutout-sample" data-cutout={cutout.id} />
                </OptionButton>
              ))}
            </div>
          </fieldset>
        </div>

        <fieldset className="passport-customizer__group">
          <legend>Personal mark</legend>
          <div className="passport-customizer__marks">
            {marks.map((mark) => (
              <OptionButton
                key={mark.id}
                selected={preferences.mark === mark.id}
                title={mark.name}
                className="passport-mark-option"
                onSelect={() => update({ mark: mark.id })}
              >
                <i>
                  <MarkPreview mark={mark.id} />
                </i>
              </OptionButton>
            ))}
          </div>
          {preferences.mark === "custom" && (
            <label className="passport-customizer__custom-mark">
              <span>Custom emoji or initials</span>
              <input
                value={preferences.customMark}
                maxLength={12}
                inputMode="text"
                placeholder="Paste an emoji or type initials"
                onChange={(event) =>
                  update({ customMark: sanitizeAcademicPassportMark(event.target.value) })
                }
              />
              <small>Use one emoji or up to four letters.</small>
            </label>
          )}
        </fieldset>

        <fieldset className="passport-customizer__group">
          <legend>Personal text</legend>
          <div className="passport-customizer__fields">
            <label>
              <span>
                Passport title <small>Optional</small>
              </span>
              <input
                value={preferences.title}
                maxLength={46}
                onChange={(event) =>
                  update({ title: sanitizeAcademicPassportText(event.target.value, 46) })
                }
              />
            </label>
            <label>
              <span>
                Personal note <small>Optional</small>
              </span>
              <textarea
                value={preferences.motto}
                maxLength={90}
                rows={2}
                onChange={(event) =>
                  update({ motto: sanitizeAcademicPassportText(event.target.value, 90) })
                }
              />
            </label>
          </div>
        </fieldset>

        {saveIssue && (
          <p className="passport-customizer__error" role="alert">
            {saveIssue}
          </p>
        )}

        <div className="passport-customizer__actions">
          {onReset && (
            <button
              type="button"
              className="passport-customizer__reset"
              onClick={() => {
                void Promise.resolve()
                  .then(() => onReset())
                  .then(() => notifySuccess("Academic Passport reset.", "remove"))
                  .catch((cause) =>
                    notifyError(
                      cause instanceof Error ? cause.message : "Unable to reset your Passport.",
                    ),
                  );
              }}
            >
              <RotateCcw aria-hidden="true" /> Reset
            </button>
          )}
          <button
            type="button"
            className="passport-customizer__save"
            disabled={saving}
            onClick={() => void save()}
          >
            {saving ? "Saving…" : saved ? "Save changes" : "Save Academic Passport"}
            <PremiumCheckCircleIcon aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}

export function getPassportSetupSummary(preferences: AcademicPassportPreferences) {
  const complete = isAcademicPassportComplete(preferences);
  return {
    complete,
    completed: complete ? 4 : preferences.lastCompletedStep,
    total: 4,
    nextAction: complete
      ? "Edit your Passport"
      : preferences.identity.mode === "pori" && preferences.pori.status !== "complete"
        ? "Customize Pori or continue with the default"
        : "Choose your look and save",
  };
}
