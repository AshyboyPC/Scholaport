import { createFileRoute } from "@tanstack/react-router";
import { ComingSoonSurface } from "@/components/ComingSoonSurface";

export const Route = createFileRoute("/pathmatch")({
  head: () => ({ meta: [{ title: "PathMatch coming soon · Scholaport" }] }),
  component: PathMatchPage,
});

function PathMatchPage() {
  return (
    <ComingSoonSurface
      eyebrow="PathMatch"
      title="Verified transfer path matching is coming soon."
      description="PathMatch will compare a student against real, consented, anonymized transfer outcomes after the core transcript and planning workflow is stable."
      stageTitle="Outcome paths need verified precedent."
      stageDescription="PathMatch will open only when consented transfer histories can support a useful comparison without implying a guaranteed outcome."
      lockedReason="Static success stories would mislead students. Path records need consent, anonymization, moderation, and enough evidence to explain why a comparison is relevant."
      asset="path-match"
      readyAfter={[
        "Confirmed transcript courses are saved",
        "Credit mappings and gap analysis are reliable",
        "Anonymized path records have consent and moderation",
        "No static or fake outcome cards are used",
      ]}
    />
  );
}
