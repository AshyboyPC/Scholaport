import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Check,
  ChevronRight,
  Download,
  Eye,
  LogOut,
  Move,
  Save,
  Trash2,
  Type,
  Volume2,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { PassportShell, StatusPill } from "@/components/PassportShell";
import { useAuth } from "@/components/AuthProvider";
import {
  PremiumGlobeIcon,
  PremiumLockIcon,
  PremiumProfileIcon,
  PremiumRoadmapIcon,
  PremiumShieldIcon,
} from "@/components/icons/PremiumIcon";
import { Switch } from "@/components/ui/switch";
import { useInterfacePreferences } from "@/hooks/use-interface-preferences";
import { getMvpProfileUnsupportedReasons } from "@/lib/mvp-reference-scope";
import { notifyError, notifySuccess } from "@/lib/app-feedback";
import { playSaveCue } from "@/lib/rank-sound";
import { upsertCurrentProfile, type StudentProfileInput } from "@/lib/scholaport-api";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Settings · Scholaport" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();
  const { profile, user, refreshProfile, signOut } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<StudentProfileInput | null>(null);
  const { t } = useI18n();
  const { preferences, updatePreference } = useInterfacePreferences(
    profile?.user_id,
    profile?.preferred_language,
  );

  useEffect(() => {
    if (!profile) return;
    setForm({
      first_name: profile.first_name,
      last_name: profile.last_name,
      origin_country: profile.origin_country,
      source_curriculum: profile.source_curriculum,
      destination_country: profile.destination_country,
      target_state: profile.target_state,
      target_district: profile.target_district,
      target_school: profile.target_school,
      target_program: profile.target_program,
      grade_at_transfer: profile.grade_at_transfer,
      expected_graduation_year: profile.expected_graduation_year,
      preferred_language: ["en", "ta", "te", "hi"].includes(profile.preferred_language)
        ? profile.preferred_language
        : "en",
      source_country_id: profile.source_country_id,
      source_jurisdiction_id: profile.source_jurisdiction_id,
      source_curriculum_id: profile.source_curriculum_id,
      destination_country_id: profile.destination_country_id,
      destination_jurisdiction_id: profile.destination_jurisdiction_id,
      destination_framework_id: profile.destination_framework_id,
      destination_program_id: profile.destination_program_id,
      source_jurisdiction_label: profile.source_jurisdiction_label,
      destination_country_label: profile.destination_country_label,
      destination_jurisdiction_label: profile.destination_jurisdiction_label,
      destination_framework_label: profile.destination_framework_label,
      destination_program_label: profile.destination_program_label,
      applicable_cohort: profile.applicable_cohort,
      framework_version_label: profile.framework_version_label,
    });
  }, [profile]);

  if (!profile || !form) return null;
  const name = [profile.first_name, profile.last_name].filter(Boolean).join(" ");
  const initials =
    `${profile.first_name.charAt(0)}${profile.last_name?.charAt(0) ?? ""}`.toUpperCase();
  const unsupportedProfileReasons = getMvpProfileUnsupportedReasons(profile);

  const update = <K extends keyof StudentProfileInput>(key: K, value: StudentProfileInput[K]) => {
    setForm((current) => (current ? { ...current, [key]: value } : current));
  };

  const save = async () => {
    setSaving(true);
    try {
      await upsertCurrentProfile(form);
      await refreshProfile();
      setEditing(false);
      notifySuccess("Settings saved to Scholaport.");
    } catch (cause) {
      notifyError(cause instanceof Error ? cause.message : "Unable to save your settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      await navigate({ to: "/app/login", replace: true });
    } catch (cause) {
      notifyError(cause instanceof Error ? cause.message : "Unable to sign out.");
    }
  };

  return (
    <PassportShell
      eyebrow={t("Settings")}
      title={t("Account, access, and data controls")}
      description={t(
        "Manage your account details, interface preferences, accessibility, and stored academic data.",
      )}
      action={
        <button
          onClick={() => void save()}
          disabled={saving}
          className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#0A175A] px-5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(10,23,90,.16)] disabled:opacity-60"
        >
          <Check className="h-4 w-4" /> {saving ? t("Saving…") : t("Save changes")}
        </button>
      }
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="journey-paper p-5 sm:p-6">
          <div className="flex flex-col gap-4 border-b border-[#E8EBF0] pb-6 sm:flex-row sm:items-center">
            <span className="grid h-20 w-20 place-items-center rounded-[22px] bg-[#0A175A] text-xl font-black text-white">
              {initials}
            </span>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-2xl font-black tracking-[0]">{name}</h2>
                <StatusPill tone="teal">
                  <PremiumShieldIcon className="mr-1 h-3 w-3" /> {t("Authenticated")}
                </StatusPill>
              </div>
              <p className="mt-1 text-sm text-[#5A6380]">{user?.email}</p>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="h-10 rounded-xl border border-[#CDD3DE] px-4 text-xs font-bold"
            >
              {editing ? t("Done editing") : t("Edit profile")}
            </button>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field
              label={t("First name")}
              value={form.first_name}
              editing={editing}
              onChange={(value) => update("first_name", value)}
            />
            <Field
              label={t("Last name")}
              value={form.last_name ?? ""}
              editing={editing}
              onChange={(value) => update("last_name", value || null)}
            />
            <Field label={t("Origin country")} value={form.origin_country} editing={false} />
            <Field
              label={t("Source state")}
              value={form.source_jurisdiction_label ?? ""}
              editing={false}
            />
            <Field label={t("Source curriculum")} value={form.source_curriculum} editing={false} />
            <Field
              label={t("Grade at transfer")}
              value={String(form.grade_at_transfer)}
              editing={editing}
              onChange={(value) => update("grade_at_transfer", Number(value))}
              type="number"
            />
            <Field label={t("Target state")} value={form.target_state} editing={false} />
            <Field
              label={t("Target district")}
              value={form.target_district ?? ""}
              editing={editing}
              onChange={(value) => update("target_district", value || null)}
            />
            <Field
              label={t("Target school")}
              value={form.target_school ?? ""}
              editing={editing}
              onChange={(value) => update("target_school", value || null)}
            />
            <Field
              label={t("Target program")}
              value={form.target_program ?? ""}
              editing={editing}
              onChange={(value) => update("target_program", value || null)}
            />
            <Field
              label={t("Expected graduation")}
              value={form.expected_graduation_year ? String(form.expected_graduation_year) : ""}
              editing={editing}
              onChange={(value) => update("expected_graduation_year", value ? Number(value) : null)}
              type="number"
            />
          </div>
          <p className="mt-4 rounded-2xl border border-[#CDD3DE]/70 bg-[#F6F8FB] p-4 text-xs leading-5 text-[#5A6380]">
            {t(
              "Source and destination frameworks are changed through onboarding so saved transcript mappings cannot silently switch to a different academic route.",
            )}
          </p>
          {unsupportedProfileReasons.length > 0 && (
            <div className="mt-4 rounded-2xl border border-[#F86746]/20 bg-[#F86746]/[0.06] p-4 text-xs leading-5 text-[#5A6380]">
              <p className="font-bold text-[#0A175A]">This profile is outside the MVP scope.</p>
              <ul className="mt-2 list-disc space-y-1 pl-4">
                {unsupportedProfileReasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
              <Link
                to="/app/onboarding"
                className="mt-3 inline-flex h-9 items-center rounded-xl border border-[#CDD3DE] bg-white px-3 text-xs font-bold text-[#0A175A]"
              >
                Reselect MVP route
              </Link>
            </div>
          )}
        </section>

        <aside className="space-y-5">
          <section className="rounded-[28px] bg-[#0A175A] p-5 text-white">
            <div className="flex items-center gap-3">
              <PremiumRoadmapIcon className="h-5 w-5 text-[#01C3AD]" />
              <div>
                <p className="text-sm font-bold">{t("Academic route")}</p>
                <p className="text-[10px] text-white/45">{t("Stored in your account")}</p>
              </div>
            </div>
            <div className="mt-5 space-y-4">
              <RouteItem
                title={`${profile.source_curriculum} · ${profile.origin_country}`}
                detail={profile.source_jurisdiction_label ?? "Source state not selected"}
              />
              <span className="ml-5 block h-5 w-px bg-white/15" />
              <RouteItem
                title={`${profile.target_state}, ${profile.destination_country}`}
                detail={
                  profile.target_school || profile.target_district || "Target school not added"
                }
              />
            </div>
          </section>
          <section className="rounded-[22px] border border-[#CDD3DE]/70 bg-white p-5">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Save className="h-4 w-4 text-[#019A8A]" /> {t("Saved data")}
            </div>
            <p className="mt-2 text-xs leading-5 text-[#5A6380]">
              {t(
                "Profile, Passport, Pori, transcript, mapping, gap, roadmap, and packet records sync to your account when their actions are saved.",
              )}
            </p>
          </section>
          <Link
            to="/app/profile"
            className="flex min-h-12 items-center gap-3 rounded-[18px] border border-[#CDD3DE] bg-white px-4 text-xs font-black text-[#0A175A]"
          >
            <PremiumProfileIcon className="h-5 w-5 text-[#01A995]" />
            {t("Open profile and rank route")}
            <ChevronRight className="ml-auto h-4 w-4" />
          </Link>
        </aside>
      </div>

      <section className="mt-5 grid gap-5 lg:grid-cols-2">
        <SettingsCard title={t("Preferences")} icon={<PremiumGlobeIcon />}>
          <SettingRow
            icon={<PremiumGlobeIcon />}
            title={t("Language")}
            detail={t("Stored with your profile")}
            action={
              <select
                value={form.preferred_language}
                onChange={(event) => {
                  const language = event.target.value as "en" | "ta" | "te" | "hi";
                  update("preferred_language", language);
                  updatePreference("language", language);
                }}
                className="h-9 rounded-lg border border-[#CDD3DE] bg-white px-2 text-xs font-bold"
              >
                <option value="en">English</option>
                <option value="ta">தமிழ்</option>
                <option value="te">తెలుగు</option>
                <option value="hi">हिन्दी</option>
              </select>
            }
          />
          <ToggleRow
            icon={<Volume2 />}
            title={t("Sound effects")}
            detail={t("Automatic cues for earned ranks and successful saves")}
            checked={preferences.soundEffects}
            onCheckedChange={(checked) => {
              updatePreference("soundEffects", checked);
              if (checked) playSaveCue();
            }}
          />
        </SettingsCard>

        <SettingsCard title={t("Accessibility")} icon={<Eye />}>
          <ToggleRow
            icon={<Move />}
            title={t("Reduce motion")}
            detail={t("Stops rank, Pori, and transition animation")}
            checked={preferences.reduceMotion}
            onCheckedChange={(checked) => updatePreference("reduceMotion", checked)}
          />
          <SettingRow
            icon={<Type />}
            title={t("Text size")}
            detail={`${Math.round(preferences.textScale * 100)}% · ${t("Applies across every page")}`}
            action={
              <label className="settings-text-scale">
                <span aria-hidden="true">A</span>
                <input
                  aria-label={t("Text size")}
                  type="range"
                  min="0.9"
                  max="1.3"
                  step="0.05"
                  value={preferences.textScale}
                  onInput={(event) =>
                    updatePreference("textScale", Number(event.currentTarget.value))
                  }
                />
                <strong aria-hidden="true">A</strong>
              </label>
            }
          />
          <ToggleRow
            icon={<Eye />}
            title={t("Enhanced contrast")}
            detail={t("Strengthens borders and surface separation")}
            checked={preferences.enhancedContrast}
            onCheckedChange={(checked) => updatePreference("enhancedContrast", checked)}
          />
        </SettingsCard>

        <SettingsCard
          title={t("Privacy & data")}
          icon={<PremiumLockIcon />}
          className="lg:col-span-2"
        >
          <SettingRow
            icon={<PremiumShieldIcon />}
            title={t("Private workspace")}
            detail={t("Your account records are protected by row-level access policies")}
            action={<StatusPill tone="teal">{t("Active")}</StatusPill>}
          />
          <SettingRow
            icon={<Download />}
            title={t("Export my data")}
            detail={t("Secure account export is not available in this release")}
            action={
              <span className="text-[10px] font-bold text-[#9AA3B2]">{t("Unavailable")}</span>
            }
          />
          <SettingRow
            icon={<Trash2 />}
            title={t("Delete account")}
            detail={t("Requires a secure server-side deletion endpoint")}
            dangerous
            action={
              <span className="text-[10px] font-bold text-[#9AA3B2]">{t("Unavailable")}</span>
            }
          />
        </SettingsCard>
      </section>

      <div className="mt-5 flex justify-end">
        {import.meta.env.DEV && (
          <Link
            to="/app/reference-coverage"
            className="mr-auto inline-flex h-10 items-center rounded-xl border border-[#CDD3DE] bg-white px-4 text-xs font-bold"
          >
            {t("Reference coverage")}
          </Link>
        )}
        <button
          onClick={() => void handleSignOut()}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#CDD3DE] bg-white px-4 text-xs font-bold"
        >
          <LogOut className="h-4 w-4" /> {t("Sign out")}
        </button>
      </div>
    </PassportShell>
  );
}

function Field({
  label,
  value,
  editing,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange?: (value: string) => void;
  type?: "text" | "number";
}) {
  return (
    <label>
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#9AA3B2]">
        {label}
      </span>
      <input
        disabled={!editing}
        type={type}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="h-11 w-full rounded-xl border border-[#CDD3DE] bg-[#F6F8FB] px-3 text-sm font-semibold outline-none enabled:bg-white enabled:focus:border-[#01C3AD] disabled:opacity-80"
      />
    </label>
  );
}

function RouteItem({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10">
        <PremiumRoadmapIcon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="text-[10px] text-white/45">{detail}</p>
      </div>
    </div>
  );
}

function SettingsCard({
  title,
  icon,
  children,
  className,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`schola-record-surface border border-[#CDD3DE]/70 bg-white p-5 shadow-card ${className ?? ""}`}
    >
      <div className="mb-3 flex items-center gap-2 text-sm font-bold [&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-[#019A8A]">
        {icon}
        {title}
      </div>
      <div className="divide-y divide-[#E8EBF0]">{children}</div>
    </section>
  );
}

function SettingRow({
  icon,
  title,
  detail,
  action,
  dangerous = false,
}: {
  icon: ReactNode;
  title: string;
  detail: string;
  action: ReactNode;
  dangerous?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      <span
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl [&>svg]:h-4 [&>svg]:w-4 ${dangerous ? "bg-[#F86746]/10 text-[#F86746]" : "bg-[#F6F8FB] text-[#0A175A]"}`}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className={`text-xs font-bold ${dangerous ? "text-[#E65234]" : ""}`}>{title}</p>
        <p className="mt-0.5 text-[10px] leading-4 text-[#8A94A6]">{detail}</p>
      </div>
      {action}
    </div>
  );
}

function ToggleRow({
  checked,
  onCheckedChange,
  ...row
}: {
  icon: ReactNode;
  title: string;
  detail: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <SettingRow
      {...row}
      action={
        <Switch
          checked={checked}
          onCheckedChange={onCheckedChange}
          aria-label={row.title}
          className="h-6 w-11 data-[state=checked]:bg-[#01A995] data-[state=unchecked]:bg-[#CDD3DE] [&>span]:h-5 [&>span]:w-5 [&>span]:data-[state=checked]:translate-x-5"
        />
      }
    />
  );
}
