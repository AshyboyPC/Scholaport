import { createFileRoute } from "@tanstack/react-router";
import { ComingSoonSurface } from "@/components/ComingSoonSurface";

export const Route = createFileRoute("/twins")({
  head: () => ({ meta: [{ title: "Twin Connect coming soon · Scholaport" }] }),
  component: TwinConnect,
});

function TwinConnect() {
  return (
    <ComingSoonSurface
      eyebrow="Twin Connect"
      title="Moderated peer guidance is coming soon."
      description="Twin Connect will stay closed until verified mentor records, moderation, privacy controls, and consent flows are ready."
      stageTitle="Peer connection starts with consent."
      stageDescription="Twin Connect will open only when verified peers can participate through a moderated, privacy-preserving question workflow."
      lockedReason="Student-to-student contact needs verified mentors, ownership checks, reporting, moderation, and clear boundaries before any question can be shared."
      asset="twin-connect"
      readyAfter={[
        "Verified mentor records exist",
        "Moderation workflow is active",
        "No direct messaging or unsafe contact is exposed",
        "Student questions are protected by ownership checks",
      ]}
    />
  );
}
