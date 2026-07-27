const ARRIVAL_CLASS = "rank-task-target--arrived";

function normalizedTargetId(hash: string) {
  return decodeURIComponent(hash.replace(/^#/, ""));
}

export function focusRankTask(hash: string, behavior?: ScrollBehavior) {
  if (typeof document === "undefined" || !hash) return false;
  const target = document.getElementById(normalizedTargetId(hash));
  if (!target) return false;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({
    behavior: behavior ?? (reducedMotion ? "auto" : "smooth"),
    block: "start",
  });

  const hadTabIndex = target.hasAttribute("tabindex");
  if (!hadTabIndex) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
  target.classList.remove(ARRIVAL_CLASS);
  window.requestAnimationFrame(() => target.classList.add(ARRIVAL_CLASS));

  window.setTimeout(() => {
    target.classList.remove(ARRIVAL_CLASS);
    if (!hadTabIndex && document.activeElement !== target) target.removeAttribute("tabindex");
  }, 1800);

  if (!hadTabIndex) {
    target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
  }
  return true;
}

export function scheduleRankTaskFocus(hash: string, attempts = 30) {
  if (typeof window === "undefined" || !hash) return () => undefined;
  let remaining = attempts;
  let timeout: number | undefined;
  let cancelled = false;
  let stableSamples = 0;
  let previousTop: number | null = null;
  let previousHeight: number | null = null;

  const findTarget = () => {
    if (cancelled) return;
    const target = document.getElementById(normalizedTargetId(hash));
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY;
      const height = document.documentElement.scrollHeight;
      const positionStable =
        previousTop !== null &&
        previousHeight !== null &&
        Math.abs(previousTop - top) < 2 &&
        Math.abs(previousHeight - height) < 2;
      stableSamples = positionStable ? stableSamples + 1 : 0;
      previousTop = top;
      previousHeight = height;

      if (stableSamples >= 2 || remaining <= 1) {
        focusRankTask(hash);
        return;
      }
    }

    remaining -= 1;
    if (remaining > 0) timeout = window.setTimeout(findTarget, 100);
  };

  timeout = window.setTimeout(findTarget, 0);
  return () => {
    cancelled = true;
    if (timeout !== undefined) window.clearTimeout(timeout);
  };
}
