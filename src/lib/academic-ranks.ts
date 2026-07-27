import type {
  CounselorPacket,
  CreditMapping,
  GapAnalysis,
  Roadmap,
  RoadmapItem,
  StudentProfile,
  Transcript,
  TranscriptCourse,
} from "./scholaport-api.ts";

export type AcademicRankId =
  | "wayfinder"
  | "passport-holder"
  | "record-keeper"
  | "credit-mapper"
  | "gap-navigator"
  | "route-builder"
  | "passage-ready";

export type AcademicRankInput = {
  profileReady: boolean;
  passportComplete: boolean;
  poriComplete: boolean;
  transcriptConfirmed: boolean;
  courseCount: number;
  reviewedCourseCount: number;
  mappedCourseCount: number;
  resolvedMappingCount: number;
  mappedCredits: number;
  gapAnalysisReady: boolean;
  gapRequirementCount: number;
  plannedGapRequirementCount: number;
  roadmapReady: boolean;
  completedRoadmapItems: number;
  completedHighPriorityRoadmapItems: number;
  totalRoadmapItems: number;
  packetReady: boolean;
};

export type AcademicRankCheck = {
  id: string;
  label: string;
  complete: boolean;
  value?: string;
  destination: AcademicRankDestination;
  hash?: string;
  action: string;
};

export type AcademicRankDestination =
  | "/app/onboarding"
  | "/app/profile"
  | "/app/pori"
  | "/app/transcript"
  | "/app/gaps"
  | "/app/roadmap"
  | "/app/packet";

export type AcademicRankDefinition = {
  id: AcademicRankId;
  level: number;
  name: string;
  kicker: string;
  description: string;
  destination: AcademicRankDestination;
  hash?: string;
  action: string;
};

export type AcademicRankProgress = {
  current: AcademicRankDefinition;
  next: AcademicRankDefinition | null;
  ranks: Array<
    AcademicRankDefinition & {
      earned: boolean;
      checks: AcademicRankCheck[];
    }
  >;
  nextChecks: AcademicRankCheck[];
  nextProgress: number;
  metrics: AcademicRankInput;
};

export const ACADEMIC_RANKS: readonly AcademicRankDefinition[] = [
  {
    id: "wayfinder",
    level: 1,
    name: "Wayfinder",
    kicker: "Your journey begins",
    description: "Set your academic identity and make this workspace yours.",
    destination: "/app/onboarding",
    action: "Build your profile",
  },
  {
    id: "passport-holder",
    level: 2,
    name: "Passport Holder",
    kicker: "Identity ready",
    description: "Complete your profile, Academic Passport, and Pori companion.",
    destination: "/app/profile",
    hash: "academic-passport-builder",
    action: "Finish your Passport",
  },
  {
    id: "record-keeper",
    level: 3,
    name: "Record Keeper",
    kicker: "Transcript confirmed",
    description:
      "Review at least three imported courses, resolve every row, and confirm the record.",
    destination: "/app/transcript",
    hash: "course-review",
    action: "Review transcript",
  },
  {
    id: "credit-mapper",
    level: 4,
    name: "Credit Mapper",
    kicker: "Credits connected",
    description: "Map at least 80% of courses, resolve each mapping, and identify three credits.",
    destination: "/app/transcript",
    hash: "credit-mapping-review",
    action: "Map your credits",
  },
  {
    id: "gap-navigator",
    level: 5,
    name: "Gap Navigator",
    kicker: "Requirements understood",
    description: "Analyze destination requirements and give every open gap a next action.",
    destination: "/app/gaps",
    hash: "gap-analysis",
    action: "Analyze requirements",
  },
  {
    id: "route-builder",
    level: 6,
    name: "Route Builder",
    kicker: "Plan in motion",
    description: "Create your roadmap, complete two actions, and close one high-priority step.",
    destination: "/app/roadmap",
    hash: "roadmap-actions",
    action: "Work your roadmap",
  },
  {
    id: "passage-ready",
    level: 7,
    name: "Passage Ready",
    kicker: "Counselor handoff ready",
    description: "Complete half your roadmap and generate a current counselor-ready packet.",
    destination: "/app/packet",
    hash: "packet-actions",
    action: "Prepare your packet",
  },
] as const;

function checksForRank(rank: AcademicRankDefinition, input: AcademicRankInput) {
  const coverage = input.courseCount ? Math.min(1, input.mappedCourseCount / input.courseCount) : 0;
  const coverageLabel = `${Math.round(coverage * 100)}% mapped`;

  const checks: Record<AcademicRankId, AcademicRankCheck[]> = {
    wayfinder: [
      {
        id: "account",
        label: "Create your Scholaport workspace",
        complete: true,
        destination: "/app/profile",
        action: "Open profile",
      },
    ],
    "passport-holder": [
      {
        id: "profile",
        label: "Complete your academic profile",
        complete: input.profileReady,
        destination: "/app/onboarding",
        action: "Complete profile setup",
      },
      {
        id: "passport",
        label: "Save your Academic Passport",
        complete: input.passportComplete,
        destination: "/app/profile",
        hash: "academic-passport-builder",
        action: "Finish your Passport",
      },
      {
        id: "pori",
        label: "Finish your Pori companion",
        complete: input.poriComplete,
        destination: "/app/pori",
        action: "Customize Pori",
      },
    ],
    "record-keeper": [
      {
        id: "courses",
        label: "Add at least three transcript courses",
        complete: input.courseCount >= 3,
        value: `${input.courseCount} course${input.courseCount === 1 ? "" : "s"}`,
        destination: "/app/transcript",
        hash: "transcript-workspace",
        action: "Add transcript courses",
      },
      {
        id: "course-review",
        label: "Review every imported course row",
        complete: input.courseCount >= 3 && input.reviewedCourseCount >= input.courseCount,
        value: `${input.reviewedCourseCount} of ${input.courseCount} reviewed`,
        destination: "/app/transcript",
        hash: "course-review",
        action: "Review course rows",
      },
      {
        id: "confirm",
        label: "Confirm your transcript",
        complete: input.transcriptConfirmed,
        destination: "/app/transcript",
        hash: "course-review",
        action: "Confirm transcript",
      },
    ],
    "credit-mapper": [
      {
        id: "coverage",
        label: "Map at least 80% of transcript courses",
        complete: input.courseCount > 0 && coverage >= 0.8,
        value: coverageLabel,
        destination: "/app/transcript",
        hash: "credit-mapping-review",
        action: "Generate course mappings",
      },
      {
        id: "mapping-review",
        label: "Resolve every generated mapping",
        complete:
          input.mappedCourseCount > 0 && input.resolvedMappingCount >= input.mappedCourseCount,
        value: `${input.resolvedMappingCount} of ${input.mappedCourseCount} resolved`,
        destination: "/app/transcript",
        hash: "credit-mapping-review",
        action: "Review mappings",
      },
      {
        id: "credits",
        label: "Identify at least three mapped credits",
        complete: input.mappedCredits >= 3,
        value: `${formatCredits(input.mappedCredits)} credits`,
        destination: "/app/transcript",
        hash: "credit-mapping-review",
        action: "Complete credit mapping",
      },
    ],
    "gap-navigator": [
      {
        id: "analysis",
        label: "Complete a destination gap analysis",
        complete: input.gapAnalysisReady,
        destination: "/app/gaps",
        hash: "gap-analysis",
        action: "Run gap analysis",
      },
      {
        id: "gap-requirements",
        label: "Review every destination requirement",
        complete: input.gapRequirementCount > 0,
        value: `${input.gapRequirementCount} requirements`,
        destination: "/app/gaps",
        hash: "gap-requirements",
        action: "Review requirements",
      },
      {
        id: "gap-actions",
        label: "Give every open gap a saved next action",
        complete:
          input.gapRequirementCount > 0 &&
          input.plannedGapRequirementCount >= input.gapRequirementCount,
        value: `${input.plannedGapRequirementCount} of ${input.gapRequirementCount} planned`,
        destination: "/app/gaps",
        hash: "gap-requirements",
        action: "Plan open gaps",
      },
    ],
    "route-builder": [
      {
        id: "roadmap",
        label: "Generate your academic roadmap",
        complete: input.roadmapReady,
        destination: "/app/roadmap",
        hash: "roadmap-overview",
        action: "Generate roadmap",
      },
      {
        id: "first-action",
        label: "Complete at least two roadmap actions",
        complete: input.completedRoadmapItems >= 2,
        value: `${input.completedRoadmapItems} of ${input.totalRoadmapItems}`,
        destination: "/app/roadmap",
        hash: "roadmap-actions",
        action: "Complete roadmap actions",
      },
      {
        id: "priority-action",
        label: "Complete one high-priority roadmap action",
        complete: input.completedHighPriorityRoadmapItems > 0,
        value: `${input.completedHighPriorityRoadmapItems} completed`,
        destination: "/app/roadmap",
        hash: "roadmap-actions",
        action: "Open priority actions",
      },
    ],
    "passage-ready": [
      {
        id: "roadmap-half",
        label: "Complete at least half your roadmap, with a minimum of three actions",
        complete:
          input.totalRoadmapItems > 0 &&
          input.completedRoadmapItems >= Math.max(3, Math.ceil(input.totalRoadmapItems / 2)),
        value: `${input.completedRoadmapItems} of ${input.totalRoadmapItems}`,
        destination: "/app/roadmap",
        hash: "roadmap-actions",
        action: "Continue your roadmap",
      },
      {
        id: "packet",
        label: "Generate a current counselor packet",
        complete: input.packetReady,
        destination: "/app/packet",
        hash: "packet-actions",
        action: "Generate counselor packet",
      },
    ],
  };

  return checks[rank.id];
}

export function calculateAcademicRank(
  input: AcademicRankInput,
  minimumPersistedLevel = 1,
): AcademicRankProgress {
  const ranks = ACADEMIC_RANKS.map((rank) => {
    const checks = checksForRank(rank, input);
    return { ...rank, checks, earned: checks.every((check) => check.complete) };
  });

  let currentIndex = Math.min(ranks.length - 1, Math.max(0, minimumPersistedLevel - 1));
  for (let index = currentIndex + 1; index < ranks.length; index += 1) {
    if (!ranks[index].earned) break;
    currentIndex = index;
  }

  const current = ACADEMIC_RANKS[currentIndex];
  const next = ACADEMIC_RANKS[currentIndex + 1] ?? null;
  const nextChecks = next ? checksForRank(next, input) : [];
  const nextProgress = nextChecks.length
    ? nextChecks.filter((check) => check.complete).length / nextChecks.length
    : 1;

  return { current, next, ranks, nextChecks, nextProgress, metrics: input };
}

export function deriveAcademicRankInput({
  profile,
  passportComplete,
  poriComplete,
  transcript,
  courses,
  mappings,
  gapAnalysis,
  gapRequirements,
  roadmap,
  roadmapItems,
  packet,
}: {
  profile: StudentProfile | null | undefined;
  passportComplete: boolean;
  poriComplete: boolean;
  transcript: Transcript | null | undefined;
  courses: TranscriptCourse[];
  mappings: CreditMapping[];
  gapAnalysis: GapAnalysis | null | undefined;
  gapRequirements: Array<{
    credits_remaining?: number;
    missing_amount?: number;
    status?: string;
    suggested_actions?: string[];
    counselor_question?: string | null;
  }>;
  roadmap: Roadmap | null | undefined;
  roadmapItems: RoadmapItem[];
  packet: CounselorPacket | null | undefined;
}): AcademicRankInput {
  const usableMappings = mappings.filter((mapping) => {
    const status = (mapping.mapping_status ?? mapping.status ?? "").toLowerCase();
    return !["rejected", "student_rejected", "replaced", "failed"].includes(status);
  });
  const mappedCourseIds = new Set(usableMappings.map((mapping) => mapping.transcript_course_id));
  const resolvedMappings = usableMappings.filter((mapping) => {
    const status = (mapping.mapping_status ?? mapping.status ?? "").toLowerCase();
    return [
      "accepted",
      "confirmed",
      "student_confirmed",
      "counselor_confirmed",
      "counselor_review_required",
      "needs_counselor_review",
      "counselor_review",
    ].includes(status);
  });
  const resolvedMappingCourseIds = new Set(
    resolvedMappings.map((mapping) => mapping.transcript_course_id),
  );
  const mappedCredits = usableMappings.reduce(
    (sum, mapping) => sum + (mapping.possible_credit_value ?? mapping.credits_mapped ?? 0),
    0,
  );
  const transcriptStatus = (transcript?.confirmation_status ?? "").toLowerCase();
  const gapStatus = (gapAnalysis?.status ?? gapAnalysis?.overall_status ?? "").toLowerCase();
  const roadmapStatus = (roadmap?.status ?? "").toLowerCase();
  const packetStatus = (packet?.status ?? "").toLowerCase();

  return {
    profileReady: Boolean(
      profile?.first_name &&
      profile.origin_country &&
      profile.source_curriculum &&
      profile.destination_country &&
      profile.target_state,
    ),
    passportComplete,
    poriComplete,
    transcriptConfirmed:
      Boolean(transcript?.confirmed_at) || ["confirmed", "completed"].includes(transcriptStatus),
    courseCount: courses.length,
    reviewedCourseCount: courses.filter((course) => course.student_confirmed === true).length,
    mappedCourseCount: mappedCourseIds.size,
    resolvedMappingCount: resolvedMappingCourseIds.size,
    mappedCredits,
    gapAnalysisReady: Boolean(gapAnalysis) && ["completed", "needs_review"].includes(gapStatus),
    gapRequirementCount: gapRequirements.length,
    plannedGapRequirementCount: gapRequirements.filter((requirement) => {
      const remaining = requirement.missing_amount ?? requirement.credits_remaining ?? 0;
      const status = (requirement.status ?? "").toLowerCase();
      return (
        remaining <= 0 ||
        ["satisfied", "complete"].includes(status) ||
        Boolean(requirement.suggested_actions?.length) ||
        Boolean(requirement.counselor_question)
      );
    }).length,
    roadmapReady:
      Boolean(roadmap) && ["active", "completed", "needs_review"].includes(roadmapStatus),
    completedRoadmapItems: roadmapItems.filter(
      (item) => item.status === "done" || Boolean(item.completed_at),
    ).length,
    completedHighPriorityRoadmapItems: roadmapItems.filter(
      (item) =>
        (item.status === "done" || Boolean(item.completed_at)) &&
        ["high", "critical"].includes(item.priority.toLowerCase()),
    ).length,
    totalRoadmapItems: roadmapItems.length,
    packetReady:
      Boolean(packet) &&
      !packet?.stale_reason &&
      ["ready", "needs_review", "html_ready", "pdf_ready", "completed", "generated"].includes(
        packetStatus,
      ),
  };
}

function formatCredits(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
