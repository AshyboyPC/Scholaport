import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";
import "@fontsource/noto-sans-devanagari/400.css";
import "@fontsource/noto-sans-devanagari/600.css";
import "@fontsource/noto-sans-tamil/400.css";
import "@fontsource/noto-sans-tamil/600.css";
import "@fontsource/noto-sans-telugu/400.css";
import "@fontsource/noto-sans-telugu/600.css";
import "@/styles.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { createRoot, type Root } from "react-dom/client";
import { VisualQaAuthProvider } from "@/components/AuthProvider";
import { GlassSurface } from "@/components/journey/GlassSurface";
import { Toaster } from "@/components/ui/sonner";
import { useInterfacePreferences } from "@/hooks/use-interface-preferences";
import {
  DEFAULT_ACADEMIC_PASSPORT_PREFERENCES,
  saveAcademicPassportPreferences,
} from "@/lib/academic-passport";
import { DEFAULT_PORI_PREFERENCES, PORI_BUILDER_STEPS } from "@/lib/pori";
import { I18nProvider } from "@/lib/i18n";
import {
  visualQaCourses,
  visualQaDestinationCountries,
  visualQaGapPayload,
  visualQaGuideArticle,
  visualQaGuideTopics,
  visualQaMappings,
  visualQaPacketPayload,
  visualQaPassport,
  visualQaProfile,
  visualQaReferenceCoverage,
  visualQaReview,
  visualQaRoadmapPayload,
  visualQaSourceCountries,
  visualQaSourceJurisdictions,
  visualQaUser,
} from "@/dev/visual-qa-fixtures";
import { Route as AdvisorRoute } from "@/routes/advisor";
import { Route as GapsRoute } from "@/routes/gaps";
import { Route as GuideRoute } from "@/routes/guide";
import { Route as HomeRoute } from "@/routes/index";
import { Route as LoginRoute } from "@/routes/login";
import { Route as OnboardingRoute } from "@/routes/onboarding";
import { Route as PacketRoute } from "@/routes/packet";
import { Route as PoriRoute } from "@/routes/pori";
import { Route as ProfileRoute } from "@/routes/profile";
import { Route as PathMatchRoute } from "@/routes/pathmatch";
import { Route as ReferenceCoverageRoute } from "@/routes/reference-coverage";
import { Route as RoadmapRoute } from "@/routes/roadmap";
import { Route as SettingsRoute } from "@/routes/settings";
import { Route as TranscriptRoute } from "@/routes/transcript";
import { Route as TwinsRoute } from "@/routes/twins";

declare global {
  interface Window {
    __scholaportVisualQaRoot?: Root;
  }
}

function VisualQaExperience() {
  const { preferences } = useInterfacePreferences(
    visualQaProfile.user_id,
    visualQaProfile.preferred_language,
  );

  return (
    <I18nProvider language={preferences.language}>
      <Outlet />
      <GlassSurface
        variant="control"
        className="fixed right-16 top-4 z-[90] grid h-8 min-w-8 place-items-center rounded-full px-2 text-[9px] font-black uppercase tracking-[0.14em] text-[#59647A] sm:right-3 sm:top-3 sm:block sm:h-auto sm:px-3 sm:py-2"
        data-print-hidden="true"
      >
        <span className="sm:hidden">QA</span>
        <span className="hidden sm:inline">Visual QA fixtures · not a student account</span>
      </GlassSurface>
      <Toaster position="top-center" richColors />
    </I18nProvider>
  );
}

const rootNode = document.getElementById("visual-qa-root");
if (!rootNode) throw new Error("Visual QA root was not found.");

if (!import.meta.env.DEV) {
  rootNode.textContent = "The ScholaPort visual QA harness is disabled outside development.";
} else {
  const fixtureTimestamp = "2026-07-21T18:00:00.000Z";
  saveAcademicPassportPreferences(
    visualQaProfile.user_id,
    {
      ...structuredClone(DEFAULT_ACADEMIC_PASSPORT_PREFERENCES),
      completionState: "saved",
      lastCompletedStep: 4,
      savedAt: fixtureTimestamp,
      updatedAt: fixtureTimestamp,
      pori: {
        ...structuredClone(DEFAULT_PORI_PREFERENCES),
        status: "complete",
        completedSteps: [...PORI_BUILDER_STEPS],
        firstIncompleteStep: "review",
        updatedAt: fixtureTimestamp,
      },
    },
    window.localStorage,
  );

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { staleTime: Number.POSITIVE_INFINITY, retry: false, refetchOnWindowFocus: false },
      mutations: { retry: false },
    },
  });

  queryClient.setQueryData(["passport-summary"], visualQaPassport);
  queryClient.setQueryData(["transcript-courses"], visualQaCourses);
  queryClient.setQueryData(["credit-mappings"], visualQaMappings);
  queryClient.setQueryData(["transcript-review"], visualQaReview);
  queryClient.setQueryData(["gap-analysis"], visualQaGapPayload);
  queryClient.setQueryData(["roadmap"], visualQaRoadmapPayload);
  queryClient.setQueryData(["counselor-packet"], visualQaPacketPayload);
  queryClient.setQueryData(["guide-topics"], visualQaGuideTopics);
  visualQaGuideTopics.forEach((topic) =>
    queryClient.setQueryData(["guide-article", topic.id], {
      ...visualQaGuideArticle,
      topic_id: topic.id,
      title: topic.title,
    }),
  );
  queryClient.setQueryData(["reference-coverage"], visualQaReferenceCoverage);
  queryClient.setQueryData(["source-countries"], visualQaSourceCountries);
  queryClient.setQueryData(["destination-countries"], visualQaDestinationCountries);
  queryClient.setQueryData(
    ["source-jurisdictions", visualQaSourceCountries[0].id],
    visualQaSourceJurisdictions,
  );

  const rootRoute = createRootRoute({
    component: () => (
      <QueryClientProvider client={queryClient}>
        <VisualQaAuthProvider profile={visualQaProfile} user={visualQaUser}>
          <VisualQaExperience />
        </VisualQaAuthProvider>
      </QueryClientProvider>
    ),
  });

  const routeDefinitions = [
    ["/", HomeRoute.options.component!],
    ["/login", LoginRoute.options.component!],
    ["/onboarding", OnboardingRoute.options.component!],
    ["/transcript", TranscriptRoute.options.component!],
    ["/gaps", GapsRoute.options.component!],
    ["/roadmap", RoadmapRoute.options.component!],
    ["/packet", PacketRoute.options.component!],
    ["/pori", PoriRoute.options.component!],
    ["/profile", ProfileRoute.options.component!],
    ["/settings", SettingsRoute.options.component!],
    ["/guide", GuideRoute.options.component!],
    ["/reference-coverage", ReferenceCoverageRoute.options.component!],
    ["/pathmatch", PathMatchRoute.options.component!],
    ["/twins", TwinsRoute.options.component!],
    ["/advisor", AdvisorRoute.options.component!],
  ] as const;

  const routes = routeDefinitions.map(([path, component]) =>
    createRoute({ getParentRoute: () => rootRoute, path, component }),
  );
  const requestedRoute = new URLSearchParams(window.location.search).get("route") ?? "/";
  const allowedRoute = routeDefinitions.some(([path]) => path === requestedRoute)
    ? requestedRoute
    : "/";
  const router = createRouter({
    routeTree: rootRoute.addChildren(routes),
    history: createMemoryHistory({ initialEntries: [allowedRoute] }),
    context: { queryClient },
    defaultPreloadStaleTime: Number.POSITIVE_INFINITY,
  });

  const reactRoot = window.__scholaportVisualQaRoot ?? createRoot(rootNode);
  window.__scholaportVisualQaRoot = reactRoot;
  reactRoot.render(<RouterProvider router={router} />);
}
