import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { AlertCircle } from "lucide-react";

import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";
import "@fontsource/noto-sans-tamil/400.css";
import "@fontsource/noto-sans-tamil/600.css";
import "@fontsource/noto-sans-tamil/700.css";
import "@fontsource/noto-sans-telugu/400.css";
import "@fontsource/noto-sans-telugu/600.css";
import "@fontsource/noto-sans-telugu/700.css";
import "@fontsource/noto-sans-devanagari/400.css";
import "@fontsource/noto-sans-devanagari/600.css";
import "@fontsource/noto-sans-devanagari/700.css";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/components/AuthProvider";
import { ScholaportLogo } from "@/components/ScholaportLogo";
import { DocumentStack } from "@/components/journey/JourneyVisuals";
import { getMvpProfileUnsupportedReasons } from "@/lib/mvp-reference-scope";
import { useInterfacePreferences } from "@/hooks/use-interface-preferences";
import { I18nProvider } from "@/lib/i18n";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#07113F] px-4">
      <div className="journey-paper max-w-md p-8 text-center">
        <h1 className="font-display text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 font-display text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          That page isn't stamped in Scholaport — let's get you back on route.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#0A175A] px-5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(10,23,90,.16)]"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#FFE1D8] px-4">
      <div className="journey-paper max-w-md p-8 text-center">
        <h1 className="font-display text-xl font-semibold tracking-tight">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. Try again or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#0A175A] px-5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(10,23,90,.16)]"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-input bg-white px-5 text-sm font-bold"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover",
      },
      { name: "theme-color", content: "#0A175A" },
      { title: "Scholaport" },
      {
        name: "description",
        content:
          "Your student-owned academic passport for translating transcripts, mapping credits, and graduating on time.",
      },
      { name: "author", content: "Scholaport" },
      { property: "og:title", content: "Scholaport — Your academic passport" },
      {
        property: "og:description",
        content:
          "Translate transcripts, map credits, and cross into your new school system with confidence.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function subscribeToNetwork(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getNetworkSnapshot() {
  return navigator.onLine;
}

function getServerNetworkSnapshot() {
  return true;
}

function NetworkBanner() {
  const isOnline = useSyncExternalStore(subscribeToNetwork, getNetworkSnapshot, getServerNetworkSnapshot);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-center gap-2 bg-[#E65234] px-4 py-2 text-sm font-bold text-white shadow-[0_4px_12px_rgba(230,82,52,0.3)] animate-in slide-in-from-top-full duration-300">
      <AlertCircle className="h-4 w-4" />
      <span>No internet connection. Please check your network.</span>
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
      <NetworkBanner />
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}

function AuthGate() {
  const { profile } = useAuth();
  const { preferences } = useInterfacePreferences(profile?.user_id, profile?.preferred_language);
  return (
    <I18nProvider language={preferences.language}>
      <AuthGateContent />
    </I18nProvider>
  );
}

function AuthGateContent() {
  const { configured, loading, user, profile, error, retryAuth, returnToSignIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === "/app/login";
  const isWelcome = location.pathname === "/";
  const isOnboarding = location.pathname === "/app/onboarding";
  const isProfile = location.pathname === "/app/profile" || location.pathname === "/app/settings";
  const profileUnsupportedForMvp = profile
    ? getMvpProfileUnsupportedReasons(profile).length > 0
    : false;

  useEffect(() => {
    if (isWelcome) return;
    if (!configured || loading || error) return;
    if (!user && !isLogin) {
      void navigate({ to: "/app/login", replace: true });
      return;
    }
    if (user && !profile && !isOnboarding) {
      void navigate({ to: "/app/onboarding", replace: true });
      return;
    }
    if (user && profile && profileUnsupportedForMvp && !isOnboarding && !isProfile) {
      void navigate({ to: "/app/onboarding", replace: true });
      return;
    }
    if (user && profile && !profileUnsupportedForMvp && (isLogin || isOnboarding)) {
      void navigate({ to: "/app", replace: true });
    }
  }, [
    configured,
    loading,
    error,
    user,
    profile,
    profileUnsupportedForMvp,
    isLogin,
    isOnboarding,
    isProfile,
    isWelcome,
    navigate,
  ]);

  // The public product page should remain reachable even when local auth is offline.
  if (isWelcome) return <Outlet />;

  if (!configured) {
    return (
      <FullPageStatus
        title="Connect Scholaport to Supabase"
        description="Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local, then restart the development server. Scholaport does not use demo data when the backend is unavailable."
      />
    );
  }
  if (loading)
    return (
      <FullPageStatus
        title="Opening your passport…"
        description="Verifying your secure session and profile."
      />
    );
  if (error)
    return (
      <FullPageStatus
        title="We couldn't reach your passport"
        description={
          error.toLowerCase().includes("failed to fetch")
            ? "The secure account service is not reachable right now. Check your connection, then retry—or return to sign in to clear a stale session."
            : error
        }
      >
        <button
          type="button"
          onClick={retryAuth}
          className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#0A175A] px-5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(10,23,90,.16)] transition-transform active:translate-y-1 active:shadow-none"
        >
          Try again
        </button>
        <button
          type="button"
          onClick={() => {
            void returnToSignIn().finally(() => window.location.assign("/app/login"));
          }}
          className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[#CDD3DE] bg-white px-5 text-sm font-bold text-[#0A175A]"
        >
          Return to sign in
        </button>
      </FullPageStatus>
    );
  if (
    (!user && !isLogin) ||
    (user && !profile && !isOnboarding) ||
    (user && profile && profileUnsupportedForMvp && !isOnboarding && !isProfile) ||
    (user && profile && !profileUnsupportedForMvp && (isLogin || isOnboarding))
  ) {
    return (
      <FullPageStatus title="Taking you to the right place…" description="Your session is ready." />
    );
  }
  return <Outlet />;
}

function FullPageStatus({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="grid min-h-dvh place-items-center bg-background px-5">
      <div className="flex max-w-lg flex-col items-center text-center">
        <ScholaportLogo className="h-16" animatedLoader={true} />
        <h1 className="mt-8 font-display text-2xl font-bold tracking-[-0.04em] text-[#0A175A]">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#5A6380]">{description}</p>
        {children ? (
          <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>
        ) : null}
      </div>
    </div>
  );
}
