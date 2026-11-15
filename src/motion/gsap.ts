"use client";

import { useEffect, type DependencyList, type RefObject } from "react";
import type { gsap as GSAP } from "gsap";
import type { ScrollTrigger as ST } from "gsap/ScrollTrigger";
import type { SplitText as SPLIT } from "gsap/SplitText";
import type { Flip as FLIP } from "gsap/Flip";

/**
 * GSAP is loaded lazily, off the critical path. Nothing above the fold needs it
 * (hero reveal, preloader and curtain are CSS), so the library is fetched once
 * the intro is done or the visitor first interacts, whichever comes first.
 */

export type Motion = {
  gsap: typeof GSAP;
  ScrollTrigger: typeof ST;
  SplitText: typeof SPLIT;
};

/** Media conditions shared by every animation. */
export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  desktop: "(prefers-reduced-motion: no-preference) and (min-width: 768px)",
  mobile: "(prefers-reduced-motion: no-preference) and (max-width: 767px)",
  fine: "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)",
} as const;

let motion: Motion | null = null;
let gateOpen = false;
let openGate: () => void = () => {};
const gate = new Promise<void>((resolve) => {
  openGate = () => {
    gateOpen = true;
    resolve();
  };
});
let loading: Promise<Motion> | null = null;

if (typeof window !== "undefined") {
  const open = () => {
    if (gateOpen) return;
    openGate();
    for (const ev of ["mem:ready", "wheel", "touchstart", "keydown", "pointerdown"])
      window.removeEventListener(ev, open);
  };
  if (window.__memReady) open();
  for (const ev of ["mem:ready", "wheel", "touchstart", "keydown", "pointerdown"])
    window.addEventListener(ev, open, { passive: true });
}

/** Resolves with GSAP + plugins once the gate is open. */
export function loadMotion(): Promise<Motion> {
  if (motion) return Promise.resolve(motion);
  loading ??= gate
    .then(() =>
      Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("gsap/SplitText")]),
    )
    .then(([g, st, sp]) => {
      g.gsap.registerPlugin(st.ScrollTrigger, sp.SplitText);
      g.gsap.defaults({ ease: "expo.out", duration: 1 });
      motion = { gsap: g.gsap, ScrollTrigger: st.ScrollTrigger, SplitText: sp.SplitText };
      window.dispatchEvent(new Event("motion:ready"));
      return motion;
    });
  return loading;
}

/** The loaded modules, or null if GSAP hasn't arrived yet. */
export const getMotion = () => motion;

/* ------------------------------------------------------------------ *
 * Deferred setup queue: setups run in small time-sliced chunks so no
 * single task gets long. Triggers created after load measure themselves,
 * and ScrollTrigger re-measures on resize/load on its own.
 * ------------------------------------------------------------------ */
const queue: Array<() => void> = [];
let pumping = false;
function pump() {
  const t0 = performance.now();
  while (queue.length && performance.now() - t0 < 10) queue.shift()!();
  if (queue.length) window.setTimeout(pump, 0);
  else pumping = false;
}
function schedule(fn: () => void) {
  queue.push(fn);
  if (!pumping) {
    pumping = true;
    window.setTimeout(pump, 0);
  }
  return () => {
    const i = queue.indexOf(fn);
    if (i >= 0) queue.splice(i, 1);
  };
}

/**
 * Run a GSAP setup once the library is loaded. Everything created inside is
 * recorded in a gsap.context (scoped to `scope`) and reverted on unmount or
 * when `deps` change. The setup may return a cleanup function.
 */
export function useMotion(
  setup: (m: Motion) => void | (() => void),
  opts: { scope?: RefObject<Element | null>; deps?: DependencyList; immediate?: boolean } = {},
) {
  const { scope, deps = [], immediate = false } = opts;
  useEffect(() => {
    let cancelled = false;
    let ctx: gsap.Context | null = null;
    let unqueue = () => {};
    loadMotion().then((m) => {
      if (cancelled) return;
      const run = () => {
        if (cancelled) return;
        ctx = m.gsap.context(() => setup(m), scope?.current ?? undefined);
      };
      if (immediate) run();
      else unqueue = schedule(run);
    });
    return () => {
      cancelled = true;
      unqueue();
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Flip is only needed once someone filters the work grid: load it on demand. */
let flip: typeof FLIP | null = null;
export function loadFlip(): Promise<typeof FLIP> {
  if (flip) return Promise.resolve(flip);
  return Promise.all([loadMotion(), import("gsap/Flip")]).then(([m, f]) => {
    m.gsap.registerPlugin(f.Flip);
    flip = f.Flip;
    return f.Flip;
  });
}
export const getFlip = () => flip;
