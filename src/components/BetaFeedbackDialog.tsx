import { MessageSquareHeart, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { notifyError, notifySuccess } from "@/lib/app-feedback";
import {
  submitBetaFeedback,
  type BetaFeedbackCategory,
} from "@/lib/scholaport-api";

const feedbackCategories: Array<{ value: BetaFeedbackCategory; label: string }> = [
  { value: "bug", label: "Something did not work" },
  { value: "confusing", label: "Something was confusing" },
  { value: "idea", label: "I have an improvement idea" },
  { value: "other", label: "Something else" },
];

export function BetaFeedbackDialog({ pagePath }: { pagePath: string }) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<BetaFeedbackCategory>("confusing");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await submitBetaFeedback({ category, message: message.trim(), page_path: pagePath });
      setMessage("");
      setCategory("confusing");
      setOpen(false);
      notifySuccess("Thank you—your beta feedback was saved.");
    } catch (cause) {
      notifyError(cause instanceof Error ? cause.message : "Your feedback could not be saved.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="fixed bottom-[calc(max(.75rem,env(safe-area-inset-bottom))+4.75rem)] right-4 z-40 inline-flex min-h-11 items-center gap-2 rounded-2xl bg-[#0A175A] px-3.5 text-xs font-black text-white shadow-[0_10px_28px_rgba(10,23,90,.24)] transition hover:-translate-y-0.5 hover:bg-[#17276D] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#01C3AD]/30 lg:bottom-6 lg:right-6"
          aria-label="Send beta feedback"
        >
          <MessageSquareHeart className="h-[18px] w-[18px] text-[#78E6D7]" aria-hidden="true" />
          <span>Beta feedback</span>
        </button>
      </DialogTrigger>

      <DialogContent className="w-[calc(100%-2rem)] max-w-[520px] gap-0 overflow-hidden rounded-[30px] border-0 bg-[#FFFDF8] p-0 text-[#0A175A] shadow-[0_28px_90px_rgba(7,17,63,.24)]">
        <div className="h-2 bg-[#01A995]" aria-hidden="true" />
        <div className="px-6 pb-5 pt-6 pr-14 sm:px-7 sm:pr-14">
          <DialogHeader>
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#0A175A] text-[#78E6D7]">
                <MessageSquareHeart className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#01A995]">
                Beta 1.0 · Product feedback
              </span>
            </div>
            <DialogTitle className="font-display text-[1.7rem] font-black leading-tight tracking-[-0.04em]">
              Help us improve the beta
            </DialogTitle>
            <DialogDescription className="mt-2 max-w-md text-sm leading-6 text-[#667085]">
              Share what happened while using ScholaPort. We securely attach your account and
              current page so the team has enough context to improve it.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form
          className="space-y-5 bg-[#F4F6F2] p-6 sm:px-7 sm:pb-7"
          onSubmit={(event) => void handleSubmit(event)}
        >
          <label className="block">
            <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.12em] text-[#667085]">
              What kind of feedback is this?
            </span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as BetaFeedbackCategory)}
              className="h-12 w-full rounded-2xl border-0 bg-white px-4 text-sm font-bold shadow-[0_1px_0_rgba(10,23,90,.04)] outline-none transition focus:shadow-[0_0_0_3px_rgba(1,169,149,.16)]"
            >
              {feedbackCategories.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.12em] text-[#667085]">
              What should we know?
            </span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              minLength={10}
              maxLength={2000}
              required
              rows={6}
              placeholder="Tell us what you tried, what happened, and what you expected."
              className="w-full resize-none rounded-2xl border-0 bg-white px-4 py-3 text-sm leading-6 shadow-[0_1px_0_rgba(10,23,90,.04)] outline-none transition placeholder:text-[#98A2B3] focus:shadow-[0_0_0_3px_rgba(1,169,149,.16)]"
            />
            <span className="mt-1.5 block text-right text-[10px] font-bold text-[#98A2B3]">
              {message.length}/2000
            </span>
          </label>

          <button
            type="submit"
            disabled={submitting || message.trim().length < 10}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#0A175A] px-5 text-sm font-black text-white shadow-[0_10px_24px_rgba(10,23,90,.16)] transition hover:-translate-y-0.5 hover:bg-[#17276D] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-45"
          >
            <Send className="h-4 w-4 text-[#78E6D7]" aria-hidden="true" />
            {submitting ? "Saving feedback…" : "Send beta feedback"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
