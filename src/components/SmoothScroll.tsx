"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { getLenis, setLenis } from "@/lib/scroll";
import { getMotion, loadMotion } from "@/motion/gsap";

/**
 * Lenis smooth scroll. Runs on its own rAF until GSAP arrives, then moves onto
 * the GSAP ticker and syncs ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)`).
 * Disabled under prefers-reduced-motion. Resets scroll + triggers on route change.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;
    let rafId = 0;
    let tickerFn: ((time: number) => void) | null = null;
    let alive = true;

    const start = () => {
      if (mq.matches || lenis) return;
      const l = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: false, autoRaf: false });
      lenis = l;
      setLenis(l);
      const loop = (t: number) => {
        l.raf(t);
        rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);
      loadMotion().then(({ gsap, ScrollTrigger }) => {
        if (!alive || lenis !== l) return;
        cancelAnimationFrame(rafId);
        l.on("scroll", ScrollTrigger.update);
        tickerFn = (time: number) => l.raf(time * 1000);
        gsap.ticker.add(tickerFn);
        gsap.ticker.lagSmoothing(0);
      });
    };
    const stop = () => {
      cancelAnimationFrame(rafId);
      if (tickerFn) getMotion()?.gsap.ticker.remove(tickerFn);
      tickerFn = null;
      lenis?.destroy();
      lenis = null;
      setLenis(null);
    };
    const onChange = () => (mq.matches ? stop() : start());

    start();
    mq.addEventListener("change", onChange);
    return () => {
      alive = false;
      mq.removeEventListener("change", onChange);
      stop();
    };
  }, []);

  // On route change: jump to the hash target or the top (through Lenis when
  // active, so it doesn't animate back to its stale position), then re-measure.
  useEffect(() => {
    const jump = () => {
      const hash = window.location.hash.slice(1);
      const el = hash ? document.getElementById(hash) : null;
      const y = el ? el.getBoundingClientRect().top + window.scrollY - 72 : 0;
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo(0, y);
    };
    jump();
    const raf = requestAnimationFrame(jump);
    const id = window.setTimeout(() => {
      getMotion()?.ScrollTrigger.refresh();
      if (window.location.hash) jump();
    }, 150);
    // late layout shifts (fonts, split text) can move hash targets; settle once more
    const late = window.setTimeout(() => window.location.hash && jump(), 700);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(id);
      window.clearTimeout(late);
    };
  }, [pathname]);

  return null;
}
