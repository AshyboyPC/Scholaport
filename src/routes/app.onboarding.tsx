import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Check, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { ScholaportLogo } from "@/components/ScholaportLogo";
import { useAuth } from "@/components/AuthProvider";
import {
  PremiumGraduationIcon,
  PremiumPathMatchIcon,
  PremiumSourceFileIcon,
  PremiumTemplateIcon,
} from "@/components/icons/PremiumIcon";
import { ClayScene } from "@/components/journey/JourneyVisuals";
import { AcademicPassportBuilder } from "@/components/passport/AcademicPassport";
import {
  isAcademicPassportComplete,
  type AcademicPassportPreferences,
} from "@/lib/academic-passport";
import { useAcademicPassportPreferences } from "@/hooks/use-academic-passport";
import { useInterfacePreferences } from "@/hooks/use-interface-preferences";
import { notifyError, notifySuccess } from "@/lib/app-feedback";
import { upsertCurrentProfile } from "@/lib/scholaport-api";
import {
  filterMvpDestinationFrameworks,
  filterMvpDestinationJurisdictions,
  filterMvpSourceCurricula,
  filterMvpSourceJurisdictions,
  getMvpDestinationCountryAvailability,
  getMvpProfileUnsupportedReasons,
  getMvpSourceCountryAvailability,
  getDestinationScopeNote,
  isMvpSelectableDestinationCountry,
  isMvpSelectableSourceCountry,
} from "@/lib/mvp-reference-scope";
import {
  getCurricula,
  getDestinationCountries,
  getDestinationFrameworks,
  getEducationPrograms,
  getJurisdictions,
  getSourceCountries,
  type DestinationFramework,
} from "@/lib/reference-api";

export const Route = createFileRoute("/app/onboarding")({
  head: () => ({ meta: [{ title: "Create your passport · Scholaport" }] }),
  component: Onboarding,
});

const OTHER_OPTION = "__other__";

function Onboarding() {
  const navigate = useNavigate();
  const { user, profile, refreshProfile, signOut } = useAuth();
  const currentYear = new Date().getFullYear();
  const graduationYearOptions = Array.from({ length: 10 }, (_, index) => currentYear + index);
  const sourceCountries = useQuery({ queryKey: ["source-countries"], queryFn: getSourceCountries });
  const destinationCountries = useQuery({
    queryKey: ["destination-countries"],
    queryFn: getDestinationCountries,
  });
  const [step, setStep] = useState(0);
  const [sourceCountryId, setSourceCountryId] = useState("");
  const [sourceJurisdictionId, setSourceJurisdictionId] = useState("");
  const [sourceCurriculumId, setSourceCurriculumId] = useState("");
  const [selfReportedCurriculum, setSelfReportedCurriculum] = useState("");
  const [destinationCountryId, setDestinationCountryId] = useState("");
  const [destinationJurisdictionId, setDestinationJurisdictionId] = useState("");
  const [destinationFrameworkId, setDestinationFrameworkId] = useState("");
  const [district, setDistrict] = useState("");
  const [school, setSchool] = useState("");
  const [programId, setProgramId] = useState("");
  const [selfReportedProgram, setSelfReportedProgram] = useState("");
  const [grade, setGrade] = useState("11");
  const [graduationYear, setGraduationYear] = useState(String(currentYear + 1));
  const [language, setLanguage] = useState(profile?.preferred_language ?? "en");
  const { updatePreference: updateInterfacePreference } = useInterfacePreferences(
    user?.id,
    profile?.preferred_language,
  );
  const { preferences: passportPreferences, setPreferences: updatePassportPreferences } =
    useAcademicPassportPreferences(user?.id);
  const [firstName, setFirstName] = useState(
    profile?.first_name ??
      (user?.user_metadata.first_name
        ? String(user.user_metadata.first_name)
        : user?.user_metadata.given_name
          ? String(user.user_metadata.given_name)
          : user?.user_metadata.full_name
            ? String(user.user_metadata.full_name).split(" ")[0]
            : ""),
  );
  const [lastName, setLastName] = useState(
    profile?.last_name ??
      (user?.user_metadata.last_name
        ? String(user.user_metadata.last_name)
        : user?.user_metadata.family_name
          ? String(user.user_metadata.family_name)
          : ""),
  );
  const [saving, setSaving] = useState(false);
  const unsupportedProfileReasons = profile ? getMvpProfileUnsupportedReasons(profile) : [];

  useEffect(() => {
    if (!sourceCountryId) {
      const defaultSourceCountry = sourceCountries.data?.find((country) =>
        isMvpSelectableSourceCountry(country.iso3),
      );
      if (defaultSourceCountry) setSourceCountryId(defaultSourceCountry.id);
    }
  }, [sourceCountries.data, sourceCountryId]);
  useEffect(() => {
    if (!destinationCountryId) {
      const defaultDestinationCountry = destinationCountries.data?.find((country) =>
        isMvpSelectableDestinationCountry(country.iso3),
      );
      if (defaultDestinationCountry) setDestinationCountryId(defaultDestinationCountry.id);
    }
  }, [destinationCountries.data, destinationCountryId]);
  const sourceJurisdictions = useQuery({
    queryKey: ["source-jurisdictions", sourceCountryId],
    queryFn: () => getJurisdictions(sourceCountryId),
    enabled: Boolean(sourceCountryId),
  });
  const curricula = useQuery({
    queryKey: ["curricula", sourceCountryId, sourceJurisdictionId],
    queryFn: () => getCurricula(sourceCountryId, sourceJurisdictionId),
    enabled: Boolean(sourceCountryId && sourceJurisdictionId),
  });
  const jurisdictions = useQuery({
    queryKey: ["jurisdictions", destinationCountryId],
    queryFn: () => getJurisdictions(destinationCountryId),
    enabled: Boolean(destinationCountryId),
  });
  const frameworks = useQuery({
    queryKey: [
      "destination-frameworks",
      destinationCountryId,
      destinationJurisdictionId,
      graduationYear,
    ],
    queryFn: () =>
      getDestinationFrameworks(
        destinationCountryId,
        destinationJurisdictionId,
        Number(graduationYear),
      ),
    enabled: Boolean(destinationCountryId && destinationJurisdictionId),
  });
  const programs = useQuery({
    queryKey: [
      "education-programs",
      destinationCountryId,
      destinationJurisdictionId,
      destinationFrameworkId,
    ],
    queryFn: () =>
      getEducationPrograms(destinationCountryId, destinationJurisdictionId, destinationFrameworkId),
    enabled: Boolean(destinationCountryId && destinationJurisdictionId),
  });

  const sourceCountryOptions = sourceCountries.data ?? [];
  const destinationCountryOptions = destinationCountries.data ?? [];
  const sourceCountry = sourceCountryOptions.find((country) => country.id === sourceCountryId);
  const sourceJurisdictionOptions = filterMvpSourceJurisdictions(
    sourceJurisdictions.data ?? [],
    sourceCountry?.iso3,
  );
  const sourceJurisdiction = sourceJurisdictionOptions.find(
    (item) => item.id === sourceJurisdictionId,
  );
  const sourceCurriculumOptions = filterMvpSourceCurricula(
    curricula.data ?? [],
    sourceJurisdiction,
  );
  const selectedCurriculum = sourceCurriculumOptions.find((item) => item.id === sourceCurriculumId);
  const destinationCountry = destinationCountries.data?.find(
    (country) => country.id === destinationCountryId,
  );
  const destinationJurisdictionOptions = filterMvpDestinationJurisdictions(
    jurisdictions.data ?? [],
    destinationCountry?.iso3,
  );
  const destinationJurisdiction = destinationJurisdictionOptions.find(
    (item) => item.id === destinationJurisdictionId,
  );
  const selectedProgram = programs.data?.find((item) => item.id === programId);
  const frameworkOptions = filterMvpDestinationFrameworks(
    frameworks.data ?? [],
    destinationJurisdiction,
  );
  const selectedFramework = frameworkOptions.find((item) => item.id === destinationFrameworkId);
  const curriculumName = selectedCurriculum?.name ?? "";
  const programName = selectedProgram?.program_name || selfReportedProgram.trim() || null;
  const referenceError = sourceCountries.error || destinationCountries.error;
  const referenceLoading = sourceCountries.isLoading || destinationCountries.isLoading;
  const destinationScopeNote = destinationCountry
    ? getDestinationScopeNote(destinationCountry.iso3)
    : null;
  const sourceStatePlaceholder = sourceJurisdictions.isLoading
    ? "Loading source states..."
    : !sourceCountry || sourceCountry.iso3 !== "IND"
      ? "Select India first"
      : sourceJurisdictions.error
        ? "Source state data unavailable"
        : sourceJurisdictionOptions.length
          ? "Select Tamil Nadu or Andhra Pradesh"
          : "Tamil Nadu/AP not loaded yet";
  const sourceCurriculumPlaceholder = !sourceJurisdiction
    ? "Select a source state first"
    : curricula.isLoading
      ? "Loading state curricula..."
      : curricula.error
        ? "Curriculum data unavailable"
        : sourceCurriculumOptions.length
          ? "Choose a state curriculum"
          : "No MVP curriculum loaded yet";

  useEffect(() => {
    if (
      sourceJurisdictionId &&
      sourceJurisdictions.data &&
      !sourceJurisdictionOptions.some((item) => item.id === sourceJurisdictionId)
    ) {
      setSourceJurisdictionId("");
      setSourceCurriculumId("");
      setSelfReportedCurriculum("");
    }
  }, [sourceJurisdictionId, sourceJurisdictionOptions, sourceJurisdictions.data]);
  useEffect(() => {
    if (
      sourceCurriculumId &&
      curricula.data &&
      !sourceCurriculumOptions.some((item) => item.id === sourceCurriculumId)
    ) {
      setSourceCurriculumId("");
      setSelfReportedCurriculum("");
    }
  }, [sourceCurriculumId, sourceCurriculumOptions, curricula.data]);
  useEffect(() => {
    if (
      destinationJurisdictionId &&
      jurisdictions.data &&
      !destinationJurisdictionOptions.some((item) => item.id === destinationJurisdictionId)
    ) {
      setDestinationJurisdictionId("");
      setDestinationFrameworkId("");
      setProgramId("");
      setSelfReportedProgram("");
    }
  }, [destinationJurisdictionId, destinationJurisdictionOptions, jurisdictions.data]);
  useEffect(() => {
    if (!destinationFrameworkId && frameworkOptions.length === 1) {
      setDestinationFrameworkId(frameworkOptions[0].id);
    }
  }, [destinationFrameworkId, frameworkOptions]);
  useEffect(() => {
    if (
      destinationFrameworkId &&
      frameworks.data &&
      !frameworkOptions.some((framework) => framework.id === destinationFrameworkId)
    ) {
      setDestinationFrameworkId("");
      setProgramId("");
    }
  }, [destinationFrameworkId, frameworkOptions, frameworks.data]);
  useEffect(() => {
    if (
      programId &&
      programId !== OTHER_OPTION &&
      programs.data &&
      !programs.data.some((program) => program.id === programId)
    ) {
      setProgramId("");
    }
  }, [programId, programs.data]);

  const continueToNextStep = () => {
    if (step === 0 && (!sourceCountry || !isMvpSelectableSourceCountry(sourceCountry.iso3))) {
      notifyError("For the current MVP, choose India as your source country.");
      return;
    }
    if (step === 0 && !sourceJurisdiction) {
      notifyError("Choose Tamil Nadu or Andhra Pradesh as your source state.");
      return;
    }
    if (step === 0 && !selectedCurriculum) {
      notifyError("Choose the source curriculum that matches the selected state.");
      return;
    }
    if (
      step === 1 &&
      (!destinationCountry || !isMvpSelectableDestinationCountry(destinationCountry.iso3))
    ) {
      notifyError("For the current MVP, choose United States as your destination country.");
      return;
    }
    if (step === 1 && !destinationJurisdiction) {
      notifyError("Choose Georgia or Texas before selecting a framework.");
      return;
    }
    if (step === 1 && !selectedFramework) {
      notifyError("Choose the graduation framework that applies to the selected state.");
      return;
    }
    setStep((current) => Math.min(3, current + 1));
  };

  const leaveOnboarding = async () => {
    try {
      await signOut();
      await navigate({ to: "/app/login", replace: true });
    } catch (cause) {
      notifyError(cause instanceof Error ? cause.message : "Unable to switch sessions.");
    }
  };

  const finishOnboarding = async (
    preferencesToSave: AcademicPassportPreferences = passportPreferences,
    customizationAlreadySaved = false,
  ) => {
    if (!isAcademicPassportComplete(preferencesToSave)) {
      notifyError("Finish and save your Academic Passport choices before completing setup.");
      return;
    }
    if (
      !user ||
      !sourceCountry ||
      !sourceJurisdiction ||
      !destinationCountry ||
      !destinationJurisdiction ||
      !selectedCurriculum ||
      !selectedFramework
    ) {
      notifyError("Complete the verified MVP route before creating your passport.");
      return;
    }
    if (!firstName.trim()) return notifyError("Enter your first name to create your passport.");
    setSaving(true);
    try {
      await upsertCurrentProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim() || null,
        origin_country: sourceCountry.name,
        source_curriculum: curriculumName,
        destination_country: destinationCountry.name,
        target_state: destinationJurisdiction?.name ?? destinationCountry.name,
        target_district: district.trim() || null,
        target_school: school.trim() || null,
        target_program: programName,
        grade_at_transfer: Number(grade),
        expected_graduation_year: Number(graduationYear),
        preferred_language: language,
        source_country_id: sourceCountry.id,
        source_jurisdiction_id: sourceJurisdiction.id,
        source_curriculum_id: selectedCurriculum?.id ?? null,
        destination_country_id: destinationCountry.id,
        destination_jurisdiction_id: destinationJurisdiction?.id ?? null,
        destination_framework_id: selectedFramework?.id ?? null,
        destination_program_id: selectedProgram?.id ?? null,
        source_jurisdiction_label: sourceJurisdiction.name,
        destination_country_label: destinationCountry.name,
        destination_jurisdiction_label: destinationJurisdiction?.name ?? null,
        destination_framework_label: selectedFramework?.framework_name ?? null,
        destination_program_label: selectedProgram?.program_name ?? null,
        applicable_cohort: selectedFramework?.cohort_label ?? null,
        framework_version_label: selectedFramework?.version_label ?? null,
      });
      if (!customizationAlreadySaved) await updatePassportPreferences(preferencesToSave);
      await refreshProfile();
      notifySuccess("Your Scholaport passport is ready.", "complete");
      await navigate({ to: "/", replace: true });
    } catch (cause) {
      notifyError(cause instanceof Error ? cause.message : "Unable to save your passport.");
    } finally {
      setSaving(false);
    }
  };

  if (referenceLoading) return <SetupState title="Loading verified country coverage…" />;
  if (referenceError) {
    return (
      <SetupState
        title="Reference data is not ready"
        detail={
          referenceError instanceof Error ? referenceError.message : "Unable to load countries."
        }
      />
    );
  }

  const steps = [
    <div key="origin">
      <Icon icon={<PremiumSourceFileIcon />} />
      <p className="eyebrow">Step 1 of 4</p>
      <h1>Where did your learning begin?</h1>
      <p className="subcopy">
        For the current MVP, choose India, then select Tamil Nadu or Andhra Pradesh and the matching
        state curriculum shown on your transcript.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <label className="field">
          <span>First name</span>
          <input value={firstName} onChange={(event) => setFirstName(event.target.value)} />
        </label>
        <label className="field">
          <span>Last name (optional)</span>
          <input value={lastName} onChange={(event) => setLastName(event.target.value)} />
        </label>
        <label className="field">
          <span>Origin country</span>
          <select
            value={sourceCountryId}
            onChange={(event) => {
              setSourceCountryId(event.target.value);
              setSourceJurisdictionId("");
              setSourceCurriculumId("");
              setSelfReportedCurriculum("");
            }}
          >
            <option value="" disabled>
              Select a country
            </option>
            {sourceCountryOptions.map((country) => {
              const availability = getMvpSourceCountryAvailability(country.iso3);
              return (
                <option
                  key={country.id}
                  value={country.id}
                  disabled={availability !== "selectable"}
                >
                  {country.name}
                  {availability === "coming_soon" ? " — Coming soon" : ""}
                </option>
              );
            })}
          </select>
        </label>
        <label className="field">
          <span>Source state</span>
          <select
            value={sourceJurisdictionId}
            onChange={(event) => {
              setSourceJurisdictionId(event.target.value);
              setSourceCurriculumId("");
              setSelfReportedCurriculum("");
            }}
            disabled={sourceJurisdictions.isLoading || !sourceJurisdictionOptions.length}
          >
            <option value="">{sourceStatePlaceholder}</option>
            {sourceJurisdictionOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field sm:col-span-2">
          <span>Source curriculum</span>
          <select
            value={sourceCurriculumId}
            onChange={(event) => setSourceCurriculumId(event.target.value)}
            disabled={!sourceJurisdiction || !sourceCurriculumOptions.length}
          >
            <option value="">{sourceCurriculumPlaceholder}</option>
            {sourceCurriculumOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} · {item.coverage_status.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </label>
      </div>
      {sourceCountry && !isMvpSelectableSourceCountry(sourceCountry.iso3) && (
        <CoverageNotice>
          {sourceCountry.name} is visible in Scholaport as a future source country, but it is not
          selectable for the current MVP workflow.
        </CoverageNotice>
      )}
      {sourceCountry?.iso3 === "IND" &&
        !sourceJurisdictions.isLoading &&
        !sourceJurisdictionOptions.length &&
        !sourceJurisdictions.error && (
          <CoverageNotice>
            Tamil Nadu and Andhra Pradesh are not loaded from Supabase yet. Scholaport will not use
            placeholder source-state data.
          </CoverageNotice>
        )}
      {sourceJurisdictions.error && (
        <RetryNotice
          text={
            sourceJurisdictions.error instanceof Error
              ? sourceJurisdictions.error.message
              : "Unable to load source states."
          }
          onRetry={() => void sourceJurisdictions.refetch()}
        />
      )}
      {sourceJurisdiction && !sourceCurriculumOptions.length && (
        <CoverageNotice>
          Curricula for this state are still being verified for MVP onboarding. Scholaport will not
          use a placeholder curriculum.
        </CoverageNotice>
      )}
      {curricula.error && (
        <RetryNotice
          text={
            curricula.error instanceof Error
              ? curricula.error.message
              : "Unable to load source curricula."
          }
          onRetry={() => void curricula.refetch()}
        />
      )}
      {unsupportedProfileReasons.length > 0 && (
        <CoverageNotice>
          Your previous profile used values outside the current MVP scope. Please reselect the India
          state board path before continuing.
        </CoverageNotice>
      )}
    </div>,
    <div key="destination">
      <Icon icon={<PremiumTemplateIcon />} />
      <p className="eyebrow">Step 2 of 4</p>
      <h1>Where are you headed?</h1>
      <p className="subcopy">
        For the current MVP, choose the United States, then select Georgia or Texas before
        Scholaport loads that state's graduation framework.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <label className="field">
          <span>Destination country</span>
          <select
            value={destinationCountryId}
            onChange={(event) => {
              setDestinationCountryId(event.target.value);
              setDestinationJurisdictionId("");
              setDestinationFrameworkId("");
              setProgramId("");
            }}
          >
            <option value="" disabled>
              Select a country
            </option>
            {destinationCountryOptions.map((country) => {
              const availability = getMvpDestinationCountryAvailability(country.iso3);
              return (
                <option
                  key={country.id}
                  value={country.id}
                  disabled={availability !== "selectable"}
                >
                  {country.name}
                  {availability === "coming_soon" ? " — Coming soon" : ""}
                </option>
              );
            })}
          </select>
        </label>
        <label className="field">
          <span>Destination state</span>
          <select
            value={destinationJurisdictionId}
            onChange={(event) => {
              setDestinationJurisdictionId(event.target.value);
              setDestinationFrameworkId("");
              setProgramId("");
              setSelfReportedProgram("");
            }}
            disabled={!destinationJurisdictionOptions.length}
          >
            <option value="">
              {destinationJurisdictionOptions.length
                ? "Select Georgia or Texas"
                : "Select United States first"}
            </option>
            {destinationJurisdictionOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Grade at transfer</span>
          <select
            value={grade}
            onChange={(event) => {
              setGrade(event.target.value);
              setDestinationFrameworkId("");
              setProgramId("");
            }}
          >
            {[9, 10, 11, 12].map((item) => (
              <option key={item} value={item}>
                Grade {item}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Expected graduation class</span>
          <select
            value={graduationYear}
            onChange={(event) => {
              setGraduationYear(event.target.value);
              setDestinationFrameworkId("");
              setProgramId("");
            }}
          >
            {graduationYearOptions.map((year) => (
              <option key={year} value={year}>
                Class of {year}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Graduation framework</span>
          <select
            value={destinationFrameworkId}
            onChange={(event) => setDestinationFrameworkId(event.target.value)}
            disabled={!frameworkOptions.length}
          >
            <option value="">
              {frameworks.isLoading
                ? "Loading frameworks…"
                : frameworkOptions.length
                  ? "Not selected"
                  : destinationJurisdiction
                    ? "Framework still being verified"
                    : "Select a destination state first"}
            </option>
            {frameworkOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.framework_name} · {item.credential_awarded ?? "credential"} ·{" "}
                {item.coverage_status.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </label>
      </div>
      {selectedFramework && <FrameworkSummary framework={selectedFramework} />}
      {destinationScopeNote && (
        <CoverageNotice>
          {destinationScopeNote} Scholaport will not display unsupported local requirements.
        </CoverageNotice>
      )}
      {destinationCountry && !isMvpSelectableDestinationCountry(destinationCountry.iso3) && (
        <CoverageNotice>
          {destinationCountry.name} is visible in Scholaport as a future destination, but it is not
          selectable for the current MVP workflow.
        </CoverageNotice>
      )}
      {destinationJurisdiction && !frameworkOptions.length && !frameworks.isLoading && (
        <CoverageNotice>
          Detailed graduation requirements for {destinationJurisdiction.name} are still being
          verified. Scholaport will not fall back to another state's framework.
        </CoverageNotice>
      )}
      {frameworks.error && (
        <RetryNotice
          text={
            frameworks.error instanceof Error
              ? frameworks.error.message
              : "Unable to load graduation frameworks."
          }
          onRetry={() => void frameworks.refetch()}
        />
      )}
    </div>,
    <div key="goal">
      <Icon icon={<PremiumGraduationIcon />} />
      <p className="eyebrow">Step 3 of 4</p>
      <h1>Set your graduation goal.</h1>
      <p className="subcopy">
        These are your own planning preferences, separate from official reference requirements.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <label className="field">
          <span>Target district (optional)</span>
          <input
            value={district}
            onChange={(event) => setDistrict(event.target.value)}
            placeholder="Enter a district if known"
          />
        </label>
        <label className="field">
          <span>Target school (optional)</span>
          <input
            value={school}
            onChange={(event) => setSchool(event.target.value)}
            placeholder="Enter a school if known"
          />
        </label>
        <label className="field sm:col-span-2">
          <span>Target program (optional)</span>
          {programs.data?.length ? (
            <>
              <select
                value={programId}
                onChange={(event) => {
                  setProgramId(event.target.value);
                  if (event.target.value !== OTHER_OPTION) setSelfReportedProgram("");
                }}
              >
                <option value="">No program selected</option>
                {programs.data.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.program_name} · {item.coverage_status.replaceAll("_", " ")}
                  </option>
                ))}
                <option value={OTHER_OPTION}>My target program is not listed</option>
              </select>
              {programId === OTHER_OPTION && (
                <input
                  className="mt-2"
                  value={selfReportedProgram}
                  onChange={(event) => setSelfReportedProgram(event.target.value)}
                  placeholder="Enter the program name"
                />
              )}
            </>
          ) : (
            <input
              value={selfReportedProgram}
              onChange={(event) => setSelfReportedProgram(event.target.value)}
              placeholder="Enter a program only if you know it"
            />
          )}
        </label>
        <label className="field sm:col-span-2">
          <span>Preferred language</span>
          <select
            value={language}
            onChange={(event) => {
              const next = event.target.value as "en" | "ta" | "te" | "hi";
              setLanguage(next);
              updateInterfacePreference("language", next);
            }}
          >
            <option value="en">English</option>
            <option value="ta">தமிழ்</option>
            <option value="te">తెలుగు</option>
            <option value="hi">हिन्दी</option>
          </select>
        </label>
      </div>
      {!programs.data?.length && (
        <CoverageNotice>
          No verified destination programs are loaded yet. Any program entered here is
          student-reported.
        </CoverageNotice>
      )}
    </div>,
    <div key="passport-look">
      <p className="eyebrow !mt-0">Step 4 of 4</p>
      <h1>Make your Academic Passport yours.</h1>
      <p className="subcopy mb-6">
        Choose your Passport identity, color, shape, and personal mark. This changes presentation
        only, never academic results, confidence, gaps, or counselor review.
      </p>
      <AcademicPassportBuilder
        userId={user?.id}
        compact
        preferences={passportPreferences}
        onChange={updatePassportPreferences}
        onSave={async (next) => {
          await finishOnboarding(next, true);
        }}
        identity={{
          name: [firstName, lastName].filter(Boolean).join(" ") || "Your name",
          source: curriculumName || "Source curriculum",
          sourceDetail: sourceJurisdiction?.name,
          destination:
            selectedFramework?.framework_name || destinationJurisdiction?.name || "Destination",
          destinationDetail: destinationJurisdiction?.name,
          grade,
          classYear: graduationYear,
          status: "Setup ready",
        }}
      />
    </div>,
  ];

  return (
    <main className="min-h-dvh bg-[#07113F] px-3 py-3 sm:p-6">
      <header className="mx-auto flex max-w-[1400px] items-center justify-between px-2 py-2 sm:px-0">
        <ScholaportLogo className="h-11" showWordmark inverse />
        <button
          type="button"
          onClick={() => void leaveOnboarding()}
          className="min-h-11 rounded-full border border-white/15 px-4 text-xs font-bold text-white/65 transition hover:bg-white/10 hover:text-white"
        >
          Switch account
        </button>
      </header>
      <div className="mx-auto mt-4 grid max-w-[1400px] overflow-hidden rounded-[38px] bg-[#FFFDF8] shadow-[0_30px_90px_rgba(0,0,0,.24)] lg:grid-cols-[minmax(330px,.72fr)_minmax(0,1.28fr)]">
        <aside className="onboarding-scene relative min-h-[300px] overflow-hidden bg-[#01C3AD] p-6 text-[#07113F] sm:p-8 lg:min-h-[720px]">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0A175A]/58">
              Academic passage setup
            </p>
            <h2 className="onboarding-scene__title mt-3 max-w-[10ch] font-display text-3xl font-bold leading-[1.03] tracking-[-.05em] sm:text-4xl">
              Connect where you studied to where you’re going.
            </h2>
            <div className="mt-7 hidden space-y-5 lg:block">
              {["Academic origin", "Destination", "Graduation goal", "Passport look"].map(
                (label, index) => (
                  <div key={label} className="relative flex items-center gap-3">
                    {index < 3 && (
                      <span className="absolute left-[17px] top-9 h-6 w-[5px] rounded-[2px] bg-[#0A175A]/15" />
                    )}
                    <span
                      className={`relative z-10 grid h-9 w-9 place-items-center rounded-xl border-2 border-white/70 text-xs font-black shadow-[0_5px_12px_rgba(10,23,90,.12)] ${index < step ? "bg-[#BFEBDD] text-[#060F3D]" : index === step ? "bg-white text-[#0A175A]" : "bg-[#0A175A] text-white/55"}`}
                    >
                      {index < step ? <Check className="h-4 w-4" /> : index + 1}
                    </span>
                    <span
                      className={
                        index === step ? "text-sm font-extrabold" : "text-sm text-[#0A175A]/50"
                      }
                    >
                      {label}
                    </span>
                  </div>
                ),
              )}
            </div>
            <div className="onboarding-scene__summary mt-6 max-w-md rounded-[20px] bg-white/62 p-4 shadow-[inset_0_1px_rgba(255,255,255,.8)] lg:mt-9">
              <PremiumPathMatchIcon className="h-5 w-5 text-[#F86746]" />
              <p className="mt-2 text-xs font-black">Your route so far</p>
              <p className="mt-1 text-[10px] font-semibold leading-4 text-[#0A175A]/58">
                {sourceCountry?.name ?? "Choose origin"} ·{" "}
                {sourceJurisdiction?.name ?? "Choose source state"} ·{" "}
                {curriculumName || "Curriculum pending"}
                <br />→{" "}
                {destinationJurisdiction?.name ??
                  destinationCountry?.name ??
                  "Choose destination"}{" "}
                · Grade {grade}
              </p>
            </div>
          </div>
          <div className="onboarding-scene__visual relative z-10 mt-3 lg:mt-5">
            <ClayScene
              asset={
                step === 0
                  ? "source-curriculum"
                  : step === 1
                    ? "destination-framework"
                    : step === 2
                      ? "academic-roadmap"
                      : "secure-profile"
              }
              eager
              mode="mobile-top"
              className="mx-auto min-h-[230px] w-full max-w-[430px] lg:min-h-[270px]"
            />
          </div>
        </aside>
        <section className="p-6 sm:p-10 lg:min-h-[720px] lg:p-14">
          <div className="mx-auto max-w-2xl">
            {steps[step]}
            <div className="mt-10 flex items-center justify-between border-t border-[#E8EBF0] pt-6">
              <button
                onClick={() => (step > 0 ? setStep(step - 1) : void leaveOnboarding())}
                className="inline-flex h-12 items-center gap-2 rounded-2xl border border-[#CDD3DE] bg-white px-4 text-sm font-bold shadow-[0_5px_14px_rgba(10,23,90,.05)]"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <div className="flex flex-wrap justify-end gap-2">
                <button
                  onClick={() => (step < 3 ? continueToNextStep() : void finishOnboarding())}
                  disabled={
                    saving || (step === 3 && !isAcademicPassportComplete(passportPreferences))
                  }
                  className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[#0A175A] px-5 text-sm font-black text-white shadow-[0_8px_20px_rgba(10,23,90,.16)] disabled:opacity-60"
                >
                  {saving
                    ? "Saving…"
                    : step === 3
                      ? isAcademicPassportComplete(passportPreferences)
                        ? "Create passport"
                        : "Finish Passport steps"
                      : "Continue"}{" "}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <style>{`.eyebrow{margin-top:24px;font-size:11px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#01A995}.subcopy{margin-top:10px;font-size:14px;line-height:24px;color:#59647A}.field>span{display:block;margin-bottom:8px;font-size:11px;font-weight:800;color:#0A175A}.field select,.field input{height:50px;width:100%;border:1px solid #CDD3DE;border-radius:16px;padding:0 14px;font-size:14px;background:#fff;outline:none}.field select:disabled{background:#F3F6F4;color:#83909D}.field select:focus,.field input:focus{border-color:#01C3AD;box-shadow:0 0 0 4px rgba(1,195,173,.12)}h1{margin-top:8px;font-family:var(--font-display);font-size:clamp(32px,5vw,48px);line-height:1.06;font-weight:400;letter-spacing:-.018em;color:#0A175A}`}</style>
    </main>
  );
}

function Icon({ icon }: { icon: React.ReactNode }) {
  return (
    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#0A175A] text-white [&>svg]:h-6 [&>svg]:w-6">
      {icon}
    </span>
  );
}
function CoverageNotice({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 rounded-xl border border-[#F86746]/20 bg-[#F86746]/[0.06] p-3 text-xs leading-5 text-[#5A6380]">
      {children}
    </p>
  );
}
function RetryNotice({ text, onRetry }: { text: string; onRetry: () => void }) {
  return (
    <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#F86746]/20 bg-[#F86746]/[0.06] p-3 text-xs leading-5 text-[#5A6380]">
      <span className="flex-1">{text}</span>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-1 rounded-lg border border-[#CDD3DE] bg-white px-2.5 py-1 font-bold text-[#0A175A]"
      >
        <RefreshCw className="h-3 w-3" /> Retry
      </button>
    </div>
  );
}
function FrameworkSummary({ framework }: { framework: DestinationFramework }) {
  const items = [
    ["Diploma", framework.credential_awarded],
    [
      "Credits",
      framework.total_credits_required
        ? `${framework.total_credits_required} ${framework.credit_unit_name ?? "credits"}`
        : framework.framework_type.replaceAll("_", " "),
    ],
    ["Authority", framework.controlling_authority],
    ["Coverage", framework.coverage_status.replaceAll("_", " ")],
  ].filter((item): item is [string, string] => Boolean(item[1]));
  return (
    <div className="mt-4 rounded-2xl border border-[#01C3AD]/25 bg-[#01C3AD]/[0.06] p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#019A8A]">
        Selected framework
      </p>
      <h2 className="mt-1 text-sm font-black text-[#0A175A]">{framework.framework_name}</h2>
      <dl className="mt-3 grid gap-2 sm:grid-cols-2">
        {items.map(([label, value]) => (
          <div key={label}>
            <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9AA3B2]">
              {label}
            </dt>
            <dd className="mt-0.5 text-xs font-semibold text-[#34405F]">{value}</dd>
          </div>
        ))}
      </dl>
      {framework.local_override_notes && (
        <p className="mt-3 text-xs leading-5 text-[#5A6380]">{framework.local_override_notes}</p>
      )}
    </div>
  );
}
function SetupState({ title, detail }: { title: string; detail?: string }) {
  return (
    <main className="grid min-h-dvh place-items-center bg-[#F6F8FB] px-5">
      <div className="max-w-lg rounded-[24px] border border-[#CDD3DE]/70 bg-white p-8 text-center shadow-card">
        <ScholaportLogo className="mx-auto h-14" />
        <h1 className="mt-6 font-display text-2xl font-black text-[#0A175A]">{title}</h1>
        {detail && <p className="mt-3 text-sm text-[#5A6380]">{detail}</p>}
      </div>
    </main>
  );
}
