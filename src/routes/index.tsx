import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ChevronRight } from "lucide-react";
import { PassportShell, StatusPill } from "@/components/PassportShell";
import {
  PremiumAdvisorIcon,
  PremiumPacketIcon,
  PremiumPathMatchIcon,
  PremiumRoadmapIcon,
  PremiumShieldIcon,
  PremiumTranscriptIcon,
} from "@/components/icons/PremiumIcon";
import { RequirementStructure, RouteCheckpoint } from "@/components/journey/JourneyVisuals";
import { AcademicPassportPreview } from "@/components/passport/AcademicPassport";
import { useAcademicPassportPreferences } from "@/hooks/use-academic-passport";
import { getPassportSummary } from "@/lib/scholaport-api";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Academic Passport · Scholaport" },
      {
        name: "description",
        content:
          "See your translated credits, graduation gaps, and next steps in one student-owned academic passport.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { t } = useI18n();
  const passportQuery = useQuery({ queryKey: ["passport-summary"], queryFn: getPassportSummary });
  const { preferences: passportPreferences } = useAcademicPassportPreferences(
    passportQuery.data?.profile.user_id,
  );

  if (passportQuery.isLoading) {
    return (
      <PassportShell eyebrow="Academic passport" title="Loading your passport…">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,.75fr)]">
          <div className="h-[420px] animate-pulse rounded-[24px] bg-[#0A175A]/10" />
          <div className="h-[420px] animate-pulse rounded-[24px] bg-white shadow-card" />
        </div>
      </PassportShell>
    );
  }

  if (passportQuery.error || !passportQuery.data) {
    return (
      <PassportShell eyebrow="Academic passport" title="Your passport could not be loaded">
        <ErrorCard
          message={
            passportQuery.error instanceof Error
              ? passportQuery.error.message
              : "Unknown data error."
          }
        />
      </PassportShell>
    );
  }

  const { profile, transcript, gapAnalysis, gapRequirements, roadmapItems } = passportQuery.data;
  const name = [profile.first_name, profile.last_name].filter(Boolean).join(" ");
  const earned = gapAnalysis?.total_credits_mapped ?? 0;
  const required = gapAnalysis?.total_credits_required ?? 0;
  const percent = required > 0 ? Math.min(100, Math.round((earned / required) * 100)) : 0;
  const missingCount = gapRequirements.filter((item) => item.status !== "satisfied").length;
  const satisfiedCount = gapRequirements.filter((item) => item.status === "satisfied").length;
  const partialCount = gapRequirements.filter(
    (item) => item.status === "partially_satisfied",
  ).length;
  const passportStatus = transcript
    ? gapAnalysis
      ? `${missingCount} requirement ${missingCount === 1 ? "area" : "areas"} to review`
      : "Transcript ready for gap analysis"
    : "Transcript is the next step";

  return (
    <PassportShell>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(330px,.72fr)]">
        <section className="academic-passport-hero">
          <div className="academic-passport-hero__copy">
            <p className="journey-eyebrow">
              {t("Good afternoon, {name} · Academic Passport", { name: profile.first_name })}
            </p>
            <h2>{t("Your journey, organized around you.")}</h2>
            <p>
              {t(
                "Here’s what has been recorded, what still needs attention, and the clearest next step.",
              )}
              <span className="mt-2 block text-xs font-bold text-[#0A175A]/58">
                {name} · Grade {profile.grade_at_transfer} · Class of{" "}
                {profile.expected_graduation_year ?? "not set"}
              </span>
            </p>
            <div className="academic-passport-hero__route">
              <div>
                <span>{t("Origin")}</span>
                <strong>{profile.source_curriculum}</strong>
              </div>
              <ArrowRight aria-hidden="true" />
              <div>
                <span>{t("Destination")}</span>
                <strong>{profile.destination_framework_label ?? profile.target_state}</strong>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusPill tone="navy">
                <PremiumShieldIcon className="mr-1 h-3 w-3" /> {t("Private profile")}
              </StatusPill>
              <StatusPill tone={transcript ? "mint" : "yellow"}>{passportStatus}</StatusPill>
            </div>
            <Link
              to="/packet"
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0A175A] px-4 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(10,23,90,.18)] transition hover:bg-[#1A2B7A]"
            >
              <PremiumPacketIcon className="h-4 w-4" /> {t("Build counselor packet")}
            </Link>
          </div>
          <div className="academic-passport-hero__visual">
            <AcademicPassportPreview
              preferences={passportPreferences}
              identity={{
                name,
                source: profile.source_curriculum,
                sourceDetail: profile.source_jurisdiction_label ?? profile.origin_country,
                destination: profile.destination_framework_label ?? profile.target_state,
                destinationDetail:
                  profile.destination_jurisdiction_label ?? profile.destination_country,
                grade: profile.grade_at_transfer,
                classYear: profile.expected_graduation_year,
                status: passportStatus,
              }}
            />
          </div>
        </section>

        <section className="journey-paper flex flex-col p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="journey-eyebrow !text-[#59647A] !opacity-100">
                {t("Graduation progress")}
              </p>
              <h2 className="font-display text-2xl font-bold tracking-[-0.04em]">
                {gapAnalysis ? t("Recorded analysis") : t("No analysis yet")}
              </h2>
            </div>
            {missingCount > 0 && <StatusPill tone="coral">{missingCount} gaps</StatusPill>}
          </div>
          <div className="mt-7 flex items-center gap-5">
            <ProgressRing percent={percent} />
            <div>
              <p className="text-3xl font-black tracking-[-0.04em] text-[#0A175A]">
                {earned}
                <span className="text-base font-semibold text-[#9AA3B2]"> / {required || "—"}</span>
              </p>
              <p className="mt-1 text-sm text-[#5A6380]">{t("mapped credits")}</p>
            </div>
          </div>
          {gapRequirements.length > 0 && (
            <div className="mt-6">
              <RequirementStructure
                satisfied={satisfiedCount}
                partial={partialCount}
                missing={Math.max(0, gapRequirements.length - satisfiedCount - partialCount)}
                label={`${satisfiedCount} satisfied, ${partialCount} partial, and ${Math.max(0, gapRequirements.length - satisfiedCount - partialCount)} missing requirement sections`}
              />
            </div>
          )}
          <div className="mt-6 space-y-3 border-t border-[#E8EBF0] pt-5">
            {gapRequirements.length === 0 ? (
              <p className="text-sm leading-6 text-[#5A6380]">
                {t("Upload a transcript and create a gap analysis to see verified progress.")}
              </p>
            ) : (
              gapRequirements.slice(0, 4).map((item) => {
                const itemPercent =
                  item.credits_required > 0
                    ? Math.min(100, (item.credits_mapped / item.credits_required) * 100)
                    : 0;
                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-[92px_1fr_auto] items-center gap-3 text-xs"
                  >
                    <span className="truncate font-semibold">{item.subject_category}</span>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#E8EBF0]">
                      <div
                        className="h-full rounded-full bg-[#01C3AD]"
                        style={{ width: `${itemPercent}%` }}
                      />
                    </div>
                    <span className="font-bold text-[#5A6380]">
                      {item.credits_mapped}/{item.credits_required}
                    </span>
                  </div>
                );
              })
            )}
          </div>
          <Link
            to="/gaps"
            className="mt-auto flex min-h-12 items-center justify-between rounded-2xl bg-[#0A175A] px-4 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(10,23,90,.16)] transition hover:-translate-y-0.5"
          >
            {t("Open gap analysis")} <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>

      <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-[1.25fr_.9fr_.8fr]">
        <QuickAction
          to="/transcript"
          icon={<PremiumTranscriptIcon />}
          eyebrow="Transcript"
          title={
            transcript
              ? transcript.original_filename || "Transcript uploaded"
              : "Upload your transcript"
          }
          body={
            transcript
              ? `Status: ${transcript.upload_status}`
              : "No transcript is stored for this passport yet."
          }
          tone="teal"
        />
        <QuickAction
          to="/roadmap"
          icon={<PremiumRoadmapIcon />}
          eyebrow="Next checkpoint"
          title={roadmapItems[0]?.title ?? "No roadmap yet"}
          body={
            roadmapItems[0]?.description ??
            "Your roadmap will appear after a gap analysis is created."
          }
          tone="coral"
        />
        <QuickAction
          to="/advisor"
          icon={<PremiumAdvisorIcon />}
          eyebrow="Advisor"
          title="Coming soon"
          body="The AI Advisor will unlock after it can answer from real saved transcript, mapping, gap, roadmap, and packet data."
          tone="navy"
        />
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,.8fr)]">
        <section className="journey-paper p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#9AA3B2]">
                {t("Your route forward")}
              </p>
              <h2 className="mt-1.5 font-display text-xl font-bold tracking-[-0.03em]">
                {t("Next checkpoints")}
              </h2>
            </div>
            <Link to="/roadmap" className="text-sm font-bold text-[#019A8A]">
              {t("Open roadmap")}
            </Link>
          </div>
          <div className="mt-6">
            {roadmapItems.length === 0 ? (
              <p className="rounded-xl bg-[#F6F8FB] p-4 text-sm text-[#5A6380]">
                {t("No roadmap items have been created for this passport.")}
              </p>
            ) : (
              roadmapItems
                .slice(0, 3)
                .map((item, index) => (
                  <RouteCheckpoint
                    key={item.id}
                    index={index + 1}
                    active={index === 0 && item.status !== "completed"}
                    complete={item.status === "completed"}
                    last={index === Math.min(roadmapItems.length, 3) - 1}
                    title={item.title}
                    detail={`${item.description} · ${item.semester_target}`}
                  />
                ))
            )}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[30px] bg-[#FFE1D8] p-5 shadow-[0_18px_50px_rgba(10,23,90,.08)] sm:p-7">
          <PremiumPathMatchIcon className="absolute right-6 top-6 h-7 w-7 text-[#F86746]" />
          <p className="journey-eyebrow !text-[#C7462D] !opacity-100">PathMatch</p>
          <h2 className="mt-2 max-w-xs font-display text-2xl font-bold leading-8 tracking-[-0.04em]">
            {t("Coming soon")}
          </h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-[#5A6380]">
            Verified, anonymized transfer paths will appear only after the consent, moderation, and
            evidence pipeline is ready.
          </p>
          <Link
            to="/pathmatch"
            className="relative mt-6 inline-flex h-11 items-center gap-2 rounded-2xl bg-[#0A175A] px-4 text-sm font-bold text-white shadow-[0_8px_20px_rgba(10,23,90,.16)]"
          >
            {t("Explore paths")} <ChevronRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </PassportShell>
  );
}

function ProgressRing({ percent }: { percent: number }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#E8EBF0" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#01C3AD"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - percent / 100)}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-xl font-black">
        {percent}%
      </span>
    </div>
  );
}

function QuickAction({
  to,
  icon,
  eyebrow,
  title,
  body,
  tone,
}: {
  to: string;
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  body: string;
  tone: "teal" | "coral" | "navy";
}) {
  const { t } = useI18n();
  const colors = {
    teal: {
      card: "bg-[#DFF8F1] border-[#BFEBDD]",
      icon: "bg-[#01C3AD] text-[#07113F]",
    },
    coral: {
      card: "bg-white border-[#F2D7D0]",
      icon: "bg-[#F86746] text-[#07113F]",
    },
    navy: {
      card: "bg-[#0A175A] border-[#0A175A] text-white",
      icon: "bg-white/12 text-[#42D8D0]",
    },
  };
  return (
    <Link
      to={to}
      className={`group flex min-h-40 items-start gap-4 rounded-[26px] border p-5 shadow-[0_16px_38px_rgba(10,23,90,.07)] transition duration-300 hover:-translate-y-1 ${colors[tone].card}`}
    >
      <span
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-[16px_16px_22px_16px] shadow-[inset_0_2px_rgba(255,255,255,.3),0_7px_14px_rgba(10,23,90,.12)] [&>svg]:h-5 [&>svg]:w-5 ${colors[tone].icon}`}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span
          className={`text-[10px] font-bold uppercase tracking-[0.15em] ${tone === "navy" ? "text-white/45" : "text-[#83909D]"}`}
        >
          {t(eyebrow)}
        </span>
        <span className="mt-1 block text-base font-bold">{t(title)}</span>
        <span
          className={`mt-1.5 block text-xs leading-5 ${tone === "navy" ? "text-white/58" : "text-[#59647A]"}`}
        >
          {t(body)}
        </span>
      </span>
      <ChevronRight
        className={`ml-auto mt-2 h-4 w-4 shrink-0 transition group-hover:translate-x-0.5 ${tone === "navy" ? "text-white/35 group-hover:text-[#42D8D0]" : "text-[#B8C2C3] group-hover:text-[#01A995]"}`}
      />
    </Link>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="rounded-[24px] border border-[#F86746]/30 bg-white p-6 text-sm leading-6 text-[#5A6380] shadow-card">
      {message}
    </div>
  );
}
