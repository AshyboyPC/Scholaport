import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, ExternalLink, MapPinned } from "lucide-react";
import {
  PremiumCheckCircleIcon,
  PremiumMailIcon,
  PremiumMapPointIcon,
} from "@/components/icons/PremiumIcon";
import { requireSupabase } from "@/lib/supabase";

const sourceOptions = [
  { value: "tamil-nadu", label: "Tamil Nadu State Board" },
  { value: "andhra-pradesh", label: "Andhra Pradesh State Board" },
  { value: "cbse", label: "CBSE or another Indian board" },
  { value: "other-source", label: "Another country or school system" },
];

const destinationOptions = [
  { value: "georgia", label: "Georgia" },
  { value: "texas", label: "Texas" },
  { value: "other-us-state", label: "Another U.S. state" },
  { value: "other-destination", label: "Another country or destination" },
];

const supportedSources = new Set(["tamil-nadu", "andhra-pradesh"]);
const supportedDestinations = new Set(["georgia", "texas"]);

function getAppLoginUrl() {
  const appUrl = import.meta.env.VITE_APP_URL?.trim().replace(/\/+$/, "");
  return appUrl ? `${appUrl}/app/login` : "/app/login";
}

export function BetaAccessGateway() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");
  const appLoginUrl = getAppLoginUrl();

  const routeState = useMemo(() => {
    if (!source || !destination) return "incomplete";
    return supportedSources.has(source) && supportedDestinations.has(destination)
      ? "supported"
      : "waitlist";
  }, [destination, source]);

  const submitWaitlist = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (routeState !== "waitlist" || !email.trim()) return;

    setStatus("saving");
    setMessage("");

    try {
      const { error } = await requireSupabase().from("expansion_waitlist").insert({
        email: email.trim().toLowerCase(),
        source_route: source,
        destination_route: destination,
      });

      if (error && error.code !== "23505") throw error;

      setStatus("saved");
      setMessage(
        error?.code === "23505"
          ? "You’re already on the expansion list. We’ll keep your route in view."
          : "You’re on the expansion list. We’ll contact you when your route is ready.",
      );
      setEmail("");
    } catch (cause) {
      setStatus("error");
      setMessage(
        cause instanceof Error
          ? cause.message
          : "We couldn’t save your request. Please try again.",
      );
    }
  };

  return (
    <div id="beta-access" className="w-full max-w-[1040px]">
      <div className="grid gap-4 text-left lg:grid-cols-2">
        <article className="flex min-h-[360px] flex-col rounded-[28px] bg-[#062f46]/88 p-6 shadow-[0_24px_70px_rgba(2,38,61,0.22)] backdrop-blur-xl md:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#8de2d5]/14 px-3.5 py-2 text-[0.68rem] font-[850] uppercase tracking-[0.12em] text-[#cffff7]">
              <PremiumCheckCircleIcon className="h-4 w-4" />
              Supported in Beta 1.0
            </span>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#11a995] text-white">
              <CheckCircle2 className="h-5 w-5" />
            </span>
          </div>

          <h3 className="max-w-md text-[clamp(1.65rem,3vw,2.3rem)] font-[800] leading-[1.08] tracking-[-0.035em] text-white">
            Your route is already supported.
          </h3>
          <p className="mt-4 max-w-md text-[0.9rem] font-[540] leading-[1.7] text-white/70">
            You’re a high-school student bringing a Tamil Nadu or Andhra Pradesh State Board
            record into Georgia or Texas.
          </p>

          <div className="mt-6 grid gap-2 text-[0.78rem] font-[720] text-[#d9fff8] sm:grid-cols-2">
            <span className="flex items-center gap-2 rounded-xl bg-white/[0.07] px-3 py-2.5">
              <PremiumMapPointIcon className="h-4 w-4 text-[#70dacb]" />
              Tamil Nadu or Andhra Pradesh
            </span>
            <span className="flex items-center gap-2 rounded-xl bg-white/[0.07] px-3 py-2.5">
              <MapPinned className="h-4 w-4 text-[#70dacb]" />
              Georgia or Texas
            </span>
          </div>

          <a
            href={appLoginUrl}
            className="mt-auto inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#eafff9] px-6 text-[0.85rem] font-[850] text-[#062f46] shadow-lg transition-transform duration-300 hover:-translate-y-0.5"
          >
            Open ScholaPort
            <ExternalLink className="h-4 w-4" />
          </a>
        </article>

        <article className="min-h-[360px] rounded-[28px] bg-[#f8fffc]/94 p-6 text-[#0a175a] shadow-[0_24px_70px_rgba(2,38,61,0.16)] backdrop-blur-xl md:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#0b807d]/10 px-3.5 py-2 text-[0.68rem] font-[850] uppercase tracking-[0.12em] text-[#087a76]">
              <PremiumMailIcon className="h-4 w-4" />
              Expansion waitlist
            </span>
            <span className="text-[0.68rem] font-[780] text-[#66768a]">Check your route</span>
          </div>

          <h3 className="text-[clamp(1.55rem,2.7vw,2.1rem)] font-[800] leading-[1.1] tracking-[-0.035em]">
            Need a different route?
          </h3>
          <p className="mt-3 text-[0.86rem] font-[540] leading-[1.65] text-[#5c697d]">
            Choose both systems first. We’ll only ask for your email when the complete beta
            workflow is not available for that route.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5 text-[0.7rem] font-[800] uppercase tracking-[0.08em] text-[#526079]">
              Record comes from
              <select
                value={source}
                onChange={(event) => {
                  setSource(event.target.value);
                  setStatus("idle");
                  setMessage("");
                }}
                className="h-12 rounded-xl border border-[#d7e8e3] bg-white px-3 text-[0.78rem] font-[680] normal-case tracking-normal text-[#0a175a] outline-none transition-colors focus:border-[#16aa9a]"
              >
                <option value="">Select source</option>
                {sourceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1.5 text-[0.7rem] font-[800] uppercase tracking-[0.08em] text-[#526079]">
              Moving into
              <select
                value={destination}
                onChange={(event) => {
                  setDestination(event.target.value);
                  setStatus("idle");
                  setMessage("");
                }}
                className="h-12 rounded-xl border border-[#d7e8e3] bg-white px-3 text-[0.78rem] font-[680] normal-case tracking-normal text-[#0a175a] outline-none transition-colors focus:border-[#16aa9a]"
              >
                <option value="">Select destination</option>
                {destinationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {routeState === "incomplete" ? (
            <div className="mt-5 flex min-h-14 items-center rounded-2xl bg-[#eef8f5] px-4 text-[0.78rem] font-[650] leading-relaxed text-[#617083]">
              Select a source and destination to see the correct next step.
            </div>
          ) : routeState === "supported" ? (
            <div className="mt-5 rounded-2xl bg-[#e3f8f1] p-4">
              <p className="text-[0.78rem] font-[750] leading-relaxed text-[#08756e]">
                Good news—this route is supported. You don’t need to join the waitlist.
              </p>
              <a
                href={appLoginUrl}
                className="mt-3 inline-flex items-center gap-2 text-[0.78rem] font-[850] text-[#0a175a]"
              >
                Open ScholaPort <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          ) : (
            <form className="mt-5" onSubmit={submitWaitlist}>
              <div className="flex items-center rounded-full bg-[#07545d] p-1.5 pl-5 shadow-lg">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Your email address"
                  className="min-w-0 flex-1 bg-transparent text-[0.84rem] font-[620] text-white outline-none placeholder:text-white/55"
                  required
                />
                <button
                  type="submit"
                  disabled={status === "saving"}
                  className="h-11 shrink-0 rounded-full bg-[#eafff9] px-5 text-[0.75rem] font-[850] text-[#063b4d] transition-opacity disabled:opacity-60"
                >
                  {status === "saving" ? "Joining…" : "Join waitlist"}
                </button>
              </div>
            </form>
          )}

          {message ? (
            <p
              role="status"
              className={`mt-3 text-[0.72rem] font-[680] leading-relaxed ${
                status === "error" ? "text-[#b8483c]" : "text-[#08756e]"
              }`}
            >
              {message}
            </p>
          ) : null}
        </article>
      </div>

      <p className="mx-auto mt-5 max-w-2xl text-center text-[0.72rem] font-[620] leading-relaxed text-[#d9fff8]/72">
        ScholaPort provides planning support. Receiving schools retain all final credit,
        placement, and graduation decisions.
      </p>
    </div>
  );
}
