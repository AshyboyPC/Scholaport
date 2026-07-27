import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  CircleX,
  Globe2,
  GraduationCap,
  MapPin,
  Route,
  Smartphone,
  UserRoundPlus,
} from "lucide-react";
import ExpandCards from "@/components/ui/expand-cards";
import betaRouteArt from "@/assets/images/release-path-3d/beta-route-v2.png";
import betaVerticalRouteArt from "@/assets/images/release-path-3d/beta-vertical-route.png";
import mvp2MobileArt from "@/assets/images/release-path-3d/mvp2-mobile-v3.png";
import poriMascot from "@/assets/pori-mascot.png";

gsap.registerPlugin(ScrollTrigger);

type ReleaseView = "neutral" | "beta" | "mvp2";
type CountdownTone = "light" | "teal" | "ink";

const BETA_TARGET = new Date("2026-07-28T00:00:00-04:00");
const MVP2_TARGET = new Date("2026-09-28T00:00:00-04:00");
const INITIAL_COUNTDOWN_NOW = new Date("2026-07-26T00:00:00-04:00").getTime();
const APP_LOGIN_URL = import.meta.env.VITE_APP_URL?.trim()
  ? `${import.meta.env.VITE_APP_URL.trim().replace(/\/+$/, "")}/app/login`
  : "/app/login";

const includedBetaFeatures = [
  "Student onboarding",
  "Private transcript upload",
  "Transcript extraction and translation",
  "Student course review and confirmation",
  "Probable credit mapping",
  "Graduation-gap preview",
  "Academic roadmap",
  "Printable counselor packet",
  "Academic Passport customization",
  "Pori customization",
  "Level progression",
];

const excludedBetaFeatures = [
  "CBSE and other Indian boards",
  "Other U.S. state frameworks",
  "Additional source or destination countries",
  "Official transcript evaluation",
  "Official credit or graduation decisions",
  "AI Advisor",
  "PathMatch",
  "Twin Connect",
];

function getRemaining(target: Date, now: number) {
  const total = Math.max(0, target.getTime() - now);
  const days = Math.ceil(total / 86_400_000);

  return {
    total,
    days,
    hours: Math.floor((total / 3_600_000) % 24),
    minutes: Math.floor((total / 60_000) % 60),
    seconds: Math.floor((total / 1_000) % 60),
  };
}

function LiveCountdown({
  target,
  now,
  tone,
  compact = false,
}: {
  target: Date;
  now: number;
  tone: CountdownTone;
  compact?: boolean;
}) {
  const remaining = getRemaining(target, now);

  if (remaining.total === 0) {
    return <div className={`release-count release-count--${tone}`}>LIVE NOW</div>;
  }

  return (
    <div
      className={`release-count release-count--${tone}${compact ? " release-count--compact" : ""}`}
      aria-label={`${remaining.days} days, ${remaining.hours} hours, ${remaining.minutes} minutes, and ${remaining.seconds} seconds remaining`}
    >
      <RollingNumber value={remaining.days} minDigits={2} className="release-count__number" />
      <span className="release-count__unit" aria-hidden="true">
        DAYS
      </span>
      <div className="release-count__clock" aria-hidden="true">
        <TickerUnit value={remaining.hours} label="HR" />
        <span className="release-count__separator">:</span>
        <TickerUnit value={remaining.minutes} label="MIN" />
        <span className="release-count__separator">:</span>
        <TickerUnit value={remaining.seconds} label="SEC" />
      </div>
    </div>
  );
}

function RollingNumber({
  value,
  minDigits = 2,
  className = "",
}: {
  value: number;
  minDigits?: number;
  className?: string;
}) {
  const previousRef = useRef(value);
  const previous = previousRef.current;
  const currentDigits = String(value).padStart(minDigits, "0").split("");
  const previousDigits = String(previous).padStart(currentDigits.length, "0").split("");

  useEffect(() => {
    previousRef.current = value;
  }, [value]);

  return (
    <span className={`release-odometer ${className}`} aria-hidden="true">
      {currentDigits.map((digit, index) => {
        const previousDigit = previousDigits[index] ?? "0";
        const changed = previousDigit !== digit;

        return (
          <span className="release-odometer__window" key={index}>
            <span
              key={`${previousDigit}-${digit}`}
              className={`release-odometer__reel${changed ? " release-odometer__reel--rolling" : " release-odometer__reel--steady"}`}
            >
              <span>{previousDigit}</span>
              <span>{digit}</span>
            </span>
          </span>
        );
      })}
    </span>
  );
}

function TickerUnit({ value, label }: { value: number; label: string }) {
  return (
    <span className="release-ticker-unit">
      <RollingNumber value={value} minDigits={2} />
      <small>{label}</small>
    </span>
  );
}

function ReleaseDate({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div className={`release-date${dark ? " release-date--dark" : ""}`}>
      <CalendarDays aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

export function ReleasePathSection() {
  const [view, setView] = useState<ReleaseView>("neutral");
  const [now, setNow] = useState(INITIAL_COUNTDOWN_NOW);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const transitionLockRef = useRef(false);
  const floatingTweenRef = useRef<gsap.core.Tween | null>(null);
  const betaReleased = now >= BETA_TARGET.getTime();

  const startFloatingArtwork = useCallback(() => {
    const artwork = sectionRef.current?.querySelectorAll("[data-release-art]");
    if (!artwork?.length) return;

    floatingTweenRef.current?.kill();
    floatingTweenRef.current = gsap.to(artwork, {
      y: -5,
      duration: 3.8,
      repeat: -1,
      yoyo: true,
      stagger: 0.18,
      ease: "sine.inOut",
    });
  }, []);

  const morphTo = useCallback(
    (nextView: ReleaseView) => {
      const root = sectionRef.current;
      if (!root || transitionLockRef.current || nextView === view) return;

      const selectedView = nextView === "neutral" ? view : nextView;
      const closedMask =
        selectedView === "beta"
          ? "inset(0 51% 0 0 round 30px)"
          : "inset(0 0 0 51% round 30px)";
      const openMask = "inset(0 0% 0 0% round 30px)";

      transitionLockRef.current = true;
      setIsTransitioning(true);
      floatingTweenRef.current?.kill();

      const finishTransition = () => {
        transitionLockRef.current = false;
        setIsTransitioning(false);
        startFloatingArtwork();
      };

      if (nextView === "neutral") {
        const surface = root.querySelector<HTMLElement>("[data-release-surface]");
        if (!surface) {
          flushSync(() => setView("neutral"));
          finishTransition();
          return;
        }

        gsap
          .timeline({
            defaults: { overwrite: true },
            onComplete: () => {
              flushSync(() => setView("neutral"));
              finishTransition();
            },
          })
          .to(
            surface,
            {
              clipPath: closedMask,
              duration: 0.18,
              ease: "power2.inOut",
            },
            0,
          );
        return;
      }

      flushSync(() => setView(nextView));
      const surface = root.querySelector<HTMLElement>("[data-release-surface]");
      if (!surface) {
        finishTransition();
        return;
      }

      const details = surface.querySelectorAll<HTMLElement>("[data-release-detail]");
      gsap.set(surface, { clipPath: closedMask, willChange: "clip-path" });
      gsap.set(details, { opacity: 0, y: 10 });

      gsap
        .timeline({
          defaults: { overwrite: true },
          onComplete: () => {
            gsap.set(surface, { clearProps: "clipPath,willChange" });
            gsap.set(details, { clearProps: "opacity,transform" });
            finishTransition();
          },
        })
        .to(surface, {
          clipPath: openMask,
          duration: 0.28,
          ease: "expo.out",
        })
        .to(
          details,
          {
            opacity: 1,
            y: 0,
            duration: 0.12,
            stagger: 0.006,
            ease: "power2.out",
          },
          0.03,
        );
    },
    [startFloatingArtwork, view],
  );

  useEffect(() => {
    [betaVerticalRouteArt, mvp2MobileArt, poriMascot].forEach((src) => {
      const image = new Image();
      image.decoding = "async";
      image.src = src;
      void image.decode?.().catch(() => undefined);
    });
  }, []);

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1_000);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && view !== "neutral") morphTo("neutral");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [morphTo, view]);

  useEffect(() => {
    if (!betaReleased) return;

    floatingTweenRef.current?.kill();
    if (view !== "neutral" && !transitionLockRef.current) {
      setView("neutral");
    }
    startFloatingArtwork();
  }, [betaReleased, startFloatingArtwork, view]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const eyebrow = section.querySelector(".release-eyebrow");
        const surfaces = section.querySelectorAll("[data-flip-id]");
        const artwork = section.querySelectorAll("[data-release-art]");
        const seamArrow = section.querySelector(".release-neutral__seam-arrow");
        const milestoneBanner = section.querySelector(".release-milestone-banner");
        const timeline = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            once: true,
          },
        });

        if (eyebrow) {
          timeline.fromTo(
            eyebrow,
            { autoAlpha: 0, y: 12, scale: 0.96 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.48 },
          );
        }

        if (surfaces.length) {
          timeline.fromTo(
            surfaces,
            { autoAlpha: 0, y: 42, scale: 0.97 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.78,
              stagger: 0.12,
              ease: "expo.out",
            },
            0.08,
          );
        }

        if (artwork.length) {
          timeline.fromTo(
            artwork,
            { autoAlpha: 0, y: 24, scale: 0.94 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              stagger: 0.1,
              ease: "power3.out",
            },
            0.24,
          );
        }

        if (seamArrow) {
          timeline.fromTo(
            seamArrow,
            { autoAlpha: 0, scale: 0.62, rotation: -24 },
            {
              autoAlpha: 1,
              scale: 1,
              rotation: 0,
              duration: 0.52,
              ease: "back.out(1.45)",
            },
            0.46,
          );
        }

        if (milestoneBanner) {
          timeline.fromTo(
            milestoneBanner,
            { autoAlpha: 0, y: 12 },
            { autoAlpha: 1, y: 0, duration: 0.48, ease: "power3.out" },
            0.42,
          );
        }

        timeline.call(startFloatingArtwork);

        return () => {
          timeline.kill();
          floatingTweenRef.current?.kill();
        };
      });

      return () => {
        media.revert();
        floatingTweenRef.current?.kill();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="release-path"
      className={`release-section${isTransitioning ? " release-section--transitioning" : ""}`}
      aria-label="ScholaPort release path"
    >
      <div className="release-shell">
        {betaReleased ? (
          <PostBetaRelease now={now} />
        ) : view === "neutral" ? (
          <NeutralReleaseCards now={now} onExpand={morphTo} />
        ) : view === "beta" ? (
          <ExpandedBeta now={now} onClose={() => morphTo("neutral")} />
        ) : (
          <ExpandedMvp2 now={now} onClose={() => morphTo("neutral")} />
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {betaReleased
          ? "Private Beta 1.0 is released. The full MVP 2.0 release card is visible."
          : view === "neutral"
            ? "Both release cards are visible."
            : `${view === "beta" ? "Private Beta 1.0" : "MVP 2.0"} is fully expanded. Press Escape to return.`}
      </p>

      <style>{releaseStyles}</style>
    </section>
  );
}

function ReleaseCorner({
  side,
  icon,
}: {
  side: "left" | "right";
  icon: React.ReactNode;
}) {
  return (
    <span className={`release-card__corner release-card__corner--${side}`} aria-hidden="true">
      <svg viewBox="0 0 180 124" preserveAspectRatio="none">
        <path d="M0 124C34 116 40 91 46 68C54 36 77 18 105 16C136 14 158 7 180 0V124H0Z" />
      </svg>
      <span className="release-card__corner-icon">{icon}</span>
    </span>
  );
}

function NeutralReleaseCards({
  now,
  onExpand,
}: {
  now: number;
  onExpand: (view: ReleaseView) => void;
}) {
  return (
    <div data-release-surface className="release-neutral">
      <div className="release-eyebrow" data-release-detail>
        <Route aria-hidden="true" />
        <span>RELEASE PATH</span>
      </div>

      <div className="release-neutral__grid">
        <ExpandCards
          className="release-neutral__cards"
          onSelect={onExpand}
          items={[
            {
              id: "beta",
              ariaLabel: "Expand Private Beta 1.0",
              flipId: "release-beta",
              className: "release-card release-card--beta",
              content: (
                <>
                  <div className="release-card__content">
                    <div className="release-card__top" data-release-detail>
                      <div className="release-card__number">01</div>
                      <div className="release-card__heading">
                        <span className="release-card__label">PRIVATE BETA 1.0</span>
                        <h3>Deliberately narrow so the first release can be accurate.</h3>
                      </div>
                    </div>
                    <div className="release-card__rule" />
                    <div className="release-card__date-block" data-release-detail>
                      <ReleaseDate dark>Launch target · July 28, 2026</ReleaseDate>
                      <LiveCountdown target={BETA_TARGET} now={now} tone="light" compact />
                      <div className="release-card__chips">
                        <span>WEB BETA</span>
                        <span>INDIA → U.S.</span>
                        <span>4 VERIFIED ROUTES</span>
                      </div>
                    </div>
                  </div>
                  <div className="release-card__art-zone" aria-hidden="true">
                    <img
                      data-release-art
                      src={betaRouteArt}
                      alt=""
                      className="release-card__art release-card__art--beta"
                    />
                  </div>
                  <div className="release-card__footer release-card__footer--beta">
                    <div><MapPin /> Tamil Nadu + Andhra Pradesh</div>
                    <div><MapPin /> Georgia + Texas</div>
                  </div>
                  <ReleaseCorner side="right" icon={<Route />} />
                </>
              ),
            },
            {
              id: "mvp2",
              ariaLabel: "Expand MVP 2.0",
              flipId: "release-mvp2",
              className: "release-card release-card--mvp2",
              content: (
                <>
                  <div className="release-card__content">
                    <div className="release-card__top" data-release-detail>
                      <div className="release-card__number">02</div>
                      <div className="release-card__heading">
                        <span className="release-card__label">NEXT RELEASE</span>
                        <h3>ScholaPort is being designed for iOS and Android.</h3>
                      </div>
                    </div>
                    <div className="release-card__rule" />
                    <div className="release-card__date-block" data-release-detail>
                      <ReleaseDate dark>Planned target · September 28, 2026</ReleaseDate>
                      <LiveCountdown target={MVP2_TARGET} now={now} tone="light" compact />
                      <div className="release-card__chips">
                        <span>iOS · PLANNED</span>
                        <span>ANDROID · PLANNED</span>
                        <span>ROUTES · IN VALIDATION</span>
                      </div>
                    </div>
                  </div>
                  <div className="release-card__art-zone" aria-hidden="true">
                    <img
                      data-release-art
                      src={mvp2MobileArt}
                      alt=""
                      className="release-card__art release-card__art--mvp2"
                    />
                  </div>
                  <div className="release-card__footer release-card__footer--mvp2">
                    <div><Smartphone /> iOS + Android</div>
                    <div><Globe2 /> Routes in validation</div>
                  </div>
                  <ReleaseCorner side="left" icon={<Smartphone />} />
                </>
              ),
            },
          ]}
        />

        <div className="release-neutral__seam-arrow" aria-hidden="true">
          <ArrowRight />
        </div>
      </div>
    </div>
  );
}

function PostBetaRelease({ now }: { now: number }) {
  return (
    <div className="release-post-beta">
      <ExpandedMvp2 now={now} />
      <div className="release-milestone-banner" role="status">
        <span className="release-milestone-banner__icon" aria-hidden="true">
          <Check />
        </span>
        <strong>BETA 1.0 RELEASED</strong>
        <time dateTime="2026-07-28">JULY 28, 2026</time>
      </div>
    </div>
  );
}

function ExpandedBeta({ now, onClose }: { now: number; onClose: () => void }) {
  const handleSurfaceClick = (event: React.MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("a, button")) return;
    onClose();
  };

  return (
    <article
      data-release-surface
      data-flip-id="release-beta"
      className="release-expanded release-expanded--beta"
      onClick={handleSurfaceClick}
    >
      <aside className="release-beta-intro">
        <button type="button" className="release-back release-back--light" onClick={onClose}>
          <ArrowLeft />
          <span className="sr-only">Return to both release cards</span>
        </button>

        <div className="release-beta-intro__copy" data-release-detail>
          <div className="release-expanded__eyebrow">
            PRIVATE BETA 1.0 <span>Beta</span>
          </div>
          <h2>Deliberately narrow so the first release can be accurate.</h2>
          <div className="release-expanded__accent" />
          <p>
            The first ScholaPort web beta supports a specific set of high-school transfer routes.
            Students outside these routes may join the expansion waitlist, but they will not yet
            receive the complete mapping, gap-analysis, and planning workflow.
          </p>
        </div>

        <div className="release-beta-intro__launch" data-release-detail>
          <ReleaseDate dark>Launch target · July 28, 2026</ReleaseDate>
          <LiveCountdown target={BETA_TARGET} now={now} tone="teal" />
          <a href={APP_LOGIN_URL} className="release-primary-cta">
            <UserRoundPlus />
            Open ScholaPort
          </a>
          <a href="#beta-access" className="release-text-link">
            Request a future route <ArrowRight />
          </a>
        </div>
      </aside>

      <div className="release-beta-scene">
        <img
          data-release-art
          src={betaVerticalRouteArt}
          alt="Clay academic route from India to the U.S."
          className="release-beta-scene__route"
        />
        <img src={poriMascot} alt="Pori" className="release-beta-scene__pori" />
      </div>

      <div className="release-beta-scope">
        <button type="button" className="release-back release-back--ink" onClick={onClose}>
          <ArrowLeft />
          <span>Back to both releases</span>
        </button>

        <div className="release-system-grid">
          <ScopeCard title="SUPPORTED SOURCE SYSTEMS">
            <ScopeLocation title="Tamil Nadu" icon="TN">
              State Board SSLC<br />State Board HSC
            </ScopeLocation>
            <ScopeLocation title="Andhra Pradesh" icon="AP">
              SSC<br />Intermediate
            </ScopeLocation>
          </ScopeCard>
          <ScopeCard title="SUPPORTED DESTINATION SYSTEMS">
            <ScopeLocation title="Georgia" icon="GA">
              Georgia High School<br />Graduation Requirements
            </ScopeLocation>
            <ScopeLocation title="Texas" icon="TX">
              Foundation High<br />School Program
            </ScopeLocation>
          </ScopeCard>
        </div>

        <div className="release-list-grid">
          <FeatureList title="INCLUDED IN BETA 1.0" items={includedBetaFeatures} included />
          <FeatureList title="NOT INCLUDED IN BETA 1.0" items={excludedBetaFeatures} />
        </div>

        <div className="release-beta-note" data-release-detail>
          <Globe2 />
          <p>
            Students with unsupported curricula or destination states can identify the route they
            need through the expansion waitlist.
          </p>
        </div>
      </div>
    </article>
  );
}

function ScopeCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="release-scope-card" data-release-detail>
      <h3>{title}</h3>
      <div>{children}</div>
    </section>
  );
}

function ScopeLocation({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="release-location">
      <span className="release-location__icon">{icon}</span>
      <p>
        <strong>{title}</strong>
        {children}
      </p>
    </div>
  );
}

function FeatureList({
  title,
  items,
  included = false,
}: {
  title: string;
  items: string[];
  included?: boolean;
}) {
  return (
    <section
      className={`release-feature-list${included ? " release-feature-list--included" : ""}`}
      data-release-detail
    >
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>
            {included ? <Check /> : <CircleX />}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ExpandedMvp2({ now, onClose }: { now: number; onClose?: () => void }) {
  const handleSurfaceClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!onClose || (event.target as HTMLElement).closest("a, button")) return;
    onClose();
  };

  return (
    <article
      data-release-surface
      data-flip-id="release-mvp2"
      className="release-expanded release-expanded--mvp2"
      onClick={onClose ? handleSurfaceClick : undefined}
    >
      <div className="release-mvp-scene">
        {onClose ? (
          <button type="button" className="release-back release-back--light" onClick={onClose}>
            <ArrowLeft />
            <span className="sr-only">Return to both release cards</span>
          </button>
        ) : null}
        <div className="release-mvp-scene__index" data-release-detail aria-hidden="true">
          <span>02</span>
          <div>
            <small>MOBILE WORKFLOW</small>
            <strong>Passport · Plan · Validate</strong>
          </div>
        </div>
        <img
          data-release-art
          src={mvp2MobileArt}
          alt="ScholaPort mobile Academic Passport and route-planning concept"
        />
      </div>

      <div className="release-mvp-copy">
        {onClose ? (
          <button type="button" className="release-back release-back--ink" onClick={onClose}>
            <ArrowLeft />
            <span>Back to both releases</span>
          </button>
        ) : null}

        <div className="release-expanded__eyebrow release-expanded__eyebrow--teal" data-release-detail>
          NEXT RELEASE
        </div>
        <div className="release-expanded__accent" />
        <h2 data-release-detail>ScholaPort is being designed for iOS and Android.</h2>
        <p data-release-detail>
          MVP 2.0 will extend the student-owned Academic Passport and planning workflow to mobile
          while introducing additional source and destination routes only after their reference
          coverage has been reviewed and validated.
        </p>

        <div className="release-mvp-launch" data-release-detail>
          <ReleaseDate>Planned target · September 28, 2026</ReleaseDate>
          <LiveCountdown target={MVP2_TARGET} now={now} tone="ink" />
        </div>

        <div className="release-status-list">
          <StatusRow icon={<Smartphone />} label="iOS" status="Planned" />
          <StatusRow icon={<Smartphone />} label="Android" status="Planned" />
          <StatusRow icon={<Globe2 />} label="Additional jurisdictions" status="In validation" waiting />
        </div>

        <div className="release-mvp-flow" data-release-detail>
          <FlowStep icon={<Globe2 />} label="ACADEMIC PASSPORT" />
          <ArrowRight />
          <FlowStep icon={<GraduationCap />} label="PLANNING WORKFLOW" />
          <ArrowRight />
          <FlowStep icon={<MapPin />} label="VALIDATED ROUTES" />
        </div>

        <a href="#beta-access" className="release-notify">
          <Bell />
          Notify me at validation
        </a>
        <span className="release-mvp-copy__corner" />
      </div>
    </article>
  );
}

function StatusRow({
  icon,
  label,
  status,
  waiting = false,
}: {
  icon: React.ReactNode;
  label: string;
  status: string;
  waiting?: boolean;
}) {
  return (
    <div className="release-status-row" data-release-detail>
      <span className={`release-status-row__icon${waiting ? " release-status-row__icon--waiting" : ""}`}>
        {icon}
      </span>
      <strong>{label}</strong>
      <span>· {status}</span>
      <span className={`release-status-row__mark${waiting ? " release-status-row__mark--waiting" : ""}`}>
        {waiting ? "○" : <Check />}
      </span>
    </div>
  );
}

function FlowStep({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="release-flow-step">
      <span>{icon}</span>
      <strong>{label}</strong>
    </div>
  );
}

const releaseStyles = `
  .release-section {
    width: 100%;
    padding: clamp(3rem, 6vw, 6rem) clamp(1rem, 3vw, 2rem);
    background: transparent;
    color: #0a175a;
  }

  .release-section--transitioning [data-release-surface] {
    pointer-events: none;
  }

  .release-shell {
    width: min(100%, 1400px);
    margin: 0 auto;
  }

  .release-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0 0 1.4rem 0.35rem;
    border-radius: 999px;
    padding: 0.48rem 0.86rem;
    color: #007f73;
    background: rgba(1, 169, 149, 0.11);
    box-shadow: 0 6px 18px rgba(1, 126, 116, 0.06);
    font-size: 0.69rem;
    font-weight: 850;
    letter-spacing: 0.13em;
    text-transform: uppercase;
  }

  .release-eyebrow svg {
    width: 0.95rem;
    height: 0.95rem;
    stroke-width: 2.2;
  }

  .release-neutral__grid {
    position: relative;
  }

  .release-neutral__cards {
    display: flex;
    gap: clamp(1rem, 2.4vw, 2.2rem);
    align-items: stretch;
  }

  .release-neutral__cards .release-card {
    flex: 1 1 0;
  }

  .release-neutral__cards[data-engaged-card="beta"] [data-expand-card="beta"],
  .release-neutral__cards[data-engaged-card="mvp2"] [data-expand-card="mvp2"] {
    flex-grow: 1.025;
  }

  .release-neutral__cards[data-engaged-card="beta"] [data-expand-card="mvp2"],
  .release-neutral__cards[data-engaged-card="mvp2"] [data-expand-card="beta"] {
    flex-grow: 0.975;
  }

  .release-post-beta .release-expanded {
    margin-top: 0;
  }

  .release-milestone-banner {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    min-height: 66px;
    margin-top: 0.85rem;
    border-radius: 18px;
    padding: 0.85rem 1.15rem;
    color: white;
    background: #0a175a;
    font-size: 0.74rem;
    font-weight: 820;
    letter-spacing: 0.08em;
  }

  .release-milestone-banner__icon {
    display: grid;
    place-items: center;
    width: 2.1rem;
    height: 2.1rem;
    flex: 0 0 auto;
    border-radius: 10px;
    color: #0a175a;
    background: #9ff2e6;
  }

  .release-milestone-banner__icon svg {
    width: 1rem;
    height: 1rem;
    stroke-width: 2.6;
  }

  .release-milestone-banner time {
    margin-left: auto;
    color: rgba(159, 242, 230, 0.82);
    font-size: 0.66rem;
    letter-spacing: 0.1em;
  }

  .release-card {
    position: relative;
    min-height: 670px;
    overflow: hidden;
    border: 0;
    border-radius: 30px;
    padding: clamp(1.7rem, 3vw, 2.7rem);
    color: white;
    text-align: left;
    box-shadow: 0 20px 45px rgba(6, 23, 61, 0.14);
    cursor: pointer;
    isolation: isolate;
    transition:
      flex-grow 240ms cubic-bezier(0.16, 1, 0.3, 1),
      transform 200ms cubic-bezier(0.16, 1, 0.3, 1),
      box-shadow 200ms ease;
  }

  .release-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 28px 64px rgba(33, 78, 100, 0.22);
  }

  .release-card:focus-visible {
    outline: 0;
    box-shadow:
      0 0 0 5px rgba(255, 249, 241, 0.96),
      0 0 0 9px rgba(44, 143, 137, 0.32),
      0 28px 64px rgba(33, 78, 100, 0.22);
  }

  .release-card--beta {
    background:
      radial-gradient(circle at 80% 30%, rgba(255, 249, 241, 0.23), transparent 32%),
      linear-gradient(145deg, #416f91 0%, #6f9fb9 58%, #9fc5d4 100%);
  }

  .release-card--mvp2 {
    background:
      radial-gradient(circle at 78% 27%, rgba(255, 249, 241, 0.2), transparent 35%),
      linear-gradient(145deg, #2f7379 0%, #5f9f9a 58%, #a4d1c7 100%);
  }

  .release-card__top {
    position: relative;
    z-index: 3;
    display: grid;
    grid-template-columns: 132px 1fr;
    gap: 1.25rem;
    align-items: center;
  }

  .release-card__content {
    position: absolute;
    z-index: 4;
    top: clamp(1.7rem, 3vw, 2.7rem);
    right: clamp(1.7rem, 3vw, 2.7rem);
    left: clamp(1.7rem, 3vw, 2.7rem);
  }

  .release-card__number {
    font-size: clamp(4.8rem, 7vw, 7.2rem);
    font-weight: 760;
    line-height: 0.82;
    letter-spacing: -0.08em;
  }

  .release-card__heading {
    min-width: 0;
  }

  .release-card__label {
    display: inline-flex;
    margin-bottom: 0.65rem;
    border-radius: 7px;
    padding: 0.42rem 0.72rem;
    background: rgba(31, 111, 117, 0.55);
    font-size: 0.76rem;
    font-weight: 850;
    letter-spacing: 0.08em;
  }

  .release-card__heading h3 {
    max-width: 430px;
    margin: 0;
    color: white;
    font-size: clamp(1.15rem, 1.8vw, 1.6rem);
    font-weight: 650;
    line-height: 1.14;
    letter-spacing: -0.025em;
  }

  .release-card__rule {
    position: relative;
    z-index: 3;
    height: 1px;
    margin: 1.55rem 0 1.25rem;
    background: rgba(255, 249, 241, 0.44);
  }

  .release-card__date-block {
    position: relative;
    z-index: 3;
  }

  .release-date {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    color: #008f8d;
    font-size: clamp(0.72rem, 1vw, 0.9rem);
    font-weight: 620;
  }

  .release-date--dark {
    color: rgba(255, 255, 255, 0.94);
  }

  .release-date svg {
    width: 1.2rem;
    height: 1.2rem;
    color: #00bba5;
  }

  .release-count {
    display: grid;
    grid-template-columns: max-content max-content 1fr;
    align-items: end;
    column-gap: 0.75rem;
    min-height: 5rem;
    margin-top: 0.6rem;
    font-weight: 850;
    line-height: 1;
    letter-spacing: -0.04em;
  }

  .release-count__number {
    font-size: clamp(3.8rem, 6vw, 6.2rem);
  }

  .release-count__unit {
    padding-bottom: 0.48rem;
    font-size: clamp(1.15rem, 1.8vw, 1.65rem);
    letter-spacing: 0.01em;
  }

  .release-odometer {
    display: inline-flex;
    font-variant-numeric: tabular-nums;
  }

  .release-odometer__window {
    display: inline-block;
    height: 0.92em;
    overflow: hidden;
    line-height: 0.92;
  }

  .release-odometer__reel {
    display: flex;
    height: 200%;
    flex-direction: column;
  }

  .release-odometer__reel > span {
    display: flex;
    height: 50%;
    align-items: center;
  }

  .release-odometer__reel--steady {
    transform: translateY(-50%);
  }

  .release-odometer__reel--rolling {
    animation: release-odometer-roll 720ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .release-count__clock {
    display: flex;
    align-items: center;
    align-self: center;
    justify-self: end;
    gap: 0.22rem;
    margin-left: 0.4rem;
    border-radius: 999px;
    padding: 0.38rem 0.55rem;
    background: rgba(255, 249, 241, 0.17);
    color: rgba(255, 255, 255, 0.94);
    letter-spacing: 0;
  }

  .release-ticker-unit {
    display: grid;
    justify-items: center;
    gap: 0.05rem;
    font-size: 0.74rem;
    line-height: 1;
  }

  .release-ticker-unit small {
    font-size: 0.38rem;
    font-weight: 750;
    letter-spacing: 0.08em;
    opacity: 0.68;
  }

  .release-count__separator {
    align-self: start;
    margin-top: 0.08rem;
    opacity: 0.45;
  }

  .release-count--compact {
    min-height: 3.8rem;
    margin-top: 0.4rem;
  }

  .release-count--compact .release-count__number {
    font-size: clamp(3rem, 4.8vw, 4.65rem);
  }

  .release-count--light .release-count__number {
    color: white;
  }

  .release-count--light .release-count__unit,
  .release-count--teal .release-count__number,
  .release-count--teal .release-count__unit {
    color: #00bba5;
  }

  .release-count--ink .release-count__number {
    color: #0ba18f;
  }

  .release-count--ink .release-count__unit {
    color: #0a175a;
  }

  .release-count--ink .release-count__clock {
    background: rgba(169, 216, 207, 0.34);
    color: #1f6f75;
  }

  .release-count--teal .release-count__clock {
    background: rgba(255, 249, 241, 0.12);
    color: rgba(255, 255, 255, 0.92);
  }

  .release-card__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.7rem;
  }

  .release-card__chips span {
    border: 0;
    border-radius: 7px;
    padding: 0.5rem 0.75rem;
    background: rgba(31, 111, 117, 0.5);
    color: white;
    font-size: 0.68rem;
    font-weight: 820;
    letter-spacing: 0.04em;
  }

  .release-card__art-zone {
    position: absolute;
    z-index: 1;
    inset: auto 0 86px;
    height: 280px;
    overflow: visible;
    pointer-events: none;
  }

  .release-card__art {
    position: absolute;
    max-width: none;
    filter: drop-shadow(0 22px 20px rgba(1, 14, 34, 0.26));
  }

  .release-card__art--beta {
    left: 10%;
    bottom: 0;
    width: 80%;
  }

  .release-card__art--mvp2 {
    left: 9%;
    bottom: -0.35rem;
    width: 82%;
  }

  .release-card__footer {
    position: absolute;
    z-index: 4;
    inset: auto 0 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
    min-height: 87px;
    padding: 1.35rem 2rem 1.15rem;
    background: #f8f4ec;
    color: #0a285f;
    clip-path: ellipse(78% 95% at 48% 100%);
  }

  .release-card__footer--beta {
    padding-right: 6.2rem;
  }

  .release-card__footer--mvp2 {
    padding-left: 6.2rem;
  }

  .release-card__footer div {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    font-size: 0.74rem;
    font-weight: 650;
  }

  .release-card__footer svg {
    width: 1.85rem;
    height: 1.85rem;
    padding: 0.45rem;
    border-radius: 999px;
    background: #dff1ed;
    color: #007f7d;
  }

  .release-card__corner {
    position: absolute;
    z-index: 7;
    bottom: -1px;
    width: 10.8rem;
    height: 7.5rem;
    pointer-events: none;
  }

  .release-card__corner--right {
    right: -1px;
  }

  .release-card__corner--left {
    left: -1px;
    transform: scaleX(-1);
  }

  .release-card__corner > svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    fill: #f8f4ec;
  }

  .release-card__corner-icon {
    position: absolute;
    z-index: 1;
    right: 1.35rem;
    bottom: 1.15rem;
    display: grid;
    width: 3.65rem;
    height: 3.65rem;
    place-items: center;
    border-radius: 999px;
    background: linear-gradient(145deg, #4aa69f, #247a7b);
    box-shadow:
      0 12px 26px rgba(31, 111, 117, 0.2),
      inset 0 1px rgba(255, 255, 255, 0.28);
    color: white;
  }

  .release-card__corner--left .release-card__corner-icon {
    transform: scaleX(-1);
  }

  .release-card__corner-icon svg {
    width: 1.35rem;
    height: 1.35rem;
    padding: 0;
    color: white;
    stroke-width: 2;
  }

  .release-neutral__seam-arrow {
    position: absolute;
    z-index: 10;
    left: 50%;
    top: 50%;
    display: grid;
    width: 4.7rem;
    height: 4.7rem;
    place-items: center;
    border: 0;
    border-radius: 999px;
    background: #fffdfa;
    box-shadow:
      0 12px 32px rgba(7, 24, 62, 0.18),
      0 0 0 8px rgba(255, 249, 241, 0.72);
    color: #0a285f;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .release-neutral__seam-arrow svg {
    width: 2rem;
    height: 2rem;
  }

  .release-expanded {
    position: relative;
    min-height: 780px;
    margin-top: clamp(3.8rem, 5vw, 4.8rem);
    overflow: hidden;
    border: 0;
    border-radius: 34px;
    box-shadow: 0 24px 70px rgba(7, 24, 63, 0.13);
    background: #fff9f1;
    backface-visibility: hidden;
    contain: paint;
    transform: translateZ(0);
  }

  .release-section--transitioning .release-expanded {
    box-shadow: none;
  }

  .release-expanded--beta {
    display: grid;
    grid-template-columns: minmax(310px, 34%) minmax(320px, 29%) minmax(450px, 37%);
  }

  .release-beta-intro {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 3rem;
    background:
      radial-gradient(circle at 22% 14%, rgba(185, 212, 229, 0.36), transparent 33%),
      linear-gradient(145deg, #315f83, #477b98 66%, #5f94aa);
    color: white;
  }

  .release-back {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    width: fit-content;
    border: 0;
    border-radius: 999px;
    background: transparent;
    font-size: 0.74rem;
    font-weight: 750;
    cursor: pointer;
  }

  .release-back svg {
    width: 1.15rem;
  }

  .release-back--light {
    width: 3rem;
    height: 3rem;
    justify-content: center;
    background: #fffdf8;
    color: #008f82;
    box-shadow: 0 8px 22px rgba(0, 0, 0, 0.13);
  }

  .release-back--ink {
    margin-bottom: 1.1rem;
    color: #0a175a;
  }

  .release-beta-scope > .release-back--ink {
    display: none;
  }

  .release-expanded__eyebrow {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    color: #00bba5;
    font-size: 0.78rem;
    font-weight: 850;
    letter-spacing: 0.06em;
  }

  .release-expanded__eyebrow span {
    border: 0;
    border-radius: 999px;
    padding: 0.22rem 0.55rem;
    background: rgba(169, 216, 207, 0.2);
    font-size: 0.68rem;
    letter-spacing: 0;
  }

  .release-expanded__eyebrow--teal {
    color: #008f82;
  }

  .release-beta-intro h2,
  .release-mvp-copy h2 {
    margin: 1.25rem 0 0;
    font-size: clamp(2rem, 3.4vw, 3.45rem);
    font-weight: 780;
    line-height: 1.08;
    letter-spacing: -0.045em;
  }

  .release-beta-intro h2 {
    color: white;
  }

  .release-expanded__accent {
    width: 3.5rem;
    height: 0.25rem;
    margin: 1.8rem 0;
    border-radius: 999px;
    background: #00bba5;
  }

  .release-beta-intro p,
  .release-mvp-copy > p {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 460;
    line-height: 1.65;
  }

  .release-beta-intro p {
    color: rgba(255, 255, 255, 0.82);
  }

  .release-primary-cta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.65rem;
    width: 100%;
    margin-top: 0.7rem;
    border-radius: 13px;
    padding: 0.95rem 1.15rem;
    background: linear-gradient(135deg, #2c8f89, #62b7aa);
    box-shadow: 0 12px 26px rgba(44, 143, 137, 0.24);
    color: white;
    font-size: 0.86rem;
    font-weight: 780;
    text-decoration: none;
  }

  .release-primary-cta svg {
    width: 1.1rem;
  }

  .release-text-link {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    margin-top: 1rem;
    color: #00c9b1;
    font-size: 0.82rem;
    font-weight: 650;
    text-decoration: underline;
    text-underline-offset: 4px;
  }

  .release-text-link svg {
    width: 1rem;
  }

  .release-beta-scene {
    position: relative;
    min-width: 0;
    overflow: hidden;
    background:
      radial-gradient(circle at 48% 28%, rgba(255, 255, 255, 0.92), transparent 24%),
      linear-gradient(180deg, #fff9f1 0%, #dfeef1 54%, #b9d4e5 100%);
  }

  .release-beta-scene__route {
    position: absolute;
    left: 50%;
    top: 50%;
    width: auto;
    max-width: 94%;
    height: 94%;
    object-fit: contain;
    transform: translate(-50%, -50%);
    filter: drop-shadow(0 25px 24px rgba(5, 32, 60, 0.15));
  }

  .release-beta-scene__pori {
    position: absolute;
    z-index: 3;
    right: 2%;
    bottom: 5%;
    width: 18%;
    filter: drop-shadow(0 16px 13px rgba(5, 27, 48, 0.18));
  }

  .release-beta-scope {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2.2rem 2rem;
    background:
      radial-gradient(circle at 80% 8%, rgba(1, 169, 149, 0.05), transparent 25%),
      #fff9f1;
  }

  .release-system-grid,
  .release-list-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.85rem;
  }

  .release-scope-card,
  .release-feature-list {
    border: 0;
    border-radius: 18px;
    background: rgba(255, 253, 249, 0.82);
    box-shadow: 0 12px 28px rgba(47, 91, 111, 0.07);
  }

  .release-scope-card {
    padding: 1.1rem;
  }

  .release-scope-card h3,
  .release-feature-list h3 {
    margin: 0;
    color: #0a175a;
    font-size: 0.7rem;
    font-weight: 870;
    letter-spacing: 0.035em;
  }

  .release-location {
    display: grid;
    grid-template-columns: 2.4rem 1fr;
    gap: 0.7rem;
    align-items: start;
    margin-top: 0.9rem;
    padding-top: 0.9rem;
    box-shadow: inset 0 1px rgba(143, 184, 210, 0.22);
  }

  .release-location:first-child {
    box-shadow: none;
  }

  .release-location__icon {
    display: grid;
    width: 2.4rem;
    height: 2.4rem;
    place-items: center;
    border-radius: 12px;
    background: #dff3ed;
    color: #008f82;
    font-size: 0.66rem;
    font-weight: 900;
  }

  .release-location p {
    margin: 0;
    color: #254064;
    font-size: 0.68rem;
    line-height: 1.48;
  }

  .release-location strong {
    display: block;
    margin-bottom: 0.18rem;
    color: #0a175a;
    font-size: 0.78rem;
  }

  .release-feature-list {
    padding: 1.15rem;
  }

  .release-feature-list--included h3 {
    color: #008f82;
  }

  .release-feature-list:not(.release-feature-list--included) h3 {
    color: #e75e45;
  }

  .release-feature-list ul {
    display: grid;
    gap: 0.43rem;
    margin: 0.85rem 0 0;
    padding: 0;
    list-style: none;
  }

  .release-feature-list li {
    display: grid;
    grid-template-columns: 0.9rem 1fr;
    gap: 0.42rem;
    align-items: start;
    color: #274064;
    font-size: 0.64rem;
    font-weight: 600;
    line-height: 1.35;
  }

  .release-feature-list li svg {
    width: 0.86rem;
    height: 0.86rem;
    margin-top: 0.03rem;
    padding: 0.13rem;
    border-radius: 999px;
    background: #009c8b;
    color: white;
    stroke-width: 3;
  }

  .release-feature-list:not(.release-feature-list--included) li svg {
    background: transparent;
    color: #ee7055;
    padding: 0;
  }

  .release-beta-note {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    margin-top: auto;
    padding: 0.75rem 0.9rem;
    border-radius: 13px;
    background: rgba(255, 253, 249, 0.72);
    color: #234163;
  }

  .release-beta-note svg {
    width: 1.2rem;
    color: #00a38f;
    flex: 0 0 auto;
  }

  .release-beta-note p {
    margin: 0;
    font-size: 0.66rem;
    font-weight: 620;
    line-height: 1.42;
  }

  .release-expanded--mvp2 {
    display: grid;
    grid-template-columns: minmax(0, 55%) minmax(450px, 45%);
  }

  .release-mvp-scene {
    position: relative;
    min-height: 780px;
    overflow: hidden;
    isolation: isolate;
    background:
      radial-gradient(circle at 38% 18%, rgba(255, 249, 241, 0.52), transparent 32%),
      linear-gradient(145deg, #c9dfeb 0%, #95bfd0 52%, #79aaa9 100%);
  }

  .release-mvp-scene::before {
    position: absolute;
    z-index: 0;
    inset: 0;
    background: radial-gradient(circle at 18% 72%, rgba(255, 249, 241, 0.28), transparent 24%);
    content: "";
    pointer-events: none;
  }

  .release-mvp-scene .release-back {
    position: absolute;
    z-index: 8;
    left: 1.7rem;
    top: 1.7rem;
  }

  .release-mvp-scene > img:first-of-type {
    position: absolute;
    z-index: 2;
    left: 50%;
    bottom: 2%;
    width: 112%;
    max-width: none;
    transform: translateX(-50%);
    filter: drop-shadow(0 28px 28px rgba(33, 78, 100, 0.2));
  }

  .release-mvp-scene__index {
    position: absolute;
    z-index: 4;
    left: 3.2rem;
    top: 7.2rem;
    display: flex;
    align-items: center;
    gap: 1.1rem;
    color: #0a285f;
  }

  .release-mvp-scene__index > span {
    color: rgba(255, 249, 241, 0.62);
    font-size: clamp(4.8rem, 7vw, 7rem);
    font-weight: 820;
    line-height: 0.82;
    letter-spacing: -0.08em;
  }

  .release-mvp-scene__index > div {
    display: grid;
    gap: 0.38rem;
    padding-left: 1rem;
    box-shadow: inset 2px 0 rgba(31, 111, 117, 0.42);
  }

  .release-mvp-scene__index small {
    color: #1f6f75;
    font-size: 0.62rem;
    font-weight: 850;
    letter-spacing: 0.14em;
  }

  .release-mvp-scene__index strong {
    max-width: 12rem;
    font-size: 0.82rem;
    line-height: 1.3;
  }

  .release-mvp-copy {
    position: relative;
    z-index: 3;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: clamp(2.5rem, 4.8vw, 4.8rem);
    background:
      radial-gradient(circle at 90% 10%, rgba(1, 169, 149, 0.04), transparent 25%),
      #fff9f1;
  }

  .release-mvp-copy > .release-back {
    position: absolute;
    left: 2.1rem;
    top: 1.8rem;
  }

  .release-mvp-copy h2 {
    color: #0a285f;
  }

  .release-mvp-copy > p {
    color: #344f72;
  }

  .release-mvp-launch {
    margin: 1.4rem 0 0.85rem;
  }

  .release-status-list {
    display: grid;
    gap: 0.65rem;
  }

  .release-status-row {
    display: grid;
    grid-template-columns: 2.2rem max-content 1fr 1.6rem;
    gap: 0.55rem;
    align-items: center;
    min-height: 3.2rem;
    border: 0;
    border-radius: 999px;
    padding: 0.45rem 0.8rem;
    background: rgba(185, 212, 229, 0.22);
    box-shadow: 0 8px 20px rgba(47, 91, 111, 0.05);
    color: #0a285f;
    font-size: 0.76rem;
  }

  .release-status-row__icon {
    display: grid;
    width: 2rem;
    height: 2rem;
    place-items: center;
    border-radius: 999px;
    background: #00a692;
    color: white;
  }

  .release-status-row__icon--waiting {
    background: #efbd49;
    color: #0a285f;
  }

  .release-status-row__icon svg {
    width: 1rem;
  }

  .release-status-row > span:nth-child(3) {
    color: #41708b;
  }

  .release-status-row__mark {
    display: grid;
    place-items: center;
    color: #009f8c;
  }

  .release-status-row__mark svg {
    width: 1rem;
    height: 1rem;
    border-radius: 999px;
    padding: 0.08rem;
    background: rgba(169, 216, 207, 0.48);
  }

  .release-status-row__mark--waiting {
    color: #e1a92b;
    font-size: 1.5rem;
  }

  .release-mvp-flow {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    margin: 1.35rem 0;
  }

  .release-mvp-flow > svg {
    width: 1rem;
    color: #4b6382;
    flex: 0 0 auto;
  }

  .release-flow-step {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    min-width: 0;
  }

  .release-flow-step > span {
    display: grid;
    width: 2.55rem;
    height: 2.55rem;
    place-items: center;
    border: 0;
    border-radius: 14px;
    background: #e7f7f3;
    color: #009f8c;
    flex: 0 0 auto;
  }

  .release-flow-step svg {
    width: 1.15rem;
  }

  .release-flow-step strong {
    font-size: 0.58rem;
    line-height: 1.25;
  }

  .release-notify {
    display: inline-flex;
    align-items: center;
    gap: 0.65rem;
    width: fit-content;
    border: 0;
    border-radius: 11px;
    padding: 0.8rem 1.05rem;
    background: rgba(185, 212, 229, 0.25);
    box-shadow: 0 8px 20px rgba(47, 91, 111, 0.07);
    color: #0a285f;
    font-size: 0.78rem;
    font-weight: 720;
    text-decoration: none;
  }

  .release-notify svg {
    width: 1rem;
  }

  .release-mvp-copy__corner {
    position: absolute;
    right: -9%;
    bottom: -17%;
    width: 30%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: #00aa96;
    pointer-events: none;
  }

  @keyframes release-odometer-roll {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(-50%);
    }
  }

  @media (max-width: 1180px) {
    .release-card {
      min-height: 620px;
    }

    .release-card__top {
      grid-template-columns: 105px 1fr;
    }

    .release-expanded--beta {
      grid-template-columns: 35% 65%;
    }

    .release-beta-scene {
      display: none;
    }

    .release-beta-scope {
      padding: 2rem;
    }

    .release-expanded--mvp2 {
      grid-template-columns: 49% 51%;
    }

    .release-mvp-scene > img:first-of-type {
      width: 150%;
    }
  }

  @media (max-width: 900px) {
    .release-neutral__cards,
    .release-expanded--beta,
    .release-expanded--mvp2 {
      display: grid;
      grid-template-columns: 1fr;
    }

    .release-neutral__seam-arrow {
      top: 50%;
      transform: translate(-50%, -50%) rotate(90deg);
    }

    .release-card {
      min-height: 640px;
    }

    .release-beta-intro {
      min-height: 720px;
    }

    .release-beta-scope > .release-back--ink {
      display: inline-flex;
    }

    .release-mvp-scene {
      min-height: 620px;
    }

    .release-mvp-scene__index {
      left: 1.8rem;
      top: 6.2rem;
    }

    .release-mvp-copy {
      min-height: 720px;
    }
  }

  @media (max-width: 620px) {
    .release-section {
      padding-right: 0.7rem;
      padding-left: 0.7rem;
    }

    .release-card {
      min-height: 600px;
      border-radius: 24px;
      padding: 1.35rem;
    }

    .release-milestone-banner {
      min-height: 58px;
      gap: 0.65rem;
      border-radius: 15px;
      padding: 0.7rem 0.8rem;
      font-size: 0.66rem;
    }

    .release-milestone-banner time {
      font-size: 0.56rem;
    }

    .release-card__top {
      grid-template-columns: 80px 1fr;
      gap: 0.8rem;
    }

    .release-card__number {
      font-size: 4rem;
    }

    .release-card__heading h3 {
      font-size: 1rem;
    }

    .release-card__label {
      font-size: 0.58rem;
    }

    .release-card__chips {
      gap: 0.4rem;
    }

    .release-card__chips span {
      padding: 0.4rem 0.5rem;
      font-size: 0.55rem;
    }

    .release-card__art-zone {
      bottom: 84px;
      height: 230px;
    }

    .release-card__art--beta {
      bottom: 0;
      width: 88%;
      left: 6%;
    }

    .release-card__art--mvp2 {
      bottom: 0;
      width: 84%;
      left: 8%;
    }

    .release-card__footer {
      padding-right: 1rem;
      padding-left: 1rem;
    }

    .release-card__footer--beta {
      padding-right: 4.7rem;
    }

    .release-card__footer--mvp2 {
      padding-left: 4.7rem;
    }

    .release-card__footer div {
      font-size: 0.58rem;
    }

    .release-card__corner {
      width: 9rem;
      height: 6.5rem;
    }

    .release-card__corner-icon {
      right: 1rem;
      bottom: 1rem;
      width: 3.3rem;
      height: 3.3rem;
    }

    .release-neutral__seam-arrow {
      width: 3.8rem;
      height: 3.8rem;
    }

    .release-expanded {
      border-radius: 24px;
    }

    .release-beta-intro {
      min-height: 760px;
      padding: 1.6rem;
    }

    .release-beta-scope {
      padding: 1.25rem;
    }

    .release-system-grid,
    .release-list-grid {
      grid-template-columns: 1fr;
    }

    .release-mvp-scene {
      min-height: 510px;
    }

    .release-mvp-scene__index {
      left: 1.2rem;
      top: 5.5rem;
      gap: 0.7rem;
      transform: scale(0.82);
      transform-origin: left top;
    }

    .release-mvp-scene > img:first-of-type {
      width: 138%;
    }

    .release-mvp-copy {
      min-height: auto;
      padding: 5rem 1.4rem 4rem;
    }

    .release-mvp-copy h2 {
      font-size: 2.1rem;
    }

    .release-status-row {
      grid-template-columns: 2.2rem max-content 1fr 1.3rem;
      font-size: 0.67rem;
    }

    .release-mvp-flow {
      align-items: flex-start;
      overflow-x: auto;
      padding-bottom: 0.45rem;
    }

    .release-flow-step {
      min-width: 105px;
      flex-direction: column;
      align-items: flex-start;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .release-card,
    .release-odometer__reel {
      animation: none !important;
      transition: none !important;
    }
  }
`;
