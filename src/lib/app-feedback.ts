import { toast } from "sonner";
import { playAppCue, type AppSoundCue } from "@/lib/rank-sound";

export function notifySuccess(message: string, cue: AppSoundCue = "save") {
  playAppCue(cue);
  toast.success(message);
}

export function notifyError(message: string) {
  playAppCue("warning");
  toast.error(message);
}
