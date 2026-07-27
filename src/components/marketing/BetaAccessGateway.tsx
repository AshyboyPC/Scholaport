import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, Route } from "lucide-react";
import { PremiumMapPointIcon } from "@/components/icons/PremiumIcon";

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
  const [showRouteCheck, setShowRouteCheck] = useState(false);
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
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          source,
          destination,
        }),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "We couldn’t save your request. Please try again.");
      }

      setStatus("saved");
      setMessage(result.message || "You’re on the expansion list.");
      setEmail("");
    } catch (cause) {
      setStatus("error");
      setMessage(
        cause instanceof Error ? cause.message : "We couldn’t save your request. Please try again.",
      );
    }
  };

  return (
    <div className="w-full max-w-[760px] text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#eafff9] text-[#07545d] shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
        <Route className="h-6 w-6" />
      </span>

      <div className="mt-6 text-[0.68rem] font-[850] uppercase tracking-[0.16em] text-[#9ff2e6]">
        Private Beta 1.0
      </div>
      <h2 className="mt-3 text-[clamp(2.35rem,5vw,4.7rem)] font-[800] leading-[0.98] tracking-[-0.055em] text-white">
        Find the right way into ScholaPort.
      </h2>
      <p className="mx-auto mt-5 max-w-xl text-[0.92rem] font-[540] leading-[1.7] text-white/65">
        The complete beta currently supports Tamil Nadu or Andhra Pradesh State Board records moving
        into Georgia or Texas.
      </p>

      {!showRouteCheck ? (
        <>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={appLoginUrl}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#eafff9] px-6 text-[0.78rem] font-[850] text-[#052f43] shadow-lg transition-transform duration-300 hover:-translate-y-0.5"
            >
              My route is supported
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <button
              type="button"
              onClick={() => setShowRouteCheck(true)}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white/10 px-6 text-[0.78rem] font-[800] text-white ring-1 ring-inset ring-white/20 backdrop-blur-sm transition-colors hover:bg-white/15"
            >
              Check a different route
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-5 text-[0.68rem] font-[650] text-white/45">
            Unsupported routes join the expansion waitlist—not the application.
          </p>
        </>
      ) : (
        <div className="mx-auto mt-8 max-w-[650px] rounded-[24px] bg-[#f8fffc]/96 p-5 text-left text-[#0a175a] shadow-[0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[0.66rem] font-[850] uppercase tracking-[0.13em] text-[#07867e]">
                Route check
              </div>
              <h3 className="mt-1 text-[1.25rem] font-[800] tracking-[-0.025em]">
                Where is your record going?
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowRouteCheck(false)}
              className="inline-flex items-center gap-1.5 text-[0.7rem] font-[760] text-[#657185]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5 text-[0.66rem] font-[800] uppercase tracking-[0.08em] text-[#526079]">
              Record comes from
              <select
                value={source}
                onChange={(event) => {
                  setSource(event.target.value);
                  setStatus("idle");
                  setMessage("");
                }}
                className="h-11 rounded-xl border border-[#d7e8e3] bg-white px-3 text-[0.76rem] font-[680] normal-case tracking-normal text-[#0a175a] outline-none focus:border-[#16aa9a]"
              >
                <option value="">Select source</option>
                {sourceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1.5 text-[0.66rem] font-[800] uppercase tracking-[0.08em] text-[#526079]">
              Moving into
              <select
                value={destination}
                onChange={(event) => {
                  setDestination(event.target.value);
                  setStatus("idle");
                  setMessage("");
                }}
                className="h-11 rounded-xl border border-[#d7e8e3] bg-white px-3 text-[0.76rem] font-[680] normal-case tracking-normal text-[#0a175a] outline-none focus:border-[#16aa9a]"
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
            <p className="mt-4 text-[0.72rem] font-[650] text-[#667286]">
              Select both systems to reveal the correct next step.
            </p>
          ) : routeState === "supported" ? (
            <div className="mt-4 flex flex-col justify-between gap-3 rounded-2xl bg-[#e5f8f2] p-4 sm:flex-row sm:items-center">
              <p className="flex items-center gap-2 text-[0.74rem] font-[760] text-[#08756e]">
                <PremiumMapPointIcon className="h-4 w-4" />
                This route is supported. No waitlist needed.
              </p>
              <a
                href={appLoginUrl}
                className="inline-flex items-center gap-1.5 text-[0.74rem] font-[850] text-[#0a175a]"
              >
                Open ScholaPort <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          ) : (
            <form className="mt-4" onSubmit={submitWaitlist}>
              <div className="flex items-center rounded-full bg-[#07545d] p-1.5 pl-4 shadow-md">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Your email address"
                  className="min-w-0 flex-1 bg-transparent text-[0.78rem] font-[620] text-white outline-none placeholder:text-white/55"
                  required
                />
                <button
                  type="submit"
                  disabled={status === "saving"}
                  className="h-10 shrink-0 rounded-full bg-[#eafff9] px-4 text-[0.7rem] font-[850] text-[#063b4d] disabled:opacity-60"
                >
                  {status === "saving" ? "Joining…" : "Join waitlist"}
                </button>
              </div>
            </form>
          )}

          {message ? (
            <p
              role="status"
              className={`mt-3 text-[0.7rem] font-[680] ${
                status === "error" ? "text-[#b8483c]" : "text-[#08756e]"
              }`}
            >
              {message}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
