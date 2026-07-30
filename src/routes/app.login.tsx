import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check, Eye, EyeOff, FlaskConical } from "lucide-react";
import { useState } from "react";
import poriMascot from "@/assets/pori-mascot.png";
import { PremiumLockIcon, PremiumMailIcon } from "@/components/icons/PremiumIcon";
import { ScholaportLogo } from "@/components/ScholaportLogo";
import { notifyError, notifySuccess } from "@/lib/app-feedback";
import { requireSupabase } from "@/lib/supabase";
import { useInterfacePreferences } from "@/hooks/use-interface-preferences";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/app/login")({
  head: () => ({ meta: [{ title: "Sign in · Scholaport" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { t } = useI18n();
  const { preferences: interfacePreferences, updatePreference } = useInterfacePreferences(null);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [developmentLoading, setDevelopmentLoading] = useState(false);
  const developmentAccessEnabled =
    import.meta.env.DEV && import.meta.env.VITE_ENABLE_DEV_ACCESS === "true";
  const googleAuthEnabled = import.meta.env.VITE_ENABLE_GOOGLE_AUTH === "true";
  const enterDevelopmentMode = async () => {
    setDevelopmentLoading(true);
    try {
      const { error } = await requireSupabase().auth.signInAnonymously({
        options: { data: { scholaport_development_session: true } },
      });
      if (error) throw error;
      notifySuccess("Development session started.", "complete");
      await navigate({ to: "/", replace: true });
    } catch (cause) {
      notifyError(
        cause instanceof Error
          ? cause.message
          : "Unable to start an anonymous development session.",
      );
      setDevelopmentLoading(false);
    }
  };
  const signInWithGoogle = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await requireSupabase().auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
          scopes: "openid email profile",
        },
      });
      if (error) throw error;
    } catch (cause) {
      setGoogleLoading(false);
      notifyError(cause instanceof Error ? cause.message : "Google sign-in failed.");
    }
  };
  const resetPassword = async () => {
    if (!email.trim()) return notifyError("Enter your email address first.");
    try {
      const { error } = await requireSupabase().auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/app/login`,
      });
      if (error) throw error;
      notifySuccess("Password reset email sent.");
    } catch (cause) {
      notifyError(cause instanceof Error ? cause.message : "Unable to send a reset email.");
    }
  };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const client = requireSupabase();
      if (mode === "login") {
        const { error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw error;
        notifySuccess("Welcome back to Scholaport.", "complete");
        await navigate({ to: "/", replace: true });
      } else {
        const { data, error } = await client.auth.signUp({
          email,
          password,
          options: { data: { first_name: firstName.trim(), last_name: lastName.trim() || null } },
        });
        if (error) throw error;
        if (data.session) {
          notifySuccess("Your account is ready. Let’s create your passport.", "complete");
          await navigate({ to: "/app/onboarding", replace: true });
        } else {
          notifySuccess("Check your email to confirm your Scholaport account.");
          setMode("login");
        }
      }
    } catch (cause) {
      notifyError(cause instanceof Error ? cause.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="min-h-dvh bg-[#07113F] sm:p-5 lg:p-6">
      <div className="mx-auto grid min-h-dvh max-w-[1500px] overflow-hidden bg-[#01C3AD] shadow-[0_30px_90px_rgba(0,0,0,.25)] sm:min-h-[calc(100dvh-40px)] sm:rounded-[38px] lg:min-h-[calc(100dvh-48px)] lg:grid-cols-[1.16fr_.84fr]">
        <section className="relative order-2 flex min-h-[290px] flex-col overflow-hidden p-6 text-[#07113F] sm:min-h-[400px] sm:p-10 lg:order-1 lg:min-h-full lg:p-12">
          <ScholaportLogo className="relative z-20 hidden h-[52px] sm:inline-flex" showWordmark />
          <div className="relative z-10 grid flex-1 items-center gap-4 py-4 sm:py-8 xl:grid-cols-[minmax(0,1.04fr)_minmax(280px,.96fr)]">
            <div className="max-w-[580px]">
              <p className="journey-eyebrow !opacity-70">{t("A clear academic passage")}</p>
              <h1 className="max-w-[13ch] font-display text-[clamp(2.15rem,4.6vw,4.6rem)] font-bold leading-[.98] tracking-[-0.06em]">
                {t("Turn your transcript into a clear route.")}
              </h1>
              <p className="mt-4 max-w-lg text-sm font-semibold leading-6 text-[#0A175A]/70 sm:mt-5 sm:text-base sm:leading-7">
                Organize real coursework, review probable credits, find graduation gaps, and prepare
                a counselor-ready packet.
              </p>
              <div className="mt-7 hidden space-y-3 text-sm font-bold text-[#0A175A]/72 sm:block">
                <Benefit text="Student-owned and private" />
                <Benefit text="Built around destination requirements" />
                <Benefit text="Honest about review and limitations" />
              </div>
            </div>
            <PoriLockup />
          </div>
          <p className="relative z-10 hidden text-[10px] font-semibold text-[#0A175A]/52 lg:block">
            Educational guidance · not an official credential evaluation
          </p>
        </section>
        <section className="order-1 flex items-start justify-center bg-[#FFFDF8] p-5 pb-8 sm:p-10 lg:order-2 lg:m-3 lg:items-center lg:rounded-[32px]">
          <div className="w-full max-w-[460px] py-3 sm:py-5 lg:py-8">
            <ScholaportLogo className="mb-7 h-12 sm:mb-10 lg:hidden" showWordmark />
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#019A8A]">
              {mode === "login" ? t("Welcome back") : t("Create your account")}
            </p>
            <h2 className="mt-2 font-display text-4xl font-bold tracking-[-0.055em]">
              {mode === "login" ? t("Continue your journey.") : t("Start your journey.")}
            </h2>
            <p className="mt-2 text-sm text-[#5A6380]">
              {mode === "login"
                ? t("Sign in to your academic passport.")
                : t("Register securely, then build your student-owned passport.")}
            </p>
            <label className="login-language-select">
              <span>{t("Language")}</span>
              <select
                value={interfacePreferences.language}
                onChange={(event) =>
                  updatePreference("language", event.target.value as "en" | "ta" | "te" | "hi")
                }
              >
                <option value="en">English</option>
                <option value="ta">தமிழ்</option>
                <option value="te">తెలుగు</option>
                <option value="hi">हिन्दी</option>
              </select>
            </label>
            {developmentAccessEnabled && (
              <div className="mt-8 rounded-2xl border border-[#01C3AD]/30 bg-[#01C3AD]/[0.06] p-3">
                <button
                  type="button"
                  onClick={() => void enterDevelopmentMode()}
                  disabled={developmentLoading || loading}
                  className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-[#0A175A] text-sm font-bold text-white shadow-[0_8px_20px_rgba(10,23,90,.16)] disabled:opacity-60"
                >
                  <FlaskConical className="h-4 w-4 text-[#01C3AD]" />
                  {developmentLoading
                    ? "Opening development session…"
                    : "Continue in development mode"}
                </button>
                <p className="mt-2 text-center text-[10px] leading-4 text-[#5A6380]">
                  Local development only · uses an isolated anonymous Supabase user
                </p>
              </div>
            )}
            {googleAuthEnabled && (
              <button
                type="button"
                onClick={() => void signInWithGoogle()}
                disabled={googleLoading || loading}
                className={`${developmentAccessEnabled ? "mt-3" : "mt-8"} flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-[#DDE4E5] bg-white text-sm font-bold text-[#0A175A] shadow-[0_5px_14px_rgba(10,23,90,.06)] transition hover:border-[#9AA3B2] hover:bg-[#F6F8FB] disabled:opacity-60`}
              >
                <GoogleIcon />
                {googleLoading ? "Connecting to Google…" : "Continue with Google"}
              </button>
            )}
            {(developmentAccessEnabled || googleAuthEnabled) && (
              <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-[#E8EBF0]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9AA3B2]">
                  or use email
                </span>
                <span className="h-px flex-1 bg-[#E8EBF0]" />
              </div>
            )}
            <form
              onSubmit={submit}
              className={
                developmentAccessEnabled || googleAuthEnabled ? "space-y-4" : "mt-8 space-y-4"
              }
            >
              {mode === "register" && (
                <div className="grid grid-cols-2 gap-3">
                  <label>
                    <span className="mb-1.5 block text-xs font-bold">First name</span>
                    <input
                      required
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      autoComplete="given-name"
                      className="h-12 w-full rounded-2xl border border-[#CDD3DE] bg-white px-3 text-sm outline-none focus:border-[#01C3AD] focus:ring-4 focus:ring-[#01C3AD]/10"
                    />
                  </label>
                  <label>
                    <span className="mb-1.5 block text-xs font-bold">Last name</span>
                    <input
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      autoComplete="family-name"
                      className="h-12 w-full rounded-2xl border border-[#CDD3DE] bg-white px-3 text-sm outline-none focus:border-[#01C3AD] focus:ring-4 focus:ring-[#01C3AD]/10"
                    />
                  </label>
                </div>
              )}
              <label>
                <span className="mb-1.5 block text-xs font-bold">Email</span>
                <span className="relative block">
                  <PremiumMailIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA3B2]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    className="h-12 w-full rounded-2xl border border-[#CDD3DE] bg-white pl-10 pr-4 text-sm outline-none focus:border-[#01C3AD] focus:ring-4 focus:ring-[#01C3AD]/10"
                  />
                </span>
              </label>
              <label>
                <span className="mb-1.5 block text-xs font-bold">Password</span>
                <span className="relative block">
                  <PremiumLockIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA3B2]" />
                  <input
                    type={show ? "text" : "password"}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    minLength={8}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    className="h-12 w-full rounded-2xl border border-[#CDD3DE] bg-white pl-10 pr-11 text-sm outline-none focus:border-[#01C3AD] focus:ring-4 focus:ring-[#01C3AD]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-0.5 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-xl text-[#9AA3B2] hover:bg-[#E8EFED]"
                  >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </span>
              </label>
              {mode === "login" && (
                <div className="flex items-center justify-between text-xs">
                  <span>Secure session</span>
                  <button
                    type="button"
                    onClick={() => void resetPassword()}
                    className="min-h-11 rounded-xl px-1 font-bold text-[#019A8A]"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
              <button
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#01C3AD] text-sm font-black text-[#060F3D] shadow-[0_8px_20px_rgba(1,169,149,.18)] transition hover:-translate-y-0.5 hover:bg-[#4DD4C4] disabled:opacity-60"
              >
                {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
            <p className="mt-7 text-center text-xs text-[#5A6380]">
              {mode === "login" ? "New to Scholaport?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="inline-flex min-h-11 items-center rounded-xl px-1 font-black text-[#019A8A]"
              >
                {mode === "login" ? "Create an account" : "Sign in"}
              </button>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function PoriLockup() {
  return (
    <figure className="mx-auto flex w-full max-w-[430px] items-center justify-center py-1 sm:py-3">
      <img
        src={poriMascot}
        alt="Pori, the Scholaport penguin mascot"
        className="h-[210px] w-auto max-w-full object-contain sm:h-[280px] lg:h-[260px] xl:h-[440px]"
      />
    </figure>
  );
}

function Benefit({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-7 w-7 place-items-center rounded-[9px_9px_9px_3px] bg-white/65 text-[#0A175A] shadow-[inset_0_2px_rgba(255,255,255,.55)]">
        <Check className="h-3.5 w-3.5" />
      </span>
      {text}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.4-.18-2.06H12v3.9h5.38a4.6 4.6 0 0 1-2 3.02v2.53h3.24c1.9-1.75 2.98-4.32 2.98-7.39Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.98-.9 6.64-2.38l-3.24-2.53c-.9.6-2.05.96-3.4.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.61A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.39 13.92A6.02 6.02 0 0 1 6.07 12c0-.67.11-1.32.32-1.92V7.47H3.04A10 10 0 0 0 2 12c0 1.61.38 3.14 1.04 4.53l3.35-2.61Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.95c1.47 0 2.79.5 3.83 1.5l2.88-2.88A9.64 9.64 0 0 0 12 2a10 10 0 0 0-8.96 5.47l3.35 2.61C7.18 7.71 9.39 5.95 12 5.95Z"
      />
    </svg>
  );
}
