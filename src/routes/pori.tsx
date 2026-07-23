import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PassportShell } from "@/components/PassportShell";
import { useAuth } from "@/components/AuthProvider";
import { PoriBuilder } from "@/components/pori/PoriBuilder";
import { useAcademicPassportPreferences } from "@/hooks/use-academic-passport";
import { DEFAULT_PORI_PREFERENCES } from "@/lib/pori";
import { notifyError, notifySuccess } from "@/lib/app-feedback";

export const Route = createFileRoute("/pori")({
  head: () => ({ meta: [{ title: "Customize Pori · Scholaport" }] }),
  component: PoriPage,
});

function PoriPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { preferences, setPreferences, syncError } = useAcademicPassportPreferences(
    profile?.user_id,
  );
  const updatePori = async (pori: typeof preferences.pori) => {
    try {
      return await setPreferences({ ...preferences, pori });
    } catch (cause) {
      notifyError(cause instanceof Error ? cause.message : "Unable to sync your Pori.");
      return undefined;
    }
  };

  return (
    <PassportShell
      eyebrow="My Pori"
      title="Make Pori your own"
      description="Choose a few details for your ScholaPort companion. Every option keeps Pori recognizable and ready for your academic journey."
    >
      <PoriBuilder
        preferences={preferences.pori}
        onChange={updatePori}
        onReset={() => {
          void updatePori(structuredClone(DEFAULT_PORI_PREFERENCES)).then(() =>
            notifySuccess("Pori reset.", "remove"),
          );
        }}
        onFinish={() => {
          notifySuccess("Your Pori is saved.", "complete");
          void navigate({ to: "/profile", hash: "academic-passport-builder" });
        }}
      />
      {syncError && (
        <p className="mt-4 text-sm font-semibold text-[#B7432D]" role="alert">
          {syncError}
        </p>
      )}
    </PassportShell>
  );
}
