import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { PassportShell } from "@/components/PassportShell";
import {
  AcademicPassportBuilder,
  getPassportSetupSummary,
} from "@/components/passport/AcademicPassport";
import { PoriAvatar } from "@/components/pori/PoriAvatar";
import { AcademicRankRoute } from "@/components/profile/AcademicRankRoute";
import { useAuth } from "@/components/AuthProvider";
import { useAcademicPassportPreferences } from "@/hooks/use-academic-passport";
import { useAcademicRank } from "@/hooks/use-academic-rank";
import { useInterfacePreferences } from "@/hooks/use-interface-preferences";
import { isAcademicPassportComplete } from "@/lib/academic-passport";
import { parseAcademicRankMetrics } from "@/lib/academic-rank-api";
import { calculateAcademicRank, deriveAcademicRankInput } from "@/lib/academic-ranks";
import { DEFAULT_PORI_PREFERENCES, isPoriComplete, poriAsset } from "@/lib/pori";
import { playRankCue } from "@/lib/rank-sound";
import { notifyError, notifySuccess } from "@/lib/app-feedback";
import {
  getCreditMappings,
  getLatestCounselorPacket,
  getPassportSummary,
  getRoadmap,
  getTranscriptCourses,
} from "@/lib/scholaport-api";

export const Route = createFileRoute("/app/profile")({
  head: () => ({
    meta: [
      { title: "Profile & Ranks · Scholaport" },
      {
        name: "description",
        content: "Your academic rank route, Pori companion, and Academic Passport.",
      },
    ],
  }),
  component: AcademicProfilePage,
});

function AcademicProfilePage() {
  const { profile } = useAuth();
  const { preferences, setPreferences, resetPreferences } = useAcademicPassportPreferences(
    profile?.user_id,
  );
  const { preferences: interfacePreferences } = useInterfacePreferences(profile?.user_id);
  const rankQuery = useAcademicRank(profile?.user_id);
  const summaryQuery = useQuery({ queryKey: ["passport-summary"], queryFn: getPassportSummary });
  const coursesQuery = useQuery({
    queryKey: ["transcript-courses"],
    queryFn: getTranscriptCourses,
  });
  const mappingsQuery = useQuery({ queryKey: ["credit-mappings"], queryFn: getCreditMappings });
  const roadmapQuery = useQuery({ queryKey: ["roadmap"], queryFn: getRoadmap });
  const packetQuery = useQuery({
    queryKey: ["counselor-packet"],
    queryFn: getLatestCounselorPacket,
  });

  const courses = coursesQuery.data ?? roadmapQuery.data?.transcriptCourses ?? [];
  const mappings = mappingsQuery.data ?? roadmapQuery.data?.creditMappings ?? [];
  const roadmapItems = roadmapQuery.data?.items ?? summaryQuery.data?.roadmapItems ?? [];
  const derivedRankInput = deriveAcademicRankInput({
    profile,
    passportComplete: isAcademicPassportComplete(preferences),
    poriComplete: isPoriComplete(preferences.pori),
    transcript: summaryQuery.data?.transcript ?? roadmapQuery.data?.transcript,
    courses,
    mappings,
    gapAnalysis: roadmapQuery.data?.gapAnalysis ?? summaryQuery.data?.gapAnalysis,
    gapRequirements: roadmapQuery.data?.gapRequirements ?? summaryQuery.data?.gapRequirements ?? [],
    roadmap: roadmapQuery.data?.roadmap ?? summaryQuery.data?.roadmap,
    roadmapItems,
    packet: packetQuery.data?.packet,
  });
  const backendRankInput = parseAcademicRankMetrics(rankQuery.data?.metrics);
  const rankProgress = calculateAcademicRank(
    backendRankInput ?? derivedRankInput,
    rankQuery.data?.current_level,
  );
  const passportSetup = getPassportSetupSummary(preferences);
  const progressLoading =
    summaryQuery.isLoading ||
    coursesQuery.isLoading ||
    mappingsQuery.isLoading ||
    roadmapQuery.isLoading ||
    packetQuery.isLoading ||
    rankQuery.isLoading;
  const currentRankLevel = rankProgress.current.level;

  useEffect(() => {
    if (!profile?.user_id || progressLoading || typeof window === "undefined") return;
    const key = `scholaport:last-seen-rank:v1:${profile.user_id}`;
    const previousValue = window.localStorage.getItem(key);
    const previousLevel = previousValue === null ? null : Number(previousValue);
    window.localStorage.setItem(key, String(currentRankLevel));

    if (
      previousLevel !== null &&
      Number.isFinite(previousLevel) &&
      currentRankLevel > previousLevel &&
      interfacePreferences.soundEffects
    ) {
      playRankCue(currentRankLevel);
    }
  }, [interfacePreferences.soundEffects, profile?.user_id, progressLoading, currentRankLevel]);

  if (!profile) return null;
  const name = [profile.first_name, profile.last_name].filter(Boolean).join(" ");

  return (
    <PassportShell
      eyebrow="Profile"
      title={`${name}'s academic passage`}
      description="Follow your real planning progress, shape your companion, and keep your Academic Passport personal."
    >
      {progressLoading ? (
        <div className="academic-rank-loading" aria-live="polite">
          <span />
          Calculating your rank from saved academic records…
        </div>
      ) : (
        <AcademicRankRoute progress={rankProgress} backendSynced={Boolean(backendRankInput)} />
      )}

      <section id="pori-companion" className="profile-customization-section rank-task-target">
        <div className="profile-customization-heading">
          <div>
            <p className="journey-eyebrow">My Pori</p>
            <h2>Your companion for the route.</h2>
          </div>
          <Link to="/app/pori">
            {preferences.pori.status === "complete" ? "Edit Pori" : "Customize Pori"}
          </Link>
        </div>
        <div className="my-pori-settings">
          <div className="my-pori-settings__preview">
            <PoriAvatar preferences={preferences.pori} context="mobile" />
          </div>
          <div className="my-pori-settings__content">
            <h3>
              {preferences.pori.status === "complete"
                ? "Pori is ready to travel with you."
                : "Finish creating your Pori."}
            </h3>
            <dl>
              <div>
                <dt>Style</dt>
                <dd>{poriAsset("base", preferences.pori.baseStyle)?.name}</dd>
              </div>
              <div>
                <dt>Expression</dt>
                <dd>{preferences.pori.expression}</dd>
              </div>
              <div>
                <dt>Head</dt>
                <dd>{poriAsset("head", preferences.pori.headAccessory)?.name ?? "None"}</dd>
              </div>
              <div>
                <dt>Accessory</dt>
                <dd>
                  {poriAsset("secondary", preferences.pori.secondaryAccessory)?.name ?? "None"}
                </dd>
              </div>
            </dl>
            <div>
              <Link to="/app/pori" className="my-pori-settings__edit">
                {preferences.pori.status === "complete" ? "Edit Pori" : "Start customizing"}
              </Link>
              <button
                type="button"
                onClick={() => {
                  void setPreferences({
                    ...preferences,
                    pori: structuredClone(DEFAULT_PORI_PREFERENCES),
                  })
                    .then(() => notifySuccess("Pori reset.", "remove"))
                    .catch((cause) =>
                      notifyError(cause instanceof Error ? cause.message : "Unable to reset Pori."),
                    );
                }}
              >
                Reset Pori
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
        id="academic-passport-builder"
        className="profile-customization-section rank-task-target"
        aria-labelledby="passport-builder-title"
      >
        <div className="profile-customization-heading">
          <div>
            <p className="journey-eyebrow">Academic Passport</p>
            <h2 id="passport-builder-title">Your identity for the journey.</h2>
          </div>
          <span>
            {passportSetup.complete
              ? "Saved"
              : `${passportSetup.completed} of ${passportSetup.total} steps`}
          </span>
        </div>
        <AcademicPassportBuilder
          userId={profile.user_id}
          preferences={preferences}
          onChange={setPreferences}
          onReset={resetPreferences}
          identity={{
            name,
            source: profile.source_curriculum,
            sourceDetail: profile.source_jurisdiction_label ?? profile.origin_country,
            destination: profile.destination_framework_label ?? profile.target_state,
            destinationDetail:
              profile.destination_jurisdiction_label ?? profile.destination_country,
            grade: profile.grade_at_transfer,
            classYear: profile.expected_graduation_year,
            status: "Profile current",
          }}
        />
        <p className="profile-customization-note">
          Your selections sync to your account. This personal Passport is a planning view, not an
          official academic or travel document.
        </p>
      </section>
    </PassportShell>
  );
}
