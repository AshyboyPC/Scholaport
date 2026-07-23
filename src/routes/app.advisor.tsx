import { createFileRoute } from "@tanstack/react-router";
import { ComingSoonSurface } from "@/components/ComingSoonSurface";
import { useAuth } from "@/components/AuthProvider";
import { PoriAvatar } from "@/components/pori/PoriAvatar";
import { useAcademicPassportPreferences } from "@/hooks/use-academic-passport";

export const Route = createFileRoute("/app/advisor")({
  head: () => ({
    meta: [
      { title: "AI Advisor coming soon · Scholaport" },
      {
        name: "description",
        content:
          "Scholaport AI Advisor is coming soon after the transcript, mapping, gap, roadmap, and counselor packet workflow is ready.",
      },
    ],
  }),
  component: AdvisorPage,
});

function AdvisorPage() {
  const { profile } = useAuth();
  const { preferences } = useAcademicPassportPreferences(profile?.user_id);
  return (
    <ComingSoonSurface
      eyebrow="AI Advisor"
      title="The Scholaport AI Advisor is coming soon."
      description="The advisor will stay locked until it can answer from real saved student records and avoid unsupported credit, graduation, or school-decision claims."
      stageTitle="Advice must know what it knows."
      stageDescription="The advisor will open when it can cite the student’s saved transcript, mapping, gap, roadmap, and packet records—and route uncertain decisions to a counselor."
      lockedReason="A generic chat response could sound authoritative while missing school-specific evidence. Advisor answers need saved context, sources, uncertainty language, and counselor escalation."
      asset="ai-advisor"
      companion={
        <div className="advisor-pori">
          <PoriAvatar
            preferences={preferences.pori}
            context="advisor"
            label="Your Pori advisor companion"
          />
        </div>
      }
      readyAfter={[
        "Transcript review and confirmation are complete",
        "Credit map, gap analysis, roadmap, and packet data are available",
        "Answers are grounded in saved backend records",
        "Safe counselor-review language is enforced",
      ]}
    />
  );
}
