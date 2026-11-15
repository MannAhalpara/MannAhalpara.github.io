"use client";

import type Lenis from "lenis";

/** Module-level handle on the active Lenis instance (null under reduced motion). */
let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}
export function getLenis() {
  return lenis;
}

/** Scroll to an element id or the top, using Lenis when available. */
export function scrollToTarget(target: string | number, opts?: { immediate?: boolean }) {
  const el = typeof target === "string" ? document.getElementById(target.replace(/^#/, "")) : null;
  if (typeof target === "string" && !el) return false;
  const offset = typeof target === "string" ? -72 : 0;
  if (lenis) {
    lenis.scrollTo(el ?? (target as number), {
      offset,
      immediate: opts?.immediate,
      duration: 1.4,
      easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    });
  } else {
    const y = el ? el.getBoundingClientRect().top + window.scrollY + offset : (target as number);
    window.scrollTo({ top: y, behavior: opts?.immediate ? "auto" : "smooth" });
  }
  return true;
}
