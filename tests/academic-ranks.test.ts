import assert from "node:assert/strict";
import test from "node:test";
import { calculateAcademicRank, type AcademicRankInput } from "../src/lib/academic-ranks.ts";

const emptyProgress: AcademicRankInput = {
  profileReady: false,
  passportComplete: false,
  poriComplete: false,
  transcriptConfirmed: false,
  courseCount: 0,
  reviewedCourseCount: 0,
  mappedCourseCount: 0,
  resolvedMappingCount: 0,
  mappedCredits: 0,
  gapAnalysisReady: false,
  gapRequirementCount: 0,
  plannedGapRequirementCount: 0,
  roadmapReady: false,
  completedRoadmapItems: 0,
  completedHighPriorityRoadmapItems: 0,
  totalRoadmapItems: 0,
  packetReady: false,
};

test("rank progress begins at Wayfinder and names every concrete next requirement", () => {
  const progress = calculateAcademicRank(emptyProgress);
  assert.equal(progress.current.id, "wayfinder");
  assert.equal(progress.next?.id, "passport-holder");
  assert.deepEqual(
    progress.nextChecks.map((check) => check.id),
    ["profile", "passport", "pori"],
  );
  assert.equal(progress.nextProgress, 0);
});

test("a later artifact cannot bypass the sequential rank gates", () => {
  const progress = calculateAcademicRank({
    ...emptyProgress,
    profileReady: true,
    packetReady: true,
  });
  assert.equal(progress.current.id, "wayfinder");
  assert.equal(progress.ranks.at(-1)?.earned, false);
});

test("a persisted earned rank never regresses when current evidence becomes stale", () => {
  const progress = calculateAcademicRank(emptyProgress, 4);
  assert.equal(progress.current.id, "credit-mapper");
  assert.equal(progress.next?.id, "gap-navigator");
});

test("credit mapper requires both useful credit and 80 percent course coverage", () => {
  const base: AcademicRankInput = {
    ...emptyProgress,
    profileReady: true,
    passportComplete: true,
    poriComplete: true,
    transcriptConfirmed: true,
    courseCount: 10,
    reviewedCourseCount: 10,
    mappedCourseCount: 7,
    resolvedMappingCount: 7,
    mappedCredits: 9,
  };
  assert.equal(calculateAcademicRank(base).current.id, "record-keeper");
  assert.equal(
    calculateAcademicRank({ ...base, mappedCourseCount: 8, resolvedMappingCount: 8 }).current.id,
    "credit-mapper",
  );
});

test("route builder requires a generated plan and meaningful completed actions", () => {
  const base: AcademicRankInput = {
    ...emptyProgress,
    profileReady: true,
    passportComplete: true,
    poriComplete: true,
    transcriptConfirmed: true,
    courseCount: 4,
    reviewedCourseCount: 4,
    mappedCourseCount: 4,
    resolvedMappingCount: 4,
    mappedCredits: 4,
    gapAnalysisReady: true,
    gapRequirementCount: 4,
    plannedGapRequirementCount: 4,
    roadmapReady: true,
    totalRoadmapItems: 5,
  };
  assert.equal(calculateAcademicRank(base).current.id, "gap-navigator");
  assert.equal(
    calculateAcademicRank({
      ...base,
      completedRoadmapItems: 2,
      completedHighPriorityRoadmapItems: 1,
    }).current.id,
    "route-builder",
  );
});

test("a current counselor packet earns the final Passage Ready rank", () => {
  const progress = calculateAcademicRank({
    ...emptyProgress,
    profileReady: true,
    passportComplete: true,
    poriComplete: true,
    transcriptConfirmed: true,
    courseCount: 5,
    reviewedCourseCount: 5,
    mappedCourseCount: 5,
    resolvedMappingCount: 5,
    mappedCredits: 16.5,
    gapAnalysisReady: true,
    gapRequirementCount: 6,
    plannedGapRequirementCount: 6,
    roadmapReady: true,
    completedRoadmapItems: 3,
    completedHighPriorityRoadmapItems: 1,
    totalRoadmapItems: 5,
    packetReady: true,
  });
  assert.equal(progress.current.id, "passage-ready");
  assert.equal(progress.next, null);
  assert.equal(progress.nextProgress, 1);
});
