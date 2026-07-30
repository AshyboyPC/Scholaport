import { Link, createFileRoute } from "@tanstack/react-router";
import { ScholaportLogo } from "@/components/ScholaportLogo";
import { useEffect, useRef, useState } from "react";
import {
  PremiumBookIcon,
  PremiumBuildingIcon,
  PremiumCalendarIcon,
  PremiumCheckCircleIcon,
  PremiumDatabaseIcon,
  PremiumDocumentsIcon,
  PremiumGapIcon,
  PremiumGlobeIcon,
  PremiumGraduationIcon,
  PremiumHelpIcon,
  PremiumLinkCircleIcon,
  PremiumLockIcon,
  PremiumMapPointIcon,
  PremiumPacketIcon,
  PremiumPathMatchIcon,
  PremiumProfileIcon,
  PremiumRoadmapIcon,
  PremiumSearchIcon,
  PremiumShieldIcon,
  PremiumSourceFileIcon,
  PremiumTargetIcon,
  PremiumTwinIcon,
  PremiumVerifiedIcon,
  PremiumWarningIcon,
} from "@/components/icons/PremiumIcon";
import { ClayAsset } from "@/components/journey/JourneyVisuals";
import { FaqSection } from "@/components/marketing/FaqSection";
import { ReleasePathSection } from "@/components/marketing/ReleasePathSection";
import { BetaAccessGateway } from "@/components/marketing/BetaAccessGateway";
import heroBgImage from "@/assets/images/hero-bg.png";
import footerBgImage from "@/assets/images/footer-bg.png";
import featureShowcaseImg from "@/assets/images/feature-showcase.png";
import introBgTransparentImage from "@/assets/images/intro-bg-transparent.png";
import { ScrollRevealText, revealText } from "@/components/ui/ScrollRevealText";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowLeft, ArrowRight, ChevronDown, ChevronRight, Info, Menu, X } from "lucide-react";
import bentoTranscript from "@/assets/scholaport-journey/transcript-upload.png";
import bentoGap from "@/assets/scholaport-journey/requirement-gap.webp";
import bentoRoadmap from "@/assets/scholaport-journey/academic-roadmap.png";
import bentoPacket from "@/assets/scholaport-journey/counselor-packet.png";
import bentoPassport from "@/assets/images/academic-passport-bento.png";
import bentoProgression from "@/assets/images/level-progression-bento.png";
import whoForStudentImg from "@/assets/images/who-for-student.png";
import whoForCounselorImg from "@/assets/images/who-for-counselor.png";
import whoForFamiliesImg from "@/assets/images/who-for-families.png";
import whoForTeamsImg from "@/assets/images/who-for-teams.png";
import customAsset1 from "@/assets/images/custom_asset_1.png";
import customAsset2 from "@/assets/images/custom_asset_2.png";
import customAsset3 from "@/assets/images/custom_asset_3.png";
import customAsset4 from "@/assets/images/custom_asset_4.png";
import customAsset5 from "@/assets/images/custom_asset_5.png";
import customAsset6 from "@/assets/images/custom_asset_6.png";
import customAsset7 from "@/assets/images/custom_asset_7.png";
import customAsset8 from "@/assets/images/custom_asset_8.png";
import poriMascot from "@/assets/pori-mascot.png";
import trustMapSection from "@/assets/images/trust-map-section.png";

gsap.registerPlugin(ScrollTrigger);

const APP_BASE_URL = import.meta.env.VITE_APP_URL?.trim().replace(/\/+$/, "") ?? "";
const appHref = (path: string) => (APP_BASE_URL ? `${APP_BASE_URL}${path}` : path);
const marketingSectionLinks = [
  { href: "#philosophy", label: "Purpose" },
  { href: "#infrastructure", label: "Systems" },
  { href: "#audience", label: "Audience" },
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "Process" },
  { href: "#trust-product", label: "Trust" },
  { href: "#release-path", label: "Releases" },
  { href: "#faq", label: "FAQ" },
] as const;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Scholaport | Your academic passage" },
      {
        name: "description",
        content:
          "Scholaport helps internationally mobile students organize transcripts, understand likely credit paths, and prepare for the next school system.",
      },
    ],
  }),
  component: WelcomePage,
});

function WelcomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [showSourcesModal, setShowSourcesModal] = useState(false);

  useEffect(() => {
    if (showSourcesModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showSourcesModal]);
  const timelineRef = useRef<HTMLDivElement>(null);
  const bentoGridRef = useRef<HTMLDivElement>(null);
  const whoForRef = useRef<HTMLDivElement>(null);
  const marketingRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!marketingRef.current) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const hero = marketingRef.current!.querySelector(".motion-hero");
        const heroLines = gsap.utils.toArray<HTMLElement>(".motion-hero-line", hero);
        const heroBackdrop = marketingRef.current!.querySelector(".motion-hero-backdrop");

        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .fromTo(
            heroBackdrop,
            { scale: 1.18, yPercent: -3 },
            { scale: 1, yPercent: 0, duration: 2.2, ease: "expo.out" },
          )
          .fromTo(
            heroLines,
            {
              yPercent: 18,
              scale: 0.985,
              opacity: 0,
              clipPath: "inset(0 0 100% 0)",
              transformOrigin: "center bottom",
            },
            {
              yPercent: 0,
              scale: 1,
              opacity: 1,
              clipPath: "inset(0 0 0% 0)",
              duration: 1.15,
              stagger: 0.11,
              ease: "power4.out",
            },
            0.34,
          )
          .fromTo(
            ".motion-hero-copy",
            { y: 12, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
            0.86,
          )
          .fromTo(
            ".motion-hero-actions",
            { y: 12, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
            1.02,
          );

        gsap.to(heroBackdrop, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 1.1 },
        });

        const systems = marketingRef.current!.querySelector(".motion-systems");
        const systemsVisual = systems?.querySelector(".motion-systems-visual");
        const systemsCards = gsap.utils.toArray<HTMLElement>(".motion-system-card", systems);
        if (systems && systemsVisual) {
          gsap.fromTo(
            systemsVisual,
            { clipPath: "inset(0 50% 0 50%)", scale: 1.08 },
            {
              clipPath: "inset(0 0% 0 0%)",
              scale: 1,
              ease: "power3.inOut",
              scrollTrigger: {
                trigger: systemsVisual,
                start: "top 82%",
                end: "center 55%",
                scrub: 0.8,
              },
            },
          );
          gsap.fromTo(
            systemsCards,
            { x: (index) => (index % 2 ? 42 : -42), opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.8,
              stagger: { each: 0.1, from: "edges" },
              ease: "power3.out",
              scrollTrigger: { trigger: systemsCards[0], start: "top 86%" },
            },
          );
        }

        const process = marketingRef.current!.querySelector(".motion-process");
        const processCards = gsap.utils.toArray<HTMLElement>(".motion-process-card", process);
        if (process && processCards.length) {
          gsap.fromTo(
            processCards,
            { rotateY: -24, x: -30, opacity: 0, transformOrigin: "left center" },
            {
              rotateY: 0,
              x: 0,
              opacity: 1,
              duration: 0.85,
              stagger: 0.14,
              ease: "expo.out",
              scrollTrigger: { trigger: process, start: "top 70%" },
            },
          );
        }

        const trust = marketingRef.current!.querySelector(".motion-trust");
        const trustRows = gsap.utils.toArray<HTMLElement>(".motion-trust-row", trust);
        if (trust && trustRows.length) {
          gsap.fromTo(
            trustRows,
            { x: (index) => (index % 2 ? 55 : -55), opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.9,
              stagger: 0.12,
              ease: "power4.out",
              scrollTrigger: { trigger: trust, start: "top 72%" },
            },
          );
        }

        const footer = marketingRef.current!.querySelector(".motion-footer");
        const footerScene = footer?.querySelector(".motion-footer-scene");
        const footerLandscape = footer?.querySelector(".motion-footer-landscape");
        const footerContent = footer?.querySelector(".motion-footer-content");
        if (footer && footerScene && footerLandscape && footerContent) {
          gsap.fromTo(
            footerLandscape,
            { scale: 1.06, yPercent: -2 },
            {
              scale: 1.02,
              yPercent: 2,
              ease: "none",
              scrollTrigger: {
                trigger: footerScene,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
                invalidateOnRefresh: true,
              },
            },
          );
          gsap.fromTo(
            footerContent,
            { y: 55, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              immediateRender: false,
              clearProps: "transform,opacity",
              scrollTrigger: {
                trigger: footerScene,
                start: "top 65%",
                once: true,
                invalidateOnRefresh: true,
              },
            },
          );
        }
      });
    },
    { scope: marketingRef },
  );

  useGSAP(
    () => {
      if (!whoForRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        return;
      const intro = whoForRef.current.querySelector(".who-intro");
      const audienceCards = gsap.utils.toArray<HTMLElement>(
        ".who-audience-card",
        whoForRef.current,
      );
      const audienceVisuals = gsap.utils.toArray<HTMLElement>(
        ".who-audience-visual",
        whoForRef.current,
      );
      const supportCards = gsap.utils.toArray<HTMLElement>(".who-support-card", whoForRef.current);

      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: whoForRef.current,
            start: "top 72%",
            toggleActions: "play none none reverse",
          },
        })
        .fromTo(intro, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85 })
        .fromTo(
          audienceCards,
          {
            opacity: 0,
            clipPath: "inset(0 0 100% 0 round 28px)",
          },
          {
            opacity: 1,
            clipPath: "inset(0 0 0% 0 round 28px)",
            duration: 0.95,
            stagger: 0.16,
            ease: "power3.inOut",
          },
          0.18,
        )
        .fromTo(
          audienceVisuals,
          { scale: 0.9, opacity: 0, transformOrigin: "center bottom" },
          { scale: 1, opacity: 1, duration: 0.75, stagger: 0.14, ease: "power2.out" },
          0.52,
        )
        .fromTo(
          supportCards,
          { opacity: 0, clipPath: "inset(100% 0 0 0 round 24px)" },
          {
            opacity: 1,
            clipPath: "inset(0% 0 0 0 round 24px)",
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.inOut",
          },
          0.72,
        );
    },
    { scope: whoForRef },
  );

  useGSAP(
    () => {
      if (!bentoGridRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        return;
      const anchor = bentoGridRef.current.querySelector(".bento-anchor");
      const capabilities = gsap.utils.toArray<HTMLElement>(
        ".bento-capability",
        bentoGridRef.current,
      );

      gsap
        .timeline({
          defaults: { ease: "power4.out" },
          scrollTrigger: {
            trigger: bentoGridRef.current,
            start: "top 76%",
            toggleActions: "play none none reverse",
          },
        })
        .fromTo(
          anchor,
          {
            scale: 0.94,
            opacity: 0,
            transformOrigin: "center",
          },
          {
            scale: 1,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
          },
        )
        .fromTo(
          ".bento-anchor > :not(img)",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.06 },
          0.34,
        )
        .fromTo(
          capabilities,
          {
            scale: 0.84,
            opacity: 0,
            transformOrigin: "center",
          },
          {
            scale: 1,
            opacity: 1,
            duration: 0.78,
            stagger: { each: 0.1, from: "center", grid: "auto" },
            ease: "expo.out",
          },
          0.56,
        );
    },
    { scope: bentoGridRef },
  );

  useGSAP(
    () => {
      if (!timelineRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        return;
      const vLines = gsap.utils.toArray(".gs-v-line", timelineRef.current);
      const dots = gsap.utils.toArray(".gs-dot", timelineRef.current);
      const hLines = gsap.utils.toArray(".gs-h-line", timelineRef.current);
      const arrows = gsap.utils.toArray(".gs-arrow", timelineRef.current);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.set(vLines, { scaleY: 0, transformOrigin: "top" });
      gsap.set(dots, { scale: 0, opacity: 0, transformOrigin: "center" });
      gsap.set(hLines, { scaleX: 0, transformOrigin: "left" });
      gsap.set(arrows, { scale: 0, opacity: 0, transformOrigin: "center" });

      vLines.forEach((_, i) => {
        tl.to(vLines[i] as Element, { scaleY: 1, duration: 0.3, ease: "power2.out" }).to(
          dots[i] as Element,
          { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" },
          "-=0.1",
        );

        if (hLines[i]) {
          tl.to(
            hLines[i] as Element,
            { scaleX: 1, duration: 0.4, ease: "power2.inOut" },
            "-=0.1",
          ).to(
            arrows[i] as Element,
            { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2)" },
            "-=0.2",
          );
        }
      });
    },
    { scope: timelineRef },
  );

  useEffect(() => {
    const updateNav = () => {
      setIsScrolled((currentlyExpanded) =>
        currentlyExpanded ? window.scrollY > 4 : window.scrollY > 40,
      );
    };
    updateNav();
    window.addEventListener("scroll", updateNav, { passive: true });
    return () => window.removeEventListener("scroll", updateNav);
  }, []);

  useEffect(() => {
    if (!isMobileNavOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileNavOpen(false);
    };
    const closeAtDesktopWidth = () => {
      if (window.innerWidth >= 1280) setIsMobileNavOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", closeAtDesktopWidth);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", closeAtDesktopWidth);
    };
  }, [isMobileNavOpen]);

  return (
    <main ref={marketingRef} className="bg-[#fffdf8] text-[#0a175a] pb-0 marketing-page">
      {/* HEADER / HERO */}
      <header
        className="motion-hero relative min-h-[820px] overflow-hidden rounded-b-[30px] bg-[#0a175a] text-white sm:rounded-b-[42px] md:min-h-[900px]"
        id="home"
      >
        {/* Background Image */}
        <div className="motion-hero-backdrop absolute inset-0">
          <img src={heroBgImage} alt="" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a175a]/55 via-[#0a175a]/10 to-[#0a175a]/95"></div>
        </div>

        {/* MORPHING NAVIGATION */}
        <nav
          className={`fixed z-50 left-1/2 hidden -translate-x-1/2 items-center transition-all xl:flex ${isScrolled ? "duration-500" : "duration-150"} ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isScrolled
              ? "top-4 w-max h-[64px] pl-[84px] pr-[112px] rounded-[32px] bg-white/76 border border-white/42 shadow-[0_10px_32px_rgba(7,17,63,0.1),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-[18px] saturate-[1.1] text-[#344061]"
              : "top-4 w-[200px] h-[64px] rounded-[32px] bg-transparent border border-transparent shadow-none backdrop-blur-none text-white"
          }`}
        >
          {/* LOGO (Always absolute, centered vertically) */}
          <a
            href="#home"
            aria-label="Return to the ScholaPort hero"
            className={`absolute top-1/2 -translate-y-1/2 transition-all ${isScrolled ? "duration-500" : "duration-150"} ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isScrolled ? "left-4" : "left-1/2 -translate-x-1/2"
            }`}
          >
            <ScholaportLogo
              className="h-9 sm:h-10 transition-colors duration-500"
              showWordmark={!isScrolled}
              inverse={!isScrolled}
            />
          </a>

          {/* LINKS CONTAINER */}
          <div
            className={`flex items-center transition-all ${isScrolled ? "duration-[400ms]" : "duration-100"} ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isScrolled
                ? "w-max gap-0.5 mx-auto opacity-100"
                : "w-0 opacity-0 overflow-hidden pointer-events-none"
            }`}
          >
            {marketingSectionLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-full px-3.5 py-2.5 text-[0.76rem] font-[800] transition-all duration-300 hover:bg-black/5"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* BUTTON (Always absolute) */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 transition-all ${isScrolled ? "duration-[400ms]" : "duration-100"} ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isScrolled
                ? "right-2 opacity-100 pointer-events-auto"
                : "right-2 opacity-0 pointer-events-none"
            }`}
          >
            <a
              href="#beta-access"
              className={`marketing-button transition-colors duration-500 h-[46px] ${
                isScrolled ? "marketing-button--ink" : "marketing-button--light"
              }`}
            >
              Access
            </a>
          </div>
        </nav>

        <nav
          className="fixed inset-x-3 top-3 z-50 flex h-[58px] items-center justify-between rounded-[29px] border border-white/55 bg-white/88 px-3 pl-4 text-[#0a175a] shadow-[0_10px_32px_rgba(7,17,63,0.12)] backdrop-blur-[18px] xl:hidden"
          aria-label="Mobile navigation"
        >
          <a
            href="#home"
            aria-label="Return to the ScholaPort hero"
            onClick={() => setIsMobileNavOpen(false)}
          >
            <ScholaportLogo className="h-8" showWordmark />
          </a>
          <button
            type="button"
            aria-label={isMobileNavOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isMobileNavOpen}
            aria-controls="mobile-marketing-menu"
            onClick={() => setIsMobileNavOpen((open) => !open)}
            className="grid h-11 w-11 place-items-center rounded-full bg-[#0a175a] text-white transition-transform active:scale-95"
          >
            {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        <div
          id="mobile-marketing-menu"
          className={`fixed inset-x-3 top-[78px] z-40 max-h-[calc(100svh-94px)] overflow-y-auto rounded-[28px] border border-[#dfe8e6] bg-[#fffdf8]/96 p-3 shadow-[0_24px_70px_rgba(7,17,63,0.2)] backdrop-blur-[22px] transition-all duration-300 xl:hidden ${
            isMobileNavOpen
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-3 opacity-0"
          }`}
        >
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            {marketingSectionLinks.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileNavOpen(false)}
                className="flex min-h-12 items-center justify-between rounded-2xl px-4 text-[0.86rem] font-[800] text-[#263251] transition-colors hover:bg-[#eaf8f4]"
              >
                <span>{item.label}</span>
                <span className="text-[0.64rem] font-[850] text-[#01a995]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </a>
            ))}
          </div>
          <a
            href="#beta-access"
            onClick={() => setIsMobileNavOpen(false)}
            className="mt-2 flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0a175a] px-5 text-[0.82rem] font-[850] text-white"
          >
            Access Beta <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="relative z-10 mx-auto flex min-h-[760px] max-w-[1500px] flex-col items-center justify-center px-4 pb-16 pt-28 text-center sm:min-h-[820px] sm:px-8 sm:pb-20 sm:pt-32 md:min-h-[900px] md:px-16 md:pb-24 md:pt-36">
          <h1
            className="w-full text-[14vw] font-[800] leading-[0.9] tracking-[-0.065em] text-white sm:text-[5.3rem] md:text-[6.6rem] lg:text-[7.8rem]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="motion-hero-line block">Your academic record</span>
            </span>
            <span className="mt-2 block overflow-hidden pb-[0.1em]">
              <span className="motion-hero-line block text-[0.72em] text-[#9ff2e6]">
                deserves a clear next chapter.
              </span>
            </span>
          </h1>
          <p className="motion-hero-copy mt-10 max-w-2xl text-[1.16rem] leading-[1.65] text-white/78 font-[560] md:text-[1.35rem]">
            Scholaport turns a stack of coursework into a student-owned path for the next school
            system, without pretending the hard questions are simple.
          </p>
          <a href="#beta-access" className="motion-hero-actions marketing-hero-beta-button mt-8">
            <span className="marketing-hero-beta-button__copy">
              <strong>Open beta</strong>
            </span>
            <span className="marketing-hero-beta-button__route" aria-hidden="true">
              <ArrowRight />
            </span>
          </a>
        </div>
      </header>

      {/* INTRODUCTION SECTION (HYPERLIQUID REFERENCE) */}
      <section
        id="philosophy"
        className="marketing-purpose-section relative flex w-full flex-col items-center justify-center overflow-hidden py-20 md:py-24"
      >
        {/* The frame and copy share one responsive box, so the copy can never escape the outline. */}
        <div
          className="marketing-purpose-frame relative z-10 text-center"
          style={{
            backgroundImage: `url(${introBgTransparentImage})`,
          }}
        >
          <div className="marketing-purpose-copy mx-auto w-full">
            <ScrollRevealText>
              <p className="mb-6 text-[0.82rem] md:text-[0.92rem] leading-[1.6] text-[#101a3f] font-[500] text-left md:text-center">
                {revealText(
                  "Global education is moving faster than the systems built to recognize it. UNESCO reported that ",
                )}
                {revealText("6.9 million students", "font-[800] text-[#01a995]")}
                {revealText(" now study outside their home countries, ")}
                {revealText("three times", "font-[800] text-[#ff7a59]")}
                {revealText(" the number in 2000. In the United States alone, ")}
                {revealText("54,356 foreign students", "font-[800] text-[#01a995]")}
                {revealText(" were enrolled in K–12 programs in 2024, while ")}
                {revealText("18.3 million children", "font-[800] text-[#01a995]")}
                {revealText(
                  " lived in immigrant families. Yet the latest national data show that English learners graduate on time at ",
                )}
                {revealText("72%", "font-[800] text-[#ff7a59]")}
                {revealText(", compared with ")}
                {revealText("87%", "font-[800] text-[#01a995]")}
                {revealText(
                  " of students overall. When curricula, languages, grading systems, credit units, and local graduation rules do not align, years of completed learning can become unclear at the exact moment families must make course-placement and graduation decisions.",
                )}
              </p>
              <p className="text-[0.82rem] md:text-[0.92rem] leading-[1.6] text-[#101a3f] font-[500] text-left md:text-center">
                {revealText(
                  "Based on our review of publicly documented education and credential platforms, ",
                )}
                {revealText(
                  "ScholaPort is the world’s first student-owned, pre-counselor academic mobility system",
                  "font-[800] text-[#01a995]",
                )}
                {revealText(
                  " built specifically for internationally transferring high-school students. Traditional credential services produce evaluation reports mainly for admissions, employment, licensing, or immigration. ",
                )}
                {revealText(
                  "ScholaPort connects the entire high-school transition in one private workspace:",
                  "font-[750] text-[#0a175a]",
                )}
                {revealText(" ")}
                {revealText(
                  "transcript extraction and translation,",
                  "font-[750] text-[#ff7a59]",
                )}
                {revealText(" ")}
                {revealText("student-confirmed course records,", "font-[750] text-[#ffb703]")}
                {revealText(" ")}
                {revealText(
                  "probable credit mappings with confidence and review flags,",
                  "font-[750] text-[#01a995]",
                )}
                {revealText(" ")}
                {revealText(
                  "destination-specific graduation-gap analysis,",
                  "font-[750] text-[#ff7a59]",
                )}
                {revealText(" ")}
                {revealText("a prioritized academic roadmap,", "font-[750] text-[#01a995]")}
                {revealText(" and ")}
                {revealText("a counselor-ready packet.", "font-[750] text-[#3b82f6]")}
                {revealText(
                  " Every result preserves uncertainty, traces academic claims to source evidence, and leaves final decisions with the receiving school.",
                )}
              </p>
            </ScrollRevealText>
          </div>

          {/* Modal / Dialog Overlay for Data Sources (Fixed Viewport Centered z-[9999]) */}
          {showSourcesModal && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0a175a]/50 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="fixed inset-0" onClick={() => setShowSourcesModal(false)} />
              <div className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white p-7 border border-[#d9f2e9] shadow-[0_25px_70px_rgba(10,23,90,0.25)] text-left animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                  <h4 className="text-base font-bold text-[#0a175a] flex items-center gap-2">
                    <PremiumSourceFileIcon className="w-5 h-5 text-[#01a995]" />
                    Data Sources & Population Definitions
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowSourcesModal(false)}
                    aria-label="Close data sources"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4 text-xs text-[#526079] leading-relaxed">
                  <div className="p-4 rounded-2xl bg-[#f0fbf7] border border-[#d9f2e9]">
                    <div className="font-bold text-[#0a175a] text-sm mb-1.5 flex items-center justify-between">
                      <span>1. Global Student Mobility (6.9M)</span>
                      <span className="text-[10px] font-bold text-[#01a995] bg-[#01a995]/15 px-2.5 py-0.5 rounded-full">
                        Tertiary Population Scope
                      </span>
                    </div>
                    <p className="mb-1 text-gray-700">
                      <strong>Source:</strong> UNESCO Institute for Statistics (UIS) & OECD
                      Education at a Glance (2024).
                    </p>
                    <p>
                      <strong>Population Scope:</strong> Describes higher-education (tertiary)
                      international students worldwide. Cited to demonstrate overall international
                      student mobility growth since 2000 (2.1M to 6.9M).
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#f0f6ff] border border-[#e1edff]">
                    <div className="font-bold text-[#0a175a] text-sm mb-1.5">
                      2. US K-12 Foreign Student Enrollment (54,356)
                    </div>
                    <p className="mb-1 text-gray-700">
                      <strong>Source:</strong> US Dept. of Homeland Security, Student and Exchange
                      Visitor Program (SEVP / SEVIS Report 2024).
                    </p>
                    <p>
                      <strong>Population Scope:</strong> Represents nonimmigrant F-1 and M-1 visa
                      holders actively enrolled in US K-12 primary and secondary schools.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#fff8ec] border border-[#ffeed4]">
                    <div className="font-bold text-[#0a175a] text-sm mb-1.5">
                      3. Children in Immigrant Families & Graduation Gap (18.3M / 72% vs 87%)
                    </div>
                    <p className="mb-1 text-gray-700">
                      <strong>Source:</strong> US Census Bureau ACS & National Center for Education
                      Statistics (NCES 2023/2024 Report).
                    </p>
                    <p>
                      <strong>Population Scope:</strong> NCES ACGR data measuring 4-year adjusted
                      cohort graduation rates for English Learners (72%) vs overall US high school
                      population (87%).
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#526079]">
                  <span>Last Reviewed: July 2026</span>
                  <button
                    type="button"
                    onClick={() => setShowSourcesModal(false)}
                    className="rounded-full bg-[#0a175a] px-5 py-2 text-xs font-bold text-white hover:bg-[#0a175a]/90 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sources Disclosure Button (Hidden when modal is open so it never overlaps the modal popup) */}
        <div
          className={`absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 transition-opacity duration-200 ${showSourcesModal ? "opacity-0 pointer-events-none z-0" : "z-20"}`}
        >
          <button
            type="button"
            onClick={() => setShowSourcesModal(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#01a995] hover:text-[#0a175a] bg-[#f0fbf7]/90 hover:bg-[#e1f5ee] px-4 py-2 rounded-full border border-[#d9f2e9] transition-all shadow-sm cursor-pointer backdrop-blur-sm"
          >
            <Info className="w-3.5 h-3.5" />
            <span>View data sources and definitions</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* FEATURE SHOWCASE (DESIGN REFERENCE) */}
      <section
        id="infrastructure"
        className="motion-systems mx-auto w-full max-w-7xl px-5 py-24 md:px-8"
      >
        {/* Top Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#01a995]/15 px-4 py-1.5 mb-5 border border-[#01a995]/20 backdrop-blur-sm">
              <PremiumMapPointIcon className="w-3.5 h-3.5 text-[#01a995]" />
              <span className="text-[0.68rem] font-[800] uppercase tracking-wider text-[#01a995]">
                BUILT AROUND REAL EDUCATION SYSTEMS
              </span>
            </div>
            <h2
              className="text-[clamp(2.5rem,5vw,4.5rem)] font-[800] leading-[1.05] tracking-[-0.04em]"
              style={{ fontFamily: "Gumriot-Regular" }}
            >
              <span className="text-[#0a175a]">There Is No Generic</span>
              <br />
              <span className="text-[#01c3ad]">India-to-United States</span>
              <br />
              <span className="text-[#01c3ad]">Transfer.</span>
            </h2>
            <p className="mt-6 text-[1.1rem] leading-[1.65] text-[#526079] font-[560] max-w-2xl">
              A Tamil Nadu HSC record is not the same as an Andhra Pradesh Intermediate record.
              Georgia and Texas do not follow the same graduation framework. ScholaPort models every
              supported route by its actual board, curriculum, and destination jurisdiction instead
              of forcing students through one generic national template.
            </p>
          </div>
        </div>

        {/* Center Image Area */}
        <div className="motion-systems-visual relative w-full h-[300px] md:h-[550px] mb-20 flex items-center justify-center">
          {/* The exact image provided by the user with CSS multiply to cleanly drop the white background */}
          <div
            className="absolute inset-0 mix-blend-multiply scale-[1.15] md:scale-[1.25]"
            style={{
              backgroundImage: `url(${featureShowcaseImg})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
        </div>

        {/* Bottom Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {/* Item 1: Tamil Nadu */}
          <div className="motion-system-card p-6 rounded-2xl bg-[#f0fbf7] border border-[#d9f2e9]">
            <span className="inline-block rounded-full bg-[#01a995]/15 px-3 py-1 text-[10px] font-bold text-[#01a995] uppercase tracking-wider mb-3">
              SSLC and HSC
            </span>
            <h3 className="text-[1.2rem] font-[800] text-[#0a175a] mb-2">Tamil Nadu</h3>
            <p className="text-[0.9rem] leading-[1.6] text-[#526079] font-[550]">
              Source records are interpreted through their own State Board curriculum structure.
            </p>
          </div>

          {/* Item 2: Andhra Pradesh */}
          <div className="motion-system-card p-6 rounded-2xl bg-[#fff8ec] border border-[#ffeed4]">
            <span className="inline-block rounded-full bg-[#ff7a59]/15 px-3 py-1 text-[10px] font-bold text-[#ff7a59] uppercase tracking-wider mb-3">
              SSC and Intermediate
            </span>
            <h3 className="text-[1.2rem] font-[800] text-[#0a175a] mb-2">Andhra Pradesh</h3>
            <p className="text-[0.9rem] leading-[1.6] text-[#526079] font-[550]">
              Secondary and Intermediate records remain connected to their actual source curriculum.
            </p>
          </div>

          {/* Item 3: Georgia */}
          <div className="motion-system-card p-6 rounded-2xl bg-[#f0f6ff] border border-[#e1edff]">
            <span className="inline-block rounded-full bg-[#0a175a]/15 px-3 py-1 text-[10px] font-bold text-[#0a175a] uppercase tracking-wider mb-3">
              State Graduation Framework
            </span>
            <h3 className="text-[1.2rem] font-[800] text-[#0a175a] mb-2">Georgia</h3>
            <p className="text-[0.9rem] leading-[1.6] text-[#526079] font-[550]">
              Confirmed courses are compared with Georgia-specific graduation requirements.
            </p>
          </div>

          {/* Item 4: Texas */}
          <div className="motion-system-card p-6 rounded-2xl bg-[#f0fbf7] border border-[#d9f2e9]">
            <span className="inline-block rounded-full bg-[#01a995]/15 px-3 py-1 text-[10px] font-bold text-[#01a995] uppercase tracking-wider mb-3">
              Foundation High School Program
            </span>
            <h3 className="text-[1.2rem] font-[800] text-[#0a175a] mb-2">Texas</h3>
            <p className="text-[0.9rem] leading-[1.6] text-[#526079] font-[550]">
              Texas planning uses its own diploma framework rather than a generic U.S. model.
            </p>
          </div>
        </div>
      </section>

      {/* WHO SCHOLAPORT IS FOR SECTION */}
      <section
        id="audience"
        ref={whoForRef}
        className="mx-auto w-full max-w-[1400px] px-5 py-20 md:px-8 lg:py-24"
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* LEFT COLUMN: Header & Info (4 Cols on lg) */}
          <div className="who-intro flex flex-col justify-between lg:col-span-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#ff7a59]/15 px-4 py-1.5 mb-6 border border-[#ff7a59]/20 backdrop-blur-sm">
                <PremiumTwinIcon className="w-3.5 h-3.5 text-[#ff7a59]" />
                <span className="text-[0.68rem] font-[800] uppercase tracking-wider text-[#ff7a59]">
                  WHO SCHOLAPORT IS FOR
                </span>
              </div>
              <h2 className="text-[clamp(2.2rem,3.8vw,3.4rem)] font-[800] leading-[1.08] tracking-[-0.04em] text-[#0a175a] mb-6">
                Built for the student carrying the record and the counselor receiving it.
              </h2>
              <p className="text-[0.98rem] leading-[1.7] text-[#526079] font-[500] mb-8">
                ScholaPort gives transferring students one place to organize their academic history
                before the first planning meeting. Counselors receive a cleaner view of confirmed
                courses, probable mappings, open requirements, and the questions that still need a
                human decision.
              </p>

              {/* Beta Info Card */}
              <div className="mb-8 flex items-start gap-4 rounded-2xl bg-[#f0fbf7] p-4 border border-[#d9f2e9] backdrop-blur-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#01a995] shadow-sm border border-[#01a995]/20">
                  <PremiumMapPointIcon className="w-5 h-5" />
                </div>
                <p className="text-xs leading-[1.6] text-[#2d3748] font-[600]">
                  Private beta for high school transfers from Tamil Nadu or Andhra Pradesh into
                  Georgia or Texas.
                </p>
              </div>

              {/* CTA Button */}
              <a
                href="#release-path"
                className="inline-flex items-center gap-3 rounded-full bg-[#0a175a] px-7 py-4 text-sm font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 mb-8"
              >
                See what the beta includes &rarr;
              </a>
            </div>

            {/* Navigation Arrows */}
            <div className="hidden lg:flex items-center gap-3 mt-6">
              <a
                href="#infrastructure"
                aria-label="Return to education systems"
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-white text-[#0a175a] hover:bg-gray-50 transition-colors shadow-sm"
              >
                <ArrowLeft className="w-5 h-5" />
              </a>
              <a
                href="#features"
                aria-label="Continue to ScholaPort features"
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0a175a] text-white hover:bg-[#0a175a]/90 transition-colors shadow-sm"
              >
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* MIDDLE & RIGHT COLUMNS: 2 Main Columns (8 Cols on lg) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:col-span-8">
            {/* STUDENT COLUMN (Top Card + Bottom Card) */}
            <div className="flex flex-col gap-6">
              {/* Student Main Card */}
              <div className="who-audience-card flex flex-col justify-between overflow-hidden rounded-[28px] bg-[#f0fbf7] p-7 border border-[#d9f2e9] shadow-[0_4px_20px_rgba(10,23,90,0.04)] relative h-[520px]">
                <div>
                  <div className="inline-block rounded-full bg-[#01a995] px-4 py-1 text-xs font-bold text-white mb-4">
                    Student
                  </div>
                  <h3 className="text-2xl font-[800] text-[#0a175a] leading-snug tracking-tight mb-3">
                    Understand what you are bringing.
                  </h3>
                  <p className="text-xs leading-relaxed text-[#526079] font-[500] mb-2">
                    Review your extracted course information, confirm what is accurate, see how your
                    record may fit the destination system, and keep every next step in one private
                    workspace.
                  </p>
                </div>

                {/* 3D Asset */}
                <div className="my-auto flex items-center justify-center py-2">
                  <img
                    src={whoForStudentImg}
                    alt="Student Academic Passport"
                    className="who-audience-visual w-[94%] max-h-[235px] object-contain drop-shadow-2xl"
                  />
                </div>

                {/* Chips Row */}
                <div className="grid grid-cols-3 gap-2 mt-auto pt-4 border-t border-[#d9f2e9]">
                  <div className="flex items-center gap-1.5 rounded-xl bg-white/90 px-2 py-2 text-[10px] font-bold text-[#2d3748] border border-white">
                    <PremiumGraduationIcon className="w-3.5 h-3.5 text-[#01a995] shrink-0" />
                    <span className="truncate">Grades 9–12</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-xl bg-white/90 px-2 py-2 text-[10px] font-bold text-[#2d3748] border border-white">
                    <PremiumLockIcon className="w-3.5 h-3.5 text-[#01a995] shrink-0" />
                    <span className="truncate">Private workspace</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-xl bg-white/90 px-2 py-2 text-[10px] font-bold text-[#2d3748] border border-white">
                    <PremiumCalendarIcon className="w-3.5 h-3.5 text-[#01a995] shrink-0" />
                    <span className="truncate">Before meeting</span>
                  </div>
                </div>
              </div>

              {/* Families Card */}
              <div className="who-support-card flex items-center gap-4 overflow-hidden rounded-[24px] bg-[#fff8ec] p-5 border border-[#ffeed4] shadow-sm relative min-h-[125px]">
                <img
                  src={whoForFamiliesImg}
                  alt="Families 3D House"
                  className="w-20 h-20 shrink-0 object-contain drop-shadow-lg"
                />
                <div className="flex-1 pr-2">
                  <h4 className="text-sm font-[800] text-[#0a175a] mb-0.5">
                    Families supporting the move
                  </h4>
                  <div className="text-[10.5px] font-bold text-[#ff7a59] mb-1">
                    Help the student prepare.
                  </div>
                  <p className="text-[10.5px] leading-snug text-[#526079] font-[500]">
                    Support record gathering, deadline tracking, and question preparation using the
                    student’s organized workflow.
                  </p>
                </div>
                <a
                  href="#how-it-works"
                  aria-label="See how families can prepare"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ffe8e0] text-[#ff7a59] hover:bg-[#ff7a59] hover:text-white transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* COUNSELOR COLUMN (Top Card + Bottom Card) */}
            <div className="flex flex-col gap-6">
              {/* Counselor Main Card */}
              <div className="who-audience-card flex flex-col justify-between overflow-hidden rounded-[28px] bg-[#f0f6ff] p-7 border border-[#e1edff] shadow-[0_4px_20px_rgba(10,23,90,0.04)] relative h-[520px]">
                <div>
                  <div className="inline-block rounded-full bg-[#01a995] px-4 py-1 text-xs font-bold text-white mb-4">
                    Counselor
                  </div>
                  <h3 className="text-2xl font-[800] text-[#0a175a] leading-snug tracking-tight mb-3">
                    Begin with context, not a document pile.
                  </h3>
                  <p className="text-xs leading-relaxed text-[#526079] font-[500] mb-2">
                    Review the student's source curriculum, proposed mappings, unresolved
                    requirements, and prepared questions through one organized planning packet.
                  </p>
                </div>

                {/* 3D Asset */}
                <div className="my-auto flex items-center justify-center py-2">
                  <img
                    src={whoForCounselorImg}
                    alt="Counselor Tray 3D"
                    className="who-audience-visual w-[94%] max-h-[235px] object-contain drop-shadow-2xl"
                  />
                </div>

                {/* Chips Row */}
                <div className="grid grid-cols-3 gap-2 mt-auto pt-4 border-t border-[#e1edff]">
                  <div className="flex items-center gap-1.5 rounded-xl bg-white/90 px-2 py-2 text-[10px] font-bold text-[#2d3748] border border-white">
                    <PremiumPacketIcon className="w-3.5 h-3.5 text-[#01a995] shrink-0" />
                    <span className="truncate">Packet-ready</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-xl bg-white/90 px-2 py-2 text-[10px] font-bold text-[#2d3748] border border-white">
                    <PremiumPathMatchIcon className="w-3.5 h-3.5 text-[#01a995] shrink-0" />
                    <span className="truncate">Probable mappings</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-xl bg-white/90 px-2 py-2 text-[10px] font-bold text-[#2d3748] border border-white">
                    <PremiumHelpIcon className="w-3.5 h-3.5 text-[#01a995] shrink-0" />
                    <span className="truncate">Open requirements</span>
                  </div>
                </div>
              </div>

              {/* Teams Card */}
              <div className="who-support-card flex items-center gap-4 overflow-hidden rounded-[24px] bg-[#f0fbf7] p-5 border border-[#d9f2e9] shadow-sm relative min-h-[125px]">
                <img
                  src={whoForTeamsImg}
                  alt="Teams School 3D"
                  className="w-20 h-20 shrink-0 object-contain drop-shadow-lg"
                />
                <div className="flex-1 pr-2">
                  <h4 className="text-sm font-[800] text-[#0a175a] mb-0.5">School support teams</h4>
                  <div className="text-[10.5px] font-bold text-[#01a995] mb-1">
                    Receive a clearer starting point.
                  </div>
                  <p className="text-[10.5px] leading-snug text-[#526079] font-[500]">
                    Use the student-provided planning packet as context for intake, placement
                    review, and the questions that still require a school decision.
                  </p>
                </div>
                <a
                  href="#trust-product"
                  aria-label="Review ScholaPort evidence and safeguards"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d9f2e9] text-[#01a995] hover:bg-[#01a995] hover:text-white transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES BENTO SECTION */}
      <section id="features" className="mx-auto w-full max-w-[1400px] px-6 py-24 md:px-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#3b82f6]/15 px-4 py-1.5 mb-6 border border-[#3b82f6]/20 backdrop-blur-sm">
          <PremiumDocumentsIcon className="w-3.5 h-3.5 text-[#3b82f6]" />
          <span className="text-[0.68rem] font-[800] uppercase tracking-wider text-[#3b82f6]">
            FEATURES & CAPABILITIES
          </span>
        </div>

        <div className="mb-16">
          <h2 className="text-[clamp(1.9rem,3.4vw,3.1rem)] font-[800] leading-[1.15] tracking-[-0.04em] text-[#0a175a]">
            From records to a clear route.
            <br />
            All in ScholaPort.
          </h2>
          <p className="mt-4 max-w-2xl text-[1.1rem] leading-[1.6] text-[#69758d] font-[500]">
            One connected workspace for students to review their record, understand the destination
            framework, and prepare for more productive counselor conversations.
          </p>
        </div>

        <div ref={bentoGridRef} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Transcript Review (2x2) */}
          <article className="bento-card bento-anchor col-span-1 md:col-span-2 lg:row-span-2 lg:col-span-2 flex flex-col justify-between overflow-hidden rounded-[24px] bg-[#0a175a] p-8 lg:p-10 text-white relative">
            <div className="z-10 w-full md:max-w-[60%]">
              <span className="text-[0.65rem] font-[900] uppercase tracking-[0.14em] text-[#01a995] mb-4 block">
                TRANSCRIPT REVIEW
              </span>
              <h3 className="text-3xl lg:text-4xl font-[800] leading-[1.15] tracking-[-0.02em] mb-4">
                Review the record
                <br />
                before it moves forward.
              </h3>
              <p className="text-[#a5b4c9] text-sm lg:text-base leading-relaxed mb-8 max-w-sm">
                Upload, map, and confirm every course so nothing gets missed.
              </p>

              <ul className="space-y-4 text-sm text-[#d4dfed]">
                <li className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-[#01a995]">
                    <PremiumCheckCircleIcon className="w-4 h-4" />
                  </div>
                  Map courses to requirements
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-[#01a995]">
                    <PremiumWarningIcon className="w-4 h-4" />
                  </div>
                  Detect gaps and mismatches
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-[#01a995]">
                    <PremiumShieldIcon className="w-4 h-4" />
                  </div>
                  Lock in an accurate record
                </li>
              </ul>
            </div>

            <img
              src={bentoTranscript}
              alt="Transcript Upload"
              className="absolute -right-12 md:-right-4 top-1/2 -translate-y-1/2 w-[75%] md:w-[55%] lg:w-[48%] object-contain drop-shadow-2xl z-0 pointer-events-none opacity-30 md:opacity-100"
            />

            <div className="z-10 mt-12 self-start rounded-[16px] border border-white/10 bg-[#07113f]/80 p-5 backdrop-blur-md">
              <div className="text-[10px] font-[800] uppercase tracking-widest text-[#a5b4c9] mb-3">
                REVIEW STATUS
              </div>
              <div className="flex gap-6 mb-4">
                <div className="text-center">
                  <div className="text-xl font-bold">5</div>
                  <div className="text-[10px] text-[#a5b4c9]">Mapped</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">5</div>
                  <div className="text-[10px] text-[#a5b4c9]">Matched</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">5</div>
                  <div className="text-[10px] text-[#a5b4c9]">Confirmed</div>
                </div>
              </div>
              <a
                href={appHref("/app/gaps")}
                className="block w-full rounded-full bg-[#01a995] py-2 text-center text-xs font-bold text-white transition-colors hover:bg-[#018b7a]"
              >
                View gap analysis &rarr;
              </a>
            </div>
          </article>

          {/* Gap Analysis (1x2) */}
          <article className="bento-card bento-capability col-span-1 lg:row-span-2 flex flex-col justify-between overflow-hidden rounded-[24px] bg-[#fff6f0] p-8 text-[#0a175a] relative">
            <div className="z-10">
              <span className="text-[0.65rem] font-[900] uppercase tracking-[0.14em] text-[#ff7a59] mb-4 block">
                GAP ANALYSIS
              </span>
              <h3 className="text-2xl font-[800] leading-[1.15] tracking-[-0.02em] mb-6">
                See what looks satisfied, missing, or unclear.
              </h3>
              <div className="space-y-4 bg-white/60 p-4 rounded-2xl backdrop-blur-sm border border-white/80">
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#01a995] text-white">
                    <PremiumCheckCircleIcon className="w-3 h-3" />
                  </div>
                  <div>
                    <div className="font-bold text-sm leading-tight">16.5</div>
                    <div className="text-[10px] text-[#69758d]">Likely earned</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ffb703] text-white">
                    <PremiumWarningIcon className="w-3 h-3" />
                  </div>
                  <div>
                    <div className="font-bold text-sm leading-tight">5</div>
                    <div className="text-[10px] text-[#69758d]">Missing credits</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ff7a59] text-white">
                    <PremiumHelpIcon className="w-3 h-3" />
                  </div>
                  <div>
                    <div className="font-bold text-sm leading-tight">1</div>
                    <div className="text-[10px] text-[#69758d]">Review items</div>
                  </div>
                </div>
              </div>
            </div>

            <img
              src={bentoGap}
              alt="Gap Analysis"
              className="absolute -right-[15%] md:right-[-8%] -bottom-4 md:bottom-6 w-[130%] md:w-[110%] object-contain drop-shadow-xl z-0 pointer-events-none opacity-30 md:opacity-100"
            />

            <a
              href={appHref("/app/gaps")}
              className="z-10 mt-48 w-max rounded-full bg-white px-5 py-2 text-xs font-bold text-[#0a175a] shadow-sm transition-shadow hover:shadow-md border border-[#f0e6e0]"
            >
              Open gap analysis &rarr;
            </a>
          </article>

          {/* Make Pori your own (1x1) */}
          <article className="bento-card bento-capability col-span-1 flex flex-col justify-between overflow-hidden rounded-[24px] bg-[#f0fbf7] p-8 text-[#0a175a] relative">
            <div className="z-10 w-[70%] md:w-1/2">
              <span className="text-[0.65rem] font-[900] uppercase tracking-[0.14em] text-[#01a995] mb-2 block">
                Your companion
              </span>
              <h3 className="text-xl font-[800] leading-[1.15] tracking-[-0.02em] mb-4">
                Make Pori your own
              </h3>
              <ul className="space-y-2 text-[11px] font-[600] text-[#4a5568]">
                {["Base", "Expression", "Head", "Accessory", "Detail"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#01a995] text-white">
                      <PremiumCheckCircleIcon className="w-2.5 h-2.5" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <img
              src={poriMascot}
              alt="Pori Customization"
              className="absolute -right-4 md:right-0 -bottom-4 md:-bottom-2 w-[70%] md:w-[60%] object-contain drop-shadow-lg z-0 pointer-events-none opacity-30 md:opacity-100"
            />
          </article>

          {/* Academic Roadmap (1x1) */}
          <article className="bento-card bento-capability col-span-1 flex flex-col justify-between overflow-hidden rounded-[24px] bg-[#f0fbf7] p-8 text-[#0a175a] relative">
            <div className="z-10 relative">
              <span className="text-[0.65rem] font-[900] uppercase tracking-[0.14em] text-[#01a995] mb-2 block">
                ACADEMIC ROADMAP
              </span>
              <h3 className="text-xl font-[800] leading-[1.15] tracking-[-0.02em] mb-2">
                Move one clear step at a time.
              </h3>
              <p className="text-xs text-[#69758d] mb-4 max-w-[80%] leading-relaxed font-[500]">
                Resolve the local elective, then unlock the remaining schedule.
              </p>
              <div className="inline-block rounded-full bg-[#d9f2e9] px-3 py-1 text-[10px] font-[800] text-[#01a995]">
                Next: Local Elective
              </div>
            </div>
            <img
              src={bentoRoadmap}
              alt="Academic Roadmap"
              className="absolute -right-12 md:-right-6 -bottom-12 md:-bottom-6 w-[140%] md:w-[120%] object-contain drop-shadow-xl z-0 pointer-events-none opacity-30 md:opacity-100"
            />
            <a
              href={appHref("/app/roadmap")}
              className="z-10 mt-20 w-max rounded-full bg-white px-5 py-2 text-xs font-bold text-[#0a175a] shadow-sm transition-shadow hover:shadow-md border border-[#e2ede9]"
            >
              View roadmap &rarr;
            </a>
          </article>

          {/* Counselor Packet (1x1) */}
          <article className="bento-card bento-capability col-span-1 flex flex-col justify-between overflow-hidden rounded-[24px] bg-[#f0f6ff] p-8 text-[#0a175a] relative">
            <div className="z-10 w-[85%] md:w-2/3">
              <span className="text-[0.65rem] font-[900] uppercase tracking-[0.14em] text-[#3b82f6] mb-2 block">
                COUNSELOR PACKET
              </span>
              <h3 className="text-xl font-[800] leading-[1.15] tracking-[-0.02em] mb-3">
                A printable packet that's ready when you are.
              </h3>
              <p className="text-[11px] font-[500] text-[#69758d] mb-12">
                Summarize the plan, mapping, gaps, and next steps.
              </p>
            </div>
            <img
              src={bentoPacket}
              alt="Counselor Packet"
              className="absolute -right-10 md:-right-6 -bottom-10 md:-bottom-6 w-[90%] md:w-[75%] object-contain drop-shadow-xl z-0 pointer-events-none opacity-30 md:opacity-100"
            />
            <a
              href={appHref("/app/packet")}
              className="z-10 mt-auto w-max rounded-full bg-white px-4 py-2 text-xs font-bold text-[#0a175a] shadow-sm transition-shadow hover:shadow-md border border-[#e2ebf5] flex items-center gap-2"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              Print / Save PDF
            </a>
          </article>

          {/* Academic Passport (1x1) */}
          <article className="bento-card bento-capability col-span-1 flex flex-col justify-between overflow-hidden rounded-[24px] bg-[#f0fbf7] p-8 text-[#0a175a] relative">
            <div className="z-10 w-[85%] md:w-3/5">
              <span className="text-[0.65rem] font-[900] uppercase tracking-[0.14em] text-[#01a995] mb-2 block">
                ACADEMIC PASSPORT
              </span>
              <h3 className="text-xl font-[800] leading-[1.15] tracking-[-0.02em] mb-2">
                One template, made personal.
              </h3>
              <p className="text-[10px] font-[500] text-[#69758d] mb-6">
                Customize appearance and personal details.
              </p>

              <div className="space-y-3 mb-8 bg-white/70 backdrop-blur-sm p-3 rounded-[14px] border border-white">
                <div className="flex items-center justify-between text-[9px] font-bold">
                  Cover color
                  <div className="flex gap-1.5">
                    {["#0a175a", "#01a995", "#ff7a59", "#ffb703"].map((c) => (
                      <div
                        key={c}
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: c }}
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between text-[9px] font-bold">
                  Accent color
                  <div className="flex gap-1.5">
                    {["#0a175a", "#01a995", "#ff7a59", "#ffb703"].map((c) => (
                      <div
                        key={c}
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: c }}
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between text-[9px] font-bold">
                  Icon style
                  <div className="flex gap-1.5">
                    <div className="w-4 h-4 rounded-[4px] border-[1.5px] border-[#01a995] flex items-center justify-center bg-[#f0fbf7]">
                      <img src={poriMascot} className="w-3" />
                    </div>
                    <div className="w-4 h-4 rounded-[4px] bg-white border border-gray-200 flex items-center justify-center text-[8px] text-gray-400">
                      ★
                    </div>
                    <div className="w-4 h-4 rounded-[4px] bg-white border border-gray-200 flex items-center justify-center text-[8px] text-gray-400">
                      ★
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <img
              src={bentoPassport}
              alt="Academic Passport"
              className="absolute -right-16 md:-right-8 top-1/2 -translate-y-1/2 w-[85%] md:w-[68%] lg:w-[72%] max-h-[115%] object-contain drop-shadow-2xl z-0 pointer-events-none scale-110 opacity-30 md:opacity-100"
            />
            <a
              href={appHref("/app/profile")}
              className="z-10 mt-auto w-max rounded-full bg-white px-4 py-2 text-xs font-bold text-[#0a175a] shadow-sm transition-shadow hover:shadow-md border border-[#e2ede9]"
            >
              Customize Passport &rarr;
            </a>
          </article>

          {/* Level Progression (2x1) */}
          <article className="bento-card bento-capability col-span-1 md:col-span-2 overflow-hidden rounded-[24px] bg-[#07184f] p-8 text-white relative flex flex-col justify-between">
            <div className="z-10 mb-2 max-w-sm">
              <span className="text-[0.65rem] font-[900] uppercase tracking-[0.14em] text-[#01a995] mb-2 block">
                LEVEL PROGRESSION
              </span>
              <h3 className="text-2xl font-[800] leading-[1.15] tracking-[-0.02em] mb-2">
                Each rank follows real work.
              </h3>
              <p className="text-[#a5b4c9] text-xs font-[500]">
                Complete tasks, earn ranks, and unlock new milestones.
              </p>
            </div>

            <img
              src={bentoProgression}
              alt="Level Progression Timeline"
              className="w-[95%] md:w-[88%] mx-auto -mb-6 mt-4 object-contain pointer-events-none self-center"
            />
          </article>
        </div>
      </section>

      {/* PROCESS SECTION */}
      <section
        id="how-it-works"
        className="motion-process mx-auto w-full max-w-[1400px] px-6 py-24 md:px-10"
      >
        {/* PROCESS BADGE */}
        <div className="inline-flex items-center gap-2 rounded-full bg-[#01a995]/15 px-4 py-1.5 mb-6 border border-[#01a995]/20 backdrop-blur-sm">
          <PremiumRoadmapIcon className="w-3.5 h-3.5 text-[#01a995]" />
          <span className="text-[0.68rem] font-[800] uppercase tracking-wider text-[#01a995]">
            STUDENT-FIRST PROCESS
          </span>
        </div>

        {/* HEADING — centered, 3 lines */}
        <div className="mb-16 text-center">
          <h2 className="text-[clamp(1.9rem,3.4vw,3.1rem)] font-[800] leading-[1.15] tracking-[-0.04em] text-[#0a175a]">
            A student-first planning process
            <br />
            built to turn transcripts into clearer routes{" "}
            <img
              src={customAsset7}
              alt=""
              className="inline-block h-[1.15em] w-auto object-contain align-middle pointer-events-none"
            />
          </h2>
          <p className="mt-2 text-[clamp(1.9rem,3.4vw,3.1rem)] font-[600] leading-[1.15] tracking-[-0.04em] text-[#8e98a8]">
            and more confident{" "}
            <img
              src={customAsset8}
              alt=""
              className="inline-block h-[1.15em] w-auto object-contain align-middle pointer-events-none"
            />{" "}
            next steps
          </p>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <article
            className="motion-process-card flex flex-col bg-[#f0fbf7] rounded-[20px] border border-[#d9f2e9] overflow-hidden"
            style={{ minHeight: 360 }}
          >
            <div className="p-6 pb-0">
              <div className="font-[800] text-[#01a995] text-lg mb-1 tracking-tight">01</div>
              <h3 className="font-[800] text-[#0a175a] text-[1.35rem] leading-tight tracking-[-0.02em] mb-3">
                Upload transcript
              </h3>
              <p className="text-[#59647a] text-[0.9rem] leading-[1.5] font-[500]">
                Add your academic record securely so Scholaport can prepare it for review.
              </p>
            </div>
            <div className="flex-1 flex items-end justify-center px-4 pb-2 pt-4 min-h-[200px]">
              <img
                src={customAsset3}
                alt="Upload transcript 3D"
                className="w-auto max-h-[200px] object-contain drop-shadow-xl"
              />
            </div>
          </article>

          {/* Card 2 */}
          <article
            className="motion-process-card flex flex-col bg-[#f0f6ff] rounded-[20px] border border-[#e1edff] overflow-hidden"
            style={{ minHeight: 360 }}
          >
            <div className="p-6 pb-0">
              <div className="font-[800] text-[#01a995] text-lg mb-1 tracking-tight">02</div>
              <h3 className="font-[800] text-[#0a175a] text-[1.35rem] leading-tight tracking-[-0.02em] mb-3">
                Review probable mappings
              </h3>
              <p className="text-[#59647a] text-[0.9rem] leading-[1.5] font-[500]">
                Review how confirmed courses may correspond to the destination framework, including
                confidence and counselor-review indicators.
              </p>
            </div>
            <div className="flex-1 flex items-end justify-center px-4 pb-2 pt-4 min-h-[200px]">
              <img
                src={customAsset1}
                alt="Review probable mappings 3D"
                className="w-auto max-h-[200px] object-contain drop-shadow-xl"
              />
            </div>
          </article>

          {/* Card 3 */}
          <article
            className="motion-process-card flex flex-col bg-[#fff8ec] rounded-[20px] border border-[#ffeed4] overflow-hidden"
            style={{ minHeight: 360 }}
          >
            <div className="p-6 pb-0">
              <div className="font-[800] text-[#01a995] text-lg mb-1 tracking-tight">03</div>
              <h3 className="font-[800] text-[#0a175a] text-[1.35rem] leading-tight tracking-[-0.02em] mb-3">
                Find graduation gaps
              </h3>
              <p className="text-[#59647a] text-[0.9rem] leading-[1.5] font-[500]">
                Spot what is satisfied, missing, or still unclear against destination requirements.
              </p>
            </div>
            <div className="flex-1 flex items-end justify-center px-4 pb-2 pt-4 min-h-[200px]">
              <img
                src={customAsset2}
                alt="Find graduation gaps 3D"
                className="w-auto max-h-[200px] object-contain drop-shadow-xl"
              />
            </div>
          </article>

          {/* Card 4 */}
          <article
            className="motion-process-card flex flex-col bg-[#f0fbf7] rounded-[20px] border border-[#d9f2e9] overflow-hidden"
            style={{ minHeight: 360 }}
          >
            <div className="p-6 pb-0">
              <div className="font-[800] text-[#01a995] text-lg mb-1 tracking-tight">04</div>
              <h3 className="font-[800] text-[#0a175a] text-[1.35rem] leading-tight tracking-[-0.02em] mb-3">
                Build your next route
              </h3>
              <p className="text-[#59647a] text-[0.9rem] leading-[1.5] font-[500]">
                Turn results into a roadmap and a counselor-ready packet you can act on.
              </p>
            </div>
            <div className="flex-1 flex items-end justify-center px-4 pb-2 pt-4 min-h-[200px]">
              <img
                src={customAsset6}
                alt="Build your next route 3D"
                className="w-auto max-h-[200px] object-contain drop-shadow-xl"
              />
            </div>
          </article>
        </div>

        {/* TIMELINE */}
        <div ref={timelineRef} className="hidden lg:grid grid-cols-4 gap-4 mt-6 relative w-full">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className="relative flex flex-col items-center justify-start h-12 w-full pt-[2px]"
            >
              {/* Vertical tick above dot */}
              <div className="gs-v-line w-[1.5px] h-3 bg-[#01a995] mb-1 transform origin-top" />
              {/* Dot */}
              <svg
                className="w-[22px] h-[22px] flex-shrink-0 gs-dot relative z-10"
                viewBox="0 0 24 24"
                fill="none"
                style={{ overflow: "visible" }}
              >
                <circle cx="12" cy="12" r="10" fill="#fffdf8" stroke="#01a995" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="4" fill="#01a995" />
              </svg>
              {/* Horizontal line + arrow to next */}
              {step < 4 && (
                <div className="gs-h-line absolute left-1/2 top-[29px] h-[1.5px] bg-[#01a995] w-[calc(100%+1rem)] origin-left z-0">
                  <div className="gs-arrow absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-[#ffffff] px-[4px]">
                    <ChevronRight size={17} strokeWidth={3} color="#01a995" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* TRUST IS PART OF THE PRODUCT - BENTO DESIGN (1:1 EXACT REPLICA OF ATTACHED DESIGN 6c778235-46df-4290-8938-57106f406438.png) */}
      <section
        id="trust-product"
        className="motion-trust mx-auto w-full max-w-[1400px] px-4 py-20 md:px-8"
      >
        {/* MASTER BENTO DASHBOARD CONTAINER */}
        <div className="w-full rounded-[32px] md:rounded-[40px] bg-white p-6 sm:p-10 md:p-12 border border-[#e2ece8] shadow-[0_15px_60px_rgba(10,23,90,0.05)] font-sans">
          {/* ROW 1: TOP SECTION (LEFT TEXT & 4 STAT CARDS, RIGHT DARK MAP CARD) */}
          <div className="motion-trust-row grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-8">
            {/* LEFT COLUMN: EYEBROW, HEADLINE, BODY, AND 4 STAT CARDS */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                {/* EYEBROW */}
                <div className="inline-flex items-center gap-2 text-xs font-[800] uppercase tracking-wider text-[#01a995] mb-4">
                  <span className="text-[#01a995]">✦</span>
                  <span>TRUST IS PART OF THE PRODUCT</span>
                </div>

                {/* HEADLINE */}
                <h2 className="text-[clamp(2.2rem,4vw,3.4rem)] font-[800] leading-[1.08] tracking-[-0.035em] text-[#0a175a] mb-5">
                  Source-backed when known.
                  <br />
                  Explicit when uncertain.
                </h2>

                {/* BODY PARAGRAPH */}
                <p className="text-[0.92rem] leading-[1.65] text-[#526079] font-[500] max-w-2xl mb-8">
                  Education rules change by curriculum, jurisdiction, cohort, and year. ScholaPort
                  does not ask an AI model to invent a universal equivalency. Supported academic
                  claims are connected to reviewed reference data, probable mappings remain open to
                  review, and missing coverage stays visible instead of being replaced with
                  confident guesses.
                </p>
              </div>

              {/* 4 STAT CARDS ROW */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
                {/* Card 1 */}
                <div className="p-4 rounded-[20px] bg-white border border-[#d9f2e9] shadow-[0_2px_10px_rgba(10,23,90,0.02)] flex flex-col justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#e6f7f3] border border-[#c3ede3] flex items-center justify-center text-[#01a995] mb-4">
                    <PremiumDatabaseIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-3xl font-[900] text-[#0a175a] tracking-tight mb-1">86</div>
                    <div className="text-[0.72rem] font-[700] text-[#526079] leading-[1.3]">
                      Imported
                      <br />
                      source records
                    </div>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="p-4 rounded-[20px] bg-white border border-[#d9f2e9] shadow-[0_2px_10px_rgba(10,23,90,0.02)] flex flex-col justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#e6f7f3] border border-[#c3ede3] flex items-center justify-center text-[#01a995] mb-4">
                    <PremiumTargetIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-3xl font-[900] text-[#0a175a] tracking-tight mb-1">4</div>
                    <div className="text-[0.72rem] font-[700] text-[#526079] leading-[1.3]">
                      Beta source
                      <br />
                      curricula
                    </div>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="p-4 rounded-[20px] bg-white border border-[#d9f2e9] shadow-[0_2px_10px_rgba(10,23,90,0.02)] flex flex-col justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#e6f7f3] border border-[#c3ede3] flex items-center justify-center text-[#01a995] mb-4">
                    <PremiumBuildingIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-3xl font-[900] text-[#0a175a] tracking-tight mb-1">2</div>
                    <div className="text-[0.72rem] font-[700] text-[#526079] leading-[1.3]">
                      Destination
                      <br />
                      frameworks
                    </div>
                  </div>
                </div>

                {/* Card 4 */}
                <div className="p-4 rounded-[20px] bg-white border border-[#d9f2e9] shadow-[0_2px_10px_rgba(10,23,90,0.02)] flex flex-col justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#e6f7f3] border border-[#c3ede3] flex items-center justify-center text-[#01a995] mb-4">
                    <PremiumDocumentsIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-3xl font-[900] text-[#0a175a] tracking-tight mb-1">19</div>
                    <div className="text-[0.72rem] font-[700] text-[#526079] leading-[1.3]">
                      Modeled destination
                      <br />
                      requirements
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: DARK MAP VISUAL CARD */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="w-full flex items-center justify-center">
                <img
                  src={trustMapSection}
                  alt="Beta 1.0 Coverage Map"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>

          {/* ROW 2: NOTICE BAR (RIPPLED BORDER BOX WITH GLOBE ICON) */}
          <div className="motion-trust-row rounded-[22px] bg-[#f0fbf7] border border-[#d9f2e9] p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-white border border-[#d9f2e9] flex items-center justify-center text-[#01a995] shrink-0 shadow-sm">
                <PremiumGlobeIcon className="w-5 h-5" />
              </div>
              <div className="text-xs text-[#0a175a] font-[600] leading-relaxed">
                <strong className="font-[800] text-sm text-[#0a175a] block mb-0.5">
                  20 countries exist in the research inventory.
                </strong>
                <span className="text-[#526079]">
                  Beta 1.0 coverage is limited to the verified routes shown here.
                </span>
              </div>
            </div>
            {/* Subtle Dot Pattern Decorative Grid */}
            <div className="hidden md:flex gap-1 opacity-25 shrink-0">
              <div className="grid grid-cols-4 gap-1">
                {[...Array(12)].map((_, i) => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#01a995]" />
                ))}
              </div>
            </div>
          </div>

          {/* ROW 3: OUR EVIDENCE METHODOLOGY (4-STEP HORIZONTAL PIPELINE) */}
          <div className="motion-trust-row grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8 items-stretch">
            {/* LEFT BANNER CARD */}
            <div className="lg:col-span-3 rounded-[22px] bg-[#02132b] p-6 text-white flex flex-col justify-between border border-[#0d2847] shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#01a995] mb-6">
                <PremiumVerifiedIcon className="w-4 h-4 text-[#01a995]" />
              </div>
              <div>
                <h3 className="text-lg font-[800] leading-tight text-white mb-3">
                  Our evidence
                  <br />
                  methodology
                </h3>
                <p className="text-[0.76rem] leading-relaxed text-white/70 font-[450]">
                  A four-step process that keeps academic planning trustworthy, transparent, and
                  reviewable.
                </p>
              </div>
            </div>

            {/* RIGHT 4 PIPELINE STEP CARDS CONNECTED BY DASHED ARROW LINE */}
            <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 relative">
              {/* Step 1 */}
              <div className="p-5 rounded-[22px] bg-white border border-[#d9f2e9] shadow-[0_2px_10px_rgba(10,23,90,0.02)] flex flex-col justify-between relative">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-xl bg-[#e6f7f3] border border-[#c3ede3] flex items-center justify-center text-[#01a995]">
                      <PremiumSearchIcon className="w-4 h-4" />
                    </div>
                    <span className="w-6 h-6 rounded-full bg-[#01a995] text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                      1
                    </span>
                  </div>
                  <h4 className="text-sm font-[800] text-[#0a175a] mb-2">
                    Research the jurisdiction
                  </h4>
                  <p className="text-[0.73rem] leading-relaxed text-[#526079] font-[500]">
                    Collect official curricula, policies, and authoritative guidance for the source
                    jurisdiction.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-5 rounded-[22px] bg-white border border-[#d9f2e9] shadow-[0_2px_10px_rgba(10,23,90,0.02)] flex flex-col justify-between relative">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-xl bg-[#e6f7f3] border border-[#c3ede3] flex items-center justify-center text-[#01a995]">
                      <PremiumLinkCircleIcon className="w-4 h-4" />
                    </div>
                    <span className="w-6 h-6 rounded-full bg-[#01a995] text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                      2
                    </span>
                  </div>
                  <h4 className="text-sm font-[800] text-[#0a175a] mb-2">
                    Connect claims to evidence
                  </h4>
                  <p className="text-[0.73rem] leading-relaxed text-[#526079] font-[500]">
                    Map academic claims to reviewed source records with citations and effective
                    dates.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-5 rounded-[22px] bg-white border border-[#d9f2e9] shadow-[0_2px_10px_rgba(10,23,90,0.02)] flex flex-col justify-between relative">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-xl bg-[#e6f7f3] border border-[#c3ede3] flex items-center justify-center text-[#01a995]">
                      <PremiumGapIcon className="w-4 h-4" />
                    </div>
                    <span className="w-6 h-6 rounded-full bg-[#01a995] text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                      3
                    </span>
                  </div>
                  <h4 className="text-sm font-[800] text-[#0a175a] mb-2">
                    Mark the coverage state
                  </h4>
                  <p className="text-[0.73rem] leading-relaxed text-[#526079] font-[500]">
                    Label as supported, probable, or missing so uncertainty is visible at every
                    step.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-5 rounded-[22px] bg-white border border-[#d9f2e9] shadow-[0_2px_10px_rgba(10,23,90,0.02)] flex flex-col justify-between relative">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-xl bg-[#e6f7f3] border border-[#c3ede3] flex items-center justify-center text-[#01a995]">
                      <PremiumProfileIcon className="w-4 h-4" />
                    </div>
                    <span className="w-6 h-6 rounded-full bg-[#01a995] text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                      4
                    </span>
                  </div>
                  <h4 className="text-sm font-[800] text-[#0a175a] mb-2">Preserve human review</h4>
                  <p className="text-[0.73rem] leading-relaxed text-[#526079] font-[500]">
                    Route to students and counselors for confirmation and final decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ROW 4: BOTTOM DASHBOARD ROW (3 TRUST CARDS + CURRENT BETA 1.0 PLANNING SCOPE CARD) */}
          <div className="motion-trust-row grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {/* Card 1: Private by default */}
            <div className="lg:col-span-3 bg-[#f0fbf7]/60 border border-[#d9f2e9] p-5 rounded-[22px] flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-white border border-[#d9f2e9] flex items-center justify-center text-[#01a995] mb-4 shadow-sm">
                  <PremiumLockIcon className="w-4 h-4" />
                </div>
                <h4 className="text-base font-[800] text-[#0a175a] mb-2">Private by default</h4>
                <p className="text-[0.73rem] text-[#526079] leading-relaxed font-[500]">
                  Academic records and transcript files are stored through authenticated,
                  user-scoped access rather than being made publicly visible.
                </p>
              </div>
            </div>

            {/* Card 2: Student-confirmed evidence */}
            <div className="lg:col-span-3 bg-[#f0fbf7]/60 border border-[#d9f2e9] p-5 rounded-[22px] flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-white border border-[#d9f2e9] flex items-center justify-center text-[#01a995] mb-4 shadow-sm">
                  <PremiumVerifiedIcon className="w-4 h-4" />
                </div>
                <h4 className="text-base font-[800] text-[#0a175a] mb-2">
                  Student-confirmed evidence
                </h4>
                <p className="text-[0.73rem] text-[#526079] leading-relaxed font-[500]">
                  Extracted and translated course information remains editable until the student
                  reviews and confirms it. Only confirmed course records move into mapping and
                  planning.
                </p>
              </div>
              <div className="w-7 h-[3px] bg-[#01a995] rounded-full mt-4" />
            </div>

            {/* Card 3: The school decides */}
            <div className="lg:col-span-3 bg-[#f0fbf7]/60 border border-[#d9f2e9] p-5 rounded-[22px] flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-white border border-[#d9f2e9] flex items-center justify-center text-[#01a995] mb-4 shadow-sm">
                  <PremiumBuildingIcon className="w-4 h-4" />
                </div>
                <h4 className="text-base font-[800] text-[#0a175a] mb-2">The school decides</h4>
                <p className="text-[0.73rem] text-[#526079] leading-relaxed font-[500]">
                  ScholaPort organizes evidence, probable mappings, open requirements, and prepared
                  questions. The receiving school or counselor makes all final credit, placement,
                  and graduation decisions.
                </p>
              </div>
              <div className="w-7 h-[3px] bg-[#01a995] rounded-full mt-4" />
            </div>

            {/* Card 4: Current Beta 1.0 planning scope */}
            <div className="lg:col-span-3 bg-[#02132b] text-white p-5 rounded-[22px] flex flex-col justify-between border border-[#0d2847] shadow-sm">
              <div>
                <h4 className="text-sm font-[800] text-white mb-3">
                  Current Beta 1.0 planning scope
                </h4>

                <div className="mb-3">
                  <div className="text-[0.66rem] font-[700] text-[#01a995] uppercase tracking-wider mb-2">
                    Source curricula
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="p-2 rounded-lg bg-white/10 border border-white/15 text-[0.68rem] font-bold flex items-center gap-1">
                      <PremiumCheckCircleIcon className="w-3 h-3 text-[#01a995] shrink-0" />
                      <span className="truncate">Tamil Nadu SSLC</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white/10 border border-white/15 text-[0.68rem] font-bold flex items-center gap-1">
                      <PremiumCheckCircleIcon className="w-3 h-3 text-[#01a995] shrink-0" />
                      <span className="truncate">Tamil Nadu HSC</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white/10 border border-white/15 text-[0.68rem] font-bold flex items-center gap-1">
                      <PremiumCheckCircleIcon className="w-3 h-3 text-[#01a995] shrink-0" />
                      <span className="truncate">Andhra Pradesh SSC</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white/10 border border-white/15 text-[0.68rem] font-bold flex items-center gap-1">
                      <PremiumCheckCircleIcon className="w-3 h-3 text-[#01a995] shrink-0" />
                      <span className="truncate">Andhra Pradesh Intermediate</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[0.66rem] font-[700] text-[#01a995] uppercase tracking-wider mb-2">
                    Destination frameworks
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="p-2 rounded-lg bg-white/10 border border-white/15 text-[0.68rem] font-bold flex items-center gap-1">
                      <PremiumCheckCircleIcon className="w-3 h-3 text-[#01a995] shrink-0" />
                      <span>Georgia</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white/10 border border-white/15 text-[0.68rem] font-bold flex items-center gap-1">
                      <PremiumCheckCircleIcon className="w-3 h-3 text-[#01a995] shrink-0" />
                      <span>Texas</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ROW 5: BOTTOM FLOATING CTA ACTION BUTTON */}
          <div className="flex justify-center mt-10">
            <a
              href={appHref("/app/reference-coverage")}
              className="inline-flex items-center gap-3 bg-white border border-[#d9f2e9] shadow-[0_8px_30px_rgba(10,23,90,0.06)] hover:shadow-xl rounded-full px-8 py-3.5 transition-all text-xs font-[800] text-[#0a175a] hover:-translate-y-0.5"
            >
              <div className="w-6 h-6 rounded-full bg-[#e6f7f3] border border-[#c3ede3] flex items-center justify-center text-[#01a995]">
                <PremiumBookIcon className="w-3.5 h-3.5" />
              </div>
              <span>Explore our evidence and coverage</span>
              <ArrowRight className="w-4 h-4 text-[#01a995]" />
            </a>
          </div>
        </div>
      </section>

      <ReleasePathSection />
      <FaqSection />

      {/* PRIVATE BETA CTA */}
      <section
        id="beta-access"
        className="motion-footer relative w-full bg-[#f6fbf8] px-3 pb-5 pt-6 transform-gpu sm:px-5 sm:pb-7"
      >
        <div className="relative mx-auto w-full max-w-[1400px] overflow-hidden rounded-[30px] bg-[#0a175a] sm:rounded-[44px]">
          <div
            className="motion-footer-scene relative flex min-h-[580px] items-center justify-center overflow-hidden px-4 py-14 sm:px-5 sm:py-16"
            style={{
              backgroundImage: `url(${footerBgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div
              className="motion-footer-landscape absolute -inset-[22%]"
              style={{
                backgroundImage: `url(${footerBgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,23,90,0.12)_0%,rgba(10,23,90,0.55)_55%,#0a175a_100%)]" />
            <div className="motion-footer-content relative z-10 flex w-full justify-center">
              <BetaAccessGateway />
            </div>
          </div>
        </div>
      </section>

      {/* SITE FOOTER */}
      <div className="w-full bg-[#f6fbf8] px-3 sm:px-5">
        <footer className="marketing-footer mx-auto w-full max-w-[1400px] rounded-t-[30px] bg-[#0a175a] px-5 pt-14 sm:rounded-t-[44px] sm:px-10">
          <div className="marketing-shell marketing-footer__grid">
            <div className="marketing-footer__brand">
              <ScholaportLogo className="h-11" showWordmark inverse />
              <p>
                A clear academic passage for students carrying their learning across school systems.
              </p>
            </div>
            <div className="marketing-footer__links">
              <a href="#home">Home</a>
              {marketingSectionLinks.map((item) => (
                <a key={item.href} href={item.href}>
                  {item.label}
                </a>
              ))}
              <a href="#beta-access">Access</a>
            </div>
            <div className="marketing-footer__note">
              <span>Scholaport is a planning workspace.</span>
              <span>Schools retain final academic decision-making.</span>
            </div>
          </div>
          <div className="marketing-footer__wordmark" aria-hidden="true">
            SCHOLAPORT
          </div>
        </footer>
      </div>
    </main>
  );
}
