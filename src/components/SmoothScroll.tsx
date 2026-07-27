import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * SmoothScroll — wraps the entire page in Lenis for butter-smooth
 * momentum / inertial scrolling. Syncs with GSAP ScrollTrigger so all
 * scroll-triggered animations remain perfectly in sync.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
      infinite: false,
    });

    // Keep GSAP ScrollTrigger in sync with Lenis's virtual scroll position
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker for perfectly synced 60/120fps updates
    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateLenis);

    // Disable GSAP's lag smoothing so Lenis has full control
    gsap.ticker.lagSmoothing(0);

    const handleAnchorClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = anchor?.getAttribute("href");
      if (!hash || hash === "#") return;

      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return;

      event.preventDefault();
      window.history.pushState(null, "", hash);

      if (prefersReducedMotion.matches) {
        target.scrollIntoView({ behavior: "auto", block: "start" });
        return;
      }

      const travelDistance = Math.abs(target.getBoundingClientRect().top);
      const travelDuration = Math.min(1.8, Math.max(1.05, 0.95 + travelDistance / 6_000));

      lenis.scrollTo(target, {
        offset: target.id === "home" ? 0 : -88,
        duration: travelDuration,
        easing: (t) => t * t * (3 - 2 * t),
      });
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
      gsap.ticker.remove(updateLenis);
    };
  }, []);

  return <>{children}</>;
}
