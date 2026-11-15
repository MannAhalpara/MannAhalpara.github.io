"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    __memReady?: boolean;
  }
}

const MAX_MS = 1800;
/** Shortest run when everything is already loaded (fast connections). */
const MIN_MS = 900;
const PANELS = 6;

/** Signals that the intro is over: the hero reveals and motion code may load. */
export function markIntroDone() {
  if (window.__memReady) return;
  window.__memReady = true;
  document.documentElement.classList.add("hero-in");
  window.dispatchEvent(new Event("mem:ready"));
}

/**
 * First-visit-per-session preloader: dot-matrix 000→100 counter driven by real
 * font + window load progress (capped at 1.8s), then the screen splits along the
 * grid columns (CSS transitions). Click or any key skips it. Hidden by CSS
 * (html.no-preloader) for repeat visits and reduced motion, and by <noscript>
 * when JS is off.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (document.documentElement.classList.contains("no-preloader")) {
      markIntroDone();
      return;
    }

    let fontsDone = false;
    let loadDone = document.readyState === "complete";
    document.fonts?.ready.then(() => (fontsDone = true));
    const onLoad = () => (loadDone = true);
    window.addEventListener("load", onLoad, { once: true });

    const t0 = performance.now();
    let shown = 0;
    let lastN = -1;
    let finished = false;
    let raf = 0;
    const timers: number[] = [];

    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      if (count.current) count.current.textContent = "100";
      if (bar.current) bar.current.style.transform = "scaleX(1)";
      try {
        sessionStorage.setItem("mem-loaded", "1");
      } catch {
        /* ignore */
      }
      el.classList.add("is-done");
      timers.push(window.setTimeout(markIntroDone, 450));
      timers.push(
        window.setTimeout(() => {
          el.style.display = "none";
        }, 1300),
      );
    };

    const step = () => {
      const elapsed = performance.now() - t0;
      const real = (Number(fontsDone) + Number(loadDone)) / 2;
      const time = Math.min(1, elapsed / MIN_MS);
      const target = Math.min(time, 0.3 + real * 0.7);
      shown += (target - shown) * 0.25;
      const n = Math.round(shown * 100);
      if (n !== lastN) {
        lastN = n;
        if (count.current) count.current.textContent = String(n).padStart(3, "0");
        if (bar.current) bar.current.style.transform = `scaleX(${shown})`;
      }
      if ((n >= 99 && real === 1) || elapsed > MAX_MS) return finish();
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    const skip = () => finish();
    window.addEventListener("keydown", skip, { once: true });
    el.addEventListener("click", skip, { once: true });
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener("keydown", skip);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <div ref={root} className="preloader" aria-hidden="true">
      {Array.from({ length: PANELS }, (_, i) => (
        <div
          key={i}
          className="preloader__panel"
          style={{ transitionDelay: `${150 + Math.abs(i - (PANELS - 1) / 2) * 50}ms` }}
        />
      ))}
      <div className="preloader__meta pointer-events-none absolute inset-0 flex flex-col justify-end p-[var(--gutter)] text-[#edebe6]">
        <div className="flex items-end justify-between gap-6">
          <span ref={count} className="dot text-[clamp(72px,18vw,240px)] leading-[0.8]">
            000
          </span>
          <span className="mono pb-2 text-right opacity-70">
            retrieving memory…
            <br />
            click to skip
          </span>
        </div>
        <span className="mt-6 block h-px w-full bg-[#edebe6]/15">
          <span ref={bar} className="block h-px w-full origin-left scale-x-0 bg-[#ff4a1c]" />
        </span>
      </div>
    </div>
  );
}
