import { Link, useLocation } from "@tanstack/react-router";
import { Menu, MoreHorizontal, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import {
  PremiumAdvisorIcon,
  PremiumGapIcon,
  PremiumHomeIcon,
  PremiumPacketIcon,
  PremiumPathMatchIcon,
  PremiumProfileIcon,
  PremiumRoadmapIcon,
  PremiumSettingsIcon,
  PremiumShieldIcon,
  PremiumTranscriptIcon,
  PremiumTwinIcon,
} from "@/components/icons/PremiumIcon";
import { ScholaportLogo } from "@/components/ScholaportLogo";
import { GlassSurface } from "@/components/journey/GlassSurface";
import { PassportEmblem } from "@/components/passport/AcademicPassport";
import { useAcademicPassportPreferences } from "@/hooks/use-academic-passport";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type NavItem = {
  to: string;
  label: string;
  icon: typeof PremiumHomeIcon;
  comingSoon?: boolean;
};

const journeyNav: NavItem[] = [
  { to: "/", label: "Home", icon: PremiumHomeIcon },
  { to: "/transcript", label: "Transcript", icon: PremiumTranscriptIcon },
  { to: "/gaps", label: "Gaps", icon: PremiumGapIcon },
  { to: "/roadmap", label: "Roadmap", icon: PremiumRoadmapIcon },
  { to: "/packet", label: "Packet", icon: PremiumPacketIcon },
];

const moreNav: NavItem[] = [
  { to: "/advisor", label: "Advisor", icon: PremiumAdvisorIcon, comingSoon: true },
  { to: "/pathmatch", label: "PathMatch", icon: PremiumPathMatchIcon, comingSoon: true },
  { to: "/twins", label: "Twin Connect", icon: PremiumTwinIcon, comingSoon: true },
  { to: "/profile", label: "Profile", icon: PremiumProfileIcon },
  { to: "/settings", label: "Settings", icon: PremiumSettingsIcon },
];

export function PassportShell({
  children,
  eyebrow,
  title,
  description,
  action,
}: {
  children: React.ReactNode;
  eyebrow?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useI18n();
  const location = useLocation();
  const { profile } = useAuth();
  const { preferences: passportPreferences } = useAcademicPassportPreferences(profile?.user_id);
  const displayName = profile
    ? [profile.first_name, profile.last_name].filter(Boolean).join(" ")
    : "ScholaPort student";

  return (
    <div
      className="journey-canvas text-[#0A175A]"
      data-route={location.pathname}
      data-passport-base-color={passportPreferences.baseColor}
      data-passport-mark={passportPreferences.mark}
    >
      <GlassSurface
        as="aside"
        variant="navigation"
        className="fixed bottom-6 left-6 top-6 z-40 hidden w-[92px] flex-col items-center rounded-[32px] px-2 py-3 lg:flex"
        data-print-hidden="true"
      >
        <Link
          to="/"
          aria-label="ScholaPort home"
          className="grid h-14 w-14 place-items-center rounded-[19px] bg-[#0A175A] shadow-[0_8px_20px_rgba(10,23,90,.22)]"
        >
          <ScholaportLogo className="h-10" inverse />
        </Link>
        <Link
          to="/profile"
          aria-label="Open profile and Academic Passport"
          className="passport-nav-mark mt-3"
          title="Profile"
        >
          <PassportEmblem />
        </Link>
        <nav
          aria-label={t("Academic journey")}
          className="mt-4 flex w-full flex-1 flex-col gap-1 overflow-y-auto"
        >
          {journeyNav.map((item) => (
            <RailLink key={item.to} item={item} pathname={location.pathname} />
          ))}
          <span className="mx-auto my-1 h-px w-10 bg-[#DDE4E5]" />
          {moreNav
            .filter((item) => item.comingSoon)
            .map((item) => (
              <RailLink key={item.to} item={item} pathname={location.pathname} />
            ))}
        </nav>
        <div className="grid gap-1">
          <Link
            to="/profile"
            aria-label={t("Profile")}
            className={cn(
              "grid h-12 w-12 place-items-center rounded-2xl text-[#83909D] hover:bg-white hover:text-[#0A175A]",
              location.pathname.startsWith("/profile") && "bg-[#0A175A] text-white",
            )}
          >
            <PremiumProfileIcon className="h-5 w-5" />
          </Link>
          <Link
            to="/settings"
            aria-label={t("Settings")}
            className={cn(
              "grid h-12 w-12 place-items-center rounded-2xl text-[#83909D] hover:bg-white hover:text-[#0A175A]",
              location.pathname.startsWith("/settings") && "bg-[#0A175A] text-white",
            )}
          >
            <PremiumSettingsIcon className="h-5 w-5" />
          </Link>
        </div>
      </GlassSurface>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" data-print-hidden="true">
          <button
            aria-label={t("Dismiss navigation")}
            className="absolute inset-0 bg-[#07113F]/45 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <GlassSurface
            as="aside"
            variant="overlay"
            className="relative m-3 flex h-[calc(100%-24px)] w-[min(88vw,350px)] flex-col overflow-hidden rounded-[30px] p-4"
          >
            <div className="flex items-center justify-between px-1 pb-4">
              <ScholaportLogo className="h-10" showWordmark />
              <button
                aria-label={t("Close navigation")}
                className="grid h-11 w-11 place-items-center rounded-2xl bg-[#E8EFED]"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-4 flex items-center gap-3 rounded-[22px] bg-[#0A175A] p-3.5 text-white">
              <span className="passport-nav-mark">
                <PassportEmblem />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{displayName}</p>
                <p className="mt-0.5 text-[11px] text-white/55">{t("Academic journey")}</p>
              </div>
            </div>
            <nav
              className="grid flex-1 content-start gap-1 overflow-y-auto"
              aria-label="All destinations"
            >
              {[...journeyNav, ...moreNav].map((item) => (
                <DrawerLink
                  key={item.to}
                  item={item}
                  pathname={location.pathname}
                  onNavigate={() => setMobileOpen(false)}
                />
              ))}
            </nav>
          </GlassSurface>
        </div>
      )}

      <div className="lg:pl-[122px]">
        <header
          className="mx-auto flex max-w-[1500px] items-center gap-3 px-4 pb-1 pt-4 sm:px-6 lg:px-8 lg:pt-6"
          data-print-hidden="true"
        >
          <GlassSurface
            as="button"
            variant="control"
            className="grid h-11 w-11 place-items-center rounded-2xl lg:hidden"
            aria-label={t("Open navigation")}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </GlassSurface>
          <ScholaportLogo className="h-9 lg:hidden" showWordmark />
          <GlassSurface className="ml-auto hidden items-center gap-2 rounded-full py-1.5 pl-3.5 pr-1.5 text-xs font-bold text-[#59647A] sm:flex">
            <PremiumShieldIcon className="h-4 w-4 text-[#01A995]" />
            {t("Your private workspace")}
            <span className="passport-nav-mark !h-9 !w-9 !rounded-[13px]">
              <PassportEmblem />
            </span>
          </GlassSurface>
          <GlassSurface
            as="button"
            variant="control"
            className="ml-auto grid h-11 w-11 place-items-center rounded-2xl lg:hidden"
            aria-label="Open all navigation"
            onClick={() => setMobileOpen(true)}
          >
            <MoreHorizontal className="h-5 w-5" />
          </GlassSurface>
        </header>

        <main className="journey-main mx-auto min-h-[calc(100dvh-72px)] max-w-[1500px] px-4 pb-40 pt-7 sm:px-6 lg:px-8 lg:pb-14 lg:pt-8">
          {(title || eyebrow || description || action) && (
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-4xl">
                {eyebrow && (
                  <p className="journey-eyebrow !text-[#01A995] !opacity-100">{t(eyebrow)}</p>
                )}
                {title && (
                  <h1 className="font-display text-[clamp(2rem,4vw,3.4rem)] font-bold leading-[1.02] tracking-[-0.055em] text-[#0A175A] text-balance">
                    {t(title)}
                  </h1>
                )}
                {description && (
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-[#59647A] sm:text-base">
                    {t(description)}
                  </p>
                )}
              </div>
              {action && <div className="shrink-0">{action}</div>}
            </div>
          )}
          <div className="passport-enter">{children}</div>
        </main>
      </div>

      <GlassSurface
        as="nav"
        variant="navigation"
        className="fixed inset-x-3 bottom-[max(.75rem,env(safe-area-inset-bottom))] z-40 grid grid-cols-5 rounded-[24px] p-1.5 lg:hidden"
        aria-label={t("Academic journey")}
        data-print-hidden="true"
      >
        {journeyNav.map((item) => {
          const active = isActive(location.pathname, item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-[18px] px-1 text-[9px] font-bold transition",
                active
                  ? "bg-[#0A175A] text-white shadow-[0_6px_16px_rgba(10,23,90,.2)]"
                  : "text-[#83909D]",
              )}
            >
              <Icon className="h-[19px] w-[19px]" />
              {t(item.label)}
            </Link>
          );
        })}
      </GlassSurface>
    </div>
  );
}

function isActive(pathname: string, to: string) {
  return to === "/" ? pathname === "/" : pathname.startsWith(to);
}

function RailLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const { t } = useI18n();
  const active = isActive(pathname, item.to);
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      aria-label={t(item.label)}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex min-h-[58px] w-full flex-col items-center justify-center gap-1 rounded-[20px] text-[9px] font-bold text-[#83909D]",
        active && "bg-[#0A175A] text-white shadow-[0_8px_20px_rgba(10,23,90,.22)]",
      )}
    >
      <Icon className="h-[19px] w-[19px]" />
      <span>{t(item.label)}</span>
      {active && (
        <i className="absolute -right-1 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-[#F86746]" />
      )}
    </Link>
  );
}

function DrawerLink({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  onNavigate: () => void;
}) {
  const { t } = useI18n();
  const active = isActive(pathname, item.to);
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      className={cn(
        "flex min-h-12 items-center gap-3 rounded-2xl px-3 text-sm font-bold",
        active ? "bg-[#01C3AD] text-[#07113F]" : "text-[#59647A] hover:bg-[#E8EFED]",
      )}
    >
      <Icon className="h-[18px] w-[18px]" />
      {t(item.label)}
      {item.comingSoon && (
        <span className="ml-auto rounded-full bg-[#0A175A]/8 px-2 py-1 text-[9px] uppercase tracking-wider text-[#59647A]">
          {t("Soon")}
        </span>
      )}
    </Link>
  );
}

export function StatusPill({
  children,
  tone = "teal",
}: {
  children: React.ReactNode;
  tone?: "teal" | "navy" | "coral" | "gray" | "yellow" | "mint";
}) {
  const tones = {
    teal: "bg-[#01C3AD]/14 text-[#017E71]",
    navy: "bg-[#0A175A]/8 text-[#0A175A]",
    coral: "bg-[#F86746]/12 text-[#C7462D]",
    gray: "bg-[#E8EFED] text-[#59647A]",
    yellow: "bg-[#F4C85A]/25 text-[#765A00]",
    mint: "bg-[#BFEBDD] text-[#175F50]",
  };
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-full px-3 py-1 text-[11px] font-extrabold",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
